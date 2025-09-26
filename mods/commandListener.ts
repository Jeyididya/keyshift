import { mappingNames } from "../mappings";
import { setActiveMapping } from "./inputHandlers";
import {Storage} from "@plasmohq/storage"

const storage = new Storage()

let currentIndex = 0;
let listenerAttached = false;

export const initializeKeyboardListener = () => {
  if (listenerAttached) return; // prevent duplicates
  listenerAttached = true;

  // Restore last mapping from storage
  chrome.storage.sync.get("activeMapping", ({ activeMapping }) => {
    if (activeMapping && mappingNames.includes(activeMapping)) {
      currentIndex = mappingNames.indexOf(activeMapping);
      setActiveMapping(activeMapping);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyL") {
      e.preventDefault();

      currentIndex = (currentIndex + 1) % mappingNames.length;
      const nextMapping = mappingNames[currentIndex];

      // Apply locally
      setActiveMapping(nextMapping);
      

      // Persist globally
      storage.set("activeMapping", nextMapping)
      // chrome.storage.sync.set({ activeMapping: String(nextMapping) });

      // Notify other tab
      chrome.runtime.sendMessage({
        type: "SWITCH_MAPPING",
        mappingName: nextMapping,
      });

      console.log("🔄 Mapping switched to", nextMapping);
    }
  });
};
