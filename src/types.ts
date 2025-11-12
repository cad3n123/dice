export enum Status {
  FirstRoll,
  HandSelect,
}

export interface DiceItem {
  key: number;
  value: number;
  list: 'dice' | 'selected' | 'played';
}

export interface FoundHand {
  keys: number[]; 
  score: number;
}