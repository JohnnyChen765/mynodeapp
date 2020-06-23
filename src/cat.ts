import express from 'express'

const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('This is the cat route');
    next();
});
// define the home page route
router.get('/', function (req, res) {
    res.send('cats home page');
});
// define the about route
router.get('/about', function (req, res) {
    res.send('About cats');
});

export default router