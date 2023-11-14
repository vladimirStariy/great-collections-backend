import { HttpException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { User } from 'src/user/models/user.model';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) {}

    async login(userDto: UserDto) {
        const user = await this.validateUser(userDto);
        const pairTokens = await this.generatePairToken(user);

        return pairTokens;
    }

    async register(userDto: UserDto) {
        const user = await this.userService.getByEmail(userDto.email);
        if(user) throw new ConflictException('User with the same email already exists.')
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        return await this.userService.createUser(userDto.email, hashPassword);
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
        return { 
            accessToken: this.jwtService.sign(payload, {expiresIn: 60}),
            refreshToken: this.jwtService.sign(payload, {expiresIn: '7d'})
        }
    }

    async validateUser(userDto: UserDto) {
        const user = await this.userService.getByEmail(userDto.email);
        if(!user) throw new UnauthorizedException({message: 'Invalid email'});
        if(user.isBanned) new UnauthorizedException({message: 'User is banned.'});
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (passwordEquals) { return user } else throw new UnauthorizedException({message: 'Invalid password'});
    }
}

