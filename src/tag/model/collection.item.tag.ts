import { DataType, Model, Table, Column, AllowNull, BelongsToMany, ForeignKey } from "sequelize-typescript";
import { CollectionItem } from "src/collection/models/collection.item";
import { Tag } from "./tag.model";

interface CreationAttributes {
    collectionItemId: number;
    tagId: number;
}

@Table({tableName: 'collection-item-tags', createdAt: false, updatedAt: false})
export class CollectionItemTag extends Model<CollectionItemTag, CreationAttributes> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => CollectionItem)
    @Column({type: DataType.INTEGER, allowNull: false})
    collectionItemId: number;
    
    @ForeignKey(() => Tag)
    @Column({type: DataType.INTEGER, allowNull: false})
    tagId: number;
}