import { Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class HealthService {
	healthCheck(res: Response) {
    return res.status(200).send("OK");
  }
}