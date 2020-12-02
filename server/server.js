"use strict";
process.title = "jwt-app";

const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const MONGOURI = "mongodb+srv://your/mongouri"
const port = process.env.PORT || 1338;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const User = mongoose.model("users", UserSchema); 

app.set("trust proxy", 1);

app.use(function (req, res, next) {
  let allowedOrigins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://192.168.0.106:3000",
    "http://192.168.0.102:3000",
  ];
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(MONGOURI, 
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err) {
    if (err) return console.log(err);
    app.listen(port, function() {
      console.log(`Listening at Port ${port}`);
    });
  }
);

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "The password must be at least 6 characters long").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
            console.log("Error in Fetching user")
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json(
                  {"errors":[{"msg":"Email Address is Already Registered"}]}                    
                );
                console.log("Error in Fetching user")
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);


router.post(
  "/signin",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
      console.log(errors.array())
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user){
        return res.status(400).json({"errors":[{"msg":"User Not Exist"}]});
        console.log("User Not Exist")
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch){
        return res.status(400).json({"errors":[{"msg":"Incorrect Password"}]});
        console.log("Incorrect Password")
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 604800 //week
        },
        (err, token) => {
          if (err) throw err;
          let username = user.username;
          res.status(200).json({
            token, username
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);


const auth = function(req, res, next) {
  const token = req.header("authorization");
  if (!token){
    return res.status(401).json({ message: "Auth Error" });
    console.log("Auth Error")
  } 

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
    console.log("Invalid Token")
  }
};


router.get("/auth", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);    
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});


app.use("/", router);






