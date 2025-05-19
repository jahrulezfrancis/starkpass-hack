"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Rocket, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { mockCampaigns } from "@/lib/mock-data";
import { useAccount } from "@starknet-react/core";

export default function ClaimPage() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter campaigns based on search
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    return (
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">StarkClaim</h1>
              <p className="text-muted-foreground">
                Claim your on-chain credentials and NFTs
              </p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={campaign.credentialImage || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-6 h-6">
                      <Image
                        src={campaign.sponsorLogo || "/placeholder.svg"}
                        alt={campaign.sponsor}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {campaign.sponsor}
                    </span>
                  </div>
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Available until:</span>
                      </div>
                      <span>{formatDate(campaign.endDate)}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Claimed:</span>
                        <span>
                          {campaign.totalClaims} / {campaign.maxClaims}
                        </span>
                      </div>
                      <Progress
                        value={
                          (campaign.totalClaims / campaign.maxClaims) * 100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Eligibility:</span>
                      </div>
                      <span className="text-green-500">Eligible</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/claim/${campaign.id}`}>Claim Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
