const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://127.0.0.1:27017/myapp", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

const User = require("./models/user");
const Post = require("./models/post");

//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new User
    const newUser = new User({
      name,
      email,
      password,
      profileImage,
    });
    //save the user to the database
    await newUser.save();
    console.log(newUser);
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();


// login poinst

app.post("/login", async (req, res) => {
  try {
    console.log("this is triggered");
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user.password != password) {
      return res.json({ message: "password is incorrect" });
    }
    const token = jwt.sign({ userI: user._id }, secretKey);
    console.log(token);

  } catch (error) {
    console.log(error);

  }
});


//end point to get user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    console.log("tried geting user profile")

    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      console.log("usr not found");
    }

  } catch (error) {
    console.log(error);
  }
});

//end point to get all user and connections
app.get("/users/:userId", async (req, res) => {
  try {

    const loggedInUserId = req.params.userId;
    const loggedInuser = await User.findById(loggedInUserId).populate("connections", "_id");
    if (!loggedInuser) {
      return res.json({ message: "logged in user not found" })
    }

    //get ID of people who are connected;

    const connectedUserIds = loggedInuser.connectionRequests.map((connection) => connection._id)
    //find user who are not connect and id

    const user = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUserIds }
    });

  } catch (error) {
    console.log(error);
  }
});




