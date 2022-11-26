"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const TOKEN = process.env.TOKEN || require('../config.json').token;
exports.config = {
    token: TOKEN,
    slash: {
        guild: '953302487065034785',
    },
};
//# sourceMappingURL=config.js.map