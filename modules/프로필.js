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
const tears_1 = __importDefault(require("../data/tears"));
const getUser_1 = __importDefault(require("../functions/getUser"));
class 프로필 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    프로필(i, 유저) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = 유저 || i.member;
            const user = yield (0, getUser_1.default)(this.cts, member);
            if (!user) {
                yield i.reply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```', ephemeral: true });
                return;
            }
            const userData = user.userData;
            const 목표경험치 = Math.pow(2, (user.누적레벨 - 1)) * 1000;
            const 남은경험치 = 목표경험치 - userData.경험치;
            yield i.reply({
                content: `${member.displayName}님 (ID: ${userData.id.toString().padStart(6, '0')}) 의 정보:\n` +
                    '```\n' +
                    `${tears_1.default[userData.티어]} Lv. ${userData.레벨} / EXP ${userData.경험치} (다음 레벨까지 EXP ${남은경험치})\n` +
                    `공격력: ${userData.공격력} / HP: ${userData.체력}\n` +
                    `소지품:\n` +
                    `  R ${userData.R}\n` +
                    `장착:\n` +
                    `  무기: ${userData.무기}\n` +
                    `  방어구: ${userData.방어구}\n` +
                    '```',
            });
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: '프로필',
            description: '다른 사람(또는 자신)의 프로필을 확인합니다!',
            options: [
                {
                    name: '유저',
                    description: '프로필을 확인할 유저입니다. 입력하지 않으면 자신의 프로필을 확인합니다.',
                    type: 'USER',
                },
            ],
        },
    }),
    __param(1, (0, command_ts_1.option)('유저')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, discord_js_1.GuildMember]),
    __metadata("design:returntype", Promise)
], 프로필.prototype, "\uD504\uB85C\uD544", null);
function install(cts) {
    return new 프로필(cts);
}
exports.install = install;
//# sourceMappingURL=%ED%94%84%EB%A1%9C%ED%95%84.js.map