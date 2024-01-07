import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import nprogress from 'nprogress'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: {},
    children: []
  }
]


const router = createRouter({
  routes,
  history: createWebHashHistory()
})

router.beforeEach((_to, _from, next) => {
  nprogress.start()
  next()
})

router.afterEach((_to) => {
  nprogress.done()
})

export default router