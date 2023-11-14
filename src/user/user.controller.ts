import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminRolesGuard } from '../auth/roles.guard';
import { UserRangeDto, UsersRequestDto } from './dto/user.dto';

@Controller('')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('/users')
    @UseGuards(AdminRolesGuard)
    async getUsersWithPagination(@Body() usersRequest: UsersRequestDto) {
        const users = await this.userService.getWithPagination(usersRequest); 
        return users;
    }

    @Post('/block-users')
    @UseGuards(AdminRolesGuard)
    async blockUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.blockUserRange(userRange.Ids);
    }

    @Post('/unblock-users')
    @UseGuards(AdminRolesGuard)
    async unblockUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.unblockUserRange(userRange.Ids);
    }

    @Post('/remove-users')
    @UseGuards(AdminRolesGuard)
    async removeUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.removeUserRange(userRange.Ids);
    }
}
