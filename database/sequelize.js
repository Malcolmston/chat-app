var crypto = require("crypto");

const sqlite3 = require("sqlite3");
const { Sequelize, DataTypes, Op, QueryTypes} = require("sequelize");

const db = new sqlite3.Database("uses.sqlite");
const sequelize = new Sequelize("uses", "", "", {
  dialect: "sqlite",
  storage: "uses.sqlite",
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

const Host = sequelize.define('Users_Rooms', {});


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



async function validateRoom(user){
    let result = await Users.findOne({
   where: {
       username: user
   }
});

let a = result.id


//for(let i = 1, i<a[1], i++){
let host = await Host.findOne({
    where: {
        roomId: a
    }
})


let ab = (await Rooms.findOne({
    where: {
        id: host ? host.userId : ''
    }
}))

try{
  return ab.room 

}catch(e){
return false
}

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
       let [user,a] = await Users.findOrCreate({where:{ username: username.toString()}});
 return user

    }

}

async function createRoom(r){
let [room,c] = await Rooms.findOrCreate({where:{ room: r||generateString(12) }});

return room
}

 function createRoomAndJoin(...user) {
    return new Promise(async function (resolve, reject) {
         let a = user.map(function(x){
        return addUser(x)
    })
    
    let e = await createRoom();

    
    Promise.all(a).then(function(arr){
        resolve( addUsertoRoom(e, ...arr) )

    })
    
    })
   
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
  

  console.log( res );

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

(async function(){
  await sequelize.sync({ force: true });
})()


module.exports = {
  addUser,
  validate,
  getAll,

  addChats,
  recalChats,

  validateRoom,
  addRoom,
  createRoomAndJoin

};