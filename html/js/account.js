function deleteAccount(username, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "post",
      url: "http://localhost:3000/api/account/remove",
      data: {
        username: username,
        password: password,
      },
      success: function (e) {
        resolve(e);
      },
    });
  });
}

function validate(username, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "post",
      url: "http://localhost:3000/api/account/validate",
      data: {
        username: username,
        password: password,
      },
      success: function (e) {
        resolve(e);
      },
    });
  });
}

function updateUsername(username, password, new_username) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "post",
      url: "http://localhost:3000/api/account/change",
      data: {
        curr_username: username,
        curr_password: password,
        new_username: new_username,
      },
      success: function (e) {
        resolve(e);
      },
    });
  });
}

function reset(input) {
  usernameC.value = username;
  passwordC.value = "";

  usernameC.removeAttribute("disabled");
  passwordC.removeAttribute("disabled");

  document.getElementById("hi212").remove();

  submit.addEventListener("click", update);
}

async function update(e) {
  let v = await validate(usernameC.value, passwordC.value);

  if (v.valid) {
    usernameC.setAttribute("disabled", "true");
    passwordC.setAttribute("disabled", "true");

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "newU");
    input.setAttribute("placeholder", "Please enter a new username");
    input.id = "hi212";
    document.querySelector("#form").appendChild(input);

    submit.removeEventListener("click", update);

    input.addEventListener("keyup", function (e) {
      if (e.target.value.length > 0 && e.target.value.trim().length > 0) {
        submit.addEventListener("click", async function () {
          if (usernameC.value == input.value) {
            alert("the new username is the same as the old one");
            reset();

            window.location.reload();
          }
          let res = await updateUsername(
            usernameC.value,
            passwordC.value,
            input.value
          );
          if (typeof res.error == "string") {
            alert(res.error);

            reset();

            window.location.reload();
          } else {
            alert("your username is now changed");

            //logout and re-login
            window.location.reload();
          }
        });
      }
    });
  }
}
//const Username_form = document.querySelector('#change_username')
