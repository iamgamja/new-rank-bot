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
const isAdmin_1 = __importDefault(require("../functions/isAdmin"));
const getUser_1 = __importDefault(require("../functions/getUser"));
class 장착 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    장착(i, 종류, 대상, 이름) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, isAdmin_1.default)(i.member)) {
                yield i.reply({ content: '관리자만 사용할 수 있습니다.', ephemeral: true });
                return;
            }
            const user = yield (0, getUser_1.default)(this.cts, 대상);
            if (!user) {
                yield i.reply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' });
                return;
            }
            if (종류 !== '무기' && 종류 !== '방어구') {
                yield i.reply({ content: '```diff\n- 올바르지 않은 종류입니다.\n```' });
                return;
            }
            user.mount(종류, 이름);
            const result = yield user.done();
            yield i.reply({
                content: '✅\n' +
                    `${대상.displayName}님 (ID: ${result.id.toString().padStart(6, '0')}) 의 현재 정보:\n` +
                    '```\n' +
                    `${tears_1.default[result.티어]} Lv. ${result.레벨} / EXP ${result.경험치}\n` +
                    `공격력: ${result.공격력} / HP: ${result.체력}\n` +
                    `소지품:\n` +
                    `  R ${result.R}\n` +
                    `장착:\n` +
                    `  무기: ${result.무기}\n` +
                    `  방어구: ${result.방어구}\n` +
                    '```',
            });
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: '장착',
            description: '[관리자 전용] 다른 사람의 무기/방어구를 장착시킵니다',
            options: [
                {
                    name: '종류',
                    description: '장착할 아이템의 종류입니다. (`무기 / 방어구` 중 택1)',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: '대상',
                    description: '대상입니다.',
                    type: 'USER',
                    required: true,
                },
                {
                    name: '이름',
                    description: '장착할 아이템의 이름입니다.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
    }),
    __param(1, (0, command_ts_1.option)('종류')),
    __param(2, (0, command_ts_1.option)('대상')),
    __param(3, (0, command_ts_1.option)('이름')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, String, discord_js_1.GuildMember, String]),
    __metadata("design:returntype", Promise)
], 장착.prototype, "\uC7A5\uCC29", null);
function install(cts) {
    return new 장착(cts);
}
exports.install = install;
//# sourceMappingURL=%EC%9E%A5%EC%B0%A9.js.map