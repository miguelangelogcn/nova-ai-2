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
    confidence: z.string().nonempty({ message: "Por favor, selecione um nível de confiança." }),
    conflict: z.string().nonempty({ message: "Por favor, descreva como você lida com conflitos." }),
    procedures: z.string().nonempty({ message: "Por favor, descreva sua familiaridade com procedimentos." }),
    difficultNews: z.string().nonempty({ message: "Por favor, descreva sua experiência." }),
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
                <h2 className="text-2xl font-headline text-center">Analisando suas respostas...</h2>
                <p className="text-muted-foreground">Sua análise SWOT e plano de aprendizado personalizados estão sendo gerados.</p>
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
                        <CardTitle className="font-headline text-3xl mt-4">Sua Análise está Pronta!</CardTitle>
                        <CardDescription>Aqui está sua análise SWOT personalizada e o plano de aprendizado recomendado para guiar seu desenvolvimento profissional.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Separator className="my-4"/>
                        <h3 className="text-xl font-bold font-headline">Análise SWOT</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-left mt-4">
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Forças</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.strengths}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Fraquezas</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.weaknesses}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Oportunidades</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.opportunities}</p>
                            </div>
                             <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold">Ameaças</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.swot.threats}</p>
                            </div>
                        </div>
                        <Separator className="my-6"/>
                        <h3 className="text-xl font-bold font-headline">Plano de Aprendizagem Personalizado</h3>
                        <p className="text-sm text-muted-foreground mt-4 text-left whitespace-pre-wrap">{analysisResult.path.learningPath}</p>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button asChild>
                            <Link href="/dashboard/profile">Ver no Meu Perfil <ArrowRight className="ml-2"/></Link>
                        </Button>
                        <Button variant="link" onClick={() => setAnalysisResult(null)}>Fazer avaliação novamente</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">A Bússola - Seu Guia</CardTitle>
                <CardDescription>Responda a estas perguntas honestamente para nos ajudar a construir seu plano de crescimento personalizado.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="confidence"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Quão confiante você está para realizar uma punção venosa (coletar sangue)?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="very_confident" /></FormControl>
                                        <FormLabel className="font-normal">Muito Confiante</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="confident" /></FormControl>
                                        <FormLabel className="font-normal">Confiante</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="neutral" /></FormControl>
                                        <FormLabel className="font-normal">Neutro</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="not_confident" /></FormControl>
                                        <FormLabel className="font-normal">Pouco Confiante</FormLabel>
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
                                <FormLabel>Como você normalmente lida com um conflito ou desacordo com um colega sobre o cuidado do paciente?</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Descreva sua abordagem..." {...field} />
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
                                <FormLabel>Com quais destes procedimentos avançados você está mais familiarizado? (ex: inserir um cateter PICC, gerenciar um ventilador, etc.)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Liste os procedimentos e seu nível de familiaridade..." {...field} />
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
                                <FormLabel>Descreva uma vez que você teve que dar notícias difíceis para a família de um paciente. Como você abordou a situação?</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Descreva a situação e suas ações..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4"/>}
                            Gerar Minha Análise
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
