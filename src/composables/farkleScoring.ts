import type { DiceItem, FoundHand } from '@/types';
import { computed, getCurrentInstance, type Ref } from 'vue';

function getScoredHands(diceToScore: DiceItem[], scoring: any): FoundHand[] {
  // Map: Value -> Array of Keys (e.g., 1 -> [key1, key5, key9])
  const availableDiceByValue = new Map<number, number[]>();
  diceToScore.forEach((die) => {
    if (!availableDiceByValue.has(die.value)) {
      availableDiceByValue.set(die.value, []);
    }
    availableDiceByValue.get(die.value)!.push(die.key);
  });

  const scoredHands: FoundHand[] = [];
  const usedDiceKeys = new Set<number>();

  let diceRemaining = diceToScore.length;
  let ruleIndex = 0;

  // 2. Iterate through the scoring rules (Rule Index)
  while (diceRemaining > 0 && ruleIndex < scoring.length) {
    const currentRule = scoring[ruleIndex];
    let foundMatch = false;

    // 3. For the current rule, check if a match can be made
    // We check if we have enough of each die value required by the rule.
    let canFormHand = true;
    // This will hold the keys that would be used if the hand is scored.
    const keysForCurrentHand: number[] = [];

    // Rule's dice is a list of required values, e.g., [1, 1, 1]
    const requiredDiceValues = currentRule.dice;

    // Count how many dice of each value the rule requires (e.g., three 1s).
    const requiredCounts = new Map<number, number>();
    requiredDiceValues.forEach((val: number) => {
      requiredCounts.set(val, (requiredCounts.get(val) || 0) + 1);
    });

    // Check if the available, UNUSED dice are enough for the rule
    for (const [requiredValue, count] of requiredCounts.entries()) {
      // Get all available keys for this value
      const allAvailableKeys = availableDiceByValue.get(requiredValue) || [];

      // Filter out keys already in the usedDiceKeys Set
      const unusedAvailableKeys = allAvailableKeys.filter(
        (key) => !usedDiceKeys.has(key)
      );

      if (unusedAvailableKeys.length < count) {
        // Not enough unused dice of this value to form the hand.
        canFormHand = false;
        break;
      }

      // Select the required number of keys to form the hand.
      // We don't care *which* keys we pick, just that we have enough.
      keysForCurrentHand.push(...unusedAvailableKeys.slice(0, count));
    }

    // 4. Scoring the Hand
    if (canFormHand) {
      // Add the found hand to the result list
      scoredHands.push({
        keys: keysForCurrentHand,
        score: currentRule.score,
      });

      // Mark the used keys so they are not used again
      keysForCurrentHand.forEach((key) => usedDiceKeys.add(key));

      // Decrease the total dice remaining count
      diceRemaining -= keysForCurrentHand.length;

      // Important: Because we prioritize the biggest hands, we must re-check the
      // *same rule* again (by not incrementing ruleIndex) in case we can make another one.
      foundMatch = true;
    }

    // 5. Move to the next scoring rule if no match was found for the current one
    if (!foundMatch) {
      ruleIndex++;
    }
  }

  return scoredHands;
}

export function farkleScoring(dice: Ref<DiceItem[]>, scoring: any) {
  const selectedHands = computed(() => {
    const selectedDice = dice.value.filter((d) => d.list === 'selected');
    return getScoredHands(selectedDice, scoring);
  });

  const unplayedHands = computed(() => {
    const unplayedDice = dice.value.filter((d) => d.list !== 'played');
    return getScoredHands(unplayedDice, scoring);
  });

  return { selectedHands, unplayedHands };
}
