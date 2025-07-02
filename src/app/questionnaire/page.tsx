'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type FieldErrors } from "react-hook-form"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { handleAnalysis } from "./actions"
import { useState } from "react"
import { ArrowRight, Loader2, Zap } from "lucide-react"
import type { AnalysisResult } from "./types"
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { SwotCube } from "../dashboard/profile/swot-cube";
import { useToast } from "@/hooks/use-toast"
import { PersonalizedLearningPlan } from "../dashboard/personalized-learning-plan";

const allQuestions = [
    {
      name: "comunicacaoEmpatica",
      title: "Um paciente idoso recusa a medicação e você está no final do plantão. O que você faz?",
      options: [
        { value: "A) Conversa brevemente, reforça a importância da medicação para evitar atrasos.", label: "Conversa brevemente, reforça a importância da medicação para evitar atrasos." },
        { value: "B) Escuta o motivo da recusa, acolhe e propõe uma nova abordagem.", label: "Escuta o motivo da recusa, acolhe e propõe uma nova abordagem." },
        { value: "C) Anota a recusa e segue com outros atendimentos.", label: "Anota a recusa e segue com outros atendimentos." },
      ],
    },
    {
      name: "gestaoEmocional",
      title: "Você é criticado(a) na frente de colegas por um erro que não cometeu. Como você reage?",
      options: [
        { value: "A) Respira fundo, pede para conversar depois em particular.", label: "Respira fundo, pede para conversar depois em particular." },
        { value: "B) Tolera em silêncio, evita mais tensão, mas fica abalado.", label: "Tolera em silêncio, evita mais tensão, mas fica abalado." },
        { value: "C) Rebate a crítica na hora, para não se sentir diminuído.", label: "Rebate a crítica na hora, para não se sentir diminuído." },
      ],
    },
    {
      name: "trabalhoEquipe",
      title: "Você percebe que um(a) colega esqueceu de administrar uma medicação importante. Qual sua atitude?",
      options: [
        { value: "A) Corrige e comenta depois de forma leve.", label: "Corrige e comenta depois de forma leve." },
        { value: "B) Corrige e conversa no momento, com foco no paciente.", label: "Corrige e conversa no momento, com foco no paciente." },
        { value: "C) Relata à liderança formalmente.", label: "Relata à liderança formalmente." },
      ],
    },
    {
        name: "pensamentoCritico",
        title: "Você se depara com uma prescrição médica com dosagem diferente do habitual. O que você faz?",
        options: [
            { value: "A) Questiona educadamente após revisar histórico e protocolos.", label: "Questiona educadamente após revisar histórico e protocolos." },
            { value: "B) Aplica e documenta dúvida para se resguardar.", label: "Aplica e documenta dúvida para se resguardar." },
            { value: "C) Comenta informalmente com colegas, sem intervir.", label: "Comenta informalmente com colegas, sem intervir." },
        ],
    },
    {
        name: "adaptabilidade",
        title: "Você é remanejado(a) para um novo setor, com processos pouco estruturados. Como você lida com a situação?",
        options: [
            { value: "A) Tenta melhorar o ambiente mesmo que não seja bem recebido.", label: "Tenta melhorar o ambiente mesmo que não seja bem recebido." },
            { value: "B) Cumpre o que pedem e observa o funcionamento.", label: "Cumpre o que pedem e observa o funcionamento." },
            { value: "C) Solicita retorno ao setor antigo.", label: "Solicita retorno ao setor antigo." },
        ],
    },
    {
        name: "posturaEtica",
        title: "Um(a) colega sugere que você anote um procedimento como feito antes de executá-lo para 'agilizar' o plantão. Qual é a sua resposta?",
        options: [
            { value: "A) Sugere anotar juntos depois, reforçando o risco do hábito.", label: "Sugere anotar juntos depois, reforçando o risco do hábito." },
            { value: "B) Diz que prefere não fazer assim, mas respeita o colega.", label: "Diz que prefere não fazer assim, mas respeita o colega." },
            { value: "C) Aceita, pois “todo mundo faz”.", label: "Aceita, pois “todo mundo faz”." },
        ],
    },
    {
        name: "escutaAtiva",
        title: "Um paciente, cujos exames estão normais, insiste que 'algo está errado'. Como você procede?",
        options: [
            { value: "A) Escuta e comunica à equipe como precaução.", label: "Escuta e comunica à equipe como precaução." },
            { value: "B) Tenta tranquilizar e explica que está tudo certo.", label: "Tenta tranquilizar e explica que está tudo certo." },
            { value: "C) Diz que ele já foi avaliado, sem outras ações.", label: "Diz que ele já foi avaliado, sem outras ações." },
        ],
    },
    {
      name: "dianteDeDesafio",
      title: "Diante de um grande desafio, você tende a:",
      options: [
        { value: "A) Agir rapidamente e tomar a liderança para resolver.", label: "Agir rapidamente e tomar a liderança para resolver." },
        { value: "B) Conversar com as pessoas para inspirá-las a colaborar.", label: "Conversar com as pessoas para inspirá-las a colaborar." },
        { value: "C) Manter a calma e apoiar a equipe de forma consistente.", label: "Manter a calma e apoiar a equipe de forma consistente." },
        { value: "D) Analisar todos os detalhes e criar um plano cuidadoso.", label: "Analisar todos os detalhes e criar um plano cuidadoso." },
      ],
    },
    {
      name: "trabalhoEmGrupo",
      title: "Em um trabalho em grupo, seu papel costuma ser:",
      options: [
        { value: "A) O que define as metas e impulsiona o time para a ação.", label: "O que define as metas e impulsiona o time para a ação." },
        { value: "B) O que mantém o ambiente positivo e motiva a todos.", label: "O que mantém o ambiente positivo e motiva a todos." },
        { value: "C) O que garante que todos se sintam incluídos e ouvidos.", label: "O que garante que todos se sintam incluídos e ouvidos." },
        { value: "D) O que organiza as tarefas e verifica a qualidade.", label: "O que organiza as tarefas e verifica a qualidade." },
      ],
    },
    {
      name: "tomadaDeDecisao",
      title: "Ao tomar uma decisão importante, você valoriza mais:",
      options: [
        { value: "A) Resultados rápidos e eficientes.", label: "Resultados rápidos e eficientes." },
        { value: "B) O entusiasmo e a aceitação da equipe.", label: "O entusiasmo e a aceitação da equipe." },
        { value: "C) A segurança e a estabilidade da escolha.", label: "A segurança e a estabilidade da escolha." },
        { value: "D) A precisão e a correção dos dados.", label: "A precisão e a correção dos dados." },
      ],
    },
    {
      name: "ambienteDeTrabalho",
      title: "Você prefere um ambiente de trabalho que seja:",
      options: [
        { value: "A) Competitivo e focado em metas.", label: "Competitivo e focado em metas." },
        { value: "B) Colaborativo e cheio de interações sociais.", label: "Colaborativo e cheio de interações sociais." },
        { value: "C) Harmonioso e previsível.", label: "Harmonioso e previsível." },
        { value: "D) Organizado e com regras claras.", label: "Organizado e com regras claras." },
      ],
    },
    {
      name: "feedback",
      title: "Como você lida com feedback?",
      options: [
        { value: "A) Gosto de feedback direto e focado em como melhorar os resultados.", label: "Gosto de feedback direto e focado em como melhorar os resultados." },
        { value: "B) Prefiro que seja uma conversa amigável e encorajadora.", label: "Prefiro que seja uma conversa amigável e encorajadora." },
        { value: "C) Fico mais confortável com um feedback gentil e que considere meus sentimentos.", label: "Fico mais confortável com um feedback gentil e que considere meus sentimentos." },
        { value: "D) Valorizo um feedback bem detalhado e com exemplos específicos.", label: "Valorizo um feedback bem detalhado e com exemplos específicos." },
      ],
    },
    {
      name: "ritmoDeTrabalho",
      title: "Seu ritmo de trabalho natural é:",
      options: [
        { value: "A) Rápido e decidido, sempre buscando a próxima tarefa.", label: "Rápido e decidido, sempre buscando a próxima tarefa." },
        { value: "B) Entusiasmado e variável, dependendo da minha inspiração.", label: "Entusiasmado e variável, dependendo da minha inspiração." },
        { value: "C) Constante e metódico, finalizando uma coisa de cada vez.", label: "Constante e metódico, finalizando uma coisa de cada vez." },
        { value: "D) Cuidadoso e preciso, mesmo que leve mais tempo.", label: "Cuidadoso e preciso, mesmo que leve mais tempo." },
      ],
    },
    {
      name: "sobPressao",
      title: "Sob pressão, sua primeira reação é:",
      options: [
        { value: "A) Assumir o controle e tomar decisões rápidas.", label: "Assumir o controle e tomar decisões rápidas." },
        { value: "B) Tentar persuadir e negociar com os envolvidos.", label: "Tentar persuadir e negociar com os envolvidos." },
        { value: "C) Buscar apoiar os outros e manter a calma do grupo.", label: "Buscar apoiar os outros e manter a calma do grupo." },
        { value: "D) Focar nos fatos e seguir os procedimentos estabelecidos.", label: "Focar nos fatos e seguir os procedimentos estabelecidos." },
      ],
    },
];

const formSchema = z.object({
    comunicacaoEmpatica: z.string({ required_error: "Por favor, selecione uma opção." }),
    gestaoEmocional: z.string({ required_error: "Por favor, selecione uma opção." }),
    trabalhoEquipe: z.string({ required_error: "Por favor, selecione uma opção." }),
    pensamentoCritico: z.string({ required_error: "Por favor, selecione uma opção." }),
    adaptabilidade: z.string({ required_error: "Por favor, selecione uma opção." }),
    posturaEtica: z.string({ required_error: "Por favor, selecione uma opção." }),
    escutaAtiva: z.string({ required_error: "Por favor, selecione uma opção." }),
    dianteDeDesafio: z.string({ required_error: "Por favor, selecione uma opção." }),
    trabalhoEmGrupo: z.string({ required_error: "Por favor, selecione uma opção." }),
    tomadaDeDecisao: z.string({ required_error: "Por favor, selecione uma opção." }),
    ambienteDeTrabalho: z.string({ required_error: "Por favor, selecione uma opção." }),
    feedback: z.string({ required_error: "Por favor, selecione uma opção." }),
    ritmoDeTrabalho: z.string({ required_error: "Por favor, selecione uma opção." }),
    sobPressao: z.string({ required_error: "Por favor, selecione uma opção." }),
});

export default function QuestionnairePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const { user, loading, refreshAppUser } = useAuth();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            console.error("User not authenticated");
            toast({
                title: "Erro de Autenticação",
                description: "Usuário não autenticado. Por favor, faça login novamente.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await handleAnalysis(values, user.uid);
            setAnalysisResult(result);
            await refreshAppUser();
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Erro na Análise",
                description: error.message || "Não foi possível gerar sua análise. Por favor, tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    function onInvalid(errors: FieldErrors) {
        toast({
            title: "Formulário Incompleto",
            description: "Por favor, responda a todas as perguntas antes de gerar a análise.",
            variant: "destructive",
        })
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
                <h2 className="text-2xl font-headline text-center">Analisando suas respostas...</h2>
                <p className="text-muted-foreground">Sua análise personalizada está sendo gerada pela IA.</p>
            </div>
        )
    }

    if (analysisResult) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 py-12">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center">
                        <Zap className="w-8 h-8"/>
                    </div>
                    <h1 className="font-headline text-3xl mt-4">Sua Análise está Pronta!</h1>
                    <p className="text-muted-foreground">Ótimo trabalho! Explore os resultados abaixo e continue para o seu painel.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Análise Swot Pessoal</CardTitle>
                        <CardDescription>Sua análise mais recente. Gire o cubo para explorar suas forças, fraquezas, oportunidades e ameaças.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SwotCube swot={analysisResult.swot} />
                    </CardContent>
                </Card>

                {analysisResult.learningPath && (
                    <PersonalizedLearningPlan learningPath={analysisResult.learningPath} />
                )}

                <div className="text-center pt-4">
                    <Button asChild size="lg">
                        <Link href="/dashboard">Ir para o Painel <ArrowRight className="ml-2"/></Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Card className="max-w-3xl mx-auto my-8">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">A Bússola - Seu Guia de Desenvolvimento</CardTitle>
                <CardDescription>Sua Bússola de desenvolvimento precisa ser calibrada. Esta etapa é obrigatória para acessar a plataforma. Suas respostas nos ajudarão a guiar sua jornada.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-headline mb-6 border-b pb-2">Análise Comportamental</h2>
                            <div className="space-y-8">
                                {allQuestions.map((q) => (
                                    <FormField
                                        key={q.name}
                                        control={form.control}
                                        name={q.name as keyof z.infer<typeof formSchema>}
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="font-bold text-base">{q.title}</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-2 pt-2"
                                                    >
                                                        {q.options.map((opt) => (
                                                            <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-transparent has-[:checked]:border-primary has-[:checked]:bg-muted">
                                                                <FormControl>
                                                                    <RadioGroupItem value={opt.value} />
                                                                </FormControl>
                                                                <FormLabel className="font-normal cursor-pointer flex-1">{opt.label}</FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-headline mb-4 border-b pb-2">Análise Técnica</h2>
                            <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">A seção de análise técnica está em desenvolvimento.</p>
                                <p className="text-sm text-muted-foreground">Em breve, você poderá avaliar suas habilidades técnicas aqui.</p>
                            </div>
                        </div>

                        <Button type="submit" className="w-full !mt-12" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4"/>}
                            Gerar Minha Análise
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
