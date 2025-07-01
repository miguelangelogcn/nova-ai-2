import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, BookOpen, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Welcome back, Jane!</h1>
                <p className="text-muted-foreground">Here's your progress summary. Keep up the great work!</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col">
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

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Bot className="text-accent" />
                            AI Mentor
                        </CardTitle>
                        <CardDescription>Have a question? Your AI Mentor is available 24/7 to help you with any clinical or procedural doubts.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm bg-muted p-3 rounded-lg">"What are the 5 rights of medication administration?"</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/mentor">Chat Now <ArrowRight className="ml-2" /></Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <BookOpen className="text-accent" />
                            Learning Path
                        </CardTitle>
                        <CardDescription>Explore courses tailored for you. Here's your current progress.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>Overall Progress</span>
                                <span>35%</span>
                            </div>
                            <Progress value={35} />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/courses">Explore Courses <ArrowRight className="ml-2" /></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
