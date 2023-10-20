document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const loadingAnim = document.querySelector(".loadingAnimation");

    if (message.content) {
      contentReceiver(message);
      chrome.storage.sync.set({ content: message.content });
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
    const contentNameElement = document.getElementById("contentName");
    const contentRatingElement = document.getElementById("contentRating");
    const contentYearElement = document.getElementById("contentYear");
    const contentRuntimeElement = document.getElementById("contentRuntime");
    const contentGenresElement = document.getElementById("contentGenres");
    const contentImageElement = document
      .getElementById("contentImage")
      .querySelector("img");
    contentContainer.removeAttribute("hidden");
    contentNameElement.textContent = data.content.rndContentName;
    contentRatingElement.textContent = data.content.rndContentImdbRating;
    contentImageElement.src = data.content.rndContentImage;
    contentImageElement.removeAttribute("hidden");
    contentYearElement.textContent = data.content.rndContentYear;
    contentRuntimeElement.textContent = data.content.rndContentRuntime;
    contentGenresElement.textContent = data.content.rndContentGenres;
  };

  const value = document.querySelector(".sliderValue");
  const input = document.querySelector(".ratingSlider");

  value.textContent = input.value;
  input.addEventListener("input", event => {
    value.textContent = event.target.value;
  });

  chrome.storage.sync.get(["content"], function (result) {
    if (result.content) {
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
