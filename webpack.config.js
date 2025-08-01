const os = require("os");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.[name].[contenthash:8].js",
    publicPath: "/",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  devServer: {
    port: "8080",
    hot: true,
    open: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "./index.html"),
      minify: true,
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[id].[contenthash:8].css",
      ignoreOrder: true,
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ["vue-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial",
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: os.cpus().length - 1, // 使用多进程并发运行以提高构建速度，默认是 os.cpus().length - 1
        extractComments: false, // 禁止单独提取注释文件
        terserOptions: {
          format: {
            comments: true, // 移除所有注释
          },
          compress: {
            pure_funcs: ["console.log"], // 移除console.log functions
            drop_console: true, // 移除所有console functions
          },
        },
      }),
    ],
  },
};
