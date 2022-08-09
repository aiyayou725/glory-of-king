const express = require("express")

const app = express()

app.set('secret', 'dhsi7js8ba9is')

app.use(require('cors')())
// express.json() 用于解析JSON格式的请求体数据
// 当请求体的数据格式为json格式时需要在服务器端路由之前配置解析数据的中间件
app.use(express.json())
app.use('/', express.static(__dirname + '/web'))
app.use('/admin', express.static(__dirname + '/admin'))

// 表示 /uploads 路径下的文件都是静态资源，可以被访问
app.use('/uploads', express.static(__dirname + '/uploads'))


// 引入数据库
require('./plugins/db')(app)
// 引入路由
require('./routes/admin')(app)


app.listen(3000, () => {
  console.log('http://localhost:3000');
});