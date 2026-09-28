<template>
  <v-app>
    <TopNavBar></TopNavBar>
    <MainMap></MainMap>
    <LeftNavBar></LeftNavBar>
  </v-app>
</template>

<script setup>
  import TopNavBar from './TopNavBar.vue'
  import LeftNavBar from './LeftNavBar.vue'
  import MainMap from './MainMap.vue'
  import { onMounted, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
  import { getLocation } from '@/api/location'

  const map = shallowRef(null)
  const radius = reactive([
    { TXT: '50M', COD: 50 },
    { TXT: '100M', COD: 100 },
  ])
</script>

<style>
  .mainText {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
