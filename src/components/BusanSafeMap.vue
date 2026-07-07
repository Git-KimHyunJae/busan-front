<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <div class="d-flex">
          <div class="mainText mr-3">부산 안전 지도</div>
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
  import { getLocation } from '@/api/location'

  const mapContainer = ref(null)
  const map = shallowRef(null)

  const pointLocation = {
    x: 35.17972847528216,
    y: 129.07506760221816,
  }

  const BUSAN_BOUNDS_SW = { lat: 34.88, lng: 128.75 } //부산 남서쪽 끝
  const BUSAN_BOUNDS_NE = { lat: 35.4, lng: 129.32 } //부산 북동쪽 끝
  let busanBounds = null

  onMounted(async () => {
    initMap()
    registerClickEvent()
    registerBoundsRestriction()
  })

  onBeforeUnmount(() => {
    if (map.value) {
      kakao.maps.event.removeListener(map.value, 'click', clickHandler)
      kakao.maps.event.removeListener(map.value, 'bounds_changed', restrictToBusan)
    }
  })

  const clickHandler = (mouseEvent) => {
    getClickLocation(mouseEvent)
  }

  const initMap = () => {
    const options = {
      center: new kakao.maps.LatLng(pointLocation.x, pointLocation.y),
      level: 1,
    }
    map.value = new kakao.maps.Map(mapContainer.value, options)
    map.value.setMaxLevel(8)

    busanBounds = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(BUSAN_BOUNDS_SW.lat, BUSAN_BOUNDS_SW.lng),
      new kakao.maps.LatLng(BUSAN_BOUNDS_NE.lat, BUSAN_BOUNDS_NE.lng),
    )
  }

  const registerClickEvent = () => {
    if (!map.value) {
      return false
    }
    kakao.maps.event.addListener(map.value, 'click', clickHandler)
  }

  // 카카오맵은 이동 범위 제한을 공식 지원하지 않아서, 영역을 벗어나면 되돌리는 방식으로 처리
  const restrictToBusan = () => {
    if (!map.value || !busanBounds) {
      return false
    }

    const center = map.value.getCenter()
    if (busanBounds.contain(center)) {
      return false
    }

    const clampedLat = Math.min(Math.max(center.getLat(), BUSAN_BOUNDS_SW.lat), BUSAN_BOUNDS_NE.lat)
    const clampedLng = Math.min(Math.max(center.getLng(), BUSAN_BOUNDS_SW.lng), BUSAN_BOUNDS_NE.lng)
    map.value.panTo(new kakao.maps.LatLng(clampedLat, clampedLng))
  }

  const registerBoundsRestriction = () => {
    if (!map.value) {
      return false
    }
    kakao.maps.event.addListener(map.value, 'bounds_changed', restrictToBusan)
  }

  navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos)
    let latitude = pos.coords.latitude
    //pointLocation.x = latitude;
    let longitude = pos.coords.longitude
    //pointLocation.y = longitude;
    console.log('현재 위치는 : ' + latitude + ', ' + longitude)
  })

  //클릭한 좌표 주위에 있는 정보들을 조회한다.
  const getClickLocation = async (mouseEvent) => {
    const latlng = mouseEvent.latLng

    pointLocation.latitude = latlng.getLat() //위도(가로)
    pointLocation.longitude = latlng.getLng() //경도(세로)

    const message = `클릭한 위치의 위도는 ${pointLocation.x} 이고, 경도는 ${pointLocation.y} 입니다`
    console.log('message', message)
    try {
      const res = await getLocation(pointLocation)
      console.log('res', res)
    } catch (err) {
      console.log('err', err)
    }
  }
</script>

<style>
  .mainText {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
