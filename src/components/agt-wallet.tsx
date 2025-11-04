'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

const walletTokens = [
  { name: 'AGT', balance: '37,867,890,284' },
  { name: 'S96t\'', balance: '37,867,890,284' },
  { name: 'BTCYT', balance: '37,867,890,284' },
  { name: 'BTC', balance: '37,867,890,284' },
  { name: 'GTPS', balance: '37,867,890,284' },
  { name: 'GIRG', balance: '37,867,890,284' },
];

export function AgtWallet() {
  return (
    <div className="max-w-md mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="p-6 bg-green-800/20 rounded-t-lg">
                <h2 className="font-headline text-xl text-white">AGT Wallet</h2>
                <p className="text-sm text-green-200">Advanced Genetic Synthesis Technology Wallet — by davidgomadza</p>
            </div>
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-xs break-all text-muted-foreground">J6IJNHEKBAAFDHMPLIMEEEJBODGCHMPFIBKFMCNAGNFNGE OAHJEB</p>
                    <div className="flex flex-col space-y-2">
                        <Button className="bg-green-600 hover:bg-green-500 text-white">
                            <ArrowDown className="mr-2 h-4 w-4" /> Receive
                        </Button>
                        <Button className="bg-green-800 hover:bg-green-700 text-white">
                            <ArrowUp className="mr-2 h-4 w-4" /> Send
                        </Button>
                    </div>
                </div>
                
                <Card className="bg-background/30 p-4">
                    <h3 className="font-bold text-lg mb-4 text-primary">💰 Balances</h3>
                    <div className="space-y-4">
                        {walletTokens.map((token, index) => (
                            <div key={token.name}>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-mono">{token.name}</p>
                                    <p className="text-lg font-mono text-green-400">{token.balance}</p>
                                </div>
                                {index < walletTokens.length - 1 && <Separator className="mt-2 bg-border/50" />}
                            </div>
                        ))}
                    </div>
                </Card>
            </CardContent>
        </Card>
    </div>
  );
}
