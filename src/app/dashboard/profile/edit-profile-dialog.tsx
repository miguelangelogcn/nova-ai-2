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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateProfileAction } from './actions';
import { type EditProfileInput, EditProfileSchema } from './types';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface EditProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditProfileDialog({ isOpen, setIsOpen }: EditProfileDialogProps) {
  const { appUser, refreshAppUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EditProfileInput>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      displayName: appUser?.displayName || '',
      email: appUser?.email || '',
      password: '',
      age: appUser?.age || '',
      education: appUser?.education || '',
      phone: appUser?.phone || '',
      cpf: appUser?.cpf || '',
    },
  });

  useEffect(() => {
    if (isOpen && appUser) {
      form.reset({
        displayName: appUser.displayName,
        email: appUser.email,
        password: '',
        age: appUser.age || '',
        education: appUser.education || '',
        phone: appUser.phone || '',
        cpf: appUser.cpf || '',
      });
    }
  }, [isOpen, appUser, form]);

  const onSubmit = async (values: EditProfileInput) => {
    if (!appUser) return;
    setIsSubmitting(true);
    try {
      const result = await updateProfileAction(appUser.uid, values);
      if (result.success) {
        await refreshAppUser();
        toast({
          title: 'Sucesso!',
          description: 'Seu perfil foi atualizado.',
        });
        setIsOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar perfil',
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
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize seus dados pessoais. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jane.doe@hospital.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>Deixe em branco para não alterar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua idade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolaridade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua formação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="123.456.789-00" {...field} />
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
