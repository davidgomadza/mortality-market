import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Coins, Mail } from "lucide-react";

export function Kiosk() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-primary flex items-center">
          <Coins className="mr-2" /> AGT Synthesis Kiosk
        </CardTitle>
        <CardDescription>Your gateway to extended life.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h3 className="font-bold text-lg">Purchase AGT Coins</h3>
          <p className="text-muted-foreground">
            All wagers and prizes are handled in AGT Coins. Purchase tradable AGT Coins here to participate in the Mortality Market.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Prize Redemption</h3>
          <p className="text-muted-foreground">
            Winners redeem AGT Coins for the real Advanced GeneticSynthesis Technology. Prizes are awarded up to 100 AGT Coins.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-2">
         <p className="text-sm font-bold">Claim your AGT prize:</p>
         <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
             <a href="mailto:liveforever@buythecurefordeath.world">
                <Mail className="mr-2 h-4 w-4" /> Email Redemption Center
             </a>
         </Button>
      </CardFooter>
    </Card>
  );
}
