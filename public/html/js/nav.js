	
			function openNav() {
                document.getElementById('myNav').style.display = 'block';
              }
          
              function closeNav() {
                document.getElementById('myNav').style.display = 'none';
              }
          
              function slide(show) {
                let arr = document.querySelectorAll('.slide');
                if (show > [...arr].length2) return;
          
                arr.forEach(function (x, i) {
                  if (i == show) {
                    x.style.display = 'block';
                  } else {
                    x.style.display = 'none';
                  }
                });
              }
          
              function delay(time) {
                return new Promise((resolve) => setTimeout(resolve, time));
              }