const socket = io();

	



// gets date in mm/dd/yyy format
function getDay() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    return mm + '/' + dd + '/' + yyyy;
}

//the class Pill creats the pill html element and will also allow for state changes
class Pils {
    constructor() {
        this.chip = document.createElement('div')
        this.chip.setAttribute('class', 'chip1')

        this.tooltip = document.createElement('div')
        this.tooltip.setAttribute('class', 'tooltip1')

        this.chip_head = document.createElement('div')
        this.chip_head.id = 'chip_head '

        this.tooltiptext = document.createElement('span')
        this.tooltiptext.setAttribute('class', `tooltiptext1`)
        this.tooltiptext.id = 'tooltiptext '

        this.chip_content = document.createElement('div')
        this.chip_content.setAttribute('class', 'chip-content1')

        this.chip_close = document.createElement('div')
        this.chip_close.setAttribute('class', 'chip-close1')

        this.chip_close.innerHTML = `<svg onclick="this.parentElement.parentElement.style.display='none'" class="chip-svg1" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>`
        //onclick="this.parentElement.style.display='none'"
    }

    create_pil(stus, username, t = true) {
        this.chip_head.setAttribute('class', `chip-head1 ${stus}`)

        this.tooltiptext.innerText = stus


        this.tooltip.append(this.chip_head, this.tooltiptext)

        this.chip_content.innerText = username

        this.chip.append(this.tooltip, this.chip_content, this.chip_close)

        if (t) {
            document.querySelector('#allContentPeople').append(this.chip)
        } else {
            return this.chip
        }
    }

    change_pil(stus) {
        //   this.className = ""
        this.chip_head.classList.add('chip-head1')
        this.chip_head.classList.add(stus)

        this.tooltiptext.innerText = stus
    }

    change_pilFrom(element, stus) {
        // element.className = ''
        let chip_head = document.getElementById('chip_head ')
        let tooltiptext = document.getElementById('tooltiptext ')
        //tooltiptext
        chip_head.classList.add('chip-head1')
        chip_head.classList.add(stus)

        tooltiptext.innerText = stus
    }

}

// this will send 'notifications' to the user. 
var infoClick = function (id) {
    $.notify({
        // options
        title: '<strong>Info</strong>',
        message: `<br> <input value='${id}'></input> has sent you a message`,
    }, {
        // settings
        element: 'body',
        position: null,
        type: "info",
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: false,
        placement: {
            from: "top",
            align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        delay: 3300,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated bounceInDown',
            exit: 'animated bounceOutUp'
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
    });
}

// turns sockets on in the server side

socket.on('error',function(message,type){
alert(message)

})

socket.emit('logedin', username)
socket.username = username
// logs the messages fpr you
function message(m) {
    if( typeof m == 'string') {
        let li = document.createElement('li')

    let txt = document.createElement('a')
    txt.innerHTML = m

    li.append(txt)
    chats.append(li)

    input.value = ""

        return;
    }
    //console.log( m )
    let {name, message, time} = m
    let li = document.createElement('li')

    let txt = document.createElement('a')
    txt.innerHTML = name+" : "+message+" : "+time

    li.append(txt)
    chats.append(li)

    input.value = ""

    return;
}
// a short cut to add pills in the contacts list
function add_row(room, active) {

    var tr = document.createElement('tr')


    let pill = new Pils()
    let pil;


    let s = active == "offPage" ? active : (active ? 'active' : 'inactive')

    pil = pill.create_pil(s, room, false)

    pil.addEventListener('click', function (a) {
        if (a.target.tagName !== 'path') {
            roomThing(room)

                                
        }
    })

    tdb = document.createElement('td')
    tdb.append(pil)

    tr.append(tdb)

    document.querySelector('table').append(tr)

    //pill.change_pilFrom(document.getElementById(id), s)

    //}

}
// joins each room wen you click the contact card. persetence is called
function roomThing(room) {
    let to = room

    document.getElementsByClassName('roomNameId')[0].innerHTML = to ? 'room: '+to : 'room: ?'
    
    socket.array = [username, to]
    socket.emit('room', socket.array)
    socket.emit('persistence', [username, to])
}

// Get the input field
var input = document.querySelector(".messageBar"),
    chats = document.querySelector(".chat"),
    home = document.querySelectorAll('#home'),
    send = document.querySelector('.send'),
    test = document.querySelector('.messageBar');
    


    
    test.addEventListener('typing', async (e)=>{
        var key = await e.detail.key.call()
        var text = e.detail.text.call()
       
        socket.emit('typping', socket.array);
           });

        
send.addEventListener('click', function (event) {
    event.preventDefault();
    if (input.value == "" || input.value.trim() == "") return;
    //socket.emit('message', username + ":  " + input.value.replaceAll('\n', '<br>') + ": " + getDay());
//alert(socket.array)
    socket.emit('message',input.value.replaceAll('\n', '<br>'), socket.array);
})


home.forEach(function (element) {
    element.addEventListener('click', function (event) {
        socket.emit('logedout', username)
        document.querySelector('#home').submit()
    })
})


//console.log( socket )
socket.on('people', (arr) => {
    document.getElementById('allContentPeople').innerHTML = ''

    arr.map(function (x) {
        if (username != x[0]) {
            //offPage
            add_row(x[0], x[1])
        }
    })


})

socket.on('sent', function (x,all){
    if(all.includes(socket.username)){
        socket.emit('logedin', username)
        infoClick(x)
        roomThing( x )
    }
})

socket.on('typping',function(x,all){
    if(all.includes(socket.username)){
        test.setAttribute('placeholder',  `${socket.username} is typping`)
    }
})


socket.on('message', (x,who) => {
    socket.room = x.room
    //console.log( [username,x] )
    socket.emit('logedin', username)
    message(x)
})



socket.on('persistence', (x) => {
        chats.innerHTML = 'this is a message just for you'
    x.map(a => message(a))
    
    
})



/*
function key(e){
  if( e.target.value.trim().length > 0){
       e.place = test
       
       e.target.dispatchEvent(event);
  }
  
  
  }
  
  


const event = new CustomEvent("typing", {
bubbles: true,
detail: { 
    text: () => test.value || test.innerText ||  test.innerHTML || undefined,
    key: function(){
        return new Promise((resolve, reject) => {
             window.addEventListener("keydown", (event) => { 
            resolve(event)
        })
        })
       
    },


},
});

  //const event = new Event("typing")
  test.addEventListener('typing', async (e)=>{
var key = await e.detail.key.call()
var text = e.detail.text.call()

socket.emit('typping', socket.array)
  });
   
  
test.addEventListener('keydown', key)
test.addEventListener('click', key)
test.addEventListener('change', key)
*/