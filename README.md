
# Arena

Arena is a Full Stack Live Chatting Application.
The app itself uses Socket.io for real time communication and stores user details in encrypted format in a Mongo DB Database.
## Tech Stack

**Client:** React JS, MUI, Chakra

**Server:** Node JS, Express JS

**Database:** Mongo DB
  
## Demo

https://temp-arena-chat.herokuapp.com/

![](https://i.imgur.com/hLuSynv.png)
## Run Locally

Clone the project

```bash
  git clone https://github.com/siddharth-nair-2/Arena-chat-app
```

Go to the project directory

```bash
  cd Arena-chat-app
```

Install dependencies

```bash
  npm install
```

```bash
  cd frontend/
  npm install
```

In the SingleChat.js file, change the ENDPOINT to http://localhost:5000/

```bash
const ENDPOINT = "https://temp-arena-chat.herokuapp.com/"; // change this to const ENDPOINT = "http://localhost:5000/";
```

Start the server

```bash
  npm run start
```
Start the Client

```bash
  //open now terminal
  cd frontend
  npm start
```

  
# Features

### Authenticaton
![](https://i.imgur.com/pkWC7Vk.png)
![](https://i.imgur.com/vqxkRWO.png)
### Live Chatting w/Timestamps, date, and typing indicator
![](https://i.imgur.com/l5xYKz2.png)
### Both Single and Group Chats
![](https://i.imgur.com/BSKxUfH.png)
### Search Users to add
![](https://i.imgur.com/GYAR6bX.png)
### Create Group Chats
![](https://i.imgur.com/iRvT5W0.png)
### Notifications 
![](https://i.imgur.com/jdzuCKf.png)
### Update Group Members/Rename Group
![](https://i.imgur.com/CEAAocJ.png)
### View All Group Members
![](https://i.imgur.com/Xy6BYvx.png)
### View Individual Profile
![](https://i.imgur.com/isC17xf.png)
### Particles OFF mode
![](https://i.imgur.com/kXIg3Pn.png)
### Edit Profile Picture/Name
![](https://i.imgur.com/MOuVaTu.png)
### Chat filter using search bar
![](https://i.imgur.com/fk1meRR.png)
## Made By

- [@Siddharth-Nair](https://github.com/siddharth-nair-2/)
- [@Abed-Nassar](https://github.com/abedIronman)