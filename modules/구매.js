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
const items_1 = __importDefault(require("../data/items"));
class 구매 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    구매(i, 아이템) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield i.deferReply();
            if (i.channelId !== '1025359390544502814') {
                yield i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n실행 가능한 채널: <#1025359390544502814>' });
                return;
            }
            const member = i.member;
            const user = yield (0, getUser_1.default)(this.cts, member);
            if (!user) {
                yield i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' });
                return;
            }
            if (!(아이템 in items_1.default)) {
                yield i.editReply({ content: '```diff\n- 아이템의 이름이 잘못되었습니다.\n' + `구매 가능한 아이템: ${Object.keys(items_1.default).join(', ')}\n` + '```' });
                return;
            }
            const target = items_1.default[아이템];
            if (user.userData.R < target.cost) {
                yield i.editReply({ content: '```diff\n- R이 부족합니다.\n```' });
                return;
            }
            if (target.limit) {
                const [targettear, targetlevel, targetexp] = target.limit;
                let can구매; // limit에 의해 구매할 수 없다면 false
                if (targettear < user.userData.티어) {
                    can구매 = true;
                }
                else if (targettear > user.userData.티어) {
                    can구매 = false;
                }
                else if (targetlevel < user.userData.레벨) {
                    can구매 = true;
                }
                else if (targetlevel > user.userData.레벨) {
                    can구매 = false;
                }
                else if (targetexp <= user.userData.경험치) {
                    can구매 = true;
                }
                else {
                    can구매 = false;
                }
                if (!can구매) {
                    yield i.editReply({ content: '```diff\n- 경험치가 부족합니다.\n```' });
                    return;
                }
            }
            if (target.get.role) {
                if (member.roles.cache.get(target.get.role)) {
                    yield i.editReply({ content: '```diff\n- 이미 구매한 아이템입니다.\n```' });
                    return;
                }
            }
            // 구매
            yield user.add('R', -target.cost);
            if (target.get.role) {
                const role = (_a = i.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(target.get.role);
                if (!role) {
                    yield i.editReply({ content: '```diff\n- 알수 없는 오류가 발생하였습니다: "역할이 존재하지 않음."\n- R은 차감되지 않았습니다.\n```' });
                    return;
                }
                yield member.roles.add(role, '아이템 구매');
            }
            if (target.get.exp) {
                yield user.add('경험치', target.get.exp);
            }
            yield user.done();
            yield i.editReply({
                content: '```diff\n' + `+ ${아이템}을(를) 구매했습니다.\n` + '```',
            });
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)({
        command: {
            type: 'CHAT_INPUT',
            name: '구매',
            description: '아이템을 구매합니다.',
            options: [
                {
                    name: '아이템',
                    description: '구매할 아이템의 이름입니다.',
                    required: true,
                    type: 'STRING',
                },
            ],
        },
    }),
    __param(1, (0, command_ts_1.option)('아이템')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, String]),
    __metadata("design:returntype", Promise)
], 구매.prototype, "\uAD6C\uB9E4", null);
function install(cts) {
    return new 구매(cts);
}
exports.install = install;
//# sourceMappingURL=%EA%B5%AC%EB%A7%A4.js.map