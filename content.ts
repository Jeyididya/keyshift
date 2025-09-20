// src/content.ts
import {
  handleKeyDown,
  setEnabled,
  setActiveMapping,
  updateCustomMapping,
// initializeMappings,
  initializeState,
  initializeAdvanced
} from "mods/inputHandlers"


initializeState()


initializeAdvanced()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TOGGLE_KEYSHIFT") {
    setEnabled(message.isEnabled)
  } else if (message.type === "SWITCH_MAPPING") {
    setActiveMapping(message.mappingName)
  } else if (message.type === "UPDATE_CUSTOM_MAPPING") {
    updateCustomMapping(message.mapping)
  }
})

console.log("KeyShift content script loaded")
