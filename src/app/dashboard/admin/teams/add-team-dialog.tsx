'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addTeamAction } from './actions';
import { PlusCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome da equipe deve ter pelo menos 2 caracteres.' }),
  description: z.string().optional(),
});

type AddTeamFormValues = z.infer<typeof formSchema>;

export function AddTeamDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddTeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (values: AddTeamFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addTeamAction(values);
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'A nova equipe foi criada.',
        });
        setOpen(false);
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao criar equipe',
          description: result.error || 'Ocorreu um erro desconhecido.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro inesperado',
        description: 'Não foi possível se comunicar com o servidor.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Equipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Equipe</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para adicionar uma nova equipe à plataforma.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Equipe</FormLabel>
                  <FormControl>
                    <Input placeholder="Equipe de Cardiologia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o propósito ou os membros da equipe (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                    </>
                    ) : (
                    'Criar Equipe'
                    )}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
