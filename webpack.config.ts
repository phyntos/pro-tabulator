import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const config: webpack.Configuration = {
    target: 'web',
    entry: './src/index.ts',
    mode: 'production',
    plugins: [new MiniCssExtractPlugin({ filename: 'index.css' })],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/, path.resolve(__dirname, './src/dev/')],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: {
            name: 'ProTabulator',
            type: 'umd',
        },
        clean: true,
        umdNamedDefine: true,
    },
    externals: {
        react: 'react',
    },
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    },
};

export default config;
