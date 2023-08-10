// Your server-side code (Node.js and Express.js)
const express = require("express");
const app = express();
const fs = require("fs").promises;
const util = require("./util");
const path = require("path");
const http = require("http");
const port = process.env.PORT;
const host = "localhost";

// listening to stuff

app.use(express.static("public"));

app.get("/api/tft.json", async (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store"); // Add this line to prevent caching
  const JSON = await util.getJSON();
  res.end(JSON);
});

app.post("/api/updateSnapshot", (req, res) => {
  util.updateSnapshot();
  res.status(200);
  return new Response("snapshot points updated!");
});

app.post("/api/resetSnapshot", (req, res) => {
  util.resetSnapshot();
  res.status(200);
  return new Response("snapshot points reset!");
});

app.post("/api/updateStats", (req, res) => {
  util.updateStats();
  res.status(200);
  return new Response("stats updated!");
});

app.listen(port, () => {
  console.log("Server is running on port 8080");
});

let indexFile;
let scriptFile;
let cssFile;
let participantFile;
let tftjsonFile;
let utilFile;
let configFile;

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

// Serve util.js file
app.get("/util.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.end(utilFile);
});

// Serve config.json file
app.get("/config.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(configFile);
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
    return fs.readFile(path.join(__dirname, "./tft.json"));
  })
  .then((contents) => {
    tftjsonFile = contents;
    // console.log("tft.json read");
    return fs.readFile(path.join(__dirname, "../config.json"));
  })
  .then((contents) => {
    configFile = contents;
    console.log("config.json read");
    return fs.readFile(path.join(__dirname, "./util.js"));
  })
  .then((contents) => {
    utilFile = contents;
    console.log("util.js read");
    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error(`Could not read files: ${err}`);
    process.exit(1);
  });
