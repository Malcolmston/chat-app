const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const fetch = require('node-fetch')

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})


exports.express = express;
exports.bodyParser = bodyParser;
exports.app = app;
exports.fetch = fetch;
exports.urlencodedParser = urlencodedParser;