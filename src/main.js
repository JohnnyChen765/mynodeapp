import express from 'express'
import { authent_middleware } from './authent'
import bird from './bird'
import cat from './cat'

const app = express()

app.use(authent_middleware)
app.use('/birds', bird);
app.use('/cats', cat);

const get_article_json = (article_id) => {
    return {
        id: article_id,
        title: `article ${article_id}`
    }
}

app.get('/', function (req, res) {
    res.send('Hello World!')
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

app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})