import React from 'react';
import { NavLink } from 'react-router';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  X, 
  Home, 
  Users, 
  Package, 
  Settings, 
  Activity,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'System', href: '/system', icon: Activity },
];

const secondaryNavigation = [
  { name: 'Create Product', href: '/products/create', icon: Plus },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900">
            <SidebarContent onClose={onClose} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}

interface SidebarContentProps {
  onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarContentProps) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 pb-4">
      {/* Logo and close button */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Package className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            PixelForge
          </span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Primary navigation */}
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                          isActive
                            ? 'bg-gray-50 text-primary dark:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800'
                        )
                      }
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>

            <Separator />

            {/* Secondary navigation */}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500">
                Quick Actions
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                          isActive
                            ? 'bg-gray-50 text-primary dark:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800'
                        )
                      }
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>

            {/* Settings at bottom */}
            <li className="mt-auto">
              <NavLink
                to="/settings"
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                    isActive
                      ? 'bg-gray-50 text-primary dark:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800'
                  )
                }
              >
                <Settings className="h-6 w-6 shrink-0" />
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
}
