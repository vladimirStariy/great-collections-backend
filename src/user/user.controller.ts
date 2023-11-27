import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRangeDto, UsersRequestDto } from './dto/user.dto';

@Controller('')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('/users')
    async getUsersWithPagination(@Body() usersRequest: UsersRequestDto) {
        const users = await this.userService.getWithPagination(usersRequest); 
        return users;
    }

    @Post('/block-users')
    async blockUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.blockUserRange(userRange.Ids);
    }

    @Post('/unblock-users')
    async unblockUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.unblockUserRange(userRange.Ids);
    }

    @Post('/remove-users')
    async removeUsersRange(@Body() userRange: UserRangeDto) {
        await this.userService.removeUserRange(userRange.Ids);
    }
}
