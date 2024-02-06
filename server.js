var express = require('express');
var bodyParser = require('body-parser');


// 实例化一个express的对象app
var app = express();
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: true })

// 引入模块化的中间件
var mysql_demo = require(__dirname + "/mysql_demo.js");
// 告诉应用程序中间件，使用外部引入的模块中间件（内置中间件、第三方中间件、自己封装js）
app.use("/mysql_demo", mysql_demo);

// 为了解析 application/json
app.use(bodyParser.json());

// 跨域设置，对所有http请求均有效
// 自定义跨域中间件
app.all("*", function (req, res, next) {
  //响应头
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header("Content-Length", "2000");
  res.header("X-Powered-By", ' 3.2.1');
  //  res.header("Content-Type", "application/x-www-form-urlencoded");
  res.header("Content-Type", "application/json;charset=utf-8");
  //控制权交给下一个处理程序
  if (req.method == 'OPTIONS') {
    //让options请求快速返回
    res.sendStatus(200);
  } else {
    next();
  }
});



//监听端口
var server = app.listen(8005, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
