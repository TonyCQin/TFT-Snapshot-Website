const fs = require("fs").promises;
// Helper Libraries
const Participant = require("../Participant");
const util = require("../util");

// Path to tft.json
const jsonPath = util.path;
// API Key defined on external json file
let apiKey;

async function newUser() {
  // Get the API Key from the external config file
  apiKey = await util.fetchAPIKey();
  // Get a player list from the text file contained in the root directory of TonyCQin-Backend
  let playerList = await readFileToList("playerList.txt");
  let peopleStatList = [];
  // Loop through the List file and update all stats
  for (const player of playerList) {
    await getStats(player).then((playerStats) => {
      const userScore =
        util.tierMap.get(playerStats.tier) +
        util.rankMap.get(playerStats.rank) +
        playerStats.leaguePoints;
      let newPlayer = new Participant(
        player,
        playerStats.tier,
        playerStats.rank,
        playerStats.leaguePoints,
        userScore
      );
      peopleStatList.push(newPlayer);
    });
  }
  // Sort the List
  peopleStatList.sort(Participant.compareFn);
  // FOR DEBUG
  // console.log(peopleStatList);

  // Write to JSON File
  let jsonData = JSON.stringify(peopleStatList);
  fs.writeFile(jsonPath, jsonData, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  console.log("The New Users were saved!");
}

// Uses Riot API to gather Stats like LP, Rank, and Tier
async function getStats(username) {
  // API to Access Summoner ID
  const idAPI = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}${apiKey}`;
  // Get Summoner ID
  let user = await util.fetchData(idAPI);
  // API to Access Stats of Summoners
  const statAPI = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${user.id}${apiKey}`;
  return (await util.fetchData(statAPI))[0];
}

// Reads a File and Returns it as a List
async function readFileToList(filePath) {
  const data = await fs.readFile(filePath, (err) => {
    if (err) {
      return console.error("Error reading the file:", err);
    }
  });
  return data.toString().split(" ");
}

newUser();
