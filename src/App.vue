<script setup lang="ts">
import { computed, ref } from 'vue';
import Arrow from './components/Arrow.vue';
import Hand from './components/Hand.vue';
import { Status } from './types';

let playerOneTurn = ref(true);

const playerTwoTurn = computed({
  get() {
    return !playerOneTurn.value;
  },
  set(newValue) {
    playerOneTurn.value = !newValue;
  },
});
</script>

<template>
  <div id="app">
    <Hand v-model:active="playerOneTurn"></Hand>
    <Arrow
      :class="{
        left: playerOneTurn,
        right: !playerOneTurn,
      }"></Arrow>
    <Hand v-model:active="playerTwoTurn"></Hand>
  </div>
</template>

<style lang="scss" scoped>
#app {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 4rem;
  box-sizing: border-box;
}
</style>
