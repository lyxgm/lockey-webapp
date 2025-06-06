"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { BiometricRegistration } from "./biometric-registration"
import { CalendarIcon, Upload, User, Shield, Clock, Fingerprint } from "lucide-react"
import { format } from "date-fns"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: any
  onSave: (updatedPerson: any) => void
  currentUser: {
    role?: string
    email: string
  }
}

export function EditProfileDialog({ open, onOpenChange, person, onSave, currentUser }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: person?.name || "",
    email: person?.email || "",
    role: person?.role || "",
    avatar: person?.avatar || "",
  })

  const [accessMethods, setAccessMethods] = useState({
    fingerprint: person?.accessMethods?.fingerprint || false,
    facialRecognition: person?.accessMethods?.facialRecognition || false,
  })

  const [permissions, setPermissions] = useState({
    doorControl: person?.permissions?.doorControl || true,
    viewHistory: person?.permissions?.viewHistory || false,
    manageUsers: person?.permissions?.manageUsers || false,
    systemSettings: person?.permissions?.systemSettings || false,
  })

  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    person?.expiryDate ? new Date(person.expiryDate) : undefined,
  )
  const [showBiometricRegistration, setShowBiometricRegistration] = useState(false)
  const [registrationType, setRegistrationType] = useState<"fingerprint" | "facial">("fingerprint")

  // Check if current user is admin and if they're editing themselves
  const isAdmin = currentUser.role === "Admin • Owner" || currentUser.email === "admin@lockey.com"
  const isEditingSelf = person?.email === currentUser.email
  const canEditRole = isAdmin && !isEditingSelf
  const canEditPermissions = isAdmin && !isEditingSelf
  const canEditAccessUntil = isAdmin && !isEditingSelf && person?.status === "Limited"

  // Update form data when person changes
  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || "",
        email: person.email || "",
        role: person.role || "",
        avatar: person.avatar || "",
      })

      setAccessMethods({
        fingerprint: person.accessMethods?.fingerprint || false,
        facialRecognition: person.accessMethods?.facialRecognition || false,
      })

      setPermissions({
        doorControl: person.permissions?.doorControl || true,
        viewHistory: person.permissions?.viewHistory || false,
        manageUsers: person.permissions?.manageUsers || false,
        systemSettings: person.permissions?.systemSettings || false,
      })

      setExpiryDate(person.expiryDate ? new Date(person.expiryDate) : undefined)
    }
  }, [person])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.role) {
      const updatedPerson = {
        ...person,
        ...formData,
        accessMethods,
        permissions: canEditPermissions ? permissions : person.permissions,
        expiryDate: canEditAccessUntil ? expiryDate : person.expiryDate,
      }
      onSave(updatedPerson)
      onOpenChange(false)
    }
  }

  const toggleAccessMethod = (method: keyof typeof accessMethods) => {
    const newValue = !accessMethods[method]
    setAccessMethods({
      ...accessMethods,
      [method]: newValue,
    })

    // Show registration dialog if enabling new access method
    if (newValue) {
      setRegistrationType(method)
      setShowBiometricRegistration(true)
    }
  }

  const togglePermission = (permission: keyof typeof permissions) => {
    if (!canEditPermissions) return
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission],
    })
  }

  const handleRegistrationComplete = () => {
    setShowBiometricRegistration(false)
  }

  if (!person) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile - {person.name}</DialogTitle>
            <DialogDescription>Update profile information, access methods, and permissions.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="profile" className="space-y-4">
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
                      onClick={() => {
                        alert("Photo upload functionality would be implemented here")
                      }}
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
                    disabled={!isEditingSelf}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  {canEditRole ? (
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin • Owner">Admin • Owner</SelectItem>
                        <SelectItem value="Family Member">Family Member</SelectItem>
                        <SelectItem value="Guest">Guest</SelectItem>
                        <SelectItem value="Neighbor">Neighbor</SelectItem>
                        <SelectItem value="Service Provider">Service Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="col-span-3">
                      <Input value={formData.role} disabled />
                      {!isAdmin && (
                        <p className="text-xs text-muted-foreground mt-1">Only administrators can change user roles</p>
                      )}
                    </div>
                  )}
                </div>

                {canEditAccessUntil && (
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
              </TabsContent>

              <TabsContent value="access" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Access Methods</CardTitle>
                    <CardDescription>Configure how this person can access the door</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-green-50">
                          <Fingerprint className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Fingerprint Access</p>
                          <p className="text-sm text-muted-foreground">Use fingerprint to unlock the door</p>
                        </div>
                      </div>
                      <Switch
                        checked={accessMethods.fingerprint}
                        onCheckedChange={() => toggleAccessMethod("fingerprint")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-purple-50">
                          <User className="h-5 w-5 text-purple-600" />
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
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Permissions</CardTitle>
                    <CardDescription>
                      {canEditPermissions
                        ? "Control what this person can do in the system"
                        : "View system permissions (only administrators can modify these)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-blue-50">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Door Control</p>
                          <p className="text-sm text-muted-foreground">Can lock/unlock the door remotely</p>
                        </div>
                      </div>
                      <Switch
                        checked={permissions.doorControl}
                        onCheckedChange={() => togglePermission("doorControl")}
                        disabled={!canEditPermissions}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-green-50">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">View History</p>
                          <p className="text-sm text-muted-foreground">Can view access history and logs</p>
                        </div>
                      </div>
                      <Switch
                        checked={permissions.viewHistory}
                        onCheckedChange={() => togglePermission("viewHistory")}
                        disabled={!canEditPermissions}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-purple-50">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Manage Users</p>
                          <p className="text-sm text-muted-foreground">Can add/remove other users</p>
                        </div>
                      </div>
                      <Switch
                        checked={permissions.manageUsers}
                        onCheckedChange={() => togglePermission("manageUsers")}
                        disabled={!canEditPermissions}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-red-50">
                          <Shield className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">System Settings</p>
                          <p className="text-sm text-muted-foreground">Can modify system configuration</p>
                        </div>
                      </div>
                      <Switch
                        checked={permissions.systemSettings}
                        onCheckedChange={() => togglePermission("systemSettings")}
                        disabled={!canEditPermissions}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Tabs>
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
