<template>
  <v-app-bar>
    <v-app-bar-title>
      <div class="d-flex">
        <div class="mainText mr-3">부산 안전 지도</div>
        <v-autocomplete label="반경" :items="radius" item-title="TXT" item-value="COD">
        </v-autocomplete>
      </div>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
  import { reactive } from 'vue'

  const radius = reactive([
    { TXT: '50M', COD: 50 },
    { TXT: '100M', COD: 100 },
  ])
</script>
