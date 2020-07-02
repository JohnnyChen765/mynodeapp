import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
    access_token_signature: string,
    refresh_token_signature: string,
    port: string
}

const config: IConfig = {
    access_token_signature: process.env.ACCESS_TOKEN_SIGNATURE!,
    refresh_token_signature: process.env.REFRESH_TOKEN_SIGNATURE!,
    port: process.env.PORT!
};

export default config