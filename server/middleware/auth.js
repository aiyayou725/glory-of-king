// options 表示可以选用不同的模型，扩展这个中间件的可用性
module.exports = optipons => {
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../models/AdminUser')
  return async (req, res, next) => {
    // 校验用户是否登录
    // 获取请求头全部小写
    // const token = req.headers.authorization
    // 获取的token前面有bearer,所以要去掉前面的bearer
    
    const token = String(req.headers.authorization || '').split(' ').pop()
    // 判断是否有token 没有token 就是没有用户信息，让其先登录
    assert(token, 401, '请先登录')
    const { id } = jwt.verify(token, req.app.get('secret'))
    // 无效的token
    assert(id, 401, '请先登录')
    // 所有获取列表请求都会在请求上挂载用户信息，来检验如果用户不存在就不能获取
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '请先登录')
    await next()
  }
}