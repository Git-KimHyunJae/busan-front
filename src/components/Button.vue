<template>
  <v-btn :color="props.color" :disabled="props.disabled" :class="props.class">
    {{ props.text }}</v-btn
  >
</template>

<script setup>
  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: '000000',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    class: {
      type: Object,
    },
  })
</script>

<style lang="scss" scoped></style>
