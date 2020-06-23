"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authent_1 = require("./authent");
const bird_1 = __importDefault(require("./bird"));
const cat_1 = __importDefault(require("./cat"));
const app = express_1.default();
app.use(authent_1.authent_middleware);
app.use('/birds', bird_1.default);
app.use('/cats', cat_1.default);
const get_article_json = (article_id) => {
    return {
        id: article_id,
        title: `article ${article_id}`
    };
};
app.get('/', function (req, res) {
    res.send('Hello World!');
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
app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});
