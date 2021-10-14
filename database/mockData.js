const {Post,Comment}=require('./index.js');

const postGenerator = (amount) => {
  const res = [];
  for (let i = 0; i < amount; i++) {
    const obj = {};
    obj.postID=i+1;
    obj.latitude = 37 + (stringNumberGenerator(6, 'num') / 1000000);
    obj.longitude = -122 - (stringNumberGenerator(6, 'num') / 1000000);
    obj.owner = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"][getRandomInt(0, 33)];
    obj.price = '$ '+String(getRandomInt(1, 100));
    obj.item = ['sword','music CD','thermometer',
      'ladle',
      'postage stamp',
      'lip gloss',
      'word search',
      'ocarina',
      'chalk',
      'ice cream stick',
      'tea pot',
      'hair brush',
      'chocolate',
      'chenille stick',
      'spoon',
      'whale',
      'bottle',
      'model car',
      'screwdriver',
      'notebook',
      'vase',
      'pair of safety goggles',
      'toy soldier',
      'canteen',
      'tire swing',
      'toy boat',
      'lamp',
      'baseball bat',
      'ball of yarn',
      'cucumber'][getRandomInt(0, 30)];
    obj.condition=['good','bad','used(normal wear)'][getRandomInt(0,3)]
    obj.dateCreated = String(stringNumberGenerator(13, 'num'));
    obj.description = stringNumberGenerator(getRandomInt(50, 300));
    obj.status=['active','sold'][getRandomInt(0, 2)];
    obj.photos=[`https://source.unsplash.com/featured/?${stringNumberGenerator(1)}`,`https://source.unsplash.com/featured/?${stringNumberGenerator(2)}`,`https://source.unsplash.com/featured/?${stringNumberGenerator(2)}`]
    res.push(obj);
  }
  return res;

}

const commentGenerator = (amount) => {
  const res = [];
  for (let i = 0; i < amount; i++) {
    const obj = {};
    obj.postID=getRandomInt(1,21);
    obj.asker = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"][getRandomInt(0, 33)];
    obj.dateCreated = String(stringNumberGenerator(13, 'num'));
    obj.comment = stringNumberGenerator(getRandomInt(20, 100));
    res.push(obj);
  }
  return res;

}
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
const stringNumberGenerator = (len, type = 'char') => {
  const src = type === 'num' ? '123456789' : 'abcdef gh ijklmn opqrstu vwxyz';
  const srcArray = src.split('');
  let result = '';
  for (let i = 0; i < len; i++) {
    result += srcArray[Math.floor(Math.random() * srcArray.length)];
  }
  return type === 'num' ? Number(result) : result;
}


Post.insertMany(postGenerator(20));
Comment.insertMany(commentGenerator(20));
