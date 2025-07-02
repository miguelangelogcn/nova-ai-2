'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { updateTeamAction } from './actions';
import { type TeamFormInput, TeamFormSchema } from './types';
import { Loader2 } from 'lucide-react';
import type { Team } from '@/services/teams';
import { useAuth } from '@/context/auth-context';

interface EditTeamDialogProps {
  team: Team;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditTeamDialog({ team, isOpen, setIsOpen }: EditTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { appUser } = useAuth();

  const form = useForm<TeamFormInput>({
    resolver: zodResolver(TeamFormSchema),
    defaultValues: {
      name: team.name,
      description: team.description || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: team.name,
        description: team.description || '',
      });
    }
  }, [isOpen, team, form]);

  const onSubmit = async (values: TeamFormInput) => {
    setIsSubmitting(true);
    if (!appUser) {
        toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Você precisa estar logado para editar uma equipe.',
        });
        setIsSubmitting(false);
        return;
    }
    try {
      const result = await updateTeamAction(team.id, values, appUser.uid);
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'A equipe foi atualizada.',
        });
        setIsOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar equipe',
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Equipe</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da equipe. Clique em salvar quando terminar.
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
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                    </>
                    ) : (
                    'Salvar Alterações'
                    )}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
