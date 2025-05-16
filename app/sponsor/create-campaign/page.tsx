import { Suspense } from "react"
import CreateCampaignClient from "./create-campaign-client"
import LoadingSpinner from "@/components/loading-spinnet"

export default function CreateCampaignPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateCampaignClient />
    </Suspense>
  )
}
