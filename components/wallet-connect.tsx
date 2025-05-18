'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet, ChevronDown, ExternalLink, Info } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useNetwork } from '@starknet-react/core'
import { argent, braavos, InjectedConnector, Connector } from '@starknet-react/core'
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
import { useToast } from "@/components/ui/use-toast"
import { truncateAddress } from "@/lib/utils"

// Custom MockConnector to set id and provide mock account
class MockConnector extends InjectedConnector {
  constructor() {
    super({ options: { id: "" } }); // Pass options explicitly
  }

  get id() {
    return 'mock';
  }

  available() {
    // Synchronous check for development environment
    return process.env.NODE_ENV === 'development';
  }

  // Mock account for development
  async account() {
    return {
      address: '0xmock1234567890abcdef',
      signMessage: async () => ['0xmockSignature'],
      execute: async () => ({ transaction_hash: '0xmockTxHash' }),
    } as any; // Simplified for mock purposes
  }
}

interface ConnectorItem {
  id: string
  name: string
  connector: Connector
  icon: string
}

export default function WalletConnect() {
  const router = useRouter()
  const { toast } = useToast()
  const { account, status, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null)
  const [availableConnectors, setAvailableConnectors] = useState<ConnectorItem[]>([])
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)

  // Define supported connectors
  const supportedConnectors: ConnectorItem[] = [
    {
      id: 'argentX',
      name: 'Argent X',
      connector: argent(),
      icon: 'https://i.ibb.co/nNFpnZbK/argent.png?text=A',
    },
    {
      id: 'braavos',
      name: 'Braavos',
      connector: braavos(),
      icon: 'https://i.ibb.co/spM38rcQ/bravos.png?text=B',
    },
    {
      id: 'mock',
      name: 'Development Wallet (Mock)',
      connector: new MockConnector(),
      icon: '/placeholder.svg?height=24&width=24',
    },
  ]

  // Check available connectors and persist connection
  useEffect(() => {
    const checkWalletsAndReconnect = async () => {
      const detectedConnectors = await Promise.all(
        supportedConnectors.map(async (item) => {
          try {
            const isAvailable = item.connector.available()
            return isAvailable ? item : null
          } catch {
            return null
          }
        })
      )
      const validConnectors = detectedConnectors.filter((item): item is ConnectorItem => item !== null)
      setAvailableConnectors(validConnectors)

      if (account && address) {
        if (!selectedConnector) {
          const savedConnectorId = localStorage.getItem('starknetConnectorId')
          if (savedConnectorId) {
            const savedConnector = supportedConnectors.find((c) => c.id === savedConnectorId)
            if (savedConnector) {
              setSelectedConnector(savedConnector)
            }
          }
        }
        return
      }

      // Attempt to reconnect
      const savedConnectorId = localStorage.getItem('starknetConnectorId')
      if (savedConnectorId) {
        const savedConnector = supportedConnectors.find((c) => c.id === savedConnectorId)
        if (savedConnector && validConnectors.some((c) => c.id === savedConnectorId)) {
          try {
            await connect({ connector: savedConnector.connector })
            setSelectedConnector(savedConnector)
          } catch (error) {
            console.error('Failed to reconnect:', error)
            localStorage.removeItem('starknetConnectorId')
          }
        }
      }
    }

    checkWalletsAndReconnect()
  }, [account, address, connect])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setShowDialog(true)
    } catch (error) {
      console.error("Failed to initiate wallet connection:", error)
      toast({
        title: "Connection Failed",
        description: "Unable to initiate wallet connection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleWalletSelect = async (connector: ConnectorItem) => {
    try {
      await connect({ connector: connector.connector })
      setSelectedConnector(connector)
      localStorage.setItem('starknetConnectorId', connector.id)
      setShowDialog(false)
      toast({
        title: "Wallet Connected",
        description: `${connector.name} has been connected successfully.`,
      })
      router.push("/dashboard")
    } catch (error) {
      console.error(`Failed to connect ${connector.name}:`, error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${connector.name}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setSelectedConnector(null)
      localStorage.removeItem('starknetConnectorId')
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

    let explorerUrl = "https://starkscan.co/contract/"
    if (chain?.name?.includes("Goerli")) {
      explorerUrl = "https://testnet.starkscan.co/contract/"
    } else if (chain?.name?.includes("Sepolia")) {
      explorerUrl = "https://sepolia.starkscan.co/contract/"
    }

    window.open(`${explorerUrl}${address}`, "_blank")
  }

  if (status === "connected" && address) {
    const connectedWallet = selectedConnector?.name || "Unknown Wallet"

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
              <span className="text-xs text-muted-foreground">{chain?.name || "Unknown Network"}</span>
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

  if (availableConnectors.length === 0) {
    return (
      <div>
        <div className="relative group">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
            aria-label="No StarkNet Wallet Installed"
          >
            <Info className="h-5 w-5" />
            <span>Wallet Required</span>
          </button>
          <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-10">
            No StarkNet Wallet Installed
          </div>
        </div>

        <Dialog open={isInstallModalOpen} onOpenChange={setIsInstallModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Install a StarkNet Wallet</DialogTitle>
              <DialogDescription>Please install a supported StarkNet wallet to continue.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <a
                  href="https://www.argent.xyz/argent-x/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Install Argent X
                </a>
                <span className="text-gray-400"> - A secure wallet for StarkNet.</span>
              </div>
              <div>
                <a
                  href="https://braavos.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Install Braavos
                </a>
                <span className="text-gray-400"> - Another great StarkNet wallet.</span>
              </div>
              <p className="text-gray-400">
                After installing, create an account and refresh this page to connect.
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsInstallModalOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
            {availableConnectors.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="flex justify-between items-center"
                onClick={() => handleWalletSelect(item)}
              >
                <span>{item.name}</span>
                <img src={item.icon} alt={`${item.name} icon`} className="h-6 w-6 rounded-full" />
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}