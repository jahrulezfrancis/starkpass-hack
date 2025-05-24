"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Copy, ExternalLink, Share2, Trophy, } from "lucide-react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/user-provider";
import { calculateLevelProgress, formatDate, truncateAddress, } from "@/lib/utils";
import { useAccount } from "@starknet-react/core";
import { getMockBadges, mockCampaigns, mockCompletedQuests, mockCredentials, mockQuests } from "@/lib/mock-data";

export default function ProfileClient({
  userAddress,
}: {
  userAddress: string;
}) {
  const { toast } = useToast();
  const { address: connectedAddress } = useAccount();
  const { xp, level, } = useUser();
  const badges = getMockBadges();
  const [isOwner, setIsOwner] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  // Set profile URL for sharing
  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(`${window.location.origin}/profile/${userAddress}`);
    }
  }, [userAddress]);

  // Check if the profile belongs to the connected user
  useEffect(() => {
    if (connectedAddress && userAddress) {
      setIsOwner(connectedAddress.toLowerCase() === userAddress.toLowerCase());
    }
  }, [connectedAddress, userAddress]);


  // Handle copy profile link
  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Profile link has been copied to clipboard.",
    });
  };

  // Handle share profile
  const handleShareProfile = async () => {
    const shareText = `Check out my StarkPass profile with ${getMockBadges.length} badges and ${mockCredentials.length} credentials!`

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My StarkPass Profile",
          text: shareText,
          url: profileUrl,
        })
        toast({
          title: "Shared Successfully",
          description: "Your profile has been shared.",
        })
      } else {
        try {
          await navigator.clipboard.writeText(`${shareText} ${profileUrl}`)
          toast({
            title: "Share Info Copied",
            description: "Share text and link have been copied to clipboard.",
          })
        } catch (clipboardError) {
          toast({
            title: "Share Unavailable",
            description: "Please copy the URL manually: " + profileUrl,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // User canceled - do nothing
        return
      }
      toast({
        title: "Share Failed",
        description: "Could not share the profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  // View on explorer
  const viewOnExplorer = () => {
    if (!userAddress) return;

    // For this example, we'll use Starkscan testnet
    const explorerUrl = "https://starkscan.co/contract/";
    window.open(`${explorerUrl}${userAddress}`, "_blank");
  };

  return (
    <>
      <Head>
        <title>
          {isOwner
            ? "Your Profile"
            : `User Profile ${truncateAddress(userAddress)}`}{" "}
          | StarkPass
        </title>
        <meta
          name="description"
          content={`StarkPass profile with ${getMockBadges.length} badges and ${mockCredentials.length} credentials`}
        />
        <meta
          property="og:title"
          content={`${isOwner ? "My" : "User"} StarkPass Profile`}
        />
        <meta
          property="og:description"
          content={`Check out this StarkPass profile with ${getMockBadges.length} badges and ${mockCredentials.length} credentials!`}
        />
        <meta
          property="og:image"
          content="/placeholder.svg?height=600&width=1200"
        />
        <meta property="og:url" content={profileUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <main className="flex-1 py-6 md:py-10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Sidebar */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-3xl font-bold mb-4">
                        {userAddress
                          ? userAddress.charAt(2).toUpperCase()
                          : "?"}
                      </div>
                      <CardTitle className="text-center">
                        {isOwner ? "Your Profile" : "User Profile"}
                      </CardTitle>
                      <CardDescription className="text-center break-all">
                        {userAddress}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={viewOnExplorer}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-medium">
                              Level {level}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {xp} XP
                          </span>
                        </div>
                        <Progress
                          value={calculateLevelProgress(xp)}
                          className="h-2"
                        />
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{getMockBadges.length}</p>
                          <p className="text-xs text-muted-foreground">
                            Badges
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {mockQuests.length + getMockBadges.length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Credentials
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {mockQuests.length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Quests
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">
                          January 15, 2025
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyProfileLink}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Profile Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShareProfile}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Profile
                        </Button>
                      </div>
                      {isOwner && (
                        <>
                          <Separator />
                          <Button className="w-full" asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Content */}
              <div className="md:col-span-2">
                <Tabs defaultValue="credentials">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="credentials">Credentials</TabsTrigger>
                    <TabsTrigger value="badges">Badges</TabsTrigger>
                    <TabsTrigger value="quests">Quests</TabsTrigger>
                  </TabsList>

                  {/* Credentials Tab */}
                  <TabsContent value="credentials" className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Credentials</h2>
                    {mockCampaigns.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {mockCampaigns.map((credential) => (
                          <Card key={credential.id}>
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                  <Image
                                    src={credential.credentialImage || "/placeholder.svg"}
                                    alt={credential.title}
                                    fill
                                    className="rounded-md object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold truncate">
                                    {credential.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {credential.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      Issued by {credential.sponsor}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(credential.endDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7"
                                      onClick={viewOnExplorer}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      View on Explorer
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7"
                                      onClick={handleShareProfile}
                                    >
                                      <Share2 className="h-3 w-3 mr-1" />
                                      Share
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                        <div className="text-center">
                          <BadgeCheck className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No credentials yet
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Badges Tab */}
                  <TabsContent value="badges" className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Badges</h2>
                    {getMockBadges.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-3">
                        {badges.map((badge) => (
                          <Card key={badge.id}>
                            <CardContent className="p-4 flex flex-col items-center">
                              <div className="relative w-24 h-24 mb-3">
                                <Image
                                  src={badge.image || "/placeholder.svg"}
                                  alt={badge.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <h3 className="font-semibold text-center">
                                {badge.name}
                              </h3>
                              <p className="text-sm text-muted-foreground text-center mt-1">
                                {badge.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  Issued by {badge.issuer}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground mt-1">
                                {formatDate(badge.issuedAt)}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 text-xs"
                                onClick={handleShareProfile}
                              >
                                <Share2 className="h-3 w-3 mr-1" />
                                Share Badge
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                        <div className="text-center">
                          <Trophy className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No badges earned yet
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Quests Tab */}
                  <TabsContent value="quests" className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Completed Quests
                    </h2>
                    {mockQuests.length > 0 ? (
                      <div className="space-y-4">
                        {mockQuests.map((quest) => (
                          <Card key={quest.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <BadgeCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold">
                                    {quest.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      Sponsored by {quest.sponsor}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {quest.xpReward} XP
                                    </span>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/quests/${quest}`}>View</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                        <div className="text-center">
                          <Trophy className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No quests completed yet
                          </p>
                          <Button variant="outline" className="mt-4" asChild>
                            <Link href="/quests">Browse Quests</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
