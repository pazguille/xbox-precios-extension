chrome.storage.local.get(['xbox-converter'], (flags) => {
  chrome.storage.local.set({ 'xbox-converter': !flags['xbox-converter'] }, () => {
    chrome.runtime.sendMessage({ message: 'udpateIcon', data: !flags['xbox-converter'] ? 'on' : '' });
    window.location.reload();
  });
});
