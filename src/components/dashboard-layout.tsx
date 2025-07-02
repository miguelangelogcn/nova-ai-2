'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart,
  BookOpen,
  Bot,
  ClipboardList,
  Home,
  LogOut,
  User,
  Users,
  Loader2,
  Users2,
} from 'lucide-react';

import { NovaAiSaudeLogo } from '@/components/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth-context';

const userNavItems = [
  { href: '/dashboard', icon: Home, label: 'Início' },
  { href: '/dashboard/mentor', icon: Bot, label: 'Florence' },
  { href: '/dashboard/courses', icon: BookOpen, label: 'Cursos' },
  { href: '/dashboard/profile', icon: User, label: 'Perfil' },
];

const adminNavItems = [
  { href: '/dashboard/admin/dashboard', icon: BarChart, label: 'Relatórios' },
  { href: '/dashboard/admin/users', icon: Users, label: 'Usuários' },
  { href: '/dashboard/admin/teams', icon: Users2, label: 'Equipes' },
  { href: '/dashboard/admin/logs', icon: ClipboardList, label: 'Registros' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, appUser, loading, logout } = useAuth();
  
  const isAdmin = appUser && ['desenvolvimento-gestor', 'super-admin'].includes(appUser.role);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    if (!loading && appUser) {
      // The questionnaire is only required for the 'desenvolvimento-funcionario' role.
      if (appUser.role !== 'desenvolvimento-funcionario') {
        return;
      }

      const latestAssessment = appUser.assessments?.[0]; // Already sorted newest first
      let isQuestionnaireRequired = false;

      if (!latestAssessment) {
        isQuestionnaireRequired = true;
      } else {
        const lastAssessmentDate = new Date(latestAssessment.appliedAt);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        if (lastAssessmentDate <= ninetyDaysAgo) {
          isQuestionnaireRequired = true;
        }
      }

      if (isQuestionnaireRequired && pathname !== '/questionnaire') {
        router.push('/questionnaire');
      }
    }
  }, [appUser, loading, router, pathname]);


  const isRedirecting = React.useMemo(() => {
    if (loading || !appUser || pathname === '/questionnaire') return false;
    
    // Only 'desenvolvimento-funcionario' can be redirected.
    if (appUser.role !== 'desenvolvimento-funcionario') return false;
    
    const latestAssessment = appUser.assessments?.[0];
    if (!latestAssessment) return true;

    const lastAssessmentDate = new Date(latestAssessment.appliedAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return lastAssessmentDate <= ninetyDaysAgo;
  }, [appUser, loading, pathname]);

  if (loading || !user || !appUser || isRedirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  const getAvatarFallback = () => {
    if (appUser?.displayName) {
        return appUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase();
    }
    if (user.email) {
        return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <NovaAiSaudeLogo className="w-8 h-8 text-accent" />
              <span className="text-lg font-semibold font-headline">Nova AI | Saúde</span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel>
                {isAdmin ? 'Pessoal' : 'Desenvolvimento | Funcionário'}
              </SidebarGroupLabel>
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
            
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel>
                  {appUser.role === 'super-admin' ? 'Acesso Total' : 'Desenvolvimento | Gestor'}
                </SidebarGroupLabel>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroup>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-3 p-2 rounded-lg">
                <Link href="/dashboard/profile" className='flex items-center gap-3 flex-grow'>
                    <Avatar>
                        <AvatarImage src={appUser?.photoURL ?? "https://placehold.co/40x40.png"} data-ai-hint="mulher sorrindo" alt="User" />
                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold">{appUser?.displayName ?? 'Usuário'}</span>
                        <span className="text-muted-foreground text-xs">{user.email}</span>
                    </div>
                </Link>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                    <LogOut />
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-2 pl-4 border-b h-14">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
        </header>
        <main className="p-4 md:p-6 bg-background/70 min-h-[calc(100vh-3.5rem)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
