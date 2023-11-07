import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/roles.guard';
import { UserRangeDto, UsersRequestDto } from './dto/user.dto';

@Controller('')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('/users')
    @UseGuards(RolesGuard)
    async getUsersWithPagination(@Body() usersRequest: UsersRequestDto) {
        const users = await this.userService.getWithPagination(usersRequest); 
        return users;
    }

    @Post('/block-users')
    @UseGuards(RolesGuard)
    async blockUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.blockUserRange(userRange.Ids);
    }

    @Post('/unblock-users')
    @UseGuards(RolesGuard)
    async unblockUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.unblockUserRange(userRange.Ids);
    }

    @Post('/remove-users')
    @UseGuards(RolesGuard)
    async removeUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.removeUserRange(userRange.Ids);
    }
}
