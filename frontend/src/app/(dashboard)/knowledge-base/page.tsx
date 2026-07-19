'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { knowledgeBaseService } from '@/services/knowledge-base.service';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { KnowledgeBaseList } from '@/components/knowledge-base/knowledge-base-list';
import { CreateKnowledgeDialog } from '@/components/knowledge-base/create-knowledge-dialog';

export default function KnowledgeBasePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['knowledge-base', page],
    queryFn: () => knowledgeBaseService.getEntries(page, 20),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage AI responses and frequently asked questions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <KnowledgeBaseList
        entries={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta.totalPages || 1}
      />

      <CreateKnowledgeDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
