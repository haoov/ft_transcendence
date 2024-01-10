"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const opts_1 = require("./opts");
class Field {
    constructor() {
        this.position = { x: 0, y: 0, z: 1 };
        this.width = opts_1.utils.visibleWidth(this.position.z);
        this.height = opts_1.utils.visibleHeight(this.position.z);
        this.borders = {
            top: opts_1.utils.visibleHeight(0) / 2,
            bottom: -opts_1.utils.visibleHeight(0) / 2,
            right: opts_1.utils.visibleWidth(0) / 2,
            left: -opts_1.utils.visibleWidth(0) / 2,
        };
    }
}
exports.Field = Field;
//# sourceMappingURL=field.js.map