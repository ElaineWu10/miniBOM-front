const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: "localhost",
    https: false,
    port: 81,
    //没有生效。。
    // proxy:{
    //   '/api':{
    //     target: 'http://localhost:8080/feign',
    //     changeOrigin:true, //设置跨域
    //     ws:true,
    //     pathRewrite:{
    //       '^/api':''
    //     }
    //   }
    // }
  }
  
})
