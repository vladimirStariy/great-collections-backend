import { DataType, Model, Table, Column, AllowNull, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from "src/user/models/user.model";
import { CollectionItem } from "src/collection/models/collection.item";

interface ICommentCreationModel {
    text: string;
    userId: number;
    collectionItemId: number;
}

@Table({tableName: 'comments'})
export class Comment extends Model<Comment, ICommentCreationModel> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    text: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ForeignKey(() => CollectionItem)
    @Column({type: DataType.INTEGER})
    collectionItemId: number;

    @BelongsTo(() => User)
    user: User

    @BelongsTo(() => CollectionItem)
    items: CollectionItem
}