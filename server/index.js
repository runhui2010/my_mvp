const express = require("express");
const bodyParser = require("body-parser");
const { Post, Comment, User } = require("../database/index.js");
const uuid = require("uuid");
const axios = require("axios");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './.env' });

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/../client/dist"));

app.get("/post", (req, res) => {
  Post.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: "comments",
        localField: "postID",
        foreignField: "postID",
        as: "comment",
      },
    },
  ]).exec((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});
app.post("/post/new", (req, res) => {
  var options = {
    method: "GET",
    url: "https://google-maps-geocoding.p.rapidapi.com/geocode/json",
    params: { address: req.body.address, language: "en" },
    headers: {
      "x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com",
      "x-rapidapi-key": "0de79f7ca2msh9485dbe1e030c04p165436jsnd8eeb42c5b14",
    },
  };
  axios.request(options).then((response) => {
    const { lat, lng } = response.data.results[0].geometry.location;
    const id = parseInt(uuid.v4().split("-")[0], 16);
    const date = Date.now();
    Post.create(
      {
        postID: id,
        owner: req.body.owner,
        price: req.body.price,
        latitude: lat,
        longitude: lng,
        item: req.body.item,
        description: req.body.description,
        status: "active",
        photos: req.body.photos,
        dateCreated: String(date.valueOf()),
        condition: req.body.condition,
      },
      (err, data) => {
        if (err) {
          res.send(400);
        } else {
          res.send(201);
        }
      }
    );
  });
});
app.post("/post/comment", (req, res) => {
  Post.find({ postID: req.body.owner }, (err, data) => {
    if (err) {
      res.sendStatus(400);
    } else {
      console.log(data);
      Comment.insertMany(
        {
          postID: data[0].postID,
          asker: req.body.currUser,
          dateCreated: String(Date.now().valueOf()),
          comment: req.body.comment,
        },
        (err, result) => {
          if (err) {
            res.sendStatus(400);
          } else {
            res.sendStatus(201);
          }
        }
      );
    }
  });
});

app.post("/post/signup", async (req, res) => {
  const response = await User.find({ email: req.body.email });
  if (response.length > 0) {
    res.send('exist');
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      username: req.body.username,
      password: hash,
      email: req.body.email,
    });
    const user = {
      id: newUser._id,
      username: newUser.username
    };
    jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
      res.send(token);
    });
  }
});
app.post("/post/login", async (req, res) => {
  const response = await User.find({ email: req.body.email });
  if (response.length > 0) {
    const password = await response[0].password;
    const bool = await bcrypt.compare(req.body.password, password);
    if (bool) {
      const { _id, username} = response[0];
      const user = {
        id: _id,
        username
      };
      jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        res.send(token);
      });
    } else {
      res.send('incorrect');
    }
  } else {
    res.send('incorrect');
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
