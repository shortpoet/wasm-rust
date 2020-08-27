module.exports = {
  css: {
    // https://dev.to/justaashir/bulma-vue-easy-setup-2b3
    // https://headsigned.com/posts/importing-and-using-css-frameworks-with-vue/
    extract: false,
    loaderOptions: {
      scss: {
        prependData: `
        @import "@/assets/scss/_variables.scss";
        @import "~bulma/sass/utilities/_all";
      `
      }
    }
  }
}