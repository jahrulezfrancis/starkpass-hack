"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Lock, Rocket, Shield, User, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/lib/wallet-provider"
import { truncateAddress } from "@/lib/utils"
import AuthRedirectDialog from "@/components/auth-redirect-dialogue"

export default function SettingsClient() {
  const router = useRouter()
  const { toast } = useToast()
  const { address, isConnected, networkName, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    displayName: "",
    bio: "",
    email: "",
    twitter: "",
    discord: "",
    website: "",
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    questUpdates: true,
    newCredentials: true,
    marketingEmails: false,
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showBadges: true,
    showCredentials: true,
    showQuests: true,
  })

  // Wallet settings
  const [walletSettings, setWalletSettings] = useState({
    defaultNetwork: networkName || "Goerli Testnet",
    autoConnect: true,
  })

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)

    // Load mock settings
    if (isConnected) {
      setProfileSettings({
        displayName: "Starknet User",
        bio: "Exploring the Starknet ecosystem",
        email: "user@example.com",
        twitter: "@starknetuser",
        discord: "starknetuser#1234",
        website: "https://example.com",
      })
    }
  }, [isConnected])

  // Handle profile settings change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle notification settings change
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle privacy settings change
  const handlePrivacyChange = (name: string, checked: boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle wallet settings change
  const handleWalletChange = (name: string, value: string | boolean) => {
    setWalletSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle save settings
  const handleSaveSettings = async (settingsType: string) => {
    try {
      setIsSaving(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Saved",
        description: `Your ${settingsType} settings have been saved successfully.`,
      })
    } catch (error) {
      console.error(`Failed to save ${settingsType} settings:`, error)
      toast({
        title: "Save Failed",
        description: `Failed to save ${settingsType} settings. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle disconnect wallet
  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
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

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return <AuthRedirectDialog message="You need to connect your wallet to access your settings." />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Rocket className="h-6 w-6" />
            <span>StarkPass</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/sponsor" className="text-sm font-medium">
              Sponsor
            </Link>
            <Link href="/stats" className="text-sm font-medium">
              Stats
            </Link>
            <Link href="/settings" className="text-sm font-medium text-primary">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href={`/profile/${address}`} className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                {address ? address.charAt(2).toUpperCase() : "?"}
              </div>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Wallet</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your public profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={profileSettings.displayName}
                      onChange={handleProfileChange}
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={profileSettings.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileSettings.email}
                      onChange={handleProfileChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Social Links</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          value={profileSettings.twitter}
                          onChange={handleProfileChange}
                          placeholder="@username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discord">Discord</Label>
                        <Input
                          id="discord"
                          name="discord"
                          value={profileSettings.discord}
                          onChange={handleProfileChange}
                          placeholder="username#1234"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={profileSettings.website}
                      onChange={handleProfileChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings("profile")} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="questUpdates">Quest Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about quests you're participating in
                      </p>
                    </div>
                    <Switch
                      id="questUpdates"
                      checked={notificationSettings.questUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("questUpdates", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newCredentials">New Credentials</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when new credentials are available to claim
                      </p>
                    </div>
                    <Switch
                      id="newCredentials"
                      checked={notificationSettings.newCredentials}
                      onCheckedChange={(checked) => handleNotificationChange("newCredentials", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings("notification")} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your privacy and visibility preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="publicProfile">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
                    </div>
                    <Switch
                      id="publicProfile"
                      checked={privacySettings.publicProfile}
                      onCheckedChange={(checked) => handlePrivacyChange("publicProfile", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showBadges">Show Badges</Label>
                      <p className="text-sm text-muted-foreground">Display your badges on your public profile</p>
                    </div>
                    <Switch
                      id="showBadges"
                      checked={privacySettings.showBadges}
                      onCheckedChange={(checked) => handlePrivacyChange("showBadges", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showCredentials">Show Credentials</Label>
                      <p className="text-sm text-muted-foreground">Display your credentials on your public profile</p>
                    </div>
                    <Switch
                      id="showCredentials"
                      checked={privacySettings.showCredentials}
                      onCheckedChange={(checked) => handlePrivacyChange("showCredentials", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showQuests">Show Quests</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your completed quests on your public profile
                      </p>
                    </div>
                    <Switch
                      id="showQuests"
                      checked={privacySettings.showQuests}
                      onCheckedChange={(checked) => handlePrivacyChange("showQuests", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings("privacy")} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Wallet Settings */}
            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Settings</CardTitle>
                  <CardDescription>Manage your wallet and connection preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Connected Wallet</Label>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="font-medium">{truncateAddress(address || "")}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleDisconnect}>
                        Disconnect
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultNetwork">Default Network</Label>
                    <Select
                      value={walletSettings.defaultNetwork}
                      onValueChange={(value) => handleWalletChange("defaultNetwork", value)}
                    >
                      <SelectTrigger id="defaultNetwork">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mainnet">Mainnet</SelectItem>
                        <SelectItem value="Goerli Testnet">Goerli Testnet</SelectItem>
                        <SelectItem value="Sepolia Testnet">Sepolia Testnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Current network: {networkName}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoConnect">Auto-connect</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically connect to your wallet when you visit StarkPass
                      </p>
                    </div>
                    <Switch
                      id="autoConnect"
                      checked={walletSettings.autoConnect}
                      onCheckedChange={(checked) => handleWalletChange("autoConnect", checked)}
                    />
                  </div>
                  <div className="space-y-2 pt-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Security
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      For security reasons, some actions require re-authentication with your wallet.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings("wallet")} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
