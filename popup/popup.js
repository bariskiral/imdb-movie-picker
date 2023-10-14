document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("contentLoadBtn")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: loadButtonClicker
        });
      });
    });

  document
    .getElementById("randomPickerBtn")
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
    }, 250);
  }
};

const collectMovies = () => {
  const movies = document.querySelectorAll(".lister-item-header a");
  const randomNumber = Math.floor(Math.random() * movies.length);
  console.log(randomNumber);
  console.log(movies[randomNumber].textContent);
  movies[randomNumber].scrollIntoView();
};

const scrollToAnchor = () => {
  const listerPageAnchor = document.querySelectorAll(".lister-page-anchor");
  Array.from(listerPageAnchor).map(anchor => {
    return anchor.scrollIntoView();
  });
};
