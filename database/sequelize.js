var crypto = require("crypto");

const sqlite3 = require("sqlite3");
const { Sequelize, DataTypes, Op, QueryTypes} = require("sequelize");

const db = new sqlite3.Database("uses.sqlite");
const sequelize = new Sequelize("uses", "", "", {
  dialect: "sqlite",
  storage: "uses.sqlite",
});

console.clear();

Array.prototype.amountOf = function(item) {
  let arr = this
  const counts = {};

for (const num of arr) {
counts[num] = counts[num] ? counts[num] + 1 : 1;
}

return counts[item]

}

// generates a rondom code
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

// Defining algorithm
const algorithm = 'aes-256-cbc';
 
// Defining key
const key = crypto.randomBytes(32);
 
// Defining iv
const iv = crypto.randomBytes(16);
 
//encripts string
function hide(text) {
 
 // Creating Cipheriv with its parameter
 let cipher = crypto.createCipheriv(
      'aes-256-cbc', Buffer.from(key), iv);
 
 // Updating text
 let encrypted = cipher.update(text);
 
 // Using concatenation
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 
 // Returning iv and encrypted data
 return encrypted.toString('hex') 
}
 



/*
// decripts string
function show(key, encode = "utf8", enctype = "hex") {
  var mykey = crypto.createDecipher("aes-128-cbc", "mypassword");
  var mystr = mykey.update(key, enctype, encode);
  mystr += mykey.final(encode);

  return mystr;
}
*/

// creates the users table
const users = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      set(value) {
        // stores the passwords not in plaintext
        this.setDataValue("password", hide(value));
      },
    },
  },
  { timestamps: false }
);

// creates the rooms table
const rooms = sequelize.define(
  "room",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: generateString(23),
      unique: true
    },
    userA: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: true,
    },
    userB: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: true,
    },
  },
  { timestamps: false }
);

// crates the chats table
const chats = sequelize.define(
  "chat",
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
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    },
  },
  { timestamps: true }
);

async function getAll(From = "users"){
  let users = await sequelize.query("SELECT * FROM `"+From+"`",{
        raw: false,
        type: QueryTypes.SELECT,

    });


 // console.log( users );
  return users
}

async function isEmpty(table) {
  //await sequelize.sync({ force: true });

  let res = await users.findAll();

  return res === null;
}

async function addUser(username, password) {
  //await sequelize.sync({ force: true });
  let res = await users.create({ username, password });

  res = await users.findAll();

  return res;
}

async function validate(username, password) {
  //await sequelize.sync({ force: true });

  let res = await users.findOne({
    where: {
      [Op.and]: [{ username: username }, { password: hide(password) }],
    },
  });

  return res !== null;
}


async function validateRoom(userA, userB) {

  const [results, metadata] = await sequelize.query("SELECT * FROM `rooms` WHERE (`userA`='"+userA+"' AND `userB`='"+userB+"') OR (`userB`='"+userA+"' AND `userA`='"+userB+"') LIMIT 1;",{
    raw: false,
    type: QueryTypes.SELECT,

});
// Results will be an empty array and metadata will contain the number of affected rows.

 
  return  results==null ? true : results.length  === 0  
}

async function addRoom( userA, userB, room=generateString(12)) {
  let a = await validateRoom(userA, userB)
  let b = await validateRoom(userB, userA)

  let res;


  if(a && b){
    res = await rooms.create({ room, userA, userB });
  }else{
    let id = await findRoom(userA, userB)

    return id
  }
  //await sequelize.sync({ force: true });

    
  

return room


}

async function findRoom( userA, userB) {
    let openA = await validateRoom(userA, userB);
    let openB = await validateRoom(userB, userA);

   // if(!(openA || openB)) return;

   let roomCode = await rooms.findOne({
    attributes: { exclude: ['id', 'userA', 'userB'] },
  where: {
    [Op.or]: [
      {
        [Op.and]: {
          userA: {
            [Op.eq]: userA,
          },
          userB: {
            [Op.eq]: userB
          }
        }
      },
      {
        [Op.and]: {
          userA: {
            [Op.eq]: userB,
          },
          userB: {
            [Op.eq]: userA
          }
        }
      }
    ]
   

  

  }
})


  return roomCode.room//a.length > 0 ? a[0].room : (c.length > c ? c[0].room : null)
  }


async function myRooms(userA) {
  //await sequelize.sync({ force: true });

  let res = await users.findAll({
    where: {
      [Op.or]: [{ userA: userA }, { userB: userA }],
    },
  });
  return res;
 
}

//when a user sends a chat it is added to the database so theat perssitance works
async function addChats(name, message, room) {
  //await sequelize.sync({ force: true });
  let res = await chats.create({ name, message, room });

  res = await chats.findAll();

  return (new Date());//res;
}

//this function recals all of the chats.
async function recalChats(userA, userB) {
  //await sequelize.sync({ force: true });
let id = await findRoom(userA, userB)


if( id === undefined){
    return undefined
}

//const [res, metadata] = await sequelize.query("SELECT * FROM rooms WHERE `room` = '"+id+"'  ");

  let res = await chats.findAll({
    where: { 
      room: { 
        [Op.eq]: id
    }
  }
  });
  

  console.log( res );

  return res;
}

(async () => {
    await sequelize.sync({ force: true });
})()

module.exports = {
  addUser,
  validate,
  getAll,

  addChats,
  recalChats,

  validateRoom,
  myRooms,
  findRoom,
  addRoom

};