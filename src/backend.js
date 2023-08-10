const fs = require("fs").promises;
// UPDATE EVERY HOUR
// Helper Libraries
const Participant = require("./Participant");
const util = require("./util");

// function for getting stats of people
async function getStats(username) {
  console.log("../config.json");
  const apiKey = await util.fetchAPIKey("../config.json");
  const link = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}${apiKey}`;

  // Final Data to be returned
  let finalData;

  // Get Summoner ID
  await util
    .fetchData(link)
    .then(async (user) => {
      let statLink = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${user.id}${apiKey}`;

      // Get Summoner Stats
      await util
        .fetchData(statLink)
        .then(async (userData) => {
          finalData = userData;
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  return finalData[0];
}

// adding people to the leaderboard.
let playerList = [
  "AetherCrest",
  "Jerry173821",
  "tkamat29",
  "Doruwaza",
  "Klustic",
  "Xenosol",
  "mattjzhou",
  "ECG Aero",
];

let playerListWithStats = [];

playerList.forEach(function (person) {
  getStats(person)
    .then((user) => {
      console.log(user);
      // console.log(util.tierMap);
      const userScore =
        util.tierMap.get(user.tier) +
        util.rankMap.get(user.rank) +
        user.leaguePoints;
      let player = new Participant(
        user.summonerName,
        user.tier,
        user.rank,
        user.leaguePoints,
        userScore
      );
      playerListWithStats.push(player);

      // sorting the array
      if (playerListWithStats.length == playerList.length) {
        playerListWithStats.sort(Participant.compareFn);
        // console.log(playerListWithStats);

        // saving data in JSON
        let jsonData = JSON.stringify(playerListWithStats);
        // console.log(jsonData);

        // writing to json file
        fs.writeFile("./public/tft.json", jsonData, function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("The summonerStats were saved!");
        });
        return jsonData;
      }
    })
    .catch((err) => console.log(err));
});
