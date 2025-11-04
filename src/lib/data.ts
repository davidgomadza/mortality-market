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
    name: 'Elon Musk',
    projectedDeath: '2038-05-02',
    prizePool: 362,
    publicConfidence: 78,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Larry Ellison',
    projectedDeath: '2028-05-07',
    prizePool: 296,
    publicConfidence: 65,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Jeff Bezos',
    projectedDeath: 'AGT Indefinite',
    prizePool: 252,
    publicConfidence: 95,
    challenge: {
      status: 'AGREE',
      stake: 'AGT',
    },
  },
  {
    name: 'Mark Zuckerberg',
    projectedDeath: 'AGT Indefinite',
    prizePool: 251,
    publicConfidence: 94,
    challenge: {
      status: 'AGREE',
      stake: 'AGT',
    },
  },
  {
    name: 'Steve Ballmer',
    projectedDeath: '2031-04-02',
    prizePool: 176,
    publicConfidence: 68,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Larry Page',
    projectedDeath: '2039-05-03',
    prizePool: 174,
    publicConfidence: 72,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Sergey Brin',
    projectedDeath: '2030-06-06',
    prizePool: 163,
    publicConfidence: 71,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Bernard Arnault',
    projectedDeath: '2036-06-02',
    prizePool: 162,
    publicConfidence: 80,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Jensen Huang',
    projectedDeath: '2037-04-03',
    prizePool: 151,
    publicConfidence: 85,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Warren Buffett',
    projectedDeath: '2027-08-26',
    prizePool: 146,
    publicConfidence: 88,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Michael Dell',
    projectedDeath: '2048-05-02',
    prizePool: 136,
    publicConfidence: 77,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'Bill Gates',
    projectedDeath: '2028-05-07',
    prizePool: 124,
    publicConfidence: 82,
    challenge: {
      status: 'PENDING',
    },
  },
  {
    name: 'MacKenzie Scott',
    projectedDeath: 'AGT Indefinite',
    prizePool: 42,
    publicConfidence: 92,
    challenge: {
      status: 'AGREE',
      stake: 'AGT',
    },
  },
];