"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Wifi, Check, AlertCircle, Loader2 } from "lucide-react"

interface ConnectSystemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnected: () => void
}

export function ConnectSystemDialog({ open, onOpenChange, onConnected }: ConnectSystemDialogProps) {
  const [step, setStep] = useState(1)
  const [deviceId, setDeviceId] = useState("")
  const [wifiName, setWifiName] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle")

  const handleConnect = () => {
    if (step === 1 && deviceId) {
      setStep(2)
      return
    }

    if (step === 2 && wifiName && wifiPassword) {
      setIsConnecting(true)
      setConnectionStatus("connecting")

      // Simulate connection process
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        setConnectionProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          setConnectionStatus("success")
          setIsConnecting(false)
          setTimeout(() => {
            onConnected()
            onOpenChange(false)
          }, 1500)
        }
      }, 200)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Prevent closing during connection
        if (connectionStatus === "connecting") return
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect to Smart Door System</DialogTitle>
          <DialogDescription>Connect your app to your smart door lock system</DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Wifi className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="device-id">Device ID</Label>
              <Input
                id="device-id"
                placeholder="Enter the device ID from your smart lock"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find the device ID on the back of your smart lock or on the packaging
              </p>
            </div>

            <Button className="w-full" onClick={handleConnect} disabled={!deviceId}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-name">Wi-Fi Network</Label>
              <Input
                id="wifi-name"
                placeholder="Enter your Wi-Fi network name"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wifi-password">Wi-Fi Password</Label>
              <Input
                id="wifi-password"
                type="password"
                placeholder="Enter your Wi-Fi password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
              />
            </div>

            {connectionStatus === "idle" && (
              <Button className="w-full" onClick={handleConnect} disabled={!wifiName || !wifiPassword}>
                Connect Device
              </Button>
            )}

            {connectionStatus === "connecting" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
                <Progress value={connectionProgress} className="h-2" />
                <p className="text-center text-sm">Connecting to your smart door system...</p>
              </div>
            )}

            {connectionStatus === "success" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-2 rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-center text-sm font-medium">Successfully connected to your smart door system!</p>
                <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                  <Check className="h-4 w-4 mr-2" />
                  Successfully Connected
                </Button>
              </div>
            )}

            {connectionStatus === "error" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-2 rounded-full bg-red-100">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <p className="text-center text-sm">Failed to connect. Please check your credentials and try again.</p>
                <Button variant="outline" className="w-full" onClick={() => setConnectionStatus("idle")}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
