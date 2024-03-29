const {
  addUser,
  validate,
  getAll,

  addChats,
  recalChats,

  createRoomAndJoin,
  validateRoomAndGroup,

  removeUser,
  updateUser,
  updatePassword,
} = require("./sequelize.js");

const {
  add_roomA,
  add_memberA,
  getAllusersA,
  remove_memberA,
} = require("./place.js");

var secret = require("./secret.js"); //.session

const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const cors = require("cors");

var express = require("express"),
  session = require("express-session"),
  app = express(),
  http = require("http").Server(app),
  path = require("path"),
  socket = require("socket.io"),
  router = express.Router(),
  io = socket(http);

const sessionMiddleware = session({
  genid: function (req) {
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: secret.session,
  resave: true,
  saveUninitialized: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))



app.use(sessionMiddleware);
app.use(
  cors({
    origin: "*",
  })
);

// gets both pages as urls
const login = "/accountPage.html";
const chat = "/homePage.html";
// gets the port
const port = process.env.PORT || 3000;

// get all different items in the array
Array.prototype.difference = function (arr) {
  return this.filter((x) => !arr.includes(x));
};

// gets the all similar items in the array
Array.prototype.similarity = function (arr) {
  return this.filter((x) => arr.includes(x));
};

// the home page
app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname + login));
});

// retrives the .md file
app.get("/README.md", function (req, res) {
  res.sendFile(path.join(__dirname + "/README.md"));
});



// these are the methods that if called will send you back to the login page
app.get("/signup", function (request, response) {
  response.redirect("/");
  response.sendFile(path.resolve(__dirname + login));
});
app.get("/login", function (request, response) {
  response.redirect("/");
  response.sendFile(path.resolve(__dirname + login));
});
app.get("/logout", function (request, response) {
  response.redirect("/");
  response.sendFile(path.resolve(__dirname + login));
});
app.post("/home", function (request, response) {
  response.redirect("/");
  response.sendFile(path.resolve(__dirname + login));
});

// gets the inputs from the user on the sign up page
app.post("/signup", function (request, response) {
  // gets the input fields
  let ussername = request.body.ussername;
  let password = request.body.password;

  // makes sure the input fields exists and are not empty
  if (ussername && password) {
    validate(ussername, false, 'or').then(function (params) {
      if (!params) {
        request.session.loggedin = true;
        request.session.ussername = ussername;
        //request.session.password = password;
        addUser(ussername, password).then(function (e) {

          validate(ussername, false, 'or', false).then(console.log)

          if(!e){
            response.writeHead(409, { "content-type": "text/html" });

            response.statusMessage =
              "this account may have been removed!";
    
            response.end(`
                      <h1>this account may have been removed!</h1>
                      <form id='home' action='/logout' method="post">
                      <input type="submit" value="log out" onclick='removeUser()'/>
                      </form>
                      `);

          }else{
            request.session.room = e;
            response.redirect("/home");
          }


          
        });

        
      } else {
        response.writeHead(400, { "content-type": "text/html" });
        response.statusMessage =
          "an account with that username already exsits!";

        response.end(`
                  <script>
                  function removeUser() {
                      localStorage.removeItem('username');
                      localStorage.removeItem('password');
                  }
                  </script>
                  <h1>an account with that username already exsits!</h1>
                  <form id='home' action='/logout' method="post">
                  <input type="submit" value="log out" onclick='removeUser()'/>
                  </form>
                  `);
      }
    });
  } else {
    response.writeHead(401, { "content-type": "text/html" });

    response.statusMessage = "Please enter username and Password!";

    response.end(`
          <script>
                  function removeUser() {
                      localStorage.removeItem('username');
                      localStorage.removeItem('password');
                  }
                  </script>
                  <h1>Please enter username and Password!</h1>
                  <form id='home' action='/logout' method="post">
                  <input type="submit" value="log out" onclick='removeUser()'/>
                  </form>
                  `);
    //response.end();
  }
});

// gets the inputs from the user on the log in page
app.post("/login", function (request, response) {
  // gets the input fields
  let ussername = request.body.ussername;
  let password = request.body.password;
  // makes sure the input fields exists and are not empty
  if (ussername && password) {
    validate(ussername, password).then(function (params) {
      //console.log(params)

      if (params) {
        request.session.loggedin = true;
        request.session.ussername = ussername;
        // request.session.password = password;

        response.redirect("/home");
        response.end();
      } else {
        //response.writeHead(400);
        response.writeHead(401, { "content-type": "text/html" });

        response.statusMessage = "incorrect username and/or password!";

        response.end(`
                  <script>
                  function removeUser() {
                      localStorage.removeItem('username');
                      localStorage.removeItem('password');
                  }
                  </script>
                  <h1>incorrect username and/or password!</h1>
                  <form id='home' action='/logout' method="post">
                  <input type="submit" value="log out" onclick='removeUser()'/>
                  </form>
                  `);
      }
    });
  } else {
    //response.writeHead(400);
    response.writeHead(400, { "content-type": "text/html" });

    response.statusMessage = "Please enter username and Password!";

    response.end(`
          <script>
          function removeUser() {
              localStorage.removeItem('username');
              localStorage.removeItem('password');
          }
          </script>
                  <h1>Please enter username and Password!</h1>
                  <form id='home' action='/logout' method="post">
                  <input type="submit" value="log out" onclick='removeUser()'/>
                  </form>
                  `);

    //response.end('hi');
  }
});

// gets when the user logs out
app.post("/logout", function (request, response) {
  try {
    remove_memberA(request.session.ussername);
  } catch (e) {
    console.log(e);
  }

  request.session.destroy();
  response.redirect("/");
});

// sends the user to the home page
app.get("/home", function (request, response) {
  // If the user is loggedin
  if (request.session.loggedin) {
    //next file
    var option = {
      headers: {
        user: request.session.ussername,
      },
    };
    //response.sendFile(path.resolve(__dirname + login));
    response.sendFile(path.join(__dirname + chat), option);

    // Output username
    //response.send('Welcome back, ' + request.session.ussername + '!');
  } else {
    // Not logged in
    //response.writeHead(400);
    response.writeHead(403, { "content-type": "text/html" });

    response.statusMessage = "Please login to view this page!";

    response.end(`
          <script>
          function removeUser() {
              localStorage.removeItem('username');
              localStorage.removeItem('password');
          }
          </script>
                  <h1>Please login to view this page!</h1>
                  <form id='home' action='/logout' method="post">
                  <input type="submit" value="log out" onclick='removeUser()'/>
                  </form>
                  `);
  }
  //response.end();
});



// this curently dose nothing, however it will handle admin stuff 
app.post("/api/table", function (request, res) {
  let username = request.body.username;
  let password = request.body.password;
  let uuid = request.body.uuid;
  let table = request.body.table;
});

//this will validate the account if the user needs athentication 
app.post("/api/account/validate", function (request, response) {
  // gets the input fields
  let username = request.body.username;
  let password = request.body.password;

  // makes sure the input fields exists and are not empty
  if (username && password) {
    validate(username, password).then(function (params) {
      response.json({
        username: username,
        valid: params,
      });
    });
  } else {
    response.json({
      error: "Invalid username or password",
    });
  }
});

//when a user wants to change there username this will handle this. 
app.post("/api/account/changeUsername", async function (request, response) {
  let body = request.body;

  let v = await validate(body.curr_username, body.curr_password);
  let v1 = await validate(body.new_username, body.curr_password);

  if (v && !v1) {
    let r = await updateUser(body.curr_username, body.new_username);

    try {
      remove_memberA(request.session.ussername);
    } catch (e) {
      console.log(e);
    }

    // request.session.destroy();

    request.session.loggedin = true;
    request.session.ussername = body.new_username;
    // request.session.password = password;

    //next file
    var option = {
      headers: {
        user: request.session.ussername,
      },
    };
    //response.sendFile(path.resolve(__dirname + login));
    response.sendFile(path.join(__dirname + chat), option);

    // Output username
    //response.send('Welcome back, ' + request.session.ussername + '!');

    /*

    response.json({
      old: {
        o_username: body.curr_username,
        o_password: body.curr_password,
      },
      new: {
        n_username: body.new_username,
      },
      transaction: r
    });
    */
  } else {
    if (!v) {
      response.json({
        error: "the perameters that were enterd are invalid!",
      });
    } else if (v1) {
      response.json({
        error: "the new username that you selected already exsits!",
      });
    }
  }
});

//when a user want to change their passwor this will do that
app.post("/api/account/changePassword", async function (request, response) {
  let body = request.body;

  let v = await validate(body.curr_username, body.curr_password);

  if (v) {
    let r = await updatePassword(body.curr_username, body.new_password);

    request.session.loggedin = true;

    //next file
    var option = {
      headers: {
        user: request.session.ussername,
      },
    };
    //response.sendFile(path.resolve(__dirname + login));
    response.sendFile(path.join(__dirname + chat), option);
  }
});

//when the user wants to remove there account the perameters of the delete reqest are located and handle
app.post("/api/account/remove", function (request, response) {
  let body = request.body;

  try {
    remove_memberA(request.session.ussername);
  } catch (e) {
    console.log(e);
  }
  if (body.username != request.session.ussername) {
    response.json({
      error: "Invalid username",
    });
  } else {
    removeUser(body.username, body.password).then(function (e) {
      response.json({
        res: e,
      });
    });
  }
});

/* 
gets the server as from http 
use could use app.js socket.io http for listening to the server
*/
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

// on enitial log in this will use the session to identify the user
io.use((socket, next) => {
  const session = socket.request.session;
  socket.session = session;

  validate(session.ussername, false, "or").then(function (x) {
    if (session && session.loggedin && x) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });
});

// this block will run when the client connects
io.on("connection", (socket) => {
  let s = socket.request.session;

  // on enitial log in this will use the session to identify the user
  socket.use((socket, next) => {
    validate(s.ussername, false, "or").then(function (x) {
      if (s && s.loggedin && s.ussername && x) {
        next();
      } else {
        next(new Error("unauthorized"));
      }
    });
  });

// makes sure the user is logged in
  socket.on("error", (err) => {
    if (err && err.message === "unauthorized") {
      socket.disconnect();
    }
  });

  const session = socket.request.session;

  socket.username = "";
  socket.chat_room = "";

// connects the user to sockets if there account is authenticated. if the account is invalid there sockets are turned off, otherwise they may chat 
  socket.on("logedin", function (user) {
    validate(user, false, "or").then(async function (x) {
      if (!x && session.ussername != user) {
        console.log("fail!!!!!!!");

        socket.disconnect();
      } else {
        add_memberA(user);
        socket.username = user;

        var c = await getAll();

        totalUsers = c.map((x) => x.username);

        // a is the not loged in usr
        let a = totalUsers.difference(getAllusersA());
        // b is all the loged in users
        let b = totalUsers.similarity(getAllusersA());
        a = a.map((x) => [x, false]);
        b = b.map((x) => [x, true]);

        let t = a.concat(b);

        socket.broadcast.emit("people", t);
        socket.emit("people", t);
      }
    });
  });

  // when a usere delets there account this updates the user list so users no longer see the pill
  socket.on("logremove", async function (user) {
    remove_memberA(user);

    var c = await getAll();

    totalUsers = c.map((x) => x.username);
    //.difference

    // a is the not loged in usr
    let a = totalUsers.difference(getAllusersA());
    // b is all the loged in users
    let b = totalUsers.similarity(getAllusersA());
    a = a.map((x) => [x, false]);
    b = b.map((x) => [x, true]);

    let t = a.concat(b);

    t = t.filter((x) => x[0] != user);

    socket.broadcast.emit("people", t);
  });

  // when a user logs out it dose a less derastic version of logremove. This function just sets your pill to inactive
  socket.on("logedout", async function (user) {
    remove_memberA(user);

    var c = await getAll();

    totalUsers = c.map((x) => x.username);
    //.difference

    // a is the not loged in usr
    let a = totalUsers.difference(getAllusersA());
    // b is all the loged in users
    let b = totalUsers.similarity(getAllusersA());
    a = a.map((x) => [x, false]);
    b = b.map((x) => [x, true]);

    let t = a.concat(b);

    socket.broadcast.emit("people", t);
  });


// will eitere join or create a room when called. if the room is called then it will join it and send all of the messages to the client.
  socket.on("persistence", function (a) {
    setTimeout(function () {
      validateRoomAndGroup(...a).then(async function (j) {
        if (j == undefined || j.length == 0) {
          console.error(
            "#1. there were no rooms with the serched peramerters. the room with the current peramerters will be created."
          );

          createRoomAndJoin(...a, true).then((x) => {
            setTimeout(async function () {
              validateRoomAndGroup(...a).then(async function (j) {
                if (j == undefined || j.length == 0) {
                  //socket.emit("persistence#1", []);
                  console.error(
                    "#2. there were no rooms with the serched peramerters. the room with the current peramerters will be created."
                  );
                } else {
                  x = j[0].room;

                  //console.log(`room: ${x} `)
                  add_roomA(...a);
                  socket.join(x);

                  socket.chat_room = x;

                  //console.log(j)

                  recalChats(x).then(function (arr) {
                    socket.emit("persistence", arr);
                  });
                }
              });
            }, 100);
          });
        } else {
          createRoomAndJoin(...a).then((x) => {
            validateRoomAndGroup(...a).then(async function (j) {
              x = j[0].room;
              //console.log(`room: ${x} `)
              add_roomA(...a);
              socket.join(x);

              socket.chat_room = x;

              recalChats(x).then(function (arr) {
                socket.emit("persistence", arr);
              });
            });
          });
        }
      });
    }, 100);
  });

  socket.on(socket.chat_room, (room) => {
    socket.to(socket.chat_room).emit("sent", room);
  });

  // when a user is typing this will send that message to the chat room
  socket.on("typping", function (a) {
    socket.to(socket.chat_room).emit(
      "typping",
      {
        room: socket.chat_room,
        name: socket.username,
      },
      a
    );
  });
  // when a user is done typing this will send that message to the chat room
  socket.on("ntypping", function (a) {
    socket.to(socket.chat_room).emit(
      "ntypping",
      {
        room: socket.chat_room,
        name: socket.username,
      },
      a
    );
  });

  // once a message is sent this will check if the server is unable to connect to a room. if the room is unavailable then it will retrieve it. If the room is available it will just join it. when either are true then this will send a message to the room.
  socket.on("message", async (message, a,u) => {
    let who = a;
    if (!socket.chat_room) {
      createRoomAndJoin(...a).then((x) => {
        validateRoomAndGroup(...a).then(async function (j) {
          x = j[0].room;
          //console.log(`room: ${x} `)
          add_roomA(...a);
          socket.join(x);

          socket.chat_room = x;

          let ids = await io.to(socket.chat_room).allSockets();

          // Array.from(ids).includes()

          addChats(socket.username, message, socket.chat_room).then((time) => {
            if( socket.username == '' || socket.username.trim() == '' || socket.username.length == 0 || socket.username == undefined || socket.username == null || u == '' || u == undefined ){
              socket.emit('error','sender was not specified')
            }else{
            //console.log(  {name: socket.username ,message: message, time: time} )
            io.to(socket.chat_room).emit(
              "message",
              {
                room: socket.chat_room,
                name: (u ==  socket.username && !(u == '' || socket.username == '') ) ? socket.username : u,
                message: message,
                time: time,
              },
              a
            );

            //console.log(  socket.id , Array.from(ids).includes(socket.id) )
            socket.to(socket.chat_room).emit("sent", socket.username, a);
            }
          });
        });
      });
    } else {
      let ids = await io.to(socket.chat_room).allSockets();

      // Array.from(ids).includes()

      addChats(socket.username, message, socket.chat_room).then((time) => {
        //console.log(  {name: socket.username ,message: message, time: time} )
        io.to(socket.chat_room).emit(
          "message",
          {
            room: socket.chat_room,
            name: socket.username,
            message: message,
            time: time,
          },
          a
        );

        //console.log(  socket.id , Array.from(ids).includes(socket.id) )
        socket.to(socket.chat_room).emit("sent", socket.username, who);
      });
    }
  });
});

//http://localhost:3000/
