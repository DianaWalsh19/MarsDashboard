let store = {
  apod: "",
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
  let { apod } = state;

  return `    
    <section>
        <h1>See Mars through the eyes of a NASA Rover</h1>
        <p>
            Space: the final frontier. These are the voyages of the NASA Rovers in Mars. 
            But before we get into it, let's check out NASA's image of the day:
        </p>
        <div id="apod-div">
          ${ImageOfTheDay(apod)}
        </div>
    </section>
  `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// listening for button clicks to the data from API
const buttons = document.querySelectorAll("#curiosity, #opportunity, #spirit");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // console.log("button pressed: " + button.id);
    getRoverPhotos(button.id);
  });
});

// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  //console.log(photodate.getDate(), today.getDate());
  //console.log(photodate.getDate() === today.getDate());
  try {
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
            <img src="${apod.image.url}" height="350px" />
            <p>${apod.image.explanation}</p>
        `;
    }
  } catch (err) {
    // console.log(err);
  }
};

// Function to clear parent element

function empty(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
}

// Create Grid to display photos

function displayRoverManifesto(data) {
  let containerDiv = document.getElementById("container");
  empty(containerDiv);
  let roverManifestoDiv = document.createElement("div");
  roverManifestoDiv.classList.add("roverManifesto");
  containerDiv.appendChild(roverManifestoDiv);

  console.log("Yep, it was called! " + data.rover.name);
  let avatarSource = "";
  if (data.rover.name === "Curiosity") {
    avatarSource =
      "https://images-assets.nasa.gov/image/PIA20602/PIA20602~medium.jpg";
  } else if (data.rover.name === "Spirit") {
    avatarSource =
      "https://images-assets.nasa.gov/image/PIA05040/PIA05040~small.jpg";
  } else if (data.rover.name === "Opportunity") {
    avatarSource =
      "https://images-assets.nasa.gov/image/PIA05309/PIA05309~orig.jpg";
  }

  let roverDetails = `<div class='rover-card'>
        <img src=${avatarSource}>
        <div class="card-container">
          <h3>About this rover</h3>
          <h4><b>Name: ${data.rover.name}</b></h4>
          <p>Launch Date: ${data.rover.launch_date}</p>
          <p>Landing Date: ${data.rover.landing_date}</p>
          <p>Status: ${data.rover.status}</p>
        </div>
      </div>`;

  roverManifestoDiv.insertAdjacentHTML("beforeend", roverDetails);
}

function displayRoverPhotos(data) {
  let containerDiv = document.getElementById("container");
  let roverPhotosDiv = document.createElement("div");
  roverPhotosDiv.classList.add("photo-grid");
  containerDiv.appendChild(roverPhotosDiv);

  data.map((rover) => {
    const html = `      
    <div class="grid-item">
      <h3>Photo ID: ${rover.id}</h3>
      <img src="${rover.img_src}">
      <p>Photo Date: ${rover.earth_date}</p>
    </div>`;
    roverPhotosDiv.insertAdjacentHTML("beforeend", html);
  });
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  try {
    fetch(`http://localhost:3000/apod`)
      .then((res) => res.json())
      .then((apod) => updateStore(store, { apod }));

    return data;
  } catch (err) {
    //console.log(err);
  }
};

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
  console.log(data.roverPhotos.latest_photos);
  displayRoverManifesto(data.roverPhotos.latest_photos[0]);
  displayRoverPhotos(data.roverPhotos.latest_photos);
}
