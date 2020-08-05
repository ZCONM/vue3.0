import Vue from 'vue'
import Router from 'vue-router'

import index from '../views/index/index.vue'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: index,
            meta: {
                title: '首页'
            }
        }
    ]
})

export default router