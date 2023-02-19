# Logging in

On this page, the user will log in. The user must log in with both username and password. The user will be redirected to a new page if the password and username are incorrect.

![login](https://assets.codepen.io/5594200/Screen+Shot+2023-02-15+at+1.44.50+PM.png)

> > If a user tries to log in and has no page, they will be sent a **401** error code.

> > ![login](https://assets.codepen.io/5594200/Screen+Shot+2023-02-16+at+6.56.47+AM.png)

---

# Signing up 

On this page, the user will sign up. If the username is already used, the account will not be created. Users may have the same password. Passwords are not stored in the table as raw text but as a hash.

password hashing is done by the

```javascript
function hide(text) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(text, salt, function (err, hash) {
        if (err) return reject(err);

        // Store hash in your password DB.
        resolve(hash);
      });
    });
  });
}
```

![signup](https://assets.codepen.io/5594200/Screen+Shot+2023-02-15+at+9.54.23+PM.png)

> > If a user tries to sign up and the username entered already exists, then a user is sent a **400** error message.

> > ![signup](https://assets.codepen.io/5594200/Screen+Shot+2023-02-16+at+7.02.32+AM.png)

---

> > If a user deletes their account and then try to sign up with that same username, then the user is sent a **409** error message.

> > ![signup](https://assets.codepen.io/5594200/Screen+Shot+2023-02-17+at+8.41.07+PM.png)

---


# Node 

`javascript require("uuid"); `

the uuid module is used to create UUIDs for session IDs.

` require("cors"); `

the cors or the cross-origen module alows for post a get reqests to be cross-origen

`require("express");`

The express module does a ton, from using get/post requests to handling the HTTP server.

> > `require("express-session")`

> > express-session is a module that alows a user to create sessions in express

> > `require("http")`

http in this project creates the http server. Express handles the reqests and sessions

` require("path"); `

path allows for express to have /**name**

` require("socket.io"); `

socket are what allow for chats to work

`require("bcrypt"); `

hides the passwords in the Database

`require("sequelize");`

sequelize is a huge module that allows coders to create sql requests easily

> > `require("sqlite3")`
> > the sqlite3 is reqired to allow the sequelize module to work

> > ## local install 

```bash
npm install uuid cors express express-session http path socket.io bcrypt sequelize sqlite3
```

# sockets 

> > ## client side 
> >
> > 1.  people
> >     1. gets all of the active and inactive members on the site.

> > 2.  sent
> >     1. gets wether or not a message was sent

> > 3.  message
> >     1. logs the **HTML** message

> > 4.  persistence
> >     1. gets all of the chat in that room

> > 5.  typping
> >     1. gets if the user is typping

> > 6.  ntypping
> >     1. gets if the user is done typping

## server side 

> > 1.  error
> >     1. dissconects the user from the sockets if the error is resolting in the user being unauthorized

> > 2. logedin
> >    1. validates the user on the serviside with sockets

> > 3. logremove
> >    1. gets if the user has removed there account and removes them completly from the member listing

> > 4. logedout
> >    1. gets if the user has logged out and changes there statatus to inactive

> > 5. persistence
> >    1. Returns the room code for users. If the users do not have a room code, they will create a room

> > 6. `socket.chat_room`
> >    1. brodcasts that a message has been sent. This is sent to the room

> > 7. typping
> >    1. emits to the room that there is a member typing

> > 8. ntypping
> >    1. send back to the client if they are finnised typping

> > 9. message
> >    1. adds messages to the messages table

---

# Diagrams 
---

> > ## login page 

> > ![svg](https://assets.codepen.io/5594200/login.svg)

---

> > ## signup page 

> > ![svg](https://assets.codepen.io/5594200/signup.svg)

---

> > ## sockets page 

| server              | client                 | Sent                      | recived                    | Sent 2                                                                                                    | recived 2                                                                                         |     |
| ------------------- | ---------------------- | ------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --- |
| is what the code is | what the user will see | the sender of the message | what is colleting the data | the second sender that just sends back what was sent, or sends back a bool that coralates to a validation | recived + a bool that coralates to a validation or a deffrent thing that the reviver will collect |     |

> > ![pdf](https://assets.codepen.io/5594200/users.pdf)


> > ![svg](https://assets.codepen.io/5594200/users_1.svg)

---



> > > ## Update Username 

> > > ![svg](https://assets.codepen.io/5594200/re-username.svg)

---

> > > ## Update Password 
> > > ![svg](https://assets.codepen.io/5594200/users-4.svg)


---
> > > ## deleting account

> > > ![svg](https://assets.codepen.io/5594200/users-2.svg)

---

# html assets 

## iframe page

| css | js                                                           |
| --- | ------------------------------------------------------------ |
|     | [fontawesome pro](https://kit.fontawesome.com/fd76b8450f.js) |
|     | [swal 2](https://cdn.jsdelivr.net/npm/sweetalert2@11)        |

## account page 

| css                                                                                           | html                                                                                               |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [bootstrap 5 v5.2.1](https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css) | [bootstrap 5 v5.2.1](https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js) |

## home page 

| css                                                                                           | js                                                                                                                     |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [animate 3.2.3](https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.2.3/animate.min.css)     | [crypto 3.1.2](https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js)                                  |
| [w3schools](https://www.w3schools.com/w3css/4/w3.css)                                         | [jquery 3.6.0](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js)                                      |
| [bootstrap 5 v5.2.1](https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css) | [socket.io](/socket.io/socket.io.js)                                                                                   |
|                                                                                               | [bootstrap 3 v/3.1.5](https://cdnjs.cloudflare.com/ajax/libs/mouse0270-bootstrap-notify/3.1.5/bootstrap-notify.min.js) |
|                                                                                               | [marked 0.3.2](https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js)                                      |
|                                                                                               | [confetti latest](https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js)                         |
