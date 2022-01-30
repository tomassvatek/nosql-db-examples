/**
 * Generating Cypher CREATE commands for Yelp dataset. The output is saved to the file.
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
      `CREATE ( :Business { id: "${res.business_id}", name: "${
        res.name
      }", location: "${res.city}", isOpen: ${
        res.is_open === 1 ? true : false
      }, star: ${res.stars}, votes: ${res.review_count} })`
    );
  });
  createFile("businesses_init.cypher", commands);
}

function createReviews() {
  const commands = [];
  reviewsData.forEach((res) => {
    commands.push(
      `CREATE ( :Review { id: "${res.review_id}", stars: ${res.stars}, cool: ${
        res.cool === 1 ? true : false
      }, date: "${res["date"]}", useful: ${
        res.useful === 1 ? true : false
      }, funny: ${res.funny === 1 ? true : false} })`
    );
  });
  createFile("reviews_init.cypher", commands);
}

function createUsers() {
  const commands = [];
  usersData.forEach((res) => {
    commands.push(
      `CREATE ( :User { id: "${res.user_id}", name: "${res.name}", reviewCount: ${res.review_count}, registeredDate: "${res.yelping_since}", funny: ${res.funny}, cool: ${res.cool}, useful: ${res.useful}, fans: ${res.fans} } )`
    );
  });
  createFile("users_init.cypher", commands);
}

function createReviewsRels() {
  const commands = [];
  reviewsData.forEach((res) => {
    commands.push(
      `MATCH (b:Business), (r:Review) WHERE b.id="${res.business_id}" AND r.id="${res.review_id}" CREATE (b)-[k:RECEIVED_REVIEW]->(r);`
    );
    commands.push(
      `MATCH (u:User), (r:Review) WHERE u.id="${res.user_id}" AND r.id="${res.review_id}" CREATE (u)-[k:DID_REVIEW]->(r);`
    );
  });
  createFile("usersRel_init.cypher", commands);
}

createBusinesses();
createReviews();
createUsers();
createReviewsRels();
