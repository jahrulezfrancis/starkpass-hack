export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  issuer: string;
  issuedAt: string;
}

export interface Credential {
  id: string;
  name: string;
  description: string;
  image: string;
  issuer: string;
  issuedAt: string;
  tokenId: string;
  contractAddress: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  sponsorLogo: string;
  xpReward: number;
  criteria: string;
  steps: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  badgeReward: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  sponsorLogo: string;
  startDate: string;
  endDate: string;
  credentialImage: string;
  totalClaims: number;
  maxClaims: number;
  credentialId: string;
}

export interface User {
  address: string;
  badges: Badge[];
  credentials: Credential[];
  completedQuests: string[];
  xp: number;
  level: number;
}
