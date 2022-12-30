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
function makeCommandOption(name) {
    return {
        command: {
            type: 'CHAT_INPUT',
            name: name,
            description: `[관리자 전용] 다른 사람의 ${name}${name === '경험치' || name === '재화' ? '를' : '을'} 더하거나 뺍니다`,
            options: [
                {
                    name: '수치',
                    description: '더하려면 양수로, 빼려면 음수로 입력해주세요',
                    type: 'INTEGER',
                    required: true,
                },
                {
                    name: '대상',
                    description: '대상입니다.',
                    type: 'USER',
                    required: true,
                },
            ],
        },
    };
}
function makeCommandFunc(cts, name) {
    return function resultFunc(i, 수치, 대상) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, isAdmin_1.default)(i.member)) {
                yield i.reply({ content: '관리자만 사용할 수 있습니다.', ephemeral: true });
                return;
            }
            yield i.deferReply();
            const user = yield (0, getUser_1.default)(cts, 대상);
            if (!user) {
                yield i.editReply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' });
                return;
            }
            yield user.add(name === '재화' ? 'R' : name, 수치);
            const result = yield user.done();
            yield i.editReply({
                content: '✅\n' +
                    `${대상.displayName}님 (ID: ${result.id.toString().padStart(6, '0')}) 의 현재 정보:\n` +
                    '```\n' +
                    `${tears_1.default[result.티어]} Lv. ${result.레벨} / EXP ${result.경험치}\n` +
                    `공격력: ${result.공격력} / 체력: ${result.체력}\n` +
                    `소지품:\n` +
                    `  R ${result.R}\n` +
                    `장착:\n` +
                    `  무기: ${result.무기}\n` +
                    `  방어구: ${result.방어구}\n` +
                    '```',
            });
        });
    };
}
class 설정 extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    ['경험치'](i, 수치, 대상) {
        return __awaiter(this, void 0, void 0, function* () {
            yield makeCommandFunc(this.cts, '경험치')(i, 수치, 대상);
        });
    }
    ['재화'](i, 수치, 대상) {
        return __awaiter(this, void 0, void 0, function* () {
            yield makeCommandFunc(this.cts, '재화')(i, 수치, 대상);
        });
    }
    ['공격력'](i, 수치, 대상) {
        return __awaiter(this, void 0, void 0, function* () {
            yield makeCommandFunc(this.cts, '공격력')(i, 수치, 대상);
        });
    }
    ['체력'](i, 수치, 대상) {
        return __awaiter(this, void 0, void 0, function* () {
            yield makeCommandFunc(this.cts, '체력')(i, 수치, 대상);
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('경험치')),
    __param(1, (0, command_ts_1.option)('수치')),
    __param(2, (0, command_ts_1.option)('대상')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, Number, discord_js_1.GuildMember]),
    __metadata("design:returntype", Promise)
], 설정.prototype, '경험치', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('재화')),
    __param(1, (0, command_ts_1.option)('수치')),
    __param(2, (0, command_ts_1.option)('대상')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, Number, discord_js_1.GuildMember]),
    __metadata("design:returntype", Promise)
], 설정.prototype, '재화', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('공격력')),
    __param(1, (0, command_ts_1.option)('수치')),
    __param(2, (0, command_ts_1.option)('대상')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, Number, discord_js_1.GuildMember]),
    __metadata("design:returntype", Promise)
], 설정.prototype, '공격력', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('체력')),
    __param(1, (0, command_ts_1.option)('수치')),
    __param(2, (0, command_ts_1.option)('대상')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction, Number, discord_js_1.GuildMember]),
    __metadata("design:returntype", Promise)
], 설정.prototype, '체력', null);
function install(cts) {
    return new 설정(cts);
}
exports.install = install;
//# sourceMappingURL=%EC%84%A4%EC%A0%95.js.map