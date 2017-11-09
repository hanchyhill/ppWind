const getWind = require("./getDataUtil.js").getWind;
getWind()
.then(resData=>{
  console.log(resData)
})
.catch(error=>{
  console.log(error);
})