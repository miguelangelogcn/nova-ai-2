'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AppUser } from "@/services/user";
import { useState } from "react";
import { userFormSchema, type UserFormValues, addUserAction, updateUserAction, deleteUserAction } from "./actions";
import { Loader2 } from "lucide-react";

type UserFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AppUser | null;
    onSave: () => void;
}

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const isEditMode = !!user;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            displayName: user?.displayName || '',
            email: user?.email || '',
            password: '',
            role: user?.role || 'enfermeiro',
            team: user?.team || '',
            status: user?.status || 'Ativo',
        }
    });

    // Reset form when dialog opens with new user data
    useState(() => {
        form.reset({
            displayName: user?.displayName || '',
            email: user?.email || '',
            password: '',
            role: user?.role || 'enfermeiro',
            team: user?.team || '',
            status: user?.status || 'Ativo',
        });
    })


    async function onSubmit(values: UserFormValues) {
        setLoading(true);
        const result = isEditMode
            ? await updateUserAction(user!.uid, values)
            : await addUserAction(values);
        
        setLoading(false);
        if (result.success) {
            toast({ title: "Sucesso!", description: result.message });
            onSave();
        } else {
            toast({ variant: "destructive", title: "Erro", description: result.message as string });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Atualize os detalhes do usuário abaixo.' : 'Preencha os detalhes para criar um novo usuário.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="displayName" render={({ field }) => (
                            <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="jane.doe@hospital.com" {...field} disabled={isEditMode} /></FormControl><FormMessage /></FormItem>
                        )} />
                        {!isEditMode && <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem><FormLabel>Cargo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione um cargo" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="enfermeiro">Enfermeiro(a)</SelectItem>
                                        <SelectItem value="tecnico">Técnico(a)</SelectItem>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione um status" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Ativo">Ativo</SelectItem>
                                        <SelectItem value="Inativo">Inativo</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="team" render={({ field }) => (
                            <FormItem><FormLabel>Equipe (Opcional)</FormLabel><FormControl><Input placeholder="UTI, Pediatria..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

type DeleteUserDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AppUser | null;
    onDelete: () => void;
}

export function DeleteUserDialog({ open, onOpenChange, user, onDelete }: DeleteUserDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!user) return;
        setLoading(true);
        const result = await deleteUserAction(user.uid);
        setLoading(false);

        if (result.success) {
            toast({ title: "Sucesso!", description: result.message });
            onDelete();
        } else {
            toast({ variant: "destructive", title: "Erro", description: result.message as string });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso removerá permanentemente o usuário <span className="font-bold">{user?.displayName}</span> e todos os seus dados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive hover:bg-destructive/90">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sim, remover usuário
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
