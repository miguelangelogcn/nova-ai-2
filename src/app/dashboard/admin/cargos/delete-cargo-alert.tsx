'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteCargoAction } from './actions';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface DeleteCargoAlertProps {
  cargoId: string;
  cargoName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function DeleteCargoAlert({ cargoId, cargoName, isOpen, setIsOpen }: DeleteCargoAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { appUser } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    if (!appUser) {
        toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Você precisa estar logado para excluir um cargo.',
        });
        setIsDeleting(false);
        return;
    }
    try {
      const result = await deleteCargoAction(cargoId, appUser.uid);
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: `O cargo "${cargoName}" foi excluído.`,
        });
        setIsOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir cargo',
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
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o cargo{' '}
            <span className="font-bold">{cargoName}</span>.
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
              'Sim, excluir cargo'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
