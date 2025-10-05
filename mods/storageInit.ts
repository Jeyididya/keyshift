import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export interface StorageDefaults {
  isEnabled: boolean
  activeMapping: string
  customMapping: Record<string, string>
  showCycleAnimation: boolean
}

export const defaultStorageValues: StorageDefaults = {
  isEnabled: true,
  activeMapping: "default",
  customMapping: {},
  showCycleAnimation: true
}

export async function initializeStorage() {
  console.log("🔧 Initializing storage with default values...")
  
  const promises = Object.entries(defaultStorageValues).map(async ([key, defaultValue]) => {
    const currentValue = await storage.get(key)
    
    
    if (currentValue === undefined || currentValue === null) {
      console.log(`Setting default for ${key}:`, defaultValue)
      await storage.set(key, defaultValue)
    }
  })
  
  await Promise.all(promises)
  console.log("✅ Storage initialization complete")
}


export async function getStorageValue<T>(key: string): Promise<T> {
  const value = await storage.get(key)
  return value !== undefined ? value : defaultStorageValues[key as keyof StorageDefaults] as T
}