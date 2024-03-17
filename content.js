let isClicked = false;

// Clicking the "LOAD MORE" button until there is no "LOAD MORE" button.
//NOTE:
// It is look like a little bit clanky atm. Esspecially delay. It could changed after adding a proper delay.

const loadButtonClicker = delay => {
  const loadButton = document.querySelector(".ipc-see-more__button");
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  if (loadButton) {
    loadButton.click();

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(loadButtonClicker(delay));
        scrollToContent();
      }, delay);
    });
  } else {
    chrome.runtime.sendMessage({
      isLoading: false
    });
    isClicked = false;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, delay / 2);
  }
};

// Filtering the content element with rating and type input and then picking a random element.

//FIXME:
// Find a way to filter different contents. There is no contentType in the DOM anymore.

const pickContent = (delay, type, input) => {
  const initialContent = document.querySelectorAll(
    ".ipc-metadata-list-summary-item"
  );

  const contentsArray = Array.from(initialContent).map((_content, index) => ({
    contentRating:
      +_content
        .querySelector(".ipc-rating-star--imdb")
        ?.textContent.split(/\s+/)[0] || "N/A",
    contentType: _content.classList.contains("featureFilm"),
    index
  }));

  console.log(contentsArray);

  const filteredContent = contentsArray.filter(content => {
    if (input === "0" && type === "1") {
      return content;
    } else if (content.contentRating && type === "1") {
      return content.contentRating >= +input;
    } else if (content.contentRating && type === "2") {
      return content.contentRating >= +input && content.contentType;
    } else if (content.contentRating && type === "3") {
      return content.contentRating >= +input && !content.contentType;
    } else if (input === "0" && type === "2") {
      return content.contentType;
    } else if (input === "0" && type === "3") {
      return !content.contentType;
    } else {
      return false;
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

// Collecting all the data from select random element.

const collectContent = async (contents, delay) => {
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  //???: Do I need the scroll? Seems like no.
  //contents.scrollIntoView();

  //FIXME:
  //All of these below have changed. Find a way to implement.

  const rndContentName =
    contents.querySelector(".ipc-title__text")?.textContent || "UNKNOWN";
  const rndContentLink =
    contents.querySelector(".ipc-title-link-wrapper")?.href || "#";
  const rndContentImage = await new Promise(resolve => {
    setTimeout(() => {
      resolve(
        contents
          .querySelector(".ipc-image")
          .src.includes("https://m.media-amazon.com")
          ? contents.querySelector(".ipc-image").src
          : "/media/logos/IMDb_Logo_128_Alt.png"
      );
    }, delay / 2);
  });
  const rndContentYear =
    contents.querySelector(".lister-item-year")?.textContent || "Year TBA";
  const rndContentRuntime = contents.querySelector(".runtime")
    ? contents.querySelector(".runtime").textContent
    : "Run Time TBA";
  const rndContentGenres =
    contents.querySelector(".genre")?.textContent || "Genres are not Available";
  const rndContentImdbRating =
    contents.querySelector(".ratings-imdb-rating")?.textContent ||
    "Not Released";

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
  }
};

// Scrolling to ".lister-page-anchor" named elements to stop lazy loading.
//BUG: There is no more anchor. Scrolling to items rn.

const scrollToContent = () => {
  const listItems = document.querySelectorAll(
    ".ipc-metadata-list-summary-item"
  );
  Array.from(listItems).map(item => {
    return item.scrollIntoView();
  });
};

// Listen messages for buttons.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const delay = message.delay;
  const type = message.type;
  const input = message.input;
  if (message.command === "loadButtonClicker" && !isClicked) {
    Promise.all([loadButtonClicker(delay), scrollToContent()]);
  } else if (message.command === "pickContent" && !isClicked) {
    pickContent(delay, type, input);
  }
});
