export type Token = {
  name: string;
  projectedDeath: string;
  multiplier: string;
};

export const mortalityMarketTokens: Token[] = [
  { name: 'TOKEN-ALPHA', projectedDeath: '2025-07-22', multiplier: '50X' },
  { name: 'TOKEN-BETA', projectedDeath: '2030-11-05', multiplier: '20X' },
  { name: 'TOKEN-GAMMA', projectedDeath: '2045-01-15', multiplier: '5X' },
  { name: 'TOKEN-DELTA', projectedDeath: '2080-03-30', multiplier: '1X' },
];

export type Billionaire = {
  name: string;
  projectedDeath: string;
  prizePool: number;
  publicConfidence: number;
  challenge: {
    status: 'AGREE' | 'DISAGREE' | 'PENDING';
    stake?: string;
    newDate?: string;
    newConfidence?: number;
  };
};

export const billionaires: Billionaire[] = [
  {
    name: 'Elon M',
    projectedDeath: '2045-04-10',
    prizePool: 50,
    publicConfidence: 75,
    challenge: {
      status: 'AGREE',
      stake: '5 BTC',
    },
  },
  {
    name: 'MacKenzie S',
    projectedDeath: '2048-06-02',
    prizePool: 80,
    publicConfidence: 55,
    challenge: {
      status: 'DISAGREE',
      newDate: '2099-01-01',
      newConfidence: 90,
    },
  },
  {
    name: 'Jeff B',
    projectedDeath: '2052-08-19',
    prizePool: 100,
    publicConfidence: 68,
    challenge: {
      status: 'PENDING',
    },
  },
];
