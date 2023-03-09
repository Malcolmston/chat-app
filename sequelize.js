const bcrypt = require("bcrypt");

const sqlite3 = require("sqlite3");
const { Sequelize, DataTypes, Op, QueryTypes, where } = require("sequelize");

const db = new sqlite3.Database("uses.sqlite");
//https://github.com/sequelize/sequelize/issues/10304
const sequelize = new Sequelize("uses", "", "", {
  dialect: "sqlite",
  storage: "uses.sqlite",
  benchmark: true,
  standardConformingStrings: true
});


// creates the Chats table
const chats = sequelize.define(
  "chats",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    room: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

// creates the Users Table
const Users = sequelize.define(
  "users",
  {
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,

    deletedAt: "deletedAt",
    paranoid: true,
  }
);

// creates the Rooms table
const Rooms = sequelize.define(
  "rooms",
  {
    room: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
      defaultValue: generateString(12),
    },
  },
  {
    timestamps: true,
    sequelize,
    paranoid: true,

    // If you want to give a custom name to the deletedAt column
    deletedAt: "destroyTime",
  }
);

// creates the Users_Rooms table that contains the ides from both Users and Rooms
const Host = sequelize.define(
  "Users_Rooms",
  {},
  {
    timestamps: true,
    paranoid: true,

    // If you want to give a custom name to the deletedAt column
    deletedAt: "destroyTime",
  }
);

//https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#eager-loading-with-many-to-many-relationships
Users.belongsToMany(Rooms, { through: Host });
Rooms.belongsToMany(Users, { through: Host });



// FIXME: this looks like https://flexiple.com/javascript/javascript-array-equality/
function isEqual(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function generateString(length) {
let characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let result = " ";
const charactersLength = characters.length;
for (let i = 0; i < length; i++) {
  result += characters.charAt(Math.floor(Math.random() * charactersLength));
}

return result;
}

//encripts string
function hide(text) {
return new Promise(function (resolve, reject) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(text, salt, function (err, hash) {
      if (err) return reject(err);

      // Store hash in your password DB.
      resolve(hash);
    });
  });
});
}


// FIXME: what does the return value look like?
// sorts arrays into neet chunks t
Array.prototype.chunk = function (chunkSize) {
  var array = this;
  return [].concat.apply(
    [],
    array.map(function (elem, i) {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  );
};



//https://stackoverflow.com/questions/23305747/javascript-permutation-generator-with-permutation-length-parameter
// gets all the possible permutation of the given array with constraints. 
Array.prototype.getPermutations = function (maxLen) {
  function getPermutations(list, maxLen) {
    // Copy initial values as arrays
    var perm = list.map(function (val) {
      return [val];
    });
    // Our permutation generator
    var generate = function (perm, maxLen, currLen) {
      // Reached desired length
      if (currLen === maxLen) {
        return perm;
      }
      // For each existing permutation
      for (var i = 0, len = perm.length; i < len; i++) {
        var currPerm = perm.shift();
        // Create new permutation
        for (var k = 0; k < list.length; k++) {
          perm.push(currPerm.concat(list[k]));
        }
      }
      // Recurse
      return generate(perm, maxLen, currLen + 1);
    };
    // Start with size 1 because of initial values
    return [
      ...new Set(
        generate(perm, maxLen, 1)
          .map((x) => x.sort())
          .filter((arr) => [...new Set(arr)].length != 1)
          .map((x) => x.toString())
      ),
    ].map((x) => x.split(","));
  }

  return getPermutations(this, maxLen);
};




// FIXME: what's the purpose of this?
// gets all infermatin in a Table
async function getAll(From = "users", paranoid= true) {
  let users;
  switch (From) {
    case "chats":
      users = await chats.findAll({paranoid:paranoid});
      return users;

    case "users":
      users = await Users.findAll({paranoid:paranoid});
      return users;

    case "rooms":
      users = await Rooms.findAll({paranoid:paranoid});
      return users;

    case "Users_Rooms":
    case "host":
      users = await Host.findAll({paranoid:paranoid});
      return users;

    default:
      users = await Users.findAll({paranoid:paranoid});
      return users;
  }
}





// FIXME: This says "in the room", but there's no "room" parameter??
// gets if user should be in the room
async function validateRoom(user) {
  // FIXME: why are we attempting to add a user when validating?
  let r = await addUser(user);

  let f = (await getAll("host")).map((x) => [x.userId, x.roomId]);
  let h = (await getAll("users")).map((x) => x.username);
  let i = (await getAll("rooms")).map((x) => x.room);

  let g = f.map((x) => x[0]);
  let j = f.map((x) => x[1]);
  let k = [...new Set(j)][0];

  return (
    (g.map((x) => x.toString()).includes(r.id.toString()) ||
      g.map((x) => Number(x)).includes(Number(r.id))) &&
    (i[Number(k) - 1] || false)
  ); //isEqual( ([r]).map( x => x.id ), g )
}

// FIXME: what does this return?
// gets the room people are in
async function validateRoomAndGroup(...people) {
  //  let thisnwe = await resetAuto('rooms')
  let u = await getAll("users", false);
  let h = await getAll("host",false);
  let r = await getAll("rooms", false);

  let usernames = u.map((x) => x.username);
  usernames = await Promise.all(usernames);
  let rooms = r.map((x) => x.room);
  rooms = await Promise.all(rooms);

  let userIds = h.map((x) => x.userId - 1);
  userIds = await Promise.all(userIds);
  let roomIds = h.map((x) => x.roomId - 1);
  roomIds = await Promise.all(roomIds);

  let a = userIds.map((x) => usernames[x]).chunk(2); //.map( x => x.sort() )

  let b = [...new Set(roomIds.map((x) => rooms[x]))];

  let c = a.map(function (room, index) {
    return {
      room: b[index],
      users: room,
    };
  });

  c = c.filter(function (obj, index) {
    return (
      obj.users.toString() == people.toString() ||
      obj.users.reverse().toString() == people.toString()
    );
  });

  return c;

  // usernames = usernames.getPermutations(2)
}

// FIXME: what happens if the input isn't two users?
// creates a room with the given users
async function addRoom(...users) {
  let room = generateString(12);

  let a = users.map(async function (userA) {
    // let c = await addUser(userA)

    let a = await validateRoom(userA);

    let b = await addUser(userA);

    let res = await createRoom(a); // u ? await createRoom(await addUser(userA)) : false

    return res.room;
  });

  let b = await Promise.all(a);

  // FIXME: What is this doing??
  return [...new Set(b)].length < a.length ? [...new Set(b)] : false;
}

// FIXME: what does this mean??
// finds a room the room by the users
async function findRoom(...users) {
  let obj = await validateRoomAndGroup(...users);
  let t;

  if (obj.length == 0) {
    t = await createRoomAndJoin(...users);
    // FIXME: why is this recursive?
    return await findRoom(...users);
  } else if (obj.length == 1 && isEqual(obj[0].users, users)) {
    return obj[0].room;
  } else {
    let a = obj.filter((x) => isEqual(x.users, users));

    if (isEqual([], a)) {
      return undefined;
    } else {
      return a[0].room;
    }
  }
}

// FIXME: what does this mean?
// adds the user to the users table
async function addUser(username, password) {
  if (password) {
    let e = await hide(password.toString());
    let user = null

    try{
      user = await Users.create({
     username: username, password: e 
    });

    return true;

  }catch(e) {
    console.error(e);

    return false;
  }


  } else {
    let user = await Users.findOne({ where: { username: username } });

    return user;
  }
}








// FIXME: how is this different from `updateUser`?
// updates the username
async function resetUsername(o_username, n_username) {
  let arr = chats.update({ name: n_username }, { where: { name: o_username } });

  return arr;
}

// FIXME: deletes the *username*? Why does this need a password? (Admin can't delete?)
// deletes the username
async function removeUser(username, password) {
  // get user id to get the number to delete from the forgen table
  let userID = await getUser(username);
  userID = userID.id;

  //get all of the rooms seqences that you can join to delete
  let rooms = await Host.findAll({ where: { userId: userID } });
  //rooms.map(x => x.roomId)
  rooms = rooms.map(async function (x) {
    let rooms = await Host.findAll({
      where: {
        [Op.and]: [{ userId: userID }, { roomId: x.roomId }],
      },
    });
    return rooms;
  });

  rooms = (await Promise.all(rooms)).flat();

  // gets all the room codes that you have chatted with
  let codes = await Rooms.findAll({
    where: {
      id: {
        [Op.or]: rooms.map((x) => x.roomId),
      },
    },
  });

  let canre = validate(username, password);

  if (!canre) return false;

  await chats.destroy({
    where: {
      room: {
        [Op.or]: codes.map((x) => x.room),
      },
    },
  });

  await Rooms.destroy({
    where: {
      id: {
        [Op.or]: rooms.map((x) => x.roomId),
      },
    },
  });

  await Host.destroy({
    where: { userId: userID },
  });

  await Users.destroy({
    where: { username: username },
  });

  return true;
}

// FIXME: what does update mean? What do the parameters mean?
// updates the password
async function updatePassword(o_username, n_password) {
  const user = await Users.findOne({ where: { username: o_username } });

  if (user) {
    let e = await hide(n_password.toString());

    user.password = e;

    let r = await user.save();

    return r;
  } else {
    return "User not found";
  }
}

// FIXME: what does update mean? What do the parameters mean?
// updates the username for api callback
async function updateUser(o_username, n_username) {
  let user = await Users.findOne({ where: { username: o_username } });

  if (user) {
    user.username = n_username;

    let r = await user.save();

    await resetUsername(o_username, n_username);
    return r;
  } else {
    return "User not found";
  }

  return e;
}

// gets a use by username
async function getUser(username) {
  let user = await Users.findOne({ where: { username: username } });

  return user;
}

// FIXME: parameters are not explained.
//gets if an acount is available
function validate(username, password, s = "and", p=true) {
  return new Promise(async (resolve, reject) => {
    if (s == "and" && !username && !password) return;
    if (s == "or" && !username) return;
    //await sequelize.sync({ force: true });

    let res;

    if (s == "and") {
      res = await Users.findOne({
        where: {
          username: username,
        },
      });

      if (res == null) {
        resolve(false);
        return false;
      }

      bcrypt.compare(password, res.password, function (err, result) {
        resolve(result);
        // result == true
      });

      return res !== null;
    }
    if (s == "or") {
      res = await Users.findOne({
        where: {
          username: username,
        },
        paranoid: p
      });

      resolve(res !== null);
    }
  });
}



// FIXME: what does `r` mean??
// FIXME: Also this name is misleading.
// creates or finds a room. rooms are created if the r perameter is not provided. 
async function createRoom(r) {
  let [room, c] = await Rooms.findOrCreate({
    where: { room: r || generateString(12) },
  });
  return room;
}
// this adds users to a romm
async function addUsertoRoom(room, ...user) {
  let arr = [];
  user.forEach(async function (user) {
    arr.push(user.addRooms(room));
    //await user.addRooms(room);
  });

  let all = await Promise.all(arr);

  //let fetchedUsers = await getAll('host')
  return all; //fetchedUsers;
}
// FIXME: the description talks about *adding* users, misleading name?
// FIXME: the only place this is called is by `findRoom`, what?
// this adds 2 users to a room and if there is no room with the avilible data then it passes false. if the force perameter is passesd a room is created no mattere what
function createRoomAndJoin(userA, userB, force = false) {
  return new Promise(async (resolve, reject) => {
    let a = await validateRoom(userA); //users.map(validateRoom)
    let b = await validateRoom(userB); //await Promise.all(a)

    let c;
    let d;
    let e;
    let f;

    if (force) {
      c = await addUser(userA);

      d = await addUser(userB);

      e = await createRoom();

      f = await addUsertoRoom(e, c, d);
      resolve(e.room);
    } else if (!a || !b) {
      c = await getUser(userA);

      d = await getUser(userB);

      e = await createRoom();

      f = await addUsertoRoom(e, c, d);
      resolve(e.room);
    } else {
      resolve(a);
    }
  });
}





//when a user sends a chat it is added to the database so theat perssitance works
async function addChats(name, message, room) {
  //await sequelize.sync({ force: true });
  let res = await chats.create({
    name: name,
    message: message,
    room: room,
  });

  //await resetAuto('chats')

  //  res = await chats.findAll();

  // FIXME: why is a new date being returned? Why not the date in the database? (Causes dates to change on client.)
  return new Date(); //res;
}

// FIXME: what does this mean?? The definition just repeats the name.
//this function recals all of the chats.
async function recalChats(id) {
  //let id = await findRoom(...user)

  if (id === undefined) {
    return undefined;
  }

  //const [res, metadata] = await sequelize.query("SELECT * FROM rooms WHERE `room` = '"+id+"'  ");

  let res = await chats.findAll({
    where: {
      room: {
        [Op.eq]: id,
      },
    },
  });

  return res;
}




// if the force perameter is enabled the table will clear all the table
(async function () {
  await sequelize.sync({ force: false });
})();

// FIXME: Which functions are internal use only?
module.exports = {
  updatePassword,
  removeUser,
  updateUser,

  generateString,
  addUser,
  getUser,
  validate,
  getAll,
  hide,

  addChats,
  recalChats,

  validateRoom,
  addUsertoRoom,
  addRoom,
  findRoom,
  createRoom,
  createRoomAndJoin,
  validateRoomAndGroup,
};
