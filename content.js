const delay = 2000;

const loadButtonClicker = () => {
  const loadButton = document.querySelector(".load-more");

  chrome.runtime.sendMessage({
    isLoading: true
  });

  if (loadButton) {
    loadButton.click();
    setTimeout(() => {
      loadButtonClicker();
      scrollToAnchor();
    }, delay / 2);
  } else {
    chrome.runtime.sendMessage({
      isLoaded: true
    });
  }
};

const collectMovies = async () => {
  const movies = document.querySelectorAll(".lister-item");
  const rnd = Math.floor(Math.random() * movies.length);

  chrome.runtime.sendMessage({
    isLoading: true
  });

  movies[rnd].scrollIntoView();

  const randomMovieName = movies[rnd].querySelector(".lister-item-header a").textContent;
  let randomMovieImage = await new Promise(resolve => {
    setTimeout(() => {
      resolve(movies[rnd].querySelector(".lister-item-image a img").src);
    }, delay);
  });

  const randomMovieYear = movies[rnd].querySelector(".lister-item-year").textContent;
  const randomMovieRuntime = movies[rnd].querySelector(".runtime").textContent;
  const randomMovieGenres = movies[rnd].querySelector(".genre").textContent;
  const randomMovieImdbRating = movies[rnd].querySelector(".ratings-imdb-rating").textContent;

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
};

const scrollToAnchor = () => {
  const listerPageAnchor = document.querySelectorAll(".lister-page-anchor");
  Array.from(listerPageAnchor).map(anchor => {
    return anchor.scrollIntoView();
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "loadButtonClicker") {
    loadButtonClicker();
  } else if (message.command === "collectMovies") {
    collectMovies();
  }
});
