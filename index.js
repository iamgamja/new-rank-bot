"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cts = void 0;
const client_1 = require("./structures/client");
const config_1 = require("./config");
exports.cts = new client_1.Client();
exports.cts.client.login(config_1.config.token);
//# sourceMappingURL=index.js.map