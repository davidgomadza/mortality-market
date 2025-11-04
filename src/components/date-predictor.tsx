'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { runAssistDatePrediction } from "@/ai/client";
import { useState } from "react";
import { type AssistDatePredictionOutput } from "@/ai/flows/assist-date-prediction";
import { Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "./ui/progress";

const FormSchema = z.object({
  tokenDetails: z.string().min(10, {
    message: "Please provide more details about the token.",
  }),
  playerRiskTolerance: z.string({
    required_error: "Please select a risk tolerance.",
  }),
  predictionStrategy: z.string({
    required_error: "Please select a prediction strategy.",
  }),
});

export function DatePredictor() {
  const [prediction, setPrediction] = useState<AssistDatePredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await runAssistDatePrediction({
        ...data,
        currentDate: new Date().toISOString().split('T')[0],
      });
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        variant: "destructive",
        title: "Prediction Error",
        description: "The AI assistant failed to generate a prediction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-primary">AI Prediction Assistant</CardTitle>
            <CardDescription>Leverage AI to assist with your Day of Death predictions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="tokenDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter token status, history, and any relevant information..."
                      className="resize-none bg-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The more information you provide, the better the prediction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="playerRiskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent"><SelectValue placeholder="Select your risk tolerance" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="predictionStrategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Prediction Strategy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent"><SelectValue placeholder="Select a strategy" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch space-y-4 mt-auto">
             <Button type="submit" disabled={isLoading} className="w-full pulse-light-border">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Get AI Prediction
                </>
              )}
            </Button>
            {prediction && (
                <Card className="bg-background/50 border-primary/30">
                    <CardHeader>
                        <CardTitle className="text-primary font-headline">AI Prediction Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Predicted Date</p>
                            <p className="text-2xl text-glow">{prediction.predictedDate}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Confidence Level</p>
                            <div className="flex items-center gap-2">
                                <Progress value={prediction.confidenceLevel * 100} className="w-full h-2" />
                                <span className="font-bold text-primary">{(prediction.confidenceLevel * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reasoning</p>
                            <p className="text-sm">{prediction.reasoning}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
