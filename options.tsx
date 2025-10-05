"use client"

import { useEffect, useState } from "react"

import {Storage} from "@plasmohq/storage"

import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Settings, HelpCircle, MessageSquare, Zap, Globe, Keyboard, Eye, Send, Search, Command, Chrome, 
  Database, RefreshCw, Cpu, Code, Shield  } from "lucide-react"

import logo from "data-base64:~assets/icon.png"

import './style/options.css'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { mappingNames } from "~mappings"
import { initializeStorage } from "~mods/storageInit"


const storage = new Storage()


const features = [
  // Core Features
  {
    icon: <Keyboard className="w-4 h-4" />,
    title: "Real-time Keyboard Remapping",
    description: "Automatically translates keyboard input on any webpage as you type",
  },
  {
    icon: <Globe className="w-4 h-4" />,
    title: "Multi-Language Support",
    description: "Handles multiple mappings",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: "Instant Activation",
    description: "Toggle on/off with real-time activation - no page reloads required",
  },
  {
    icon: <Eye className="w-4 h-4" />,
    title: "Visual Feedback System",
    description: "Smooth language switch notifications",
  },
  
  // Advanced Features
  {
    icon: <Search className="w-4 h-4" />,
    title: "Omnibox Integration",
    description: "Type 'ks' in address bar for Google searches",
  },
  {
    icon: <Command className="w-4 h-4" />,
    title: "Keyboard Shortcuts",
    description: "Ctrl+Shift+L to cycle through language mappings instantly",
  },
  {
    icon: <Chrome className="w-4 h-4" />,
    title: "Universal Compatibility",
    description: "Works on all websites, supports Shadow DOM and dynamic content",
  },
  {
    icon: <Cpu className="w-4 h-4" />,
    title: "Smart Input Handling",
    description: "Advanced combo key sequence detection and context-aware processing",
  }
]

const faqItems = [
  // {
  //   question: "How do I use KeyShift?",
  //   answer:
  //     "Simply select any text on a webpage, and KeyShift will automatically translate it to your chosen target language. Make sure the extension is enabled in the popup.",
  // },
  // {
  //   question: "Which languages are supported?",
  //   answer:
  //     "KeyShift supports English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, and Chinese, with more languages coming soon.",
  // },
  // {
  //   question: "Why isn't the extension working?",
  //   answer:
  //     "Make sure the extension is enabled in the popup, you have selected a target language other than 'Default', and you have an active internet connection.",
  // },
  // {
  //   question: "Can I disable the animations?",
  //   answer:
  //     "Yes! You can turn off language cycle animations in the settings below while keeping the core translation functionality active.",
  // },
  // {
  //   question: "How do I report a bug?",
  //   answer:
  //     "Use the 'Send Feedback' section below to report any issues or suggest improvements. We appreciate your feedback!",
  // },
]

export default function OptionsPage() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState("default")
  const [showCycleAnimation, setShowCycleAnimation] = useState(true)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    help: false,
    features: false,
    faq: false,
  })
   const [feedbackType, setFeedbackType] = useState<"feedback" | "bug" | "feature" | null>(null)
  const [feedbackForm, setFeedbackForm] = useState({
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  })

  useEffect(() => {
    initializeStorage()
        storage.get("isEnabled").then(setIsEnabled)
        storage.get("activeMapping").then((name) => setSelectedLanguage(name || "default"))
        storage.get<boolean>("showCycleAnimation").then((value) => setShowCycleAnimation(value ))
        // storage.get("customMapping").then((map) => setCustomMapping(map || {}))
      }, [])

  const toggleExtension = async () => {
      const newValue = !isEnabled
      setIsEnabled(newValue)
      await storage.set("isEnabled", newValue)
      broadcastMessage({ type: "TOGGLE_KEYSHIFT", isEnabled: newValue })
    }

    const toggleCycleAnimation = async () => {
      const newValue = !showCycleAnimation
      setShowCycleAnimation(newValue)
      await storage.set("showCycleAnimation", newValue)
      broadcastMessage({ type: "TOGGLE_CYCLE_ANIMATION", isEnabled: newValue })
    }
    
    const switchMapping = async (name: string) => {
      setSelectedLanguage(name)
      await storage.set("activeMapping", name)
      broadcastMessage({ type: "SWITCH_MAPPING", mappingName: name })
    }


 const broadcastMessage = (message: any) => {
  chrome.runtime.sendMessage(message)
}


  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }
const handleFeedbackTypeSelect = (type: "feedback" | "bug" | "feature") => {
    setFeedbackType(type)
    setFeedbackForm({
      email: "",
      subject: "",
      message: "",
      priority: "medium",
    })
  }

  const handleFormChange = (field: string, value: string) => {
    setFeedbackForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitFeedback = () => {
    // Here you would typically send the feedback to your backend
    console.log("Feedback submitted:", { type: feedbackType, ...feedbackForm })
    alert("Thank you for your feedback! We'll get back to you soon.")
    setFeedbackType(null)
    setFeedbackForm({ email: "", subject: "", message: "", priority: "medium" })
  }
  const selectedLang = ["default", ...mappingNames].find((lang) => lang === selectedLanguage)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white p-2 shadow-lg">
              <img src={logo} alt="KeyShift" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-foreground">KeyShift</h1>
              <p className="text-lg text-muted-foreground">Extension Settings</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Configure KeyShift to match your preferences and workflow. Customize language settings, visual feedback, and
            explore all available features.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-8">
          {/* Quick Settings Row */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Extension Toggle */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Extension Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={isEnabled ? "default" : "secondary"} className="text-sm">
                      {isEnabled ? "ACTIVE" : "DISABLED"}
                    </Badge>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={toggleExtension}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isEnabled
                      ? "KeyShift will apply your chosen key mapping"
                      : "KeyShift will not respond to text selection"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Active Key Mapping</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedLanguage} onValueChange={switchMapping} disabled={!isEnabled}>
                    <SelectTrigger
                      className={`w-full border-border ${!isEnabled ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" : "bg-input text-foreground"}`}
                    >
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span>{selectedLang}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      
                        
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
                  <p className="text-xs text-muted-foreground">Default translation language</p>
                </div>
              </CardContent>
            </Card>

            {/* Animation Settings */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Visual Effects</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={!isEnabled ? "secondary" : showCycleAnimation ? "default" : "secondary"} className="text-sm">
                      {showCycleAnimation ? "ON" : "OFF"}
                    </Badge>
                    <Switch
                      checked={showCycleAnimation}
                      onCheckedChange={toggleCycleAnimation}
                      className="data-[state=checked]:bg-primary"
                      disabled={!isEnabled}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Language cycle animations and visual feedback</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">Key Features</CardTitle>
              </div>
              <CardDescription>Discover what makes KeyShift powerful</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground mb-1">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expandable Sections */}
          <div className="grid gap-6">
            {/* Help Section */}
            <Card className="bg-card border-border">
              <Collapsible open={openSections.help} onOpenChange={() => toggleSection("help")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">How to Use KeyShift</CardTitle>
                      </div>
                      {openSections.help ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <CardDescription>Step-by-step guide to get started</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid gap-6">
                      { [
  {
    step: "1",
    title: "Enable the Extension",
    description: "Toggle the extension ON in the popup or settings page. The status badge will show 'ACTIVE' when enabled.",
  },
  {
    step: "2",
    title: "Select Your Language Mapping",
    description: "Choose from avialable languages or Default mapping from the dropdown menu in the popup.",
  },
  {
    step: "3",
    title: "Start Typing Anywhere",
    description: "Visit any website and type in input fields, textareas, or content-editable areas to see real-time character transformation.",
  },
  {
    step: "4",
    title: "Use Quick Language Cycling (Optional)",
    description: "Press Ctrl+Shift+L to instantly cycle through available language mappings without opening the popup.",
  },
  {
    step: "5",
    title: "Omnibox Quick Translations",
    description: "Type 'ks' + space in your address bar, then enter text to  search on Google.",
  },
  {
    step: "6",
    title: "Customize Visual Feedback",
    description: "Toggle visual animations on/off in settings for language switch notifications based on your preference.",
  },
  {
    step: "7",
    title: "Works Across All Tabs",
    description: "Your settings automatically sync across all open tabs - change once, apply everywhere instantly.",
  }
].map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/20">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground mb-1">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* FAQ */}
            {/* <Card className="bg-card border-border">
              <Collapsible open={openSections.faq} onOpenChange={() => toggleSection("faq")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                      </div>
                      {openSections.faq ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <CardDescription>Common questions and answers</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {faqItems.map((item, index) => (
                        <div key={index} className="border-l-4 border-primary/30 pl-4 py-2">
                          <p className="font-medium text-card-foreground mb-2">{item.question}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card> */}

            {/* Contact/Feedback */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">Send Feedback</CardTitle>
                </div>
                <CardDescription>Help us improve KeyShift with your suggestions</CardDescription>
              </CardHeader>
                            <CardContent>
                <div className="space-y-6">
                  {!feedbackType ? (
                    <>
                      <p className="text-muted-foreground leading-relaxed">
                        We value your feedback! If you encounter any issues, have suggestions for improvements, or want
                        to request new features, please don't hesitate to reach out.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleFeedbackTypeSelect("feedback")}
                          variant="outline"
                          className="border-border text-foreground hover:bg-accent bg-transparent"
                        >
                          Send Feedback
                        </Button>
                        <Button
                          onClick={() => handleFeedbackTypeSelect("bug")}
                          variant="outline"
                          className="border-border text-foreground hover:bg-accent bg-transparent"
                        >
                          Report Bug
                        </Button>
                        <Button
                          onClick={() => handleFeedbackTypeSelect("feature")}
                          variant="outline"
                          className="border-border text-foreground hover:bg-accent bg-transparent"
                        >
                          Request Feature
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-sm">
                            {feedbackType === "feedback"
                              ? "GENERAL FEEDBACK"
                              : feedbackType === "bug"
                                ? "BUG REPORT"
                                : "FEATURE REQUEST"}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFeedbackType(null)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Back
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email Address (optional)
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={feedbackForm.email}
                            onChange={(e) => handleFormChange("email", e.target.value)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="subject" className="text-sm font-medium">
                            Subject
                          </Label>
                          <Input
                            id="subject"
                            placeholder={
                              feedbackType === "feedback"
                                ? "Brief description of your feedback"
                                : feedbackType === "bug"
                                  ? "Brief description of the bug"
                                  : "Brief description of the feature request"
                            }
                            value={feedbackForm.subject}
                            onChange={(e) => handleFormChange("subject", e.target.value)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>

                        {feedbackType === "bug" && (
                          <div className="grid gap-2">
                            <Label htmlFor="priority" className="text-sm font-medium">
                              Priority Level
                            </Label>
                            <Select
                              value={feedbackForm.priority}
                              onValueChange={(value) => handleFormChange("priority", value)} 
                            >
                              <SelectTrigger className="bg-input border-border text-foreground">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                <SelectItem value="low" className="text-popover-foreground hover:bg-accent">
                                  Low - Minor issue
                                </SelectItem>
                                <SelectItem value="medium" className="text-popover-foreground hover:bg-accent">
                                  Medium - Affects functionality
                                </SelectItem>
                                <SelectItem value="high" className="text-popover-foreground hover:bg-accent">
                                  High - Blocks usage
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="grid gap-2">
                          <Label htmlFor="message" className="text-sm font-medium">
                            {feedbackType === "feedback"
                              ? "Your Feedback"
                              : feedbackType === "bug"
                                ? "Bug Description"
                                : "Feature Description"}
                          </Label>
                          <Textarea
                            id="message"
                            placeholder={
                              feedbackType === "feedback"
                                ? "Tell us what you think about KeyShift..."
                                : feedbackType === "bug"
                                  ? "Please describe the bug, steps to reproduce, and expected behavior..."
                                  : "Describe the feature you'd like to see and how it would help you..."
                            }
                            value={feedbackForm.message}
                            onChange={(e) => handleFormChange("message", e.target.value)}
                            className="bg-input border-border text-foreground min-h-[120px] resize-none"
                            rows={5}
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={handleSubmitFeedback}
                            disabled={!feedbackForm.subject || !feedbackForm.message}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Submit{" "}
                            {feedbackType === "feedback"
                              ? "Feedback"
                              : feedbackType === "bug"
                                ? "Bug Report"
                                : "Feature Request"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setFeedbackType(null)}
                            className="border-border text-foreground hover:bg-accent bg-transparent"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
