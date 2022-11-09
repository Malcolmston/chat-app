
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

app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + login));
});

app.post('/login', urlencodedParser, (req, res) => {
let { ussername, pswd } = req.body

	
validate(ussername, pswd).then(function(data){
		if(data){
getNewlogIn(ussername, pswd).then(function(p) {
	let {first_name, last_name, username, password} = ( p[0] )

	you = first_name +' '+ last_name +' '+  username

	io.on('connection', (socket) => {
			io.emit('whoAreyou', you);
						});
	res.redirect('/chat');
})

			
	
			
		}else{
			console.log('fail')
		}
})

	
	
});

app.post('/signup', urlencodedParser, (req, res) => {
	let { Fame, Lame, ussername, pswd } = req.body
	you = Fame + " " + Lame + " " + ussername

	addNewuser(Fame, Lame, ussername, pswd ).then(function(data) {
		if(!data){
				io.on('connection', (socket) => {
							io.emit('whoAreyou', you);
						});
			 res.redirect('/chat');
			
		}else{
			console.log('fail')
		}
	})
	
});

app.get('/chat', function(req, res){
    //res.send("Redirected to User Page");
	res.sendFile(__dirname + chat);

});

app.get('/home',function(req, res) {
	res.redirect('/');
	res.sendFile(path.resolve(__dirname + login));
})

//logout
http.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`);
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

	socket.on('sendingPERSON', function(msg1) {
console.log( msg1 )
	})
	
})


io.on('connection', (socket) => {
	socket.on('chat message', msg => {
		io.emit('chat message', msg);
	});
});




/*
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

	socket.on('sendingPERSON', function(msg1) {
console.log( msg1 )
	})
	
})


io.on('connection', (socket) => {
	socket.on('chat message', msg => {
		io.emit('chat message', msg);
	});
});


http.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`);
});


*/