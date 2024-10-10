async function getAllowlist() {
  return ((await chrome.storage.sync.get(["allowlist"])) || {}).allowlist || {};
}

async function saveAllowlist(allowlist) {
  await chrome.storage.sync.set({ allowlist });
}

class AllowlistView {
  async oninit() {
    this.allowlist = await getAllowlist();
    m.redraw();
  }

  view() {
    return [
      m("h3", "Allowed Channels"),
      m(
        "ul",
        Object.keys(this.allowlist || {}).sort().map(
          (channelName) => {
            return m(
              "li",
              [
                channelName,
                m(
                  "button",
                  {
                    class: "remove", // This button gets its "x" symbol from CSS.
                    onclick: async () => {
                      delete this.allowlist[channelName.toLowerCase()];
                      await saveAllowlist(this.allowlist);
                    },
                  },
                ),
              ],
            );
          },
        )
      ),
      m(new AddChannelForm(this.allowlist)),
    ];
  }
}

class AddChannelForm {
  constructor(allowlist) {
    this.allowlist = allowlist; // Store a reference to the parent component's state so we can trigger redraws.
  }

  async addChannel(e) {
    e.preventDefault(); // Don't reload the page.

    const channelInput = e.target.querySelector("input");
    const channelName = (channelInput.value || "").toLowerCase().trim();
    if (!channelName) {
      return;
    }

    this.allowlist[channelName] = true;
    await saveAllowlist(this.allowlist);
    channelInput.value = "";
  }

  view() {
    return m(
      "form",
      { onsubmit: this.addChannel.bind(this) },
      [
        m("input", { type: "text", placeholder: "Add channel name" }),
        m("button", { type: "submit" }, "Add"),
      ],
    );
  }
}

m.mount(document.body, AllowlistView)
