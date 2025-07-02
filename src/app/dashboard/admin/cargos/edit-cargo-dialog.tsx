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
import { useToast } from '@/hooks/use-toast';
import { updateCargoAction } from './actions';
import { type CargoFormInput, CargoFormSchema } from './types';
import { Loader2 } from 'lucide-react';
import type { Cargo } from '@/services/cargos';
import { useAuth } from '@/context/auth-context';

interface EditCargoDialogProps {
  cargo: Cargo;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditCargoDialog({ cargo, isOpen, setIsOpen }: EditCargoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { appUser } = useAuth();

  const form = useForm<CargoFormInput>({
    resolver: zodResolver(CargoFormSchema),
    defaultValues: {
      name: cargo.name,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: cargo.name,
      });
    }
  }, [isOpen, cargo, form]);

  const onSubmit = async (values: CargoFormInput) => {
    setIsSubmitting(true);
    if (!appUser) {
        toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Você precisa estar logado para editar um cargo.',
        });
        setIsSubmitting(false);
        return;
    }
    try {
      const result = await updateCargoAction(cargo.id, values, appUser.uid);
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'O cargo foi atualizado.',
        });
        setIsOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar cargo',
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
          <DialogTitle>Editar Cargo</DialogTitle>
          <DialogDescription>
            Atualize o nome do cargo. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Enfermeiro(a)" {...field} />
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
