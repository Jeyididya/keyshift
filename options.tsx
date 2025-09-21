// src/options.tsx
import React, { useState, useEffect } from "react"
import styles from "./options.module.css"

function Options() {
  const [activeTab, setActiveTab] = useState("general")

  // Mock rules — replace with chrome.storage later
  const [rules] = useState([
    { id: 1, domain: "example.com", action: "Always On", mapping: "Amharic" },
  ])

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Input Mapping Settings</h1>
        <p>Customize your input mapping experience</p>
      </header>

      {/* Tab Navigation */}
      <nav className={styles.tabNav}>
        {[
          { id: "general", label: "General Settings" },
          { id: "siteRules", label: "Site Rules" },
          { id: "appearance", label: "Appearance" },
          { id: "importExport", label: "Import / Export" },
          { id: "help", label: "Help & Feedback" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${
              activeTab === tab.id ? styles.tabBtnActive : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* General Settings */}
        <div
          className={`${styles.tabPane} ${
            activeTab === "general" ? styles.tabPaneActive : ""
          }`}
        >
          <div className={styles.card}>
            <h2>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              General Settings
            </h2>

            <div className={styles.formGroup}>
              <div className={styles.toggleWrapper}>
                <div>
                  <div className={styles.formLabel}>Enable on startup</div>
                  <div className={styles.formDescription}>
                    Automatically enable input mapping when browser starts
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Default mapping</label>
              <select className={styles.select}>
                <option>Amharic</option>
                <option>Tigrinya</option>
                <option>Custom</option>
                <option selected>Default</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cycling shortcut</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  value="Ctrl+Shift+L"
                  readOnly
                  className={styles.input}
                  style={{ maxWidth: "160px" }}
                />
                <button className={`${styles.btn} ${styles.btnSecondary}`}>
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Site Rules */}
        <div
          className={`${styles.tabPane} ${
            activeTab === "siteRules" ? styles.tabPaneActive : ""
          }`}
        >
          <div className={styles.card}>
            <h2>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Site Rules
            </h2>

            <div className={styles.formGroup}>
              {rules.map((rule) => (
                <div key={rule.id} className={styles.ruleItem}>
                  <span>
                    <span>{rule.domain}</span>
                    <span>→</span>
                    <span className={styles.badge}>{rule.action}</span>
                    <span className={styles.badge}>{rule.mapping}</span>
                  </span>
                  <button className={`${styles.btn} ${styles.btnSecondary}`}>
                    Edit
                  </button>
                </div>
              ))}
            </div>

            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              style={{ marginTop: "16px" }}
            >
              <svg className={styles.icon} viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Rule
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div
          className={`${styles.tabPane} ${
            activeTab === "appearance" ? styles.tabPaneActive : ""
          }`}
        >
          <div className={styles.card}>
            <h2>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Appearance
            </h2>

            <div className={styles.formGroup}>
              <div className={styles.toggleWrapper}>
                <div>
                  <div className={styles.formLabel}>Dark mode</div>
                  <div className={styles.formDescription}>
                    Enable dark theme for the extension
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.toggleWrapper}>
                <div>
                  <div className={styles.formLabel}>
                    Show language indicator
                  </div>
                  <div className={styles.formDescription}>
                    Display current language when cycling
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Import / Export */}
        <div
          className={`${styles.tabPane} ${
            activeTab === "importExport" ? styles.tabPaneActive : ""
          }`}
        >
          <div className={styles.card}>
            <h2>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Import / Export Settings
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Settings
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import Settings
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <polyline points="1 4 1 10 7 10" />
                  <polyline points="23 20 23 14 17 14" />
                  <path d="M20.49 9A9 9 0 0 1 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Help & Feedback */}
        <div
          className={`${styles.tabPane} ${
            activeTab === "help" ? styles.tabPaneActive : ""
          }`}
        >
          <div className={styles.card}>
            <h2>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Help & Feedback
            </h2>

            <div className={styles.grid}>
              <a href="#" className={styles.cardLink}>
                <h3>
                  <svg className={styles.icon} viewBox="0 0 24 24">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  How to use
                </h3>
                <p>Learn how to get started with input mapping</p>
              </a>

              <a href="#" className={styles.cardLink}>
                <h3>
                  <svg className={styles.icon} viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3 3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z" />
                  </svg>
                  FAQ
                </h3>
                <p>Find answers to common questions</p>
              </a>

              <a href="#" className={styles.cardLink}>
                <h3>
                  <svg className={styles.icon} viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Report issue / Suggest feature
                </h3>
                <p>Contact our support team or suggest improvements</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Options