import { mortalityMarketTokens } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function MortalityMarket() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-primary">Token Wagers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20">
              <TableHead className="text-primary">Token</TableHead>
              <TableHead className="text-primary">Projected Day of Death</TableHead>
              <TableHead className="text-primary">Prize Multiplier</TableHead>
              <TableHead className="text-right text-primary">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mortalityMarketTokens.map((token) => (
              <TableRow key={token.name} className="border-primary/10">
                <TableCell className="font-medium">{token.name}</TableCell>
                <TableCell>{token.projectedDeath}</TableCell>
                <TableCell className="text-primary font-bold">{token.multiplier}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <TrendingUp className="mr-2 h-4 w-4" /> Wager
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
