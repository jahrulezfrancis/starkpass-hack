import Link from "next/link"
import Image from "next/image"
import { BadgeCheck, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Quest } from "@/types"

interface QuestCardProps {
  quest: Quest
  isCompleted?: boolean
}

export default function QuestCard({ quest, isCompleted = false }: QuestCardProps) {
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
