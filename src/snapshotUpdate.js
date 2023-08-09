// THIS IS THE BACKEND FILE FOR THE RASPBERRY PI VERSION OF "TonyCQin.github.io"

const fs = require("fs").promises;
// Helper Libraries
const util = require("./util");

// Path to tft.json
const jsonPath = util.path;

async function updateSnapshot() {
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
  fs.writeFile("./tft.json", jsonData, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  console.log("The snapshotPoints were saved!");
}

updateSnapshot();
