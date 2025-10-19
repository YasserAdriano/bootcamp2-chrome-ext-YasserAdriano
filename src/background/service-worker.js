chrome.runtime.onInstalled.addListener(() => {
  console.log("Page Highlighter instalado.");
  chrome.storage.local.set({ installedAt: new Date().toISOString() });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PING") {
    sendResponse({ ok: true, time: new Date().toLocaleTimeString() });
  }
});
