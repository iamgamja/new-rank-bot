"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const command_ts_1 = require("@pikokr/command.ts");
const discord_js_1 = __importStar(require("discord.js"));
const config_1 = require("../config");
class Client extends command_ts_1.CommandClient {
    constructor() {
        super({
            client: new discord_js_1.default.Client({
                intents: Object.keys(discord_js_1.Intents.FLAGS),
            }),
            owners: 'auto',
            command: {
                prefix: '',
            },
            applicationCommands: {
                autoSync: true,
                guild: config_1.config.slash.guild,
            },
        });
        this.registry.loadModulesIn('modules');
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map