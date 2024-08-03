import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let model: Model<OrderDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({}),
            findByIdAndUpdate: jest.fn().mockResolvedValue(null),
            findByIdAndDelete: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    model = module.get<Model<OrderDocument>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create and return an order', async () => {
      const dto = { product: 'product1', quantity: 2 };
      const createdOrder = { _id: '1', ...dto };
      jest.spyOn(model, 'create').mockResolvedValue(createdOrder as any);

      expect(await service.createOrder(dto)).toEqual(createdOrder);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const orders = [{ _id: '1', product: 'product1' }];
      jest.spyOn(model, 'find').mockResolvedValue(orders as any);

      expect(await service.findAll()).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const order = { _id: '1', product: 'product1' };
      jest.spyOn(model, 'findById').mockResolvedValue(order as any);

      expect(await service.findOne('1')).toEqual(order);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrder', () => {
    it('should update and return an order', async () => {
      const dto = { quantity: 3 };
      const updatedOrder = { _id: '1', quantity: 3 };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedOrder as any);

      expect(await service.updateOrder('1', dto)).toEqual(updatedOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(service.updateOrder('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOrder', () => {
    it('should delete and return an order', async () => {
      const deletedOrder = { _id: '1', product: 'product1' };
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(deletedOrder as any);

      expect(await service.deleteOrder('1')).toEqual(deletedOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(service.deleteOrder('1')).rejects.toThrow(NotFoundException);
    });
  });
});
