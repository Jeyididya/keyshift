// src/popup.tsx
import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"
import { mappingNames } from "~mappings"
import styles from "./popup.module.css"

const storage = new Storage()

function Popup() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [activeMapping, setActiveMapping] = useState("default")
  const [customMapping, setCustomMapping] = useState<Record<string, string>>({})
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  useEffect(() => {
    storage.get("isEnabled").then(setIsEnabled)
    storage.get("activeMapping").then((name) => setActiveMapping(name || "default"))
    storage.get("customMapping").then((map) => setCustomMapping(map || {}))
  }, [])

  const toggle = async () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    await storage.set("isEnabled", newValue)
    broadcastMessage({ type: "TOGGLE_KEYSHIFT", isEnabled: newValue })
  }

  const switchMapping = async (name: string) => {
    setActiveMapping(name)
    await storage.set("activeMapping", name)
    broadcastMessage({ type: "SWITCH_MAPPING", mappingName: name })
  }

  const addCustomMapping = () => {
    if (!newKey.trim() || !newValue.trim()) return

    const updated = {
      ...customMapping,
      [newKey.trim()]: newValue.trim(),
    }

    setCustomMapping(updated)
    setNewKey("")
    setNewValue("")
    saveCustomMapping(updated)
  }

  const removeCustomMapping = (key: string) => {
    const updated = { ...customMapping }
    delete updated[key]
    setCustomMapping(updated)
    saveCustomMapping(updated)
  }

  const saveCustomMapping = async (map: Record<string, string>) => {
    await storage.set("customMapping", map)
    broadcastMessage({ type: "UPDATE_CUSTOM_MAPPING", mapping: map })
  }

  const broadcastMessage = (message: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message)
      }
    })
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <img src="/icons/icon48.png" alt="KeyShift" className={styles.popupLogo} />
          <div className={styles.titleText}>
            KeyShift
            <div className={styles.slogan}>Shift your keys, type your way.</div>
          </div>
        </div>
        <button className={styles.iconButton} aria-label="Settings">⚙️</button>
      </div>

      {/* Toggle */}
      <div className={`${styles.card} ${styles.toggleContainer}`}>
        <span>Toggle conversion:</span>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={toggle}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Language Selector Card */}
      <div className={styles.card}>
        <label htmlFor="lang">Select Input Type</label>
        <select
          id="lang"
          value={activeMapping}
          onChange={(e) => switchMapping(e.target.value)}
        >
          <option value="default">Default</option>
          {mappingNames.map((name) => (
            <option key={name} value={name}>
              {name === "amharic" ? "Amharic" : name === "tigrinya" ? "Tigrinya" : name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
          
        </select>
      </div>

      {/* Status */}
      {/* Status */}
     {/* Status */}
      <div className={`${styles.card} ${styles.status}`}>
        {!isEnabled ? (
          <div className={styles.inactive}>⛔ Disabled</div>
        ) : activeMapping === "default" ? (
          <div className={styles.inactive}>🔤 Default Mode</div>
        ) : (
          <div className={styles.active}>⚡ Active: {activeMapping}</div>
        )}
      </div>
      
      
    </div>
  )
}

export default Popup
