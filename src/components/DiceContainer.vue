<script setup lang="ts">
import { computed } from 'vue';
import Dice from './Dice.vue';
import { Status, type DiceItem, type FoundHand } from '@/types';
import { moveElementToEnd } from '@/composables/helpers';

const props = withDefaults(
  defineProps<{
    status?: Status;
    active?: boolean;
    dice?: DiceItem[];
    validSelectedHands?: FoundHand[];
  }>(),
  {
    status: () => Status.FirstRoll,
    active: () => false,
    dice: () => [],
    validSelectedHands: () => [],
  }
);
const emit = defineEmits<{ (e: 'update:dice', dice: DiceItem[]): void }>();

function moveDiceToEnd(dice: DiceItem) {
  const index = props.dice.findIndex((d) => d.key === dice.key);
  if (index != -1) {
    emit('update:dice', moveElementToEnd(props.dice, index));
  }
}

function moveToDice(item: DiceItem) {
  item.list = 'dice';
  moveDiceToEnd(item);
}

function moveToSelectedDice(item: DiceItem) {
  item.list = 'selected';
  moveDiceToEnd(item);
}

const internalDice = computed(() => {
  return props.dice.filter((d) => d.list === 'dice');
});

const internalSelectedDice = computed(() => {
  return props.dice.filter((d) => d.list !== 'dice');
});

const diceActive = computed(() => {
  return props.active && props.status !== Status.FirstRoll;
});
</script>

<template>
  <div>
    <ul>
      <li
        v-for="dice in internalDice"
        :key="dice.key"
        @click="diceActive && moveToSelectedDice(dice)">
        <Dice
          :class="{
            active: diceActive,
          }"
          :value="dice.value"></Dice>
      </li>
    </ul>
    <ul>
      <li
        v-for="dice in internalSelectedDice"
        :key="dice.key"
        @click="diceActive && moveToDice(dice)">
        <Dice
          :class="{
            active: diceActive && dice.list !== 'played',
          }"
          :value="dice.value"></Dice>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
$gap: 1rem;
$diceSize: 3rem;
$numDice: 6;

ul {
  list-style: none;
  display: flex;
  width: $numDice * $diceSize + ($numDice - 1) * $gap;
  height: $diceSize;
  gap: $gap;
  padding: $gap;
  background-color: lightgray;
  border-radius: $gap;
}
li {
  padding: 0;
  margin: 0;
  display: inline-block;
}

.v-move {
  transition: transform 0.5s ease;
}
</style>
