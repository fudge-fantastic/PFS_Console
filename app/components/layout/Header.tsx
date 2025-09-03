import React from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Menu, LogOut, User, Settings, Search, Bell, Command } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { NotificationCenter } from '../advanced/NotificationCenter';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { toggle: toggleCommandPalette } = useCommandPalette();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 dark:bg-gray-100/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Left side - Brand */}
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            PixelForge Studio Admin
          </h1>
        </div>
        
        {/* Center - Command palette trigger */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCommandPalette}
            className="relative h-8 px-3 text-sm text-muted-foreground bg-muted/50 hover:bg-muted"
          >
            <Search className="h-3 w-3 mr-2" />
            <span className="hidden sm:inline">Quick search...</span>
            <Badge variant="outline" className="ml-2 h-5 px-1 text-xs hidden md:inline">
              ⌘K
            </Badge>
          </Button>
        </div>
        
        {/* Right side - Actions and User menu */}
        <div className="flex items-center gap-x-3 lg:gap-x-4">
          {/* Notifications */}
          <NotificationCenter />
          
          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Role: {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleCommandPalette} className="cursor-pointer">
                <Command className="mr-2 h-4 w-4" />
                <span>Command Palette</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  ⌘K
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
