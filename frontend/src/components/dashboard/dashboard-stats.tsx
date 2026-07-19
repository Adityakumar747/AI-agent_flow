import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, Users, Megaphone, Calendar, TrendingUp } from 'lucide-react';
import { AnalyticsOverview } from '@/types';

interface DashboardStatsProps {
  data?: AnalyticsOverview;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Calls',
      value: data?.totalCalls || 0,
      icon: PhoneCall,
      description: `${data?.recentCalls || 0} in last 7 days`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Campaigns',
      value: data?.activeCampaigns || 0,
      icon: Megaphone,
      description: `${data?.totalCampaigns || 0} total campaigns`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Customers',
      value: data?.totalCustomers || 0,
      icon: Users,
      description: 'Registered contacts',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Appointments',
      value: data?.totalAppointments || 0,
      icon: Calendar,
      description: `${data?.upcomingAppointments || 0} upcoming`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Conversion Rate',
      value: `${data?.conversionRate || 0}%`,
      icon: TrendingUp,
      description: 'Calls to appointments',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
