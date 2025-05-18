import { Suspense } from "react"
import ProfileClient from "./profile-client"

export default async function ProfilePage({ params }: { params: { address: string } }) {
  const { address } = await params

  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileClient userAddress={address} />
    </Suspense>
  )
}
