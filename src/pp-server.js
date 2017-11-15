////api服务器
const express = require('express');
const apiServer = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const getWind = require("./getDataUtil.js").getWind;

apiServer.use(bodyParser.urlencoded({ extended: true }));
apiServer.use(bodyParser.json());
var apiRouter = express.Router();

apiRouter.route('/:apiName')
.get((req, res)=>{
  console.log('get:'+req.params.apiName);
  res.set('Access-Control-Allow-Origin', '*');
  switch (req.params.apiName){
    case 'getData': // 获取数据
      const startTime = req.query.start;
      const endTime = req.query.end;
      const model = req.query.model;
      getWind(startTime, endTime, model)
      .then(resData=>{
        res.send(JSON.stringify(resData))
      })
      .catch(error=>{
        console.log(error);
        res.status(503).send(error.message?error.message:error);
      })
      break;
    default:// 未获取到时跳到下一个
      next();
  }
  
});

apiServer.use('/api', apiRouter);
apiServer.listen(10073, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + (10073) + '\n')
})
////////////////////