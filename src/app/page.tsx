import { NursePathLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full shadow-2xl">
        <CardHeader className="space-y-2 text-center">
            <div className="inline-block mx-auto text-primary">
                <NursePathLogo className="w-14 h-14" />
            </div>
          <CardTitle className="text-3xl font-headline">Welcome to NursePath</CardTitle>
          <CardDescription>Enter your credentials to access your growth journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jane.doe@hospital.com" required />
            </div>
            <div className="space-y-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </Link>
                </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full !mt-6" asChild>
                <Link href="/dashboard">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
