// src/mappings.ts

// Default fallback — minimal safe mapping
export const defaultMapping: Record<string, string> = {
}

// Named presets
export const namedMappings = {
  amharic: {
    z: "ዘ",
    j: "ጀ",
    s: "ሰ",
    sh: "ሸ", // Note: you’ll need to handle multi-char later
    b: "በ",
    t: "ተ",
    c: "ቸ",
    h: "ሀ",
    l: "ለ",
    m: "መ",
    n: "ነ",
  },
  tigrinya: {
    z: "ዚ",
    j: "ጂ",
    s: "ሲ",
    b: "ቢ",
    t: "ቲ",
    k: "ኪ",
    l: "ሊ",
    m: "ሚ",
    n: "ኒ",
  }
}

// Helper: get full mapping by name
export function getMappingByName(name: string): Record<string, string> {
  if (name === "none" || name === "default") {
    return {}
  }
  return namedMappings[name as keyof typeof namedMappings] || defaultMapping
}

// List of available mapping names for UI
export const mappingNames = Object.keys(namedMappings)

