import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';

export function CampaignPerformance({ data }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Card className={isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}>
      <CardHeader>
        <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`h-64 flex items-center justify-center rounded-lg border ${
          isDark ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          Campaign performance
        </div>
      </CardContent>
    </Card>
  );
}
