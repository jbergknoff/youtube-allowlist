// When the DOM has loaded, the channel name still isn't there. Also, YouTube may update the content
// of the page without navigating to a new page. For that reason, we use a `MutationObserver` to watch
// for channel names.
const observer = new MutationObserver(async function () {
  const channelName = ((document.querySelector("#text-container.ytd-channel-name") || {}).innerText || "").trim();
  // TODO fail closed somehow if the channel name isn't available (e.g. if DOM structure changes).
  if (!channelName) {
    return;
  }

  // We found the channel name. Disconnect
  observer.disconnect();

  const allowlist = (await chrome.storage.sync.get(["allowlist"])).allowlist || [];
  if (allowlist.includes(channelName)) {
    return;
  }

  const videoPlayer = document.querySelector("video");
  if (!videoPlayer) {
    return;
  }

  // Removing the video player, or its parent elements. Doesn't work: I guess YT has JavaScript which
  // re-adds them (probably something declarative like React). Instead, pause, show an alert, and then
  // navigate away.
  videoPlayer.pause();
  alert(`Sorry, this channel (${channelName}) isn't allowed.`);
  location.href = "/";
});
observer.observe(document.body, { childList: true, subtree: true });
