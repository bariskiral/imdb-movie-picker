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
      movieGenresElement.textContent = message.movie.randomMovieGenres;
    }

    if (message.isLoading) {
      document.querySelector(".selectDiv").setAttribute("hidden", "");
      loadingAnim.classList.remove("hidden");
    } else {
      document.getElementById("randomPickerBtn").removeAttribute("disabled");
      document.getElementById("contentLoadBtn").textContent = "All Loaded!";
      document.querySelector(".selectDiv").removeAttribute("hidden");
      loadingAnim.classList.add("hidden");
    }
  });

  const value = document.querySelector(".sliderValue");
  const input = document.querySelector(".ratingSlider");
  value.textContent = input.value;
  input.addEventListener("input", event => {
    value.textContent = event.target.value;
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];

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
              command: "pickContent",
              delay: delay,
              input: input.value
            });
          }
        );
      });
  });
});
