export default (Env: string, target: string) => {
  const EnvProxy = {
    development: {
      '/api/': {
        target,
        changeOrigin: true, // 配置了这个可以从 http 代理到 https 依赖 origin 的功能可能需要这个，比如 cookie
        // pathRewrite: { '^/api': '' }, 当实际需要请求的路径里面没有”/api“时. 就需要 pathRewrite,用’’^/api’’:’’, 把’/api’去掉, 这样既能有正确标识, 又能在请求到正确的路径。
        // ws:true, TODO：自己用插件实现代替
      },
    },
  }
  return EnvProxy[Env] || EnvProxy["development"]
};
