import sveltePreprocess from 'svelte-preprocess'

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    scss: {
        prependData: `@use 'src/style/variables.scss';`
      }
  }),
  compilerOptions: {
    customElement: true
  }
}
