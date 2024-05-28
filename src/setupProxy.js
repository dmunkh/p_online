const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // Specify the API routes you want to proxy to the backend
    createProxyMiddleware({
      target: "http://localhost:5000", // Specify the backend server address
      changeOrigin: true,
    })
  );
};
