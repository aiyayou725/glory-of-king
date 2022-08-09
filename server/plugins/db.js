// 这里把app传进来是为了方便以后与服务器进行操作
module.exports = app => {
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://127.0.0.1:27017/vue-node-moba', {
    useNewUrlParser: true
  })
  // 当A模型引用B模型时，但B模型没有使用过，可能就会报错，所以要在数据库中把所有的模型引用一遍
  // require-all 的作用就是把某一个文件夹下的模型引用进来
  require('require-all')(__dirname + '/../models') 
}
