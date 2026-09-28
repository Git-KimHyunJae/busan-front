<template>
  <div ref="mapContainer" style="width: 100vw; height: 100vh"></div>
</template>

<script setup>
  import { onMounted, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
  import { getLocation } from '@/api/location'
  const mapContainer = ref(null)
  const map = shallowRef(null)
  let markers = []

  //최초 실행시 좌표(부산시청)
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

  //클릭한곳 주위 좌표조회
  const clickHandler = (mouseEvent) => {
    getClickLocation(mouseEvent)
  }

  //기존에 표시된 마커들을 지도에서 제거
  const clearMarkers = () => {
    markers.forEach((marker) => {
      marker.setMap(null)
    })
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
    let latitude = pos.coords.latitude
    let longitude = pos.coords.longitude
    //console.log('현재 위치는 : ' + latitude + ', ' + longitude)
  })

  //클릭한 좌표 주위에 있는 정보들을 조회한다.
  const getClickLocation = async (mouseEvent) => {
    const latlng = mouseEvent.latLng

    pointLocation.latitude = latlng.getLat() //위도(가로)
    pointLocation.longitude = latlng.getLng() //경도(세로)
    let markerPosition = null
    let marker = null
    try {
      clearMarkers()
      const res = await getLocation(pointLocation)

      //조회한 데이터가 존재하면
      if (res.data.length > 0 && res.data) {
        //위치마다 마커객체 생성해서 맵에 붙여줌
        res.data.forEach((location) => {
          markerPosition = new kakao.maps.LatLng(location.latitude, location.longitude)
          marker = new kakao.maps.Marker({
            map: map.value,
            position: markerPosition,
          })
          marker.setMap(map.value)
          markers.push(marker)
        })
      } else {
        marker.setMap(null)
      }
    } catch (err) {
      clearMarkers()
    }
  }
</script>
