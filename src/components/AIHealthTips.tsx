import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIHealthTipsProps {
  recentMetrics?: {
    calories?: number;
    sleep_hours?: number;
    steps?: number;
  };
}

export const AIHealthTips = ({ recentMetrics }: AIHealthTipsProps) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getHealthTip = async () => {
    if (!question.trim() && !recentMetrics) return;

    setLoading(true);
    setResponse("");

    try {
      const context = recentMetrics 
        ? `Based on my recent health data: ${recentMetrics.calories || 0} calories, ${recentMetrics.sleep_hours || 0} hours of sleep, ${recentMetrics.steps || 0} steps.`
        : "";

      const { data, error } = await supabase.functions.invoke("health-tips", {
        body: { 
          question: question || "Give me a general health tip for today.",
          context 
        },
      });

      if (error) throw error;

      setResponse(data.tip);
    } catch (error: any) {
      console.error("Error getting health tip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get health tip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Health Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask for personalized health tips based on your metrics..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <Button 
          onClick={getHealthTip} 
          disabled={loading}
          className="w-full sm:w-auto gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Get Health Tip
            </>
          )}
        </Button>
        
        {response && (
          <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
