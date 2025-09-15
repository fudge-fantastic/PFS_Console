import { NavLink } from 'react-router';
import {
  Home,
  Users,
  Package,
  Mail,
  FolderOpen
} from 'lucide-react';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Categories', href: '/categories', icon: FolderOpen },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Inquiries', href: '/inquiries', icon: Mail },
];

export function Sidebar() {
  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1.5 mt-4">
          <Package className="h-6 w-6" />
          <span className="text-lg font-semibold">
            PFS Admin
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
