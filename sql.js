const {
  MassagelogIn,
  MassagesignIn
} = require('./notification.js')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('uses.sqlite');
var Promise = require('promise');
const fetch = require('node-fetch');

Date.prototype.toFormat = function(){
    let r = this.toISOString().split('T')[0].replace(/-/g,'/').split('/') 
    return r[2] +'/'+r[1]+'/'+r[0] +' '+ (this.getHours() > 12 ? 'pm '+(this.getHours()-12) : 'am '+this.getHours())   +':'+ this.getMinutes();  
  
}

function bettweenSeconds(x,y){
//2628000 is the amount of seconds in a month
return (Math.abs(x.getTime() - y.getTime())/1000) >= 2628000;
}

// gets all users in the user database
function getAll() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users",
      [], (err, rows) => {
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
//crate table users 
function crateTable(name = 'users') {
  return new Promise((resolve, reject) => {
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS  " + name + "  (person_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)");
      resolve('done')
    })
  })
}
//adds a new user with the headers
function addNewuser(fname, lname, username, password) {
  return new Promise((resolve, reject) => {
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS  users  (person_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)");
      var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");
      stmt.run(null, fname, lname, username, password);
      stmt.finalize();
      validate(username, password).then(function(ask) {
        if (!ask) {
          db.all("SELECT * FROM users",
            [],
            (err, rows) => {
              if (!err && !rows) {
                MassagesignIn(undefined);
                resolve(false)
              }
              if (err) {
                MassagesignIn(false);
                resolve(false)
                //reject(err)
              }
              MassagesignIn(true);
              resolve(true)
            });
        } else {
          resolve(false)
        }
      })
    })
  });
}
// get a new login
function getNewlogIn(username, password) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users",
      [], (err, rows) => {
        if (!err && !rows) {
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
        }
      });
  })
}
//asyncernisly get if users is empty
async function isEmpty() {
  var a;
  try {
    a = await getAll()
    return (a.length >= 1)
  } catch (error) {
    a = 'error'
    crateTable().then(function() {
      isEmpty()
    })
  }
}
//is the log in valid?
async function validate(username, password) {
  var ans = await getAll()
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
// this function adds chat to the chat server
function createChat(name = 'chat') {
  return new Promise((resolve, reject) => {
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS " + name + " (messageCode INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT NOT NULL, who TEXT NOT NULL, date TEXT NOT NULL)");
      resolve('done')
    })
  })
}
//ads chat to message
function addNewChat(code, message, who) {
	let date = new Date().toFormat()
  return new Promise((resolve, reject) => {
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS chats (message_id INTEGER PRIMARY KEY AUTOINCREMENT, messageCode TEXT NOT NULL, message TEXT NOT NULL, who TEXT NOT NULL, date TEXT NOT NULL)");
      var stmt = db.prepare("INSERT INTO chats VALUES (?,?,?,?,?)");
      stmt.run(null, code, message, who,date);
      stmt.finalize();
      db.all("SELECT * FROM chats",
        [],
        (err, rows) => {
          if (err) {
            reject(err)
          }
          resolve(rows)
        });
    })
  });
}
//gets your chats
function getChats(code) {
  return new Promise((resolve, reject) => {
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS chats (message_id INTEGER PRIMARY KEY AUTOINCREMENT, messageCode TEXT NOT NULL, message TEXT NOT NULL, who TEXT NOT NULL, date TEXT NOT NULL)");
      db.all(`SELECT * FROM chats WHERE messageCode = '${code}'`,
        [],
        (err, rows) => {
          if (err) {
			  console.log(err)
            createChat().then(function(params) {
              addNewChat(code, message, who)
            })
          } else {
            resolve(rows)
          }
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
exports.createChat = createChat;
exports.addNewChat = addNewChat;
exports.getChats = getChats;