export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE_KEYSHIFT" || msg.type === "TOGGLE_CYCLE_ANIMATION" || msg.type === "UPDATE_CUSTOM_MAPPING") {
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



chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "SWITCH_MAPPING") {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.id && tab.url?.startsWith("http")) {
          chrome.tabs.sendMessage(tab.id, msg)
        }
      }
    })
  }
})

// import { mappingNames } from "~mappings"; // your mappings array

// let currentIndex = 0;

// chrome.commands.onCommand.addListener((command) => {
//   if (command === "cycle-mapping") {
//     // Cycle index
//     currentIndex = (currentIndex + 1) % mappingNames.length;
//     const nextMapping = mappingNames[currentIndex];

//     // Broadcast to all tabs
//     chrome.tabs.query({}, (tabs) => {
//       tabs
//         .filter(tab => tab.id && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://"))
//         .forEach(tab => {
//           chrome.tabs.sendMessage(tab.id!, {
//             type: "SWITCH_MAPPING",
//             mappingName: nextMapping
//           });
//         });
//     });

//     // Optionally store in extension storage
//     // chrome.storage.local.set({ activeMapping: nextMapping });
//   }
// });
