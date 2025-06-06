"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Camera, Download, Maximize2, Volume2, VolumeX } from "lucide-react"

interface CameraViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CameraView({ open, onOpenChange }: CameraViewProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Front Door Camera</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Camera Feed Placeholder */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Live Camera Feed</p>
                <p className="text-sm opacity-75">Front Door - HD Quality</p>
              </div>
            </div>

            {/* Camera Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/50 hover:bg-black/70 text-white border-0"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={() => alert("Fullscreen mode would be implemented here")}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => {
                    setIsRecording(!isRecording)
                    alert(isRecording ? "Recording stopped" : "Recording started")
                  }}
                  className={isRecording ? "" : "bg-black/50 hover:bg-black/70 text-white border-0"}
                >
                  {isRecording ? "Stop Recording" : "Record"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={() => alert("Screenshot saved to downloads")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Camera Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Status</p>
              <p className="text-muted-foreground">Online - HD Quality</p>
            </div>
            <div>
              <p className="font-medium">Last Motion</p>
              <p className="text-muted-foreground">Today, 10:23 AM</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
