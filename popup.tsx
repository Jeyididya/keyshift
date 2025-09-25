"use client"

import { useState, useEffect } from "react"
import {Storage} from "@plasmohq/storage"
import { mappingNames } from "~mappings"

import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import "./style/globals.css"

const storage = new Storage()




export default function Popup() {
  const [isEnabled, setIsEnabled] = useState(true)
  // const [selectedLanguage, setSelectedLanguage] = useState("default")

  // const selectedLang = languages.find((lang) => lang.code === selectedLanguage)
  


  const [activeMapping, setActiveMapping] = useState("default")
  const [customMapping, setCustomMapping] = useState<Record<string, string>>({})
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const isDefaultLanguage = activeMapping === "default"


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
  // Send to all tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message)
      }
    })
  })
}




  return (
    <div className="w-full min-h-screen bg-background p-4 space-y-4">
      {/* Header with Logo and Title */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
          {/* <Image
            src="/keyshift-logo.png"
            alt="KeyShift Logo"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          /> */}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">KeyShift</h1>
          <p className="text-xs text-muted-foreground">Language Switching Tool</p>
        </div>
      </div>

      {/* Extension Toggle */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-card-foreground">Extension Status</h3>
            <p className="text-xs text-muted-foreground">
              {isEnabled ? "Extension is active" : "Extension is disabled"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
              {isEnabled ? "ON" : "OFF"}
            </Badge>
            <Switch checked={isEnabled} onCheckedChange={toggle} className="data-[state=checked]:bg-primary" />
          </div>
        </div>
      </Card>

      {/* Language Selection */}
      <Card className="p-4 bg-card border-border">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-1">Target Language</h3>
            <p className="text-xs text-muted-foreground">Choose the language to switch to</p>
          </div>
          <Select value={activeMapping} onValueChange={switchMapping} disabled={!isEnabled}>
            <SelectTrigger
              className={`w-full border-border ${!isEnabled ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" : "bg-input text-foreground"}`}
            >
              <SelectValue>
                <div className="flex items-center gap-2">
                  
                  <span>{activeMapping}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem
                  key="default"
                  value="default"
                  className="text-popover-foreground hover:bg-accent focus:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    
                    <span>Default</span>
                  </div>
                </SelectItem>
              {mappingNames.map((language) => (
                <SelectItem
                  key={language}
                  value={language}
                  className="text-popover-foreground hover:bg-accent focus:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    
                    <span>{language}</span>
                  </div>
                </SelectItem>
              ))}
              
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-1">Active Selection</h3>
            <p className="text-xs text-muted-foreground">Currently selected language</p>
          </div>
          <div className={`rounded-md p-3 border border-border ${!isEnabled ? "bg-muted/50 opacity-60" : "bg-muted"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <span className={`text-base ${!isEnabled ? "opacity-50" : ""}`}>{selectedLang?.flag}</span> */}
                <span
                  className={`text-sm font-medium ${
                    !isEnabled
                      ? "text-muted-foreground"
                      : isDefaultLanguage
                        ? "text-muted-foreground"
                        : "text-foreground"
                  }`}
                >
                  {activeMapping}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    !isEnabled
                      ? "bg-muted-foreground/50"
                      : isDefaultLanguage
                        ? "bg-muted-foreground"
                        : "bg-success animate-pulse"
                  }`}
                ></div>
                <span
                  className={
                    !isEnabled
                      ? "text-muted-foreground"
                      : isDefaultLanguage
                        ? "text-muted-foreground"
                        : "text-foreground"
                  }
                >
                  {!isEnabled ? "Disabled" : isDefaultLanguage ? "Default" : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
