//引入express包
var express = require("express");
//实例化一个express对象，这个对象是路由级对象
var router = express.Router();
//引入body-parser解析包 中间件
var bodyParser = require('body-parser');
//引入mysql包
var mysql = require('mysql');
//告诉路由中间件，使用bodyparser解析json
router.use(bodyParser.json());
// 所有请求统一处理
router.all(function (req, res, next) {
    console.info('------当前时间:', new Date());
    console.info("------请求方法：" + req.method);
    console.info("------请求地址：" + req.path);
});

/**
 * 功能：创建数据库
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * CreateBDsql mysql语句
 *  */
router.post("/CreateDB", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        password: req.body.password,
        port: req.body.port
    });
    //连接数据库
    connection.connect();
    connection.query(req.body.query, function (results, fields) {
        //当回调函数，返回results为null，说明sql语句执行成功
        if (results === null) {
            res.send({ "result": "success", "status": 200, "CreateBDsql": req.body.CreateBDsql});
            console.log('创建数据库成功: ', req.body.CreateBDsql);
        } else {
            res.send(results);
        }
    });
});

/**
 * 功能：创建数据库的表
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * query mysql语句
 *  */
router.post("/CreateTable", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        port: req.body.port,
        password: req.body.password,
        database: req.body.database
    });
    //发起数据库连接
    connection.connect();
     //执行sql语句
    connection.query(req.body.query, function (results, fields) {
      //当回调函数，返回results为null，说明sql语句执行成功
        if (results === null) {
            res.send({ "result": "success", "status": 200, "database": req.body.database, "collection_name": req.body.query });
            console.log('创建数据库成功: ', req.body.query);
        } else {
            res.send(results);
        }
    });
});



/**
 * 功能：查询表中所有内容
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * findSql mysql语句
 *  */
router.post("/find", function (req, res, next) {
    //创建一个连接数据库对象
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        password: req.body.password,
        port: req.body.port,
        database: req.body.database
    });
    //发起数据库连接
    connection.connect();
    var sql = req.body.findSql;
                try {
                        //执行sql语句
                        connection.query(sql, function (err, result) {
                            //如果query方法回调函数出现错误err，则日志输出、响应body错误内容
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                res.send('[SELECT ERROR] - '+ err.message);
                            }else{
                                console.log('--------------------------SELECT----------------------------');
                                console.log(result);
                                console.log('------------------------------------------------------------\n\n');
                                res.send(result);
                            }     
                        });
                    } catch (error) {
                        res.send(error);
                    }
    connection.end();

});


/**
 * 功能：插入数据到数据库表中
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * addSql mysql语句
 *  */
router.put("/insert_data", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        port: req.body.port,
        password: req.body.password,
        database: req.body.database
    });
    //发起数据库连接
    connection.connect();
    var addSql = req.body.addSql;
    //执行sql语句
    connection.query(addSql, function (err, result) {
        //当发生错误时，响应body显示错误信息
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            res.send('[INSERT ERROR] - '+err.message);
        }else{
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);        
            console.log('INSERT ID:', result);
            res.send(result);
            console.log('-----------------------------------------------------------------\n\n');
        }
        
    });
    connection.end();
});

/**
 * 功能：删除数据
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * delSql mysql语句
 *  */
router.delete("/delete", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        port: req.body.port,
        password: req.body.password,
        database: req.body.database
    });
    //发起数据库连接
    connection.connect();
    var delSql = req.body.delSql;
    ///执行sql语句
    connection.query(delSql, function (err, result) {
        //当发生错误时，响应body显示错误信息
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            res.send('[INSERT ERROR] - '+ err.message);
        }else{
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);        
            console.log('INSERT ID:', result);
            res.send(result);
            console.log('-----------------------------------------------------------------\n\n');
        } 
    });
    connection.end();

});

/**
 * 功能：删除表、删除数据库
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * DropSql mysql语句
 *  */
router.delete("/drop", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        port: req.body.port,
        password: req.body.password,
        database: req.body.database
    });
    //发起数据库连接
    connection.connect();
    var DropSql = req.body.DropSql;
    ///执行sql语句
    connection.query(DropSql, function (err, result) {
        //当发生错误时，响应body显示错误信息
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            res.send('[INSERT ERROR] - '+ err.message);
        }else{
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);        
            console.log('INSERT ID:', result);
            res.send(result);
            console.log('-----------------------------------------------------------------\n\n');
        } 
    });
    connection.end();
});


/**
 * 功能：查询所有数据库
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * Sql mysql语句
 *  */
router.post("/show_databases", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        port: req.body.port,
        password: req.body.password
    });
    //发起数据库连接
    connection.connect();
    var Sql =req.body.findSql;
    //执行sql
    connection.query(Sql, function (err, result) {
        //当发生错误时，响应body显示错误信息
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            res.send('[INSERT ERROR] - '+err.message);
        }else{
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);        
            console.log('INSERT ID:', result);
            res.send(result);
            console.log('-----------------------------------------------------------------\n\n');
        }   
    });
    connection.end();
});

/**
 * 功能：查询数据库所有的表
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * Sql mysql语句
 *  */
router.post("/show_tables", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        port: req.body.port,
        user: req.body.user,
        password: req.body.password,
        database:req.body.database
    });
    //发起数据库连接
    connection.connect();
    var Sql =req.body.findSql;
    //执行sql语句
    connection.query(Sql, function (err, result) {
        //当发生错误时，响应body显示错误信息
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            res.send('[INSERT ERROR] - '+err.message);
        }else{
            //否则
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);        
            console.log('INSERT ID:', result);
            res.send(result);
            console.log('-----------------------------------------------------------------\n\n');
        }
    });
    connection.end();
});

/**
 * 功能：更新表中数据
 * 作者：李银池
 * 参数：
 * host 数据库地址
 * user 数据库账号
 * password 数据库密码
 * port 数据库端口
 * database 数据库名称
 * UpdateSql mysql语句
 *  */
router.put("/update", function (req, res, next) {
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        port: req.body.port,
        password: req.body.password,
        database: req.body.database
    });
    //发起数据库连接
    connection.connect();
    var UpdateSql = req.body.UpdateSql;
    ///执行sql语句
    connection.query(UpdateSql, function (err, result) {
        //当发生错误时，响应body显示错误信息
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            res.send('[INSERT ERROR] - '+ err.message);
        }else{
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);        
            console.log('INSERT ID:', result);
            res.send(result);
            console.log('-----------------------------------------------------------------\n\n');
        } 
    });
    connection.end();
});



module.exports = router;