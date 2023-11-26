import { Res, Req, Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dto/auth.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Res({ passthrough: true }) response: Response, @Body() authDto: AuthDto) {
        const pairTokens = await this.authService.login(authDto);
        response.cookie('refreshToken', pairTokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        return { access: pairTokens.accessToken };
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Get('refresh')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const pairTokens = await this.authService.refresh(request.cookies['refreshToken']);
        response.cookie('refreshToken', pairTokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        return { access: pairTokens.accessToken };
    }

    @Get('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.cookie('refreshToken', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
    }
}
