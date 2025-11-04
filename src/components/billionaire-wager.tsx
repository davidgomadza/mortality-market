'use client';

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { billionaires, type Billionaire } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, X } from 'lucide-react';

const ChallengeSchema = z.object({
  identityKey: z.string().min(1, { message: "Identity key is required." }),
  action: z.enum(["agree", "disagree"]),
  stake: z.string().optional(),
  newDate: z.string().optional(),
  confidence: z.number().optional(),
}).refine(data => {
    if (data.action === "agree") return !!data.stake && data.stake.length > 0;
    return true;
}, {
    message: "Stake amount is required when agreeing.",
    path: ["stake"],
}).refine(data => {
    if (data.action === "disagree") return !!data.newDate && data.newDate.length > 0;
    return true;
}, {
    message: "A new date is required when disagreeing.",
    path: ["newDate"],
});

export function BillionaireWager() {
  const [billionaireData, setBillionaireData] = React.useState<Billionaire[]>(billionaires);

  const form = useForm<z.infer<typeof ChallengeSchema>>({
    resolver: zodResolver(ChallengeSchema),
    defaultValues: {
      identityKey: "",
      action: "agree",
      stake: "",
      newDate: "",
      confidence: 50,
    },
  });

  const watchAction = form.watch("action");

  function onSubmit(data: z.infer<typeof ChallengeSchema>) {
    console.log("Billionaire challenge submitted:", data);
    // In a real app, this would trigger a backend update.
    // Here we just log it to the console.
    form.reset();
  }

  const renderChallenge = (billionaire: Billionaire) => {
    switch (billionaire.challenge.status) {
      case 'AGREE':
        return <Badge variant="secondary" className='bg-green-500/20 text-green-400 border-green-500/30'><Check className="mr-1 h-3 w-3" />Agreed: {billionaire.challenge.stake}</Badge>;
      case 'DISAGREE':
        return <Badge variant="secondary" className='bg-red-500/20 text-red-400 border-red-500/30'><X className="mr-1 h-3 w-3" />Disagreed: {billionaire.challenge.newDate} @ {billionaire.challenge.newConfidence}%</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className='border-amber-500/30 text-amber-400'>Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-primary">High-Stakes Wagers</CardTitle>
            <CardDescription>Real-time list of influential billionaires in the game.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-primary/20">
                  <TableHead className="text-primary">Name</TableHead>
                  <TableHead className="text-primary">AGT Projected Day of Death</TableHead>
                  <TableHead className="text-primary">Prize Pool (AGT)</TableHead>
                  <TableHead className="text-primary">Public Confidence</TableHead>
                  <TableHead className="text-primary text-right">Billionaire's Challenge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billionaireData.map((b) => (
                  <TableRow key={b.name} className="border-primary/10">
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.projectedDeath}</TableCell>
                    <TableCell className="text-primary font-bold">{b.prizePool}</TableCell>
                    <TableCell>{b.publicConfidence}%</TableCell>
                    <TableCell className="text-right">{renderChallenge(b)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 pulse-light-border">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Interaction Terminal</CardTitle>
            <CardDescription>Billionaires may validate or challenge their projected date here.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="identityKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identity/Wallet Key</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="action"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Action</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="agree" />
                            </FormControl>
                            <FormLabel className="font-normal">Agree</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="disagree" />
                            </FormControl>
                            <FormLabel className="font-normal">Disagree</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className={cn("space-y-4 p-4 border rounded-md border-dashed border-primary/30", watchAction === "agree" ? "block" : "hidden")}>
                    <FormField
                    control={form.control}
                    name="stake"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stake Amount</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 5 BTC" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className={cn("space-y-4 p-4 border rounded-md border-dashed border-primary/30", watchAction === "disagree" ? "block" : "hidden")}>
                    <FormField
                        control={form.control}
                        name="newDate"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Projected Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} className="bg-background/50"/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confidence"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Confidence: {field.value}%</FormLabel>
                            <FormControl>
                                <Slider
                                    min={0}
                                    max={100}
                                    step={1}
                                    defaultValue={[field.value ?? 50]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
                    Submit Challenge <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
