import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchProps {
  items: {
    label: string;
    href: string;
    description: string;
    icon: React.ElementType;
    group: string;
  }[];
}

export function NavigationSearch({ items }: SearchProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Search features...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Type to search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {items.reduce((groups, item) => {
              const group = groups.find(g => g.label === item.group);
              if (group) {
                group.items.push(item);
              } else {
                groups.push({ label: item.group, items: [item] });
              }
              return groups;
            }, [] as { label: string; items: typeof items }[]).map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.href}
                      onSelect={() => {
                        navigate(item.href);
                        setOpen(false);
                      }}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
