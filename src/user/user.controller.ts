import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/user')
    getPersons() {
        return this.userService.hello();
    }
}
