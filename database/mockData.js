const { Post, Comment } = require("./index.js");

const postGenerator = (amount) => {
  const res = [];
  for (let i = 0; i < amount; i++) {
    const obj = {};
    obj.postID = i + 1;
    obj.latitude = 37 + stringNumberGenerator(6, "num") / 1000000;
    obj.longitude = -122 - stringNumberGenerator(6, "num") / 1000000;
    obj.owner = [
      "Adam",
      "Alex",
      "Aaron",
      "Ben",
      "Carl",
      "Dan",
      "David",
      "Edward",
      "Fred",
      "Frank",
      "George",
      "Hal",
      "Hank",
      "Ike",
      "John",
      "Jack",
      "Joe",
      "Larry",
      "Monte",
      "Matthew",
      "Mark",
      "Nathan",
      "Otto",
      "Paul",
      "Peter",
      "Roger",
      "Roger",
      "Steve",
      "Thomas",
      "Tim",
      "Ty",
      "Victor",
      "Walter",
    ][getRandomInt(0, 33)];
    obj.price = "$ " + String(getRandomInt(1, 100));
    obj.item = [
      "sword",
      "music CD",
      "thermometer",
      "ladle",
      "postage stamp",
      "lip gloss",
      "word search",
      "ocarina",
      "chalk",
      "ice cream stick",
      "tea pot",
      "hair brush",
      "chocolate",
      "chenille stick",
      "spoon",
      "whale",
      "bottle",
      "model car",
      "screwdriver",
      "notebook",
      "vase",
      "pair of safety goggles",
      "toy soldier",
      "canteen",
      "tire swing",
      "toy boat",
      "lamp",
      "baseball bat",
      "ball of yarn",
      "cucumber",
    ][getRandomInt(0, 30)];
    obj.condition = ["good", "bad", "used(normal wear)"][getRandomInt(0, 3)];
    obj.dateCreated = String(stringNumberGenerator(13, "num"));
    obj.description = [
      "You realize you're not alone as you sit in your bedroom massaging your calves after a long day of playing tug-of-war with Grandpa Joe in the hospital.",
      "As the rental car rolled to a stop on the dark road, her fear increased by the moment.",
      "Best friends are like old tomatoes and shoelaces.",
      "The hummingbird's wings blurred while it eagerly sipped the sugar water from the feeder.",
      "After coating myself in vegetable oil I found my success rate skyrocketed.",
      "The snow-covered path was no help in finding his way out of the back-country.",
      "The family’s excitement over going to Disneyland was crazier than she anticipated.",
      "The sunblock was handed to the girl before practice, but the burned skin was proof she did not apply it.",
      "The father handed each child a roadmap at the beginning of the 2-day road trip and explained it was so they could find their way home.",
      "Sometimes I stare at a door or a wall and I wonder what is this reality, why am I alive, and what is this all about",
    ][getRandomInt(0, 10)];
    obj.status = ["active", "sold"][getRandomInt(0, 2)];
    obj.photos = [
      `https://source.unsplash.com/featured/?${obj.item}`,
      `https://source.unsplash.com/featured/?${stringNumberGenerator(1)}`,
      `https://source.unsplash.com/featured/?${stringNumberGenerator(2)}`,
    ];
    res.push(obj);
  }
  return res;
};

const commentGenerator = (amount) => {
  const res = [];
  for (let i = 0; i < amount; i++) {
    const obj = {};
    obj.postID = getRandomInt(1, 21);
    obj.asker = [
      "Adam",
      "Alex",
      "Aaron",
      "Ben",
      "Carl",
      "Dan",
      "David",
      "Edward",
      "Fred",
      "Frank",
      "George",
      "Hal",
      "Hank",
      "Ike",
      "John",
      "Jack",
      "Joe",
      "Larry",
      "Monte",
      "Matthew",
      "Mark",
      "Nathan",
      "Otto",
      "Paul",
      "Peter",
      "Roger",
      "Roger",
      "Steve",
      "Thomas",
      "Tim",
      "Ty",
      "Victor",
      "Walter",
    ][getRandomInt(0, 33)];
    obj.dateCreated = String(stringNumberGenerator(13, "num"));
    obj.comment = [
      "I was starting to worry that my pet turtle could tell what I was thinking.",
      "Italy is my favorite country; in fact, I plan to spend two weeks there next year.",
      "I don’t respect anybody who can’t tell the difference between Pepsi and Coke.",
      "Rock music approaches at high velocity.",
      "They desperately needed another drummer since the current one only knew how to play bongos.",
      "The quick brown fox jumps over the lazy dog.",
      "After fighting off the alligator, Brian still had to face the anaconda.",
      "He would only survive if he kept the fire going and he could hear thunder in the distance.",
      "Nancy thought the best way to create a welcoming home was to line it with barbed wire.",
      "They say people remember important moments in their life well, yet no one even remembers their own birth.",
    ][getRandomInt(0, 10)];
    res.push(obj);
  }
  return res;
};
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
const stringNumberGenerator = (len, type = "char") => {
  const src = type === "num" ? "123456789" : "abcdef gh ijklmn opqrstu vwxyz";
  const srcArray = src.split("");
  let result = "";
  for (let i = 0; i < len; i++) {
    result += srcArray[Math.floor(Math.random() * srcArray.length)];
  }
  return type === "num" ? Number(result) : result;
};

Post.insertMany(postGenerator(20));
Comment.insertMany(commentGenerator(20));
