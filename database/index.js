const mongoose = require('mongoose');
const { Schema, model } = mongoose;
mongoose.connect('mongodb://localhost/mvp', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected'), err => console.log('err'));

const postSchema = new Schema({
  postID:Number,
  owner:String,
  price:String,
  latitude: Number,
  longitude: Number,
  item:String,
  description:String,
  status:String,
  dateCreated:String,
  condition:String,
  photos:[],
});

const Post = model('post', postSchema);

const commentSchema=new Schema({
  postID:Number,
  asker:String,
  dateCreated:String,
  comment:String,
})
const Comment = model('comment', commentSchema);

const userSchema=new Schema({
  username:String,
  password:String,
  email:String,
})
const User = model('user', userSchema);


module.exports = {Post,Comment,User};