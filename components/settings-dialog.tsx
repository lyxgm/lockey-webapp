"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Moon,
  Sun,
  Shield,
  Wifi,
  Volume2,
  Clock,
  Languages,
  HelpCircle,
  RefreshCw,
  Save,
  Smartphone,
  Bell,
  Globe,
  ExternalLink,
  Users,
  Activity,
} from "lucide-react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleDarkMode: () => void
  isDarkMode: boolean
  onShowUserGuide?: () => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  onToggleDarkMode,
  isDarkMode,
  onShowUserGuide,
}: SettingsDialogProps) {
  const { toast } = useToast()
  const [currentLanguage, setCurrentLanguage] = useState("english")
  const [isReconnecting, setIsReconnecting] = useState(false)

  const [notificationSettings, setNotificationSettings] = useState({
    doorUnlocked: true,
    doorLocked: true,
    failedAttempts: true,
  })

  const [deviceSettings, setDeviceSettings] = useState({
    autoLock: true,
    autoLockDelay: 30,
    soundEnabled: true,
    soundVolume: 70,
  })

  const toggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    toast({
      title: "Language Changed",
      description: `Language switched to ${language.charAt(0).toUpperCase() + language.slice(1)}`,
    })
  }

  const handleRefreshPage = () => {
    window.location.reload()
  }

  const handleReconnectDevice = async () => {
    setIsReconnecting(true)

    // Simulate reconnection process
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Device Reconnected",
        description: "Successfully reconnected to your smart door system",
      })
    } catch (error) {
      toast({
        title: "Reconnection Failed",
        description: "Failed to reconnect. Please check your device and try again.",
      })
    } finally {
      setIsReconnecting(false)
    }
  }

  const handleTwoFactorSetup = () => {
    toast({
      title: "Two-Factor Authentication Setup",
      description: "Setting up 2FA with authenticator app...",
    })
    // Simulate setup process
    setTimeout(() => {
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled",
      })
    }, 2000)
  }

  const handleViewSessions = () => {
    toast({
      title: "Active Sessions",
      description: "Current device: Web Browser (This device)\nMobile App: Last active 2 hours ago",
    })
  }

  const handleViewLoginHistory = () => {
    toast({
      title: "Recent Login Activity",
      description: "Today 10:23 AM - Web Browser\nYesterday 8:45 PM - Mobile App\nYesterday 6:30 PM - Web Browser",
    })
  }

  const features = [
    {
      icon: Shield,
      title: "Secure Access Control",
      description: "Advanced biometric authentication and smart lock integration",
    },
    {
      icon: Smartphone,
      title: "Mobile & Web Access",
      description: "Control your smart door from anywhere with our responsive platform",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Easily manage access permissions for family, friends, and service providers",
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Track all door activity with detailed logs and instant notifications",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-4 w-full mb-4 flex-shrink-0">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="general" className="space-y-6 mt-0 pr-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Languages className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">Select your preferred language</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="filipino">Filipino</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={handleRefreshPage}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Settings</CardTitle>
                  <CardDescription>Configure your smart door device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Auto-Lock</p>
                        <p className="text-sm text-muted-foreground">Automatically lock door after opening</p>
                      </div>
                    </div>
                    <Switch
                      checked={deviceSettings.autoLock}
                      onCheckedChange={(checked) => setDeviceSettings({ ...deviceSettings, autoLock: checked })}
                    />
                  </div>

                  {deviceSettings.autoLock && (
                    <div className="ml-10 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-lock-delay">Auto-Lock Delay (seconds)</Label>
                        <span className="text-sm font-medium">{deviceSettings.autoLockDelay}s</span>
                      </div>
                      <Slider
                        id="auto-lock-delay"
                        min={5}
                        max={120}
                        step={5}
                        value={[deviceSettings.autoLockDelay]}
                        onValueChange={(value) => setDeviceSettings({ ...deviceSettings, autoLockDelay: value[0] })}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">AI Voice Speaker</p>
                        <p className="text-sm text-muted-foreground">Enable AI voice responses on speaker</p>
                      </div>
                    </div>
                    <Switch
                      checked={deviceSettings.soundEnabled}
                      onCheckedChange={(checked) => setDeviceSettings({ ...deviceSettings, soundEnabled: checked })}
                    />
                  </div>

                  {deviceSettings.soundEnabled && (
                    <div className="ml-10 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sound-volume">Volume</Label>
                        <span className="text-sm font-medium">{deviceSettings.soundVolume}%</span>
                      </div>
                      <Slider
                        id="sound-volume"
                        min={0}
                        max={100}
                        value={[deviceSettings.soundVolume]}
                        onValueChange={(value) => setDeviceSettings({ ...deviceSettings, soundVolume: value[0] })}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Wifi className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Device Connection</p>
                        <p className="text-sm text-muted-foreground">Smart Door Lock (Connected)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReconnectDevice} disabled={isReconnecting}>
                      {isReconnecting ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      {isReconnecting ? "Reconnecting..." : "Reconnect"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Setup Guide</CardTitle>
                  <CardDescription>Get help setting up and using your smart door system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => onShowUserGuide?.()}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Open Setup Guide
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <p>The setup guide will walk you through:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Connecting your smart door device</li>
                      <li>Setting up biometric authentication</li>
                      <li>Adding family members and guests</li>
                      <li>Configuring notifications and security</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help with your smart door system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => toast({ title: "Help Center", description: "Opening help center..." })}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => toast({ title: "Support", description: "Contacting support..." })}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-0 pr-2">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control which notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-50">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Door Unlocked</p>
                        <p className="text-sm text-muted-foreground">Get notified when door is unlocked</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.doorUnlocked}
                      onCheckedChange={() => toggleNotification("doorUnlocked")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-green-50">
                        <Bell className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Door Locked</p>
                        <p className="text-sm text-muted-foreground">Get notified when door is locked</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.doorLocked}
                      onCheckedChange={() => toggleNotification("doorLocked")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-red-50">
                        <Bell className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Failed Access Attempts</p>
                        <p className="text-sm text-muted-foreground">Get notified about failed access attempts</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.failedAttempts}
                      onCheckedChange={() => toggleNotification("failedAttempts")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Delivery</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push" />
                    <Label htmlFor="push">Push Notifications</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" />
                    <Label htmlFor="email">Email Notifications</Label>
                  </div>

                  <Button className="w-full mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-0 pr-2">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-50">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleTwoFactorSetup}>
                      Set Up
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-red-50">
                        <Shield className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Device Sessions</p>
                        <p className="text-sm text-muted-foreground">Manage active sessions</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleViewSessions}>
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-purple-50">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Login History</p>
                        <p className="text-sm text-muted-foreground">View recent login activity</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleViewLoginHistory}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy</CardTitle>
                  <CardDescription>Manage your privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Data Collection</p>
                        <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Activity Logs</p>
                        <p className="text-sm text-muted-foreground">How long to keep activity logs</p>
                      </div>
                    </div>
                    <Select defaultValue="90days">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 days</SelectItem>
                        <SelectItem value="90days">90 days</SelectItem>
                        <SelectItem value="1year">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => toast({ title: "Data Deletion", description: "This would delete all your data" })}
                  >
                    Delete All Data
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-6 mt-0 pr-2">
              {/* Hero Section */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Globe className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-blue-900 mb-2">Welcome to Lockey</CardTitle>
                  <CardDescription className="text-lg text-blue-700 max-w-2xl mx-auto">
                    The future of smart door security is here. Experience seamless access control with advanced AI
                    technology, biometric authentication, and real-time monitoring.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Visit Our Website
                    </Button>
                    <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Stats Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Trusted by Thousands</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                      <div className="text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                      <div className="text-muted-foreground">Uptime</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                      <div className="text-muted-foreground">Support</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Smart Door Lock Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Fingerprint Recognition</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Facial Recognition</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AI Voice Detection</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Remote Access</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Activity Logging</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security & Privacy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">End-to-End Encryption</p>
                        <p className="text-sm text-muted-foreground">All data is encrypted and secure</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Local Data Storage</p>
                        <p className="text-sm text-muted-foreground">Biometric data stays on your device</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">GDPR Compliant</p>
                        <p className="text-sm text-muted-foreground">Full compliance with privacy regulations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Section */}
              <Card className="bg-gray-50">
                <CardHeader className="text-center">
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>Our support team is here to assist you</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
                      <div className="font-medium">Email Support</div>
                      <div className="text-sm text-muted-foreground">support@lockey.com</div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
                      <div className="font-medium">Phone Support</div>
                      <div className="text-sm text-muted-foreground">1-800-LOCKEY</div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
                      <div className="font-medium">Live Chat</div>
                      <div className="text-sm text-muted-foreground">Available 24/7</div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
