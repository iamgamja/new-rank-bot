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
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const command_ts_1 = require("@pikokr/command.ts");
const discord_js_1 = require("discord.js");
class 날짜 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    날짜(i) {
        return __awaiter(this, void 0, void 0, function* () {
            const diffms = new Date().getTime() - new Date('2020 10 17').getTime();
            const diffday = Math.floor(diffms / 1000 / 60 / 60 / 24);
            yield i.reply(`오늘은 ${diffday}일 입니다.`);
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: '날짜',
            description: '2020년 10월 17일을 0일로 계산해서 오늘 날짜를 확인합니다.',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], 날짜.prototype, "\uB0A0\uC9DC", null);
function install(cts) {
    return new 날짜(cts);
}
exports.install = install;
//# sourceMappingURL=%EB%82%A0%EC%A7%9C.js.map