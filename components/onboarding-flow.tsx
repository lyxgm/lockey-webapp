"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Smartphone,
  Users,
  Bell,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Fingerprint,
  User,
  Camera,
  Lock,
  Wifi,
  Settings,
} from "lucide-react"

interface OnboardingFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  onConnectSystem: () => void
  onAddPerson: () => void
  onSetupBiometric: (type: "fingerprint" | "facial") => void
  currentUser: {
    name: string
    email: string
  }
}

export function OnboardingFlow({
  open,
  onOpenChange,
  onComplete,
  onConnectSystem,
  onAddPerson,
  onSetupBiometric,
  currentUser,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      id: 0,
      title: "Welcome to Lockey!",
      description: "Let's get you started with your smart door security system",
      content: "welcome",
    },
    {
      id: 1,
      title: "Connect Your Smart Door",
      description: "Link your physical smart lock to the Lockey app",
      content: "connect",
    },
    {
      id: 2,
      title: "Set Up Biometric Access",
      description: "Configure fingerprint and facial recognition for secure access",
      content: "biometric",
    },
    {
      id: 3,
      title: "Add Family Members",
      description: "Give access to family members and trusted individuals",
      content: "users",
    },
    {
      id: 4,
      title: "Configure Notifications",
      description: "Stay informed about door activity and security events",
      content: "notifications",
    },
    {
      id: 5,
      title: "You're All Set!",
      description: "Your smart door system is ready to use",
      content: "complete",
    },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepAction = (action: string) => {
    switch (action) {
      case "connect":
        onConnectSystem()
        markStepCompleted(1)
        break
      case "fingerprint":
        onSetupBiometric("fingerprint")
        markStepCompleted(2)
        break
      case "facial":
        onSetupBiometric("facial")
        markStepCompleted(2)
        break
      case "addPerson":
        onAddPerson()
        markStepCompleted(3)
        break
      case "complete":
        onComplete()
        onOpenChange(false)
        break
    }
  }

  const markStepCompleted = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const handleSkip = () => {
    onComplete()
    onOpenChange(false)
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.content) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Lockey, {currentUser.name}!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                You've successfully created your account. Let's set up your smart door security system in just a few
                simple steps.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Access</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Smartphone className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Remote Control</p>
              </div>
            </div>
          </div>
        )

      case "connect":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Wifi className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Smart Door Lock</h3>
              <p className="text-gray-600 mb-4">Connect your physical smart lock to start controlling it remotely</p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">1</span>
                    </div>
                    <p className="text-sm">Find the device ID on your smart lock</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">2</span>
                    </div>
                    <p className="text-sm">Enter your Wi-Fi credentials</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">3</span>
                    </div>
                    <p className="text-sm">Complete the pairing process</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => handleStepAction("connect")}>
              Connect Smart Door Lock
            </Button>
          </div>
        )

      case "biometric":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100">
                  <Fingerprint className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Set Up Biometric Access</h3>
              <p className="text-gray-600 mb-4">Configure secure biometric authentication for keyless entry</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStepAction("fingerprint")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-green-50">
                      <Fingerprint className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Fingerprint Recognition</h4>
                      <p className="text-sm text-gray-600">Quick and secure access with your fingerprint</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStepAction("facial")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-purple-50">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Facial Recognition</h4>
                      <p className="text-sm text-gray-600">Hands-free access with facial recognition</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-gray-500 text-center">
              You can set up both methods for maximum convenience and security
            </p>
          </div>
        )

      case "users":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Add Family Members</h3>
              <p className="text-gray-600 mb-4">Give secure access to family members and trusted individuals</p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{currentUser.name}</p>
                        <p className="text-sm text-gray-600">Admin • Owner</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">You</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="font-medium">Who can you add?</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Family members with full access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Guests with temporary access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Service providers with scheduled access</span>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => handleStepAction("addPerson")}>
              Add Your First Family Member
            </Button>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Bell className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Stay Informed</h3>
              <p className="text-gray-600 mb-4">Configure notifications to stay updated on door activity</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-green-50">
                          <Lock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Door Activity</p>
                          <p className="text-sm text-gray-600">Lock/unlock notifications</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Enabled
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-red-50">
                          <Shield className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Security Alerts</p>
                          <p className="text-sm text-gray-600">Failed access attempts</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Enabled
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-blue-50">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">New Access</p>
                          <p className="text-sm text-gray-600">When new users are added</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Enabled
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-gray-500 text-center">
                You can customize these settings later in the Settings page
              </p>
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your Lockey smart door system is now configured and ready to use. Enjoy secure, convenient access to
                your home!
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h4 className="font-medium">What's next?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <span>View your door camera feed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>Manage user access and permissions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span>Customize your security settings</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-green-600 font-medium">Welcome to Lockey!</p>
              <p className="text-sm text-gray-600 mt-1">Your smart door system is ready to use</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">Setup Guide</h1>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip} className="text-gray-500 hover:text-gray-700">
                Skip Setup
              </Button>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{steps[currentStep].title}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">{renderStepContent()}</div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="flex items-center space-x-2">
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => handleStepAction("complete")} className="bg-green-600 hover:bg-green-700">
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
