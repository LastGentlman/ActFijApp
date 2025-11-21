const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/firefly',
    createProxyMiddleware({
      target: 'http://localhost:3001', // El puerto donde corre nuestro servidor proxy
      changeOrigin: true,
    })
  );
};
