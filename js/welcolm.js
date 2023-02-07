		// gets the web headers 
		var xhr = new XMLHttpRequest();
		xhr.open('GET', document.location, false);
		xhr.send(null);
		username = xhr.getResponseHeader("user");


		//welcolms a user in the canvas
		function welcolm(user) {

			let canvas = document.getElementById("myCanvas");
			let jsConfetti = new JSConfetti(canvas, { resize: false })


			//{ resize: true }


			let ctx = canvas.getContext("2d");
			let fontColor = 'red';
			let textVariable = ` Hello: ${user}`


			ctx.font = "600 40px Proxima-nova";

			canvas.width = ctx.measureText(textVariable).width;
			canvas.style.width = canvas.width + 'px';


			ctx.font = "600 40px Proxima-nova";
			ctx.fillStyle = fontColor;
			ctx.textAlign = "left";



			ctx.fillText(textVariable, 0, canvas.height - 1);

			jsConfetti.addConfetti({
				confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7']
			}).then(() => { jsConfetti.clearCanvas() })

		}
