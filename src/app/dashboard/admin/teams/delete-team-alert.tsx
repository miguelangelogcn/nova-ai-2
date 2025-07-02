'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteTeamAction } from './actions';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface DeleteTeamAlertProps {
  teamId: string;
  teamName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function DeleteTeamAlert({ teamId, teamName, isOpen, setIsOpen }: DeleteTeamAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { appUser } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    if (!appUser) {
        toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Você precisa estar logado para excluir uma equipe.',
        });
        setIsDeleting(false);
        return;
    }
    try {
      const result = await deleteTeamAction(teamId, appUser.uid);
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: `A equipe "${teamName}" foi excluída.`,
        });
        setIsOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir equipe',
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
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a equipe{' '}
            <span className="font-bold">{teamName}</span> e removerá seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Sim, excluir equipe'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
