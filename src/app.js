const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const http = require("http");

const app = express();
const port = 8080;
const host = "localhost";

let indexFile;
let scriptFile;
let cssFile;
let participantFile;
let tftjsonFile;

app.use(express.static("public")); // Serve static files from the 'public' directory

// Serve the Participant.js file
app.get("/Participant.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.end(participantFile);
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(indexFile);
});

// Serve the script.js file
app.get("/script.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.end(scriptFile);
});

// Serve the style.css file
app.get("/style.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.end(cssFile);
});

// Serve the tft.json file
app.get("/tft.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(tftjsonFile);
});

// Serve the rankimages directory
app.use("/rankimages", express.static("../public/rankimages"));

const server = http.createServer(app);

// Read Participant.js first, then start the server
fs.readFile(path.join(__dirname, "Participant.js"))
  .then((contents) => {
    participantFile = contents;
    // console.log("Participant.js read");
    return fs.readFile(path.join(__dirname, "../public/index.html"));
  })
  .then((contents) => {
    indexFile = contents;
    // console.log("index.html read");
    return fs.readFile(path.join(__dirname, "../public/script.js"));
  })
  .then((contents) => {
    scriptFile = contents;
    // console.log("script.js read");
    return fs.readFile(path.join(__dirname, "../public/style.css"));
  })
  .then((contents) => {
    cssFile = contents;
    // console.log("style.css read");
    return fs.readFile(path.join(__dirname, "tft.json"));
  })
  .then((contents) => {
    tftjsonFile = contents;
    // console.log("tft.json read");
    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error(`Could not read files: ${err}`);
    process.exit(1);
  });
