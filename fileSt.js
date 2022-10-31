var fs = require('fs');

function createFile(fname, fdata){
//Synchronously:
var filePath = '';
try { 
    fs.writeFileSync(fname, fdata);
    console.log("Successfully written!");  
} catch(e) {
    console.log('Error:', e.stack);
}

}

function reNameFile(old, now){
	fs.rename(old, now, function (err) {
  if (err) throw err;
  console.log('File Renamed!');
});
}

function fileUpdate(name, now){
	fs.appendFile(name, now, function (err) {
  if (err) throw err;
  console.log('Updated!');
});
}

module.exports = { createFile, reNameFile, fileUpdate, }
