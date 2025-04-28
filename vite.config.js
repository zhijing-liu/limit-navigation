import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'

export default defineConfig({
    plugins: [
        tailwindcss(),
        vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
                }
            ]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })],
    server: {
        proxy: {
            '/req': `http://127.0.0.1:8888`
        }
    },
    build: {
        target:'esnext',
        minify:'esbuild'
    }
})
