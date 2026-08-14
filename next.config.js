const nextConfig = {
  // Set up proxy to backend server
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend port
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
  // Add environment variables for port configuration
  env: {
    PORT: '3001'
  }
};

module.exports = nextConfig;
