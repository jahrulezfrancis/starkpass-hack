"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, ChevronDown, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/lib/wallet-provider"
import { truncateAddress } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function WalletConnect() {
  const router = useRouter()
  const { toast } = useToast()
  const { address, isConnected, connect, disconnect, networkName } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setShowDialog(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleWalletSelect = async (walletType: string) => {
    try {
      await connect({ modalMode: "neverAsk", webWalletUrl: walletType })
      setShowDialog(false)
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error(`Failed to connect ${walletType}:`, error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
      router.push("/")
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const viewOnExplorer = () => {
    if (!address) return

    // Determine explorer URL based on network
    let explorerUrl = "https://starkscan.co/contract/"
    if (networkName === "Goerli Testnet") {
      explorerUrl = "https://testnet.starkscan.co/contract/"
    } else if (networkName === "Sepolia Testnet") {
      explorerUrl = "https://sepolia.starkscan.co/contract/"
    }

    window.open(`${explorerUrl}${address}`, "_blank")
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>{truncateAddress(address)}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>My Account</span>
              <span className="text-xs text-muted-foreground">{networkName}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/profile/${address}`)}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>Choose a wallet to connect to StarkPass</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="flex justify-between items-center"
              onClick={() => handleWalletSelect("argentX")}
            >
              <span>Argent X</span>
              <img src="/placeholder.svg?height=24&width=24" alt="Argent X" className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              className="flex justify-between items-center"
              onClick={() => handleWalletSelect("braavos")}
            >
              <span>Braavos</span>
              <img src="/placeholder.svg?height=24&width=24" alt="Braavos" className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              className="flex justify-between items-center"
              onClick={() => handleWalletSelect("mock")}
            >
              <span>Development Wallet (Mock)</span>
              <Wallet className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
