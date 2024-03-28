import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('../views/HomePage.vue')
        },
        {
            path: '/prompt',
            component: () => import('../views/PromptPage.vue')
        },
        {
            path: '/models',
            component: () => import('../views/ModelsPage.vue')
        },
        {
            path: '/config',
            component: () => import('../views/ConfigPage.vue')
        }
    ]
})
router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

router.afterEach(() => {
    NProgress.done()
})
export default router
