import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0'
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:11434',
        //         changeOrigin: true,
        //         rewrite: path => path.replace(/^\/api/, '') // 重写路径，移除 `/api`
        //     }
        // }
    },

    plugins: [
        vue(),
        vueJsx(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false // css in js
                })
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
