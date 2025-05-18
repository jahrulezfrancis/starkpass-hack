'use client'

import React, { useState } from 'react'
import { useAccount, useConnect } from '@starknet-react/core'
import { argent, braavos, InjectedConnector } from '@starknet-react/core'

interface ConnectorItem {
  id: string
  name: string
  connector: InjectedConnector
  icon: string // Added for icon URL
}

export function StarknetWalletConnect() {
  const { account } = useAccount()
  const { connect } = useConnect()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null)

  console.log(account)

  // Define connectors with icons
  const supportedConnectors: ConnectorItem[] = [
    { 
      id: 'argent', 
      name: 'Argent X', 
      connector: argent(), 
      icon: 'https://i.ibb.co/nNFpnZbK/argent.png?text=A' // Placeholder for Argent X icon
    },
    { 
      id: 'braavos', 
      name: 'Braavos', 
      connector: braavos(), 
      icon: 'https://i.ibb.co/spM38rcQ/bravos.png?text=B' // Placeholder for Braavos icon
    },
  ]

  const handleConnect = async () => {
    if (selectedConnector) {
      try {
        await connect({ connector: selectedConnector.connector })
        setIsModalOpen(false) // Close modal on successful connection
      } catch (error) {
        console.error('Connection failed:', error)
        alert('Failed to connect wallet. Please try again.')
      }
    }
  }

  if (account) {
    return (
      <div className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition">
        Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
      </div>
    )
  }

  if (supportedConnectors.length === 0) {
    return (
      <div className="text-red-400">
        No StarkNet wallets found. Please install Argent X or Braavos.
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

      {/* Modal */}
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
              {supportedConnectors.map((item) => (
                <label key={item.id} className="flex items-center p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer">
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