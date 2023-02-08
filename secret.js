var fs = require("fs");


function readSecret(key){
    let data = fs.readFileSync('.env.safe',{encoding:'utf8', flag:'r'})

    return JSON.parse(data.toString())
}
module.exports = {
	readSecret
};