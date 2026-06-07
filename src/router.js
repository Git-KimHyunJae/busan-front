import { createMemoryHistory, createRouter } from "vue-router";
import BusanSafeMap from "@/components/BusanSafeMap.vue";

const routes = [{ path: "/", component: BusanSafeMap }];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
