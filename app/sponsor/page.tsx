"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, Plus, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from "@starknet-react/core";

import { mockCampaigns, mockQuests } from "@/lib/mock-data";

export default function SponsorDashboard() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("campaigns");

  // Mock campaign analytics
  const campaignAnalytics = mockCampaigns.map((campaign) => ({
    ...campaign,
    claimRate: Math.round((campaign.totalClaims / campaign.maxClaims) * 100),
    uniqueVisitors: Math.round(campaign.totalClaims * 2.5),
    conversionRate: Math.round(
      (campaign.totalClaims / (campaign.totalClaims * 2.5)) * 100
    ),
  }));

  // Mock quest analytics
  const questAnalytics = mockQuests.map((quest) => ({
    ...quest,
    participants: Math.floor(Math.random() * 500) + 100,
    completionRate: Math.floor(Math.random() * 60) + 20,
    averageTimeToComplete: `${Math.floor(Math.random() * 30) + 10} min`,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sponsor Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your quests and claim campaigns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/sponsor/create-campaign">
                  <Plus className="mr-2 h-4 w-4" />
                  New Campaign
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sponsor/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockCampaigns.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Quests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockQuests.length}</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">
                  +350 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="campaigns" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="campaigns">Claim Campaigns</TabsTrigger>
              <TabsTrigger value="quests">Quests</TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Claim Campaigns</h2>
                <Button size="sm" asChild>
                  <Link href="/sponsor/create-campaign">
                    <Plus className="mr-2 h-4 w-4" />
                    New Campaign
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {campaignAnalytics.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                          <Image
                            src={campaign.credentialImage || "/placeholder.svg"}
                            alt={campaign.title}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {campaign.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium">Claim Rate</p>
                              <p className="text-2xl font-bold">
                                {campaign.claimRate}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Total Claims
                              </p>
                              <p className="text-2xl font-bold">
                                {campaign.totalClaims}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Visitors</p>
                              <p className="text-2xl font-bold">
                                {campaign.uniqueVisitors}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Conversion</p>
                              <p className="text-2xl font-bold">
                                {campaign.conversionRate}%
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <Link href={`/claim/${campaign.id}`}>View</Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Quests Tab */}
            <TabsContent value="quests" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Quests</h2>
                <Button size="sm" asChild>
                  <Link href="/sponsor/create-quest">
                    <Plus className="mr-2 h-4 w-4" />
                    New Quest
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {questAnalytics.map((quest) => (
                  <Card key={quest.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="relative w-6 h-6">
                              <Image
                                src={quest.sponsorLogo || "/placeholder.svg"}
                                alt={quest.sponsor}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <h3 className="text-lg font-semibold">
                              {quest.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {quest.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium">
                                Participants
                              </p>
                              <p className="text-2xl font-bold">
                                {quest.participants}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Completion Rate
                              </p>
                              <p className="text-2xl font-bold">
                                {quest.completionRate}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">XP Reward</p>
                              <p className="text-2xl font-bold">
                                {quest.xpReward}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Avg. Time</p>
                              <p className="text-2xl font-bold">
                                {quest.averageTimeToComplete}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <Link href={`/quests/${quest.id}`}>View</Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
