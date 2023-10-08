module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    page: true,
    NODE_ENV: true,
    isPro: true,
    BASE: true,
    ROUTER_BASE: true,
    PUBLIC_PATH: true,
    STOMP_URL: true,
  },
};
