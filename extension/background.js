chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCookies") {
    const url = message.url;

    chrome.cookies.getAll({ url: url }, (cookies) => {
      if (!cookies.length) {
        sendResponse({ success: false, cookies: [] });
      } else {
        const cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ");
        sendResponse({ success: true, cookies: cookieString });
      }
    });
    return true;
  }
});