export function AppointmentsList({ appointments, isLoading, page, totalPages, onPageChange }: any) {
  if (isLoading) return <div>Loading...</div>;
  return <div>Appointments list - {appointments.length} appointments</div>;
}
