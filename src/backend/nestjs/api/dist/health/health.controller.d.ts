import { Response } from 'express';
import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    healthCheck(res: Response): Response<any, Record<string, any>>;
}
