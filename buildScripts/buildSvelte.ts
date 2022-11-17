import { build } from 'vite'
import path from "path"
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'
import { cfg } from '../cli/cliRoot'

export default function buildOutput(data: object, config: cfg) {
    (async ()=> {
        await build({
            root: path.resolve(__dirname, "./project"),
            base: "/foo/",
            configFile: false,
            envFile: false,
            build: {
                rollupOptions: {

                }
            }
        })
    })()
}
{
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
