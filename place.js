const users = [];

const rooms = []
const members = []

// removes ittem by the index of a ittem. 
Array.prototype.revoveItem = function(i){
    let array = this
let index = this.indexOf(i);
if (index > -1) { // only splice array when item is found
array.splice(index, 1); // 2nd parameter means remove one item only
}

return array

}

// join chat
function newUser(id, username, room) {
	const user = { id, username, room };

	users.push(user);

	return user;
}

// get user by id
function getActiveUser(id) {
	return users.find(user => user.id === id);
}


// Get room
function getIndividualRoomUsers(room) {
	return users.filter(user => user.room === room);
}

// gets all users
function getAllusers() {
	return users.map(x => x.username)
}



// creates a room from the sender and the reciver
function add_roomA(from, to) {
	if (find_room(to) || find_room(from)) { return from + to }
	rooms.push({
		to,
		from,
		code: to + from
	})

	return to + from
}

// gets all rooms that you can join
function rooms_you_may_joinA(you) {
	return rooms.filter(room => room.to == you || room.from == from)
}

// finds a the first room you can join
function find_room(to) {
	return rooms.filter(room => (room.to == to || room.from == to))[0] || false
}

// gets if a member is under a name in a room. Example: room:ab has a and b in the room
function is_member(usr) {
	return members.filter(x => x.username == usr).length == 0

}

// adds members to the total member pool
function add_memberA(usr) {
	if (!is_member(usr)) return;
	members.push({ username: usr})
	return usr
}

// removes members from the total member pool
function remove_memberA(usr) {
let index = members.map(x => x.username).indexOf(usr);
if (index > -1) { // only splice array when item is found
  members.splice(index, 1); // 2nd parameter means remove one item only
}

return members.map(x => x.username)

}

// gets all members
function getAllusersA() {
	return members.map(x => x.username)
}



module.exports = {
	newUser,
	getActiveUser,
	getIndividualRoomUsers,
	getAllusers,

	add_roomA,
	rooms_you_may_joinA,
	find_room,
	add_memberA,
	getAllusersA,
	remove_memberA
};