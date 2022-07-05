const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }])],
  devServer: {
    // host: "", //your ip address
    // port: 8123,
    // disableHostCheck: true,
    contentBase: path.join(__dirname, "dist"),
    compress: true,
  },
};