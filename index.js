
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
	crateChats()
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
	
})


io.on('connection', (socket) => {
	socket.on('chat message', msg => {
		io.emit('chat message', msg);
	});
});

io.on('connection', (socket) => {

	socket.on('sendingPERSON', function(msg1) {
	    console.log(msg1)
	})
});


io.on('connection', (socket) => {
	socket.on('dos', function(msg1) {
	    createID(msg1).then(function(s){
	        if(s){
	            console.log(' done ')
	        }else{
	            getAllRooms().then(function(x){
	                let ee = x.map(x => x.chatRoom).filter( x => x == pos[0] || x == pos[1] )[0].chatRoom
	                
	                
	                
	                io.on("connection", (socket) => {
	                    	                console.log( ee )
	                    socket.emit('messageChanel',ee);
 // socket.to(ee).emit("some event");
});

	            })
	        }
	    })
	})
});



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
