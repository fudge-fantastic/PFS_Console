import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../ui/command';
import {
  Search,
  Package,
  Users,
  Activity,
  Settings,
  Home,
  ArrowRight,
  Clock,
  Hash,
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category: 'Navigation' | 'Actions' | 'Search' | 'Recent';
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  // Define all available commands
  const allCommands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      description: 'Go to main dashboard',
      category: 'Navigation',
      icon: <Home className="h-4 w-4" />,
      action: () => {
        navigate('/dashboard');
        onOpenChange(false);
      },
      keywords: ['home', 'overview', 'main'],
    },
    {
      id: 'nav-products',
      title: 'Products',
      description: 'Manage product catalog',
      category: 'Navigation',
      icon: <Package className="h-4 w-4" />,
      action: () => {
        navigate('/products');
        onOpenChange(false);
      },
      keywords: ['catalog', 'items', 'inventory'],
    },
    {
      id: 'nav-users',
      title: 'Users',
      description: 'Manage user accounts',
      category: 'Navigation',
      icon: <Users className="h-4 w-4" />,
      action: () => {
        navigate('/users');
        onOpenChange(false);
      },
      keywords: ['accounts', 'customers', 'admins'],
    },
    {
      id: 'nav-system',
      title: 'System Health',
      description: 'View system status',
      category: 'Navigation',
      icon: <Activity className="h-4 w-4" />,
      action: () => {
        navigate('/system/health');
        onOpenChange(false);
      },
      keywords: ['health', 'status', 'monitoring'],
    },
    // Actions
    {
      id: 'action-create-product',
      title: 'Create Product',
      description: 'Add a new product to catalog',
      category: 'Actions',
      icon: <Package className="h-4 w-4" />,
      action: () => {
        navigate('/products/create');
        onOpenChange(false);
      },
      keywords: ['add', 'new', 'create'],
    },
    {
      id: 'action-search-products',
      title: 'Search Products',
      description: 'Find products by name or category',
      category: 'Search',
      icon: <Search className="h-4 w-4" />,
      action: () => {
        navigate('/products');
        onOpenChange(false);
      },
      keywords: ['find', 'lookup'],
    },
    {
      id: 'action-search-users',
      title: 'Search Users',
      description: 'Find users by email or role',
      category: 'Search',
      icon: <Search className="h-4 w-4" />,
      action: () => {
        navigate('/users');
        onOpenChange(false);
      },
      keywords: ['find', 'lookup'],
    },
  ];

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    allCommands.forEach((command) => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {groupedCommands.Navigation?.map((command) => (
            <CommandItem
              key={command.id}
              value={`${command.title} ${command.keywords?.join(' ')}`}
              onSelect={() => command.action()}
            >
              {command.icon}
              <span className="ml-2">{command.title}</span>
              {command.description && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {command.description}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {groupedCommands.Actions?.map((command) => (
            <CommandItem
              key={command.id}
              value={`${command.title} ${command.keywords?.join(' ')}`}
              onSelect={() => command.action()}
            >
              {command.icon}
              <span className="ml-2">{command.title}</span>
              {command.description && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {command.description}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Search">
          {groupedCommands.Search?.map((command) => (
            <CommandItem
              key={command.id}
              value={`${command.title} ${command.keywords?.join(' ')}`}
              onSelect={() => command.action()}
            >
              {command.icon}
              <span className="ml-2">{command.title}</span>
              {command.description && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {command.description}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
