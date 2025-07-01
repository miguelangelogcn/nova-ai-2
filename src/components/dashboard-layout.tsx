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
  Settings,
  Users,
  Loader2,
} from 'lucide-react';

import { NursePathLogo } from '@/components/icons';
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

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Início' },
  { href: '/dashboard/mentor', icon: Bot, label: 'Mentor IA' },
  { href: '/dashboard/courses', icon: BookOpen, label: 'Cursos' },
];

const adminNavItems = [
  { href: '/dashboard/admin/dashboard', icon: BarChart, label: 'Relatórios' },
  { href: '/dashboard/admin/users', icon: Users, label: 'Usuários' },
  { href: '/dashboard/admin/logs', icon: ClipboardList, label: 'Registros' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, appUser, loading, logout } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
              <NursePathLogo className="w-8 h-8 text-primary" />
              <span className="text-lg font-semibold font-headline">NursePath</span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarGroup>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
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
            {appUser?.role === 'admin' && (
                <SidebarGroup>
                <SidebarGroupLabel>Admin</SidebarGroupLabel>
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
            <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon"><Settings /></Button>
                 <Link href="/dashboard/profile">
                    <Avatar className='h-9 w-9'>
                        <AvatarImage src={appUser?.photoURL ?? "https://placehold.co/40x40.png"} data-ai-hint="mulher sorrindo" alt="User" />
                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
        <main className="p-4 md:p-6 bg-background/70 min-h-[calc(100vh-3.5rem)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
