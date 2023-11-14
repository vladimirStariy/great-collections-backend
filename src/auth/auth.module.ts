import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: `${process.env.PRIVATE_KEY}`,
      signOptions: {
        expiresIn: '36000'
      }
    })
  ],
  exports: [
    AuthService,
    
  ]
})

export class AuthModule {}
