import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Theme } from './model/theme.model';

@Injectable()
export class ThemeService {

    constructor(@InjectModel(Theme) private themeRepository: typeof Theme) {}

    async getThemes() {
        const themes = this.themeRepository.findAll();
        return themes;
    }
}

