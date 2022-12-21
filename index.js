
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


//the innitial file loader
app.get('/', function(req, res) {
    //get login file
    res.sendFile(path.resolve(__dirname + login));
});
//gets the login html form
app.post('/login', urlencodedParser, (req, res) => {
    let {
        ussername,
        pswd
    } = req.body


    validate(ussername, pswd).then(function(data) {
        if (data) {
            getNewlogIn(ussername, pswd).then(function(p) {
                let {
                    first_name,
                    last_name,
                    username,
                    password
                } = (p[0])

                you = first_name + ' ' + last_name + ' ' + username

                io.on('connection', (socket) => {
                    io.emit('whoAreyou', you);
                });
                res.redirect('/chat');
            })




        } else {
            console.log('fail')
        }
    })



});
//gets the signup html form
app.post('/signup', urlencodedParser, (req, res) => {
    let {
        Fame,
        Lame,
        ussername,
        pswd
    } = req.body
    you = Fame + " " + Lame + " " + ussername

    addNewuser(Fame, Lame, ussername, pswd).then(function(data) {
        if (!data) {
            io.on('connection', (socket) => {
                io.emit('whoAreyou', you);
            });
            res.redirect('/chat');

        } else {
            console.log('fail')
        }
    })

});
//opens the chat html
app.get('/chat', function(req, res) {
    // creats the chat table 
    createChat();
    res.sendFile(__dirname + chat);
});
//returns the user home if there is a time out
app.get('/home', function(req, res) {
    res.redirect('/');
    res.sendFile(path.resolve(__dirname + login));
})
/* 
gets the server as from http 
use could use app.js socket.io http for listening to the server
*/
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

