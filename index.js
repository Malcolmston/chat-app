const { MassagelogIn, MassagesignIn,costom } = require('./notification.js')
const { addNewuser, getNewlogIn, validate, isEmpty, getAll, createChat, addNewChat,getChats} = require('./sql.js');
var { express, bodyParser, fetch, urlencodedParser } = require('./modules.js');

const app = require('express')();
var fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const login = '/login/main.html'
const chat = '/chat/main.html'
//const redirect = '/redirect/main.html'

var path = require('path');
var you;

function time(hours,minutes,seconds){
    var d;
d = new Date();

if(hours){
     d.setHours(d.getHours() + hours);
}
if(minutes){
   d.setMinutes(d.getMinutes() + minutes);
 
}
if(seconds){
   d.setSeconds(d.getSeconds() + seconds);
 
}

//alert(d.getMinutes() + ':' + d.getSeconds()); //11:55
return d 
}

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
	// creats the chat table 
	createChat();
res.sendFile(__dirname + chat);
});



app.get('/home',function(req, res) {
	res.redirect('/');
	res.sendFile(path.resolve(__dirname + login));
})

//logout
http.listen(port, () => {
	//crateChats()
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
		console.log('a user ' + data.username + ' connected login');

	});

	socket.on('signup', function(data) {
		console.log('a user ' + data.username + ' connected signup');

	});
	
})


io.on('connection',  async function(socket) {
   var msg1 = await getRoomName(socket); 
   
	socket.on('chat message',  async function(msg,room){
//if( room == msg1){
	
	let ans = await addNewChat(room,msg,you)
	io.emit(room, you+' : '+msg+' : '+(new Date() ));    
//}

		
	});
});


async function getRoomName(socket){
return new Promise((resolve, reject) => {
        	socket.on('room name', function(msg1) {
        	   resolve(msg1)
        	})
})


}


io.on('connection', function(socket) {
	socket.on('persistence', async function(data) {
	var d = await getChats(data)
		console.log( d )
		socket.emit('persistence', d)
	});


	
})


//addNewChat()

//percistance