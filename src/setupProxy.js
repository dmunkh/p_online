const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // Specify the API routes you want to proxy to the backend
    createProxyMiddleware({
      target: "https://dmunkh.store", // Specify the backend server address
      changeOrigin: true,
    })
  );
};
