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
