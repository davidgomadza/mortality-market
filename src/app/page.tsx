import { AgtWallet } from '@/components/agt-wallet';
import { BillionaireWager } from '@/components/billionaire-wager';
import { DatePredictor } from '@/components/date-predictor';
import { DivinationCounter } from '@/components/divination-counter';
import { Kiosk } from '@/components/kiosk';
import { MortalityMarket } from '@/components/mortality-market';
import { ProjectValuation } from '@/components/project-valuation';
import { SpinWheel } from '@/components/spin-wheel';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center my-8">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-glow tracking-wider uppercase">
          The Mortality Market
        </h1>
        <p className="text-primary mt-2 text-lg">
          AGT Life-Clock Wager
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 my-12 items-start">
        <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
            <h2 className="font-headline text-3xl text-glow uppercase text-center">Gates of Chance</h2>
            <div className="flex flex-col md:flex-row lg:flex-col gap-8 w-full items-center justify-around">
              <SpinWheel
                title="The Life Airdrop"
                prizes={[
                  { text: "1 AGT" },
                  { text: "5 S96t'" },
                  { text: "10 BTCYT" },
                  { text: "Try Again" },
                  { text: "2 BTC" },
                  { text: "Spin Again" },
                  { text: "1 GTPS" },
                  { text: "Jackpot! 5 GIRG" },
                ]}
              />
              <SpinWheel
                title="The Riddle Game"
                prizes={[
                  { text: "1 GIRG" },
                  { text: "Try Again" },
                  { text: "1 BTCYT" },
                  { text: "Better Luck Next Time" },
                  { text: "1 AGT" },
                  { text: "Spin Again" },
                  { text: "1 S96t'" },
                  { text: "So Close!" },
                ]}
              />
            </div>
        </div>
        <div className="lg:col-span-3">
          <DivinationCounter />
        </div>
      </section>
      
      <Separator className="my-12 bg-primary/50" />

      <section className="my-12">
        <h2 className="font-headline text-3xl md:text-4xl text-glow uppercase text-center mb-8">AGT Wallet</h2>
        <AgtWallet />
      </section>

      <Separator className="my-12 bg-primary/50" />

      <section className="my-12">
        <h2 className="font-headline text-3xl md:text-4xl text-glow uppercase text-center mb-8">Billionaire's Life-Clock Wager</h2>
        <BillionaireWager />
      </section>

      <Separator className="my-12 bg-primary/50" />

      <section className="grid md:grid-cols-2 gap-8 my-12">
        <div>
          <h2 className="font-headline text-3xl text-glow uppercase text-center mb-8">Mortality Market</h2>
          <MortalityMarket />
        </div>
        <div>
          <h2 className="font-headline text-3xl text-glow uppercase text-center mb-8">AGT Kiosk</h2>
          <Kiosk />
        </div>
      </section>

      <Separator className="my-12 bg-primary/50" />

      <section className="grid md:grid-cols-2 gap-8 my-12">
        <div>
          <h2 className="font-headline text-3xl text-glow uppercase text-center mb-8">AI Date Prediction</h2>
          <DatePredictor />
        </div>
        <div>
          <h2 className="font-headline text-3xl text-glow uppercase text-center mb-8">AI Project Valuation</h2>
          <ProjectValuation />
        </div>
      </section>

      <footer className="text-center text-muted-foreground mt-16 pb-8">
          <p>Wagers governed by The Mortality Market Smart Contract (MMSC).</p>
          <p>All prizes redeemable for AGT via email: liveforever@buythecurefordeath.world</p>
      </footer>
    </main>
  );
}
