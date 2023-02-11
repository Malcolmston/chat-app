function key(e){
    if( e.target.value.trim().length > 0){
         e.place = test
         
         e.target.dispatchEvent(event);
    }
    
    
    }
    
    
const test = document.getElementById('test')
  
  
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
     

     
    
test.addEventListener('keydown', key)
test.addEventListener('click', key)
test.addEventListener('change', key)
    
