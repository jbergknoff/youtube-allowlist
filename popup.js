async function getAllowlist() {
  return ((await chrome.storage.sync.get(["allowlist"])) || {}).allowlist || {};
}

// Load the allowlist from storage and display it
async function renderAllowlist() {
  const allowlist = await getAllowlist();
  const allowlistElement = document.getElementById("allowlist");
  allowlistElement.innerHTML = "";

  for (const channelName of Object.keys(allowlist).sort()) {
    const listItem = document.createElement("li");
    listItem.textContent = channelName;
    const removeButton = document.createElement("button");
    removeButton.innerText = "×";
    removeButton.addEventListener(
      "click",
      async () => {
        delete allowlist[channelName.toLowerCase()];
        await saveAllowlist(allowlist);
        await renderAllowlist();
      },
    );
    listItem.appendChild(removeButton);
    allowlistElement.appendChild(listItem);
  }
}

async function saveAllowlist(allowlist) {
  await chrome.storage.sync.set({ allowlist });
}

document.querySelector("form#add-channel").addEventListener(
  "submit",
  async () => {
    const channelInput = document.getElementById("channelInput");
    const channelName = channelInput.value.trim();
    if (!channelName) {
      return;
    }

    const allowlist = await getAllowlist();
    allowlist[channelName.toLowerCase()] = true;
    await saveAllowlist(allowlist);
    await renderAllowlist();
    channelInput.value = "";
  },
);

// Load the allowlist when the popup is opened
document.addEventListener("DOMContentLoaded", renderAllowlist);
