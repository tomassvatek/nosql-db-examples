## 🍕 Context

This dataset is a subset of Yelp's businesses, reviews, and user data. It was originally put together for the Yelp Dataset Challenge which is a chance for students to conduct research or analysis on Yelp's data and share their discoveries. In the most recent dataset you'll find information about businesses across 8 metropolitan areas in the USA and Canada.

We will work only with small subset of data.

Data has been downloaded from this [link](https://www.kaggle.com/yelp-dataset/yelp-dataset). Data are also available on the official [Yelp website](https://www.yelp.com/dataset/documentation/main).

## 📕 Database

### Business Node

- **\_id**: unique string business id
- **name**: the business's name
- **city**: the city
- **isOpen**: 0 or 1 for closed or open, respectively
- **star**: star rating, rounded to half-stars
- **votes**: number of reviews
- **categories**: an array of strings of business categories

## Review Node

- **\_id**: unique review id
- **date**: publish date
- **useful**: number of useful votes received
- **funny**: number of funny votes received
- **cool**: number of cool votes received

## User Node

- **\_id**: unique user id
- **name**: the user's first name
- **review_count**: the number of reviews they've written
- **registered_date**: when the user joined Yelp
- **averageStars**: average rating of all reviews
- **fans**: number of fans the user has
- **useful**: number of useful votes sent by the user
- **funny**: number of funny votes sent by the user
- **cool**: number of cool votes sent by the user

## Relationship Types

- **DID_REVIEW**: the user reviewed a business
- **RECEIVED_REVIEW** the businesses received a review

## 🚀 Setup

Run the `neo4j/scripts.js` script to generate Cypher `CREATE` commands.

> You can run Neo4j in Docker. The setup is easy.

### Docker setup

```shell
# Pull the official Neo4j Docker image
docker pull neo4j

# Run the container and mount local directory for persistent database
docker run --name <containerName> -v ~/<localDir>:/data/db -d mongo
docker run -p 7474:7474 -p 7687:7687 --name <containerName> -v  ~/<localDir>:/data/db -d neo4j
```

**Setup the database**
Copy init scripts (with file extension `.cypher`) to Neo4j desktop or your browser. Neo4j running on port 7474.

## 🎓 Tasks

1. Find business in Vancouver (location). Returns `id`, `name`, `location`.
2. Find business having at least 4.5 star and have the most reviews. You can't use business `votes` attribute. Returns `name` and `reviewsCount`.
3. Find 5-stars reviews considered as funny, useful and cool. Returns business `name`, review `stars`, `funny`, `useful` and `cool` attributes.
4. What is the average business rating in Austin?
5. Average restaurant (business has category "Restaurants") rating in each city. The result consist of `_id` field containing city and `avgRating` field containing average restaurants rating.
6. Find reviews created in 2018 (between 2018-01-01 and 2018-12-31). Returns `id`, business `name` and `date`.
7. Find all business reviews. Returns `businessName`, `reviewer` (user name), `stars` (business rating received by user), `reviewersFans` (user fans). Sort result by business and reviewer fans.
8. Find the most funny (based on the number of funny votes) user with `name` John. Returns `name`, `reviewCount` and the number of `funny` votes.
9. Find the most popular user (fans attribute) who reviewed 'Pittock Mansion' business. Returns `businessName`, `userName`, `stars` and `userFans`.
10. Find the user with a name starting with "J", registered in 2016 and with at least 80 reviews. Returns `name`, `registered_date` and `reviewCount`.

## ✅ Possible solutions

```
// 1. Find business in Vancouver (location). Returns `_id`, `name`, `location`.
MATCH (b:Business) WHERE b.location = "Vancouver" RETURN b.id, b.name, b.location

// 2. Find business having at least 4.5 star and have the most reviews. You can't use business `votes` attribute. Returns `name` and `reviewsCount`.
MATCH (b:Business)-[:RECEIVED_REVIEW]->(r:Review) WHERE b.star >= 4.5 RETURN b.name, count(b.id) as reviewCount ORDER BY reviewCount DESC

// 3. Find 5-stars reviews considered as funny, useful and cool. Returns business `name`, review `stars`, `funny`, `useful` and `cool` attributes.
MATCH (b:Business)-[:RECEIVED_REVIEW]->(r:Review) WHERE r.funny = TRUE AND r.useful = TRUE AND r.cool AND r.stars = 5 RETURN b.name, r.stars, r.funny, r.useful, r.cool

// 4. What is the average business rating in Austin? Returns `location` and `avgRating`.
MATCH (b:Business) WHERE b.location = "Austin" RETURN b.location, avg(b.star) as avgRating

// 5. Average business rating in each city sorted by rating. The result consist of `name` field containing city and 'avgRating' field containing average restaurants rating in the city.
MATCH (b:Business) RETURN b.location, avg(b.star) as avgRating ORDER BY avgRating DESC

// 6. Find reviews created in 2018 (between 2018-01-01 and 2018-12-31). Returns `id`, business `name` and `date`.
MATCH (b:Business)-[:RECEIVED_REVIEW]->(r:Review) WHERE r.date >= '2018-01-01' AND r.date <= '2018-12-31' RETURN r.id, b.name, r.date

// 7. Find all business reviews. Returns `businessName`, `reviewer` (user name), `stars` (business rating received by user), `reviewersFans` (user fans). Sort result by business and reviewer fans.
MATCH (u1:User)-[:DID_REVIEW]->(r:Review)<-[:RECEIVED_REVIEW]-(b:Business) RETURN b.name as businessName, u1.name as reviewer, r.stars as stars, u1.fans as reviewerFans ORDER BY businessName, u1.fans DESC

// 8. Find the most funny (based on the number of funny votes) user with `name` John. Returns `name`, `reviewsCount` and the number of `funny` votes.
MATCH (u:User) WHERE u.name = "John" RETURN u.name, u.reviewCount, u.funny ORDER BY u.funny DESC LIMIT 1

// 9. Find the most popular user (fans attribute) who reviewed 'Pittock Mansion' business. Returns `businessName`, `userName`, `stars` and `userFans`.
MATCH (u1:User)-[:DID_REVIEW]->(r:Review)<-[:RECEIVED_REVIEW]-(b:Business) WHERE b.name = "Pittock Mansion" RETURN b.name as businessName, u1.name as userName, r.stars as stars, u1.fans as userFans ORDER BY businessName, u1.fans DESC LIMIT 1

// 10. Find users with a name starting with "J", registered in 2016 and with at least 10 reviews. Returns `name`, `registered_date` and `reviewCount`.
MATCH (u:User) WHERE u.name STARTS WITH "J" AND u.registeredDate >= '2016-01-01' AND u.registeredDate <= '2016-12-31' AND u.reviewCount >= 10 RETURN u.name, u.registeredDate, u.reviewCount
```

## Summary

### Neo4j

- Steep learning curve if you know SQL.
- Superior data visualization.
- Joining nodes is simple.
- Cypher is declarative.
- Aggregate queries are simpler than Mongo.