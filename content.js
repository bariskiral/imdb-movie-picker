let isClicked = false;

const loadButtonClicker = delay => {
  console.log("started");
  return new Promise(resolve => {
    const clickLoadButton = () => {
      const loadButton = document.querySelector(".ipc-see-more__button");

      if (loadButton) {
        isClicked = true;
        chrome.runtime.sendMessage({ isLoading: true });
        loadButton.click();
        setTimeout(() => {
          console.log("clicked");
          //scrollToContent();
          clickLoadButton();
        }, delay);
      } else {
        //scrollToContent();
        chrome.runtime.sendMessage({ isLoading: false });
        isClicked = false;
        console.log("no more button");
        resolve();
      }
    };

    clickLoadButton();
  });
};

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

  console.log(contentsArray);

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

const collectContent = async (contents, delay) => {
  isClicked = true;

  chrome.runtime.sendMessage({
    isLoading: true
  });

  //???: Do I need the scroll? Seems like no. Test it on long lists.
  //contents.scrollIntoView();

  const rndContentName = (
    contents.querySelector(".ipc-title__text")?.textContent || "UNKNOWN"
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

const scrollToContent = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

const changeListView = () => {
  const viewButton = document.querySelector("#list-view-option-detailed");
  const listView = document.querySelector(".detailed-list-view");

  if (!listView) {
    viewButton.click();
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const delay = message.delay;
  const input = message.input;
  if (message.command === "loadButtonClicker" && !isClicked) {
    loadButtonClicker(delay).then(() => {
      window.scrollTo(0, 0);
      console.log("finished");
    });
  } else if (message.command === "pickContent" && !isClicked) {
    pickContent(delay, input);
  }
});
