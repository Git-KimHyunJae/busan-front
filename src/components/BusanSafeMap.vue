<template>
  <v-app>
    <v-navigation-drawer> </v-navigation-drawer>
    <div ref="mapContainer" style="width: 100vw; height: 100vh"></div>
  </v-app>
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, shallowRef } from "vue";

const mapContainer = ref(null);
const map = shallowRef(null);
const pointLocation = reactive({
  x: 35.17972847528216,
  y: 129.07506760221816,
});
const clickHandler = (mouseEvent) => {
  const latlng = mouseEvent.latLng;

  pointLocation.x = latlng.getLat();
  pointLocation.y = latlng.getLng();

  const message = `클릭한 위치의 위도는 ${pointLocation.x} 이고, 경도는 ${pointLocation.y} 입니다`;
  console.log("message", message);
};

const initMap = () => {
  const options = {
    center: new kakao.maps.LatLng(pointLocation.x, pointLocation.y),
    level: 1,
  };
  map.value = new kakao.maps.Map(mapContainer.value, options);
};

// 3. 카카오맵 자체 API를 사용하여 클릭 이벤트를 등록합니다.
const registerClickEvent = () => {
  if (!map.value) return;

  kakao.maps.event.addListener(map.value, "click", clickHandler);
};

onMounted(() => {
  initMap();
  registerClickEvent();
});

onBeforeUnmount(() => {
  // 4. 컴포넌트가 파괴될 때 동일한 핸들러를 넘겨 이벤트를 깔끔하게 제거합니다.
  if (map.value) {
    kakao.maps.event.removeListener(map.value, "click", clickHandler);
  }
});
</script>

<style></style>
