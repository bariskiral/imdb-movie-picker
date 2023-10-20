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

//FIXME: Because of no timing, sometimes fucntion doesn't work. Only way that I can think of filtering all the content with input value.

const pickContent = (delay, input) => {
  const content = document.querySelectorAll(".lister-item");
  let rnd = Math.floor(Math.random() * content.length);

  if (
    +input <= +content[rnd].querySelector(".ratings-imdb-rating").textContent
  ) {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "PASS" +
        " Input is: " +
        input +
        " Content is: " +
        +content[rnd].querySelector(".ratings-imdb-rating").textContent
    );
    collectContent(content, rnd, delay);
  } else {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "FAIL" +
        " Input is: " +
        input +
        " Content is: " +
        +content[rnd].querySelector(".ratings-imdb-rating").textContent
    );
    pickContent(delay, input);
  }
};

const collectContent = async (contents, rnd, delay) => {
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  contents[rnd].scrollIntoView();

  const rndContentName =
    contents[rnd].querySelector(".lister-item-header a")?.textContent ||
    "UNKNOWN";

  const rndContentImage = await new Promise(resolve => {
    setTimeout(() => {
      resolve(
        contents[rnd]
          .querySelector(".lister-item-image a img")
          .src.includes("https://m.media-amazon.com")
          ? contents[rnd].querySelector(".lister-item-image a img").src
          : "/images/tv.png"
      );
    }, delay / 2);
  });

  const rndContentYear =
    contents[rnd].querySelector(".lister-item-year")?.textContent || "Year TBA";

  const rndContentRuntime = contents[rnd].querySelector(".runtime")
    ? contents[rnd].querySelector(".runtime").textContent
    : contents[rnd].classList.contains("featureFilm")
    ? "Run Time TBA"
    : contents[rnd]
        .querySelector(".lister-item-details")
        .children[2].textContent.replace(/(\d+)eps/g, "$1 Episodes TV Series");

  const rndContentGenres =
    contents[rnd].querySelector(".genre")?.textContent ||
    "Genres are not Available";

  const rndContentImdbRating =
    contents[rnd].querySelector(".ratings-imdb-rating")?.textContent ||
    "Not Released";

  if (isClicked) {
    chrome.runtime.sendMessage({
      content: {
        rndContentName,
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
