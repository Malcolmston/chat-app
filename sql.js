const {MassagelogIn, MassagesignIn} = require('./notification.js')


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('uses.sqlite');
var Promise = require('promise');
const fetch = require('node-fetch');

function addNewuser(fname, lname, username, password) {
	return new Promise((resolve, reject) => {
		db.serialize(function() {
			db.run("CREATE TABLE IF NOT EXISTS  users  (person_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)");



			var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");

			stmt.run(null, fname, lname, username, password);

			stmt.finalize();

			db.all("SELECT * FROM users", [], (err, rows) => {
			    if( !err && !rows ){
			        MassagesignIn(undefined);
			    }
			    if( err ){
			        MassagesignIn(false);
			        reject(err)
			    }
			     MassagesignIn(true);
				resolve( rows)

			});
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

function isEmpty(){
    return new Promise((resolve, reject) => {
	    db.all("SELECT * FROM users", [], (err, rows) => {

			if (err) {
				reject(err)
			} else {
				resolve(rows.length >= 1 )
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

			}


		});
	})
}

exports.addNewuser = addNewuser;
exports.getNewlogIn = getNewlogIn;
exports.validate = validate;
exports.isEmpty = isEmpty;