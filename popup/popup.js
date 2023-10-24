document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const loadingAnim = document.querySelector(".loadingAnimation");

    if (message.content) {
      contentReceiver(message);
      chrome.storage.sync.set({ content: message.content });
    }

    if (message.isLoading) {
      document.querySelector(".selectDiv").classList.add("hidden");
      loadingAnim.classList.remove("hidden");
      document.getElementById("contentImage").querySelector("img").src = "../media/gifs/loading_img.gif";
    } else {
      loadedBtnVisuals();
      loadingAnim.classList.add("hidden");
      chrome.storage.sync.set({ buttonStates: message.isLoading });
    }
  });

  const loadedBtnVisuals = () => {
    document.getElementById("randomPickerBtn").removeAttribute("disabled");
    document.getElementById("contentLoadBtn").textContent = "All Loaded ✅";
    document.getElementById("contentLoadBtn").setAttribute("disabled", "");
    document.querySelector(".selectDiv").classList.remove("hidden");
    document.querySelector(".sliderRow").classList.remove("hidden");
    document.querySelector(".clickText").setAttribute("hidden", "");
  };

  const contentReceiver = data => {
    const contentContainer = document.querySelector(".contentContainer");
    const contentNameElement = document.getElementById("contentName");
    const contentRatingElement = document.getElementById("contentRating");
    const contentYearElement = document.getElementById("contentYear");
    const contentRuntimeElement = document.getElementById("contentRuntime");
    const contentGenresElement = document.getElementById("contentGenres");
    const contentImageElement = document.getElementById("contentImage").querySelector("img");
    const contentLinkElement = document.getElementById("contentImage").querySelector("a");
    contentContainer.removeAttribute("hidden");
    contentNameElement.textContent = data.content.rndContentName;
    contentRatingElement.textContent = data.content.rndContentImdbRating;
    contentImageElement.src = data.content.rndContentImage;
    contentLinkElement.href = data.content.rndContentLink;
    contentImageElement.removeAttribute("hidden");
    contentYearElement.textContent = data.content.rndContentYear;
    contentRuntimeElement.textContent = data.content.rndContentRuntime;
    contentGenresElement.textContent = data.content.rndContentGenres;
  };

  const value = document.querySelector(".sliderValue");
  const input = document.querySelector(".ratingSlider");
  const delay = document.getElementById("delaySelect");
  let qmClicked = false;

  value.textContent = input.value;
  input.addEventListener("input", event => {
    value.textContent = event.target.value;
  });

  input.addEventListener("change", function () {
    chrome.storage.sync.set({ ratingValue: input.value });
  });

  delay.addEventListener("change", function () {
    chrome.storage.sync.set({
      speed: delay.value
    });
  });

  chrome.storage.sync.get(["content"], function (result) {
    if (result.content) {
      contentReceiver(result);
    }
  });

  chrome.storage.sync.get(["buttonStates", "speed", "ratingValue"], function (result) {
    if (result.buttonStates !== undefined) {
      loadedBtnVisuals();
    }
    if (result.ratingValue) {
      input.value = result.ratingValue;
      value.textContent = result.ratingValue;
    }
    if (result.speed) {
      delay.value = result.speed;
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];

    document.getElementById("contentLoadBtn").addEventListener("click", function () {
      document.querySelector(".questionContainer").setAttribute("hidden", "");
      qmClicked = !qmClicked;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        delay.value;

        chrome.tabs.sendMessage(currentTab.id, {
          command: "loadButtonClicker",
          delay: delay.value
        });
      });
    });

    document.getElementById("randomPickerBtn").addEventListener("click", function () {
      document.querySelector(".questionContainer").setAttribute("hidden", "");
      qmClicked = !qmClicked;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        delay.value;

        chrome.tabs.sendMessage(currentTab.id, {
          command: "pickContent",
          delay: delay.value,
          input: input.value
        });
      });
    });

    document.querySelector(".questionMark").addEventListener("click", function () {
      if (!qmClicked) {
        document.querySelector(".questionContainer").removeAttribute("hidden");
        document.querySelector(".contentContainer").setAttribute("hidden", "");
        qmClicked = !qmClicked;
      } else if (qmClicked && "" !== document.getElementById("contentName").textContent) {
        document.querySelector(".questionContainer").setAttribute("hidden", "");
        document.querySelector(".contentContainer").removeAttribute("hidden");
        qmClicked = !qmClicked;
      } else {
        document.querySelector(".questionContainer").setAttribute("hidden", "");
        qmClicked = !qmClicked;
      }
    });
  });
});
