export interface CreateCollectionRequestDto {
    name: string;
    description?: string;
    theme: number;
    file: Express.Multer.File;
    imagePath?: string;
    fields: CollectionFieldDto[]
}

export interface GetCollectionRequest {
    id: number;
}

export interface GetCollectionResponseDto {
    name: string;
    description?: string;
    themeId: number;
    imagePath?: string;
    
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
    values: any[];
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

export interface GetCollectionItemResponse {
    id: number;
    collection_id: number;
    name: string;
    collection: {
        name: string;
    };
    collectionFields: CollectionFieldAndValueDto[];
}

export interface CollectionFieldAndValueDto {
    name: string;
    value: string;
    data_type: string;
}