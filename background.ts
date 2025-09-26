export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE_KEYSHIFT" || msg.type === "SWITCH_MAPPING" || msg.type === "UPDATE_CUSTOM_MAPPING") {
    chrome.tabs.query({}, (tabs) => {
      tabs
        .filter(tab => tab.id && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://"))
        .forEach(tab => {
          chrome.tabs.sendMessage(tab.id!, msg, () => {
            if (chrome.runtime.lastError) {
              // silently ignore tabs without listeners
            }
          })
        })
    })
  }
})

