import React from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { SidebarTrigger } from '../ui/sidebar';
import { Search } from 'lucide-react';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { NotificationCenter } from '../advanced/NotificationCenter';
import ModeToggle from '../dark-mode-toggler';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Skip if on dashboard (home)
  if (segments[0] === 'dashboard' && segments.length === 1) {
    return [];
  }

  // Map common paths to readable names
  const pathMap: Record<string, string> = {
    dashboard: 'Dashboard',
    products: 'Products',
    users: 'Users',
    system: 'System',
    create: 'Create',
    edit: 'Edit',
    health: 'Health Check',
  };

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Build href for all but last segment
    const href = isLast ? undefined : '/' + segments.slice(0, index + 1).join('/');
    
    breadcrumbs.push({ label, href });
  });

  return breadcrumbs;
}

export function Header() {
  const { toggle: toggleCommandPalette } = useCommandPalette();
  const location = useLocation();

  // Auto-generate breadcrumbs from URL
  const breadcrumbItems = generateBreadcrumbsFromPath(location.pathname);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm">
      {/* Sidebar trigger */}
      <SidebarTrigger />

      <div className="flex flex-1 gap-x-4 self-stretch">
        {/* Left side - Breadcrumb */}
        <div className="flex flex-1 items-center">
          {breadcrumbItems.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink asChild>
                          <Link to={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        
        {/* Right side - Command trigger, Theme Toggle, and Notifications */}
        <div className="flex items-center gap-x-3">
          {/* Command palette trigger */}
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

          {/* Theme toggle */}
          <ModeToggle />
          
          {/* Notifications */}
          <NotificationCenter />
        </div>
      </div>
    </div>
  );
}
