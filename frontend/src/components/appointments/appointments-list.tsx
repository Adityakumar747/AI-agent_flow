import { useTheme } from '@/components/theme-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AppointmentsList({ appointments, isLoading, page, totalPages, onPageChange }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (isLoading) return <div style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>Loading...</div>;

  return (
    <Card className={isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}>
      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <div className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No appointments found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'border-b border-white/10' : 'border-b border-gray-200'}>
                <tr>
                  {['Title', 'Date', 'Time', 'Customer', 'Status', 'Actions'].map((header) => (
                    <th key={header} className={`text-left px-4 py-3 text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment: any) => (
                  <tr key={appointment.id} className={isDark ? 'border-b border-white/5' : 'border-b border-gray-100'}>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{appointment.title}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{appointment.date}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{appointment.time}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{appointment.customerName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{appointment.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className={`text-red-500 hover:text-red-700`}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
