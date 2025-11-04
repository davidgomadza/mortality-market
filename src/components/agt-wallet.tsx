'use client';

import { ArrowDown, ArrowUp, Copy, Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const initialWalletTokens = [
  { name: 'AGT', balance: '37,867,890,284' },
  { name: 'S96t\'', balance: '37,867,890,284' },
  { name: 'BTCYT', balance: '37,867,890,284' },
  { name: 'BTC', balance: '37,867,890,284' },
  { name: 'GTPS', balance: '37,867,890,284' },
  { name: 'GIRG', balance: '37,867,890,284' },
];

function generateWalletKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 58; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

export function AgtWallet() {
  const [walletKey, setWalletKey] = useState<string | null>(null);
  const [tokens, setTokens] = useState(initialWalletTokens);
  const { toast } = useToast();
  
  const [sendAmount, setSendAmount] = useState('');
  const [sendToken, setSendToken] = useState('AGT');
  const [receiveVoucher, setReceiveVoucher] = useState('');
  const [receiveToken, setReceiveToken] = useState('AGT');
  const [receiveAmount, setReceiveAmount] = useState('');


  const handleCreateWallet = () => {
    setWalletKey(generateWalletKey());
  };

  const handleCopyKey = () => {
    if (walletKey) {
      navigator.clipboard.writeText(walletKey);
      toast({
        title: "Copied!",
        description: "Wallet key copied to clipboard.",
      });
    }
  };

  const handleSend = () => {
    if (parseInt(sendAmount) > 8000) {
        toast({ variant: "destructive", title: "Error", description: "You cannot send more than 8,000 tokens at a time." });
        return;
    }
    toast({
        title: "Transaction Sent",
        description: `You sent ${sendAmount} ${sendToken}.`,
    });
    setSendAmount('');
  };

  const handleReceive = () => {
     if (parseInt(receiveAmount) > 8000) {
        toast({ variant: "destructive", title: "Error", description: "You cannot receive more than 8,000 tokens at a time." });
        return;
    }
    toast({
        title: "Tokens Received",
        description: `You received ${receiveAmount} ${receiveToken} with voucher ${receiveVoucher}.`,
    });
    setReceiveVoucher('');
    setReceiveAmount('');
  };

  if (!walletKey) {
    return (
        <div className="max-w-md mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="p-6 bg-green-800/20 rounded-t-lg">
                    <h2 className="font-headline text-xl text-white">AGT Wallet</h2>
                    <p className="text-sm text-green-200">Advanced Genetic Synthesis Technology Wallet — by davidgomadza</p>
                </div>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                    <Wallet className="w-16 h-16 text-primary" />
                    <p className="text-center text-muted-foreground">Create a new wallet to manage your AGT assets.</p>
                    <Button onClick={handleCreateWallet} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Create AGT Wallet
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="bg-green-800/20 rounded-t-lg">
                <CardTitle className="font-headline text-xl text-white">AGT Wallet</CardTitle>
                 <p className="text-sm text-green-200">Advanced Genetic Synthesis Technology Wallet — by davidgomadza</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        <p className="text-xs text-muted-foreground">Your Wallet Key</p>
                        <p className="text-xs break-all text-primary font-mono">{walletKey}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                         <Button variant="ghost" size="icon" onClick={handleCopyKey} className="text-muted-foreground h-8 w-8">
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                 <div className="flex space-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-green-600 hover:bg-green-500 text-white">
                                <ArrowDown className="mr-2 h-4 w-4" /> Receive
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Receive Tokens</DialogTitle>
                                <DialogDescription>Enter your voucher code and the amount to receive winnings.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="voucher">Voucher Code</Label>
                                    <Input id="voucher" placeholder="Enter voucher code" value={receiveVoucher} onChange={(e) => setReceiveVoucher(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="receive-amount">Amount (max 8000)</Label>
                                    <Input id="receive-amount" type="number" placeholder="e.g., 100" value={receiveAmount} onChange={(e) => setReceiveAmount(e.target.value)} max="8000" />
                                </div>
                                <div className="space-y-2">
                                     <Label htmlFor="receive-token">Token</Label>
                                     <Select onValueChange={setReceiveToken} defaultValue={receiveToken}>
                                        <SelectTrigger id="receive-token"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {tokens.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                                        </SelectContent>
                                     </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleReceive}>Receive Tokens</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                             <Button className="w-full bg-green-800 hover:bg-green-700 text-white">
                                <ArrowUp className="mr-2 h-4 w-4" /> Send
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Send Tokens</DialogTitle>
                                <DialogDescription>Enter recipient and amount to send.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="recipient">Recipient Address</Label>
                                    <Input id="recipient" placeholder="Enter recipient's wallet key" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="send-amount">Amount (max 8000)</Label>
                                    <Input id="send-amount" type="number" placeholder="e.g., 100" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} max="8000" />
                                </div>
                                <div className="space-y-2">
                                     <Label htmlFor="send-token">Token</Label>
                                     <Select onValueChange={setSendToken} defaultValue={sendToken}>
                                        <SelectTrigger id="send-token"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {tokens.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                                        </SelectContent>
                                     </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSend}>Send Tokens</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                 </div>
                
                <Card className="bg-background/30 p-4">
                    <h3 className="font-bold text-lg mb-4 text-primary">💰 Balances</h3>
                    <div className="space-y-4">
                        {tokens.map((token, index) => (
                            <div key={token.name}>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-mono">{token.name}</p>
                                    <p className="text-lg font-mono text-green-400">{token.balance}</p>
                                </div>
                                {index < tokens.length - 1 && <Separator className="mt-2 bg-border/50" />}
                            </div>
                        ))}
                    </div>
                </Card>
            </CardContent>
        </Card>
    </div>
  );
}
