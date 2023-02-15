     
const test = document.querySelector('.messageBar')
   
 
 
 const eventThing = new CustomEvent("typing", {
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

function key(e){
    if( e.target.value.trim().length > 0){
         e.place = test
         
         e.target.dispatchEvent(eventThing);
    }
    }
    

     

     
    
test.addEventListener('keydown', key)
test.addEventListener('click', key)
test.addEventListener('change', key)
    
