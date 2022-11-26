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
const getUser_1 = __importDefault(require("../functions/getUser"));
class 출첵 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    ㅊㅊ(i) {
        return __awaiter(this, void 0, void 0, function* () {
            yield i.deferReply();
            if (i.channelId !== '1001389058473345154') {
                yield i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n실행 가능한 채널: <#1001389058473345154>' });
                return;
            }
            const member = i.member;
            const user = yield (0, getUser_1.default)(this.cts, member);
            if (!user) {
                yield i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' });
                return;
            }
            const { can출첵, canTime } = yield user.can출첵();
            if (!can출첵) {
                yield i.editReply({
                    content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor((canTime - 9 * 60 * 60 * 1000) / 1000)}:R>`,
                });
                return;
            }
            const n = Math.pow(2, (user.누적레벨 - 1)) * 10;
            yield user.add('경험치', n);
            yield user.add('R', n);
            yield user.done();
            yield i.editReply({
                content: '```diff\n출첵했습니다.\n' + `+ EXP ${n}\n+ R ${n}\n` + '```',
            });
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: 'ㅊㅊ',
            description: '출첵합니다.',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], 출첵.prototype, "\u314A\u314A", null);
function install(cts) {
    return new 출첵(cts);
}
exports.install = install;
//# sourceMappingURL=%EC%B6%9C%EC%B2%B5.js.map