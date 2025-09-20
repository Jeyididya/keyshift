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
  if (!isEnabled || activeMappingName === "default") return
  if (event.ctrlKey || event.altKey || event.metaKey) return

  const target = event.target as HTMLElement
  if (!isEditable(target)) return

  const key = event.key
  const lastChar = target.dataset.lastChar || ""
  const combo = lastChar + key

  let replacement = null
  let comboMatched = false

  // Check combo first
  if (characterMap[combo]) {
    console.log("--1")
    replacement = characterMap[combo]
    comboMatched = true
    target.dataset.lastChar = replacement
  } else if (characterMap[key]) {
    console.log("--2")
    replacement = characterMap[key]
    target.dataset.lastChar = replacement
  } else {
    console.log("--3")
    target.dataset.lastChar = key
    return
  }

  if (replacement) {
    console.log("the replacement", replacement)
    event.preventDefault()

    if (comboMatched) deleteLastChar(target)

    insertText(target, replacement)
  }
}

function isEditable(el: HTMLElement): boolean {
  return (
    el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.isContentEditable)
  )
}

function deleteLastChar(el: HTMLElement) {
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    const input = el as HTMLInputElement | HTMLTextAreaElement
    const start = input.selectionStart
    const end = input.selectionEnd
    if (start && start > 0) {
      input.value =
        input.value.slice(0, start - 1) + input.value.slice(end!)
      input.selectionStart = input.selectionEnd = (start - 1)!
      input.dispatchEvent(new Event("input", { bubbles: true }))
    }
  } else if (el.isContentEditable) {
    const sel = window.getSelection()
    if (!sel?.rangeCount) return
    const range = sel.getRangeAt(0)
    if (range.startOffset > 0) {
      range.setStart(range.startContainer, range.startOffset - 1)
      range.deleteContents()
    }
  }
}

function insertText(el: HTMLElement, text: string) {
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    const input = el as HTMLInputElement | HTMLTextAreaElement
    const start = input.selectionStart
    const end = input.selectionEnd
    input.value =
      input.value.slice(0, start!) + text + input.value.slice(end!)
    input.selectionStart = input.selectionEnd = start! + text.length
    input.dispatchEvent(new Event("input", { bubbles: true }))
  } else if (el.isContentEditable) {
    const sel = window.getSelection()
    if (sel?.rangeCount) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      document.execCommand("insertText", false, text)
    }
    el.dispatchEvent(new Event("input", { bubbles: true }))
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