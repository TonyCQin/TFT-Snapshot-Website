// THIS IS THE BACKEND FILE FOR THE RASPBERRY PI VERSION OF "TonyCQin.github.io"

const { json } = require("express");
const Participant = require("./Participant.js");

const fs = require("fs").promises;
let jsonPath = "../public/tft.json";
module.exports.path = jsonPath;
let tierMap = new Map([
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
module.exports.tierMap = tierMap;

let rankMap = new Map([
  ["IV", 100],
  ["III", 200],
  ["II", 300],
  ["I", 400],
]);

module.exports.rankMap = rankMap;

// Fetch Data from a API Link
const fetchData = async (link) => {
  const response = await fetch(link);
  if (!response.ok) {
    throw new Error("Network response was not ok for link: " + link);
  }
  const data = await response.json();
  return data;
};

module.exports.fetchData = fetchData;

// Fetch the API Key from the config file

const fetchAPIKey = async () => {
  try {
    const data = await fs.readFile("./config.json");
    let config = JSON.parse(data);
    // console.log(config);
    const apiKey = config.MY_KEY;
    // console.log(apiKey);
    return apiKey;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
};
module.exports.fetchAPIKey = fetchAPIKey;

module.exports.updateSnapshot = async () => {
  // Read and Parse the JSON File
  const data = await fs.readFile(jsonPath, (err) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
  });
  let personJSON = JSON.parse(data.toString());

  // Update Snapshot points
  const len = personJSON.length;
  for (let i = 0; i < len; i++) {
    personJSON[i].snapshotPoints += len - i;
  }

  // Write to JSON File
  let jsonData = JSON.stringify(personJSON);
  fs.writeFile(jsonPath, jsonData, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  console.log("The snapshotPoints were saved!");
};

// Update the Stats of the Summoners on the JSON FIle
module.exports.updateStats = async () => {
  // List of the updated stats
  let updatedPeopleStats = [];

  // Read and Parse the JSON File
  const data = await fs.readFile(jsonPath, (err) => {
    if (err) {
      return console.error("Error reading the file:", err);
    }
  });
  let personJSON = JSON.parse(data.toString());

  // Loop through the JSON file and update all stats
  for (const curStats of personJSON) {
    await getStats(curStats.username).then((newStats) => {
      const newUserScore =
        tierMap.get(newStats.tier) +
        rankMap.get(newStats.rank) +
        newStats.leaguePoints;
      let player = new Participant(
        curStats.username,
        newStats.tier,
        newStats.rank,
        newStats.leaguePoints,
        newUserScore,
        curStats.snapshotPoints
      );
      updatedPeopleStats.push(player);
    });
  }
  // Sort the List
  updatedPeopleStats.sort(Participant.compareFn);
  // FOR DEBUG
  // console.log(updatedPeopleStats);

  // Write to JSON File
  let jsonData = JSON.stringify(updatedPeopleStats);
  fs.writeFile(jsonPath, jsonData, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  console.log("The stats were saved!");
};

// Uses Riot API to gather Stats like LP, Rank, and Tier
async function getStats(username) {
  let apiKey = await fetchAPIKey();
  // API to Access Summoner ID
  const idAPI = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}${apiKey}`;
  // Get Summoner ID
  let user = await fetchData(idAPI);
  // API to Access Stats of Summoners
  const statAPI = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${user.id}${apiKey}`;
  return (await fetchData(statAPI))[0];
}

module.exports.resetSnapshot = async () => {
  // Read and Parse the JSON File
  const data = await fs.readFile(jsonPath, (err) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
  });
  let personJSON = JSON.parse(data.toString());

  // Update Snapshot points
  console.log("setting everything to 0");
  const len = personJSON.length;
  for (let i = 0; i < len; i++) {
    personJSON[i].snapshotPoints = 0;
  }

  // Write to JSON File
  let jsonData = JSON.stringify(personJSON);
  fs.writeFile(jsonPath, jsonData, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  console.log("The snapshotPoints were reset!");
};

module.exports.getJSON = async () => {
  const data = await fs.readFile(jsonPath, (err) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
  });
  console.log(data);
  return data;
};
