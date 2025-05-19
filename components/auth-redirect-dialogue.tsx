"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAccount } from "@starknet-react/core"
import { connect } from "starknetkit"


interface AuthRedirectDialogProps {
  redirectPath?: string
  message?: string
}

export default function AuthRedirectDialog({
  redirectPath = "/",
  message = "You need to connect your wallet to access this page.",
}: AuthRedirectDialogProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [showDialog, setShowDialog] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setShowDialog(true)
  }, [])

  useEffect(() => {
    if (mounted && isConnected) {
      setShowDialog(false)
    }
  }, [isConnected, mounted])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await connect()
      setShowDialog(false)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleRedirect = () => {
    router.push(redirectPath)
  }

  if (!mounted) {
    return null
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Authentication Required
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Connect your Starknet wallet to access all features of StarkPass, including your dashboard, quests, and
            credentials.
          </p>
          <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleRedirect} className="sm:flex-1">
            Go to Home
          </Button>
          <Button onClick={handleConnect} disabled={isConnecting} className="sm:flex-1">
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
