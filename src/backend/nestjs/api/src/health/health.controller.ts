import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

  @Get()
  healthCheck(@Res() res: Response) {
    return this.healthService.healthCheck(res);
  }
}