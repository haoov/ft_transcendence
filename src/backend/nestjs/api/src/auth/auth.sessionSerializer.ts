import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }
}