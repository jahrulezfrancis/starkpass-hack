import type { Badge, Credential, Quest, Campaign } from "@/types"

// Mock badges
export const mockBadges: Badge[] = [
  {
    id: "badge-1",
    name: "Early Adopter",
    description: "One of the first to join StarkPass",
    image: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=200&width=200",
    issuer: "StarkPass",
    issuedAt: new Date("2023-01-15").toISOString(),
  },
  {
    id: "badge-2",
    name: "Quest Master",
    description: "Completed 5 quests",
    image: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=200&width=200",
    issuer: "StarkPass",
    issuedAt: new Date("2023-02-20").toISOString(),
  },
  {
    id: "badge-3",
    name: "Starknet Pioneer",
    description: "Active participant in the Starknet ecosystem",
    image: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=200&width=200",
    issuer: "Starknet Foundation",
    issuedAt: new Date("2023-03-10").toISOString(),
  },
]

// Mock credentials
export const mockCredentials: Credential[] = [
  {
    id: "cred-1",
    name: "Starknet Hackathon 2023",
    description: "Participated in the Starknet Hackathon 2023",
    image: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=300&width=300",
    issuer: "Starknet Foundation",
    issuedAt: new Date("2023-04-05").toISOString(),
    tokenId: "1234",
    contractAddress: "0x1234567890abcdef",
  },
  {
    id: "cred-2",
    name: "Cairo Workshop",
    description: "Completed the Cairo Smart Contract Workshop",
    image: "https://i.ibb.co/Qjq17ZHQ/Cairo-logo-500x500.png?height=300&width=300",
    issuer: "StarkWare",
    issuedAt: new Date("2023-05-12").toISOString(),
    tokenId: "5678",
    contractAddress: "0x1234567890abcdef",
  },
  {
    id: "cred-3",
    name: "Starknet Contributor",
    description: "Contributed to the Starknet ecosystem",
    image: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=300&width=300",
    issuer: "Starknet Foundation",
    issuedAt: new Date("2023-06-20").toISOString(),
    tokenId: "9012",
    contractAddress: "0x1234567890abcdef",
  },
]

// Mock quests
export const mockQuests: Quest[] = [
  {
    id: "quest-1",
    title: "Welcome to StarkPass",
    description: "Complete your profile and connect your wallet",
    sponsor: "StarkPass",
    sponsorLogo: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=100&width=100",
    xpReward: 100,
    criteria: "Connect wallet and visit your profile page",
    steps: ["Connect your wallet", "Visit your profile page", "Update your profile information"],
    difficulty: "Easy",
    estimatedTime: "5 minutes",
    badgeReward: {
      id: "badge-welcome",
      name: "Welcome Badge",
      description: "Completed the welcome quest",
      image: "https://i.ibb.co/03BDpw5/starknet-hackathon.png?height=200&width=200",
    },
  },
  {
    id: "quest-2",
    title: "Starknet Explorer",
    description: "Learn how to use Starknet Explorer and verify transactions",
    sponsor: "StarkWare",
    sponsorLogo: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=100&width=100",
    xpReward: 200,
    criteria: "Complete a transaction and verify it on Starknet Explorer",
    steps: ["Make a simple transaction on Starknet", "Visit Starknet Explorer", "Find and verify your transaction"],
    difficulty: "Medium",
    estimatedTime: "15 minutes",
    badgeReward: {
      id: "badge-explorer",
      name: "Explorer Badge",
      description: "Learned to use Starknet Explorer",
      image: "https://i.ibb.co/03BDpw5/starknet-hackathon.png?height=200&width=200",
    },
  },
  {
    id: "quest-3",
    title: "Cairo Smart Contract Basics",
    description: "Learn the basics of Cairo smart contract development",
    sponsor: "StarkWare Academy",
    sponsorLogo: "https://i.ibb.co/Qjq17ZHQ/Cairo-logo-500x500.png?height=100&width=100",
    xpReward: 300,
    criteria: "Complete the Cairo basics tutorial and deploy a simple contract",
    steps: [
      "Complete the Cairo basics tutorial",
      "Write a simple smart contract",
      "Deploy your contract to Starknet testnet",
    ],
    difficulty: "Hard",
    estimatedTime: "2 hours",
    badgeReward: {
      id: "badge-cairo",
      name: "Cairo Developer",
      description: "Completed Cairo smart contract basics",
      image: "https://i.ibb.co/nswTFcGH/Cairo-workshop.png?height=200&width=200",
    },
  },
  {
    id: "quest-4",
    title: "Community Engagement",
    description: "Engage with the Starknet community on Discord and Twitter",
    sponsor: "Starknet Foundation",
    sponsorLogo: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=100&width=100",
    xpReward: 150,
    criteria: "Join Discord, follow Twitter, and participate in discussions",
    steps: ["Join the Starknet Discord server", "Follow Starknet on Twitter", "Participate in a community discussion"],
    difficulty: "Easy",
    estimatedTime: "30 minutes",
    badgeReward: {
      id: "badge-community",
      name: "Community Member",
      description: "Active member of the Starknet community",
      image: "https://i.ibb.co/03BDpw5/starknet-hackathon.png?height=200&width=200",
    },
  },
  {
    id: "quest-5",
    title: "NFT Collection",
    description: "Collect your first NFT on Starknet",
    sponsor: "Starknet NFT Project",
    sponsorLogo: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=100&width=100",
    xpReward: 200,
    criteria: "Mint or purchase an NFT on Starknet",
    steps: ["Find an NFT project on Starknet", "Mint or purchase an NFT", "View your NFT in your wallet"],
    difficulty: "Medium",
    estimatedTime: "45 minutes",
    badgeReward: {
      id: "badge-collector",
      name: "NFT Collector",
      description: "Collected your first NFT on Starknet",
      image: "https://i.ibb.co/03BDpw5/starknet-hackathon.png?height=200&width=200",
    },
  },
]

// Mock completed quests
export const mockCompletedQuests: string[] = ["quest-1", "quest-2"]

// Mock claim campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    title: "Starknet Hackathon 2023 POAP",
    description: "Claim your POAP for participating in the Starknet Hackathon 2023",
    sponsor: "Starknet Foundation",
    sponsorLogo: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=100&width=100",
    startDate: new Date("2023-04-01").toISOString(),
    endDate: new Date("2023-05-01").toISOString(),
    credentialImage: "https://i.ibb.co/03BDpw5/starknet-hackathon.png?height=300&width=300",
    totalClaims: 250,
    maxClaims: 500,
  },
  {
    id: "campaign-2",
    title: "Cairo Workshop Certificate",
    description: "Claim your certificate for completing the Cairo Workshop",
    sponsor: "StarkWare",
    sponsorLogo: "https://i.ibb.co/Qjq17ZHQ/Cairo-logo-500x500.png?height=100&width=100",
    startDate: new Date("2023-05-01").toISOString(),
    endDate: new Date("2023-06-01").toISOString(),
    credentialImage: "https://i.ibb.co/nswTFcGH/Cairo-workshop.png?height=300&width=300",
    totalClaims: 120,
    maxClaims: 200,
  },
  {
    id: "campaign-3",
    title: "Starknet Community Contributor",
    description: "Recognition for active contributors to the Starknet ecosystem",
    sponsor: "Starknet Foundation",
    sponsorLogo: "https://i.ibb.co/1fkFcvcZ/SN-Symbol-Gradient.png?height=100&width=100",
    startDate: new Date("2023-06-01").toISOString(),
    endDate: new Date("2023-07-01").toISOString(),
    credentialImage: "https://i.ibb.co/jvG6M86y/starknet-community.png?height=300&width=300",
    totalClaims: 75,
    maxClaims: 100,
  },
]

// Mock ecosystem stats
export const mockEcosystemStats = {
  totalUsers: 1250,
  totalQuests: 15,
  totalCampaigns: 8,
  totalCredentials: 3500,
  activeUsers: {
    daily: 120,
    weekly: 450,
    monthly: 850,
  },
  topContributors: [
    { address: "0x1234...5678", completedQuests: 12, credentials: 8 },
    { address: "0x2345...6789", completedQuests: 10, credentials: 7 },
    { address: "0x3456...7890", completedQuests: 9, credentials: 6 },
    { address: "0x4567...8901", completedQuests: 8, credentials: 5 },
    { address: "0x5678...9012", completedQuests: 7, credentials: 4 },
  ],
  popularQuests: [
    { id: "quest-1", title: "Welcome to StarkPass", completions: 850 },
    { id: "quest-2", title: "Starknet Explorer", completions: 650 },
    { id: "quest-4", title: "Community Engagement", completions: 450 },
    { id: "quest-5", title: "NFT Collection", completions: 350 },
    { id: "quest-3", title: "Cairo Smart Contract Basics", completions: 250 },
  ],
  successfulCampaigns: [
    { id: "campaign-1", title: "Starknet Hackathon 2023 POAP", claimRate: "50%" },
    { id: "campaign-2", title: "Cairo Workshop Certificate", claimRate: "60%" },
    { id: "campaign-3", title: "Starknet Community Contributor", claimRate: "75%" },
  ],
}


// Export the functions that are being imported elsewhere
export function getMockBadges(): Badge[] {
  return mockBadges
}

export function getMockCredentials(): Credential[] {
  return mockCredentials
}

export function getMockStats() {
  return {
    users: mockEcosystemStats.totalUsers,
    quests: mockEcosystemStats.totalQuests,
    campaigns: mockEcosystemStats.totalCampaigns,
    badgesIssued: mockEcosystemStats.totalCredentials,
  }
}