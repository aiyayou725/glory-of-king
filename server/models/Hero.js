const mongoose = require('mongoose')
// 这里是创建的是数据库的模型（也就是表）
const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  title: { type: String },
  // 在新建英雄时，需要和英雄的分类关联，因此 Hero 模型需要关联 Category 模型
  // 同时一个英雄课能属于多种职业，因此需要关联一个数组，可以选多个模型
  heroCategories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  scores: {
    difficult: { type: Number},
    skills: { type: Number},
    attack: { type: Number},
    survive: { type: Number}
  },
  skills: [{
    icon: { type: String },
    name: { type: String },
    description: { type: String },
    tips: { type: String },
  }],
  // items1 表示顺风出装，items2 表示逆风出装
  items1:[{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  items2:[{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  usageTips: { type: String },
  battleTips: { type: String },
  teamTips: { type: String },
  partners: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
    description: { type: String }
  }]
})

module.exports = mongoose.model('Hero', schema)