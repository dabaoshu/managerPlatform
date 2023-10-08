export default (Env: string, target: string) => {
  const EnvProxy = {
    development: {
      '/api/v2/': {
        target,
        changeOrigin: true, // 配置了这个可以从 http 代理到 https 依赖 origin 的功能可能需要这个，比如 cookie
        // pathRewrite: { '^/api': '' },
        // ws:true, TODO：自己用插件实现代替
      },
    },
  }
  return EnvProxy[Env] || EnvProxy["development"]
};
