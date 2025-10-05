export {}
 
import { Storage } from "@plasmohq/storage"
const storage = new Storage()
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



import { translateTextByChar, } from "./mods/inputHandlers"
import { getMappingByName } from "~mappings"


async function translateString(input: string) {
  const enabled = await storage.get<boolean>("isEnabled")
  const activeMapping = await storage.get<string>("activeMapping") || "default"
  const map = getMappingByName(activeMapping)

  if (enabled === false) return input

  

  let result = ""
  let lastChar = ""

  for (const char of input) {
    const combo = lastChar + char

    if (map[combo]) {
      result = result.slice(0, result.length - 1) + map[combo]
      lastChar = map[combo]
    } else if (map[char]) {
      result += map[char]
      lastChar = map[char]
    } else {
      result += char
      lastChar = char
    }
  }

  return result
}


chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  

  const translated = await translateString(text);

  suggest([
    {
      content: translated,
      description: `Translate "${text}" → "${translated}"`
    }
  ]);
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  const translated = await translateString(text);
  // Open Google search with the translated text
  const url = "https://www.google.com/search?q=" + encodeURIComponent(translated);
  chrome.tabs.create({ url });
});

// chrome.omnibox.onInputEntered.addListener(async (text) => {
//   if (text === "enable") {
//     await storage.set("isEnabled", true)
//   } else if (text === "disable") {
//     await storage.set("isEnabled", false)
//   } else {
//     await storage.set("activeMapping", text)
//   }

//   // Broadcast to all tabs
//   chrome.tabs.query({}, (tabs) => {
//     tabs.forEach(tab => {
//       if (tab.id) {
//         chrome.tabs.sendMessage(tab.id, {
//           type: text === "enable" || text === "disable" ? "TOGGLE_KEYSHIFT" : "SWITCH_MAPPING",
//           value: text
//         })
//       }
//     })
//   })

//   chrome.omnibox.setDefaultSuggestion({ description: `KeyShift updated: ${text}` })
// })


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
