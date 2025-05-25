// components/FeatureCard.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  content,
  link,
  buttonText,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  content: string;
  link: string;
  buttonText: string;
}) {
  return (
    <Card className="border border-border hover:shadow-md transition-shadow min-h-[400px]">
      <CardHeader>
        <Icon className="h-10 w-10 text-primary mb-2" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
      <CardFooter>
        <Link href={link}>
          <Button variant="outline" className="w-full">
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
