import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/users')
    getUsers() {
        return this.userService.get();
    }
}
