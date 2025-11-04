'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface SpinWheelProps {
  title: string;
  prizes: { text: string }[];
}

const colors = [
  '#633dff', '#4f31cc', '#3e27a3', '#2d1d7a',
  '#633dff', '#4f31cc', '#3e27a3', '#2d1d7a'
];

export function SpinWheel({ title, prizes }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  
  const numPrizes = prizes.length;
  const prizeAngle = 360 / numPrizes;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const randomStopAngle = Math.floor(Math.random() * 360);
    const fullRotations = 5;
    const newRotation = rotation + (360 * fullRotations) + randomStopAngle;
    
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const finalAngle = newRotation % 360;
      const prizeIndex = Math.floor((360 - finalAngle + prizeAngle / 2) % 360 / prizeAngle);
      const wonPrize = prizes[prizeIndex];
      setResult(wonPrize.text);
      if (!wonPrize.text.toLowerCase().includes('try') && !wonPrize.text.toLowerCase().includes('close') && !wonPrize.text.toLowerCase().includes('next time')) {
        setIsWinModalOpen(true);
        setTimeout(() => {
          setIsWinModalOpen(false);
        }, 3600);
      }
    }, 5000); // Corresponds to animation duration
  };

  return (
    <>
      <Card className="w-full max-w-sm bg-card/50 backdrop-blur-sm border-primary/20 text-center">
        <CardHeader>
          <CardTitle className="font-headline text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div 
              className="absolute w-full h-full rounded-full border-4 border-primary/50 transition-transform duration-[5000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {prizes.map((prize, i) => (
                <div 
                  key={i} 
                  className="absolute w-1/2 h-1/2 origin-bottom-right"
                  style={{ 
                    transform: `rotate(${i * prizeAngle}deg)`,
                    clipPath: `polygon(0 0, 100% 0, 100% 2px, ${Math.tan(prizeAngle/2 * Math.PI/180) * 100}% 100%, 0% 2px)`
                  }}
                >
                    <div 
                        className="absolute w-full h-full flex items-center justify-end"
                        style={{
                            backgroundColor: colors[i % colors.length],
                            transform: 'rotate(90deg) translate(-50%, -50%)',
                            transformOrigin: 'center center',
                            clipPath: `polygon(50% 50%, 0% 0%, 100% 0%)`,
                        }}
                    >
                    <span 
                        className="text-white text-[10px] font-bold -rotate-90 translate-y-[-40px] translate-x-[15px] whitespace-nowrap"
                    >
                        {prize.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary z-10"
              style={{ filter: 'drop-shadow(0 0 5px hsl(var(--primary)))' }}
            ></div>

            <div className="absolute w-16 h-16 bg-card rounded-full border-4 border-primary flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
            </div>

          </div>

          <Button onClick={handleSpin} disabled={spinning} className="w-full pulse-light-border">
            {spinning ? 'Spinning...' : 'Spin to Win'}
          </Button>
          {result && !spinning && <p className="text-lg font-bold text-primary animate-pulse">{result}</p>}
        </CardContent>
      </Card>
      
      <Dialog open={isWinModalOpen} onOpenChange={setIsWinModalOpen}>
        <DialogContent className="bg-gradient-to-br from-card to-background border-primary pulse-light-border">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-glow text-center">CONGRATULATIONS!</DialogTitle>
            <DialogDescription className="text-center text-lg text-primary">
              You've Won!
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-xl">You won:</p>
            <p className="text-4xl font-bold text-glow font-headline my-4">{result}</p>
            <p className="text-muted-foreground">Your prize has been credited to your account.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
