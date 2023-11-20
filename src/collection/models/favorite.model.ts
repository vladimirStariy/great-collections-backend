import { DataType, Model, Table, Column, AllowNull, BelongsToMany, HasMany, ForeignKey } from "sequelize-typescript";
import { CollectionItem } from "./collection.item";
import { User } from "src/user/models/user.model";

export interface FavoriteCreationAttributes {
    collectionItemId: number;
    userId: number;
}

@Table({tableName: 'favorites'})
export class Favorites extends Model<Favorites, FavoriteCreationAttributes> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => CollectionItem)
    @Column({type: DataType.INTEGER})
    collectionItemId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
}