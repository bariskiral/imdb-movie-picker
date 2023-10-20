document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const loadingAnim = document.querySelector(".loadingAnimation");

    if (message.movie) {
      contentReceiver(message);
      chrome.storage.sync.set({ movie: message.movie });
    }

    if (message.isLoading) {
      document.querySelector(".selectDiv").setAttribute("hidden", "");
      loadingAnim.classList.remove("hidden");
    } else {
      loadedBtnVisuals();
      loadingAnim.classList.add("hidden");

      chrome.storage.sync.set({ buttonStates: message.isLoading });
    }
  });

  const loadedBtnVisuals = () => {
    document.getElementById("randomPickerBtn").removeAttribute("disabled");
    document.getElementById("contentLoadBtn").textContent = "All Loaded!";
    document.getElementById("contentLoadBtn").setAttribute("disabled", "");
    document.querySelector(".selectDiv").removeAttribute("hidden");
  };

  const contentReceiver = data => {
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
    movieNameElement.textContent = data.movie.randomMovieName;
    movieRatingElement.textContent = data.movie.randomMovieImdbRating;
    movieImageElement.src = data.movie.randomMovieImage;
    movieImageElement.removeAttribute("hidden");
    movieYearElement.textContent = data.movie.randomMovieYear;
    movieRuntimeElement.textContent = data.movie.randomMovieRuntime;
    movieGenresElement.textContent = data.movie.randomMovieGenres;
  };

  const value = document.querySelector(".sliderValue");
  const input = document.querySelector(".ratingSlider");

  value.textContent = input.value;
  input.addEventListener("input", event => {
    value.textContent = event.target.value;
  });

  chrome.storage.sync.get(["movie"], function (result) {
    if (result.movie) {
      contentReceiver(result);
    }
  });

  chrome.storage.sync.get(
    ["buttonStates", "speed", "ratingValue"],
    function (result) {
      if (result.buttonStates !== undefined) {
        loadedBtnVisuals();
      }
      if (result.ratingValue) {
        input.value = result.ratingValue;
        value.textContent = result.ratingValue;
      }
      if (result.speed) {
        document.getElementById("delaySelect").value = result.speed;
      }
    }
  );

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];

    document
      .getElementById("contentLoadBtn")
      .addEventListener("click", function () {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            const delay = document.getElementById("delaySelect").value;

            chrome.storage.sync.set({ speed: delay, ratingValue: input.value });

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

            chrome.storage.sync.set({ speed: delay, ratingValue: input.value });

            chrome.tabs.sendMessage(currentTab.id, {
              command: "pickContent",
              delay: delay,
              input: input.value
            });
          }
        );
      });
  });
});
