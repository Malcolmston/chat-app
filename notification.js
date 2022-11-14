const notifier = require('node-notifier');


const logIn = (type) => {
    if(type === false){
    notifier.notify({
  title: 'You have not seccsesfully logged in',
  message: 'try again'
});
}

if( type === true){
     notifier.notify({
  title: 'You have seccsesfully logged in',
  message: 'good job'
}); 
}

if( type === undefined ){
    notifier.notify({
  title: 'something went wrong, but you need to try again',
  message: 'Mhmmmmmmm'
});   
}


}

const signIn = (type) => {
    if(type === false){
    notifier.notify({
  title: 'You have not seccsesfully signed up',
  message: 'try again'
});
}

if( type === true){
     notifier.notify({
  title: 'You have seccsesfully signed up',
  message: 'good job'
}); 
}

if( type === undefined ){
    notifier.notify({
  title: 'something went wrong, but you need to try again',
  message: 'Mhmmmmmmm'
});   
}


}


exports.MassagelogIn = logIn
exports.MassagesignIn = signIn
