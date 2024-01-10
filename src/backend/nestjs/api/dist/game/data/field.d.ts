import { Vec3 } from "./opts";
declare class Field {
    width: number;
    height: number;
    position: Vec3;
    borders: {
        top: number;
        bottom: number;
        right: number;
        left: number;
    };
    constructor();
}
export { Field };
