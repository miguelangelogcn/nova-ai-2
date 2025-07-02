'use client';
import React, { useState, useRef, useEffect } from 'react';
import { User, CornerDownLeft, Loader2, Sparkles, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { handleAuroraChat, startAuroraConversationAction } from './actions';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AuroraAssistantPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { appUser } = useAuth();
  const { toast } = useToast();


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading]);
  
  const handleStartConversation = async () => {
    if (!appUser) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Você precisa estar logado.'});
        return;
    }
    setIsStarting(true);
    try {
        const result = await startAuroraConversationAction(appUser.uid);
        if (result.success && result.conversationId) {
            setConversationId(result.conversationId);
            setMessages([]); // Clear messages from previous session if any
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: result.error });
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível iniciar a conversa.' });
    } finally {
        setIsStarting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !conversationId) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      const result = await handleAuroraChat(conversationId, currentInput, chatHistory);
      
      if (result.success) {
        const assistantMessage: Message = { role: 'assistant', content: result.response };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = { role: 'assistant', content: result.response };
        setMessages((prev) => [...prev, errorMessage]);
      }
      
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Desculpe, encontrei um erro inesperado. Por favor, tente novamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAvatarFallback = () => {
    if (appUser?.displayName) {
        return appUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase();
    }
    return 'G'; // Gestor
  };

  if (!conversationId) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center justify-center gap-2">
                        <Sparkles /> Aurora | Assistente do Gestor
                    </CardTitle>
                    <CardDescription>
                        Sua assistente de IA para análises de dados, insights sobre o engajamento da equipe e mais.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">Inicie uma nova conversa para começar a fazer suas perguntas.</p>
                    <Button onClick={handleStartConversation} disabled={isStarting}>
                        {isStarting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                        )}
                        Iniciar Nova Conversa
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles /> Aurora | Assistente do Gestor
              </CardTitle>
              <CardDescription>
                Sua assistente de IA. Peça análises de dados, insights sobre o engajamento da equipe e mais.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setConversationId(null)}>
                Nova Conversa
            </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4 -mr-4" >
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-transparent"><Sparkles size={18} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg shadow-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="w-8 h-8">
                      <AvatarImage src={appUser?.photoURL || "https://placehold.co/40x40.png"} data-ai-hint="mulher sorrindo" alt={appUser?.displayName || 'User'} />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-transparent"><Sparkles size={18} /></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-card flex items-center shadow-sm">
                        <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte à Aurora..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button size="icon" type="submit" disabled={isLoading || !input.trim()}>
              <CornerDownLeft />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
