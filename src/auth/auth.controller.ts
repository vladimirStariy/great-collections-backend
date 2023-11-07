import { Res, Req, Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from 'src/user/dto/user.dto';

@ApiTags('Authorization')
@Controller('')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Authorization'})
    @ApiResponse({status: 200, type: ''})
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

    @ApiOperation({summary: 'Registration'})
    @ApiResponse({status: 200})
    @Post('register')
    async register(@Body() userDto: UserDto) {
        await this.authService.register(userDto);
        return { status: 'OK' }
    }

    @ApiOperation({summary: 'Refresh'})
    @ApiResponse({status: 200})
    @Get('refresh')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const pairTokens = await this.authService.refresh(request.cookies['refreshToken']);

        response.cookie('refreshToken', pairTokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        
        return { accessToken: pairTokens.accessToken };
    }
}
