


const path = require( 'path' );
// const TerserPlugin = require( 'terser-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )

/*

module
asset/resource
asset/inline
asset/
asset/source

css-loader => MiniCssExtractPlugin.loader

*/

module.exports = {

    entry: {
        'utils':'./src/utils.js',
        'index':'./src/index.js',
        'three-data':'./src/three-data.js',
        'three-objs':'./src/three-objs.js',
        'three-controls':'./src/three-controls-custom.js',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve( __dirname, './dist' ),
        publicPath: '',
        //assetModuleFilename: 'images/[hash][ext][query]'
    },
    mode: 'development',
    devServer: {
        port: 9000,
        open: true,
        static: {
            directory: path.resolve( __dirname, './dist' ),
        },
        devMiddleware: {
            index: 'index.html',
            writeToDisk: true,
        }
    },
    module: {
        rules:[
            {
                test: /\.(png|jpg)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'images/[hash][ext]'
                }
                
                // parser: {
                //     dataUrlCondition: {
                //         maxSize: 3 * 1024,
                //     }
                // }
            },
            {
                test: /\.json$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'data/[name][hash][ext]'
                }, 
                parser: {
                    dataUrlCondition: {
                        maxSize: 1,
                    }
                }
            },
            {
                test:/\.txt/,
                type: 'asset/source'
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/i,
                type: 'asset/source',
                // generator:
                // {
                //     filename: 'assets/shaders/[hash][ext]'
                // }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/env' ],
                        plugins: [ '@babel/plugin-proposal-class-properties' ]
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [
                    'handlebars-loader'
                ]
            }
        ]
    },
    plugins: [
        // new TerserPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'KusoCloud-Test',
            // template: 'src/page-template.hbs',
            description: 'KusoCloud-Test',
            minify: false,
        }),
    ]


};