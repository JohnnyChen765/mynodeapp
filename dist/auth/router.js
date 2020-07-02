"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_refresh_auth = exports.check_bearer_auth = exports.check_basic_auth = exports.login_router = exports.authenticated_router = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
exports.authenticated_router = express_1.default.Router();
exports.login_router = express_1.default.Router();
const EXPIRATION_ACCESS_TOKEN = 60 * 60; // in seconds
const EXPIRATION_REFRESH_TOKEN = 60 * 60; // in seconds
const REFRESH_TOKEN_DB = [];
// middleware that is specific to this router
exports.check_basic_auth = (encoded_basic_string) => {
    const b = new Buffer(encoded_basic_string, 'base64');
    const [client_id, client_secret] = b.toString().split(':');
    if (client_id == 'client_id' && client_secret == 'client_secret') {
        console.log(client_id);
        console.log(client_secret);
        return true;
    }
    return false;
};
exports.check_bearer_auth = (jwt_token) => {
    try {
        const jwt_payload = jsonwebtoken_1.default.verify(jwt_token, config_1.default.access_token_signature);
        // will also check expiration date if "exp" field is in the jwt
        return [true, jwt_payload];
    }
    catch (err) {
        console.log(err);
        return [false, {}];
    }
};
exports.check_refresh_auth = (jwt_token) => {
    try {
        const jwt_payload = jsonwebtoken_1.default.verify(jwt_token, config_1.default.refresh_token_signature);
        // will also check expiration date if "exp" field is in the jwt
        return [true, jwt_payload];
    }
    catch (err) {
        console.log(err);
        return [false, {}];
    }
};
exports.authenticated_router.use(function (req, res, next) {
    console.log("Checking auth");
    const authorization_header = req.header('Authorization');
    if (authorization_header == undefined) {
        res.end('No Authorization header');
    }
    const [token_type, token] = authorization_header.split(' ');
    switch (token_type) {
        case 'Basic':
            if (!exports.check_basic_auth(token))
                res.end("Not valid basic token");
        case 'Bearer':
            if (!exports.check_bearer_auth(token)[0])
                res.end("Not valid access token");
    }
    next();
});
const validate_login = (username, password) => {
    return (username === "my_username") && (password === "my_password");
};
const generate_access_token = (payload) => {
    delete payload.exp;
    return jsonwebtoken_1.default.sign(payload, config_1.default.access_token_signature, { expiresIn: EXPIRATION_ACCESS_TOKEN });
};
const generate_refresh_token = (payload) => {
    delete payload.exp;
    return jsonwebtoken_1.default.sign(payload, config_1.default.refresh_token_signature, { expiresIn: EXPIRATION_REFRESH_TOKEN });
};
exports.login_router.get('/login', (req, res) => {
    console.log("Trying to get access_token");
    // Normally, check if can get access_token, for example the application using the Basic Token
    // const authorization_header = req.header('Authorization')
    // if (authorization_header == undefined) {
    //     res.end('No Authorization header')
    // }
    const { grant_type } = req.body;
    if (grant_type === 'password') {
        const { username, password } = req.body;
        if (!validate_login(username, password))
            res.end('Invalid login');
        const payload = {
            name: 'johnny',
            scopes: ["admin"]
        };
        const token = generate_access_token(payload);
        const refresh_token = generate_refresh_token(payload);
        REFRESH_TOKEN_DB.push(refresh_token);
        res.json({ token: token, refresh_token: refresh_token });
    }
    if (grant_type === 'refresh_token') {
        const { refresh_token } = req.body;
        if (!refresh_token)
            res.end('No refresh token');
        if (!REFRESH_TOKEN_DB.includes(refresh_token))
            res.end('Invalid refresh token');
        const [valid_token, payload] = exports.check_refresh_auth(refresh_token);
        if (!valid_token)
            res.end('Invalid refresh token');
        const token = generate_access_token(payload);
        res.json({ token: token });
    }
});
exports.login_router.get('/refresh_token', (req, res) => {
    console.log("Trying to use refresh_token");
    // Normally, check if can get access_token, for example the application using the Basic Token
    // const authorization_header = req.header('Authorization')
    // if (authorization_header == undefined) {
    //     res.end('No Authorization header')
    // }
    const { refresh_token } = req.body;
    if (!refresh_token)
        res.end('No refresh token');
    if (!REFRESH_TOKEN_DB.includes(refresh_token))
        res.end('Invalid refresh token');
    const [valid_token, payload] = exports.check_refresh_auth(refresh_token);
    if (!valid_token)
        res.end('Invalid refresh token');
    const token = generate_access_token(payload);
    res.json({ token: token });
});
