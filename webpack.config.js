import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin"; // NEW

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (_env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/main.tsx",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "assets/[name].[contenthash:8].js" : "assets/[name].js",
      publicPath: "",
      clean: true,
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"], // added .tsx
    },

    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "esbuild-loader",
          options: { target: "es2022", jsx: "automatic" },
        },
        {
          test: /\.css$/,
          use: [isProd ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({ template: "./src/index.html" }),
      ...(isProd // NEW
        ? [new MiniCssExtractPlugin({ filename: "assets/[name].[contenthash:8].css" })]
        : []),
    ],

    devServer: {
      port: 5173,
      hot: true,
      open: false,
    },
  };
};
