
const {
	addNewuser,
	validate,
	getAll,

	addChats,
	getChats,
	recalChats
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
	localStorage = require('localStorage'),
	router = express.Router(),
	io = socket(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const login = '/accountPage.html'
const chat = '/homePage.html'
const port = process.env.PORT || 3000

Array.prototype.difference = function(arr) {
	return this.filter(x => !arr.includes(x));
}

Array.prototype.similarity = function(arr) {
	return this.filter(x => arr.includes(x));
}



function setUser(user) {
	//	localStorage.setItem('username', user);
}

function removeUser() {
	//	localStorage.removeItem('username');
}

function getUser() {
	return false//localStorage.getItem('username')

}


//the innitial file loader
app.get('/', function(request, res) {
	//get login file
	if (getUser()) {
		request.session.loggedin = true;
		request.session.ussername = getUser();


		res.redirect('/home')
	} else {
		res.sendFile(path.resolve(__dirname + login));
	}

});


// http://localhost:3000/signup
app.post('/signup', function(request, response) {
	// gets the input fields
	let ussername = request.body.ussername;
	let password = request.body.password;
	// makes sure the input fields exists and are not empty
	if (ussername && password) {
		validate(ussername, password).then(function(params) {
			if (!params) {
				request.session.loggedin = true;
				request.session.ussername = ussername;
				setUser(ussername);
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

app.post('/login', function(request, response) {
	// gets the input fields
	let ussername = request.body.ussername;
	let password = request.body.password;
	// makes sure the input fields exists and are not empty

	if (ussername && password) {
		validate(ussername, password).then(function(params) {
			if (params) {
				request.session.loggedin = true;
				request.session.ussername = ussername;
				setUser(ussername);
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

app.post('/logout', function(request, response) {
	remove_memberA(request.session.ussername)

	io.on('connection', socket => {

		socket.on('logedin', async function(user) {
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
	})
	removeUser();
	request.session.destroy()
	response.redirect('/')
})

app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		//next file

		var option = {
			headers: {
				"user": request.session.ussername
			}
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

