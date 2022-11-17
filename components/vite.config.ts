import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: './src/main.ts',
      name: 'MyLibrary',
    }
  },
  plugins: [
    svelte({
      preprocess: preprocess({
        scss: {
            prependData: `@use 'src/style/variables.scss';`
          }
      }),
      compilerOptions: {
        customElement: true
      }
    })
  ],
  resolve: {
    dedupe: ['svelte']
  }
})
