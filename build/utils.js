const path = require("path");

exports.resolve = function (dir) {
    return path.resolve(__dirname, dir);
}

// path.join() 方法使用平台特定的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。
exports.join = function (dir) {
    return path.join(__dirname, '..', "src")
}