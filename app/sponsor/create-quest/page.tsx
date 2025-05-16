import { Suspense } from "react"
import CreateQuestClient from "./create-quest-client"
import LoadingSpinner from "@/components/loading-spinnet"

export default function CreateQuestPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateQuestClient />
    </Suspense>
  )
}
