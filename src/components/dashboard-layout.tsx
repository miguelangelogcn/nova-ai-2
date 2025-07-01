'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  BookOpen,
  Bot,
  ClipboardList,
  Home,
  LogOut,
  Settings,
  User,
  Users,
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

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/mentor', icon: Bot, label: 'AI Mentor' },
  { href: '/dashboard/courses', icon: BookOpen, label: 'Courses' },
];

const adminNavItems = [
  { href: '/dashboard/admin/dashboard', icon: BarChart, label: 'Reports' },
  { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
  { href: '/dashboard/admin/logs', icon: ClipboardList, label: 'Logs' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <Link href="/dashboard/profile" className='block'>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman smiling" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                    <span className="font-semibold">Jane Doe</span>
                    <span className="text-muted-foreground text-xs">Nurse</span>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto" asChild>
                        <Link href="/">
                            <LogOut />
                        </Link>
                    </Button>
                </div>
            </Link>
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
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman smiling" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
        <main className="p-4 md:p-6 bg-background/70 min-h-[calc(100vh-3.5rem)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
