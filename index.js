var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('uses.sqlite');
var Promise = require('promise');

function addNewuser(fname, lname, username, password) {
	return new Promise((resolve, reject) => {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS  users  (person_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)");



			var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");

			stmt.run(null, fname, lname, username, password);

			stmt.finalize();

			db.all("SELECT * FROM users", [], (err, rows) => {
				resolve(err || rows)

			});
		})

	});

}

function getNewlogIn(username, password) {
	return new Promise((resolve, reject) => {


		db.all("SELECT * FROM users", [], (err, rows) => {

			if (err) {
				reject(err)
			} else {
				console.log(rows.filter(function(x) {
					return x['username'] == username && x['password'] == password
				}))

				resolve(rows.filter(function(x) {
					return x['username'] == username && x['password'] == password
				}))

				/*
			 resolve( rows.filter(function(x) {
		   return x['username'] == username  && x['password'] == password
	   }) )
	*/
			}


		});
	})
}


function validate(username, password) {
	return new Promise((resolve, reject) => {


		db.all("SELECT * FROM users", [], (err, rows) => {

			if (err) {
				reject(err)
			} else {
				resolve( rows.filter(function(x) {
					return x['username'] == username && x['password'] == password
				}).length > 0  )

				/*
			 resolve( rows.filter(function(x) {
		   return x['username'] == username  && x['password'] == password
	   }) )
	*/
			}


		});
	})
}
/*
	
db.all("SELECT * FROM users", [], (err, rows) => {
if (err) {
throw err;
}
rows.forEach((row) => {
console.log(row);
});
	
});

*/






//getNewlogIn('Malca','d').then(console.log)  



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
	let { Fame, Lame, ussername, pswd } = req.body

	getNewlogIn(ussername, pswd).then(console.log)


});


app.post('/signup', urlencodedParser, (req, res) => {


	let { Fame, Lame, ussername, pswd } = req.body

	validate(ussername,pswd).then(function (p ) {
		if(!p){
				
addNewuser(Fame,Lame,ussername,pswd).then(function(p) {
	console.log(p )
})
		}
	})



});


var server = app.listen(8080, function() {
	console.log('Server is listening at port 5000...');
	console.log('http://192.168.0.104/5000/')
});



//http://malcolm.great-site.net/index.php?Fame=malcolm&Lame=stone&ussername=Malca&pswd=MAlcolmstone1s