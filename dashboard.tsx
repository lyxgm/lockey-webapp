"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { AddPersonDialog } from "./components/add-person-dialog"
import { PersonMenu } from "./components/person-menu"
import { CameraView } from "./components/camera-view"
import { HistoryView } from "./components/history-view"
import { AccessManagement } from "./components/access-management"
import { SettingsDialog } from "./components/settings-dialog"
import { PeoplePage } from "./components/people-page"
import { LoginPage } from "./components/auth/login-page"
import { SignUpPage } from "./components/auth/signup-page"
import { ConnectSystemDialog } from "./components/connect-system-dialog"
import { EditProfileDialog } from "./components/edit-profile-dialog"
import { SignOutDialog } from "./components/sign-out-dialog"
import { LockeyTextEffect } from "./components/lockey-text-effect"
import { OnboardingFlow } from "./components/onboarding-flow"
import { BiometricRegistration } from "./components/biometric-registration"
import { useToast } from "@/hooks/use-toast"
import { Camera, Lock, Unlock, Shield, User, AlertTriangle } from "lucide-react"

// User data storage
const STORAGE_KEY = "lockey_user_data"
const SYSTEM_STORAGE_KEY = "lockey_system_data" // Global system data

interface UserData {
  currentUser: {
    name: string
    email: string
    avatar: string
    role?: string
  }
  people: any[]
  isAuthenticated: boolean
  hasCompletedOnboarding: boolean
}

interface SystemData {
  isSystemConnected: boolean
  systemEvents: any[]
  isDoorLocked: boolean
}

const defaultUserData: UserData = {
  currentUser: {
    name: "",
    email: "",
    avatar: "",
    role: "",
  },
  people: [],
  isAuthenticated: false,
  hasCompletedOnboarding: false,
}

const defaultSystemData: SystemData = {
  isSystemConnected: false,
  systemEvents: [],
  isDoorLocked: true,
}

export default function Component() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [isDoorLocked, setIsDoorLocked] = useState(true)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAccessManagement, setShowAccessManagement] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPeoplePage, setShowPeoplePage] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showConnectSystem, setShowConnectSystem] = useState(false)
  const [showLockeyEffect, setShowLockeyEffect] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [showBiometricRegistration, setShowBiometricRegistration] = useState(false)
  const [biometricType, setBiometricType] = useState<"fingerprint" | "facial">("fingerprint")
  const [isSystemConnected, setIsSystemConnected] = useState(false)
  const [systemEvents, setSystemEvents] = useState<any[]>([])

  const [currentUser, setCurrentUser] = useState(defaultUserData.currentUser)
  const [people, setPeople] = useState(defaultUserData.people)

  const { toast } = useToast()

  // Check if current user is admin
  const isAdmin = currentUser.role === "Admin • Owner" || currentUser.email === "admin@lockey.com"

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem(STORAGE_KEY)
    if (savedUserData) {
      try {
        const userData: UserData = JSON.parse(savedUserData)
        setCurrentUser(userData.currentUser)
        setPeople(userData.people)
        setIsAuthenticated(userData.isAuthenticated)
        setHasCompletedOnboarding(userData.hasCompletedOnboarding || false)
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }
  }, [])

  // Load system data from localStorage on mount
  useEffect(() => {
    const savedSystemData = localStorage.getItem(SYSTEM_STORAGE_KEY)
    if (savedSystemData) {
      try {
        const systemData: SystemData = JSON.parse(savedSystemData)
        setIsSystemConnected(systemData.isSystemConnected || false)
        setSystemEvents(systemData.systemEvents || [])
        setIsDoorLocked(systemData.isDoorLocked !== undefined ? systemData.isDoorLocked : true)
      } catch (error) {
        console.error("Error loading system data:", error)
      }
    } else {
      // Initialize with default system event
      const initialEvent = {
        id: 1,
        action: "System Initialized",
        time: new Date().toLocaleString(),
        icon: Shield,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        type: "system",
      }
      setSystemEvents([initialEvent])
    }
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    const userData: UserData = {
      currentUser,
      people,
      isAuthenticated,
      hasCompletedOnboarding,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  }, [currentUser, people, isAuthenticated, hasCompletedOnboarding])

  // Save system data to localStorage whenever it changes
  useEffect(() => {
    const systemData: SystemData = {
      isSystemConnected,
      systemEvents,
      isDoorLocked,
    }
    localStorage.setItem(SYSTEM_STORAGE_KEY, JSON.stringify(systemData))
  }, [isSystemConnected, systemEvents, isDoorLocked])

  // Add system event helper
  const addSystemEvent = (action: string, icon: any, bgColor: string, iconColor: string, type = "system") => {
    const newEvent = {
      id: Date.now(),
      action,
      time: new Date().toLocaleString(),
      icon,
      bgColor,
      iconColor,
      type,
    }
    setSystemEvents((prev) => [newEvent, ...prev])
  }

  // Get recent activity including system events
  const recentActivity = systemEvents.slice(0, 5)

  // Show onboarding only for new signups who haven't completed it AND system is not connected
  useEffect(() => {
    if (isAuthenticated && !showLockeyEffect && isNewUser && !hasCompletedOnboarding && !isSystemConnected) {
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, showLockeyEffect, isNewUser, hasCompletedOnboarding, isSystemConnected])

  const handleDoorToggle = () => {
    if (!isSystemConnected) {
      toast({
        title: "System Not Connected",
        description: "Please connect your smart door system first",
      })
      return
    }

    setIsDoorLocked(!isDoorLocked)
    const action = isDoorLocked ? "Door Unlocked" : "Door Locked"
    const description = isDoorLocked ? "Front door has been unlocked" : "Front door has been locked"

    addSystemEvent(
      action,
      isDoorLocked ? Unlock : Lock,
      isDoorLocked ? "bg-red-50" : "bg-green-50",
      isDoorLocked ? "text-red-600" : "text-green-600",
      "door",
    )

    toast({
      title: action,
      description: description,
    })
  }

  const handleNavigation = (page: string) => {
    setActiveNav(page)

    // Close all dialogs first
    setShowPeoplePage(false)
    setShowSettings(false)
    setShowHistory(false)

    // Handle different page types
    switch (page) {
      case "People":
        setShowPeoplePage(true)
        break
      case "Settings":
        setShowSettings(true)
        break
      case "Activity Log":
        setShowHistory(true)
        break
      default:
        // Dashboard - all dialogs already closed
        break
    }
  }

  const handleSignOut = () => {
    setShowSignOutDialog(true)
  }

  const confirmSignOut = () => {
    setShowSignOutDialog(false)
    setShowLockeyEffect(true)
  }

  const handleAddPerson = (newPerson: any) => {
    // If not admin, automatically set as guest with limited access
    if (!isAdmin) {
      newPerson.role = "Guest"
      newPerson.status = "Limited"
      newPerson.statusColor = "bg-yellow-100 text-yellow-800"
    }

    const updatedPeople = [...people, newPerson]
    setPeople(updatedPeople)

    addSystemEvent(`${newPerson.name} added to system`, User, "bg-purple-50", "text-purple-600", "user")

    toast({
      title: "Person Added",
      description: `${newPerson.name} has been added to the system`,
    })
  }

  const handleEditProfile = () => {
    // Find current user in people array or create a profile for them
    const userProfile = people.find((p) => p.email === currentUser.email) || {
      id: Date.now(),
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role || "Admin • Owner",
      status: "Active",
      avatar: currentUser.avatar,
      statusColor: "bg-green-100 text-green-800",
      accessMethods: {
        fingerprint: false,
        facialRecognition: false,
      },
    }
    setSelectedPerson(userProfile)
    setShowEditProfile(true)
  }

  const handleEditPerson = (person: any) => {
    setSelectedPerson(person)
    setShowEditProfile(true)
  }

  const handleSaveProfile = (updatedPerson: any) => {
    // If editing current user, update current user state
    if (updatedPerson.email === currentUser.email) {
      setCurrentUser({
        ...currentUser,
        name: updatedPerson.name,
        avatar: updatedPerson.avatar,
      })
    }

    const updatedPeople = people.map((p) => (p.id === updatedPerson.id ? updatedPerson : p))
    setPeople(updatedPeople)
    toast({
      title: "Profile Updated",
      description: `${updatedPerson.name}'s profile has been updated`,
    })
  }

  const handleDeletePerson = (personId: number) => {
    try {
      const personToDelete = people.find((p) => p.id === personId)
      if (!personToDelete) {
        toast({
          title: "Error",
          description: "Person not found",
        })
        return
      }

      // Prevent deleting yourself
      if (personToDelete.email === currentUser.email) {
        toast({
          title: "Cannot Delete",
          description: "You cannot delete your own account",
        })
        return
      }

      // Prevent guests from deleting other users
      if (!isAdmin) {
        toast({
          title: "Permission Denied",
          description: "Only administrators can remove other users",
        })
        return
      }

      // Use functional update to prevent state issues
      setPeople((prevPeople) => {
        const updatedPeople = prevPeople.filter((p) => p.id !== personId)

        // Add system event
        setTimeout(() => {
          addSystemEvent(`${personToDelete.name} removed from system`, User, "bg-red-50", "text-red-600", "user")
        }, 0)

        return updatedPeople
      })

      toast({
        title: "Access Removed",
        description: `${personToDelete.name}'s access has been removed`,
      })
    } catch (error) {
      console.error("Error removing person:", error)
      toast({
        title: "Error",
        description: "There was an error removing this person. Please try again.",
      })
    }
  }

  const handleViewHistory = () => {
    setShowHistory(true)
  }

  const handleManageAccessGeneral = () => {
    setShowAccessManagement(true)
  }

  const handleViewAllActivity = () => {
    setShowHistory(true)
  }

  const handleManageAllPeople = () => {
    setShowPeoplePage(true)
  }

  const handleLogin = (email: string, password: string) => {
    // Demo credentials for testing
    if (email === "admin@lockey.com" && password === "admin123") {
      const adminUser = {
        name: "Admin User",
        email: "admin@lockey.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Admin • Owner",
      }

      setCurrentUser(adminUser)
      setIsNewUser(false)
      setHasCompletedOnboarding(true)
      addSystemEvent("Admin signed in", User, "bg-green-50", "text-green-600", "auth")
      setShowLockeyEffect(true)
      return
    }

    // Check for existing user
    const existingUser = people.find((p) => p.email === email)

    if (existingUser) {
      // Existing user login
      setCurrentUser({
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar,
        role: existingUser.role,
      })
      setIsNewUser(false)

      // If system is already connected, user doesn't need onboarding
      if (isSystemConnected) {
        setHasCompletedOnboarding(true)
      } else {
        // Check if any admin has completed onboarding
        const hasAdminUser = people.some((p) => p.role === "Admin • Owner")
        setHasCompletedOnboarding(hasAdminUser)
      }

      addSystemEvent(`${existingUser.name} signed in`, User, "bg-green-50", "text-green-600", "auth")
      setShowLockeyEffect(true)
    } else {
      // User not found
      toast({
        title: "Login Failed",
        description: "No account found with this email. Please sign up first or check your credentials.",
      })
    }
  }

  const handleSignUp = (name: string, email: string, password: string) => {
    const existingUser = people.find((p) => p.email === email)

    if (existingUser) {
      toast({
        title: "Account Exists",
        description: "An account with this email already exists. Please sign in instead.",
      })
      setShowSignUp(false)
      return
    }

    // Check if this is the first user (admin) or a subsequent user (guest)
    const isFirstUser = people.length === 0
    const role = isFirstUser ? "Admin • Owner" : "Guest"
    const status = isFirstUser ? "Active" : "Limited"
    const statusColor = isFirstUser ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"

    const newUser = {
      name: name,
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
      role: role,
    }

    const newPerson = {
      id: Date.now(),
      name: name,
      role: role,
      status: status,
      avatar: "/placeholder.svg?height=40&width=40",
      statusColor: statusColor,
      email: email,
      accessMethods: {
        fingerprint: false,
        facialRecognition: false,
      },
      permissions: {
        doorControl: true,
        viewHistory: false,
        manageUsers: isFirstUser,
        systemSettings: isFirstUser,
      },
    }

    setPeople((prev) => [...prev, newPerson])
    setCurrentUser(newUser)

    // If system is already connected, new users don't need onboarding
    if (isSystemConnected) {
      setIsNewUser(false)
      setHasCompletedOnboarding(true)
    } else {
      setIsNewUser(true)
      setHasCompletedOnboarding(false)
    }

    addSystemEvent(`${name} created account`, User, "bg-blue-50", "text-blue-600", "auth")
    setShowLockeyEffect(true)
  }

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset instructions have been sent to your email",
    })
  }

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLockeyComplete = () => {
    setShowLockeyEffect(false)
    if (!isAuthenticated) {
      setIsAuthenticated(true)
    } else {
      // Sign out - only clear user data, not system data
      setIsAuthenticated(false)
      setCurrentUser({ name: "", email: "", avatar: "", role: "" })
      setIsNewUser(false)
      setHasCompletedOnboarding(false)
      // Don't reset system connection status on sign out
    }
  }

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true)
    setShowOnboarding(false)
    toast({
      title: "Welcome to Lockey!",
      description: "Your smart door system is ready to use",
    })
  }

  const handleOnboardingConnectSystem = () => {
    setShowOnboarding(false)
    setShowConnectSystem(true)
  }

  const handleOnboardingAddPerson = () => {
    setShowOnboarding(false)
    setShowAddPerson(true)
  }

  const handleOnboardingBiometric = (type: "fingerprint" | "facial") => {
    setBiometricType(type)
    setShowOnboarding(false)
    setShowBiometricRegistration(true)
  }

  const handleBiometricComplete = () => {
    setShowBiometricRegistration(false)
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
    toast({
      title: "Biometric Setup Complete",
      description: `${biometricType === "fingerprint" ? "Fingerprint" : "Facial"} recognition has been configured`,
    })
  }

  const handleShowUserGuide = () => {
    setShowOnboarding(true)
  }

  // Show Lockey effect
  if (showLockeyEffect) {
    return <LockeyTextEffect onComplete={handleLockeyComplete} />
  }

  // If not authenticated, show login or signup
  if (!isAuthenticated) {
    return showSignUp ? (
      <SignUpPage onSignUp={handleSignUp} onLogin={() => setShowSignUp(false)} />
    ) : (
      <LoginPage onLogin={handleLogin} onSignUp={() => setShowSignUp(true)} onForgotPassword={handleForgotPassword} />
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeNav={activeNav}
        onNavigate={handleNavigation}
        onSignOut={handleSignOut}
        onEditProfile={handleEditProfile}
        currentUser={currentUser}
      />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!hasCompletedOnboarding && !isSystemConnected && (
                <Button variant="outline" size="sm" onClick={() => setShowOnboarding(true)}>
                  Setup Guide
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isSystemConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-muted-foreground">
                  {isSystemConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Door Status Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Front Door</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Last activity: Today, 10:23 AM</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Badge
                  variant="secondary"
                  className={`w-fit ${isDoorLocked ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}
                >
                  {isDoorLocked ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                  {isDoorLocked ? "Locked" : "Unlocked"}
                </Badge>
                <Button
                  className={`w-full sm:w-auto ${
                    !isSystemConnected
                      ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      : isDoorLocked
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={handleDoorToggle}
                  disabled={!isSystemConnected}
                >
                  {!isSystemConnected ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      System Disconnected
                    </>
                  ) : isDoorLocked ? (
                    "Unlock Door"
                  ) : (
                    "Lock Door"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  onClick={() => setShowCamera(true)}
                >
                  <Camera className="w-4 h-4" />
                  <span>View Camera</span>
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                    onClick={handleManageAccessGeneral}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Manage Access</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${activity.bgColor} flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
                <Button variant="link" className="mt-4 p-0 h-auto text-blue-600" onClick={handleViewAllActivity}>
                  View all activity
                </Button>
              </CardContent>
            </Card>

            {/* People */}
            <Card>
              <CardHeader>
                <CardTitle>People</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {people.slice(0, 5).map((person) => (
                    <div key={person.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                          <AvatarFallback>
                            {person.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge variant="secondary" className={`${person.statusColor} text-xs`}>
                          {person.status}
                        </Badge>
                        <PersonMenu
                          person={person}
                          onEdit={handleEditPerson}
                          onDelete={handleDeletePerson}
                          currentUser={currentUser}
                          isAdmin={isAdmin}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 p-0 h-auto text-blue-600" onClick={handleManageAllPeople}>
                  Manage all people
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>

      {/* Dialogs */}
      <OnboardingFlow
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
        onConnectSystem={handleOnboardingConnectSystem}
        onAddPerson={handleOnboardingAddPerson}
        onSetupBiometric={handleOnboardingBiometric}
        currentUser={currentUser}
      />
      <AddPersonDialog
        open={showAddPerson}
        onOpenChange={setShowAddPerson}
        onAddPerson={handleAddPerson}
        currentUser={currentUser}
      />
      <PeoplePage
        open={showPeoplePage}
        onOpenChange={setShowPeoplePage}
        people={people}
        onAddPerson={() => setShowAddPerson(true)}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />
      <CameraView open={showCamera} onOpenChange={setShowCamera} />
      <HistoryView open={showHistory} onOpenChange={setShowHistory} systemEvents={systemEvents} />
      <AccessManagement open={showAccessManagement} onOpenChange={setShowAccessManagement} />
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        onToggleDarkMode={handleToggleDarkMode}
        isDarkMode={isDarkMode}
        onShowUserGuide={handleShowUserGuide}
      />
      <EditProfileDialog
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        person={selectedPerson}
        onSave={handleSaveProfile}
        currentUser={currentUser}
      />
      <SignOutDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog} onConfirm={confirmSignOut} />
      <ConnectSystemDialog
        open={showConnectSystem}
        onOpenChange={setShowConnectSystem}
        onConnected={() => {
          setIsSystemConnected(true)
          addSystemEvent("Smart door system connected", Shield, "bg-green-50", "text-green-600", "system")
          toast({
            title: "System Connected",
            description: "Your smart door system is now connected and ready to use",
          })
          if (!hasCompletedOnboarding) {
            setShowOnboarding(true)
          }
        }}
      />
      <BiometricRegistration
        open={showBiometricRegistration}
        onOpenChange={setShowBiometricRegistration}
        type={biometricType}
        onComplete={handleBiometricComplete}
      />
    </SidebarProvider>
  )
}
