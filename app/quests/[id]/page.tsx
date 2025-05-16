import { Suspense } from "react"
import QuestDetailClient from "./quest-detail-client"
import LoadingQuest from "./loading"

export default function QuestDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingQuest />}>
      <QuestDetailClient questId={params.id} />
    </Suspense>
  )
}
