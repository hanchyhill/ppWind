const axios = require('axios');

const pointW = [[107.5,32.5], [107.5,30.0], [107.5,27.5], [107.5,25.0],
                [110.0,25.0], [110.0,21.25]];
const pointC = [[113.75, 32.5], [113.75,30.0], [113.75,27.5], [113.75,25.0],
                [113.75,22.5]];
const pointE = [[120.0, 32.5], [120.0,30.0], [120.0,27.5], [120.0,25.0],
                [118.75, 25.0], [116.25, 23.75]];

function SUM(data){
  return data.reduce((total, value)=>total + value, 0);
}

function findMax(a0, a1, a2){
  let maxIndex = 0; // 最大index初猜测
  let preMax = NaN;
  a0 > a1? a1 = a0 : maxIndex = 1;// a0>a1, a0 赋值给 a0,
  a1 > a2? '' : maxIndex = 2;
  return maxIndex;
}

function isNorthWind(u,v){
  return v<0 && Math.abs(v)/Math.abs(u)>=1? true:false;
}

/* function whichType(w,c,e){
  wSum = SUM(w.slice(0,4));
  cSum = SUM(c.slice(0,4));
  eSum = SUM(e.slice(0,4));
  typeIndex = findMax(wSum, cSum, eSum);
  return typeIndex;
} */

// 中部型
const MiddleType= (dataPack) => {
  const pw5w6 = dataPack.pw5w6;
  const w6 = dataPack.w6;
  const pe3e6 = dataPack.pe3e6;
  const pe5c5 = dataPack.pe5c5;
  const pc5w6 = dataPack.pc5w6;

  function middleWest(pw5w6, w6){
    if(pw5w6 < 4.0 && pw5w6 <= 7.0 && w6){
      return 1;
    }
    else if(pw5w6>7.0 && pw5w6<9.5 && w6){
      return 2;
    }
    else if(pw5w6>=9.5){
      return 3;
    }
    else{
      return 0;
    }
  };

  function east(pw5w6, pe3e6){
    if( (pw5w6 >= 7.0 && pe3e6 <= 7.0 && pe3e6>=4.8) || (pe3e6>=3.0&&pe3e6<=7) ){
      return 1;
    }
    else if(pe3e6>7.0&&pe3e6<8.5){
      return 2;
    }
    else if(pe3e6>=8.5){
      return 3
    }
    else{
      return 0;
    }
  };

  function middle(pw5w6, pe5c5){
    if(pw5w6<3.7 && pe5c5>=2.2 && pe5c5 < 4.5){
      return 1;
    }
    else if(pw5w6<3.7 && pe5c5 >= 4.5){
      return 5;
    }
    else{
      return 0;
    }
  };

  function west(pw5w6, pc5w6){
    if(pw5w6<3.7 && pc5w6 >=3){
      return 4;
    }
    else{
      return 0;
    }
  }

  let m = middle(pw5w6, pe5c5);
  let w = west(pw5w6, pc5w6);
  let mw = middleWest(pw5w6, w6);
  return{
    e:east(pw5w6, pe3e6),
    m:m>mw?m:mw,
    w:w>mw?w:mw,
    mw,
    om:m,
    ow:w,
    // type:'middle',
  };
}

// 东部型
function EastType(dataPack){
  const pw5w6 = dataPack.pw5w6;
  const w6 = dataPack.w6;
  const pe3e6 = dataPack.pe3e6;
  const pe5c5 = dataPack.pe5c5;
  const pc5w6 = dataPack.pc5w6;
  function middleWest(pw5w6){
    if(pw5w6>5 && pw5w6<=7){
      return 1;
    }
    else if(pw5w6>7){
      return 5;
    }
    else{
      return 0;
    }
  }

  function east(pe3e6){
    if(pe3e6>=3 && pe3e6<=7){
      return 1;
    }
    else if(pe3e6>7 && pe3e6<8.5){
      return 2;
    }
    else if(pe3e6>=8.5){
      return 3;
    }
    else{
      return 0;
    }
  };

  function middle(pw5w6, pe5c5){
    if(pw5w6<3.7&&pe5c5>=2.2&&pe5c5<4.5){
      return 1;
    }
    else if(pw5w6<3.7&&pe5c5>=4.5){
      return 5;
    }
    else{
      return 0;
    }
  }

  function west(pw5w6, pc5w6){
    if(pw5w6<3.7&&pc5w6>=3){
      return 4;
    }
    else{
      return 0;
    }
  }

  let m = middle(pw5w6,pe5c5);
  let w = west(pw5w6,pc5w6);
  let mw = middleWest(pw5w6);

  return{
    e: east(pe3e6),
    m: m>mw? m:mw,
    w: w>mw? w:mw,
    mw,
    om:m,
    ow:w,
    // type:'east',
  };
}

// 西部型
function WestType(dataPack){
  const pw5w6 = dataPack.pw5w6;
  const w6 = dataPack.w6;
  const pe3e6 = dataPack.pe3e6;
  const pe5c5 = dataPack.pe5c5;
  const pc5w6 = dataPack.pc5w6;
  function middleWest(pw5w6,w6){
    if(pw5w6>4 && pw5w6<=7 && w6){
      return 1;
    }
    else if(pw5w6>7 && pw5w6<9.5 && w6){
      return 2;
    }
    else if(pw5w6>=9.5){
      return 3;
    }
    else{
      return 0;
    }
  };

  function east(pe3e6){
    if(pe3e6>=4 && pe3e6 <=7){
      return 1;
    }
    else if(pe3e6>7){
      return 5;
    }
    else{
      return 0;
    }
  }

  let mw = middleWest(pw5w6,w6);
  return {
    e:east(pe3e6),
    m:mw,
    w:mw,
    mw:middleWest(pw5w6,w6),
    om:-1,
    ow:-1,
    // type:'west',
  };
}

function getData(start,end){
  // let demoURL = 'http://172.22.1.175/di/grid.action?userId=sqxt&pwd=shengqxt123&dataFormat=json&interfaceId=intGetDataTimeSerialGroup&modelid=ecmwfthin&element=mslp&level=0&starttime=2017-10-28 12:00:00&endtime=2017-11-01 12:00:00&lon=107.5 107.5&lat=32.5 30.0';
  let startTime = '2017-11-02 12:00:00';
  let endTime = '2017-11-05 12:00:00';
  let lon = [].concat(pointW, pointC, pointE).map(v=>v[0]).join(' ');
  let lat = [].concat(pointW, pointC, pointE).map(v=>v[1]).join(' ');
  let mslpURL = encodeURI(`http://172.22.1.175/di/grid.action?userId=sqxt&pwd=shengqxt123&dataFormat=json&interfaceId=intGetDataTimeSerialGroup&modelid=ecmwfthin&element=mslp&level=0&starttime=${startTime}&endtime=${endTime}&lon=${lon}&lat=${lat}`);
  let w6URL = encodeURI(`http://172.22.1.175/di/grid.action?userId=sqxt&pwd=shengqxt123&dataFormat=json&interfaceId=intGetMultElesDataTimeSerial&modelid=ecmwfthin&element=u10m%20v10m&level=0&starttime=${startTime}&endtime=${endTime}&lon=${pointW[5][0]}&lat=${pointW[5][1]}`);
  // console.log(w6URL);
  return new Promise((resolve,reject)=>{
    axios.all([axios.get(mslpURL),axios.get(w6URL)])
      .then(axios.spread((res1,res2)=>{
        const data = res1.data;
        if(!data.DATA||data.RET<0) reject('获取的数据无法解析01');
        const data2 = res2.data;
        if(!data2.DATA||data.RET<0) reject('获取的数据无法解析02');
        resolve([data.DATA, data2.DATA]);
        // switch case 0 1 2 -> w c e
        // return [wP, cP, eP];
      }))
      .catch(err=>{
        reject(err);
      });
  }); // promise 结束
}

function resolveData(list,wind10m){ //list -> 气压序列，data2->u10m,v10m
  const eachLength = [pointW.length, pointC.length, pointE.length];
  const totalPoints = SUM(eachLength);//一共几个点
  let pointLength = list.length/totalPoints;//每个点的时间长度
  console.log('长度'+pointLength);
  let pointsList = [];
  for(let i = 0; i<totalPoints;i++){
    pointsList.push(list.slice(i*pointLength, (i+1)*pointLength));
  }
  let validList = pointsList.map(v=>v.reduce((ac,value,index)=>{
    if(value>0) ac.push([index,value]);
    return ac;
  },[]));// 剔除-999数值,返回时次-数值对
  // console.log(validList);

  let wP = validList.slice(0,eachLength[0]);// pointsNum,[i,v]
  let cP = validList.slice(eachLength[0],eachLength[0]+eachLength[1]);
  let eP = validList.slice(eachLength[0]+eachLength[1]);
  
  let wSumP = wP[0].map((v0,i)=>v0[1] + wP[1][i][1] + wP[2][1] + wP[3][1]);
  let cSumP = cP[0].map((v0,i)=>v0[1] + cP[1][i][1] + cP[2][1] + cP[3][1]);
  let eSumP = eP[0].map((v0,i)=>v0[1] + eP[1][i][1] + eP[2][1] + eP[3][1]);
  
  // w6风向
  const w6Raw = [wind10m.slice(0,wind10m.length/2),wind10m.slice(wind10m.length/2)];
  const validW6 = w6Raw.map(v=>v.reduce((ac,value,index)=>{ 
    if(value>-990) ac.push([index,value]);
    return ac;
  },[]));// [[i,u10m], [i,v10m]]
  const w6North = validW6[0].map((u10,i)=>isNorthWind(u10[1],validW6[1][i][1]));
  // TODO,确定所有长度一致，dataPack合成{type,pe3e6,pe5c5,pw5w6,w6}
  
  let typeList = wSumP.map((w,i)=>findMax(w,cSumP[i],eSumP[i]));
  const dataPack = typeList.map((type,i)=>{
    const time = wP[0][i][0];
    const pe3e6 = eP[2][i][1] - eP[5][i][1];
    const pe5c5 = eP[4][i][1] - cP[4][i][1];
    const pw5w6 = wP[4][i][1] - wP[5][i][1];
    const pc5w6 = cP[4][i][1] - wP[5][i][1];
    return {
      time,
      type,
      pe3e6,
      pe5c5,
      pw5w6,
      pc5w6,
      w6:w6North[i],
    }
  })

//  console.log(dataPack);
  let windList = dataPack.map(data=>{
    switch(data.type){
      case 0: // 西部型
        return WestType(data);
        break;
      case 1:// 中部型
        return MiddleType(data);
        break;
      case 2:// 东部型
        return EastType(data);
        break;
      default:
        throw new Error('分型错误');
    }
  });

  const listMix = windList.map((obj,i)=>{
    return Object.assign({}, obj, {time:dataPack[i].time,type:dataPack[i].type});
  })
   //console.log(windList);
   // TODO: assign datapack中数据。
   return listMix;
}

async function getWind(start,end){
  try {
    const list = await getData(start,end);
    return resolveData(list[0], list[1]);
  } catch (err) {
    throw new Error(err);
  }
  
}

exports.getWind = getWind;
/* getWind()
  .then(windList=>{
    console.log(windList);
  })
  .catch(err=>{
    console.error(err);
  }) */
//console.log(mslpURL);