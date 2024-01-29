import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export default class Jwt2faGuard extends AuthGuard('jwt-2fa') {}
