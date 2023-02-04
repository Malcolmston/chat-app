const {
  addUser,
  validate,
  getAll,

  addChats,
  recalChats,

  createRoomAndJoin,
  validateRoomAndGroup,
} = require("./database/sequelize.js");

const {
  add_roomA,
  add_memberA,
  getAllusersA,
  remove_memberA,
} = require("./place.js");

var bodyParser = require("body-parser"),
  express = require("express"),
  session = require("express-session"),
  app = express(),
  http = require("http").Server(app),
  path = require("path"),
  socket = require("socket.io"),
  router = express.Router(),
  cookie = require("cookie"),
  url = require("url"),
  io = socket(http);

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(sessionMiddleware);

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

//app.get('/userHost', onRequest)

// gets the inputs from the user on the sign up page
app.post("/signup", function (request, response) {
  // gets the input fields
  let ussername = request.body.ussername;
  let password = request.body.password;

  // makes sure the input fields exists and are not empty
  if (ussername && password) {
    validate(ussername, password).then(function (params) {
      if (!params) {
        request.session.loggedin = true;
        request.session.ussername = ussername;
        request.session.password = password;
        addUser(ussername, password).then(function (e) {
          request.session.room = e;
        });

        response.redirect("/home");
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
      if (params) {
        request.session.loggedin = true;
        request.session.ussername = ussername;
        request.session.password = password;

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

io.use((socket, next) => {
  const session = socket.request.session;
  socket.session = session;

  validate(session.ussername, session.password).then(function (x) {
    if (session && session.loggedin && session.ussername && x) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });
});

// this block will run when the client connects
io.on("connection", (socket) => {
  let s = socket.request.session;
  socket.use((socket, next) => {
    validate(s.ussername, s.password).then(function (x) {
      if (s && s.loggedin && s.ussername && x) {
        next();
      } else {
        next(new Error("unauthorized"));
      }
    });
  });

  socket.on("error", (err) => {
    console.log(err);

    if (err && err.message === "unauthorized") {
      socket.disconnect();
    }
  });

  const session = socket.request.session;

  socket.username = "";
  socket.chat_room = "";

  socket.on("logedin", function (user) {
    validate(user, s.password).then(async function (x) {
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

    socket.broadcast.emit("peopleO", t);
  });

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
                x = j[0].room
                
                if (j == undefined || j.length == 0) {
                  //socket.emit("persistence#1", []);
                } else {
                  //console.log(`room: ${x} `)
                  add_roomA(...a);
                  socket.join(x);

                  socket.chat_room = x;

                  console.log(j)

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
              x = j[0].room
                  //console.log(`room: ${x} `)
            add_roomA(...a);
            socket.join(x);

            socket.chat_room = x;


            recalChats(x).then(function (arr) {
              socket.emit("persistence", arr);
            });
            })
        
          });
        }
      });
    }, 100);
  });
  //s.room
/*
  socket.on("room", async (room) => {
      // socket.chat_room = await createRoomAndJoin(...room);
      let j = socket.chat_room;

      if (j == undefined || j.trim().length == 0) {
        let r = await createRoomAndJoin(...room);

        //console.log(r);
        socket.chat_room = r;
        j = socket.chat_room;
      }
      
      add_roomA(...room);

      console.log(`room: ${j} `)

      socket.join(j);
  });
  */

  socket.on("message", async (message, who) => {
    addChats(socket.username, message,socket.chat_room).then((time) => {
      //console.log(  {name: socket.username ,message: message, time: time} )
      io.to(socket.chat_room).emit("message", {
        name: socket.username,
        message: message,
        time: time,
      });
    });
  });
});

//http://localhost:3000/
