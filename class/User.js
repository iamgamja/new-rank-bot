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
exports.User = void 0;
const calculateExp_1 = __importDefault(require("../functions/calculateExp"));
const editUserInfoMsg_1 = __importDefault(require("../functions/editUserInfoMsg"));
const UserNotFoundError_1 = __importDefault(require("./error/UserNotFoundError"));
const cooltime_1 = __importDefault(require("../data/cooltime"));
class User {
    constructor(cts, member) {
        this.cts = cts;
        this.member = member;
    }
    _setup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1025653282254880829');
            this.data = JSON.parse(this.db.content);
            if (!(this.member.id in this.data))
                throw new UserNotFoundError_1.default(this.member);
            this.userData = this.data[this.member.id];
            this.출첵coolTimeDB = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1030671119797207040');
            this.출첵coolTimeData = JSON.parse(this.출첵coolTimeDB.content);
            this.coolTimeDB = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1028912965786796144');
            this.coolTimeData = JSON.parse(this.coolTimeDB.content);
            this.도박coolTimeDB = yield this.cts.client.channels.cache.get('1025653116441464842').messages.fetch('1036179914367447041');
            this.도박coolTimeData = JSON.parse(this.도박coolTimeDB.content);
        });
    }
    add(name, n) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name === '경험치') {
                // 이전 누적 레벨 계산
                let 이전tear = this.userData.티어;
                let 이전level = this.userData.레벨;
                while (이전tear) {
                    이전tear -= 1;
                    이전level += (이전tear + 1) * 5;
                }
                const 이전누적레벨 = 이전level;
                // 설정
                const oldTear = this.userData.티어;
                const oldLevel = this.userData.레벨;
                const oldExp = this.userData.경험치;
                const [newTear, newLevel, newExp] = (0, calculateExp_1.default)(oldTear, oldLevel, oldExp + n);
                this.userData.티어 = newTear;
                this.userData.레벨 = newLevel;
                this.userData.경험치 = newExp;
                // 나중 누적 레벨 계산
                let 나중tear = this.userData.티어;
                let 나중level = this.userData.레벨;
                while (나중tear) {
                    나중tear -= 1;
                    나중level += (나중tear + 1) * 5;
                }
                const 나중누적레벨 = 나중level;
                const 추가된누적레벨 = 나중누적레벨 - 이전누적레벨;
                // 공격력, 체력 수정
                this.userData.공격력 += 추가된누적레벨;
                this.userData.체력 += 추가된누적레벨;
            }
            else {
                this.userData[name] += n;
            }
        });
    }
    mount(type, name) {
        this.userData[type] = name;
    }
    done() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.edit(JSON.stringify(this.data));
            yield (0, editUserInfoMsg_1.default)(this.cts, this.data);
            return this.userData;
        });
    }
    can출첵() {
        return __awaiter(this, void 0, void 0, function* () {
            const canTime = this.출첵coolTimeData[this.member.id];
            const result = {
                can출첵: false,
                canTime,
            };
            if (this.member.id in this.출첵coolTimeData) {
                const d = new Date();
                d.setHours(d.getHours() + 9); // 시차 적용
                if (canTime <= d.getTime()) {
                    result.can출첵 = true; // 시간이 지났으므로 가능
                }
            }
            else {
                result.can출첵 = true; // 아직 실행한 적이 없으면 가능
            }
            if (result.can출첵) {
                // db 수정
                const d = new Date();
                d.setHours(d.getHours() + 9);
                d.setMilliseconds(0);
                d.setSeconds(0);
                d.setMinutes(0);
                d.setHours(0);
                d.setDate(d.getDate() + 1);
                this.출첵coolTimeData[this.member.id] = d.getTime();
                yield this.출첵coolTimeDB.edit(JSON.stringify(this.출첵coolTimeData));
            }
            return result;
        });
    }
    can공격(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            const canTime = this.coolTimeData[channelID][this.member.id];
            const result = {
                can공격: false,
                canTime,
            };
            if (this.member.id in this.coolTimeData[channelID]) {
                if (canTime <= new Date().getTime()) {
                    result.can공격 = true; // 시간이 지났으므로 가능
                }
            }
            else {
                result.can공격 = true; // 아직 실행한 적이 없으면 가능
            }
            if (result.can공격) {
                // db 수정
                this.coolTimeData[channelID][this.member.user.id] = new Date().getTime() + cooltime_1.default[channelID] * 1000;
                yield this.coolTimeDB.edit(JSON.stringify(this.coolTimeData));
            }
            return result;
        });
    }
    can도박() {
        return __awaiter(this, void 0, void 0, function* () {
            const canTime = this.도박coolTimeData[this.member.id];
            const result = {
                can도박: false,
                canTime,
            };
            if (this.member.id in this.도박coolTimeData) {
                if (canTime <= new Date().getTime()) {
                    result.can도박 = true; // 시간이 지났으므로 가능
                }
            }
            else {
                result.can도박 = true; // 아직 실행한 적이 없으면 가능
            }
            if (result.can도박) {
                // db 수정
                this.도박coolTimeData[this.member.user.id] = new Date().getTime() + 60 * 1000;
                yield this.도박coolTimeDB.edit(JSON.stringify(this.도박coolTimeData));
            }
            return result;
        });
    }
    get 누적레벨() {
        let tear = this.userData.티어;
        let level = this.userData.레벨;
        while (tear) {
            tear -= 1;
            level += (tear + 1) * 5;
        }
        return level;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map