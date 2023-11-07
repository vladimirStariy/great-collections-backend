import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from "./user.controller";
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
    let userController: UserController;

    const mockUserService = {}

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, JwtService],
        }).overrideProvider(UserService).useValue(mockUserService).compile();

        userController = module.get<UserController>(UserController);
    })

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });
});