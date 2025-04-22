const { name } = require("./package");
const webpack = require("webpack");
const { loaderByName, addAfterLoaders } = require("@craco/craco");
 
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Set the output library name for microfrontend
      webpackConfig.output.library = `supplementarydashboard`;
      webpackConfig.output.libraryTarget = "umd";
      webpackConfig.output.globalObject = "window";
 
      // Modify publicPath for standalone usage
      webpackConfig.output.publicPath = '/'; // Set the base path for static assets
 
      // SVG loader configuration
      const svgLoader = {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          mimetype: "image/svg+xml",
        },
      };
 
      // Add the SVG loader after the url-loader
      addAfterLoaders(webpackConfig, loaderByName("url-loader"), svgLoader);
 
      return webpackConfig;
    },
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.headers = {
      "Access-Control-Allow-Origin": "*",
    };
    devServerConfig.historyApiFallback = true;
    devServerConfig.hot = false;
    devServerConfig.liveReload = false;
 
    return devServerConfig;
  },
};