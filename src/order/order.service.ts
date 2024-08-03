import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async createOrder(createOrderDto: any): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async updateOrder(id: string, updateOrderDto: any): Promise<Order> {
    const existingOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
    if (!existingOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return existingOrder;
  }

  async deleteOrder(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return deletedOrder;
  }
}
