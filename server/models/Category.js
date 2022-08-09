// const mongoose = require('mongoose')
// // 这里是创建的是数据库的模型（也就是表）
// const schema = new mongoose.Schema({
//   name: { type: String },
//   // 找category模型的父级分类
//   parent: {type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}
// })

// module.exports = mongoose.model('Category', schema)

const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String },
  // ref 是把 parent 关联到 Category 自己这个 Schema
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
})
// 设置虚拟字段，这个字段不会存入数据库，但可以根据这个字段查找数据库中的数据
schema.virtual('children', {
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
  ref: 'Category'
})
schema.virtual('newsList', {
  localField: '_id',
  foreignField: 'categories',
  justOne: false,
  ref: 'Article'
})
module.exports = mongoose.model('Category', schema)