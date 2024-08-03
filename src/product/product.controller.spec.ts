import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    createProduct: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: getModelToken(Product.name), useValue: {} },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = { name: 'test', price: 100, description: 'test product' };
      await productController.create(createProductDto);
      expect(productService.createProduct).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [{ name: 'test', price: 100, description: 'test product' } as Product];
      jest.spyOn(productService, 'findAll').mockResolvedValue(result);
      expect(await productController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const result: Product = { name: 'test', price: 100, description: 'test product' } as Product;
      jest.spyOn(productService, 'findOne').mockResolvedValue(result);
      expect(await productController.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { name: 'testUpdated' };
      const result: Product = { name: 'testUpdated', price: 100, description: 'test product' } as Product;
      jest.spyOn(productService, 'updateProduct').mockResolvedValue(result);
      expect(await productController.update('1', updateProductDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const result: Product = { name: 'test', price: 100, description: 'test product' } as Product;
      jest.spyOn(productService, 'deleteProduct').mockResolvedValue(result);
      expect(await productController.remove('1')).toBe(result);
    });
  });
});
