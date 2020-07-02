"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const router_1 = require("./auth/router");
const bird_1 = __importDefault(require("./bird"));
const cat_1 = __importDefault(require("./cat"));
const config_1 = __importDefault(require("./config"));
const entities_1 = require("./entities/entities");
const app = express_1.default();
app.use(express_1.default.json());
let admin = undefined;
// app.use(bodyParser.urlencoded({ extended: false }));
const connection = typeorm_1.createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "johnny",
    password: "Johnnybigbos1237",
    database: "Nodeapp",
    entities: [
        entities_1.User,
        "models/*.ts"
    ],
    synchronize: true,
    logging: false,
    migrationsTableName: "custom_migration_table",
    migrations: ["migration/*.ts"],
    cli: {
        "migrationsDir": "migration"
    }
}).then(async (connection) => {
    const userRepo = connection.getRepository(entities_1.User);
    console.log("Using UserRepo to find all users");
    console.log(await userRepo.find());
    const users = await connection.manager.find(entities_1.User, { id: 1 });
    admin = users.length ? users[0] : undefined;
    console.log("logging inside the then");
    console.log(admin);
});
app.use('/auth', router_1.login_router); // this route does not have to by pass token verification that authenticated_router does 
app.use(router_1.authenticated_router);
app.use('/birds', bird_1.default);
app.use('/cats', cat_1.default);
const get_article_json = (article_id) => {
    return {
        id: article_id,
        title: `article ${article_id}`
    };
};
app.get('/', function (req, res) {
    res.send('Hello World! Our admin is ' + admin.name);
})
    .get('/favoris', function (req, res) {
    res.send('Favoris');
})
    .get('/articles/:article_id', function (req, res) {
    res.json(get_article_json(req.params.article_id));
});
app.route('/book')
    .get(function (req, res) {
    res.send('Get a random book');
})
    .post(function (req, res) {
    res.send('Add a book');
})
    .put(function (req, res) {
    res.send('Update the book');
});
app.listen(config_1.default.port, function () {
    console.log(`Example app listening on port ${config_1.default.port}!`);
});
