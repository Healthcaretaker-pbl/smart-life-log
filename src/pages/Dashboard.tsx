import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { MetricsChart } from "@/components/MetricsChart";
import { AddMetricDialog } from "@/components/AddMetricDialog";
import { AIHealthTips } from "@/components/AIHealthTips";
import { Activity, Flame, Moon, Footprints, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [todayMetrics, setTodayMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchMetrics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(7);

      if (error) throw error;

      setMetrics(data || []);
      
      const today = new Date().toISOString().split('T')[0];
      const todayData = data?.find(m => m.date === today);
      setTodayMetrics(todayData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast({
        title: "Error",
        description: "Failed to load health metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-health-gradient rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">HealthTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <AddMetricDialog onMetricAdded={fetchMetrics} userId={user?.id || ""} />
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Track your health metrics and get AI-powered insights</p>
        </div>

        {/* Today's Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Calories"
            value={todayMetrics?.calories || 0}
            icon={Flame}
            unit="kcal"
            goal={2000}
            colorClass="text-warning"
          />
          <MetricCard
            title="Sleep"
            value={todayMetrics?.sleep_hours || 0}
            icon={Moon}
            unit="hrs"
            goal={8}
            colorClass="text-info"
          />
          <MetricCard
            title="Steps"
            value={todayMetrics?.steps || 0}
            icon={Footprints}
            goal={10000}
            colorClass="text-primary"
          />
        </div>

        {/* Chart and AI Tips */}
        <div className="grid grid-cols-1 gap-6">
          {metrics.length > 0 && (
            <MetricsChart data={metrics.reverse()} />
          )}
          <AIHealthTips recentMetrics={todayMetrics} />
        </div>
      </main>
    </div>
  );
}
