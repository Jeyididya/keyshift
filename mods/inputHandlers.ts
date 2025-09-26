// src/mods/inputHandlers.ts
import { Storage } from "@plasmohq/storage"
import {
  defaultMapping,
  namedMappings,
  getMappingByName,
  mappingNames,
} from "../mappings"
import { showMappingNotification } from "./uiNotification"

const storage = new Storage()

// State
export let characterMap: Record<string, string> = { ...defaultMapping }
export let isEnabled = true
export let activeMappingName = "default"
export let customMapping: Record<string, string> = {}
export let availableLanguages: string[] = []

// ------------------------
// CORE LOGIC (UNCHANGED)
// ------------------------

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

  if (characterMap[combo]) {
    replacement = characterMap[combo]
    comboMatched = true
    target.dataset.lastChar = replacement
  } else if (characterMap[key]) {
    replacement = characterMap[key]
    target.dataset.lastChar = replacement
  } else {
    target.dataset.lastChar = key
    return
  }

  if (replacement) {
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

// ------------------------
// STATE MANAGEMENT
// ------------------------

export function setEnabled(value: boolean) {
  isEnabled = value
  console.log("Input handler enabled:", isEnabled)
}

export function setActiveMapping(name: string) {
  activeMappingName = name

  if (name === "default") {
    characterMap = {}
    console.log("Default mode — no transformation")
    return
  }

  const base = getMappingByName(name)
  if (name === "custom") {
    characterMap = { ...base, ...customMapping }
  } else {
    characterMap = { ...base }
  }

  storage.get<boolean>("showCycleAnimation").then((cycleAnimation) => {
    console.log("z anim", cycleAnimation, "true");
    if (cycleAnimation ) {
      showMappingNotification(name);
    }
  });
  console.log(`Mapping switcheda to: ${name}`, characterMap)
}

export function updateCustomMapping(newMap: Record<string, string>) {
  customMapping = newMap
  if (activeMappingName === "custom") {
    characterMap = { ...getMappingByName("custom"), ...customMapping }
    console.log("Custom mapping updated:", characterMap)
  }
}


export async function initializeState() {
  const savedEnabled = await storage.get<boolean>("isEnabled")
  isEnabled = savedEnabled ?? true

  const savedActive = await storage.get<string>("activeMapping")
  activeMappingName = savedActive || "default"

  const savedCustom = await storage.get<Record<string, string>>("customMapping")
  customMapping = savedCustom || {}

  setActiveMapping(activeMappingName)
}

// ------------------------
// YOUTUBE + SHADOW DOM SUPPORT
// ------------------------

export function attachListeners(root: Document | ShadowRoot = document) {
  const selectors = `
    input:not([type='hidden']):not([disabled]),
    textarea:not([disabled]),
    [contenteditable="true"],
    .ProseMirror[contenteditable="true"],
    #prompt-textarea
  `

  const editables = root.querySelectorAll<HTMLElement>(selectors)

  editables.forEach((el) => {
    if (!el.dataset.listenerAttached) {
      el.addEventListener("keydown", handleKeyDown)
      el.addEventListener("focusin", () => (el.dataset.lastChar = ""))
      el.dataset.listenerAttached = "true"
    }
  })

  // Handle Shadow DOM
  root.querySelectorAll("*").forEach((el) => {
    if (el.shadowRoot) attachListeners(el.shadowRoot)
  })

  // ✅ YOUTUBE SEARCH — multiple strategies
  let ytSearch: HTMLElement | null = null

  // Strategy 1: Direct #search
  ytSearch = root.querySelector('input#search') as HTMLElement

  // Strategy 2: Inside ytd-searchbox shadow root
  if (!ytSearch) {
    const searchBox = root.querySelector('ytd-searchbox')
    if (searchBox && searchBox.shadowRoot) {
      ytSearch = searchBox.shadowRoot.querySelector('input#search') as HTMLElement
    }
  }

  // Strategy 3: Modern YouTube (2024+)
  if (!ytSearch) {
    ytSearch = root.querySelector('input[name="search_query"]') as HTMLElement
  }

  // Strategy 4: Within #search-input container
  if (!ytSearch) {
    const container = root.querySelector('#search-input')
    if (container) {
      ytSearch = container.querySelector('input') as HTMLElement
    }
  }

  if (ytSearch && !ytSearch.dataset.listenerAttached) {
    ytSearch.addEventListener("keydown", handleKeyDown)
    ytSearch.addEventListener("focusin", () => (ytSearch!.dataset.lastChar = ""))
    ytSearch.dataset.listenerAttached = "true"
    console.log("✅ Attached listener to YouTube search input")
  }

}

export function initializeAdvanced() {
  attachListeners()

  // Observe dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const el = node as HTMLElement
          attachListeners(el)

          // Check if it's a shadow host
          if (el.shadowRoot) {
            attachListeners(el.shadowRoot)
          }
        }
      })
    })
  })

  observer.observe(document, { childList: true, subtree: true })

  console.log("Intialized advanced listeners for Shadow DOM & YouTube")

  // Re-init after 3s for late-loaded elements
  
}