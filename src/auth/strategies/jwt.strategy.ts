import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.PRIVATE_KEY}`,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getByEmail(payload.email);
    if(!user) throw new UnauthorizedException({ObjectOrError: `ssss`});
    if(user.isBanned) throw new UnauthorizedException({message: 'You has been banned.'});
    return user.email;
  }
}