import { Suspense } from "react"
import ProfileClient from "./profile-client"

export default function ProfilePage({ params }: { params: { address: string } }) {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileClient userAddress={params.address} />
    </Suspense>
  )
}
