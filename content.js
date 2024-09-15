// I've seen videos (e.g. https://www.youtube.com/watch?v=_lh5DpKq3Ts) where the `itemprop=author`
//  DOM elements never appear.
//
// We could look for the channel name under the video, but conceivably the DOM elements would
// be different on some videos, or they would change over time.
//
// I want to fail closed, i.e. if we can't find the channel name then we don't allow watching it.
// This is important because the plugin will fall out of date with the YouTube DOM over time.
//
// I think this rules out things like "put up an alert and navigate away" because at what point
// are we confident that the page has fully loaded? Especially with the complication of SPA
// behavior, e.g. navigating from the homepage to /watch without a page load.
//
// So how about making the interference be "call pause() repeatedly on the video element"?
function getChannelName() {
  const dom1 = document.querySelector("span[itemprop=author] > link[itemprop=name]");
  if (dom1) {
    return dom1.getAttribute("content");
  }

  const dom2 = document.querySelector("div#upload-info .ytd-channel-name a");
  if (dom2) {
    return dom2.textContent;
  }

  return null;
}

async function isAllowed() {
  const channelName = getChannelName();
  if (!channelName) {
    console.log("No channel name found");
    return false;
  }
  const allowlist = (await chrome.storage.sync.get(["allowlist"])).allowlist || {};
  return channelName.toLowerCase() in allowlist;
}

setInterval(
  async () => {
    const videoPlayer = document.querySelector("video");
    if (!videoPlayer) {
      return;
    }

    if (await isAllowed()) {
      return;

    }

    videoPlayer.pause();
  },
  500,
);
