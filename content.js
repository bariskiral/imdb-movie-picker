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
        isLoading: false
      });
      isClicked = false;
    }
  }
};

const pickContent = (delay, input) => {
  const initialContent = document.querySelectorAll(".lister-item");
  const contentsArray = Array.from(initialContent).map((content, index) => ({
    contentRating: content.querySelector(".ratings-imdb-rating"),
    index
  }));

  const filteredContent = contentsArray.filter(_content => {
    if (input === "0") {
      return _content;
    } else if (_content.contentRating) {
      return +_content.contentRating.textContent >= +input;
    } else {
      return false;
    }
  });
  const rnd = Math.floor(Math.random() * filteredContent.length);
  collectContent(initialContent[filteredContent[rnd].index], delay);
};

const collectContent = async (contents, delay) => {
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  contents.scrollIntoView();

  const rndContentName = contents.querySelector(".lister-item-header a")?.textContent || "UNKNOWN";
  const rndContentLink = contents.querySelector(".lister-item-header a")?.href || "#";
  const rndContentImage = await new Promise(resolve => {
    setTimeout(() => {
      resolve(
        contents.querySelector(".lister-item-image a img").src.includes("https://m.media-amazon.com")
          ? contents.querySelector(".lister-item-image a img").src
          : "/images/tv.png"
      );
    }, delay / 2);
  });
  const rndContentYear = contents.querySelector(".lister-item-year")?.textContent || "Year TBA";
  const rndContentRuntime = contents.querySelector(".runtime")
    ? contents.querySelector(".runtime").textContent
    : contents.classList.contains("featureFilm")
    ? "Run Time TBA"
    : contents
        .querySelector(".lister-item-details")
        .children[2].textContent.replace(/(\d+)eps/g, "$1 Episodes TV Series");
  const rndContentGenres = contents.querySelector(".genre")?.textContent || "Genres are not Available";
  const rndContentImdbRating = contents.querySelector(".ratings-imdb-rating")?.textContent || "Not Released";

  if (isClicked) {
    chrome.runtime.sendMessage({
      content: {
        rndContentName,
        rndContentLink,
        rndContentImage,
        rndContentYear,
        rndContentRuntime,
        rndContentGenres,
        rndContentImdbRating
      },
      isLoading: false
    });
    isClicked = false;

    chrome.storage.sync.set({
      content: {
        rndContentName,
        rndContentLink,
        rndContentImage,
        rndContentYear,
        rndContentRuntime,
        rndContentGenres,
        rndContentImdbRating
      }
    });
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
  const input = message.input;
  if (message.command === "loadButtonClicker" && !isClicked) {
    Promise.all([loadButtonClicker(delay), scrollToAnchor()]);
  } else if (message.command === "pickContent" && !isClicked) {
    pickContent(delay, input);
  }
});
