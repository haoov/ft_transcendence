import { Response } from "express";
export declare class HealthService {
    healthCheck(res: Response): Response<any, Record<string, any>>;
}
