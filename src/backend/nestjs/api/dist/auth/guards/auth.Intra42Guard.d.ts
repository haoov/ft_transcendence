import { CanActivate, ExecutionContext } from "@nestjs/common";
declare const Intra42Guard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class Intra42Guard extends Intra42Guard_base implements CanActivate {
    canActivate(context: ExecutionContext): Promise<any>;
}
export {};
