'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { handleAnalysis } from "./actions"
import { useState } from "react"
import { ArrowRight, Loader2, Zap } from "lucide-react"
import type { AnalysisResult } from "./types"
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const formSchema = z.object({
    confidence: z.string().nonempty({ message: "Please select a confidence level." }),
    conflict: z.string().nonempty({ message: "Please describe how you handle conflicts." }),
    procedures: z.string().nonempty({ message: "Please describe your familiarity with procedures." }),
    difficultNews: z.string().nonempty({ message: "Please describe your experience." }),
});

export default function QuestionnairePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const { user } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            confidence: "",
            conflict: "",
            procedures: "",
            difficultNews: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            // Should not happen if page is protected
            console.error("User not authenticated");
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await handleAnalysis(values, user.uid);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            // Here you would show a toast notification
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-2xl font-headline text-center">Analyzing your responses...</h2>
                <p className="text-muted-foreground">Your personalized SWOT analysis and learning path are being generated.</p>
            </div>
        )
    }

    if (analysisResult) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                 <Card className="text-center">
                    <CardHeader>
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center">
                            <Zap className="w-8 h-8"/>
                        </div>
                        <CardTitle className="font-headline text-3xl mt-4">Your Analysis is Ready!</CardTitle>
                        <CardDescription>Here is your personalized SWOT analysis and recommended learning path to guide your professional development.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Separator className="my-4"/>
                        <h3 className="text-xl font-bold font-headline">SWOT Analysis</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-left mt-4">
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Strengths</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.strengths}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Weaknesses</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.weaknesses}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Opportunities</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.opportunities}</p>
                            </div>
                             <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Threats</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.threats}</p>
                            </div>
                        </div>
                        <Separator className="my-6"/>
                        <h3 className="text-xl font-bold font-headline">Personalized Learning Path</h3>
                        <p className="text-sm text-muted-foreground mt-4 text-left whitespace-pre-wrap">{analysisResult.path.learningPath}</p>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button asChild>
                            <Link href="/dashboard/profile">View on My Profile <ArrowRight className="ml-2"/></Link>
                        </Button>
                        <Button variant="link" onClick={() => setAnalysisResult(null)}>Take assessment again</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">A Bússola - Your Compass</CardTitle>
                <CardDescription>Answer these questions honestly to help us build your personalized growth plan.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="confidence"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>How confident are you in performing venipuncture (drawing blood)?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="very_confident" /></FormControl>
                                        <FormLabel className="font-normal">Very Confident</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="confident" /></FormControl>
                                        <FormLabel className="font-normal">Confident</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="neutral" /></FormControl>
                                        <FormLabel className="font-normal">Neutral</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="not_confident" /></FormControl>
                                        <FormLabel className="font-normal">Not Very Confident</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="conflict"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>How do you typically handle a conflict or disagreement with a colleague over patient care?</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe your approach..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="procedures"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Which of these advanced procedures are you most familiar with? (e.g., inserting a PICC line, managing a ventilator, etc.)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="List procedures and your familiarity level..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="difficultNews"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Describe a time you had to deliver difficult news to a patient's family. How did you approach it?</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the situation and your actions..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4"/>}
                            Generate My Analysis
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
