"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-provider"
import { useUser } from "@/lib/user-provider"

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
  const { isConnected } = useWallet()
  const { claimCredential } = useUser()
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleClaim = async () => {
    if (!isConnected) return

    try {
      setIsClaiming(true)
      await claimCredential(credentialId)
      setClaimed(true)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to claim credential:", error)
    } finally {
      setIsClaiming(false)
    }
  }

  if (claimed) {
    return (
      <Button
        variant="outline"
        disabled
        className="
"
      >
        Claimed <Check className="w-4 h-4 ml-2" />
      </Button>
    )
  }

  return (
    <Button {...props} disabled={isClaiming} onClick={handleClaim}>
      {isClaiming ? "Claiming..." : children}
    </Button>
  )
}
