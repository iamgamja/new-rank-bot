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
const Dungeon_1 = __importDefault(require("../data/Dungeon"));
const getUser_1 = __importDefault(require("../functions/getUser"));
function makeCommandOption(name) {
    return {
        command: {
            type: 'CHAT_INPUT',
            name: name,
            description: `${name}을 처치합니다.`,
        },
    };
}
function makeCommandFunc(cts, name) {
    return function resultFunc(i) {
        return __awaiter(this, void 0, void 0, function* () {
            yield i.deferReply();
            const member = i.member;
            const user = yield (0, getUser_1.default)(cts, member);
            if (!user) {
                yield i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' });
                return;
            }
            const userData = user.userData;
            const target = Dungeon_1.default[name];
            if (i.channelId !== target.channelID) {
                yield i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n' + `실행 가능한 채널: <#${target.channelID}>` });
                return;
            }
            const { can공격, canTime } = yield user.can공격(target.channelID);
            if (!can공격) {
                yield i.editReply({
                    content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor(canTime / 1000)}:R>`,
                });
                return;
            }
            let ispossible_strong;
            if (target.공격력 === 0) {
                ispossible_strong = true;
            }
            else {
                ispossible_strong = Math.ceil(target.체력 / userData.공격력) >= Math.ceil(userData.체력 / target.공격력) ? false : true;
            }
            if (!ispossible_strong) {
                yield i.editReply({ content: '```diff\n- 처치하지 못했습니다...\n```' });
                return;
            }
            const items = [];
            // 아이템 획득
            for (const itemName in target.드롭아이템) {
                if (Math.random() < target.드롭아이템[itemName] / 100) {
                    items.push(itemName);
                }
            }
            const items_str = items.map((s) => `+ ${s}`).join('\n');
            yield user.add('경험치', target.획득경험치);
            yield user.add('R', target.획득R);
            yield user.done();
            yield i.editReply({ content: '```diff\n처치했습니다.\n' + `+ EXP ${target.획득경험치}\n+ R ${target.획득R}\n${items_str}` + '```' });
        });
    };
}
class Dungeon extends command_ts_1.Module {
    constructor(cts) {
        super();
        this.cts = cts;
    }
    ['슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '슬라임')(i);
        });
    }
    ['풀슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '풀슬라임')(i);
        });
    }
    ['잎슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '잎슬라임')(i);
        });
    }
    ['나무슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '나무슬라임')(i);
        });
    }
    ['숲슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '숲슬라임')(i);
        });
    }
    ['작은호수슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '작은호수슬라임')(i);
        });
    }
    ['작은강가슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '작은강가슬라임')(i);
        });
    }
    ['작은강가정령'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '작은강가정령')(i);
        });
    }
    ['강슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '강슬라임')(i);
        });
    }
    ['퍼실슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '퍼실슬라임')(i);
        });
    }
    ['퍼실의정령'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '퍼실의정령')(i);
        });
    }
    ['작은언덕의슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '작은언덕의슬라임')(i);
        });
    }
    ['작은언덕정령'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '작은언덕정령')(i);
        });
    }
    ['스톤슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '스톤슬라임')(i);
        });
    }
    // 계절
    ['겨울슬라임'](i) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield makeCommandFunc(this.cts, '겨울슬라임')(i);
        });
    }
}
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('풀슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '풀슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('잎슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '잎슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('나무슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '나무슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('숲슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '숲슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('작은호수슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '작은호수슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('작은강가슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '작은강가슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('작은강가정령')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '작은강가정령', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('강슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '강슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('퍼실슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '퍼실슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('퍼실의정령')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '퍼실의정령', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('작은언덕의슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '작은언덕의슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('작은언덕정령')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '작은언덕정령', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('스톤슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '스톤슬라임', null);
__decorate([
    (0, command_ts_1.applicationCommand)(makeCommandOption('겨울슬라임')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], Dungeon.prototype, '겨울슬라임', null);
function install(cts) {
    return new Dungeon(cts);
}
exports.install = install;
//# sourceMappingURL=dungeon.js.map