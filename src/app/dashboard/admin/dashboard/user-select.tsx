'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { AppUser } from '@/services/user';

interface UserSelectProps {
  users: AppUser[];
  selectedUser: string | null;
  onUserChange: (userId: string | null) => void;
  className?: string;
}

export function UserSelect({
  users,
  selectedUser,
  onUserChange,
  className,
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedUserName =
    users.find((user) => user.uid === selectedUser)?.displayName ||
    'Selecione um usuário';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[300px] justify-between font-normal', className, !selectedUser && "text-muted-foreground")}
        >
          {selectedUserName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar usuário..." />
          <CommandList>
            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.uid}
                  value={user.displayName}
                  onSelect={() => {
                    onUserChange(user.uid === selectedUser ? null : user.uid);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedUser === user.uid ? 'opacity-100' : 'opacity-0'
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
  );
}
