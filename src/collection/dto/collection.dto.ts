export interface CreateCollectionRequestDto {
    collectionData: {
        name: string;
        description: string;
        theme: string;
        imagePath?: string;
    }
    fields: CollectionFieldDto[]
}

export class CollectionRecordDto {
    id: number;
    name: string;
    theme: string;
    itemsQuantity: number;
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