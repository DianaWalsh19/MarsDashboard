let store = {
  user: { name: "Student" },
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, apod } = state;

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
            <input id="searchTerm" type="text" placeholder="Enter search term" />
            <button id="btn">Search</button>
            <div id="roverPhotos"></div>
            <div id="grid"></div>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  return data;
};

// const button = document.getElementById("btn");
// button.addEventListener("click", () => {
//   console.log("button pressed");
//   getRoverPhotos();
// });

//An asynchronous function to fetch data from the API.
async function getRoverPhotos(roverName) {
  const response = await fetch(`http://localhost:3000/rover`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roverName }),
  });
  const data = await response.json();
  console.log(data.roverPhotos.photos[0]);
  displayRoverPhotos(data.roverPhotos.photos);
}
getRoverPhotos((roverName = "Curiosity"));

// Create Grid to display photos

function displayRoverPhotos(data) {
  const grid = document.getElementById("grid");
  grid.className = "grid-container";
  // const tableSize = { x: 3, y: 3 };
  // let total = tableSize.x * tableSize.y;

  for (let i = 0; i < data.length; i++) {
    const html = `      
      <div>
        <h3>${data[i].rover.name}</h3>
        <img src="${data[i].img_src}">
      </div>`;
    const gridCell = cellMaker(grid, html);
  }
  grid.style.setProperty(`grid-template-columns`, `repeat(${data.length},2fr)`);
}

function cellMaker(parent, html) {
  const cell = document.createElement("div");
  cell.className = "grid-item";
  cell.innerHTML = html;
  return parent.appendChild(cell);
}

// TODO: An option to get fedeback from user
// on what Rover they want to see.

// TODO: A function to send the selected rover to
// the back end

// TODO: A way to make the API requirement dynamic, so it
// displays the different rovers
