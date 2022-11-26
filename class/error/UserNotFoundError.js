"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserNotFoundError extends Error {
    constructor(member) {
        super(`user ${member.user.tag} was not found.`);
    }
}
exports.default = UserNotFoundError;
//# sourceMappingURL=UserNotFoundError.js.map