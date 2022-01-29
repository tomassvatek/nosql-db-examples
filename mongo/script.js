/**
 * Generating mongo `save` command for each row in the dataset. The output is saved to the file.
 */

const fs = require("fs");
const businessData = require("../data/businesses.json");
const reviewsData = require("../data/reviews.json");
const usersData = require("../data/users.json");

function createFile(fileName, commands) {
  fs.writeFile(fileName, commands.join("\r\n"), (err) => {
    if (err) {
      console.error($`Failed to create file '${fileName}'.`);
      throw err;
    }
    console.log(`File ${fileName} successfully created!`);
  });
}

function createBusinesses() {
  const commands = [];
  businessData.forEach((res) => {
    commands.push(
      `db.businesses.save({ _id: "${res["business_id"]}", name: "${
        res["name"]
      }", location: { country: "${res.state}", city: "${
        res.city
      }" }, rating: { star: ${res["stars"]}, votes: ${
        res.review_count
      } }, isOpen: ${
        res["is_open"] === "0" ? false : true
      }, categories: [${res.categories
        .split(",")
        .map((category) => `"${category.trim()}",`)
        .join(" ")}] })`
    );
  });
  createFile("businesses_init.txt", commands);
}

function createReviews() {
  const commands = [];
  reviewsData.forEach((res) => {
    commands.push(
      `db.reviews.save({ _id: "${res.review_id}", userId: "${
        res.user_id
      }", "businessId": "${res.business_id}", "stars": ${res.stars}, cool: ${
        res.cool === 1 ? true : false
      }, date: "${res["date"]}", useful: ${
        res.useful === 1 ? true : false
      }, funny: ${res.funny === 1 ? true : false} })`
    );
  });
  createFile("reviews_init.txt", commands);
}

function createUsers() {
  const commands = [];
  usersData.forEach((res) => {
    commands.push(
      `db.users.save({ _id: "${res.user_id}", name: "${
        res.name
      }", "reviewCount": ${res.review_count}, registered_date: "${
        res.yelping_since
      }", averageStars: ${res.average_stars}, fans: ${res.fans}, useful: ${
        res.useful
      }, funny: ${res.funny}, cool: ${res.cool}, friends: [${res.friends
        .split(",")
        .map((friends) => `"${friends.trim()}",`)
        .join(" ")}] })`
    );
  });
  createFile("users_init.txt", commands);
}

createBusinesses();
createReviews();
createUsers();
