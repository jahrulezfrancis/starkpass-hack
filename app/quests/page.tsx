"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { BadgeCheck, Filter, Rocket, Search, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/lib/user-provider"
import { mockQuests } from "@/lib/mock-data"
import type { Quest } from "@/types"
import { useAccount } from "@starknet-react/core"

export default function QuestsPage() {
  const { address } = useAccount()
  const { completedQuests } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  // Filter quests based on search and difficulty
  const filteredQuests = mockQuests.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.sponsor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDifficulty =
      difficultyFilter === "all" || quest.difficulty.toLowerCase() === difficultyFilter.toLowerCase()

    return matchesSearch && matchesDifficulty
  })

  // Separate completed and available quests
  const availableQuests = filteredQuests.filter((quest) => !completedQuests.includes(quest.id))
  const userCompletedQuests = filteredQuests.filter((quest) => completedQuests.includes(quest.id))

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
            <Link href="/quests" className="text-sm font-medium text-primary">
              Quests
            </Link>
            <Link href={`/profile/${address}`} className="text-sm font-medium">
              Profile
            </Link>
            <Link href="/claim" className="text-sm font-medium">
              Claim
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
              <h1 className="text-3xl font-bold mb-2">Quest Board</h1>
              <p className="text-muted-foreground">Complete quests, earn rewards, and build your on-chain reputation</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search quests..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Available Quests */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Available Quests</h2>
            {availableQuests.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} isCompleted={false} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                <div className="text-center">
                  <Trophy className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No quests match your filters</p>
                </div>
              </div>
            )}
          </div>

          {/* Completed Quests */}
          {userCompletedQuests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Quests</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userCompletedQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} isCompleted={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function QuestCard({ quest, isCompleted }: { quest: Quest; isCompleted: boolean }) {
  return (
    <Card className={isCompleted ? "border-green-200 bg-green-50/30 dark:bg-green-950/10" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src={quest.sponsorLogo || "/placeholder.svg"}
                alt={quest.sponsor}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-sm text-muted-foreground">{quest.sponsor}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-yellow-500">
            <Trophy className="h-4 w-4" />
            <span>{quest.xpReward} XP</span>
          </div>
        </div>
        <CardTitle className="text-lg">{quest.title}</CardTitle>
        <CardDescription>{quest.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Difficulty:</span>
            <span
              className={
                quest.difficulty === "Easy"
                  ? "text-green-500"
                  : quest.difficulty === "Medium"
                    ? "text-yellow-500"
                    : "text-red-500"
              }
            >
              {quest.difficulty}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated Time:</span>
            <span>{quest.estimatedTime}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Badge Reward: {quest.badgeReward.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isCompleted ? (
          <Button variant="outline" className="w-full" disabled>
            <BadgeCheck className="mr-2 h-4 w-4 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/quests/${quest.id}`}>Start Quest</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
