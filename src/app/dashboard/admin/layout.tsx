'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && appUser && !['desenvolvimento-gestor', 'super-admin'].includes(appUser.role)) {
      router.push('/dashboard');
    }
  }, [appUser, loading, router]);

  if (loading || !appUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!['desenvolvimento-gestor', 'super-admin'].includes(appUser.role)) {
    return null; // ou uma página de acesso negado
  }

  return <>{children}</>;
}
