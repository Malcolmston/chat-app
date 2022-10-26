// all the imports
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const fetch = require('node-fetch')


var urlencodedParser = bodyParser.urlencoded({ extended: false })
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login/main.html');
});
    
app.post('/login', urlencodedParser, (req, res) => {
    console.log('login:', req.body);
    res.sendStatus(200);
});

app.post('/signup', urlencodedParser, (req, res) => {
    console.log('signup:', req.body);

	const {Fame, Lame, ussername, pswd} = req.body
	var adr = `http://malcolm.great-site.net/index.php?Fame=${Fame}&Lame=${Lame}&ussername=${ussername}&pswd=${pswd}`

//console.log(adr)

//open(adr);


});

var server = app.listen(5000, function () {
    console.log('Server is listening at port 5000...');
});


//http://malcolm.great-site.net/index.php?Fame=malcolm&Lame=stone&ussername=Malca&pswd=MAlcolmstone1s