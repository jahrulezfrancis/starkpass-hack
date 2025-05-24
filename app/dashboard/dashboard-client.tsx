"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Award, BadgeCheck, ChevronRight, Rocket, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateLevelProgress, truncateAddress } from "@/lib/utils";
import { mockQuests } from "@/lib/mock-data";
import AuthRedirectDialog from "@/components/auth-redirect-dialogue";
import { useAccount } from "@starknet-react/core";
import { useUser } from "@/lib/user-provider";

export default function DashboardClient() {
  const router = useRouter();
  const { address, isConnected, isConnecting, status } = useAccount();
  const {
    badges,
    credentials,
    completedQuests,
    claimableItems,
    xp,
    level,
  } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted && !isConnected) {
      // Handled by AuthRedirectDialog
    }
  }, [isConnected, router, mounted]);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return <DashboardSkeleton />;
  }

  if (mounted && !isConnected && status === "disconnected") {
    return (
      <AuthRedirectDialog message="You need to connect your wallet to access your dashboard." />
    );
  }

  const inProgressQuests = mockQuests
    .filter((quest) => !completedQuests.includes(quest.id))
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>
                  Your progress in the Starknet ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Level {level}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {xp} XP
                    </span>
                  </div>
                  <Progress
                    value={calculateLevelProgress(xp)}
                    className="h-2"
                  />
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">
                        {badges.length}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Badges
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">
                        {credentials.length}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Credentials
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">
                        {completedQuests.length}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Quests
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/profile/${address}`}>
                    View Full Profile
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Recent Badges</CardTitle>
                <CardDescription>Your latest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {badges.slice(0, 3).map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center"
                      >
                        <div className="relative w-16 h-16 mb-2">
                          <Image
                            src={badge.image || "/placeholder.svg"}
                            alt={badge.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-center font-medium">
                          {badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    No badges earned yet
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/quests">
                    Earn More Badges
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Claimable Items</CardTitle>
                <CardDescription>
                  Items available for you to claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                {claimableItems.length > 0 ? (
                  <div className="space-y-4">
                    {claimableItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            From: {item.issuer}
                          </p>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/claim/${item.id}`}>Claim</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    No items to claim right now
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/claim">
                    View All Claimable Items
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">In-Progress Quests</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/quests">View All</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inProgressQuests.length > 0 ? (
                inProgressQuests.map((quest) => (
                  <Card key={quest.id}>
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
                          <span className="text-sm text-muted-foreground">
                            {quest.sponsor}
                          </span>
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
                          <span className="text-muted-foreground">
                            Difficulty:
                          </span>
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
                          <span className="text-muted-foreground">
                            Estimated Time:
                          </span>
                          <span>{quest.estimatedTime}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">
                            Badge Reward: {quest.badgeReward.name}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={`/quests/${quest.id}`}>Start Quest</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-40 bg-muted rounded-lg">
                  <div className="text-center">
                    <Award className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No quests in progress
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link href="/quests">Browse Quests</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Rocket className="h-6 w-6" />
            <span>StarkPass</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium text-primary">Dashboard</span>
            <span className="text-sm font-medium">Quests</span>
            <span className="text-sm font-medium">Profile</span>
            <span className="text-sm font-medium">Claim</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="hidden md:inline-block h-4 w-24" />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>
                  Your progress in the Starknet ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Recent Badges</CardTitle>
                <CardDescription>Your latest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Claimable Items</CardTitle>
                <CardDescription>
                  Items available for you to claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
