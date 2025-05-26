"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Upload } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from "@starknet-react/core";
import { useContract } from "@/lib/contract-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CreateCampaignClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { createCampaign } = useContract();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    maxClaims: 100,
    eligibilityType: "open",
    image: null as File | null,
  });

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to home if not connected
  useEffect(() => {
    if (mounted && !isConnected) {
      toast({
        title: "Authentication Required",
        description:
          "Please connect your wallet to access the sponsor dashboard.",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [isConnected, router, mounted, toast]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }));
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a campaign title.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Missing Description",
        description: "Please enter a campaign description.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.endDate <= formData.startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.image) {
      toast({
        title: "Missing Image",
        description: "Please upload a credential image.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setShowConfirmDialog(true);
  };

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a campaign.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create campaign metadata
      const campaignMetadata = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        maxClaims: Number(formData.maxClaims),
        eligibilityType: formData.eligibilityType,
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : "",
      };

      // In a real implementation, this would upload the image to IPFS and create a campaign on the blockchain
      await createCampaign(campaignMetadata);

      toast({
        title: "Campaign Created",
        description: "Your claim campaign has been created successfully.",
      });

      // Redirect to sponsor dashboard
      router.push("/sponsor");
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isConnected) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/sponsor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sponsor Dashboard
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Claim Campaign</CardTitle>
                <CardDescription>
                  Create a new credential claim campaign for your community
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Starknet Hackathon 2025 POAP"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Campaign Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what this credential represents and who is eligible to claim it"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <DatePicker
                        date={formData.startDate}
                        onSelect={(date) => handleDateChange("startDate", date)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <DatePicker
                        date={formData.endDate}
                        onSelect={(date) => handleDateChange("endDate", date)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxClaims">Maximum Claims</Label>
                      <Input
                        id="maxClaims"
                        name="maxClaims"
                        type="number"
                        min="1"
                        value={formData.maxClaims}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eligibilityType">Eligibility Type</Label>
                      <Select
                        value={formData.eligibilityType}
                        onValueChange={(value) =>
                          handleSelectChange("eligibilityType", value)
                        }
                      >
                        <SelectTrigger id="eligibilityType">
                          <SelectValue placeholder="Select eligibility type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open to All</SelectItem>
                          <SelectItem value="allowlist">Allowlist</SelectItem>
                          <SelectItem value="token-gated">
                            Token Gated
                          </SelectItem>
                          <SelectItem value="quest-completion">
                            Quest Completion
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Credential Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                      {formData.image ? (
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32 mb-4">
                            <img
                              src={
                                URL.createObjectURL(formData.image) ||
                                "/placeholder.svg"
                              }
                              alt="Credential Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {formData.image.name}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, image: null }))
                            }
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop or click to upload
                          </p>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById("image")?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this campaign? This will deploy a
              smart contract to the Starknet blockchain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCreateCampaign}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
