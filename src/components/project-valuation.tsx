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
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { runGetProjectValuation } from "@/ai/client";
import { useState } from "react";
import { type ProjectValuationOutput } from "@/ai/flows/project-valuation";
import { Loader2, Gem } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  projectName: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  stage: z.string({ required_error: "Please select a stage." }),
  market: z.string().min(5, { message: "Target market must be at least 5 characters." }),
});

export function ProjectValuation() {
  const [valuation, setValuation] = useState<ProjectValuationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName: "",
      description: "",
      market: "",
    }
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setValuation(null);
    try {
      const result = await runGetProjectValuation(data);
      setValuation(result);
    } catch (error) {
      console.error("Valuation failed:", error);
      toast({
        variant: "destructive",
        title: "Valuation Error",
        description: "The AI assistant failed to generate a valuation. Please try again.",
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
            <CardTitle className="font-headline text-primary flex items-center"><Gem className="mr-2"/> AdValue - AI Project Valuation</CardTitle>
            <CardDescription>Estimate the market value of your project, business, or even a URL.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name or URL</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Project Phoenix' or 'example.com'" {...field} className="bg-transparent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project's purpose, features, and goals..."
                      className="resize-none bg-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent"><SelectValue placeholder="Select category..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="Biotech">Biotech</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Web">Web/URL</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent"><SelectValue placeholder="Select stage..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Idea">Idea</SelectItem>
                        <SelectItem value="Prototype">Prototype</SelectItem>
                        <SelectItem value="Production">In Production</SelectItem>
                        <SelectItem value="Established">Established</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Market</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Global consumer tech, B2B enterprise" {...field} className="bg-transparent"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch space-y-4 mt-auto">
             <Button type="submit" disabled={isLoading} className="w-full pulse-light-border">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Estimating Value...</>
              ) : (
                <><Gem className="mr-2 h-4 w-4" /> Estimate Value</>
              )}
            </Button>
            {valuation && (
                <Card className="bg-background/50 border-primary/30">
                    <CardHeader>
                        <CardTitle className="text-primary font-headline">Valuation Summary</CardTitle>
                        <CardDescription>For: {form.getValues('projectName')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between"><span>Innovation Rarity Score:</span> <span className="font-mono text-primary">{valuation.rarityScore.toFixed(2)} / 10</span></div>
                        <div className="flex justify-between"><span>Predicted Demand Level:</span> <span className="font-mono text-primary">{valuation.demandLevel.toFixed(2)} / 10</span></div>
                        <div className="flex justify-between"><span>Avg. AI Innovation Rating:</span> <span className="font-mono text-primary">{valuation.avgAiRating.toFixed(2)} / 10</span></div>
                        <Separator className="my-2 bg-primary/20" />
                        <div className="text-center pt-2">
                          <p className="text-muted-foreground">Estimated Market Value</p>
                          <p className="text-3xl font-bold text-glow">${Number(valuation.estimatedValue).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Likely Range: ${Number(valuation.likelyRange.min).toLocaleString()} – ${Number(valuation.likelyRange.max).toLocaleString()}</p>
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
