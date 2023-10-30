import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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

    }

    private async generatePairToken(user: User) {
        const payload = { email: user.email, id: user.id }
        return { 
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {expiresIn: '7d'})
        }
    }

    private async validateUser(userDto: UserDto) {
        const user = await this.userService.getByEmail(userDto.email);
        if(!user) throw new UnauthorizedException({message: 'Invalid email'});
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (passwordEquals) { return user } else throw new UnauthorizedException({message: 'Invalid password'});
    }
}

