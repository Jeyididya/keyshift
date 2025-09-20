// src/mods/languageCycler.ts
import { setActiveMapping, activeMappingName, availableLanguages } from "./inputHandlers"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

let indicator: HTMLDivElement | null = null

// Main cycling function
export function cycleLanguage(event: KeyboardEvent) {
  // Only trigger on Ctrl+Shift+L
  if (!(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "l")) {
    return
  }

  event.preventDefault()

  const currentIndex = availableLanguages.indexOf(activeMappingName)
  const nextIndex =
    currentIndex === -1
      ? 0
      : (currentIndex + 1) % availableLanguages.length

  const nextLang = availableLanguages[nextIndex] || "default"

  // Update state
  setActiveMapping(nextLang)
  storage.set("activeMapping", nextLang)

  // Show visual feedback
  showLanguageIndicator(nextLang)

  console.log(`🔤 Cycled to language: ${nextLang}`)
}

// Visual indicator
function showLanguageIndicator(lang: string) {
  if (!indicator) {
    indicator = document.createElement("div")
    indicator.id = "keyshift-language-indicator"
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(30, 30, 30, 0.95);
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      z-index: 2147483647;
      pointer-events: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      transform: scale(0.8);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.4, 1);
    `
    document.body.appendChild(indicator)
  }

  const languageNames: Record<string, string> = {
    am: "Amharic",
    tigrigna: "Tigrinya",
    oromo: "Oromo",
    somali: "Somali",
    en: "English",
    default: "Default",
    custom: "Custom",
  }

  indicator.textContent = languageNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
  indicator.style.opacity = "1"
  indicator.style.transform = "scale(1)"

  // Subtle bounce animation
  setTimeout(() => {
    indicator!.style.transform = "scale(1.05)"
    setTimeout(() => {
      indicator!.style.transform = "scale(1)"
    }, 150)
  }, 50)

  // Auto hide
  setTimeout(() => {
    indicator!.style.opacity = "0"
    indicator!.style.transform = "scale(0.8)"
    setTimeout(() => {
      if (indicator && indicator.parentNode) {
        document.body.removeChild(indicator)
        indicator = null
      }
    }, 300)
  }, 2000)
}