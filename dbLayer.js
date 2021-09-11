require('dotenv').config();
let mongoose = require('mongoose');

// General connection to db
mongoose.connect(process.env.DB_URI, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

//Schema for a user
const user = new mongoose.Schema({
  username: {
    type:String,
    required:true
  }
});

// Create the user model
const User = mongoose.model("User", user);

//Schema for exercise log
const exercise = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    min: [1, "duration too short"],
    required: true
  },
  date: {
    type: Date,
    default: () => {
      let today = new Date();
      return new Date(today.toLocaleDateString().slice(0, 10))
    }
  }
});

// Create the exercise log model
const Exercise = mongoose.model("Exercise", exercise);

// Create a new user document and save it
const createAndSaveUser = (username, done) => {
  const newUser = new User({
    username
  });
  newUser.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Create a new exercise log document and save it
const createAndSaveExercise = (userId, description, duration, date, done) => {
  const newExercise = new Exercise({
    userId, 
    description, 
    duration, 
    date
  });
  let error = newExercise.validateSync();
  if (error) {
    console.log("Validation error")
    return done(error, null);
  }
  newExercise.save(function(err, data) {
    if (err) return done(err, null);
    done(null, data);
  })
};

// Find a user document by the username
const findUserName = (username, done) => {
  findUserGeneral({username},done)
}

// Find a user document by the id
const findUserId = (userId, done) => {
  User.findById(userId, (err, data)=>{
    if (err) return console.error(err);
    done(null, data)
  })
}

// Find a user document by a general object
const findUserGeneral = (userSch, done) => {
  User.find(userSch, (err, data) => {
    if (err) return console.error(err);
    done(null,data);
  });
}

// Find a users exercise log document by user id
const findUserExercise = (userId, from, to, limit, done) => {
  // Build a query object
  // Find via the user id
  let query = Exercise.find({userId:userId})
  // If the to or from parameters are defined extend the query
  if (from != undefined && to != undefined) {
    query.find({date:{$gte:from, $lte:to}})
  } 
  else if (to != undefined) {
    query.find({date:{$lte:to}})
  }
  else if (from != undefined) {
    query.find({date:{$gte:from}})
  }
  // If a limit is defined extend the query
  if (limit != undefined) query.limit(limit)
  // Execute the query
  query.exec((err, data) => {
    if (err) {
      console.error("query error")
      return done(err,null);
    }
    done(null,data);
  })
}

// Exports
module.exports.createAndSaveUser = createAndSaveUser;
module.exports.findUserName = findUserName;
module.exports.createAndSaveExercise = createAndSaveExercise;
module.exports.findUserGeneral = findUserGeneral;
module.exports.findUserId = findUserId;
module.exports.findUserExercise = findUserExercise