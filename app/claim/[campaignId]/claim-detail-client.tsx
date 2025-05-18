"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BadgeCheck, Calendar, Check, Rocket, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-provider"
import { useContract } from "@/lib/contract-provider"
import { formatDate } from "@/lib/utils"
import { mockCampaigns } from "@/lib/mock-data"
import { StarknetWalletConnect } from "@/components/StartknetWalletConnect"
import { useAccount } from "@starknet-react/core"

export default function ClaimDetailClient({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { claimCredential } = useUser()
  const { isEligibleForClaim } = useContract()
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [isEligible, setIsEligible] = useState(false)
  const [eligibilityChecked, setEligibilityChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Find the campaign
  const campaign = mockCampaigns.find((c) => c.id === campaignId)

  // Check eligibility when wallet is connected
  useEffect(() => {
    const checkEligibility = async () => {
      if (isConnected && address && campaign) {
        try {
          setIsLoading(true)
          const eligible = await isEligibleForClaim(address, campaign.id)
          setIsEligible(eligible)
          setEligibilityChecked(true)
          setIsLoading(false)
        } catch (error) {
          console.error("Failed to check eligibility:", error)
          setIsLoading(false)
          toast({
            title: "Error",
            description: "Failed to check eligibility. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        setIsEligible(false)
        setEligibilityChecked(false)
      }
    }

    if (isConnected && address) {
      checkEligibility()
    }
  }, [isConnected, address, campaign, isEligibleForClaim, toast])

  // Handle if campaign not found
  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
        <p className="text-muted-foreground mb-6">The claim campaign you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/claim">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Claim Campaigns
          </Link>
        </Button>
      </div>
    )
  }

  // Handle connect wallet


  // Handle claim
  const handleClaim = async () => {
    if (!isConnected || !isEligible) return

    try {
      setIsClaiming(true)
      // Mock credential ID based on campaign
      const credentialId = `claimable-cred-${campaign.id}`
      await claimCredential(credentialId)
      setClaimed(true)
      toast({
        title: "Credential Claimed",
        description: "Your credential has been successfully claimed and added to your profile.",
      })
    } catch (error) {
      console.error("Failed to claim credential:", error)
      toast({
        title: "Claim Failed",
        description: "Failed to claim credential. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  // Handle share
  const handleShare = () => {
    if (!address) return

    const shareUrl = `${window.location.origin}/profile/${address}`
    const shareText = `I just claimed the "${campaign.title}" credential on StarkPass! Check out my profile:`

    // Try to use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: "My StarkPass Credential",
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard.",
      })
    }
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
            <Link href="/quests" className="text-sm font-medium">
              Quests
            </Link>
            <Link href={`/profile/${address}`} className="text-sm font-medium">
              Profile
            </Link>
            <Link href="/claim" className="text-sm font-medium text-primary">
              Claim
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {isConnected && address && (
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
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/claim">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Claim Campaigns
            </Link>
          </Button>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Credential Preview */}
            <Card className="overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={campaign.credentialImage || "/placeholder.svg"}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src={campaign.sponsorLogo || "/placeholder.svg"}
                      alt={campaign.sponsor}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{campaign.sponsor}</span>
                </div>
                <CardTitle>{campaign.title}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Available until:</span>
                    </div>
                    <span>{formatDate(campaign.endDate)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Claimed:</span>
                      <span>
                        {campaign.totalClaims} / {campaign.maxClaims}
                      </span>
                    </div>
                    <Progress value={(campaign.totalClaims / campaign.maxClaims) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claim Process */}
            <Card>
              <CardHeader>
                <CardTitle>Claim Your Credential</CardTitle>
                <CardDescription>Follow these steps to claim your on-chain credential</CardDescription>
              </CardHeader>
              <CardContent>
                {claimed ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                      <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Successfully Claimed!</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Your credential has been added to your profile.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <Button className="flex-1" asChild>
                        <Link href={`/profile/${address}`}>View in Profile</Link>
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Connect Your Wallet</p>
                          <p className="text-sm text-muted-foreground">
                            Connect your Starknet wallet to verify eligibility
                          </p>
                          {!isConnected && (
                            <StarknetWalletConnect />
                          )}
                        </div>
                        {isConnected && <Check className="h-5 w-5 text-green-500 ml-auto" />}
                      </div>

                      <Separator />

                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Verify Eligibility</p>
                          <p className="text-sm text-muted-foreground">
                            We'll check if you're eligible for this credential
                          </p>
                          {isConnected && isLoading && (
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                              <span>Checking eligibility...</span>
                            </div>
                          )}
                          {isConnected && eligibilityChecked && isEligible && !isLoading && (
                            <div className="flex items-center gap-2 mt-2 text-green-500 text-sm">
                              <BadgeCheck className="h-4 w-4" />
                              <span>You are eligible to claim this credential</span>
                            </div>
                          )}
                          {isConnected && eligibilityChecked && !isEligible && !isLoading && (
                            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                              <span>You are not eligible for this credential</span>
                            </div>
                          )}
                        </div>
                        {isConnected && eligibilityChecked && isEligible && !isLoading && (
                          <Check className="h-5 w-5 text-green-500 ml-auto" />
                        )}
                      </div>

                      <Separator />

                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Claim Your Credential</p>
                          <p className="text-sm text-muted-foreground">Mint your credential to your wallet</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!claimed && (
                  <Button
                    className="w-full"
                    disabled={!isConnected || !isEligible || isClaiming || isLoading}
                    onClick={handleClaim}
                  >
                    {isClaiming ? "Claiming..." : isLoading ? "Checking Eligibility..." : "Claim Credential"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
