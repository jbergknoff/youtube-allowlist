// Load the allowlist from storage and display it
function loadAllowlist() {
  chrome.storage.sync.get("allowlist", function (result) {
      const allowlist = result.allowlist || [];
      const allowlistElement = document.getElementById("allowlist");
      allowlistElement.innerHTML = "";

      allowlist.forEach(function (channelID) {
          const li = document.createElement("li");
          li.textContent = channelID;
          li.className = "channel";
          allowlistElement.appendChild(li);
      });
  });
}

// Add a new channel to the allowlist
document.getElementById("addChannel").addEventListener("click", function () {
  const channelID = document.getElementById("channelInput").value.trim();
  if (channelID) {
      chrome.storage.sync.get("allowlist", function (result) {
          const allowlist = result.allowlist || [];
          if (!allowlist.includes(channelID)) {
              allowlist.push(channelID);
              chrome.storage.sync.set({ allowlist: allowlist }, function () {
                  loadAllowlist();
              });
          }
      });
  }
  document.getElementById("channelInput").value = "";
});

// Load the allowlist when the popup is opened
document.addEventListener("DOMContentLoaded", loadAllowlist);
