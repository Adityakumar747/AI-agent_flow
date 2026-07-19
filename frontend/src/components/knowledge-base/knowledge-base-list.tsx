export function KnowledgeBaseList({ entries, isLoading, page, totalPages, onPageChange }: any) {
  if (isLoading) return <div>Loading...</div>;
  return <div>Knowledge base list - {entries.length} entries</div>;
}
