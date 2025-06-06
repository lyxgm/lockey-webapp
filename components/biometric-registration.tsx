"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Fingerprint, User, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface BiometricRegistrationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "fingerprint" | "facial"
  onComplete: () => void
}

export function BiometricRegistration({ open, onOpenChange, type, onComplete }: BiometricRegistrationProps) {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [scanCount, setScanCount] = useState(0)

  const handleStartScan = async () => {
    if (type === "facial" && scanCount === 0) {
      try {
        // Request camera permission for facial recognition
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop()) // Stop immediately after permission check

        toast({
          title: "Camera Access Granted",
          description: "Starting facial recognition setup...",
        })
      } catch (error) {
        toast({
          title: "Camera Permission Required",
          description: "Please allow camera access for facial recognition setup.",
        })
        return
      }
    }

    setIsScanning(true)
    setProgress(0)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)

          // Check if we need a second scan
          if (scanCount < 1) {
            setScanCount(scanCount + 1)
            setStep(2)
            return 0
          } else {
            setIsComplete(true)
            setTimeout(() => {
              onComplete()
              onOpenChange(false)
              // Reset state for next use
              setStep(1)
              setProgress(0)
              setIsComplete(false)
              setScanCount(0)
            }, 2000)
            return 100
          }
        }
        return prev + 10
      })
    }, 300)
  }

  const Icon = type === "fingerprint" ? Fingerprint : User
  const title = type === "fingerprint" ? "Fingerprint Registration" : "Facial Recognition Setup"

  const getDescription = () => {
    if (scanCount === 0) {
      return type === "fingerprint"
        ? "Place your finger on the sensor to register your fingerprint"
        : "Position your face in the camera frame to register facial recognition"
    } else {
      return type === "fingerprint"
        ? "Place your finger on the sensor again to verify"
        : "Position your face in the camera frame again to verify"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isComplete ? (
            <>
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${type === "fingerprint" ? "bg-green-100" : "bg-purple-100"}`}>
                      <Icon className={`h-12 w-12 ${type === "fingerprint" ? "text-green-600" : "text-purple-600"}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">
                    {title} - Scan {scanCount + 1} of 2
                  </CardTitle>
                  <CardDescription>{getDescription()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isScanning ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm font-medium mb-2">Scanning in progress...</p>
                        <Progress value={progress} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                      </div>

                      {type === "fingerprint" ? (
                        <div className="text-center space-y-2">
                          <div className="w-24 h-24 mx-auto border-2 border-green-300 rounded-full flex items-center justify-center bg-green-50">
                            <Fingerprint className="h-12 w-12 text-green-600 animate-pulse" />
                          </div>
                          <p className="text-sm text-muted-foreground">Keep your finger on the sensor</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-32 h-24 mx-auto border-2 border-purple-300 rounded-lg flex items-center justify-center bg-purple-50">
                            <User className="h-12 w-12 text-purple-600 animate-pulse" />
                          </div>
                          <p className="text-sm text-muted-foreground">Look directly at the camera</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      {type === "fingerprint" ? (
                        <div className="space-y-2">
                          <div className="w-24 h-24 mx-auto border-2 border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
                            <Fingerprint className="h-12 w-12 text-gray-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Instructions:</p>
                            <p className="text-xs text-muted-foreground">1. Clean your finger</p>
                            <p className="text-xs text-muted-foreground">2. Place finger firmly on sensor</p>
                            <p className="text-xs text-muted-foreground">3. Hold still during scanning</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-32 h-24 mx-auto border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                            <User className="h-12 w-12 text-gray-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Instructions:</p>
                            <p className="text-xs text-muted-foreground">1. Look directly at camera</p>
                            <p className="text-xs text-muted-foreground">2. Keep face centered in frame</p>
                            <p className="text-xs text-muted-foreground">3. Maintain good lighting</p>
                          </div>
                        </div>
                      )}

                      <Button onClick={handleStartScan} className="w-full">
                        Start {scanCount === 0 ? "First" : "Second"} {type === "fingerprint" ? "Fingerprint" : "Facial"}{" "}
                        Scan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-green-200">
              <CardContent className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-green-100">
                    <Check className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Registration Complete!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your {type === "fingerprint" ? "fingerprint" : "facial recognition"} has been successfully registered.
                </p>
                <div className="w-32 h-32 mx-auto border-2 border-green-300 rounded-full flex items-center justify-center bg-green-50">
                  {type === "fingerprint" ? (
                    <Fingerprint className="h-16 w-16 text-green-600" />
                  ) : (
                    <User className="h-16 w-16 text-green-600" />
                  )}
                  <Check className="absolute h-8 w-8 text-green-600 bg-white rounded-full p-1 border-2 border-green-300 bottom-0 right-0" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
