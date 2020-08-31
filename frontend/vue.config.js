const path = require('path')

module.exports = {
  outputDir:  process.env.DOCKER == '1'
    ? path.resolve(__dirname, './dist')
    : path.resolve(__dirname, '../docs/'),
  //https://stackoverflow.com/questions/48851677/how-to-direct-vue-cli-to-put-built-project-files-in-different-directories
  // assetsDir: 
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