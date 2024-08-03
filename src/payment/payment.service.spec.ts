import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';
import { NotFoundException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  let model: Model<PaymentDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getModelToken(Payment.name),
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

    service = module.get<PaymentService>(PaymentService);
    model = module.get<Model<PaymentDocument>>(getModelToken(Payment.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create and return a payment', async () => {
      const dto = { amount: 200, method: 'credit' };
      const createdPayment = { _id: '1', ...dto };
      jest.spyOn(model, 'create').mockResolvedValue(createdPayment as any);

      expect(await service.createPayment(dto)).toEqual(createdPayment);
    });
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      const payments = [{ _id: '1', amount: 200 }];
      jest.spyOn(model, 'find').mockResolvedValue(payments as any);

      expect(await service.findAll()).toEqual(payments);
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      const payment = { _id: '1', amount: 200 };
      jest.spyOn(model, 'findById').mockResolvedValue(payment as any);

      expect(await service.findOne('1')).toEqual(payment);
    });

    it('should throw NotFoundException if payment is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePayment', () => {
    it('should update and return a payment', async () => {
      const dto = { amount: 250 };
      const updatedPayment = { _id: '1', amount: 250 };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedPayment as any);

      expect(await service.updatePayment('1', dto)).toEqual(updatedPayment);
    });

    it('should throw NotFoundException if payment is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(service.updatePayment('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePayment', () => {
    it('should delete and return a payment', async () => {
      const deletedPayment = { _id: '1', amount: 200 };
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(deletedPayment as any);

      expect(await service.deletePayment('1')).toEqual(deletedPayment);
    });

    it('should throw NotFoundException if payment is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(service.deletePayment('1')).rejects.toThrow(NotFoundException);
    });
  });
});
