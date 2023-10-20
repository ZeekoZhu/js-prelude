const webpack = require('webpack');

module.exports = (config, options) => {
  if (options.optimization) {
    // throw if APP_CLIENT_ID is not set
    if (!process.env.APP_CLIENT_ID) {
      throw new Error('APP_CLIENT_ID is not set');
    }
    // throw if APP_REDIRECT_URL is not set
    if (!process.env.APP_REDIRECT_URL) {
      throw new Error('APP_REDIRECT_URL is not set');
    }
  }
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.APP_CLIENT_ID': JSON.stringify(process.env.APP_CLIENT_ID),
      'process.env.APP_REDIRECT_URL': JSON.stringify(
        process.env.APP_REDIRECT_URL,
      ),
    }),
  );

  return config;
};
