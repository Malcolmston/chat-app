//npm install body-parser express express-session http path socket.io sqlite3 node-fetch@2


const {
	addNewuser,
	validate,
	getAll,

	addChats,
	recalChats,


} = require("./sql.js")

const {
	add_roomA,
	find_roomA,
	add_memberA,
	getAllusersA,
	remove_memberA
} = require("./place.js")

var bodyParser = require('body-parser'),
	express = require("express"),
	session = require('express-session'),
	app = express(),
	http = require('http').Server(app),
	path = require('path'),
	socket = require('socket.io'),
	router = express.Router(),
	io = socket(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// gets both pages as urls
const login = '/accountPage.html'
const chat = '/homePage.html'

// gets the port
const port = process.env.PORT || 3000

// get all different items in the array
Array.prototype.difference = function (arr) {
	return this.filter(x => !arr.includes(x));
}

// gets the all similar items in the array
Array.prototype.similarity = function (arr) {
	return this.filter(x => arr.includes(x));
}




// the home page
app.get('/', function (request, res) {
	//res.sendFile(path.resolve(__dirname + login));
	res.sendFile(path.resolve(__dirname + login));
});


// gets the inputs from the user on the sign up page
app.post('/signup', function (request, response) {
	// gets the input fields
	let ussername = request.body.ussername;
	let password = request.body.password;
	// makes sure the input fields exists and are not empty
	if (ussername && password) {
		validate(ussername, password).then(function (params) {
			if (!params) {
				request.session.loggedin = true;
				request.session.ussername = ussername;
				addNewuser(ussername, password).then(console.log)

				response.redirect('/home')
			} else {
				response.send('an account with that username already exsits!')
			}
		})
	} else {
		response.send('Please enter username and Password!');
		response.end();
	}


});

// gets the inputs from the user on the log in page
app.post('/login', function (request, response) {
	// gets the input fields
	let ussername = request.body.ussername;
	let password = request.body.password;
	// makes sure the input fields exists and are not empty

	if (ussername && password) {
		validate(ussername, password).then(function (params) {
			if (params) {
				request.session.loggedin = true;
				request.session.ussername = ussername;
				request.session.you = request.body

				response.redirect('/home')
				response.end();
			} else {
				response.send('incorrect username and/or password!');
			}
		})
	} else {
		response.send('Please enter username and Password!');
		response.end();
	}


})

// gets when the user logs out
app.post('/logout', function (request, response) {
	remove_memberA(request.session.ussername)

	request.session.destroy()
	response.redirect('/')
})

// sends the user to the home page
app.get('/home', function (request, response) {

	// If the user is loggedin
	if (request.session.loggedin) {
		//next file
		var  option = {
				headers: {
					"user": request.session.ussername				}
			}


		

		//response.sendFile(path.resolve(__dirname + login));
		response.sendFile(path.join(__dirname + chat), option);


		// Output username
		//response.send('Welcome back, ' + request.session.ussername + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');

	}
	//response.end();
})






/* 
gets the server as from http 
use could use app.js socket.io http for listening to the server
*/
http.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// this block will run when the client connects
io.on('connection', socket => {
	socket.username = ""
	socket.chat_room = ""

	socket.on('logedin', async function (user) {
		add_memberA(user)
		socket.username = user;

		var c = await getAll()

		totalUsers = c.map(x => x.username)
		//.difference

		// a is the not loged in usr
		let a = totalUsers.difference(getAllusersA())
		// b is all the loged in users
		let b = totalUsers.similarity(getAllusersA())
		a = a.map(x => [x, false])
		b = b.map(x => [x, true])

		let t = a.concat(b)

		socket.broadcast.emit('people', t)
		socket.emit('people', t)

	})

	socket.on('logedout', async function (user) {
		remove_memberA(user)

		var c = await getAll()

		totalUsers = c.map(x => x.username)
		//.difference

		// a is the not loged in usr
		let a = totalUsers.difference(getAllusersA())
		// b is all the loged in users
		let b = totalUsers.similarity(getAllusersA())
		a = a.map(x => [x, false])
		b = b.map(x => [x, true])

		let t = a.concat(b)

		socket.broadcast.emit('peopleO', t)
		//	socket.emit('peopleO',t  )

	})

	socket.on('persistence', function (a) {
		console.log(a)
		recalChats(a).then(function (arr) {
			arr = arr.map(x => x.message)
			socket.emit('persistence', arr)
		})
	})


	socket.on('room', room => {
		let j = add_roomA(...room)

		socket.join(j);

		socket.chat_room = j

		socket.emit('message', 'this is a message just for you')

	})

	socket.on('find room', room => {
		let other = socket.chat_room.replace(socket.username, '')
		let j = find_roomA(room).code

		socket.join(j);
		socket.chat_room = j

		socket.emit('message', 'this is a message just for you')


	})

	socket.on('message', message => {
		let other = socket.chat_room.replace(socket.username, '')
		//socket.broadcast.emit(other, `a message was sent from ${socket.username}`);

		socket.broadcast.emit(other, socket.username);


		addChats(socket.username, message, socket.chat_room).then(() => {
			io.to(socket.chat_room).emit('message', message);
		})

	})
})