const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@base": path.resolve(__dirname, "src/base"),
      "@config": path.resolve(__dirname, "src/config"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@router": path.resolve(__dirname, "src/router"),
      "@views": path.resolve(__dirname, "src/views"),
    },
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            type: "javascript/auto",
          },
          {
            test: /\.js$/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
    },
  },
  style: {
    modules: {
      localIdentName: "Brain_[folder]-[name]_[local]_[hash:base64:8]",
    },
    css: {
      loaderOptions: {
        modules: {
          exportLocalsConvention: "camelCase",
        },
      },
    },
  },
  devServer: {
    port: 12640,
  },
};
