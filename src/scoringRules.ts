function range(start: number, end: number, step = 1) {
  return Array.from(
    { length: (end - start) / step + 1 },
    (_, i) => start + i * step
  );
}

export const scoringRules = [
  {
    dice: [1],
    score: 100,
  },
  {
    dice: [5],
    score: 50,
  },
  {
    dice: [1, 2, 3, 4, 5],
    score: 500,
  },
  {
    dice: [2, 3, 4, 5, 6],
    score: 750,
  },
  {
    dice: [1, 2, 3, 4, 5, 6],
    score: 1500,
  },
  ...[
    {
      dice: 1,
      score: 1000,
    },
    {
      dice: 2,
      score: 200,
    },
    {
      dice: 3,
      score: 300,
    },
    {
      dice: 4,
      score: 400,
    },
    {
      dice: 5,
      score: 500,
    },
    {
      dice: 6,
      score: 600,
    },
  ].flatMap((scoring) => {
    const start = 3;
    return range(start, 6).map((i) => {
      return {
        dice: Array(i).fill(scoring.dice),
        score: 2 ** (i - start) * scoring.score,
      };
    });
  }),
]
  .sort((a, b) => a.dice.length - b.dice.length)
  .reverse();
