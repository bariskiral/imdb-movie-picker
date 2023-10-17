document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const loadingAnim = document.querySelector(".loadingAnimation");

    if (message.movie) {
      const contentContainer = document.querySelector(".contentContainer");
      const movieNameElement = document.getElementById("contentName");
      const movieRatingElement = document.getElementById("contentRating");
      const movieYearElement = document.getElementById("contentYear");
      const movieRuntimeElement = document.getElementById("contentRuntime");
      const movieGenresElement = document.getElementById("contentGenres");
      const movieImageElement = document
        .getElementById("contentImage")
        .querySelector("img");
      contentContainer.removeAttribute("hidden");
      movieNameElement.textContent = message.movie.randomMovieName;
      movieRatingElement.textContent = message.movie.randomMovieImdbRating;
      movieImageElement.src = message.movie.randomMovieImage;
      movieImageElement.removeAttribute("hidden");
      movieYearElement.textContent = message.movie.randomMovieYear;

      movieRuntimeElement.textContent = message.movie.randomMovieRuntime;
      // ? message.movie.randomMovieRuntime.textContent.replace(
      //     /(\d+)eps/g,
      //     "$1 Episodes TV Series"
      //   )
      // : message.movie.randomMovieRuntime;

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
      document
        .getElementById("contentLoadBtn")
        .addEventListener("click", function () {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const delay = document.getElementById("delaySelect").value;
              chrome.tabs.sendMessage(currentTab.id, {
                command: "loadButtonClicker",
                delay: delay
              });
            }
          );
        });

      document
        .getElementById("randomPickerBtn")
        .addEventListener("click", function () {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const delay = document.getElementById("delaySelect").value;
              chrome.tabs.sendMessage(currentTab.id, {
                command: "collectMovies",
                delay: delay
              });
            }
          );
        });
    } else {
      chrome.runtime.sendMessage({
        tabId: currentTab.id,
        command: "errorHandler"
      });
    }
  });
});
