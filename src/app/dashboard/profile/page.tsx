'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, ClipboardCheck, Edit, Lightbulb, Loader2, ShieldAlert, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function ProfilePage() {
    const { user, appUser, loading } = useAuth();

    if (loading || !user || !appUser) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const getAvatarFallback = () => {
        if (appUser?.displayName) {
            return appUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase();
        }
        if (user.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'U';
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={appUser.photoURL ?? "https://placehold.co/80x80.png"} data-ai-hint="woman smiling" alt={appUser.displayName} />
                            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{appUser.displayName}</h1>
                            <p className="text-muted-foreground capitalize">{appUser.role}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge>Cardiology</Badge>
                                <Badge variant="secondary">{appUser.team ?? 'Team Alpha'}</Badge>
                            </div>
                        </div>
                        <Button variant="outline" className="ml-auto"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {appUser.swot && appUser.path ? (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">SWOT Analysis</CardTitle>
                                <CardDescription>Your professional strengths, weaknesses, opportunities, and threats.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="text-green-600" /> Strengths</h3>
                                    <p className="text-sm text-green-900 whitespace-pre-wrap">{appUser.swot.strengths}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Target className="text-yellow-600" /> Weaknesses</h3>
                                    <p className="text-sm text-yellow-900 whitespace-pre-wrap">{appUser.swot.weaknesses}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="text-blue-600" /> Opportunities</h3>
                                    <p className="text-sm text-blue-900 whitespace-pre-wrap">{appUser.swot.opportunities}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                    <h3 className="font-semibold flex items-center gap-2 mb-2"><ShieldAlert className="text-red-600" /> Threats</h3>
                                    <p className="text-sm text-red-900 whitespace-pre-wrap">{appUser.swot.threats}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Personalized Learning Path</CardTitle>
                                <CardDescription>Courses recommended by your AI mentor to accelerate your growth.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{appUser.path.learningPath}</p>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                            <ClipboardCheck className="text-accent" />
                            Your Compass
                            </CardTitle>
                            <CardDescription>Start your journey by completing the 'A Bússola' assessment to unlock your personalized learning path.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">Your SWOT analysis and course recommendations await.</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/questionnaire">Take Assessment <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}
