export class AuthDto {
    readonly email: string;
    readonly password: string;
}

export class RegisterDto {
    readonly email: string;
    readonly password: string;
    readonly name: string;
}