import { Suspense } from "react"
import ClaimDetailClient from "./claim-detail-client"
import LoadingClaim from "../loading"

export default function ClaimDetailPage({ params }: { params: { campaignId: string } }) {
  return (
    <Suspense fallback={<LoadingClaim />}>
      <ClaimDetailClient campaignId={params.campaignId} />
    </Suspense>
  )
}
