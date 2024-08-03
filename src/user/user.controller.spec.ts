import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { username: 'test', password: 'test' };
      await userController.create(createUserDto);
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [{ username: 'test', password: 'test' } as User];
      jest.spyOn(userService, 'findAll').mockResolvedValue(result);
      expect(await userController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result: User = { username: 'test', password: 'test' } as User;
      jest.spyOn(userService, 'findOne').mockResolvedValue(result);
      expect(await userController.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { username: 'testUpdated' };
      const result: User = { username: 'testUpdated', password: 'test' } as User;
      jest.spyOn(userService, 'updateUser').mockResolvedValue(result);
      expect(await userController.update('1', updateUserDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const result: User = { username: 'test', password: 'test' } as User;
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(result);
      expect(await userController.remove('1')).toBe(result);
    });
  });
});
