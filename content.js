async function isAllowed() {
  const channelNameTag = document.querySelector("span[itemprop=author] > link[itemprop=name]");
  if (!channelNameTag) {
    return false;
  }

  const channelName = channelNameTag.getAttribute("content");
  const allowlist = (await chrome.storage.sync.get(["allowlist"])).allowlist || [];
  return allowlist.includes(channelName);
}

let alreadyEjected = false; // Debounce in order to not put up the alert more than once.
const observer = new MutationObserver(
  async function() {
    if (alreadyEjected) {
      return;
    }

    if (!window.location.pathname.startsWith("/watch")) {
      return;
    }

    if (await isAllowed()) {
      return;
    }

    const videoPlayer = document.querySelector("video");
    if (videoPlayer) {
      videoPlayer.pause();
    }

    alreadyEjected = true;
    alert("Sorry, this channel isn't allowed");
    window.location = "/";

  }
);
observer.observe(document.body, { subtree: true, childList: true });
