// src/inputHandler.ts
import { Storage } from "@plasmohq/storage"
import {
  defaultMapping,
  namedMappings,
  getMappingByName,
} from "../mappings"

const storage = new Storage()

// Active character map — dynamically updated
export let characterMap: Record<string, string> = { ...defaultMapping }

// Active mapping name (e.g., "amharic", "custom")
let activeMappingName: string = "default"

// Custom user-defined mapping (separate from presets)
let customMapping: Record<string, string> = {}

// Enable/disable toggle
let isEnabled = true

// Core key handler — unchanged
export function handleKeyDown(event: KeyboardEvent) {
  if (!isEnabled) return

  const { key, target } = event

  if (
    typeof key !== "string" ||
    key.length !== 1 ||
    !["INPUT", "TEXTAREA"].includes((target as HTMLElement).tagName)
  ) {
    return
  }

  const replacement = characterMap[key.toLowerCase()] || characterMap[key]

  if (replacement) {
    event.preventDefault()

    const input = target as HTMLInputElement | HTMLTextAreaElement
    const start = input.selectionStart
    const end = input.selectionEnd

    const newValue =
      input.value.substring(0, start!) +
      replacement +
      input.value.substring(end!)

    input.value = newValue

    const newCursorPos = start! + replacement.length
    input.setSelectionRange(newCursorPos, newCursorPos)

    input.dispatchEvent(new Event("input", { bubbles: true }))
  }
}

// Set enabled state
export function setEnabled(value: boolean) {
  isEnabled = value
  console.log("Input handler enabled:", isEnabled)
}

// Switch to named mapping
export function setActiveMapping(name: string) {
  activeMappingName = name
    
  // Load base mapping
  const base = getMappingByName(name)

  // If custom, merge with saved custom mapping
  if (name === "custom") {
    characterMap = { ...base, ...customMapping }
  } else {
    characterMap = { ...base }
  }

  console.log(`Mapping switched to: ${name}`, characterMap)
}

// Update custom mapping (user-defined pairs)
export function updateCustomMapping(newMap: Record<string, string>) {
  customMapping = newMap

  // If currently using custom, update active map
  if (activeMappingName === "custom") {
    characterMap = { ...getMappingByName("custom"), ...customMapping }
    console.log("Custom mapping updated:", characterMap)
  }
}

// Initialize from storage
export async function initialize() {
  const savedEnabled = await storage.get<boolean>("isEnabled")
  isEnabled = savedEnabled ?? true

  const savedActiveMapping = await storage.get<string>("activeMapping")
  activeMappingName = savedActiveMapping || "default"

  const savedCustomMap = await storage.get<Record<string, string>>("customMapping")
  customMapping = savedCustomMap || {}

  // Apply active mapping
  setActiveMapping(activeMappingName)
}