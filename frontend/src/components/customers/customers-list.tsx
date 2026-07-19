import { Customer } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatPhoneNumber } from '@/lib/utils';
import { Mail, Phone, Trash2 } from 'lucide-react';
import { customersService } from '@/services/customers.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CustomersListProps {
  customers: Customer[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export function CustomersList({ 
  customers, isLoading, page, totalPages, onPageChange, 
  selectedIds, onToggleSelect, onToggleSelectAll 
}: CustomersListProps) {
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersService.deleteCustomer(id);
        toast.success('Customer deleted');
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading customers...</div>;
  }

  if (customers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No customers found</p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded"
                checked={customers.length > 0 && selectedIds.length === customers.length}
                onChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded"
                  checked={selectedIds.includes(customer.id)}
                  onChange={() => onToggleSelect(customer.id)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  {customer.notes && (
                    <div className="text-sm text-muted-foreground">{customer.notes}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3" />
                    {formatPhoneNumber(customer.phone)}
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{formatDate(customer.createdAt)}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(customer.id)}
                  title="Delete Customer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between p-4 border-t">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
