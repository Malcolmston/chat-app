var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("uses.sqlite");
var Promise = require("promise");
const fetch = require("node-fetch");

function getDay() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  return mm + "/" + dd + "/" + yyyy;
}

function getAll(From = "users") {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${From}`, [], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function crateTable(name = "users") {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.run(
        `CREATE TABLE IF NOT EXISTS ${name} (person_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)`
      );
      resolve("done");
    });
  });
}

//adds a new user with the headers
function addNewuser(username, password) {
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.run(
        "CREATE TABLE IF NOT EXISTS  users  (person_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)"
      );
      var stmt = db.prepare("INSERT INTO users VALUES (?,?,?)");
      stmt.run(null, username, password);
      stmt.finalize();
      validate(username, password).then(function (ask) {
        if (!ask) {
          db.all("SELECT * FROM users", [], (err, rows) => {
            if (!err && !rows) {
              resolve(false);
            }
            if (err) {
              resolve(false);
              //reject(err)
            }
            resolve(true);
          });
        } else {
          resolve(false);
        }
      });
    });
  });
}
// get a new login
function getNewlogIn(username, password) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (!err && !rows) {
      }
      if (err) {
        reject(err);
      } else {
        let ans = rows.filter(function (x) {
          return x["username"] == username && x["password"] == password;
        });
        resolve(ans);
      }
    });
  });
}
//asyncernisly get if users is empty
async function isEmpty() {
  var a;
  try {
    a = await getAll("users");
    return a.length >= 1;
  } catch (error) {
    a = "error";
    crateTable().then(function () {
      isEmpty();
    });
  }
}
//is the log in valid?
async function validate(username, password) {
  var ans = await getAll("users");
  //console.log( username, password )
  try {
    return (
      ans.filter(function (x) {
        //(a | b) == 1

        return x["username"] == username && x["password"] == password;
      }).length >= 1
    );
  } catch (error) {
    crateTable().then(function () {
      validate(username, password);
    });
  }
}

//creates the sqlite database that will store all chats
function crearChats() {
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(
        "CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY, name TEXT, message TEXT, room TEXT, time TEXT)"
      );
      resolve(true);
    });
  });
}

//when a user sends a chat it is added to the database so theat perssitance works
function addChats(name, message, room) {
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(
        `INSERT INTO chats (name, message, room ,time) VALUES ('${name}', '${message}','${room}', '${getDay()}')`
      );
      resolve(getDay());
    });
  });
}

//this function recals all of the chats.
function getChats() {
  //note this function is called but never used
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all("SELECT * FROM chats", function (err, rows) {
        if (err) reject(err);
        console.log(rows);
        resolve(rows);
      });
    });
  });
}

// gets all cats from a room name with the var id.
function recalChats(id) {
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      //get all chats that contain both your username and the senders username
      /*db.all(`SELECT * FROM chats WHERE room LIKE '%${id[0]}%' AND room LIKE '%${id[1]}%'`, function (err, rows) { */
      db.all(`SELECT * FROM chats`, function (err, rows) {
        //room(id[0]) && room.includes(id[1])
        rows = rows.filter((row) => {
          let { room } = row;
          return room == id[0] + "" + id[1] || room == id[1] + "" + id[0];
        });

        if (err) reject(err);
        resolve(rows);
      });
    });
  });
}

// loads all the basic sqlite that will start the servers
crateTable().then(crearChats());

module.exports = {
  addNewuser,
  validate,
  getAll,

  addChats,
  getChats,
  recalChats,
};