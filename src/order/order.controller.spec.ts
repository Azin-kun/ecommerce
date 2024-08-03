import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.schema'; 
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';


describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: getModelToken(Order.name), useValue: {} },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto = { user: '1', products: ['1'], totalAmount: 100 };
      await orderController.create(createOrderDto);
      expect(orderService.createOrder).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const result: Order[] = [{ user: new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f1'), products: [new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f2')], totalAmount: 100 }] as Order[];
      jest.spyOn(orderService, 'findAll').mockResolvedValue(result);
      expect(await orderController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const result: Order = { user: new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f1'), products: [new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f2')], totalAmount: 100 } as Order;
      jest.spyOn(orderService, 'findOne').mockResolvedValue(result);
      expect(await orderController.findOne('60c72b2f9b1e8c6f45e847f1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto = { totalAmount: 200 };
      const result: Order = { user: new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f1'), products: [new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f2')], totalAmount: 200 } as Order;
      jest.spyOn(orderService, 'updateOrder').mockResolvedValue(result);
      expect(await orderController.update('60c72b2f9b1e8c6f45e847f1', updateOrderDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete an order', async () => {
      const result: Order = { user: new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f1'), products: [new mongoose.Types.ObjectId('60c72b2f9b1e8c6f45e847f2')], totalAmount: 100 } as Order;
      jest.spyOn(orderService, 'deleteOrder').mockResolvedValue(result);
      expect(await orderController.remove('60c72b2f9b1e8c6f45e847f1')).toBe(result);
    });
  });
});
