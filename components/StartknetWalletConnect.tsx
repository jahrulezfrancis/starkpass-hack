'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { argent, braavos, InjectedConnector } from '@starknet-react/core'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { ChevronDown, ExternalLink, Wallet, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ConnectorItem {
  id: string
  name: string
  connector: InjectedConnector
  icon: string
}

function truncateAddress(address: string) {
  const start = 6
  const end = 4
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function StarknetWalletConnect() {
  const { account, status, address } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null)
  const [availableConnectors, setAvailableConnectors] = useState<ConnectorItem[]>([])
  const router = useRouter()

  // Define connectors with icons
  const supportedConnectors: ConnectorItem[] = [
    {
      id: 'argent',
      name: 'Argent X',
      connector: argent(),
      icon: 'https://i.ibb.co/nNFpnZbK/argent.png?text=A'
    },
    {
      id: 'braavos',
      name: 'Braavos',
      connector: braavos(),
      icon: 'https://i.ibb.co/spM38rcQ/bravos.png?text=B'
    },
  ]

  // Log connection status
  useEffect(() => {
    if (status === "disconnected") {
      console.log("Disconnected from the wallet")
    } else if (status === "connected") {
      console.log("We connected to the wallet", address)
    }
  }, [address, status])

  // Check available connectors and persist connection
  useEffect(() => {
    const checkWalletsAndReconnect = async () => {
      const detectedConnectors = await Promise.all(
        supportedConnectors.map(async (item) => {
          try {
            const isAvailable = await item.connector.available()
            return isAvailable ? item : null
          } catch {
            return null
          }
        })
      )
      const validConnectors = detectedConnectors.filter((item): item is ConnectorItem => item !== null)
      setAvailableConnectors(validConnectors)

      if (account) {
        // If account connected but no selectedConnector set, try to set it
        if (!selectedConnector) {
          const savedConnectorId = localStorage.getItem('starknetConnectorId')
          if (savedConnectorId) {
            const savedConnector = supportedConnectors.find((c) => c.id === savedConnectorId)
            if (savedConnector) {
              setSelectedConnector(savedConnector)
            }
          }
        }
        return // Already connected, no need to reconnect
      }

      // Attempt to reconnect to a previously connected wallet if no account yet
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
  }, [])

  const handleConnect = async () => {
    if (selectedConnector) {
      try {
        await connect({ connector: selectedConnector.connector })
        localStorage.setItem('starknetConnectorId', selectedConnector.id)
        setIsModalOpen(false)
      } catch (error) {
        console.error('Connection failed:', error)
        alert('Failed to connect wallet. Please try again.')
      }
    }
  }

  const viewOnExplorer = () => {
    if (!account?.address) return
    const explorerUrl = 'https://starkscan.co/contract/'
    window.open(`${explorerUrl}${account.address}`, '_blank')
  }

  const handleDisconnect = () => {
    disconnect()
    setSelectedConnector(null)
    localStorage.removeItem('starknetConnectorId')
  }

  if (account) {
    const connectedWallet = selectedConnector?.name || 'Unknown Wallet'

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>{truncateAddress(address ?? "")}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>My Account</span>
              <span className="text-xs text-muted-foreground">{connectedWallet}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard')}>Dashboard</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/profile/${account.address}`)}>Profile</DropdownMenuItem>
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
          >
            <Info className="h-5 w-5" />
            <span>Wallet Required</span>
          </button>
          <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-10">
            No StarkNet Wallet Installed
          </div>
        </div>

        {/* Installation Instructions Modal */}
        {isInstallModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 h-screen w-screen">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Install a StarkNet Wallet</h2>
                <button
                  onClick={() => setIsInstallModalOpen(false)}
                  className="text-white hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-400 mb-6">Please install a supported StarkNet wallet to continue:</p>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-white">
                <li>
                  <a
                    href="https://www.argent.xyz/argent-x/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Install Argent X
                  </a>{' '}
                  - A secure wallet for StarkNet.
                </li>
                <li>
                  <a
                    href="https://braavos.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Install Braavos
                  </a>{' '}
                  - Another great StarkNet wallet.
                </li>
              </ul>
              <p className="text-gray-400">
                After installing, create an account and refresh this page to connect.
              </p>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsInstallModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Connect Wallet Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Connect Wallet
      </button>

      {/* Wallet Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 h-screen w-screen">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <p className="text-gray-400 mb-6">Choose a wallet to connect to StarkPass</p>
            <div className="space-y-3">
              {availableConnectors.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                >
                  <input
                    type="radio"
                    name="wallet"
                    value={item.id}
                    checked={selectedConnector?.id === item.id}
                    onChange={() => setSelectedConnector(item)}
                    className="mr-3 w-4 h-4 text-blue-600 focus:ring-0"
                  />
                  <img src={item.icon} alt={`${item.name} icon`} className="w-6 h-6 mr-3 rounded-full" />
                  <span className="text-white">{item.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleConnect}
                disabled={!selectedConnector}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedConnector
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}