import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket } from "lucide-react"

export default function LoadingDashboard() {
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
            {/* User Stats Card Skeleton */}
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>Your progress in the Starknet ecosystem</CardDescription>
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

            {/* Recent Badges Card Skeleton */}
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

            {/* Claimable Items Card Skeleton */}
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Claimable Items</CardTitle>
                <CardDescription>Items available for you to claim</CardDescription>
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
  )
}
