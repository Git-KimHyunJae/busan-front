import { defineStore } from 'pinia'

//store 정의
export const useLoadingStore = defineStore('loading', {
  //state는 store 내부에서 사용될 변수를 선언
  state: () => {
    return {
      loadingCount: 0,
    }
  },
  getters: {
    isLoading: (state) => state.loadingCount > 0,
  },
  actions: {
    startLoading() {
      this.loadingCount++
    },
    endLoading() {
      this.loadingCount = Math.max(0, this.loadingCount - 1)
    },
  },
})
