'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { BracketIcon, MicrophoneIcon } from './icons';
import { Loader2, Play, Square, CassetteTape, ServerCrash } from 'lucide-react';
import { runGetPersonalizedDayOfDeath } from '@/ai/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

type Status = 'idle' | 'requesting' | 'recording' | 'processing' | 'success' | 'error';

export function DivinationCounter() {
  const [status, setStatus] = useState<Status>('idle');
  const [projectedDate, setProjectedDate] = useState<string | null>(null);
  const [audioResponseUrl, setAudioResponseUrl] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPlayer) audioPlayer.pause();
    };
  }, [audioPlayer]);

  const startRecordingTimer = () => {
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartRecording = async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setStatus('processing');
        stopRecordingTimer();
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const result = await runGetPersonalizedDayOfDeath({ voiceRecordingDataUri: base64Audio });
            setProjectedDate(result.projectedDayOfDeath);
            setAudioResponseUrl(result.audioResponse);
            
            const player = new Audio(result.audioResponse);
            setAudioPlayer(player);
            player.play();

            setStatus('success');
          } catch (e) {
            console.error(e);
            setStatus('error');
            toast({
              variant: "destructive",
              title: "AI Processing Error",
              description: "Could not get your projection. Please try again.",
            });
          }
        };
      };

      mediaRecorderRef.current.start();
      startRecordingTimer();
      setStatus('recording');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use this feature.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleReset = () => {
    if (audioPlayer) audioPlayer.pause();
    setStatus('idle');
    setProjectedDate(null);
    setAudioResponseUrl(null);
    setAudioPlayer(null);
    setRecordingSeconds(0);
    stopRecordingTimer();
  };

  const renderContent = () => {
    switch (status) {
      case 'recording':
        return (
          <div className="flex flex-col items-center justify-center text-center h-48">
             <p className="text-primary animate-pulse">Recording...</p>
             <p className="text-2xl font-bold my-4">{`00:${recordingSeconds.toString().padStart(2, '0')}`}</p>
             <Progress value={(recordingSeconds / 5) * 100} className="w-full h-1 bg-primary/20" />
             <p className="text-muted-foreground mt-4">Speak clearly: "What is my day of death?"</p>
          </div>
        );
      case 'processing':
        return (
            <div className="flex flex-col items-center justify-center text-center h-48">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="mt-4 text-lg">Analyzing biometric & vocal patterns...</p>
                <p className="text-muted-foreground">Projecting timeline...</p>
            </div>
        );
      case 'success':
        return (
            <div className="flex flex-col items-center justify-center text-center h-48">
                <CassetteTape className="h-12 w-12 text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Projected Day of Death:</p>
                <p className="font-headline text-4xl text-glow">{projectedDate}</p>
            </div>
        );
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center text-center h-48">
                <ServerCrash className="h-12 w-12 text-destructive" />
                <p className="mt-4 text-lg text-destructive">Projection Failed</p>
                <p className="text-muted-foreground">A system error occurred. Please try again.</p>
            </div>
        );
      case 'idle':
      case 'requesting':
      default:
        return (
            <div className="flex flex-col items-center justify-center text-center h-48">
                <BracketIcon className="h-16 w-16 text-primary/50" />
                <p className="mt-4 text-lg">Step into the BrackeT</p>
                <p className="text-muted-foreground">Ask and you shall receive your projection.</p>
            </div>
        );
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-card to-gray-900 border-2 border-primary/30 h-full flex flex-col justify-between pulse-light-border">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-glow flex items-center">
            <BracketIcon className="w-8 h-8 mr-2 text-primary" />
            Digital Divination Counter
        </CardTitle>
        <CardDescription>Receive your personalized projected Day of Death.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="w-full h-full p-4 border-2 border-dashed border-primary/20 rounded-lg bg-background/30 flex items-center justify-center">
            {renderContent()}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
            {status === 'idle' && (
                <Button onClick={handleStartRecording} className="w-48 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20">
                    <MicrophoneIcon className="mr-2 h-4 w-4" /> Begin Scan
                </Button>
            )}
            {status === 'requesting' && (
                <Button disabled className="w-48">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting Access
                </Button>
            )}
            {status === 'recording' && (
                <Button onClick={handleStopRecording} variant="destructive" className="w-48">
                    <Square className="mr-2 h-4 w-4" /> Stop Scan
                </Button>
            )}
            {(status === 'success' || status === 'error') && (
                <Button onClick={handleReset} variant="outline" className="w-48">
                    New Projection
                </Button>
            )}
            {status === 'success' && audioResponseUrl && (
                 <Button onClick={() => audioPlayer?.play()} className="w-48">
                    <Play className="mr-2 h-4 w-4" /> Play Response
                </Button>
            )}
        </div>
        <p className="text-sm text-muted-foreground">Cost: US$1 or 1 bitcoinayt</p>
      </CardFooter>
    </Card>
  );
}
