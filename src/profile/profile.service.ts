import { HttpException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CollectionService } from 'src/collection/collection.service';
import { CollectionRecordDto } from 'src/collection/dto/collection.dto';
import { CollectionItem } from 'src/collection/models/collection.item';
import { Collection } from 'src/collection/models/collection.model';
import { Favorites } from 'src/collection/models/favorite.model';

@Injectable()
export class ProfileService {

    constructor(@InjectModel(Favorites) private favoritesRepository: typeof Favorites,
                private collectionService: CollectionService) {}

    async getUserCollections(userId: number) {
        const collections = await this.collectionService.getCollectionsByUserId(userId)
        return collections;
    }

    async getFavorites(userId: number) {
        const favorites = await this.favoritesRepository.findAll({where: {userId: userId}})
        const ids = favorites.map(item => {return item.collectionItemId})
        const collectionItems = await this.collectionService.getCollectionItemById(ids);
        return collectionItems;
    }

    async likeCollectionItem(userId: number, collectionItemId: number) {
        await this.favoritesRepository.create({collectionItemId, userId});
    }

    async unlikeCollectionItem(userId: number, collectionItemId) {
        await this.favoritesRepository.destroy({
            where: {
                userId: userId,
                collectionItemId: collectionItemId
            }
        })
    }
}