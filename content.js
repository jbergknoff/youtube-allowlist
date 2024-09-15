async function isAllowed() {
  const channelNameTag = document.querySelector("span[itemprop=author] > link[itemprop=name]");
  if (!channelNameTag) {
    console.log("No channel name tag found");
    return false;
  }

  const channelName = channelNameTag.getAttribute("content");
  const allowlist = (await chrome.storage.sync.get(["allowlist"])).allowlist || [];
  return allowlist.includes(channelName);
}

(async function() {
  if (await isAllowed()) {
    return;
  }

  // Removing the video player, or its parent elements. Doesn't work: I guess YT has JavaScript which
  // re-adds them (probably something declarative like React). Instead, pause, show an alert, and then
  // navigate away.
  const videoPlayer = document.querySelector("video");
  if (videoPlayer) {
    videoPlayer.pause();
  }

  alert("Sorry, this channel isn't allowed.");
  location.href = "/";
})();
