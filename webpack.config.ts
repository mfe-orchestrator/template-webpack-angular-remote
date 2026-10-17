import { AngularWebpackPlugin } from '@ngtools/webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack, { type Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

const { ModuleFederationPlugin } = webpack.container;

interface WebpackConfiguration extends Configuration {
  devServer?: DevServerConfiguration;
}

const config: WebpackConfiguration = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    port: 3001,
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      // The Angular packages ship partially compiled: the linker finishes them at
      // build time, the way the Angular CLI does. Without it the app does not
      // boot ("needs to be compiled using the JIT compiler").
      {
        test: /\.[cm]?js$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@angular/compiler-cli/linker/babel'],
            compact: false,
            cacheDirectory: true,
          },
        },
      },
      // AngularWebpackPlugin installs the AOT compiler behind this loader.
      {
        test: /\.[cm]?[jt]sx?$/,
        loader: '@ngtools/webpack',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new AngularWebpackPlugin({
      tsconfig: 'tsconfig.json',
      jitMode: false,
    }),
    new ModuleFederationPlugin({
      // The container name hosts load this remote by. When the console creates a
      // microfrontend from this template it rewrites the string on the marked line
      // to the federation name of the microfrontend's slug ("checkout-new" ->
      // "checkoutnew"): keep the marker comment on this line.
      name: 'exampleremote', // mfe-orchestrator:federation-name
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/app/button.component.ts',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: false },
        '@angular/common': { singleton: true, strictVersion: false },
        '@angular/platform-browser': { singleton: true, strictVersion: false },
        rxjs: { singleton: true, strictVersion: false },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

export default config;
