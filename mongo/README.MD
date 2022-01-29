## 🍕 Context

This dataset is a subset of Yelp's businesses, reviews, and user data. It was originally put together for the Yelp Dataset Challenge which is a chance for students to conduct research or analysis on Yelp's data and share their discoveries. In the most recent dataset you'll find information about businesses across 8 metropolitan areas in the USA and Canada.

We will work only with small subset of data.

Data has been downloaded from this [link](https://www.kaggle.com/yelp-dataset/yelp-dataset). Data are also available on the official [Yelp website](https://www.yelp.com/dataset/documentation/main).

## 📕 Database

### Businesses

- **\_id**: unique string business id
- **name**: the business's name
- **country**: 2 character state code
- **city**: the city
- **isOpen**: 0 or 1 for closed or open, respectively
- **star**: star rating, rounded to half-stars
- **votes**: number of reviews
- **categories**: an array of strings of business categories

#### Sample document

`{ "_id" : "dmbbf3AqeG61_QHRZi1M1w", "name" : "RaceTrac", "location" : { "country" : "FL", "city" : "Pine Castle" }, "rating" : { "star" : 3.5, "votes" : 5 }, "isOpen" : true, "categories" : "Automotive, American (Traditional), Gas Stations, Restaurants, Food, Beer, Wine & Spirits" }`

## Reviews

- **\_id**: unique review id
- **userId**: 22 character unique user id, maps to the user
- **business_id**: 22 character business id,
- **date**: publish date
- **useful**: number of useful votes received
- **funny**: number of funny votes received
- **cool**: number of cool votes received

### Sample document

`{ "_id" : "99qoyvCsdkXYy49Ub4NRrg", "userId" : "rna69ht22tSBpdgyGAN1BQ", "businessId" : "N6usNa3_rcYOb8NQ7-Wq3A", "cool" : false, "date" : "2015-06-21 00:07:40", "useful" : true, "funny" : false }`

## Users

- **\_id**: unique user id
- **name**: the user's first name
- **review_count**: the number of reviews they've written
- **registered_date**: when the user joined Yelp
- **averageStars**: average rating of all reviews
- **friends**: array of strings, an array of the user's friend as user_ids
- **fans**: number of fans the user has
- **useful**: number of useful votes sent by the user
- **funny**: number of funny votes sent by the user
- **cool**: number of cool votes sent by the user

#### Sample document

`{ "_id" : "tXhscxwFTd-ayLTdPx_2yA", "name" : "Jonah", "reviewCount" : 1670, "registered_date" : "2008-11-15 19:55:50", "averageStars" : 3.44, "friends" : "ndqd2jIOr40hR9nisrk2Uw, NJN4do4b1Wnpnz0MyCS2aQ, 9wttW83E5hI3aeIg9dgymg", "fans" : 53, "useful" : 82, "funny" : 25, "cool" : 46 } `

## 🚀 Setup

Run the `mongo/scripts.js` script to generate `restaurants_init.txt` containing the init Mongo script.

> You can run MongoDB in Docker. The setup is easy.

### Docker setup

```shell
# Pull the official Mongo Docker image
docker pull mongo

# Run the container and mount local directory for persistent database
docker run --name <containerName> -v ~/<localDir>:/data/db -d mongo

# Connect to the container and start the bash process
docker exec -it <containerName> bash

# Start Mongo shell inside the container
mongo
```

**Setup the database**

```shell
# Copy init script to Docker container
docker cp ~/yourWorkspace/svateto1/mongo/restaurants_init.txt mongo:/restaurants_init.txt

docker cp ~/Repositories/school/ni-pdb/svateto1/mongo/businesses_init.txt mongo:/businesses_init.txt
docker cp ~/Repositories/school/ni-pdb/svateto1/mongo/reviews_init.txt mongo:/reviews_init.txt
docker cp ~/Repositories/school/ni-pdb/svateto1/mongo/users_init.txt mongo:/users_init.txt

# Run the script inside Mongo shell
load("businesses_init.txt")
load("reviews_init.txt")
load("users_init.txt")
```

## 🎓 Tasks

1. Find restaurants (business has category "Restaurants") in Vancouver. Returns `_id`, `name`, `location.city` and `categories`.
2. Find restaurant offering Seafood (restaurant must have category "Seafood") that has at least 3.5 star. Returns only `name`, `categories` and `city`.
3. Find 5-stars reviews considered as funny, useful and cool. Returns `businessId`, `stars`, `funny`, `useful` and `cool` attributes.
4. What is the average restaurant rating in Austin?
5. Average restaurant (business has category "Restaurants") rating in each city. The result consist of `_id` field containing city and `avgRating` field containing average restaurants rating.
6. Find reviews created in 2018 (between 2018-01-01 and 2018-12-31). Returns `_id`, `businessId` and `date`.
7. Find restaurants (business has category "Restaurants") where serving Sandwiches and Pizza (both meals included in `categories` attribute). Returns `name` and `categories`.
8. Find the most funny (based on the number of funny votes) user with `name` John. Returns `name`, `reviewCount` and the number of `funny` votes.
9. Find the user with the most friends. Returns `name` and `numberOfFriends`.
10. Find the user with a name starting with "J", registered in 2016 and with at least 80 reviews. Returns `name`, `registered_date` and `reviewCount`.

## ✅ Possible solutions

```javascript
// 1. Find restaurants (business has category "Restaurants") in Vancouver.
db.businesses
  .find({ "location.city": "Vancouver", categories: { $in: ["Restaurants"] } })
  .pretty();

// 2. Find restaurant offering Seafood (restaurant must have category "Seafood") that has at least 3.5 star. Returns only name, categories and city.
db.businesses
  .find(
    { "rating.star": { $gte: 3.5 }, categories: { $in: ["Seafood"] } },
    { _id: 0, name: 1, categories: 1, "location.city": 1 }
  )
  .pretty();

// 3. Find 5-stars reviews considered as funny, useful and cool. Returns `businessId`, `stars`, `funny`, `useful` and `cool` attributes.
db.reviews
  .find(
    { $and: [{ stars: 5 }, { funny: true }, { useful: true }, { cool: true }] },
    { businessId: 1, stars: 1, funny: 1, useful: 1, cool: 1 }
  )
  .pretty();

// 4. What is the average restaurant rating in Austin?
// Correct result: { "_id" : 1, "avgRating" : 3.6481481481481484 }
db.businesses.aggregate([
  { $match: { "location.city": "Austin" } },
  { $group: { _id: 1, avgRating: { $avg: "$rating.star" } } },
]);

// 5. Average restaurant (business has category "Restaurants") rating in each city sorted by rating. The result consist of '_id' field containing city and 'avgRating' field containing average restaurants rating.
db.businesses.aggregate([
  { $match: { categories: { $in: ["Restaurants"] } } },
  { $group: { _id: "$location.city", avgRating: { $avg: "$rating.star" } } },
  { $sort: { avgRating: -1 } },
]);

// 6. Find reviews created in 2018 (between 2018-01-01 and 2018-12-31). Returns `_id`, `businessId` and `date`.
db.reviews
  .find(
    { date: { $gte: "2018-01-01", $lte: "2018-12-31" } },
    { _id: 1, businessId: 1, date: 1 }
  )
  .pretty();

// 7. Find restaurants (business has category "Restaurants") where serving Sandwiches and Pizza (both meals included in `categories` attribute). Returns `name` and `categories`.
db.businesses
  .find(
    {
      $and: [
        { categories: "Restaurants" },
        { categories: "Sandwiches" },
        { categories: "Pizza" },
      ],
    },
    { _id: 0, name: 1, categories: 1 }
  )
  .pretty();

// 8. Find the most funny (based on the number of funny votes) user with `name` John. Returns `name`, `reviewsCount` and the number of `funny` votes.
db.users
  .find({ name: "John" }, { _id: 0, name: 1, funny: 1 })
  .sort({ funny: -1 })
  .limit(1)
  .pretty();

// 9. Find the user with the most friends. Returns `name` and `numberOfFriends`.
db.users
  .find({}, { _id: 0, name: 1, number: { $size: "$friends" } })
  .sort({ number: -1 })
  .limit(1)
  .pretty();

// 10. Find the user with a name starting with "J", registered in 2016 and with at least 10 reviews. Returns `name`, `registered_date` and `reviewCount`.
// # Correct result: { "name" : "Josephine", "reviewCount" : 34, "registered_date" : "2016-02-07 22:23:43" }
db.users
  .find(
    {
      $and: [
        { name: { $regex: /^J/ } },
        { registered_date: { $gte: "2016-01-01", $lte: "2016-12-31" } },
        { reviewCount: { $gte: 10 } },
      ],
    },
    { _id: 0, name: 1, registered_date: 1, reviewCount: 1 }
  )
  .pretty();
```

## Summary

- Joining collections is hard.
- Complex queries demand deep nesting.
- I really liked JavaScript-like query syntax.
