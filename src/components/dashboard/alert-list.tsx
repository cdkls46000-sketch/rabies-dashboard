'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';

const getLevelColor = (level: string) => {
  switch (level) {
    case 'critical':
      return 'bg-red-500 hover:bg-red-600 text-white';
    case 'urgent':
      return 'bg-orange-500 hover:bg-orange-600 text-white';
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600 text-white';
    case 'info':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
};

const getLevelLabel = (level: string) => {
  switch (level) {
    case 'critical':
      return 'วิกฤต';
    case 'urgent':
      return 'เร่งด่วน';
    case 'warning':
      return 'เตือนภัย';
    case 'info':
      return 'แจ้งเพื่อทราบ';
    default:
      return level;
  }
};

const formatTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
    
    if (diffInSeconds < 60) return 'เมื่อสักครู่';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชม. ที่แล้ว`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} วันที่แล้ว`;
  } catch {
    return 'ล่าสุด';
  }
};

export default function AlertList() {
  const { alerts } = useData();
  const latestAlerts = alerts.slice(0, 5);

  return (
    <Card className="w-full">
      <CardHeader className="p-3.5 sm:p-5">
        <CardTitle className="text-base sm:text-lg">⚠️ รายการแจ้งเตือนล่าสุดในพื้นที่ จ.กาฬสินธุ์</CardTitle>
      </CardHeader>
      <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
        <div className="space-y-3">
          {latestAlerts.map((alert) => (
            <div 
              key={alert.alert_id} 
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${getLevelColor(alert.level)} text-[10px] h-5`}>
                    {getLevelLabel(alert.level)}
                  </Badge>
                  <span className="font-semibold text-xs sm:text-sm text-slate-800">{alert.title}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {alert.message}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  📍 {alert.location}
                </p>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 self-start sm:self-auto sm:ml-4">
                {formatTimeAgo(alert.created_at)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
