const utils = require("./utils");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // 入口
    entry: {
        app: "./src/index" 
    },


    // 模块
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
                exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                loader: 'babel-loader',//loader的名称（必须）
            },
            {
                test: /\.css$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          // you can specify a publicPath here
                          // by default it uses publicPath in webpackOptions.output
                          publicPath: 'css/',
                          hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer') ({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    // {
                    //     loader: 'style-loader', // 创建 <style></style>
                    // },
                    { 
                        loader: 'css-loader',  // 转换css
                    }
                ]
            },
            {
                test: /\.scss$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          // you can specify a publicPath here
                          // by default it uses publicPath in webpackOptions.output
                          publicPath: 'css/',
                          hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    // {
                    //     loader: 'style-loader',
                    // },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer') ({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            // filename: '[name].[hash].css',
            chunkFilename: '[id].[chunkhash].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CopyWebpackPlugin([
            {
                from: utils.resolve('../static'), // 从哪个目录copy
                to: "static", //copy到哪个目录
                ignore:['.*']
            }
        ])
    ],

    // Resolve配置webpack如何寻找模块对应的文件
    resolve: {
        extensions: ['.js', 'jsx', '.json'], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
        alias: {
            '@': utils.join(__dirname, '..', "src") // 在项目中使用@符号代替src路径，导入文件路径更方便
        }
    }
}