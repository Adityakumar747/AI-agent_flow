'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customersService } from '@/services/customers.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/theme-provider';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCustomerDialog({ open, onClose }: CreateCustomerDialogProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mutation = useMutation({
    mutationFn: (data: FormData) => customersService.createCustomer(data),
    onSuccess: () => {
      toast.success('Customer created successfully');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      reset();
      onClose();
    },
    onError: () => {
      toast.error('Failed to create customer');
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className={`rounded-lg shadow-lg max-w-md w-full p-6 ${
        isDark ? 'bg-gray-900 border border-white/10' : 'bg-white'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Customer</h2>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <Label htmlFor="name" className={isDark ? 'text-gray-200' : 'text-gray-700'}>Name *</Label>
            <Input id="name" {...register('name')} className={isDark ? 'bg-gray-800 border-white/10 text-white' : ''} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className={isDark ? 'text-gray-200' : 'text-gray-700'}>Phone *</Label>
            <Input id="phone" type="tel" placeholder="+1234567890" {...register('phone')} className={isDark ? 'bg-gray-800 border-white/10 text-white placeholder:text-gray-500' : ''} />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="email" className={isDark ? 'text-gray-200' : 'text-gray-700'}>Email</Label>
            <Input id="email" type="email" {...register('email')} className={isDark ? 'bg-gray-800 border-white/10 text-white' : ''} />
          </div>

          <div>
            <Label htmlFor="notes" className={isDark ? 'text-gray-200' : 'text-gray-700'}>Notes</Label>
            <Input id="notes" {...register('notes')} className={isDark ? 'bg-gray-800 border-white/10 text-white' : ''} />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}