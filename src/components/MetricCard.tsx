import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  unit?: string;
  goal?: number;
  colorClass?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  unit = "", 
  goal,
  colorClass = "text-primary"
}: MetricCardProps) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const percentage = goal ? Math.min((numericValue / goal) * 100, 100) : 0;

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5", colorClass)} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <div className="text-3xl font-bold">{value || "0"}</div>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {goal && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Goal: {goal}{unit}</span>
              <span>{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className={cn("h-full bg-primary transition-all duration-500 rounded-full", colorClass.replace('text-', 'bg-'))}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
