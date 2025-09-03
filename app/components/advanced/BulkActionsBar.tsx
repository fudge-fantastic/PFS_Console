import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { 
  ChevronDown, 
  Lock, 
  Unlock, 
  Trash2, 
  Archive,
  CheckSquare,
  Square,
  Minus
} from 'lucide-react';

interface BulkOperation {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive';
  confirmMessage?: string;
  action: (selectedIds: string[]) => Promise<void>;
}

interface BulkActionsBarProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  operations: BulkOperation[];
  itemType?: string;
  selectionState?: 'none' | 'partial' | 'all';
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onDeselectAll,
  operations,
  itemType = 'items',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmOperation, setConfirmOperation] = useState<BulkOperation | null>(null);

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalItems;
  const hasSelectedItems = selectedItems.length > 0;

  const handleSelectToggle = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleOperation = async (operation: BulkOperation) => {
    if (operation.confirmMessage) {
      setConfirmOperation(operation);
    } else {
      await executeOperation(operation);
    }
  };

  const executeOperation = async (operation: BulkOperation) => {
    try {
      setIsProcessing(true);
      await operation.action(selectedItems);
      toast.success(`Successfully ${operation.label.toLowerCase()} ${selectedItems.length} ${itemType}`);
      onDeselectAll();
    } catch (error) {
      toast.error(`Failed to ${operation.label.toLowerCase()} ${itemType}`);
    } finally {
      setIsProcessing(false);
      setConfirmOperation(null);
    }
  };

  const getCheckboxState = () => {
    if (isAllSelected) return 'checked';
    if (isPartiallySelected) return 'indeterminate';
    return 'unchecked';
  };

  const renderCheckboxIcon = () => {
    if (isAllSelected) {
      return <CheckSquare className="h-4 w-4" />;
    } else if (isPartiallySelected) {
      return <Minus className="h-4 w-4" />;
    } else {
      return <Square className="h-4 w-4" />;
    }
  };

  if (!hasSelectedItems) {
    return (
      <div className="flex items-center justify-between py-2 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectToggle}
            className="p-1"
          >
            {renderCheckboxIcon()}
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Select {itemType} to perform bulk actions
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {totalItems} total {itemType}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectToggle}
            className="p-1"
          >
            {renderCheckboxIcon()}
          </Button>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedItems.length} selected
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              of {totalItems} {itemType}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDeselectAll}
            disabled={isProcessing}
          >
            Clear Selection
          </Button>
          
          {operations.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={isProcessing}
                >
                  Bulk Actions
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  Actions ({selectedItems.length} {itemType})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {operations.map((operation: BulkOperation) => (
                  <DropdownMenuItem
                    key={operation.id}
                    onClick={() => handleOperation(operation)}
                    className={operation.variant === 'destructive' ? 'text-red-600' : ''}
                  >
                    {operation.icon}
                    <span className="ml-2">{operation.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmOperation} onOpenChange={() => setConfirmOperation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmOperation?.confirmMessage}
              <br />
              <br />
              <strong>Selected items: {selectedItems.length}</strong>
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmOperation && executeOperation(confirmOperation)}
              disabled={isProcessing}
              className={confirmOperation?.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isProcessing ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Predefined bulk operations for common use cases
export const productBulkOperations: BulkOperation[] = [
  {
    id: 'lock',
    label: 'Lock Products',
    icon: <Lock className="h-4 w-4" />,
    confirmMessage: 'Are you sure you want to lock the selected products? Locked products will not be visible to customers.',
    action: async (selectedIds: string[]) => {
      // TODO: Implement bulk lock API call
      console.log('Bulk lock products:', selectedIds);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
  {
    id: 'unlock',
    label: 'Unlock Products',
    icon: <Unlock className="h-4 w-4" />,
    action: async (selectedIds: string[]) => {
      // TODO: Implement bulk unlock API call
      console.log('Bulk unlock products:', selectedIds);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
  {
    id: 'archive',
    label: 'Archive Products',
    icon: <Archive className="h-4 w-4" />,
    confirmMessage: 'Are you sure you want to archive the selected products? Archived products can be restored later.',
    action: async (selectedIds: string[]) => {
      // TODO: Implement bulk archive API call
      console.log('Bulk archive products:', selectedIds);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
  {
    id: 'delete',
    label: 'Delete Products',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    confirmMessage: 'Are you sure you want to permanently delete the selected products? This action cannot be undone.',
    action: async (selectedIds: string[]) => {
      // TODO: Implement bulk delete API call
      console.log('Bulk delete products:', selectedIds);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
];

export const userBulkOperations: BulkOperation[] = [
  {
    id: 'promote',
    label: 'Promote to Admin',
    icon: <CheckSquare className="h-4 w-4" />,
    confirmMessage: 'Are you sure you want to promote the selected users to admin? This will give them full access to the admin panel.',
    action: async (selectedIds: string[]) => {
      // TODO: Implement bulk promote API call
      console.log('Bulk promote users:', selectedIds);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
  {
    id: 'deactivate',
    label: 'Deactivate Users',
    icon: <Lock className="h-4 w-4" />,
    variant: 'destructive',
    confirmMessage: 'Are you sure you want to deactivate the selected users? They will no longer be able to access their accounts.',
    action: async (selectedIds: string[]) => {
      // TODO: Implement bulk deactivate API call
      console.log('Bulk deactivate users:', selectedIds);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
];
