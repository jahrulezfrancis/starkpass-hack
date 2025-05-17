import { Suspense } from "react"
import dynamic from "next/dynamic"
import LoadingSpinner from "@/components/loading-spinnet"

// Use dynamic import with SSR disabled to prevent hydration issues
const SettingsClient = dynamic(() => import("../../../components/settings-client"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SettingsClient />
    </Suspense>
  )
}
