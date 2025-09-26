let uiContainer: HTMLDivElement | null = null
let hideTimeout: NodeJS.Timeout | null = null

export const showMappingNotification = (mappingName: string) => {
  if (!uiContainer) {
uiContainer = document.createElement("div")

uiContainer.style.position = "fixed"
uiContainer.style.bottom = "20px"
uiContainer.style.right = "20px"
uiContainer.style.padding = "10px 20px"
uiContainer.style.background = "#3b82f6"       // var(--popover)
uiContainer.style.color = "#f5f5f5"           // var(--popover-foreground)
uiContainer.style.borderRadius = "0.625rem"   // var(--radius)
uiContainer.style.fontSize = "16px"
uiContainer.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" // var(--font-sans)
uiContainer.style.zIndex = "9999"
uiContainer.style.transition = "opacity 0.3s ease, transform 0.3s ease"
uiContainer.style.opacity = "0"
uiContainer.style.transform = "translateY(20px)"
document.body.appendChild(uiContainer)


  }

  uiContainer.textContent = `Language: ${mappingName}`

  // Animate in
  uiContainer.style.opacity = "1"
  uiContainer.style.transform = "translateY(0)"

  // Clear previous timeout
  if (hideTimeout) clearTimeout(hideTimeout)

  // Animate out after 1.5s
  hideTimeout = setTimeout(() => {
    if (uiContainer) {
      uiContainer.style.opacity = "0"
      uiContainer.style.transform = "translateY(20px)"
    }
  }, 1500)
}
