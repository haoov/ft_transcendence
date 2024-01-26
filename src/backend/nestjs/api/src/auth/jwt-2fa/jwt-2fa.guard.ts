import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export default class Jwt2faGuard extends AuthGuard('jwt-2fa') {}
