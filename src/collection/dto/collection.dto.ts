export interface CreateCollectionRequestDto {
    name: string;
    description: string;
    theme: string;
    imagePath?: string;
    fields: CollectionFieldDto[]
}

export interface ICollectionData {
    name: string;
    description: string;
    theme: string;
    imagePath?: string;
}

export class CollectionRecordDto {
    id: number;
    name: string;
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