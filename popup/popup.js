document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: loadButtonClicker
    });
  });

  document
    .getElementById("pickerButton")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: collectMovies
        });
      });
    });
});

const loadButtonClicker = () => {
  const loadButton = document.querySelector(".load-more");

  if (loadButton) {
    loadButton.click();

    setTimeout(() => {
      loadButtonClicker();
      scrollToAnchor();
    }, 1000);
  }
};

const collectMovies = () => {
  const movies = document.querySelectorAll(".lister-item-header a");
  movies.forEach((movie, index) => {
    return console.log(index + ":" + movie.textContent);
  });
};

const scrollToAnchor = () => {
  const listerPageAnchor = document.querySelectorAll(".lister-page-anchor");
  Array.from(listerPageAnchor).map(anchor => {
    return anchor.scrollIntoView();
  });
};
