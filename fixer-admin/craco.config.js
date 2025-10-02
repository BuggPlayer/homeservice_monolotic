module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Increase memory limit for TypeScript checking
      webpackConfig.plugins = webpackConfig.plugins || [];
      
      // Find ForkTsCheckerWebpackPlugin and increase memory limit
      const forkTsCheckerPlugin = webpackConfig.plugins.find(
        plugin => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
      );
      
      if (forkTsCheckerPlugin) {
        forkTsCheckerPlugin.options.memoryLimit = 4096;
      }
      
      return webpackConfig;
    },
  },
  devServer: {
    // Increase memory limit for dev server
    maxMemory: 4096,
  },
};
