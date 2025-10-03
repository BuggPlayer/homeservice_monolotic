module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Completely remove ForkTsCheckerWebpackPlugin in development to prevent memory issues
      if (env === 'development') {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
        );
      }
      
      // Additional webpack optimizations for memory
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
      
      // Disable source maps in development to save memory
      if (env === 'development') {
        webpackConfig.devtool = false;
      }
      
      return webpackConfig;
    },
  },
  devServer: {
    // Increase memory limit for dev server
    maxMemory: 8192,
    // Additional dev server optimizations
    compress: true,
    hot: true,
    liveReload: false,
  },
  // Add babel configuration for better performance
  babel: {
    plugins: [
      // Add any babel plugins that might help with performance
    ],
  },
};
