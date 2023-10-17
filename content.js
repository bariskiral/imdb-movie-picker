let isClicked = false;

const loadButtonClicker = delay => {
  const loadButton = document.querySelector(".load-more");
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  if (loadButton) {
    loadButton.click();

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(loadButtonClicker(delay));
        scrollToAnchor();
      }, delay);
    });
  } else {
    if (isClicked) {
      chrome.runtime.sendMessage({
        isLoaded: true
      });
      isClicked = false;
    }
  }
};

const collectMovies = async delay => {
  const movies = document.querySelectorAll(".lister-item");
  const rnd = Math.floor(Math.random() * movies.length);
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  movies[rnd].scrollIntoView();

  const randomMovieName =
    movies[rnd].querySelector(".lister-item-header a")?.textContent ||
    "UNKNOWN";

  const randomMovieImage = await new Promise(resolve => {
    setTimeout(() => {
      resolve(movies[rnd].querySelector(".lister-item-image a img").src);
    }, delay / 2);
  });

  const randomMovieYear =
    movies[rnd].querySelector(".lister-item-year")?.textContent || "Year TBA";

  const randomMovieRuntime = movies[rnd].querySelector(".runtime")
    ? movies[rnd].querySelector(".runtime").textContent
    : movies[rnd].classList.contains("featureFilm")
    ? "Run Time TBA"
    : movies[rnd].querySelector(".lister-item-details").children[2].textContent;

  const randomMovieGenres =
    movies[rnd].querySelector(".genre")?.textContent ||
    "Genres are not Available";

  const randomMovieImdbRating =
    movies[rnd].querySelector(".ratings-imdb-rating")?.textContent ||
    "Not Released";

  if (isClicked) {
    chrome.runtime.sendMessage({
      movie: {
        randomMovieName,
        randomMovieImage,
        randomMovieYear,
        randomMovieRuntime,
        randomMovieGenres,
        randomMovieImdbRating
      }
    });
    isClicked = false;
  }
};

const scrollToAnchor = () => {
  const listerPageAnchor = document.querySelectorAll(".lister-page-anchor");
  Array.from(listerPageAnchor).map(anchor => {
    return anchor.scrollIntoView();
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const delay = message.delay;
  if (message.command === "loadButtonClicker" && !isClicked) {
    Promise.all([loadButtonClicker(delay), scrollToAnchor()]);
  } else if (message.command === "collectMovies" && !isClicked) {
    collectMovies(delay);
  }
});
