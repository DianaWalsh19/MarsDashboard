require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const { Map } = require("immutable");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// API calls

app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.post("/rover", async (req, res) => {
  const roverName = await req.body.roverName;
  try {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${process.env.API_KEY}`;
    let roverPhotos = fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        roverPhotos = data;
        res.send({ roverPhotos });
      });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Server up - Listening on port ${port}!`));
