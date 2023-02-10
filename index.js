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
} = require("./sequelize.js");

const {
  add_roomA,
  add_memberA,
  getAllusersA,
  remove_memberA,
} = require("./place.js");

var secret = require("./secret.js")//.session

const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const cors = require('cors');

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
  genid: function (req) {
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: secret.session,
  resave: true,
  saveUninitialized: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(sessionMiddleware);
app.use(cors({
  origin: '*'
}));


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
    validate(ussername, false, 'or').then(function (params) {
      if (!params) {
        request.session.loggedin = true;
        request.session.ussername = ussername;
        //request.session.password = password;
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
      console.log(params)

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

//sets the inside of the iframe to the iframe.html
app.get("/html/iframe.html", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/iframe.html"));
});

app.get("/css/app.css", function (req, res) {
  res.sendFile(path.join(__dirname + "/css/app.css"));
});

app.get("/css/login.css", function (req, res) {
  res.sendFile(path.join(__dirname + "/css/login.css"));
});

app.get("/html/css/chat.css", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/css/chat.css"));
});

app.get("/html/css/nav.css", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/css/nav.css"));
});

app.get("/js/markdown.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/js/markdown.js"));
});

app.get("/js/socket.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/js/socket.js"));
});

app.get("/js/welcolm.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/js/welcolm.js"));
});

app.get("/js/login.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/js/login.js"));
});

app.get("/html/js/nav.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/js/nav.js"));
});

app.get("/html/js/pill.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/js/pill.js"));
});

app.get("/html/js/slides.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/js/slides.js"));
});

app.get("/README.md", function (req, res) {
  res.sendFile(path.join(__dirname + "/README.md"));
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
app.post("/api/table", async function (request, response) {
  let r = request.body.table;
  let a = await getAll(r);

  response.json({
    data: a,
    table: r,
  });
});

app.post("/api/account/remove", function (request, response) {
  let body = request.body;

  removeUser(body.username, body.password).then(function (e) {
    response.json({
      username: body.username,
      password: body.password,
      res: e,
    });
  });
});

app.post("/api/account/change", function (request, response) {
  let body = request.body;

  updateUser();
  response.json({
    old: {
      o_username: body.curr_username,
      o_password: body.curr_password,
    },
    new: {
      n_username: body.new_username,
      n_password: body.new_password,
    },
  });
})
*/

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
  }else{
    response.json({
      error: 'Invalid username or password'
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

io.use((socket, next) => {
  const session = socket.request.session;
  socket.session = session;

  validate(session.ussername, false, 'or').then(function (x) {

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
  socket.use((socket, next) => {
    console.log(s.ussername)
    validate(s.ussername, false, 'or').then(function (x) {
      if (s && s.loggedin && s.ussername && x) {
        next();
      } else {
        next(new Error("unauthorized"));
      }
    });
  });

  socket.on("error", (err) => {
    if (err && err.message === "unauthorized") {
      socket.disconnect();
    }
  });


  const session = socket.request.session;

  socket.username = "";
  socket.chat_room = "";

  socket.on("logedin", function (user) {
    validate(user, false, 'or').then(async function (x) {
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
                if (j == undefined || j.length == 0) {
                  //socket.emit("persistence#1", []);
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
  //s.room

  socket.on(socket.chat_room, (room) => {
    socket.broadcast.emit("sent", room);
  });

  socket.on("message", async (message, who) => {
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
        who
      );

      //console.log(  socket.id , Array.from(ids).includes(socket.id) )
      socket.broadcast.emit("sent", socket.username, who);

      // socket.broadcast.emit(socket.chat_room, who)

      //socket.broadcast.emit( 'sent', who.filter(x => x != socket.username )[0] )
    });
  });
});

//http://localhost:3000/
