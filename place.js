const users = [];

const rooms = []
const members = []

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

// get user
function getActiveUser(id) {
	return users.find(user => user.id === id);
}


// Get room
function getIndividualRoomUsers(room) {
	return users.filter(user => user.room === room);
}

function getAllusers() {
	return users.map(x => x.username)
}
