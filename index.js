const { MassagelogIn, MassagesignIn,costom } = require('./notification.js')
const { addNewuser, getNewlogIn, validate, isEmpty, getAll, crateChats, addNewChat, getAllchats,getAllRooms} = require('./sql.js');
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
   
	socket.on('chat message', (msg,room) => {
//if( room == msg1){
io.emit(room, room+' :'+msg);    
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

async function createID(id){
	let pos = [
		id.split('to:')[0] + 'to:'+id.split('to:')[1],
		'from:'+id.split('to:')[1] +id.split('to:')[0].replace('from',' to')
	]

	if(pos[0] === pos[1]){
		console.log('you can not send messages to yourself')
	}
	
		var rooms = await getAllRooms()
		
    	let rest = rooms.map(x => x.chatRoom).filter( x => x == pos[0] || x == pos[1] ) 


	if( rest.length >= 1 ){
		return false
	}
	if( rest.length === 0 ){
	    let r = await crateChats()
		let a = await addNewChat(id, 0, 0)
		
		return true
	}
	
	
}
