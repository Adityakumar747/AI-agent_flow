import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, Users, Megaphone, Calendar, TrendingUp } from 'lucide-react';
import { AnalyticsOverview } from '@/types';
import { useTheme } from '@/components/theme-provider';

interface DashboardStatsProps {
  data?: AnalyticsOverview;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    {
      title: 'Total Calls',
      value: data?.totalCalls || 0,
      icon: PhoneCall,
      description: `${data?.recentCalls || 0} in last 7 days`,
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bgColor: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
    },
    {
      title: 'Active Campaigns',
      value: data?.activeCampaigns || 0,
      icon: Megaphone,
      description: `${data?.totalCampaigns || 0} total campaigns`,
      color: isDark ? 'text-purple-400' : 'text-purple-600',
      bgColor: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
    },
    {
      title: 'Total Customers',
      value: data?.totalCustomers || 0,
      icon: Users,
      description: 'Registered contacts',
      color: isDark ? 'text-green-400' : 'text-green-600',
      bgColor: isDark ? 'bg-green-900/30' : 'bg-green-100',
    },
    {
      title: 'Appointments',
      value: data?.totalAppointments || 0,
      icon: Calendar,
      description: `${data?.upcomingAppointments || 0} upcoming`,
      color: isDark ? 'text-orange-400' : 'text-orange-600',
      bgColor: isDark ? 'bg-orange-900/30' : 'bg-orange-100',
    },
    {
      title: 'Conversion Rate',
      value: `${data?.conversionRate || 0}%`,
      icon: TrendingUp,
      description: 'Calls to appointments',
      color: isDark ? 'text-indigo-400' : 'text-indigo-600',
      bgColor: isDark ? 'bg-indigo-900/30' : 'bg-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
