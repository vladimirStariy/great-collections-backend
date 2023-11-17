export interface CreateCollectionRequestDto {
    name: string;
    description?: string;
    theme: number;
    file: Express.Multer.File;
    imagePath?: string;
    fields: CollectionFieldDto[]
}

export interface ICollectionData {
    name: string;
    description?: string;
    themeId: number;
    imagePath?: string;
}

export class CollectionRecordDto {
    id: number;
    name: string;
    themeId: number;
    theme: string;
    itemsQuantity: number;
    imagePath?: string;
}

export interface CollectionFieldDto {
    name: string;
    data_type: string;
    collectionId: number;
}

export interface CreateCollectionItemRequestDto {
    name: string;
    tags: number[];
    collectionId: number;
    data: any[];
}

export interface GetCollectionsRequestDto {
    page: number;
    recordsCount: number;
}

export interface GetUserCollectionsRequestDto {
    page: number;
    recordsCount: number;
    userId: number;
}