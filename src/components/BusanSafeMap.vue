<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <div class="d-flex">
          <div class="mainText mr-3">부산 안전 지도</div>
          <v-text-field
            placeholder="주소를 입력해주세요"
            width="30vw"
            class="flex-grow-0"
          ></v-text-field>
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer width="25vw">
      <div class="d-flex mx">
        <div class="mr-2">경찰서</div>
        <div class="mr-2">소방서</div>
        <div class="mr-2">CCTV</div>
        <div class="mr-2">비상벨</div>
        <!-- <Button class="mx-2" text="경찰서" color="FFFFFF"></Button>
        <Button class="mx-2" text="소방서"></Button>
        <Button class="mx-2" text="CCTV"></Button>
        <Button class="mx-2" text="비상벨"></Button> -->
      </div>
      <v-divider></v-divider>
      <div>주변 안전시설 N곳</div>
    </v-navigation-drawer>
    <div ref="mapContainer" style="width: 100vw; height: 100vh"></div>
  </v-app>
</template>

<script setup>
  import { onMounted, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'

  const mapContainer = ref(null)
  const map = shallowRef(null)

  const pointLocation = reactive({
    x: 35.17972847528216,
    y: 129.07506760221816,
  })

  onMounted(async () => {
    initMap()
    registerClickEvent()
  })

  onBeforeUnmount(() => {
    if (map.value) {
      kakao.maps.event.removeListener(map.value, 'click', clickHandler)
    }
  })

  const clickHandler = (mouseEvent) => {
    const latlng = mouseEvent.latLng

    pointLocation.x = latlng.getLat()
    pointLocation.y = latlng.getLng()

    const message = `클릭한 위치의 위도는 ${pointLocation.x} 이고, 경도는 ${pointLocation.y} 입니다`
    console.log('message', message)
  }

  const initMap = () => {
    const options = {
      center: new kakao.maps.LatLng(pointLocation.x, pointLocation.y),
      level: 1,
    }
    map.value = new kakao.maps.Map(mapContainer.value, options)
  }

  const registerClickEvent = () => {
    if (!map.value) {
      return false
    }
    kakao.maps.event.addListener(map.value, 'click', clickHandler)
  }

  navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos)
    let latitude = pos.coords.latitude
    //pointLocation.x = latitude;
    let longitude = pos.coords.longitude
    //pointLocation.y = longitude;
    console.log('현재 위치는 : ' + latitude + ', ' + longitude)
  })
</script>

<style>
  .mainText {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
