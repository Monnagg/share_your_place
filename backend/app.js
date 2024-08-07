const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const fs = require('fs')
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");
const path = require('path')


const app = express();
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

app.use("/api/places",placesRoutes);
app.use("/api/users",usersRoutes);

app.use((req,res,next)=>{
    const error = new HttpError('Could not find resources', 404);
    throw error;
})

//在 Express 应用中，错误处理中间件是用来捕获并处理所有从上一个中间件或路由处理函数传递过来的错误的。
//这段代码演示了如何处理这样的错误并返回适当的响应。
app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
            console.log(err);
        })
    }
    // 如果响应头已经发送，直接传递错误给下一个中间件
    if (res.headerSent) {
        return next(error);
    }
    // 设置响应状态码为错误的代码或者默认为 500（服务器内部错误）
    res.status(error.code || 500);
    // 返回 JSON 格式的错误信息，包含错误消息或者默认的“未知错误”消息
    res.json({ message: error.message || "An unknown error occurred" });
});

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.646ehx5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
//  const url = `mongodb+srv://monnahi521:JjFmHCM3PQz4vjyq@cluster0.646ehx5.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(url).then(()=>{
    app.listen(4000);
    console.log('Connected to MongoDB')
}).catch(err=>{
    console.log(err);
})
