"use strict";
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
const tears_1 = __importDefault(require("../data/tears"));
function editUserInfoMsg(cts, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfoMsg = yield cts.client.channels.cache.get('1025347124294070282').messages.fetch('1025975950439088168');
        const r = [];
        for (const userID in data) {
            const userData = data[userID];
            r.push(`<@${userID}>님 (ID: ${userData.id.toString().padStart(6, '0')}) 의 정보:\n` +
                '```\n' +
                `${tears_1.default[userData.티어]} Lv. ${userData.레벨} / EXP ${userData.경험치}\n` +
                `공격력: ${userData.공격력} / 체력: ${userData.체력}\n` +
                `소지품:\n` +
                `  R ${userData.R}\n` +
                `장착:\n` +
                `  무기: ${userData.무기}\n` +
                `  방어구: ${userData.방어구}\n` +
                '```');
        }
        yield userInfoMsg.edit(r.join('\n\n'));
    });
}
exports.default = editUserInfoMsg;
//# sourceMappingURL=editUserInfoMsg.js.map