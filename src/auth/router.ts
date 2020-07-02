import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
export const authenticated_router = express.Router();
export const login_router = express.Router();

const EXPIRATION_ACCESS_TOKEN = 60 * 60 // in seconds
const EXPIRATION_REFRESH_TOKEN = 60 * 60// in seconds
const REFRESH_TOKEN_DB: string[] = []
// middleware that is specific to this router

export const check_basic_auth = (encoded_basic_string: string) => {
    const b = new Buffer(encoded_basic_string, 'base64')
    const [client_id, client_secret] = b.toString().split(':')
    if (client_id == 'client_id' && client_secret == 'client_secret') {
        console.log(client_id)
        console.log(client_secret)
        return true
    }
    return false
}

type jwt_checker = [true, IAcessTokenPayload] | [false, {}]

export const check_bearer_auth = (jwt_token: string): jwt_checker => {
    try {
        const jwt_payload = jwt.verify(jwt_token, config.access_token_signature) as IAcessTokenPayload
        // will also check expiration date if "exp" field is in the jwt
        return [true, jwt_payload]
    } catch (err) {
        console.log(err)
        return [false, {}]
    }
}

export const check_refresh_auth = (jwt_token: string): jwt_checker => {
    try {
        const jwt_payload = jwt.verify(jwt_token, config.refresh_token_signature) as IAcessTokenPayload
        // will also check expiration date if "exp" field is in the jwt
        return [true, jwt_payload]
    } catch (err) {
        console.log(err)
        return [false, {}]
    }
}

authenticated_router.use(function (req, res, next) {
    console.log("Checking auth")
    const authorization_header = req.header('Authorization')
    if (authorization_header == undefined) {
        res.end('No Authorization header')
    }
    const [token_type, token] = authorization_header!.split(' ')
    switch (token_type) {
        case 'Basic':
            if (!check_basic_auth(token)) res.end("Not valid basic token")
        case 'Bearer':
            if (!check_bearer_auth(token)[0]) res.end("Not valid access token")
    }
    next()
});

const validate_login = (username: string, password: string) => {
    return (username === "my_username") && (password === "my_password")
}
interface IAcessTokenPayload {
    name: string,
    scopes: Array<string>,
    exp?: number
}
const generate_access_token = (payload: IAcessTokenPayload) => {
    delete payload.exp
    return jwt.sign(payload, config.access_token_signature, { expiresIn: EXPIRATION_ACCESS_TOKEN })
}
const generate_refresh_token = (payload: IAcessTokenPayload) => {
    delete payload.exp
    return jwt.sign(payload, config.refresh_token_signature, { expiresIn: EXPIRATION_REFRESH_TOKEN })
}

login_router.get('/login', (req, res) => {
    console.log("Trying to get access_token")
    // Normally, check if can get access_token, for example the application using the Basic Token

    // const authorization_header = req.header('Authorization')
    // if (authorization_header == undefined) {
    //     res.end('No Authorization header')
    // }
    const { grant_type } = req.body

    if (grant_type === 'password') {
        const { username, password } = req.body
        if (!validate_login(username, password)) res.end('Invalid login')

        const payload = {
            name: 'johnny',
            scopes: ["admin"]
        }
        const token = generate_access_token(payload)
        const refresh_token = generate_refresh_token(payload)
        REFRESH_TOKEN_DB.push(refresh_token)
        res.json({ token: token, refresh_token: refresh_token })
    }

    if (grant_type === 'refresh_token') {
        const { refresh_token } = req.body
        if (!refresh_token) res.end('No refresh token')
        if (!REFRESH_TOKEN_DB.includes(refresh_token)) res.end('Invalid refresh token')

        const [valid_token, payload] = check_refresh_auth(refresh_token)
        if (!valid_token) res.end('Invalid refresh token')
        const token = generate_access_token(payload as IAcessTokenPayload)
        res.json({ token: token })
    }

})

login_router.get('/refresh_token', (req, res) => {
    console.log("Trying to use refresh_token")
    // Normally, check if can get access_token, for example the application using the Basic Token

    // const authorization_header = req.header('Authorization')
    // if (authorization_header == undefined) {
    //     res.end('No Authorization header')
    // }
    const { refresh_token } = req.body
    if (!refresh_token) res.end('No refresh token')
    if (!REFRESH_TOKEN_DB.includes(refresh_token)) res.end('Invalid refresh token')

    const [valid_token, payload] = check_refresh_auth(refresh_token)
    if (!valid_token) res.end('Invalid refresh token')
    const token = generate_access_token(payload as IAcessTokenPayload)

    res.json({ token: token })
})