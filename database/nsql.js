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



/*

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
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 
 // Updating text
 let encrypted = cipher.update(text);
 
 // Using concatenation
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 
 // Returning iv and encrypted data
 return encrypted.toString('hex') 
}




const users = sequelize.define('users',{
	  username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    }
})

const rooms = sequelize.define('rooms',{
	  room: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
       defaultValue: generateString(12)
      
    },
})

const host = sequelize.define('hosts',{
	  member: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false
    }
})

users.belongsToMany(rooms, { through: 'hosts' });
rooms.belongsToMany(users, { through: 'hosts' });

//rooms.hasMany(host, { as: 'Instruments' });



(async function(){
    //await sequelize.sync();


      await sequelize.sync({ force: true });


    let  [a, b] = await users.findOrCreate({
  where: { username: 'a' }
});

 let [c, d] = await users.findOrCreate({
  where: { username: 'b' }
});

let [e, f] = await rooms.findOrCreate({
    where: {room: generateString(12)}
});
let [g, h] = await rooms.findOrCreate({
     where: {room: generateString(12)}
})


const results = await users.findAll({ model: rooms, required: true});


console.log(JSON.stringify(results, null, 2));




})()
*/

const Users = sequelize.define('users',{
	  username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    }
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


async function validateRoom(userA){
    let result = await Users.findOne({
   where: {
       username: userA
   }
});

let a = result.id


//for(let i = 1, i<a[1], i++){
let room = await Rooms.findOne({
    where: {
        id: a
    }
})

return room || false
}

async function addRoom( userA, userB, room=generateString(12)) {
  let a = (await validateRoom(userA)).room
  let b = (await validateRoom(userB)).room

  let res;


 return [a,b]
}

     
async function addUser(username){
let [user,a] = await Users.findOrCreate({where:{ username: username }});

return user
}

async function createRoom(){
let [room,c] = await Rooms.findOrCreate({where:{ room: generateString(12) }});

return room
}

async function addUsertoRoom( room, ...user){
    user.forEach(async function(user){
        await user.addRooms(room);

    })
    
    let fetchedUsers = await Users.findAll({ 
    include: Rooms
    });
    
    return fetchedUsers
}


(async function(){
      await sequelize.sync({ force: true });


let a = await addUser('a');
let b = await addUser('b');
let c = await addUser('c');
let d = await addUser('d');

let e = await createRoom();
let f = await createRoom();
let g = await createRoom();
let h = await createRoom();
let i = await createRoom();
let j = await createRoom();

await addUsertoRoom(e, a,b)
await addUsertoRoom(f, a,c)
await addUsertoRoom(g, a,d)

await addUsertoRoom(h, b,c)
await addUsertoRoom(i, b,d)
await addUsertoRoom(j, c,d)

let k = await addRoom('a','b')
console.log( k )

})()

