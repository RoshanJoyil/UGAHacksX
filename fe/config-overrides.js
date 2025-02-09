const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
    assert: require.resolve("assert"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  // Add the rule for fullySpecified
  config.module.rules = [
    ...(config.module.rules || []),
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false, // Disable the fully specified rule for ESM
      },
    },
  ];

  return config;
};
