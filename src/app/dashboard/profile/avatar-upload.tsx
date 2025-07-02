'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfilePhotoAction } from './actions';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function AvatarUpload() {
  const { user, appUser, refreshAppUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: 'destructive',
        title: 'Arquivo muito grande',
        description: 'Por favor, selecione uma imagem com menos de 5MB.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const result = await updateProfilePhotoAction(user.uid, downloadURL);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      await refreshAppUser();

      toast({
        title: 'Sucesso!',
        description: 'Sua foto de perfil foi atualizada.',
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: 'destructive',
        title: 'Erro no Upload',
        description: error.message || 'Não foi possível atualizar sua foto. Tente novamente.',
      });
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !appUser?.photoURL) return;

    setIsDeleting(true);
    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      
      try {
        await deleteObject(storageRef);
      } catch (error: any) {
        if (error.code !== 'storage/object-not-found') {
          throw error;
        }
      }

      const result = await updateProfilePhotoAction(user.uid, '');
      if (!result.success) {
        throw new Error(result.error);
      }
      
      await refreshAppUser();

      toast({
        title: 'Sucesso!',
        description: 'Sua foto de perfil foi removida.',
      });

    } catch (error: any) {
      console.error("Error removing photo:", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Remover Foto',
        description: error.message || 'Não foi possível remover sua foto. Tente novamente.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const getAvatarFallback = () => {
      if (appUser?.displayName) {
          return appUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase();
      }
      if (user?.email) {
          return user.email.substring(0, 2).toUpperCase();
      }
      return 'U';
  }

  const isLoading = isUploading || isDeleting;
  const hasPhoto = !!appUser?.photoURL;

  return (
    <div className="relative group w-24 h-24">
      <Avatar className="h-24 w-24">
        <AvatarImage src={appUser?.photoURL || "https://placehold.co/96x96.png"} data-ai-hint="mulher sorrindo" alt={appUser?.displayName || 'User'} />
        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
      </Avatar>
      <div 
        className={cn(
            "absolute inset-0 bg-black/40 rounded-full flex items-center justify-center gap-2 cursor-default opacity-0 group-hover:opacity-100 transition-opacity",
            isLoading && "opacity-100 bg-black/60"
        )}
        >
        {isLoading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
        ) : (
            <>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white h-10 w-10" onClick={triggerFileSelect} aria-label="Alterar foto" title="Alterar foto" disabled={isLoading}>
                    <Camera className="h-5 w-5" />
                </Button>
                {hasPhoto && (
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white h-10 w-10" onClick={handleRemovePhoto} aria-label="Remover foto" title="Remover foto" disabled={isLoading}>
                        <Trash2 className="h-5 w-5" />
                    </Button>
                )}
            </>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
}
