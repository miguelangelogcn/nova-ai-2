'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfilePhotoAction } from './actions';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AvatarUpload() {
  const { user, appUser, refreshAppUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
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

  return (
    <div className="relative group w-24 h-24">
      <Avatar className="h-24 w-24">
        <AvatarImage src={appUser?.photoURL || "https://placehold.co/96x96.png"} data-ai-hint="mulher sorrindo" alt={appUser?.displayName || 'User'} />
        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
      </Avatar>
      <div 
        className={cn(
            "absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
            isUploading && "opacity-100 bg-black/60"
        )}
        onClick={!isUploading ? triggerFileSelect : undefined}
        >
        {isUploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
        ) : (
            <Camera className="h-8 w-8 text-white" />
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
