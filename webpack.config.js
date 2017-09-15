var path = require('path');// 导入路径包 
var webpack = require('webpack'); 

var EXCLUDE_PATH = /node_modules/;

module.exports={ 
    entry:[ //入口文件 
        './src/index.js', 
    ], 
    
    output:{ 
        path:path.join(__dirname,'dist'), // 指定打包之后的文件夹 
        publicPath:'/dist/', // 指定资源文件引用的目录 
        filename:'touchtvshare.min.js' // 指定打包为一个文件 wechatShare.js 
    },

    module: {
        rules: [
          {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: EXCLUDE_PATH  //不包括此文件夹内的文件
          }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {} 
    },

    plugins:[ 
        new webpack.HotModuleReplacementPlugin(), //全局开启热代码替换 

        new webpack.optimize.UglifyJsPlugin({
            //需要在LoaderOptionsPlugin中匹配minize
            sourceMap: false,
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
              // 在UglifyJs删除没有用到的代码时不输出警告  
              warnings: false,
              // 删除所有的 `console` 语句
              // 还可以兼容ie浏览器
              drop_console: true,
              // 内嵌定义了但是只用到一次的变量
              collapse_vars: true,
              // 提取出出现多次但是没有定义成变量去引用的静态值
              reduce_vars: true
            }
        }),
    ], 
}