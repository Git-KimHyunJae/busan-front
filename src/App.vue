<template>
  <v-app>
    <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>

    <router-view> </router-view>
  </v-app>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useLoadingStore } from '@/store/loading'

  const loadingStore = useLoadingStore()
  const { isLoading } = storeToRefs(loadingStore)
</script>
