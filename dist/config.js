"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    access_token_signature: process.env.ACCESS_TOKEN_SIGNATURE,
    refresh_token_signature: process.env.REFRESH_TOKEN_SIGNATURE,
    port: process.env.PORT
};
exports.default = config;
