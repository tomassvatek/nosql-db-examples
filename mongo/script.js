const fs = require("fs");
const data = require("../data/zomato.json");
const businessData = require("../data/businesses.json");
const reviewsData = require("../data/reviews.json");
const usersData = require("../data/users.json");

// Purpose: mapping a country code to a country name
const countries = [
  { id: 1, name: "India" },
  { id: 14, name: "Australia" },
  { id: 30, name: "Brazil" },
  { id: 37, name: "Canada" },
  { id: 94, name: "Indonesia" },
  { id: 148, name: "New Zealand" },
  { id: 162, name: "Phillipines" },
  { id: 166, name: "Qatar" },
  { id: 184, name: "Singapore" },
  { id: 189, name: "South Africa" },
  { id: 191, name: "Sri Lanka" },
  { id: 208, name: "Turkey" },
  { id: 214, name: "UAE" },
  { id: 215, name: "United Kingdom" },
  { id: 216, name: "United States" },
];

function getCountryName(countryCode) {
  return countries.find((c) => c.id === countryCode)?.name ?? "-";
}

function createFile(fileName, commands) {
  fs.writeFile(fileName, commands.join("\r\n"), (err) => {
    if (err) {
      console.error($`Failed to create file '${fileName}'.`);
      throw err;
    }
    console.log(`File ${fileName} successfully created!`);
  });
}

function createInitRestaurants() {
  const commands = [];
  data.forEach((res) => {
    commands.push(
      `db.restaurants.save({ _id: ${res["Restaurant ID"]}, name: "${
        res["Restaurant Name"]
      }", location: { country: "${getCountryName(
        res["Country Code"]
      )}", city: "${res.City}" }, priceRange: ${
        res["Price range"]
      }, rating: { aggregate: ${res["Aggregate rating"]}, votes: ${
        res.Votes
      } }, hasOnlineDelivery: ${
        res["Has Online delivery"] === "No" ? false : true
      }, cuisines: "${res.Cuisines}" })`
    );
  });
  createFile("restaurants_init.txt", commands);
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
      } }, isOpen: ${res["is_open"] === "0" ? false : true}, categories: [${
        res.categories.split(",").map(category => `"${category.trim()}",`).join(" ")
      }] })`
    );
  });
  createFile("businesses_init.txt", commands);
}

// function createReviews() {
//   const commands = [];
//   reviewsData.forEach((res) => {
//     commands.push(
//       `db.reviews.save({ _id: "${res.review_id}", userId: "${
//         res.user_id
//       }", "businessId": "${res.business_id}", text: "${res.text
//         .replace(/\n/g, "\\n")
//         .replace(/\"/g, "")}", cool: ${res.cool === 1 ? true : false}, date: "${
//         res["date"]
//       }", useful: ${res.useful === 1 ? true : false}, funny: ${
//         res.funny === 1 ? true : false
//       } })`
//     );
//   });
//   createFile("reviews_init.txt", commands);
// }

function createReviews() {
  const commands = [];
  reviewsData.forEach((res) => {
    commands.push(
      `db.reviews.save({ _id: "${res.review_id}", userId: "${
        res.user_id
      }", "businessId": "${res.business_id}", "stars": ${res.stars}, cool: ${res.cool === 1 ? true : false}, date: "${
        res["date"]
      }", useful: ${res.useful === 1 ? true : false}, funny: ${
        res.funny === 1 ? true : false
      } })`
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
      }, funny: ${res.funny}, cool: ${
        res.cool
      }, friends: [${
        res.friends.split(",").map(friends => `"${friends.trim()}",`).join(" ")
      }] })`
    );
  });
  createFile("users_init.txt", commands);
}

//createBusinesses();
//createReviews();
createUsers();
//createInitRestaurants();
