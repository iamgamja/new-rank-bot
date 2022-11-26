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
const getUser_1 = __importDefault(require("../functions/getUser"));
class 도박 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    도박(i, 배팅) {
        return __awaiter(this, void 0, void 0, function* () {
            yield i.deferReply();
            if (i.channelId !== '1025359305689550869') {
                yield i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n실행 가능한 채널: <#1025359305689550869>' });
                return;
            }
            const member = i.member;
            const user = yield (0, getUser_1.default)(this.cts, member);
            if (!user) {
                yield i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' });
                return;
            }
            const { can도박, canTime } = yield user.can도박();
            if (!can도박) {
                yield i.editReply({
                    content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor(canTime / 1000)}:R>`,
                });
                return;
            }
            if (배팅 % 10) {
                yield i.editReply({ content: '```diff\n- 베팅은 10 R 단위로 가능합니다.\n```' });
                return;
            }
            if (배팅 >= user.userData.R) {
                yield i.editReply({ content: '```diff\n- R이 부족합니다.\n```' });
                return;
            }
            if (배팅 < 0) {
                yield i.editReply({ content: '```diff\n- 배팅 금액은 음수일 수 없습니다.\n```' });
                return;
            }
            yield user.add('R', -배팅);
            const 배율 = (() => {
                let x = Math.random() * 100;
                if (x < 5)
                    return 2; // 5%
                x -= 5;
                if (x < 10)
                    return 1.5; // 10%
                x -= 10;
                if (x < 50)
                    return 1; // 50%
                x -= 50;
                if (x < 25)
                    return 0.5; // 25%
                return 0; // 10%
            })();
            yield user.add('R', 배율 * 배팅);
            yield user.done();
            yield i.editReply({
                content: '```diff\n' + `x${배율}\n` + '```',
            });
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: '도박',
            description: '도박을 진행합니다.',
            options: [
                {
                    name: '배팅',
                    description: '배팅할 R입니다.',
                    required: true,
                    type: 'NUMBER',
                },
            ],
        },
    }),
    __param(1, (0, command_ts_1.option)('배팅')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, Number]),
    __metadata("design:returntype", Promise)
], 도박.prototype, "\uB3C4\uBC15", null);
function install(cts) {
    return new 도박(cts);
}
exports.install = install;
//# sourceMappingURL=%EB%8F%84%EB%B0%95.js.map