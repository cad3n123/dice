<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, type Ref } from 'vue';
import DiceContainer from './DiceContainer.vue';
import Buttons from './Buttons.vue';
import { Status, type DiceItem, type FoundHand } from '@/types';
import { farkleScoring } from '@/composables/farkleScoring';

const props = withDefaults(
  defineProps<{
    active?: boolean;
  }>(),
  {
    active: () => false,
  }
);
const status = ref(Status.FirstRoll);
const dice: Ref<DiceItem[]> = ref([]);
const bust = ref(false);

const emit = defineEmits<{
  (e: 'update:active', active: boolean): void;
}>();

const active = computed({
  get() {
    return props.active;
  },
  set(newValue) {
    emit('update:active', newValue);
  },
});

let currentId = 0;

function refillDice() {
  for (let i = 0; i < 6; i++) {
    dice.value.push({
      key: i + currentId++,
      value: i + 1,
      list: 'dice',
    });
  }
}
const scoring = inject('scoringRules');
const { selectedHands: validSelectedHands, unplayedHands: validUnplayedHands } =
  farkleScoring(dice, scoring);

refillDice();
</script>

<template>
  <div class="hand">
    <Buttons
      v-model:status="status"
      v-model:active="active"
      v-model:bust="bust"
      :dice="dice"
      :validSelectedHands="validSelectedHands"
      :validUnplayedHands="validUnplayedHands"></Buttons>
    <p :class="{ active: bust }">Bust!</p>
    <DiceContainer
      :status="status"
      :active="active"
      :dice="dice"
      :validSelectedHands="validSelectedHands"></DiceContainer>
  </div>
</template>

<style lang="scss" scoped>
.hand {
  width: max-content;

  p {
    display: none;

    color: red;
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    margin: 1rem 0;
  }
  p.active {
    display: block;
  }
}
</style>
