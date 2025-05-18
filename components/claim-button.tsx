"use client"

import { useState } from "react"
import { Check, AlertCircle } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useUser } from "@/lib/user-provider"
import { useAccount } from "@starknet-react/core"

interface ClaimButtonProps extends ButtonProps {
  credentialId: string
  onSuccess?: () => void
}

export default function ClaimButton({
  credentialId,
  onSuccess,
  children = "Claim Credential",
  ...props
}: ClaimButtonProps) {
  const { isConnected } = useAccount()
  const { claimCredential } = useUser()

  const [isClaiming, setIsClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleClaim = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first.")
      return
    }

    try {
      setIsClaiming(true)
      setErrorMessage("")

      await claimCredential(credentialId)

      setClaimed(true)
      onSuccess?.()
    } catch (error: any) {
      console.error("❌ Failed to claim credential:", error)
      setErrorMessage(error?.message || "An unexpected error occurred.")
    } finally {
      setIsClaiming(false)
    }
  }

  if (claimed) {
    return (
      <Button variant="outline" disabled>
        Claimed <Check className="w-4 h-4 ml-2" />
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        {...props}
        disabled={isClaiming || !isConnected}
        onClick={handleClaim}
      >
        {isClaiming ? "Claiming..." : children}
      </Button>

      {errorMessage && (
        <div className="text-red-500 flex items-center text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errorMessage}
        </div>
      )}
    </div>
  )
}
