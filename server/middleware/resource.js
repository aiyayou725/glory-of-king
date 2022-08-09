module.exports = options => {
  // options 的作用是加一个参数，在后期可以改成可配置的
  return async (req, res, next) => {
    // 把前端请求的 URL 的参数取出来 因为 URL 参数都是 小写负数形式，所以引入 inflection 包 用Classify这个包把
    // 小写复数形式转换为 首字母大写单数形式
    const modelName = require('inflection').classify(req.params.resourse)
    req.Model = require(`../models/${modelName}`)
    next()
  }
}