import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserDto, UserRecordDto, UsersRequestDto } from './dto/user.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(email: string, password: string) {
        try {
            const userDto: UserDto = {email: email, password: password};
            const user = await this.getByEmail(email);
            if(user) { throw new UnauthorizedException({message: 'User with the same email exists'}); }
            const newUser = await this.userRepository.create(userDto);
            return newUser;
        } catch (e) {
            return { message: e.message }
        }
    }

    async get() {
        const users = await this.userRepository.findAll();
        let userRec: UserRecordDto[] = [];
        users.forEach(item => {
            userRec.push({id: item.id, email: item.email, isBanned: item.isBanned, isAdmin: item.isAdmin})
        })
        return userRec;
    }

    async getWithPagination(usersRequest: UsersRequestDto) {
        const _offset = (usersRequest.page - 1) * usersRequest.recordsQuantity;
        const usersRes = this.userRepository.findAndCountAll({
            offset: _offset,
            limit: usersRequest.recordsQuantity
        })
        const users = (await usersRes).rows;
        const userRecordsDto: UserRecordDto[] = []; 
        users.forEach(item => userRecordsDto.push({id: item.id, email: item.email, isBanned: item.isBanned, isAdmin: item.isAdmin}))
        return userRecordsDto;
    }

    async getByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }

    async blockUserRange(userIds: number[]) {
        const res = await this.userRepository.update({ isBanned: true }, { where: { id: userIds }})
        return res;
    }

    async unblockUserRange(userIds: number[]) {
        const res = await this.userRepository.update({ isBanned: false }, { where: { id: userIds }})
        return res;
    }

    async removeUserRange(userIds: number[]) {
        const res = await this.userRepository.destroy({where: { id: userIds }})
        return res;
    }

    async grantAdminPrivilegies() {

    }

    async removeAdminPrivilegies() {

    }
}

