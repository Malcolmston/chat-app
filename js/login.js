   // gets if falue is not false
   function isTrue(value) {
    return value || false; //(value === true && value !== false) && (value != undefined && value != null)
  }

  // sets the user in localStorage
  function setUser(user, psw) {
    Cookies.set('username', user, { expires: 0.0000004, path: '' })
    Cookies.set('password', psw, { expires: 0.0000004, path: '' })

    //localStorage.setItem("username", user);
    //localStorage.setItem("password", psw);
  }

  // removes the user in localStorage
  function removeUser() {
    Cookies.remove('username')
    Cookies.remove('password')


    //localStorage.removeItem("username");
    //localStorage.removeItem("password");
  }
  // gets if user is true
  function getUser() {
    return isTrue(Cookies.get('username')) &&
      isTrue(Cookies.get('username'))
      ? [Cookies.get('username'), Cookies.get("password")]
      : false;

/*
    return isTrue(localStorage.getItem("username")) &&
      isTrue(localStorage.getItem("password"))
      ? [localStorage.getItem("username"), localStorage.getItem("password")]
      : false;
      */
  }

  const logIn = document.querySelector("#login");
  const signUp = document.querySelector("#signup");
  const btnA = document.querySelector(".btn-primary");
  const btnB = document.querySelector(".btn-secondary");
  const signUP_Link = document.querySelector(".signup > a");
  const logIn_Link = document.querySelector(".login > a");

  function login() {
    logIn.classList.replace("hide", "show");
    signUp.classList.replace("show", "hide");
    btnA.style.opacity = 0;
    btnB.style.opacity = 0;
  }

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

  document.querySelectorAll(".btn-danger").forEach((x) =>
    x.addEventListener("click", function () {
      signUp.classList.replace("show", "hide");
      logIn.classList.replace("show", "hide");
      btnA.style.opacity = 1;
      btnB.style.opacity = 1;
    })
  );

  document.querySelectorAll("[type='submit']").forEach((x) => {
    x.addEventListener("click", function () {
      if (this.parentElement.id == "login") {
        setUser(
          document.querySelector("#ussername").value,
          document.querySelector("#pwd").value
        );
      }

      if (this.parentElement.id == "signup") {
        setUser(
          document.querySelector("#ussername1").value,
          document.querySelector("#pwd1").value
        );
      }
    });
  });

  if (getUser()) {
    document.querySelector("#ussername").value = getUser()[0];
    document.querySelector("#pwd").value = getUser()[1];

    document.querySelector("#login").submit();
  }