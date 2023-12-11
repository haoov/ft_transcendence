import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class AuthentificatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
