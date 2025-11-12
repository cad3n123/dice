<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value?: number;
  }>(),
  {
    value: () => 0,
  }
);
</script>

<template>
  <div class="dice">
    <div class="top">
      <div :class="{ active: props.value > 1 }"></div>
      <div :class="{ active: props.value >= 4 }"></div>
    </div>
    <div class="middle">
      <div :class="{ active: ![2, 4].includes(props.value) }"></div>
      <div :class="{ active: props.value == 6 }"></div>
    </div>
    <div class="bottom">
      <div :class="{ active: props.value >= 4 }"></div>
      <div :class="{ active: props.value > 1 }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$gap: 1rem;
$diceSize: 3rem;

.dice {
  width: $diceSize;
  height: $diceSize;
  box-sizing: border-box;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc($diceSize / 2);
  background-color: white;
  border-radius: calc($gap / 2);
  display: flex;
  flex-direction: column;
  padding: 0.1rem;
  cursor: pointer;

  opacity: 0.7;
  filter: brightness(0.7);

  > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    > div {
      --size: 0.5rem;

      visibility: hidden;

      border-radius: 50%;
      background-color: black;

      width: var(--size);
      height: var(--size);
    }
    > div.active {
      visibility: visible;
    }
  }
  > div.middle {
    > div {
      display: none;
      visibility: visible;
    }
    > div.active {
      display: block;
    }
  }
}

.dice.active {
  opacity: 1;
  filter: brightness(1);
}
</style>
