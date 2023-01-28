var crypto = require("crypto");

const sqlite3 = require("sqlite3");
const { Sequelize, DataTypes, Op, QueryTypes} = require("sequelize");

const db = new sqlite3.Database("uses.sqlite");
//https://github.com/sequelize/sequelize/issues/10304
const sequelize = new Sequelize("uses", "", "", {
  dialect: "sqlite",
  storage: "uses.sqlite",
  retry: {
        match: [
          /SQLITE_BUSY/,
        ],
        name: 'query',
        max: 5
      },
  pool: {
        maxactive: 1,
        max: 500,
        min: 0,
        idle: 20000
      }
});

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
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 
 // Updating text
 let encrypted = cipher.update(text);
 
 // Using concatenation
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 
 // Returning iv and encrypted data
 return encrypted.toString('hex') 
}






// crates the chats table
const chats = sequelize.define("chats", {
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



const Users = sequelize.define('users',{
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
})

const Rooms = sequelize.define('rooms',{
	  room: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
       defaultValue: generateString(12)
      
    },
})

const Host = sequelize.define('Users_Rooms', {}, { timestamps: false });


//https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#eager-loading-with-many-to-many-relationships
Users.belongsToMany(Rooms, { through: Host });
Rooms.belongsToMany(Users, { through: Host });

async function getAll(From = "users"){
    let users;
    switch(From){
    case 'chats':
          users = await chats.findAll()
         return users
         
     case 'users':
          users = await Users.findAll()
         return users
    
     case 'rooms':
          users = await Rooms.findAll()
         return users
    
     case 'Users_Rooms':
     case 'host':
          users = await Host.findAll()
         return users
         
    default: 
          users = await Users.findAll()
         return users
    }
    

 // console.log( users );
}


/*
async function validateRoom(user) {
  let result = await Users.findOne({
    where: {
      username: user,
    },
  });

  let a = result.id;

  //for(let i = 1, i<a[1], i++){
  let host = await Host.findOne({
    where: {
      roomId: a,
    },
  });

  let ab = await Rooms.findOne({
    where: {
      id: host ? host.userId : "",
    },
  });

  try {
    return ab.room;
  } catch (e) {
    return false;
  }
}
*/

async function validateRoom(user) {
    let r = await addUser(user)
    
    let g = (await getAll('host')).map(x => x.userId)
    let h = (await getAll()).map(x => x.username)
    let i = (await getAll('rooms')).map(x => x.room)
    let j = (await getAll('host')).map(x => x.roomId)
    let k = ([...new Set(j)])[0]
    
//console.log( g, ([r]).map( x => x.id ) )
    return i[Number(k)-1] || false//isEqual( ([r]).map( x => x.id ), g )

}


async function addRoom( ...users) {
    
    let room = generateString(12)

   let a = users.map(async function(userA){
      // let c = await addUser(userA)

        let a = await validateRoom(userA)
    

        let b = await addUser(userA)
     

   let res =  await createRoom(a) // u ? await createRoom(await addUser(userA)) : false
   
return res.room
    })
    
let b  = await Promise.all(a)    

return ([...new Set(b)].length < a.length) ? [...new Set(b)] : false

}

async function findRoom(...users) {
    return (await validateRoom(users)) || undefined
}
   
     
async function addUser(username,password){
    if(password){
        let [user,a] = await Users.findOrCreate({where:{ username: username.toString(), password: password.toString() }});

return user

    }else{
        let user = await Users.findOne({where:{ username: username}});
        
 return user

    }

}

async function createRoom(r){
let [room,c] = await Rooms.findOrCreate({where:{ room: r||generateString(12) }});

return room
}

async function addUsertoRoom(room, ...user) {
    let arr = []
  user.forEach(async function (user) {
      arr.push( user.addRooms(room) )
  //await user.addRooms(room);
  });
  
  let all = await Promise.all(arr)

  //let fetchedUsers = await getAll('host')
  return all //fetchedUsers;
  
}

async function validate(username, password) {
  //await sequelize.sync({ force: true });

  let res = await Users.findOne({
    where: {
      [Op.and]: [{ username: username }, { password: hide(password) }],
    },
  });

  return res !== null;
}


//when a user sends a chat it is added to the database so theat perssitance works
async function addChats(name, message, room) {
  //await sequelize.sync({ force: true });
  let res = await chats.create({ 
      name:name, 
      message: message, 
      room: room 
  });
  
  res.save()

//  res = await chats.findAll();

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
  

  return res;
}

//this function recals all of the chats.
async function recalChats(...user) {
  //await sequelize.sync({ force: true });
let id = await findRoom(user)


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

//https://stackoverflow.com/questions/55420156/get-arrays-depth-in-javascript

 function getArrayDepth (){
    let value = this
    
     return Array.isArray(value) ? 
    1 + Math.max(0, ...value.map(getArrayDepth)) :
    0;
}

 function createRoomAndJoin(userA,userB){
    return new Promise( async (resolve,reject) => {
        let a = await validateRoom(userA)//users.map(validateRoom)
        let b = await validateRoom(userB) //await Promise.all(a)
        
        if(!a && !b){
             let c = await addUser(userA)
             
            let d = await addUser(userB)
            
            let e = await createRoom()
    
            let f = await addUsertoRoom(e, c,d )
            resolve(e)
            
        }else{
           resolve(a)
        }
   
    })
}

function isEqual(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}


(async function () {
  await sequelize.sync({ force: true });
})();

module.exports = {
  addUser,
  validate,
  getAll,

  addChats,
  recalChats,

  validateRoom,
  addRoom,
  createRoomAndJoin,
};
