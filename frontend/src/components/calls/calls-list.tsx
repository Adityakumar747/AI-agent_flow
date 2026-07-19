export function CallsList({ calls, isLoading, page, totalPages, onPageChange }: any) {
  if (isLoading) return <div>Loading...</div>;
  return <div>Calls list component - {calls.length} calls</div>;
}
