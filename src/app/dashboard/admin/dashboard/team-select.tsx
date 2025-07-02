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
import type { Team } from '@/services/teams';

interface TeamSelectProps {
  teams: Team[];
  selectedTeam: string | null;
  onTeamChange: (teamId: string | null) => void;
  className?: string;
}

export function TeamSelect({
  teams,
  selectedTeam,
  onTeamChange,
  className,
}: TeamSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedTeamName =
    teams.find((team) => team.id === selectedTeam)?.name ||
    'Selecione uma equipe';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[300px] justify-between font-normal', className, !selectedTeam && "text-muted-foreground")}
        >
          {selectedTeamName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar equipe..." />
          <CommandList>
            <CommandEmpty>Nenhuma equipe encontrada.</CommandEmpty>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.name}
                  onSelect={() => {
                    onTeamChange(team.id === selectedTeam ? null : team.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedTeam === team.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {team.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
