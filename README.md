# BatePapoUOL BackEnd

My first ```backend``` project! Building and API to the most used brazillian chat app ~~ages ago~~ - Bate Papo UOL!

## Table of Contents

- [Overview](#overview)
  - [Features](#you-can-make-the-following-requests-to-the-api)
- [Built with](#built-with)
- [How to run](#how-to-run)
- [Author](#author)

## Overview

### You can make the following requests to the API:

- POST ```/participants```

Set a username in the data base, you can send a .json body like this:
```js
{
  name: "YOUR_NAME_HERE"
}
```
<br />

- GET ```/participants```

Get an array of every participant on the data base. There will be an ID, the username and a timestamp ```Date.now()``` informing the user last status, like this:
```js
{
  _id: new ObjectId(NUMBER),
  name: "USERNAME",
  lastStatus: NUMBER
}
```
<br />

- POST ```/messages```

Insert a message in the collection of messages, specifing to whom the message is being sent*, its type ("private_message", "message", "status") and the text. You can send a .json body like this:
```js
{
  to: "HEADERS.USER",
  type: "TYPE_OF_MESSAGE",
  text: "MESSAGE"
}
```
*You'll need to imform the receiver of the message as User in the request's headers:*
```js
request.post('EXAMPLE_URL/messages', body, {
  headers: {
    User: RECEIVER
  }
});
```
<br />

- GET ```/messages```

Get an array of objects with all messages in the collection of messages with the sender, the receiver, the type of message ("private_message", "message", "status"), the text and the timestamp of the message (HH:mm:ss) in the following format:
```js
  [
    {
      from: "SENDER",
      to: "RECEIVER",
      type: "TYPE_OF_MESSAGE",
      text: "MESSAGE",
      time: TIME
    }
  ]
```
<br />

- DELETE ```/messages/:id```

Delete a message informing its ObjectId in the request URL and the user name (only the sender of a message is able to delete it) in the request's headers as User, like this:
```js
request.delete(`EXAMPLE_URL/messages/:${id}`, {
  headers: {
    User: SENDER
  }
});
```
<br />

- PUT ```/messages/:id```

Request to change a specific message in the collection of messages informing the messages' ObjectId on the URL, the same type of information sent in the POST ```/messages``` and the User in the headers of the request, like this:

```js
request.put(`EXEMPLE_URL/messages/${id}`,
  {
    to: RECEIVER,
    text: "MESSAGE",
    type: "TYPE_OF_MESSAGE"
  }, {
    headers: {
      User: SENDER
    }
  }
);
```
*Obs: only the sender of said message is able to delete it.*

<br />

- POST ```/status```

Every 15 seconds, the API will check the lastStatus of every user for an update older than 10 seconds and if confirmed, it'll remove the user from the DB.
With this route it's possible to keep updating the user timestamp. Like before, the User needs to be specified through the request's headers:

### Data Sanitization

The API will automatically remove HTML tags and unnecessary white spaces from messages and usernames by default. 8)

---

## Built with

The following tools and libs were used in the construction of the project: <br />

<p>
  <img style='margin: 5px' src='https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white">
  <img style='margin: 5px;' src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img style='margin: 5px;' src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
  <img style='margin: 5px;' src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
  <img style='margin: 5px;' src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
</p>
<p>
  <img style='margin: 5px;' src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white">
  <img style='margin: 5px;' src="https://img.shields.io/badge/Microsoft_Edge-0078D7?style=for-the-badge&logo=Microsoft-edge&logoColor=white">
  <img style='margin: 5px;' src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white">
  <img style='margin: 5px;' src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white">
</p>


## How to run

### You will need:

- npm
- NodeJS
- MongoDB

### Steps:

1. Clone this repository


2. Install dependencies
```bash
npm i
```


3. Start the server
```bash
mongod --dbpath ~/.mongo
```
  *For more information about MongoDB, access its [Documentation](https://docs.mongodb.com/)*.


4. Start the data base app
```bash
mongo
mongosh
```
  *Obs: open another terminal and use one of the commands shown above*
  
6. Get the URL shown on ```Connected to: mongodb://XXX.X.X.X:XXXXX/``` and copy it into the **.env** file as ```MONGO_URI=<URL>```

5. Finally, start doing requests to the server

6. Alternatively, if you want a front-end app to see the API working, you can use:
> https://github.com/Lucas-zz/BatePapoUOL_FrontEnd

## Author

- LinkedIn - [Lucas Azzolini Vieira](https://www.linkedin.com/in/azzolinilucas/)
- Frontend Mentor - [@Lucas-zz](https://www.frontendmentor.io/profile/Lucas-zz)
- Gmail - [lucasazzollinivieira@gmail.com](mailto:lucasazzollinivieira@gmail.com)
<!-- - Twitter - [@zulenno](https://twitter.com/zulenno) -->
