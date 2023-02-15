

home page
---------

creates a simple loging and sign up page theat a user can use to create and sign in to aconts

1.  using node there is a simple login page that alows a user to log in and sign up

1.  log in uses validate witch cheks the databace for that user
2.  sign up uses both validate and add user to make sure there are not mutible of the same user, and adds the user to the databace

Chat app
--------

creates a simple 1:1 chat app theat users can use

1.  chats sent directly to the sent user
2.  chats are saved and recorded for both simple and persistant messages
3.  the page uill automaticly change the statis of a user when they loging

    #### home
        say: Hi to the user and sprays confety. 
        this page will also alow the user to log out.

    #### chat
        the user may send and recive chats.
        rooms are 1:1
        chats can be multi line

    #### Information
        this is what is in the Information tab.
        by reading this you are shown the markdown

    #### Settings
        this is where you can change settings.
        you may change you username
        you may change your password
        you may Delete you account.





#### node assets
|body-parser | express| express-session | http | path | socket.io | sqlite3| node-fetch@2| crypto| sequelize| bcrypt|
|------------|--------|-----------------|------|------|-----------|--------|-------------|-------|----------|-------|

termanal 
`npm install bcrypt body-parser express express-session http path socket.io sqlite3 node-fetch@2 crypto sequelize`



#### html assets
| html 	| css 	| js 	|
|---	|---	|---	|
| icon image ![jellyfish](https://images.unsplash.com/photo-1666515878427-c0a045bf03c6?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Njg3NDQ4MjM&ixlib=rb-4.0.3&q=80) 	| [bootstrap 5 v5.2.1](https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css) 	| [bootstrap 5 v5.2.1](https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js) 	|
|  	|  	| [swal 2](https://cdn.jsdelivr.net/npm/sweetalert2@11) 	|
|  	|  	| [fontawesome pro](https://kit.fontawesome.com/fd76b8450f.js) 	|
|  	|  	| [crypto 3.1.2](https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js) 	|
|  	|  	| [jquery 3.6.0](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js) 	|
|  	|  	| [socket.io](/socket.io/socket.io.js) 	|
|   |   | [marked 0.3.2](https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js) |
|   |   | [confetti latest](https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js) |



Node Versions
-------------

```json
{
  "dependencies": {
    "bcrypt": "^5.1.0",
    "body-parser": "^1.20.1",
    "cookie": "^0.5.0",
    "ejs": "^3.1.8",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "html": "^1.0.0",
    "http": "^0.0.1-security",
    "localStorage": "^1.0.4",
    "node-fetch": "^2.6.8",
    "passport-remember-me": "^0.0.1",
    "path": "^0.12.7",
    "promise": "^8.3.0",
    "sequelize": "^6.28.0",
    "socket.io": "^4.5.4",
    "sqlite3": "^5.1.4",
    "url": "^0.11.0"
  }
}
```