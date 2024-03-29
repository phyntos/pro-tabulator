import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

const config: webpack.Configuration = {
    target: 'web',
    entry: './src/pro-tabulator.ts',
    mode: 'production',
    plugins: [new MiniCssExtractPlugin({ filename: 'pro-tabulator.css' })],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/, path.resolve(__dirname, './src/dev/')],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pro-tabulator.js',
        library: {
            name: 'ProTabulator',
            type: 'umd',
        },
        clean: true,
        umdNamedDefine: true,
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom',
        antd: 'antd',
        '@ant-design/icons': '@ant-design/icons',
        '@ant-design/pro-components': '@ant-design/pro-components',
    },
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    },
};

export default config;
