const {MassagelogIn, MassagesignIn} = require('./notification.js')


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('uses.sqlite');
var chats = new sqlite3.Database('chats.sqlite');
var Promise = require('promise');
const fetch = require('node-fetch');

 function getAll() {
	
	return new Promise((resolve, reject) => {
		db.all("SELECT * FROM users", [], (err, rows) => {

			if (err) {
				//reject(err)

				 crateTable().then(function() {
					return getAll()
	 	 })
				
			} else {
				resolve(rows)
			}


		});
	})
}

function crateTable(name ='users'){
		return new Promise((resolve, reject) => {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS  "+name+"  (person_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)");
resolve( 'done')
		
		})

			
		})
}

function addNewuser(fname, lname, username, password) {
	return new Promise((resolve, reject) => {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS  users  (person_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)");



			var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");

			stmt.run(null, fname, lname, username, password);

			stmt.finalize();

			validate(username, password).then(function(ask){
				if(!ask){
								db.all("SELECT * FROM users", [], (err, rows) => {
			    if( !err && !rows ){
			        MassagesignIn(undefined);
					resolve( false)
			    }
			    if( err ){
			       MassagesignIn(false);
					resolve( false)
			        //reject(err)
			    }
			    MassagesignIn(true);
				resolve( true)

			});
				}else{
					resolve( false )
				}
			})

		})

	});

}

function getNewlogIn(username, password) {
	return new Promise((resolve, reject) => {


		db.all("SELECT * FROM users", [], (err, rows) => {
		    if( !err && !rows ){
		        MassagesignIn(undefined);
		    }

			if (err) {
			    MassagesignIn(false);
				reject(err)
			} else {
				let ans = rows.filter(function(x) {
					return x['username'] == username && x['password'] == password
				})
MassagesignIn(true);
				resolve(ans)

				/*
			 resolve( rows.filter(function(x) {
		   return x['username'] == username  && x['password'] == password
	   }) )
	*/
			}


		});
	})
}

async function isEmpty() {
	 var a;
	 try {
	 	a = await getAll()
		 	return ( a.length >= 1 )

	 } catch (error) {
	 	 a = 'error'
		 crateTable().then(function() {
		 	isEmpty()
		 })

	 }
		

	 

}

async function validate(username, password) {
	var ans =  await getAll()

	//console.log( username, password )
	 try {
		 	return ans.filter(function(x) {
					return x['username'] == username && x['password'] == password
				}).length >= 1
		 

	 } catch (error) {

		 crateTable().then(function() {
		 	validate(username, password)
		 })
	 }
	 }




// this function adds users to the chat server
function addNewChat(messageCode, message) {
	return new Promise((resolve, reject) => {
		chats.serialize(function() {
			chats.run("CREATE TABLE IF NOT EXISTS  chats  (message_id INTEGER PRIMARY KEY AUTOINCREMENT, messageCode TEXT NOT NULL, message TEXT NOT NULL)");



			var stmt = chats.prepare("INSERT INTO users VALUES (?,?,?)");

			stmt.run(null,messageCode, message);

			stmt.finalize();

			chats.all("SELECT * FROM chats", [], (err, rows) => {
			    if( !err && !rows ){

			    }
			    if( err ){

			        reject(err)
			    }

				resolve( rows)

			});
		})

	});

}

//db
exports.addNewuser = addNewuser;
exports.getNewlogIn = getNewlogIn;
exports.validate = validate;
exports.isEmpty = isEmpty;
exports.getAll = getAll;

//chat
exports.addNewChat = addNewChat;