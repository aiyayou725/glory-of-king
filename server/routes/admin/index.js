// 这里是后端的路由，用于服务器和数据库之间的数据传输
// const req = require('express/lib/request')
module.exports = app => {
  const express = require('express')
  // 动态参数resource在最下面才引入，所以这里需要加一个参数，使其在前面接口处可以使用
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../../models/AdminUser')
  // 这里创建一个路由器对象,对数据库进行增删改查操作
  // mergeParams: true 导入父级参数到子级配置（让子路由继承父路由的参数）
  const router = express.Router({
    mergeParams: true
  })
  // const Category = require('../../models/Category')
  // 将创建的数据发回客户端(创建资源)
  router.post('/', async (req, res) => {
    // const Model = require(`../../models/${}`)
    const model = await req.Model.create(req.body)
    res.send(model)
  }) 
  // 更新资源
  // 前端会根据 id 修改 item, 这里是把修改后的 item 更新到数据库中
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  }) 
  // 删除资源
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  }) 

// 这里的动态参数有时候可能不需要populate来通过parent筛选，因此需要换一种写法
// 获取资源列表（当前端发起个 get 请求时，这里要向数据库发起请求 获取模型数据）
  router.get('/', async (req, res) => {
    // 查出关联字段parent
    // const items = await Category.find().populate('parent').limit(10)
    let items
    if(req.Model.modelName === 'Category') {
      // queryOptions.populate = 'parent'
      items = await req.Model.find().populate('parent').limit(100)
    } else {
      items = await req.Model.find()
      // items = await req.Model.find().limit(10)
    }
    res.send(items)
  }) 
  // 资源详情
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  }) 
  // 封装判断 token(登陆校验) 的中间件
  const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')
  //把子路由挂载到app上,用resource来匹配URL地址,添加一个中间件来处理动态参数，同时把处理好的模型挂载到请求对象上
  app.use('/admin/api/rest/:resourse', authMiddleware(), resourceMiddleware(), router)


  // 因为要把上传的文件再显示到前端页面上，但express本身无法获取到上传的数据，因此需要安装中间件处理
  // multer 中间件专门用来处理上传的数据的,将上传文件的数据赋值到req上
  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    // req 上是没有 file 这个属性点，只是用了 multer 这个中间件加上去的
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  app.post('/admin/api/login', async (req, res) => {
    // 前端将用户名和密码传过来，在此处校验是否正确
    // 验证成功的话返回给前端一个token（一段密钥），后续通过密钥来证明是哪个用户
    const { username, password } = req.body
    // 1.根据用户名找用户（不能带密码去找，因为密码已经被散列化了）
    // findOne 的第一个参数是查询条件，以键值对的形式来写，键是模型中定义的名称，值是从前端传过来的数据
    const user = await AdminUser.findOne({
      username: username
      // 后面加上select('+password')的作用是在定义模型时，密码默认不可取出，但此处需要校验，因此要把他取出来
    }).select('+password')
    // 安装http-assert包，用来判断用户（因为已经把用户挂载到请求中了）
    assert(user, 422, '用户不存在')
    // if(!user) {
    //   // 返回一个自定的状态码422，并返回一个用户不存在的信息
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   })
    // }
    // 2.校验密码
    const isVaild = require('bcrypt').compareSync(password, user.password)
    assert(isVaild, 422, '密码错误')
    // if(!isVaild) {
    //   // 用422统一表示客户端提交数据错误
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }
    // 3.返回token
    // 3.1 jwt.sign 用于生成一个token
    /**
     * 第一个参数是用于加密的对象
     * secret 是我们在全局设置的一个密钥（随便设置的）
     * 在 express 的 app 实例上设置的全局变量( 通过app.set（secret,'xxxxx'）)
    **/
    const token = jwt.sign({ id: user._id}, app.get('secret'))
    res.send({ token })
  })

  // 错误处理,捕获异常，用500响应码响应，并弹出错误信息
  // 这里捕获的异常是前面 assert 抛出的错误
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}