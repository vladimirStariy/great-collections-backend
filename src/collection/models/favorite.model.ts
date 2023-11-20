import { Model } from "sequelize";
import { Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { CollectionItem } from "./collection.item";
import { User } from "src/user/models/user.model";

export interface FavoriteCreationAttributes {
    id: 0;
    collectionItemId: number;
    userId: number;
}

@Table({tableName: 'favorites'})
export class Favorite extends Model<Favorite, FavoriteCreationAttributes> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => CollectionItem)
    @Column({type: DataType.INTEGER})
    collectionItemId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
}