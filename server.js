const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
let bodyParser = require('body-parser');

// Import the data layer
createAndSaveUser = require("./dbLayer.js").createAndSaveUser;
findUserName = require("./dbLayer.js").findUserName;createAndSaveExercise = require("./dbLayer.js").createAndSaveExercise;
findUserGeneral = require("./dbLayer.js").findUserGeneral
findUserId = require("./dbLayer.js").findUserId
findUserExercise = require("./dbLayer.js").findUserExercise

app.use(cors());
// This makes the styling files accessible
app.use(express.static('public'));
// This is use to provide the middleware to parse the post headers 
app.use(bodyParser.urlencoded({extended: false}));

// Logger middleware to log incoming requests
app.use((req, res, next) => {
  const logStr = `${req.method} ${req.path} - ${req.ip}`
  console.log(logStr)
  next()
});

// Endpoint to list all users
app.get('/api/exercise/users', (req, res) => {
  findUserGeneral({}, (err, data) => {
    if (err) return console.error(err)
    res.json(data)
  })
})

// Endpoint to create a new user
app.post('/api/exercise/new-user', (req, res) => {
  // First try find if the username exists
  findUserName(req.body.username, (err, data) => {
    if (err) return console.error(err)
    // If an entry is returned return an error else return the created entry data
    if (data.length){
      res.send("Username already taken")
    } else {
      createAndSaveUser(req.body.username, (err,data) => {
        if (err) {
          return console.error(err);
        } 
        // Return the created entry
        res.json(data)
      })
    }
  })
})

// Endpoint to add an exercise to the log
app.post('/api/exercise/add', (req, res) => {
  // Log an exercise, if the date is not defined ("") parse undefined
  createAndSaveExercise(req.body.userId, req.body.description, req.body.duration, req.body.date==""?undefined:req.body.date, (err,data) => {
    // Error handling from the data layer
    if (err) {
      // Log the error to the console
      console.error(err.errors);
      let msg = ""
      // If the userId field is the cause of the error
      if (err.errors.hasOwnProperty("userId")) msg = err.errors.userId.message;
      // If the description field is the cause of the error
      else if (err.errors.hasOwnProperty("description")) msg = err.errors.description.message;
      // If the duration field is the cause of the error
      else if (err.errors.hasOwnProperty("duration")) msg = err.errors.duration.message;
      // If the date field is the cause of the error
      else if (err.errors.hasOwnProperty("date")) msg = err.errors.date.message;
      // Else a general error
      else msg = err.errors
      // Return the error
      return res.send(msg);
    }
    // Return the created entry by spec
    findUserId(req.body.userId, (err, data_user) => {
      if (err) return console.error(err)
      res.json({
        _id: data.userId,
        username:data_user.username,
        date:data.date.toDateString(),
        duration:data.duration,
        description:data.description
      })
    })
  })
})

// Endpoint to retrieve the log
app.get("/api/exercise/log", (req, res) => {
  findUserExercise(req.query.userId, req.query.from, req.query.to, parseInt(req.query.limit), (err, data) => {
    if (err) {
      console.error(err);
      // Return the error
      return res.send(err.message);
    }
    res.json({log:data, count:data.length})
  })
})

// Endpoint for the root form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Log server startup
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
