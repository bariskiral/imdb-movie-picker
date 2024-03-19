let isClicked = false;

// Clicking the "See More" button if there is one.

const loadButtonClicker = delay => {
  return new Promise((resolve, reject) => {
    const clickLoadButton = () => {
      const loadButton = document.querySelector(".ipc-see-more__button");

      if (loadButton) {
        isClicked = true;
        chrome.runtime.sendMessage({ isLoading: true });
        loadButton.click();
        setTimeout(() => {
          clickLoadButton();
        }, delay);
      } else {
        resolve();
      }
    };
    changeListView();
    clickLoadButton();
  }).catch(error => {
    console.error("Error occurred while loading: ", error);
  });
};

// Picking title from the list.

const pickContent = (delay, input) => {
  changeListView();
  const initialContent = document.querySelectorAll(
    ".ipc-metadata-list-summary-item"
  );
  const contentsArray = Array.from(initialContent).map((_content, index) => ({
    contentRating:
      +_content
        .querySelector(".ipc-rating-star--imdb")
        ?.textContent.split(/\s+/)[0] || "N/A",
    index
  }));

  const filteredContent = contentsArray.filter(content => {
    if (input === "0") {
      return content;
    } else {
      return content.contentRating >= +input;
    }
  });

  if (filteredContent.length > 0) {
    const rnd = Math.floor(Math.random() * filteredContent.length);
    collectContent(initialContent[filteredContent[rnd].index], delay);
  } else {
    chrome.runtime.sendMessage({
      emptyContent: true
    });
  }
};

// Getting the data of the selected title.

const collectContent = async (contents, delay) => {
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  const rndContentName = (
    contents.querySelector(".ipc-title__text")?.textContent || "UNKNOWN TITLE"
  ).replace(/^\s*\d+\.\s*/, "");
  const rndContentLink =
    contents.querySelector(".ipc-title-link-wrapper")?.href || "#";
  const rndContentImage = await new Promise(resolve => {
    setTimeout(() => {
      resolve(
        contents.querySelector(".ipc-image")
          ? contents.querySelector(".ipc-image").src
          : "/media/logos/IMDb_Logo_128_Alt.png"
      );
    }, delay / 2);
  }).catch(error => {
    console.error("Error occurred during image retrieval: ", error);
    return "/media/logos/IMDb_Logo_128_Alt.png";
  });
  const rndContentYear =
    contents.querySelector(".dli-title-metadata span")?.textContent ||
    "Year TBA";
  const rndContentRuntime = contents.querySelector(
    ".dli-title-metadata span:nth-child(2)"
  )
    ? contents.querySelector(".dli-title-metadata span:nth-child(2)")
        .textContent
    : "Run Time TBA";
  const rndContentImdbRating =
    contents.querySelector(".ipc-rating-star")?.textContent || "Not Released";

  if (isClicked) {
    chrome.runtime.sendMessage({
      content: {
        rndContentName,
        rndContentLink,
        rndContentImage,
        rndContentYear,
        rndContentRuntime,
        rndContentImdbRating
      },
      isLoading: false
    });
    isClicked = false;
  }
};

// Scroll to the bottom of the page to trigger lazy loading.

const scrollToBottom = delay => {
  window.scrollTo(0, document.body.scrollHeight);
  const scrollInterval = setInterval(function () {
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
      clearInterval(scrollInterval);
      chrome.runtime.sendMessage({ isLoading: false });
      isClicked = false;
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, delay);
};

// Change the list view if the user uses a different view. This is necessary to get the data properly.

const changeListView = () => {
  const viewButton = document.querySelector("#list-view-option-detailed");
  const listView = document.querySelector(".detailed-list-view");

  if (!listView) {
    viewButton.click();
  }
};

// Getting messages from popup.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const delay = message.delay;
  const input = message.input;
  if (message.command === "loadButtonClicker" && !isClicked) {
    loadButtonClicker(delay)
      .then(() => {
        scrollToBottom(delay);
      })
      .catch(error => {
        console.error("Error occurred while loading: ", error);
      });
  } else if (message.command === "pickContent" && !isClicked) {
    pickContent(delay, input);
  }
});
