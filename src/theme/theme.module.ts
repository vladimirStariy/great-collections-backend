import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from 'src/auth/auth.module';
import { Collection } from 'src/collection/models/collection.model';
import { ThemeService } from './theme.service';
import { Theme } from './model/theme.model';

@Module({
  controllers: [],
  providers: [ThemeService],
  imports: [
    SequelizeModule.forFeature([Theme, Collection]),
  ],
  exports: [
    ThemeService
  ]
})

export class ThemeModule {}
