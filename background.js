/**
 * Add toolbar icon click listener
 */
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['src/toggle-script.js']
  });
});

/**
 * Update icon badge
 */
chrome.runtime.onMessage.addListener((request) => {
  if (request.message == 'udpateIcon') {
    chrome.action.setBadgeText({ text: request.data });
  }
});
