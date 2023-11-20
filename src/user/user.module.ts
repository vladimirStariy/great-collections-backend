import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from './models/user.model';
import { AuthModule } from 'src/auth/auth.module';
import { Collection } from 'src/collection/models/collection.model';
import { Favorites } from 'src/collection/models/favorite.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Collection, Favorites]),
    forwardRef(() => AuthModule)
  ],
  exports: [
    UserService
  ]
})

export class UserModule {}
