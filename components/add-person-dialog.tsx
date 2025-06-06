"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BiometricRegistration } from "./biometric-registration"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface AddPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPerson: (person: any) => void
  currentUser: {
    name: string
    email: string
    role?: string
  }
}

export function AddPersonDialog({ open, onOpenChange, onAddPerson, currentUser }: AddPersonDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    accessLevel: "",
    avatar: "",
  })

  const [accessMethods, setAccessMethods] = useState({
    fingerprint: false,
    facialRecognition: false,
  })

  const [showBiometricRegistration, setShowBiometricRegistration] = useState(false)
  const [registrationType, setRegistrationType] = useState<"fingerprint" | "facial">("fingerprint")
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)

  // Check if current user is admin
  const isAdmin = currentUser.role === "Admin • Owner" || currentUser.email === "admin@lockey.com"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      const newPerson = {
        id: Date.now(),
        name: formData.name,
        role: isAdmin ? formData.role || "Guest" : "Guest",
        status: isAdmin && formData.accessLevel === "limited" ? "Limited" : "Active",
        avatar: formData.avatar || "/placeholder.svg?height=40&width=40",
        statusColor:
          isAdmin && formData.accessLevel === "limited"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800",
        email: formData.email,
        accessMethods,
        expiryDate: isAdmin && formData.accessLevel === "limited" ? expiryDate : null,
      }
      onAddPerson(newPerson)
      setFormData({ name: "", email: "", role: "", accessLevel: "", avatar: "" })
      setAccessMethods({ fingerprint: false, facialRecognition: false })
      setExpiryDate(undefined)
      onOpenChange(false)
    }
  }

  const toggleAccessMethod = (method: keyof typeof accessMethods) => {
    const newValue = !accessMethods[method]
    setAccessMethods({
      ...accessMethods,
      [method]: newValue,
    })

    if (newValue) {
      setRegistrationType(method)
      setShowBiometricRegistration(true)
    }
  }

  const handleRegistrationComplete = () => {
    setShowBiometricRegistration(false)
  }

  const handlePhotoUpload = async () => {
    try {
      // Request camera/gallery permissions
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop()) // Stop the stream immediately

        // Show options for camera or gallery
        const choice = window.confirm("Choose photo source:\nOK for Camera\nCancel for Gallery")

        if (choice) {
          // Camera option
          toast({
            title: "Camera Access",
            description: "Camera functionality would open here",
          })
        } else {
          // Gallery option
          const input = document.createElement("input")
          input.type = "file"
          input.accept = "image/*"
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                setFormData({ ...formData, avatar: e.target?.result as string })
              }
              reader.readAsDataURL(file)
            }
          }
          input.click()
        }
      } else {
        // Fallback to gallery only
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
              setFormData({ ...formData, avatar: e.target?.result as string })
            }
            reader.readAsDataURL(file)
          }
        }
        input.click()
      }
    } catch (error) {
      toast({
        title: "Permission Denied",
        description: "Camera access denied. Using gallery instead.",
      })
      // Fallback to gallery
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setFormData({ ...formData, avatar: e.target?.result as string })
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Person</DialogTitle>
            <DialogDescription>Add a new person to your smart door access system.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {formData.name
                        ? formData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    onClick={handlePhotoUpload}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {isAdmin ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Family Member">Family Member</SelectItem>
                        <SelectItem value="Guest">Guest</SelectItem>
                        <SelectItem value="Neighbor">Neighbor</SelectItem>
                        <SelectItem value="Service Provider">Service Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="access" className="text-right">
                      Access
                    </Label>
                    <Select
                      value={formData.accessLevel}
                      onValueChange={(value) => setFormData({ ...formData, accessLevel: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Access</SelectItem>
                        <SelectItem value="limited">Limited Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.accessLevel === "limited" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expiry" className="text-right">
                        Access Until
                      </Label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={expiryDate}
                              onSelect={setExpiryDate}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full">
                  <p className="text-sm text-muted-foreground">
                    Only administrators can assign roles and access levels. This person will be added as a Guest with
                    Limited access.
                  </p>
                </div>
              )}

              <div className="col-span-full">
                <h3 className="font-medium mb-2">Access Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fingerprint"
                      checked={accessMethods.fingerprint}
                      onCheckedChange={() => toggleAccessMethod("fingerprint")}
                    />
                    <Label htmlFor="fingerprint">Fingerprint Access</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="facial"
                      checked={accessMethods.facialRecognition}
                      onCheckedChange={() => toggleAccessMethod("facialRecognition")}
                    />
                    <Label htmlFor="facial">Facial Recognition</Label>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="col-span-full">
                  <h3 className="font-medium mb-2">Permissions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="door-control" defaultChecked />
                      <Label htmlFor="door-control">Door Control - Can lock/unlock remotely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="view-history" />
                      <Label htmlFor="view-history">View History - Can view access logs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="manage-users" />
                      <Label htmlFor="manage-users">Manage Users - Can add/remove people</Label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Person</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <BiometricRegistration
        open={showBiometricRegistration}
        onOpenChange={setShowBiometricRegistration}
        type={registrationType}
        onComplete={handleRegistrationComplete}
      />
    </>
  )
}
