const mongoose = require('mongoose')
// 这里是创建的是数据库的模型（也就是表）
const schema = new mongoose.Schema({
  name: { type: String },
  icon: { type: String}
})

module.exports = mongoose.model('Item', schema)