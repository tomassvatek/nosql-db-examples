const fs = require("fs");
const data = require("../data/zomato.json");

// Purpose: mapping country code to country name
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

const commands = [];
data.forEach((res) => {
  commands.push(
    `db.restaurants.save({ _id: ${res["Restaurant ID"]}, name: "${
      res["Restaurant Name"]
    }", location: { country: "${getCountryName(res["Country Code"])}", city: "${
      res.City
    }" }, priceRange: ${res["Price range"]}, rating: { aggregate: ${
      res["Aggregate rating"]
    }, votes: ${res.Votes} }, hasOnlineDelivery: ${
      res["Has Online delivery"] === "No" ? false : true
    }, cuisines: "${res.Cuisines}" })`
  );
});

const fileName = "restaurants_init.txt";
fs.writeFile(fileName, commands.join("\r\n"), (err) => {
  if (err) {
    console.error("Failed to create init Mongo restaurants script.");
    throw err;
  }
  console.log(`File ${fileName} successfully created!`);
});