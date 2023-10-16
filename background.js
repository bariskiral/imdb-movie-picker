const errorHandler = () => {
  chrome.runtime.sendMessage({
    errorMessage: "You are not on your Watchlist"
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "errorHandler") {
    errorHandler();
  }
});
