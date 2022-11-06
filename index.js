
const { MassagelogIn, MassagesignIn } = require('./notification.js')
const { addNewuser, getNewlogIn, validate, isEmpty, getAll } = require('./sql.js');
var { express, bodyParser, fetch, urlencodedParser } = require('./modules.js');

const app = require('express')();
var fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


const login = '/login/main.html'
const chat = '/chat/main.html'

var path = require('path');

var you;

// just one string with the path
app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + login));
});


app.post('/login', urlencodedParser, (req, res) => {
	let { Fame, Lame, ussername, pswd } = req.body


	getNewlogIn(ussername, pswd).then(function(params) {
		// res.end('Hi!')
		res.sendFile(__dirname + chat);
	})

});

app.post('/signup', urlencodedParser, (req, res) => {


	let { Fame, Lame, ussername, pswd } = req.body

	you = Fame + " " + Lame + " " + ussername
	
	isEmpty().then(function(ans) {
		console.log(you)
		if (ans) {
			addNewuser(Fame, Lame, ussername, pswd).then(function(params) {
				res.sendFile(__dirname + chat);

				io.on('connection', (socket) => {
					io.emit('whoAreyou', you);
				});

			})
		} else {
			validate(ussername, pswd).then(function(p) {
				if (!p) {
					addNewuser(Fame, Lame, ussername, pswd).then(function(params) {
						res.sendFile(__dirname + chat);

						io.on('connection', (socket) => {
							io.emit('whoAreyou', you);
						});
					})


				} else {
					console.log('fail')
				}

			})
		}
	})

});




// server (back-end)



getAll().then(function(e) {
	io.on('connection', (socket) => {
		io.emit('dataTransvor', e);
	});

})

io.on('connection', function(socket) {
	console.log(io.engine.clientsCount)


	socket.on('login', function(data) {
		console.log('a user ' + data.ussername + ' connected login');

	});

	socket.on('signup', function(data) {
		console.log('a user ' + data.ussername + ' connected signup');

	});

})


io.on('connection', (socket) => {
	socket.on('chat message', msg => {
		io.emit('chat message', msg);
	});
});


http.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`);
});


