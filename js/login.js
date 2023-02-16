   // gets if falue is not false
  function isTrue(value) {
    return value || false; //(value === true && value !== false) && (value != undefined && value != null)
  }



  const logIn = document.querySelector("#login");
  const signUp = document.querySelector("#signup");
  const btnA = document.querySelector(".btn-primary");
  const btnB = document.querySelector(".btn-secondary");
  const signUP_Link = document.querySelector(".signup > a");
  const logIn_Link = document.querySelector(".login > a");

  // hides and shows the login form
  function login() {
    logIn.classList.replace("hide", "show");
    signUp.classList.replace("show", "hide");
    btnA.style.opacity = 0;
    btnB.style.opacity = 0;
  }

  // hides and shows the signup form
  function signup() {
    signUp.classList.replace("hide", "show");
    logIn.classList.replace("show", "hide");
    btnA.style.opacity = 0;
    btnB.style.opacity = 0;
  }

  btnA.addEventListener("click", login);
  btnB.addEventListener("click", signup);
  // an event bonded to the A link in .signup
  signUP_Link.addEventListener("click", function () {
    signUp.classList.replace("show", "hide");
    logIn.classList.replace("hide", "show");
  });
  // an event bonded to the A link in .login
  logIn_Link.addEventListener("click", function () {
    signUp.classList.replace("hide", "show");
    logIn.classList.replace("show", "hide");
  });

  //toggles the visibility of the signUp, logIn 
  document.querySelectorAll(".btn-danger").forEach((x) =>
    x.addEventListener("click", function () {
      signUp.classList.replace("show", "hide");
      logIn.classList.replace("show", "hide");
      btnA.style.opacity = 1;
      btnB.style.opacity = 1;
    })
  );

