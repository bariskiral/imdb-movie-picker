document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const loadingAnim = document.querySelector(".loadingAnimation");

    if (message.movie) {
      const contentContainer = document.querySelector(".contentContainer");
      const movieNameElement = document.getElementById("contentName");
      const movieRatingElement = document.getElementById("contentRating");
      const movieYearElement = document.getElementById("contentYear");
      const movieRuntimeElement = document.getElementById("contentRuntime");
      const movieGenresElement = document.getElementById("contentGenres");
      const movieImageElement = document.getElementById("contentImage").querySelector("img");

      contentContainer.removeAttribute("hidden");
      movieNameElement.textContent = message.movie.randomMovieName;
      movieRatingElement.textContent = message.movie.randomMovieImdbRating;
      movieImageElement.src = message.movie.randomMovieImage;
      movieImageElement.removeAttribute("hidden");
      movieYearElement.textContent = message.movie.randomMovieYear;
      movieRuntimeElement.textContent = message.movie.randomMovieRuntime;
      movieGenresElement.textContent = message.movie.randomMovieGenres;
      loadingAnim.setAttribute("hidden", "");
    }

    if (message.isLoading) {
      loadingAnim.removeAttribute("hidden");
    }

    if (message.isLoaded) {
      document.getElementById("randomPickerBtn").removeAttribute("disabled");
      document.getElementById("contentLoadBtn").textContent = "Loaded All!";
      loadingAnim.setAttribute("hidden", "");
    }

    if (message.errorMessage) {
      const errorDiv = document.querySelector(".errorDiv");
      errorDiv.removeAttribute("hidden");
      errorDiv.textContent = message.errorMessage;
      document.getElementById("contentLoadBtn").setAttribute("disabled", "");
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    const regexPattern = /https:\/\/www\.imdb\.com.*watchlist/;

    if (regexPattern.test(currentTab.url)) {
      document.getElementById("contentLoadBtn").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const tabId = tabs[0].id;
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: loadButtonClicker
          });
        });
      });

      document.getElementById("randomPickerBtn").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const tabId = tabs[0].id;
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: collectMovies
          });
        });
      });
    } else {
      const tabId = currentTab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: errorHandler
      });
    }
  });
});

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

const errorHandler = () => {
  chrome.runtime.sendMessage({
    errorMessage: "You are not on your Watchlist"
  });
};
