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
import { updateTeamAction, assignUserToTeamAction, unassignUserFromTeamAction } from './actions';
import { type TeamFormInput, TeamFormSchema } from './types';
import { Check, ChevronsUpDown, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import type { Team } from '@/services/teams';
import { useAuth } from '@/context/auth-context';
import type { AppUser } from '@/services/user';
import { getUsersAction } from '../users/actions';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditTeamDialogProps {
  team: Team;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditTeamDialog({ team, isOpen, setIsOpen }: EditTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { appUser } = useAuth();

  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [teamMembers, setTeamMembers] = useState<AppUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AppUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUpdatingMembers, setIsUpdatingMembers] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm<TeamFormInput>({
    resolver: zodResolver(TeamFormSchema),
    defaultValues: {
      name: team.name,
      description: team.description || '',
    },
  });
  
  // Refetch users and recalculate member lists when the dialog is opened
  useEffect(() => {
    async function fetchAndProcessUsers() {
      if (isOpen) {
        setIsUsersLoading(true);
        setSelectedUserId(null); // Reset user selection
        try {
          const users = await getUsersAction();
          setAllUsers(users);
          const members = users.filter(user => user.team === team.name);
          const nonMembers = users.filter(user => !user.team || user.team === '');
          setTeamMembers(members);
          setAvailableUsers(nonMembers);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar os usuários.' });
        } finally {
          setIsUsersLoading(false);
        }
      }
    }
    fetchAndProcessUsers();
  }, [isOpen, team.name, toast]);


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
          description: 'Os detalhes da equipe foram atualizados.',
        });
        // Note: We don't close the dialog on team detail save,
        // so the user can continue managing members.
        // We can re-fetch or assume a page reload will handle name changes.
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

  const handleAddUser = async () => {
    if (!selectedUserId || !appUser) return;

    setIsUpdatingMembers(true);
    const result = await assignUserToTeamAction(selectedUserId, team.name, appUser.uid);
    if (result.success) {
      toast({ title: 'Sucesso!', description: 'Usuário adicionado à equipe.' });
      const userToAdd = availableUsers.find(u => u.uid === selectedUserId);
      if (userToAdd) {
        setTeamMembers(prev => [...prev, { ...userToAdd, team: team.name }].sort((a,b) => a.displayName.localeCompare(b.displayName)));
        setAvailableUsers(prev => prev.filter(u => u.uid !== selectedUserId));
      }
      setSelectedUserId(null);
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: result.error });
    }
    setIsUpdatingMembers(false);
  };

  const handleRemoveUser = async (userId: string) => {
    if (!appUser) return;
    setIsUpdatingMembers(true);
    const result = await unassignUserFromTeamAction(userId, appUser.uid);
    if (result.success) {
      toast({ title: 'Sucesso!', description: 'Usuário removido da equipe.' });
      const userToRemove = teamMembers.find(u => u.uid === userId);
      if (userToRemove) {
        setTeamMembers(prev => prev.filter(u => u.uid !== userId));
        setAvailableUsers(prev => [...prev, { ...userToRemove, team: '' }].sort((a,b) => a.displayName.localeCompare(b.displayName)));
      }
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: result.error });
    }
    setIsUpdatingMembers(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Equipe</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da equipe e gerencie seus membros.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                        ) : (
                        'Salvar Detalhes'
                        )}
                    </Button>
                </DialogFooter>
            </form>
            </Form>

            <Separator className="my-6" />

            <div className="space-y-4">
                <h3 className="font-medium text-lg">Membros da Equipe</h3>
                {isUsersLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                    <ScrollArea className="h-48">
                        <div className="space-y-2">
                            {teamMembers.length > 0 ? (
                            teamMembers.map(member => (
                                <div key={member.uid} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                                <span>{member.displayName}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveUser(member.uid)} disabled={isUpdatingMembers}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                </div>
                            ))
                            ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum membro nesta equipe.</p>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="space-y-2 pt-2">
                        <Label>Adicionar Membro</Label>
                        <div className="flex items-center gap-2">
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={popoverOpen}
                                className="w-full justify-between font-normal flex-1"
                                disabled={availableUsers.length === 0 || isUpdatingMembers}
                                >
                                {selectedUserId
                                    ? availableUsers.find(user => user.uid === selectedUserId)?.displayName
                                    : "Selecione um usuário"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                <CommandInput placeholder="Pesquisar usuário..." />
                                <CommandList>
                                    <CommandEmpty>Nenhum usuário disponível.</CommandEmpty>
                                    <CommandGroup>
                                    {availableUsers.map((user) => (
                                        <CommandItem
                                        key={user.uid}
                                        value={user.displayName}
                                        onSelect={() => {
                                            setSelectedUserId(user.uid);
                                            setPopoverOpen(false);
                                        }}
                                        >
                                        <Check
                                            className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedUserId === user.uid ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {user.displayName}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </CommandList>
                                </Command>
                            </PopoverContent>
                            </Popover>
                            <Button size="icon" onClick={handleAddUser} disabled={!selectedUserId || isUpdatingMembers}>
                                {isUpdatingMembers ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                                <span className="sr-only">Adicionar</span>
                            </Button>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
        <DialogFooter className="mt-4">
             <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
