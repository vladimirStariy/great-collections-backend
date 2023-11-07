export class UserDto {
    readonly email: string;
    readonly password: string;
}

export class UserRecordDto {
    id: number;
    email: string;
    isBanned: boolean;
    isAdmin: boolean;
}

export class UsersRequestDto {
    readonly page: number;
    readonly recordsQuantity: number;
}

export class UserRangeDto {
    readonly Ids: number[];
}