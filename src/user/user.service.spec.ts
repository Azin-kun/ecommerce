import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue([]), // Mock exec for find methods
            })),
            findById: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue(null), // Mock exec for findById
            })),
            findOne: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue(null), // Mock exec for findOne
            })),
            create: jest.fn().mockResolvedValue({}),
            findByIdAndUpdate: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue(null), // Mock exec for findByIdAndUpdate
            })),
            findByIdAndDelete: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue(null), // Mock exec for findByIdAndDelete
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const dto = { username: 'testuser', password: 'testpass' };
      const createdUser = { _id: '1', ...dto };
      jest.spyOn(model, 'create').mockResolvedValue(createdUser as any);

      expect(await service.createUser(dto)).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ _id: '1', username: 'testuser' }];
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(users),
      } as any);

      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { _id: '1', username: 'testuser' };
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      expect(await service.findOne('1')).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const user = { _id: '1', username: 'testuser' };
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      expect(await service.findOneByUsername('testuser')).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const dto = { username: 'updateduser' };
      const updatedUser = { _id: '1', username: 'updateduser' };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      expect(await service.updateUser('1', dto)).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.updateUser('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete and return a user', async () => {
      const deletedUser = { _id: '1', username: 'testuser' };
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(deletedUser),
      } as any);

      expect(await service.deleteUser('1')).toEqual(deletedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException);
    });
  });
});
