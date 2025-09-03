import React from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from URL if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        {/* Home */}
        <li>
          <div>
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <Home className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>

        {/* Dynamic breadcrumbs */}
        {breadcrumbItems.map((item, index) => (
          <li key={item.label}>
            <div className="flex items-center">
              <ChevronRight
                className="h-5 w-5 shrink-0 text-gray-300 dark:text-gray-600"
                aria-hidden="true"
              />
              {item.href ? (
                <Link
                  to={item.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
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
