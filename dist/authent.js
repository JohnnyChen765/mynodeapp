"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authent_middleware = void 0;
exports.authent_middleware = (req, res, next) => {
    console.log("Checking authent");
    next();
};
