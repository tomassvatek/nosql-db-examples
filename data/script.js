/**
 * Helper JS script for transforming Yelp dataset to valid JSON.
 */

const fs = require("fs");


const MAX_ROWS = 100 * 100 * 100;

function createFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      console.error($`Failed to create file '${fileName}'.`);
      throw err;
    }
    console.log(`File ${fileName} successfully created!`);
  });
}

function convertToJSON(fileName, count = MAX_ROWS, condition = undefined) {
  try {
    const data = fs.readFileSync(fileName, "utf8");
    const lines = data.split(/\n/);
    const objects = [];

    lines.forEach((item, index) => {
      if (index > count) return;
      if (!item) return;

      if (condition && typeof condition == "function") {
        if (condition(JSON.parse(item))) {
          objects.push(item);
        }
      } else {
        objects.push(item);
      }
    });

    const wrapped = `[${objects.join(",")}]`;
    return wrapped;
  } catch (err) {
    console.error(err);
  }
}

function generateFiles() {
  const businessesJson = convertToJSON(
    "yelp_academic_dataset_business.json",
    300
  );
  createFile("businesses.json", businessesJson);
  const businesses = JSON.parse(businessesJson);
  const businessIds = businesses.map((s) => s.business_id);

  const reviewsJson = convertToJSON(
    "yelp_academic_dataset_review.json",
    MAX_ROWS,
    (item) => businessIds.some((id) => id == item.business_id)
  );
  createFile("reviews.json", reviewsJson);
  const reviews = JSON.parse(reviewsJson);
  const userIds = reviews.map((s) => s.user_id);

  const users = convertToJSON(
    "yelp_academic_dataset_user.json",
    MAX_ROWS,
    (item) => userIds.some((id) => id == item.user_id)
  );
  createFile("users.json", users);
}

generateFiles();
