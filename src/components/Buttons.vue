<script setup lang="ts">
import { Status, type DiceItem, type FoundHand } from '@/types';
import { computed, nextTick, reactive, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    status?: Status;
    active?: boolean;
    bust?: boolean;
    dice?: DiceItem[];
    validSelectedHands?: FoundHand[];
    validUnplayedHands?: FoundHand[];
  }>(),
  {
    status: () => Status.FirstRoll,
    active: () => false,
    bust: () => false,
    dice: () => [],
    validSelectedHands: () => [],
    validUnplayedHands: () => [],
  }
);

const emit = defineEmits<{
  (e: 'update:status', status: Status): void;
  (e: 'update:active', active: boolean): void;
  (e: 'update:bust', bust: boolean): void;
}>();
const selectedSum = computed(() => {
  return props.validSelectedHands.reduce(
    (sum, value) => {
      sum.score += value.score;
      sum.keys = sum.keys.concat(value.keys);
      return sum;
    },
    { score: 0, keys: [] }
  );
});
const selectedScore = computed(() => {
  return selectedSum.value.score;
});

const rollActive = computed(() => {
  return (
    (props.active && props.status === Status.FirstRoll) ||
    (props.dice.some((dice) => {
      return dice.list === 'selected';
    }) &&
      props.status === Status.HandSelect &&
      props.validSelectedHands.length > 0)
  );
});

function shuffle() {
  if (props.active) {
    if (props.status === Status.FirstRoll) {
      props.dice.forEach((dice) => (dice.list = 'dice'));
    }
    props.dice.forEach((_, index, dice) => {
      const die = dice[index];

      if (die && die.list !== 'played') {
        die.value = Math.floor(Math.random() * 6) + 1;
      }
    });
    emit('update:status', Status.HandSelect);
  }
}

const totalScore = ref(0);
const roundScore = ref(0);
const active = computed(() => props.active);

function playSelected() {
  roundScore.value += selectedSum.value.score;
  props.validSelectedHands.forEach((hand) => {
    props.dice.forEach((dice) => {
      if (hand.keys.includes(dice.key)) {
        dice.list = 'played';
      }
    });
  });
}
function pass() {
  playSelected();
  totalScore.value += roundScore.value;
  roundScore.value = 0;
  emit('update:active', false);
  emit('update:status', Status.FirstRoll);
}
const validUnplayedHands = computed(() => props.validUnplayedHands);
function roll() {
  playSelected();

  const numRemainingDice = props.dice.filter(
    (dice) => dice.list !== 'played'
  ).length;
  if (numRemainingDice == 0) {
    props.dice.forEach((dice) => (dice.list = 'dice'));
  }

  shuffle();

  nextTick(() => {
    if (validUnplayedHands.value.length == 0) {
      roundScore.value = 0;
      pass();
      emit('update:bust', true);
    }
  });
}
watch(active, (active) => {
  if (active) {
    emit('update:bust', false);
  }
});
</script>

<template>
  <div>
    <p>Score: {{ totalScore }}</p>
    <span
      ><button
        :class="{
          active: rollActive,
        }"
        @click="roll">
        {{ props.status === Status.FirstRoll ? 'Roll' : 'Roll Again' }}
      </button>
      <button
        :class="{
          active: props.active && props.status !== Status.FirstRoll,
        }"
        @click="pass">
        Pass
      </button>
      <span>
        <p>Selected Score:</p>
        <p>{{ roundScore + selectedScore }}</p>
      </span></span
    >
  </div>
</template>

<style lang="scss" scoped>
div {
  > p {
    font-size: 1.5rem;
  }
  > span {
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      font-size: 1.75rem;
      opacity: 0.5;
      padding: 0.75rem;
      width: max-content;
      height: max-content;
    }
    button.active {
      opacity: 1;
    }
    span {
      font-size: 1.25rem;
      padding: 0.25rem;

      p {
        margin: 0;
      }
    }
  }
}
</style>
