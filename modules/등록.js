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
const command_ts_1 = require("@pikokr/command.ts");
const discord_js_1 = require("discord.js");
const editUserInfoMsg_1 = __importDefault(require("../functions/editUserInfoMsg"));
class 등록 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    등록(i) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1025653282254880829');
            const data = JSON.parse(db.content);
            const member = i.member;
            if (member.user.id in data) {
                yield i.reply({ content: '```diff\n- 이미 등록되었습니다.\n```', ephemeral: true });
            }
            else {
                // 등록
                data[member.user.id] = { 티어: 0, 레벨: 1, 경험치: 0, 공격력: 1, 체력: 1, R: 0, 무기: '없음', 방어구: '없음', id: Object.keys(data).length + 1 };
                yield db.edit(JSON.stringify(data));
                yield i.reply({ content: '```diff\n+ 등록되었습니다.\n```' });
                yield (0, editUserInfoMsg_1.default)(this.cts, data);
            }
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: '등록',
            description: '등록합니다.',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], 등록.prototype, "\uB4F1\uB85D", null);
function install(cts) {
    return new 등록(cts);
}
exports.install = install;
//# sourceMappingURL=%EB%93%B1%EB%A1%9D.js.map