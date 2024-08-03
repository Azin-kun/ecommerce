import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let model: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
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

    service = module.get<ProductService>(ProductService);
    model = module.get<Model<ProductDocument>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const dto = { name: 'testproduct', price: 100 };
      const createdProduct = { _id: '1', ...dto };
      jest.spyOn(model, 'create').mockResolvedValue(createdProduct as any);

      expect(await service.createProduct(dto)).toEqual(createdProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [{ _id: '1', name: 'testproduct' }];
      jest.spyOn(model, 'find').mockResolvedValue(products as any);

      expect(await service.findAll()).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { _id: '1', name: 'testproduct' };
      jest.spyOn(model, 'findById').mockResolvedValue(product as any);

      expect(await service.findOne('1')).toEqual(product);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const dto = { name: 'updatedproduct' };
      const updatedProduct = { _id: '1', name: 'updatedproduct' };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedProduct as any);

      expect(await service.updateProduct('1', dto)).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(service.updateProduct('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete and return a product', async () => {
      const deletedProduct = { _id: '1', name: 'testproduct' };
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(deletedProduct as any);

      expect(await service.deleteProduct('1')).toEqual(deletedProduct);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(service.deleteProduct('1')).rejects.toThrow(NotFoundException);
    });
  });
});
