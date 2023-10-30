import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UserModule),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY,
        signOptions: {
          expiresIn: '1h'
        }
      })
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})

export class AuthModule {}
