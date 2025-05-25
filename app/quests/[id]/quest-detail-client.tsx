"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BadgeCheck, CheckCircle2, Circle, Rocket, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-provider"
import { mockQuests } from "@/lib/mock-data"
import { useAccount } from "@starknet-react/core"

export default function QuestDetailClient({ questId }: { questId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { completedQuests, completeQuest } = useUser()
  const [completingSteps, setCompletingSteps] = useState<boolean[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  // Find the quest
  const quest = mockQuests.find((q) => q.id === questId)

  // Check if quest is completed
  const isCompleted = completedQuests.includes(questId)

  // Initialize completing steps
  useEffect(() => {
    if (quest) {
      setCompletingSteps(new Array(quest.steps.length).fill(false))
    }
  }, [quest])

  // Handle if quest not found
  if (!quest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Quest Not Found</h1>
        <p className="text-muted-foreground mb-6">The quest you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/quests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quests
          </Link>
        </Button>
      </div>
    )
  }

  // Handle step completion
  const toggleStepCompletion = (index: number) => {
    const newCompletingSteps = [...completingSteps]
    newCompletingSteps[index] = !newCompletingSteps[index]
    setCompletingSteps(newCompletingSteps)
  }

  // Handle quest completion
  const handleCompleteQuest = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to complete this quest.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Show toast for transaction initiation
      toast({
        title: "Transaction Initiated",
        description: "Please confirm the transaction in your wallet...",
      })

      // Complete the quest and mint the badge
      const result = await completeQuest(quest.id)

      // Set transaction hash (in a real implementation, this would come from the result)
      setTransactionHash("0x" + Math.random().toString(16).slice(2))

      // Show success toast
      toast({
        title: "Quest Completed",
        description: "You've successfully completed the quest and earned a badge!",
      })

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Failed to complete quest:", error)
      toast({
        title: "Transaction Failed",
        description: "Failed to complete quest. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if all steps are completed
  const allStepsCompleted =
    completingSteps.length === quest.steps.length && completingSteps.every((step) => step === true)

  // View transaction on explorer
  const viewTransaction = () => {
    if (!transactionHash) return

    // Determine explorer URL based on network (using testnet for this example)
    const explorerUrl = "https://testnet.starkscan.co/tx/"
    window.open(`${explorerUrl}${transactionHash}`, "_blank")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link href="/quests">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quests
              </Link>
            </Button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{quest.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src={quest.sponsorLogo || "/placeholder.svg"}
                      alt={quest.sponsor}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Sponsored by {quest.sponsor}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm">
                  <Trophy className="h-4 w-4" />
                  <span>{quest.xpReward} XP</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    quest.difficulty === "Easy"
                      ? "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300"
                      : quest.difficulty === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300"
                        : "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300"
                  }`}
                >
                  {quest.difficulty}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quest Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{quest.description}</p>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Criteria:</h3>
                    <p className="text-sm">{quest.criteria}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quest Steps</CardTitle>
                  <CardDescription>Complete these steps to finish the quest</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quest.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => !isCompleted && toggleStepCompletion(index)}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : completingSteps[index] ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">Step {index + 1}</p>
                          <p className="text-sm text-muted-foreground">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  {isCompleted ? (
                    <>
                      <Button className="w-full" disabled>
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        Quest Completed
                      </Button>
                      {transactionHash && (
                        <Button variant="outline" className="w-full" onClick={viewTransaction}>
                          View Transaction
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={!allStepsCompleted || isSubmitting || !isConnected}
                      onClick={handleCompleteQuest}
                    >
                      {isSubmitting ? "Completing..." : "Complete Quest"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src={quest.badgeReward.image || "/placeholder.svg"}
                        alt={quest.badgeReward.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center">{quest.badgeReward.name}</h3>
                    <p className="text-sm text-muted-foreground text-center mt-2">{quest.badgeReward.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quest Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Difficulty</p>
                      <p className="text-sm text-muted-foreground">{quest.difficulty}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium">Estimated Time</p>
                      <p className="text-sm text-muted-foreground">{quest.estimatedTime}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium">XP Reward</p>
                      <p className="text-sm text-muted-foreground">{quest.xpReward} XP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
