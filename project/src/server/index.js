require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const moment = require("moment");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call
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
  let date = "";
  if (roverName === "spirit") {
    date = "2005-5-30";
  } else {
    date = "2017-5-19";
  }
  //console.log(date);
  //console.log("This is the rover name: " + JSON.stringify(roverName));
  try {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?earth_date=${date}&api_key=${process.env.API_KEY}&max_results=5`;
    // const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?earth_date=2005-5-30&api_key=${process.env.API_KEY}`;
    let roverPhotos = fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        roverPhotos = data;
        //console.log(roverPhotos.photos[0]);
        res.send({ roverPhotos });
      });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
