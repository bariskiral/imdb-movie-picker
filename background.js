const regexPattern = /https:\/\/www\.imdb\.com.*watchlist/;
const regexChromeExtensionsTab = /chrome:\/\/extensions/;
let currentListID = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (regexPattern.test(tab.url)) {
    chrome.action.setPopup({
      popup: "/popup/popup.html",
      tabId: tabId
    });
    chrome.action.setIcon({
      path: "/images/cat_16x16.png",
      tabId: tabId
    });
    if (changeInfo.status === "complete" && tabId !== currentListID) {
      console.log("changed");
      chrome.storage.sync.remove("content");
      chrome.storage.sync.remove("buttonStates");
      chrome.storage.sync.remove("ratingValue");
      chrome.storage.sync.remove("speed");
      currentListID = tabId;
    }
  } else if (regexChromeExtensionsTab.test(tab.url)) {
    chrome.action.disable(tabId);
  } else {
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

chrome.tabs.onActivated.addListener(activeInfo => {
  const tabId = activeInfo.tabId;
  const tab = chrome.tabs.get(tabId, currentTab => {
    if (regexPattern.test(currentTab.url)) {
      if (currentListID !== tabId) {
        chrome.storage.sync.remove("content");
        chrome.storage.sync.remove("buttonStates");
        chrome.storage.sync.remove("ratingValue");
        chrome.storage.sync.remove("speed");
        currentListID = tabId;
      }
    }
  });
});
