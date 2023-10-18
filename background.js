chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const regexPattern = /https:\/\/www\.imdb\.com.*watchlist/;
  if (regexPattern.test(tab.url)) {
    //chrome.action.enable(tabId);
    chrome.action.setPopup({
      popup: "/popup/popup.html",
      tabId: tabId
    });
    chrome.action.setIcon({
      path: "/images/cat_16x16.png",
      tabId: tabId
    });
  } else {
    //chrome.action.disable(tabId);
    chrome.action.setPopup({
      popup: "inactivePopup.html",
      tabId: tabId
    });
    chrome.action.setIcon({
      path: "/images/tv.png",
      tabId: tabId
    });
  }
});
