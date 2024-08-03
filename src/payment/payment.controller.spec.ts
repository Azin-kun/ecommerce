import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './payment.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  const mockPaymentService = {
    createPayment: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updatePayment: jest.fn(),
    deletePayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: getModelToken(Payment.name), useValue: {} },
      ],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentController).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const createPaymentDto = { order: new Types.ObjectId(), amount: 100, paymentMethod: 'Credit Card' };
      await paymentController.create(createPaymentDto);
      expect(paymentService.createPayment).toHaveBeenCalledWith(createPaymentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      const result: Payment[] = [{ order: new Types.ObjectId(), amount: 100, paymentMethod: 'Credit Card' }] as Payment[];
      jest.spyOn(paymentService, 'findAll').mockResolvedValue(result);
      expect(await paymentController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      const result: Payment = { order: new Types.ObjectId(), amount: 100, paymentMethod: 'Credit Card' } as Payment;
      jest.spyOn(paymentService, 'findOne').mockResolvedValue(result);
      expect(await paymentController.findOne('60c72b2f9b1e8c6f45e847f1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const updatePaymentDto = { amount: 200 };
      const result: Payment = { order: new Types.ObjectId(), amount: 200, paymentMethod: 'Credit Card' } as Payment;
      jest.spyOn(paymentService, 'updatePayment').mockResolvedValue(result);
      expect(await paymentController.update('60c72b2f9b1e8c6f45e847f1', updatePaymentDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a payment', async () => {
      const result: Payment = { order: new Types.ObjectId(), amount: 100, paymentMethod: 'Credit Card' } as Payment;
      jest.spyOn(paymentService, 'deletePayment').mockResolvedValue(result);
      expect(await paymentController.remove('60c72b2f9b1e8c6f45e847f1')).toBe(result);
    });
  });
});
