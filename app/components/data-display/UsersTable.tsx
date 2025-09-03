import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import { MoreHorizontal, Eye, UserCheck, UserX, Trash2, Shield, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DataTablePagination } from './DataTablePagination';
import { BulkActionsBar } from '../advanced/BulkActionsBar';
import { useUsers } from '../../hooks/useUsers';
import { useNotifications } from '../../contexts/NotificationContext';
import type { User } from '../../types/user';

interface UsersTableProps {
  searchTerm?: string;
  roleFilter?: string;
  statusFilter?: string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  searchTerm,
  roleFilter,
  statusFilter,
}) => {
  const { users, isLoading, error, currentPage, totalPages, goToPage } = useUsers({
    searchTerm,
    roleFilter,
    statusFilter,
  });
  
  const { success, warning, error: showError } = useNotifications();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Define bulk operations
  const bulkOperations = [
    {
      id: 'activate',
      label: 'Activate Users',
      icon: <UserCheck className="mr-2 h-4 w-4" />,
      action: async (selectedIds: string[]) => {
        const selectedUserObjects = users.filter(u => selectedIds.includes(u.id));
        console.log('Bulk activating:', selectedUserObjects);
        success(`Activated ${selectedIds.length} users`);
        setSelectedUsers([]);
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate Users',
      icon: <UserX className="mr-2 h-4 w-4" />,
      action: async (selectedIds: string[]) => {
        const selectedUserObjects = users.filter(u => selectedIds.includes(u.id));
        console.log('Bulk deactivating:', selectedUserObjects);
        success(`Deactivated ${selectedIds.length} users`);
        setSelectedUsers([]);
      },
    },
    {
      id: 'delete',
      label: 'Delete Users',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: 'destructive' as const,
      confirmMessage: 'This action cannot be undone.',
      action: async (selectedIds: string[]) => {
        const selectedUserObjects = users.filter(u => selectedIds.includes(u.id));
        console.log('Bulk deleting:', selectedUserObjects);
        success(`Deleted ${selectedIds.length} users successfully`);
        setSelectedUsers([]);
      },
    },
  ];

  const selectionState = selectedUsers.length === 0 ? 'none' : 
                       selectedUsers.length === users.length ? 'all' : 'partial';

  const getInitials = (email: string): string => {
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewUser = (user: User) => {
    console.log('View user:', user);
    // TODO: Implement user detail view
  };

  const handlePromoteUser = (user: User) => {
    console.log('Promote user:', user);
    // TODO: Implement user promotion
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {!isLoading && users.length > 0 && (
        <BulkActionsBar
          selectedItems={selectedUsers}
          totalItems={users.length}
          onSelectAll={() => setSelectedUsers(users.map(u => u.id))}
          onDeselectAll={() => setSelectedUsers([])}
          operations={bulkOperations}
          itemType="users"
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {!isLoading && users.length > 0 && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectionState === 'all'}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead className="w-12">#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Shield className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No users found</p>
                    {(searchTerm || roleFilter !== 'all') && (
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search or filters
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        {user.email.split('@')[0]}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                    >
                      {user.role === 'admin' && (
                        <Shield className="w-3 h-3 mr-1" />
                      )}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handlePromoteUser(user)}
                          disabled={user.role === 'admin'}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          {user.role === 'admin' ? 'Already Admin' : 'Promote to Admin'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={10}
          totalItems={users.length}
          startIndex={(currentPage - 1) * 10 + 1}
          endIndex={Math.min(currentPage * 10, users.length)}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
        />
      )}
    </div>
  );
};
