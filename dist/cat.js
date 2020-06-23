"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
