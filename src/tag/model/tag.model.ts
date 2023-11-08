import { DataType, Model, Table, Column, AllowNull, BelongsToMany } from "sequelize-typescript";
import { CollectionItem } from "src/collection/models/collection.item";
import { CollectionItemTag } from "./collection.item.tag";

interface ITagCreationModel {
    name: string;
}

@Table({tableName: 'tags'})
export class Tag extends Model<Tag, ITagCreationModel> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;
    
    @BelongsToMany(() => CollectionItem, () => CollectionItemTag)
    collectionItems: CollectionItem[]
}