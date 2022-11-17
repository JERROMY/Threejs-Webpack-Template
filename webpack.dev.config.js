
const path = require( 'path' );
const fs = require('fs');
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
        'three-ar':'./src/libs/mindar-image-three.prod.js',
        'index':'./src/index.js',
        'three-data':'./src/three-data.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve( __dirname, './dist' ),
        publicPath: '',
        //assetModuleFilename: 'images/[hash][ext][query]'
    },
    mode: 'development',
    // devServer: {
    //     port: 9000,
    //     open: true,
    //     static: {
    //         directory: path.resolve( __dirname, './dist' ),
    //     },
    //     devMiddleware: {
    //         index: 'index.html',
    //         writeToDisk: true,
    //     }
    // },
    devServer: {
        // host: "192.168.1.123",
        port: 443,
        open: true,
        static: {
            directory: path.resolve( __dirname, './dist' ),
        },
        devMiddleware: {
            index: 'index.html',
            writeToDisk: true,
        },
        https: true,
        https: {
            key: fs.readFileSync(`localhost+1-key.pem`),
            cert: fs.readFileSync(`localhost+1.pem`),
            //ca: fs.readFileSync('rootCA.pem'),
            passphrase: '0937047859',
        },
    },
    module: {
        rules:[
            {
                test: /\.(png|jpg)$/,
                type: 'asset/resource',
                generator:
                {
                    //filename: 'images/[hash][ext]',
                    filename: 'images/[name][ext]'
                }
                
                // parser: {
                //     dataUrlCondition: {
                //         maxSize: 3 * 1024,
                //     }
                // }
            },
            {
                test: /\.mind$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'images/[name][ext]'
                }, 
                parser: {
                    dataUrlCondition: {
                        maxSize: 1,
                    }
                }
            },
            {
                test: /\.worker\.js$/,
                use: {
                  loader: 'worker-loader',
                  options: {
                    esModule: false,
                    inline: "fallback",
                    filename: '[name].dev.js'
                  },
                },
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
            title: 'Three.js 3D Web Template',
            // template: 'src/page-template.hbs',
            description: 'Test 3D Template',
            minify: false,
        }),
    ]


};