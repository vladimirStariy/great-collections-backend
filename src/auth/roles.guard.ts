import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";

import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminRolesGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Unauthorized'})
            }

            const user = this.jwtService.verify(token);
            
            return user.isAdmin;
        } catch (e) {
            throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN)
        }
    }

}