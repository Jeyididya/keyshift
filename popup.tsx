// src/popup.tsx
import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"
import { mappingNames, namedMappings } from "~mappings"
import styles from "./popup.module.css" // ✅ Import CSS module

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
      <h2 className={styles.title}>KeyShift</h2>
      <p className={styles.description}>Transform your keystrokes in real-time!</p>

      {/* Toggle */}
      <label className={styles.toggleLabel}>
        <input type="checkbox" checked={isEnabled} onChange={toggle} />
        Enable KeyShift
      </label>

      <hr className={styles.divider} />

      {/* Mapping Selector */}
      <div className={styles.mappingSelector}>
        <label>
          <div><strong>Active Mapping:</strong></div>
          <select
            value={activeMapping}
            onChange={(e) => switchMapping(e.target.value)}
          >
            <option value="default">Default (No Transformation)</option>
            {mappingNames.map((name) => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
            ))}
            
          </select>
        </label>
      </div>

      {/* Custom Mapping Editor */}
      {activeMapping === "custom" && (
        <div className={styles.customEditor}>
          <h3>Custom Mappings</h3>
          <div className={styles.inputRow}>
            <input
              type="text"
              placeholder="Key (e.g. z)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              maxLength={1}
            />
            <input
              type="text"
              placeholder="Replacement (e.g. ዝ)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <button
              onClick={addCustomMapping}
              className={styles.addButton}
            >
              Add
            </button>
          </div>

          <div className={styles.mappingList}>
            {Object.entries(customMapping).map(([key, val]) => (
              <div key={key} className={styles.mappingItem}>
                <span><strong>{key}</strong> → {val}</span>
                <button
                  onClick={() => removeCustomMapping(key)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
            {Object.keys(customMapping).length === 0 && (
              <em className={styles.emptyState}>No custom mappings. Add one above!</em>
            )}
          </div>
        </div>
      )}



      <div className={styles.footer}>
        Example: z → ዝ, j → ጅ
      </div>
    </div>
  )
}

export default Popup