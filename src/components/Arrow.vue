<script setup lang="ts"></script>

<template>
  <img src="/src/images/arrow.png" alt="^" />
</template>

<style lang="scss" scoped>
$size: 8rem;
img {
  width: $size;
  height: $size;

  transition: rotate 500ms ease-in-out;
}
.right {
  rotate: 90deg;
  transition: rotate 500ms ease-out;
}
.left {
  rotate: -90deg;
}
</style>
