"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search, Download, CheckCircle, XCircle, User, Fingerprint } from "lucide-react"
import { format } from "date-fns"

interface HistoryViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  systemEvents?: any[]
}

export function HistoryView({ open, onOpenChange, systemEvents = [] }: HistoryViewProps) {
  const [activeTab, setActiveTab] = useState("visitors")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterMethod, setFilterMethod] = useState<string>("all")

  // AI-detected visitors from audio-to-text feature
  const visitorHistory = [
    {
      id: 1,
      name: "John Delivery",
      purpose: "Amazon package delivery",
      time: "Today, 2:15 PM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      method: "AI Detection",
      audioTranscript: "Hi, I have an Amazon delivery for Emma Thompson",
    },
    {
      id: 2,
      name: "Sarah Martinez",
      purpose: "Visiting friend Emma",
      time: "Today, 11:30 AM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      method: "AI Detection",
      audioTranscript: "Hello, I'm here to visit Emma Thompson",
    },
    {
      id: 3,
      name: "Mike Plumber",
      purpose: "Scheduled plumbing repair",
      time: "Yesterday, 3:45 PM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      method: "AI Detection",
      audioTranscript: "Hi, I'm Mike from ABC Plumbing, here for the scheduled repair",
    },
    {
      id: 4,
      name: "Unknown Visitor",
      purpose: "Unclear purpose",
      time: "Yesterday, 8:20 PM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: false,
      method: "AI Detection",
      audioTranscript: "Mumbled speech - could not identify clearly",
    },
    {
      id: 5,
      name: "Delivery Person",
      purpose: "Food delivery",
      time: "Yesterday, 7:30 PM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      method: "AI Detection",
      audioTranscript: "Food delivery for apartment 3B",
    },
  ]

  // Combine system events with authenticated access history
  const accessHistory = [
    ...systemEvents.map((event) => ({
      id: event.id,
      name: event.type === "auth" ? event.action.split(" ")[0] : "System",
      method:
        event.type === "system"
          ? "System Event"
          : event.type === "auth"
            ? "User Authentication"
            : event.type === "door"
              ? "Door Control"
              : event.type === "user"
                ? "User Management"
                : "System",
      time: event.time,
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      icon: event.icon,
    })),
    {
      id: 1001,
      name: "Emma Thompson",
      method: "Facial recognition",
      time: "Today, 10:23 AM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      icon: User,
    },
    {
      id: 1002,
      name: "Daniel Roberts",
      method: "Fingerprint",
      time: "Today, 9:45 AM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      icon: Fingerprint,
    },
    {
      id: 1003,
      name: "Sarah Johnson",
      method: "Facial recognition",
      time: "Today, 8:30 AM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      icon: CheckCircle,
    },
    {
      id: 1004,
      name: "Unknown",
      method: "Fingerprint",
      time: "Yesterday, 6:15 PM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: false,
      icon: XCircle,
    },
    {
      id: 1005,
      name: "Michael Chen",
      method: "Fingerprint",
      time: "Yesterday, 5:30 PM",
      avatar: "/placeholder.svg?height=40&width=40",
      success: true,
      icon: Fingerprint,
    },
  ]

  // Sort access history by ID (newest first)
  const sortedAccessHistory = accessHistory.sort((a, b) => b.id - a.id)

  const currentData = activeTab === "visitors" ? visitorHistory : sortedAccessHistory

  const filteredHistory = currentData.filter((item) => {
    // Filter by method/status
    if (filterMethod !== "all") {
      if (filterMethod === "successful" && !item.success) return false
      if (filterMethod === "failed" && item.success) return false
      if (
        activeTab === "access" &&
        !item.method.toLowerCase().includes(filterMethod.toLowerCase()) &&
        filterMethod !== "successful" &&
        filterMethod !== "failed"
      )
        return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const searchableText =
        activeTab === "visitors"
          ? `${item.name} ${item.purpose || ""} ${item.method}`.toLowerCase()
          : `${item.name} ${item.method}`.toLowerCase()

      if (!searchableText.includes(query)) return false
    }

    // Filter by date (simplified - in real app would parse actual dates)
    if (filterDate) {
      // This is a simplified date filter - in a real app you'd parse the actual dates
      const today = new Date()
      const isToday = format(filterDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
      const itemIsToday = item.time.includes("Today")

      if (isToday && !itemIsToday) return false
      if (!isToday && itemIsToday) return false
    }

    return true
  })

  const handleDownload = () => {
    // Create CSV content
    const headers =
      activeTab === "visitors" ? ["Name", "Purpose", "Method", "Time", "Status"] : ["Name", "Method", "Time", "Status"]

    const csvContent = [
      headers.join(","),
      ...filteredHistory.map((item) => {
        const row =
          activeTab === "visitors"
            ? [item.name, item.purpose || "", item.method, item.time, item.success ? "Success" : "Failed"]
            : [item.name, item.method, item.time, item.success ? "Success" : "Failed"]
        return row.map((field) => `"${field}"`).join(",")
      }),
    ].join("\n")

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeTab}-history-${format(new Date(), "yyyy-MM-dd")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Access History</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, method, or purpose..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              {activeTab === "access" && (
                <>
                  <SelectItem value="facial recognition">Facial Recognition</SelectItem>
                  <SelectItem value="fingerprint">Fingerprint</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterDate ? format(filterDate, "MMM dd") : "Filter date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <Tabs defaultValue="visitors" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="visitors">AI Detected Visitors</TabsTrigger>
            <TabsTrigger value="access">Authenticated Access</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 overflow-y-auto max-h-[50vh]">
            <div className="space-y-4">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
                      <AvatarFallback>
                        {item.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <Badge variant={item.success ? "outline" : "destructive"} className="text-xs">
                          {item.success ? "Successful" : "Failed"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium">Method:</span> {item.method}
                      </p>

                      {activeTab === "visitors" && (
                        <>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Purpose:</span> {item.purpose}
                          </p>
                          {(item as any).audioTranscript && (
                            <p className="text-xs text-muted-foreground italic mb-1">
                              "{(item as any).audioTranscript}"
                            </p>
                          )}
                        </>
                      )}

                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matching records found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
