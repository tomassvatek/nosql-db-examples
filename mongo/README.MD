
## 🍕 Context
Zomato API Analysis is one of the most useful analysis for foodies who want to taste the best cuisines of every part of the world which lies in their budget. This analysis is also for those who want to find the value for money restaurants in various parts of the country for the cuisines. Additionally, this analysis caters the needs of people who are striving to get the best cuisine of the country and which locality of that country serves that cuisines with maximum number of restaurants. ♨️  

Data are available on this [link](https://www.kaggle.com/shrutimehta/zomato-restaurants-data).

## 📕 Database
### Restaurants
- **Restaurant Id**: Unique id of every restaurant across various cities of the world
- **Restaurant Name**: Name of the restaurant
- **Country**: Country in which restaurant is located
- **City**: City in which restaurant is located
- **Cuisines**: Cuisines offered by the restaurant
- **Price range**: range of price of food <1, 4>
- **Aggregate Rating**: Average rating out of 5
- **Votes**: Number of ratings casted by people

#### Sample instance
`{ "_id" : 6317637, "name" : "Le Petit Souffle", "location" : { "country" : "Phillipines", "city" : "Makati City" }, "priceRange" : 3, "rating" : { "aggregate" : 4.8, "votes" : 314 }, "hasOnlineDelivery" : false, "cuisines" : "French, Japanese, Desserts" }`

## 🚀 Setup
Run the `mongo/init/scripts.js` script to generate `restaurants_init.txt` containing the init Mongo script.

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
cp ~/yourWorkspace/svateto1/mongo/init/restaurants_init.txt mongo:/restaurants_init.txt

# Run the script inside Mongo shell
load("restaurants_init.txt")
```
  
## 🎓 Tasks
1. Find all restaurants which served Seafood and the restaurant rating is at least 3.5.

## ✅ Possible solutions
1. **Find the most expensive (price range is 4) restaurants in Tampa Bay.**  
`db.restaurants.find({ "location.city": "Tampa Bay", priceRange: 4 }).pretty()`  
2. **Find restaurants which offering Seafood and the restaurant rating is at least 3.5. Returns only restaurant name, cuisines and country.**  
`db.restaurants.find({ "rating.aggregate": {$gte: 3.5}, cuisines: { $in: ["Seafood"] } }).pretty()`
3. **Find restaurants in United States offering Seafood or Steak (cuisines).**  
`db.restaurants.find({ "location.country": "United States", cuisines: { $in: ["Seafood", "Steak"] } }, { _id: 0, name: 1, cuisines: 1, "location.country": 1 })`
4. **What is the average restaurant rating in India?**  
`db.restaurants.aggregate([ { $match: { "location.country": "India"  } }, { $group: { _id: 1, avgRating: {$avg: "$rating.aggregate"} }  }])`
5. **Average restaurant rating in each country. The result consist of '_id' field containing country name and 'avgRating' field containing average restaurants rating.**  
`db.restaurants.aggregate([ { $group: { _id: "$location.country", avgRating: {$avg: "$rating.aggregate"} } }, { $sort: { avgRating: -1 } } ])`


## Summary
We demonstrate some complex queries.