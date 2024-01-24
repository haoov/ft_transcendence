import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import TokenPayload from '../tokenPayload.interface';
 
@Injectable()
export class Jwt2faStrategy extends PassportStrategy(
  Strategy,
  'jwt-2fa'
) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: process.env.JWT_ACCESS_TOKEN,
    });
  }
 
  async validate(payload: TokenPayload) {
    const user = await this.userService.getUserById(payload.id);
	if (user && !user.twofa_enabled) {
      return user;
    }
	
    if (user && payload.twofaAuth) {
      return user;
    }
  }
}