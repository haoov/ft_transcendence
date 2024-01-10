"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverEvents = exports.clientEvents = void 0;
var clientEvents;
(function (clientEvents) {
    clientEvents["connected"] = "connected";
    clientEvents["update"] = "update";
    clientEvents["mode"] = "mode";
})(clientEvents || (exports.clientEvents = clientEvents = {}));
;
var serverEvents;
(function (serverEvents) {
    serverEvents["updated"] = "updated";
    serverEvents["ready"] = "ready";
    serverEvents["started"] = "started";
    serverEvents["finished"] = "finished";
    serverEvents["waiting"] = "waiting";
    serverEvents["playing"] = "playing";
})(serverEvents || (exports.serverEvents = serverEvents = {}));
;
//# sourceMappingURL=events.enum.js.map