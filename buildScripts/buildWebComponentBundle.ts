import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'

export default defineConfig({
    build:{
    lib:{
        entry: './src/main.ts',
        name: 'MyLibrary',
    }
    },
    plugins: [
    svelte({
        compilerOptions: {
            customElement: true
        }
    })
    ],
    resolve: {
    dedupe: ['svelte']
    }
})
