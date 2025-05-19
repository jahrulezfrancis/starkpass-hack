"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart, LineChart, PieChart, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccount } from "@starknet-react/core"
import { useContract } from "@/lib/contract-provider"
import { truncateAddress } from "@/lib/utils"
import { mockEcosystemStats } from "@/lib/mock-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StatsPage() {
  const { address } = useAccount()
  const { exportData, isLoading } = useContract()
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportType, setExportType] = useState("all")
  const [isExporting, setIsExporting] = useState(false)

  // Handle export data
  const handleExportData = async () => {
    try {
      setIsExporting(true)

      // Get data from contract provider
      const data = await exportData(exportType)

      // Create a blob and download it
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      // Create a temporary link and click it
      const link = document.createElement("a")
      link.href = url
      link.download = `starkpass-${exportType}-data.json`
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setShowExportDialog(false)
    } catch (error) {
      console.error("Failed to export data:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <BarChart className="h-6 w-6" />
            <span>StarkPass Stats</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/sponsor" className="text-sm font-medium">
              Sponsor
            </Link>
            <Link href="/stats" className="text-sm font-medium text-primary">
              Stats
            </Link>
            <Link href="/dashboard/settings" className="text-sm font-medium">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {address && (
              <Link href={`/profile/${address}`} className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  {address.charAt(2).toUpperCase()}
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ecosystem Stats</h1>
              <p className="text-muted-foreground">Overview of the StarkPass ecosystem</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockEcosystemStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+250 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users (Monthly)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockEcosystemStats.activeUsers.monthly.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+120 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockEcosystemStats.totalCredentials.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+500 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockEcosystemStats.totalCampaigns.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="contributors">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
              <TabsTrigger value="quests">Popular Quests</TabsTrigger>
              <TabsTrigger value="campaigns">Successful Campaigns</TabsTrigger>
            </TabsList>

            {/* Top Contributors Tab */}
            <TabsContent value="contributors" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                  <CardDescription>Users with the most completed quests and credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockEcosystemStats.topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">
                              <Link href={`/profile/${contributor.address}`} className="hover:underline">
                                {truncateAddress(contributor.address)}
                              </Link>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {contributor.completedQuests} quests • {contributor.credentials} credentials
                            </p>
                          </div>
                          <Progress value={(contributor.completedQuests / 12) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Popular Quests Tab */}
            <TabsContent value="quests" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Quests</CardTitle>
                  <CardDescription>Quests with the most completions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockEcosystemStats.popularQuests.map((quest, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">
                              <Link href={`/quests/${quest.id}`} className="hover:underline">
                                {quest.title}
                              </Link>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {quest.completions.toLocaleString()} completions
                            </p>
                          </div>
                          <Progress value={(quest.completions / 1000) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Successful Campaigns Tab */}
            <TabsContent value="campaigns" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Successful Campaigns</CardTitle>
                  <CardDescription>Campaigns with the highest claim rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockEcosystemStats.successfulCampaigns.map((campaign, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">
                              <Link href={`/claim/${campaign.id}`} className="hover:underline">
                                {campaign.title}
                              </Link>
                            </p>
                            <p className="text-sm text-muted-foreground">{campaign.claimRate} claim rate</p>
                          </div>
                          <Progress value={Number.parseInt(campaign.claimRate)} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New users over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-2" />
                  <p>User growth chart would appear here</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Credential Distribution</CardTitle>
                <CardDescription>Types of credentials issued</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <PieChart className="h-16 w-16 mb-2" />
                  <p>Credential distribution chart would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Export Data Dialog */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Data</AlertDialogTitle>
            <AlertDialogDescription>
              Select the type of data you want to export. The data will be downloaded as a JSON file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ecosystem Data</SelectItem>
                <SelectItem value="users">User Data</SelectItem>
                <SelectItem value="quests">Quest Data</SelectItem>
                <SelectItem value="campaigns">Campaign Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExportData} disabled={isExporting || isLoading}>
              {isExporting ? "Exporting..." : "Export Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
