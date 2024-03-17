document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const loadingAnim = document.querySelector(".loadingAnimation");
    const clickText = document.querySelector(".clickText");
    const emptyContentText = document.querySelector(".emptyContent");

    // The content has been received and set to storage.

    if (message.content) {
      emptyContentText.setAttribute("hidden", "");
      contentReceiver(message);
      chrome.storage.sync.set({ content: message.content });
    }

    // There is no content.

    if (message.emptyContent) {
      document.querySelector(".contentContainer").setAttribute("hidden", "");
      emptyContentText.removeAttribute("hidden");
    }

    // The content is loading.

    if (message.isLoading) {
      document.querySelector(".selectDiv").classList.add("hidden");
      loadingAnim.classList.remove("hidden");
      document.getElementById("contentImage").querySelector("img").src =
        "../media/gifs/loading_img.gif";
      clickText.textContent = "Loading...";
      clickText.classList.remove("clickTextAnim1");
      clickText.classList.add("clickTextAnim2");
    }
    // The content is loaded and button states set to storage.
    else {
      loadedBtnVisuals();
      loadingAnim.classList.add("hidden");
      chrome.storage.sync.set({ buttonStates: message.isLoading });
    }
  });

  // Setting up UI elements.

  const loadedBtnVisuals = () => {
    document.getElementById("randomPickerBtn").removeAttribute("disabled");
    document.getElementById("contentLoadBtn").textContent = "All Loaded ✅";
    document.getElementById("contentLoadBtn").setAttribute("disabled", "");
    document.querySelector(".selectDiv").classList.remove("hidden");
    document.querySelector(".sliderRow").classList.remove("hidden");
    document.querySelector(".clickText").setAttribute("hidden", "");
  };

  // Sending the content to popup DOM.

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
    const contentLinkElement = document
      .getElementById("contentImage")
      .querySelector("a");
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

  // Initial values.

  const sliderValue = document.querySelector(".sliderValue");
  const sliderInput = document.querySelector(".ratingSlider");
  const selectDelay = document.getElementById("delaySelect");
  const typeSelect = document.getElementById("typeSelect");
  let qmClicked = false;

  if (sliderInput.value === "0") {
    sliderValue.textContent = "All";
  } else {
    sliderValue.textContent = "Lowest " + sliderInput.value;
  }

  sliderInput.addEventListener("input", event => {
    if (sliderInput.value === "0") {
      sliderValue.textContent = "All";
    } else {
      sliderValue.textContent = "Lowest " + event.target.value;
    }
  });

  // Listening rating slider changes.

  sliderInput.addEventListener("change", function () {
    chrome.storage.sync.set({ ratingValue: sliderInput.value });
  });

  // Listening delay selection changes.

  selectDelay.addEventListener("change", function () {
    chrome.storage.sync.set({
      speed: selectDelay.value
    });
  });

  // Listening delay selection changes.

  typeSelect.addEventListener("change", function () {
    chrome.storage.sync.set({
      type: typeSelect.value
    });
  });

  // Getting content from storage.

  chrome.storage.sync.get(["content"], function (result) {
    if (result.content) {
      contentReceiver(result);
    }
  });

  // Getting visuals and inputs from storage.

  chrome.storage.sync.get(
    ["buttonStates", "speed", "type", "ratingValue"],
    function (result) {
      if (result.buttonStates !== undefined) {
        loadedBtnVisuals();
      }
      if (result.ratingValue) {
        result.ratingValue === "0"
          ? (sliderValue.textContent = "All")
          : (sliderValue.textContent = "Lowest " + result.ratingValue);
        sliderInput.value = result.ratingValue;
      }
      if (result.speed) {
        selectDelay.value = result.speed;
      }
      if (result.type) {
        typeSelect.value = result.type;
      }
    }
  );

  // Button listeners.

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    const questionContainer = document.querySelector(".questionContainer");
    const contentContainer = document.querySelector(".contentContainer");

    document
      .getElementById("contentLoadBtn")
      .addEventListener("click", function () {
        questionContainer.setAttribute("hidden", "");
        qmClicked = !qmClicked;
        chrome.tabs.query({ active: true, currentWindow: true }, function () {
          chrome.tabs.sendMessage(currentTab.id, {
            command: "loadButtonClicker",
            delay: selectDelay.value,
            type: typeSelect.value
          });
        });
      });

    document
      .getElementById("randomPickerBtn")
      .addEventListener("click", function () {
        console.log(sliderInput.value, selectDelay.value, typeSelect.value);
        questionContainer.setAttribute("hidden", "");
        qmClicked = !qmClicked;
        chrome.tabs.query({ active: true, currentWindow: true }, function () {
          chrome.tabs.sendMessage(currentTab.id, {
            command: "pickContent",
            delay: selectDelay.value,
            input: sliderInput.value,
            type: typeSelect.value
          });
        });
      });

    document
      .querySelector(".questionMark")
      .addEventListener("click", function () {
        if (!qmClicked) {
          questionContainer.removeAttribute("hidden");
          contentContainer.setAttribute("hidden", "");
          qmClicked = !qmClicked;
        } else if (
          qmClicked &&
          "" !== document.getElementById("contentName").textContent
        ) {
          questionContainer.setAttribute("hidden", "");
          contentContainer.removeAttribute("hidden");
          qmClicked = !qmClicked;
        } else {
          questionContainer.setAttribute("hidden", "");
          qmClicked = !qmClicked;
        }
      });
  });
});
