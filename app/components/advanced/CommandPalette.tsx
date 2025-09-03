import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
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
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
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
      action: () => navigate('/dashboard'),
      keywords: ['home', 'overview', 'main'],
    },
    {
      id: 'nav-products',
      title: 'Products',
      description: 'Manage product catalog',
      category: 'Navigation',
      icon: <Package className="h-4 w-4" />,
      action: () => navigate('/products'),
      keywords: ['catalog', 'items', 'inventory'],
    },
    {
      id: 'nav-users',
      title: 'Users',
      description: 'Manage user accounts',
      category: 'Navigation',
      icon: <Users className="h-4 w-4" />,
      action: () => navigate('/users'),
      keywords: ['accounts', 'customers', 'admins'],
    },
    {
      id: 'nav-system',
      title: 'System Health',
      description: 'View system status',
      category: 'Navigation',
      icon: <Activity className="h-4 w-4" />,
      action: () => navigate('/system/health'),
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
        navigate('/products');
        // TODO: Open create dialog after navigation
      },
      keywords: ['add', 'new', 'create'],
    },
    {
      id: 'action-search-products',
      title: 'Search Products',
      description: 'Find products by name or category',
      category: 'Search',
      icon: <Search className="h-4 w-4" />,
      action: () => navigate('/products'),
      keywords: ['find', 'lookup'],
    },
    {
      id: 'action-search-users',
      title: 'Search Users',
      description: 'Find users by email or role',
      category: 'Search',
      icon: <Search className="h-4 w-4" />,
      action: () => navigate('/users'),
      keywords: ['find', 'lookup'],
    },
  ];

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return allCommands;

    const searchTerm = query.toLowerCase();
    return allCommands.filter(
      (command) =>
        command.title.toLowerCase().includes(searchTerm) ||
        command.description?.toLowerCase().includes(searchTerm) ||
        command.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }, [query]);

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((command) => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onOpenChange(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex, onOpenChange]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleCommandSelect = (command: CommandItem) => {
    command.action();
    onOpenChange(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Navigation':
        return <ArrowRight className="h-3 w-3" />;
      case 'Actions':
        return <Settings className="h-3 w-3" />;
      case 'Search':
        return <Search className="h-3 w-3" />;
      case 'Recent':
        return <Clock className="h-3 w-3" />;
      default:
        return <Hash className="h-3 w-3" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex-1 px-0 py-3 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Badge variant="outline" className="ml-2 text-xs">
            ⌘K
          </Badge>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-1">
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="mb-2">
                  <div className="flex items-center px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                  </div>
                  {commands.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    return (
                      <Button
                        key={command.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto p-2 mb-1 ${
                          globalIndex === selectedIndex
                            ? 'bg-accent text-accent-foreground'
                            : ''
                        }`}
                        onClick={() => handleCommandSelect(command)}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex items-center flex-1">
                            {command.icon}
                            <div className="ml-3 text-left">
                              <div className="text-sm font-medium">
                                {command.title}
                              </div>
                              {command.description && (
                                <div className="text-xs text-muted-foreground">
                                  {command.description}
                                </div>
                              )}
                            </div>
                          </div>
                          {globalIndex === selectedIndex && (
                            <ArrowRight className="h-4 w-4 opacity-50" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground border-t bg-muted/50">
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">
              Enter
            </kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">
              Esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
