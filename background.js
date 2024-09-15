// Check if a URL is a valid YouTube watch page
function isYouTubeWatchPage(url) {
  return url.hostname.includes("youtube.com") && url.pathname === "/watch";
}

// Get the channel ID from the URL
function getChannelID(url) {
  const params = new URLSearchParams(url.search);
  return params.get("v");
}

// Fetch the allowlist from storage
function getAllowlist(callback) {
  chrome.storage.sync.get(["allowlist"], function (result) {
      callback(result.allowlist || []);
  });
}

// Block the video if it's not from an allowed channel
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
      const url = new URL(details.url);

      if (isYouTubeWatchPage(url)) {
          getAllowlist(function (allowlist) {
              const channelID = getChannelID(url);

              if (!allowlist.includes(channelID)) {
                  // Redirect to a warning or block page (or just stop the request)
                  return { cancel: true };
              }
          });
      }
  },
  { urls: ["*://*.youtube.com/*"] },
  ["blocking"]
);
