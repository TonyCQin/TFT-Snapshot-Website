// THIS IS THE BACKEND FILE FOR THE RASPBERRY PI VERSION OF "TonyCQin.github.io"

const fs = require("fs").promises;
module.exports.path = "./tft.json";
module.exports.tierMap = new Map([
  ["IRON", 1000],
  ["BRONZE", 2000],
  ["SILVER", 3000],
  ["GOLD", 4000],
  ["PLATINUM", 5000],
  ["DIAMOND", 6000],
  ["MASTER", 7000],
  ["GRANDMASTER", 7000],
  ["CHALLENGER", 7000],
]);
module.exports.rankMap = new Map([
  ["IV", 100],
  ["III", 200],
  ["II", 300],
  ["I", 400],
]);

// Fetch Data from a API Link
module.exports.fetchData = async (link) => {
  const response = await fetch(link);
  if (!response.ok) {
    throw new Error("Network response was not ok for link: " + link);
  }
  const data = await response.json();
  return data;
};

// Fetch the API Key from the config file
module.exports.fetchAPIKey = async () => {
  try {
    const data = await fs.readFile("../config.json");
    let config = JSON.parse(data);
    // console.log(config);
    const apiKey = config.MY_KEY;
    // console.log(apiKey);
    return apiKey;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
};
