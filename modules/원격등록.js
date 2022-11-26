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
const command_ts_1 = require("@pikokr/command.ts");
const discord_js_1 = require("discord.js");
const editUserInfoMsg_1 = __importDefault(require("../functions/editUserInfoMsg"));
class 원격등록 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    원격등록(i, 대상) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const roles = (_a = i.member) === null || _a === void 0 ? void 0 : _a.roles;
            let isAdmin = false;
            if (roles instanceof discord_js_1.GuildMemberRoleManager) {
                isAdmin = !!roles.cache.get('953309071468007494'); // 관리자
            }
            else if (roles) {
                isAdmin = roles.includes('953309071468007494'); // 관리자
            }
            if (!isAdmin) {
                yield i.reply({ content: '관리자만 사용할 수 있습니다.', ephemeral: true });
                return;
            }
            const db = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1025653282254880829');
            const data = JSON.parse(db.content);
            // const member = i.member as GuildMember
            const member = 대상;
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
            name: '원격등록',
            description: '[관리자 전용] 다른 사람을 원격으로 등록합니다.',
            options: [
                {
                    name: '대상',
                    description: '대상입니다.',
                    type: 'USER',
                    required: true,
                },
            ],
        },
    }),
    __param(1, (0, command_ts_1.option)('대상')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, discord_js_1.GuildMember]),
    __metadata("design:returntype", Promise)
], 원격등록.prototype, "\uC6D0\uACA9\uB4F1\uB85D", null);
function install(cts) {
    return new 원격등록(cts);
}
exports.install = install;
//# sourceMappingURL=%EC%9B%90%EA%B2%A9%EB%93%B1%EB%A1%9D.js.map