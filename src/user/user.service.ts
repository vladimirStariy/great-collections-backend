import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {

    constructor() {}

    async hello() {
        return "Hello, World!"
    }
}

