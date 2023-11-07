import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';

describe('UserService', () => {
    let userService: UserService;

    const mockUserRepository = {
        findOne: jest.fn().mockImplementation(dto => {
            id: 1;
            email: 'test';
            password: 'test';
            isBanned: false;
            isAdmin: false;
        }),
        create: jest.fn().mockImplementation(dto => {
            id: 1;
            email: 'test';
            password: 'test';
            isBanned: false;
            isAdmin: false;
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, JwtService, {
                provide: getModelToken(User),
                useValue: mockUserRepository
            }],
        }).compile();

        userService = module.get<UserService>(UserService);
    })

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create user and return it', async () => {
        expect(await userService.createUser('test@mail.ru', 'test'))
        .toEqual({
            id: expect.any(Number),
            email: expect.any(String),
            password: expect.any(String),
            isBanned: expect.any(Boolean),
            isAdmin: expect.any(Boolean),
        } || { 
            status: expect.any(Number) 
        });
    })
});