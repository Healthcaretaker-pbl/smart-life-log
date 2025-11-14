import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MetricsChartProps {
  data: Array<{
    date: string;
    calories?: number;
    sleep_hours?: number;
    steps?: number;
  }>;
}

export const MetricsChart = ({ data }: MetricsChartProps) => {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Weekly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="steps" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Steps"
            />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--warning))' }}
              name="Calories"
            />
            <Line 
              type="monotone" 
              dataKey="sleep_hours" 
              stroke="hsl(var(--info))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--info))' }}
              name="Sleep (hrs)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
