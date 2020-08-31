module.exports = {
  chainWebpack: config => {
    config.module
      .rule('wasm')
      .test(/\.wasm$/)
      .use('wasm-loader')
        .loader('wasm-loader')
        .end()
  },
  css: {
    // https://dev.to/justaashir/bulma-vue-easy-setup-2b3
    // https://headsigned.com/posts/importing-and-using-css-frameworks-with-vue/
    extract: false,
    loaderOptions: {
      scss: {
        prependData: `
        @import "@/assets/scss/main.scss";
        @import "~bulma/sass/utilities/_all";
      `
      }
    }
  }
}