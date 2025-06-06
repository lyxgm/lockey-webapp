"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PersonMenu } from "./person-menu"
import { Search, Plus } from "lucide-react"

interface PeoplePageProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  people: any[]
  onAddPerson: () => void
  onEditPerson: (person: any) => void
  onDeletePerson: (personId: number) => void
}

export function PeoplePage({ open, onOpenChange, people, onAddPerson, onEditPerson, onDeletePerson }: PeoplePageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">People Management</DialogTitle>
            <Button onClick={onAddPerson}>
              <Plus className="h-4 w-4 mr-2" />
              Add Person
            </Button>
          </div>
        </DialogHeader>

        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                      <AvatarFallback>
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.email}</p>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                      {person.expiryDate && (
                        <p className="text-xs text-yellow-600">
                          Access until: {person.expiryDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {person.accessMethods.fingerprint && (
                        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                          Fingerprint
                        </Badge>
                      )}
                      {person.accessMethods.facialRecognition && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                          Facial
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className={person.statusColor}>
                      {person.status}
                    </Badge>
                    <PersonMenu person={person} onEdit={onEditPerson} onDelete={onDeletePerson} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No people found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
