"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Fingerprint, Shield } from "lucide-react"

interface AccessManagementProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessManagement({ open, onOpenChange }: AccessManagementProps) {
  const [accessMethods, setAccessMethods] = useState({
    fingerprint: true,
    facialRecognition: true,
  })

  const toggleAccessMethod = (method: keyof typeof accessMethods) => {
    setAccessMethods({
      ...accessMethods,
      [method]: !accessMethods[method],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Access Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access Methods</CardTitle>
              <CardDescription>Enable or disable different ways to access your door</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-green-50">
                    <Fingerprint className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fingerprint Access</p>
                    <p className="text-sm text-muted-foreground">Use your fingerprint to unlock the door</p>
                  </div>
                </div>
                <Switch checked={accessMethods.fingerprint} onCheckedChange={() => toggleAccessMethod("fingerprint")} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-purple-50">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Facial Recognition</p>
                    <p className="text-sm text-muted-foreground">Use facial recognition to unlock the door</p>
                  </div>
                </div>
                <Switch
                  checked={accessMethods.facialRecognition}
                  onCheckedChange={() => toggleAccessMethod("facialRecognition")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
