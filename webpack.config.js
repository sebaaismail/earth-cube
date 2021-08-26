const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "test") {
  console.log("...test");
} else if (process.env.NODE_ENV === "development") {
  console.log("...development");
}

module.exports = () => {
  console.log("env", process.env.NODE_ENV);
  const isProduction = process.env.NODE_ENV === "production";
  const CSSExtract = new MiniCssExtractPlugin({
    filename: "styles.css",
  });

  return {
    optimization: isProduction
      ? {
          splitChunks: {
            cacheGroups: {
              styles: {
                name: "styles",
                type: "css/mini-extract",
                // For webpack@4
                // test: /\.css$/,
                chunks: "all",
                enforce: true,
              },
            },
          },
        }
      : {},
    entry: "/src/app.js",
    output: {
      path: path.join(__dirname, "public", "assets"),
      filename: "bundle.js",
      publicPath: "/assets/",
    },
    mode: process.env.NODE_ENV,
    module: {
      rules: [
        {
          loader: "babel-loader",
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.(s?css|sass)$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [CSSExtract],
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      static: [
        {
          publicPath: "/",
          watch: true,
        },
      ],
    },
  };
};
