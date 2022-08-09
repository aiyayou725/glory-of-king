const mongoose = require('mongoose')
// 这里是创建的是数据库的模型（也就是表）
const schema = new mongoose.Schema({
  name: { type: String },
  // 在新建英雄时，需要和英雄的分类关联，因此 Hero 模型需要关联 Category 模型
  // 同时一个英雄课能属于多种职业，因此需要关联一个数组，可以选多个模型
  items: [{
    image: { type: String },
    url: { type: String },
  }]
})
module.exports = mongoose.model('Ad', schema)
