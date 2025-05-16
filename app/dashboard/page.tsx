"use client"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import LoadingDashboard from "./loading"


const DashboardClient = dynamic(
  () => import("./dashboard-client").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingDashboard />,
  }
)

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <DashboardClient />
    </Suspense>
  )
}
