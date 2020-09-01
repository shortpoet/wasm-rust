import type { ServerConfig } from 'vite'

const config: ServerConfig = {
  port: 8080,
  optimizeDeps: {
    include: ['lodash/random', 'lodash/debounce', 'marked/parse', 'marked/MarkedOptions']
  },
  cssPreprocessOptions: {
    scss: {
      prependData: `
      @import "@/assets/scss/main.scss";
      @import "~bulma/sass/utilities/_all";
    `
    }
}
}

export default config
