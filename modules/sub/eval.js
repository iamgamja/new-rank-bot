"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
const command_ts_1 = require("@pikokr/command.ts");
const discord_js_1 = require("discord.js");
const editUserInfoMsg_1 = __importDefault(require("../../functions/editUserInfoMsg"));
class Eval extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    eval_(i, 식) {
        return __awaiter(this, void 0, void 0, function* () {
            if (i.member.id !== '526889025894875158')
                return;
            const db = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1025653282254880829');
            const userInfoMsg = yield this.cts.client.channels.cache.get('1025347124294070282').messages.fetch('1025975950439088168');
            const coolTimeDB = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1028912965786796144');
            const 출첵coolTimeDB = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1030671119797207040');
            const 도박coolTimeDB = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1036179914367447041');
            function editUserInfoMsg_(cts, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield (0, editUserInfoMsg_1.default)(cts, data);
                });
            }
            try {
                const result = eval(식);
                this.logger.info(result);
                yield i.reply({ content: result.toString(), ephemeral: true });
            }
            catch (e) {
                let errormsg;
                if (e instanceof Error)
                    errormsg = ['```js', '<name>', e.name, '<message>', e.message, '<stack>', e.stack, '```'].join('\n');
                else
                    errormsg = 'Unknown Error: ' + String(e);
                yield i.reply({ content: '에러남저런\n' + errormsg, ephemeral: true });
            }
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: 'eval',
            description: 'eval',
            options: [
                {
                    name: '식',
                    description: '식',
                    required: true,
                    type: 'STRING',
                },
            ],
        },
    }),
    __param(1, (0, command_ts_1.option)('식')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, String]),
    __metadata("design:returntype", Promise)
], Eval.prototype, "eval_", null);
function install(cts) {
    return new Eval(cts);
}
exports.install = install;
//# sourceMappingURL=eval.js.map