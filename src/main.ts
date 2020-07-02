import express from 'express'
import "reflect-metadata"
import { createConnection } from 'typeorm'
import { authenticated_router, login_router } from './auth/router'
import bird from './bird'
import cat from './cat'
import config from './config'
import { User } from './entities/entities'

const app = express()
app.use(express.json())
let admin: User | undefined = undefined
// app.use(bodyParser.urlencoded({ extended: false }));


const connection = createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "johnny",
    password: "Johnnybigbos1237",
    database: "Nodeapp",
    entities: [
        User,
        "models/*.ts"
    ],
    synchronize: true,
    logging: false,
    migrationsTableName: "custom_migration_table",
    migrations: ["migration/*.ts"],
    cli: {
        "migrationsDir": "migration"
    }
} as any).then(async connection => {
    const userRepo = connection.getRepository(User)
    console.log("Using UserRepo to find all users")
    console.log(await userRepo.find())

    const users = await connection.manager.find(User, { id: 1 })
    admin = users.length ? users[0] : undefined
    console.log("logging inside the then")
    console.log(admin)
})

app.use('/auth', login_router) // this route does not have to by pass token verification that authenticated_router does 
app.use(authenticated_router)
app.use('/birds', bird);
app.use('/cats', cat);


const get_article_json = (article_id: string) => {
    return {
        id: article_id,
        title: `article ${article_id}`
    }
}

app.get('/', function (req, res) {

    res.send('Hello World! Our admin is ' + admin!.name)
})
    .get('/favoris', function (req, res) {
        res.send('Favoris')
    })
    .get('/articles/:article_id', function (req, res) {
        res.json(get_article_json(req.params.article_id))
    })

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

app.listen(config.port, function () {
    console.log(`Example app listening on port ${config.port}!`)
})