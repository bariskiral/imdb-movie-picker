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
    console.log("clicked");
    //window.scrollTo(0, document.body.scrollHeight);
    loadButtonClicker();
  }
  return;
};

const collectMovies = () => {
  const movies = document.querySelectorAll(".lister-item");
  // const movieTitles = Array.from(movies).map(movie => {
  //   return movie.querySelector(".lister-item-header a").textContent;
  // });

  console.log(movies[200]);
};
