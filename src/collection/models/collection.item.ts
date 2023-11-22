import { DataType, Model, Table, Column, AllowNull, BelongsToMany, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CollectionItemTag } from "src/tag/model/collection.item.tag";
import { Tag } from "src/tag/model/tag.model";
import { Collection } from "./collection.model";
import { CollectionFieldValue } from "./collection.field.value";
import { Favorites } from "./favorite.model";
import { Comment } from 'src/comment/model/comment.model';

@Table({tableName: 'collection-items'})
export class CollectionItem extends Model<CollectionItem> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;
    
    @ForeignKey(() => Collection)
    @Column({type: DataType.INTEGER, allowNull: false})
    collection_id: number;

    @BelongsTo(() => Collection)
    collection: Collection

    @HasMany(() => CollectionFieldValue)
    values: CollectionFieldValue[] 

    @HasMany(() => Favorites)
    likes: Favorites[]

    @HasMany(() => Comment)
    comments: Comment[]

    @BelongsToMany(() => Tag, () => CollectionItemTag)
    tags: Tag[]
}