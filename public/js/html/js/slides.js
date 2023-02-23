	
			function slideone() {
                let clicks = 0;
          
                return new Promise((resolve, reject) => {
                  let text =
                    'Click on the tabs <br> the green bar means that it is the selected one';
          
                  document.querySelector('.text').innerHTML = text;
          
                  document.querySelectorAll('.itm').forEach((item) => {
                    item.addEventListener('click', function () {
                      if (clicks == 5) {
                        idx = 1;
                        slide(idx);
                        resolve(true)
                      }
          
                      clicks += 1;
          
                      let clicked = this.innerText.trim();
          
                      document.querySelectorAll('.itm').forEach(function (x) {
                        if (x.innerText.trim() == clicked) {
                          x.classList.replace('inactive', 'active');
                        } else {
                          x.classList.replace('active', 'inactive');
                        }
                      });
                    });
                  });
                })
              }
          
              function slidetwo() {
                return new Promise((resolve, reject) => {
                  var chats = document.querySelector('.chat');
                  var input = document.querySelector('.messageBar');
                  var pil = new Pils();
          
                  function message(m) {
                    let li = document.createElement('li');
          
                    let txt = document.createElement('a');
                    txt.innerHTML = m;
          
                    li.append(txt);
                    chats.append(li);
          
                    input.value = '';
                  }
          
                  var calls = {
                    first: function () {
                      return new Promise((resolve, reject) => {
                        document.querySelector('#home').removeEventListener('click', () => { })
          
                        pil.create_pil('active', 'username');
          
                        text = 'Next hover your mouse over the lime green circle';
                        document.querySelector('.text').innerHTML = text;
          
                        document.querySelector('.chip1').addEventListener('mouseover', function (event) {
                          document.querySelector('.chip1').removeEventListener('mouseover', () => { })
          
                          text = 'this shows the other users status';
                          document.querySelector('.text').innerHTML = text;
          
                          delay(2000).then((x) => {
                            //text = 'click on the lime green button to chat with a user';
                            //document.querySelector('.text').innerHTML = text;
          
                            resolve(true);
                          });
                        });
                      });
                    },
                    second: function () {
                      return new Promise((resolve, reject) => {
                        text = 'click on the lime green button to chat a user';
                        document.querySelector('.text').innerHTML = text;
          
                        document.querySelector('.chip1').addEventListener('click', function (event) {
                            //document.querySelector('.chip1').removeEventListener('click',()=>{})
          
                            text = 'look at the chat block to the left';
                            document.querySelector('.text').innerHTML = text;
                            delay(2000).then((x) => {
                              chats.innerHTML = '';
                              text =
                                'once you have seen the message: this is a message just for you you may start chatting';
                              message('this is a message just for you');
                              document.querySelector('.text').innerHTML = text;
                              document.querySelector('.chip1').removeEventListener('click', () => { })
                              resolve(true)
                            })
                          })
                      })
                    },
                    third: function () {
                      return new Promise((resolve, reject) => {
                        delay(2500).then((x) => {
                          text = 'You can start typing in the textarea on the bottom left';
          
                          document.querySelector('.text').innerHTML = text;
          
          
                          document.querySelector('.messageBar').addEventListener('keydown', function () {
                            document.querySelector('.messageBar').addEventListener('mouseout', function () {
                              text = 'if you hit the button next to the textarea that will send a message';
          
                              document.querySelector('.text').innerHTML = text;
          
                              document.querySelector('.send').addEventListener('click', function () {
                                resolve(true)
                              })
                            });
                          });
          
                        });
          
                      })
                    }
                  }
          
                  let text = 'Click on Log out';
          
                  document.querySelector('.text').innerHTML = text;
          
                  document.querySelector('#home').addEventListener('click', function (event) {
                    calls.first.call().then((x) => {
                      calls.second.call().then((x) => {
                        calls.third.call().then((x) => {
                          resolve(true)
                        })
                      });
                    });
                  })
                })
              }
          
  
              