const mongoose = require('mongoose')
// 这里是创建的是数据库的模型（也就是表）
const schema = new mongoose.Schema({
  username: { type: String },
  password: { 
    type: String, 
    select: false,
    set(val){
      return require('bcrypt').hashSync(val, 10)
    } 
  }, 
})
module.exports = mongoose.model('AdminUser', schema)