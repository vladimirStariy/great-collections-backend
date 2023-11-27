import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { User } from 'src/user/models/user.model';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) {}

    async login(userDto: UserDto) {
        const user = await this.validateUser(userDto);
        const pairTokens = await this.generatePairToken(user);
        return pairTokens;
    }

    async register(registerDto: RegisterDto) {
        const user = await this.userService.getByEmail(registerDto.email);
        if(user) throw new ConflictException('User with the same email already exists.')
        const hashPassword = await bcrypt.hash(registerDto.password, 5);
        return await this.userService.createUser(registerDto.email, hashPassword, registerDto.name);
    }

    async refresh(refreshToken: string) {
        const isValid = await this.jwtService.verifyAsync(refreshToken)
        if(isValid) {
            const user = await this.userService.getByEmail(isValid.email);
            const pairTokens = this.generatePairToken(user);
            return pairTokens;
        }
    }

    private async generatePairToken(user: User) {
        const payload = { email: user.email, isAdmin: user.isAdmin }
        const accessToken = await this.jwtService.signAsync(payload, {algorithm: 'HS256'})
        const refreshToken = await this.jwtService.signAsync(payload, {algorithm: 'HS256', expiresIn: '7d'})
        return { accessToken, refreshToken }
    }

    async validateUser(userDto: UserDto) {
        const user = await this.userService.getByEmail(userDto.email);
        if(!user) throw new UnauthorizedException({message: 'Invalid email'});
        if(user.isBanned) new UnauthorizedException({message: 'User is banned.'});
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (passwordEquals) { return user } else throw new UnauthorizedException({message: 'Invalid password'});
    }
}

