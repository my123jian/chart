/**
 * 数字化为金钱格式,千分位
 * @param num
 * @returns {string|*}
 */
function toMoney(num) {
  if (!num) {
    console.log('toMoney:参数不能为空');
    return
  }
  num = num.toFixed(2);
  num = parseFloat(num)
  num = num.toLocaleString();
  return num;//返回的是字符串23,245.12保留2位小数
}

/**
 * 数字转换成xx万
 * @param num
 * @returns {number|*}
 */
function toWan(num) {
  if (!num) {
    console.log('toWan:参数不能为空');
    return
  }
  var spanDom = '';
  if (num >= 1000) {
    spanDom = '<span>万</span>';
    num = (num / 10000).toFixed(1);
  }
  // result = val>=10000?Math.round(val/10000):val;
  return num + spanDom
}
function toWan2(num) {
  if (!num) {
    console.log('toWan2:参数不正确');
    return
  }
  if (num >= 1000) {
    num = (num / 10000).toFixed(1) + '万';
  }
  // result = val>=10000?Math.round(val/10000):val;
  return num
}

/**
 * 返回今天或者指定日期,利用了moment.js
 * @param detract 减去的天数
 * @returns {string}
 */
function returnDate(detract) {
  // var myDate = new Date();
  // var y, m, d;
  if (!detract) {
    // y = myDate.getFullYear();
    // m = myDate.getMonth() + 1;
    // d = myDate.getDate();
    // return y + '-' + m + '-' + d;
    return moment().format('YYYY-MM-DD')
  } else {
    // var sec = 24 * 60 * 60 * 1000 * detract;
    // var theDate = new Date(myDate.getTime() - sec);
    // y = theDate.getFullYear();
    // m = theDate.getMonth() + 1;
    // d = theDate.getDate();
    // m=m<10?'0'+m:m;
    // d=d<10?'0'+d:d;
    // return y + '-' + m + '-' + d;
    return moment().subtract('days', detract).format('YYYY-MM-DD');
  }
}

/**
 * 去掉字符串中的'0'
 * @param str
 */
function strDelZero(str) {
  var num = parseInt(str);
  if (num < 10) {
    var i = str.indexOf('0');
    if (i > -1) {
      str = str.slice(i + 1)
    }
  }

  // console.log(str);
  return str
}

/**
 * 格式化小数成百分比
 * @param decimal 小数
 */
function formatDecimal(decimal) {
  if(typeof decimal !== "number") {
    console.log('参数类型不对')
  }
  decimal = decimal * 100;
  decimal = decimal.toFixed(1);
  return decimal
}
function formatSexDecimal(decimal) {
  if(typeof decimal !== "number") {
    console.log('参数类型不对')
  }
  decimal = decimal * 100;
  decimal = decimal.toFixed(0);
  return decimal
}

/**
 * 返回点击中的日期的前一周
 * @param date 日期字符串
 * @returns {{start: (string|*), end: *}|*}
 */
function calDate(date) {
  if (!date) {
    console.log('date不能为空');
    return
  }
  var y, m, d, result, temp;

  var sec = 24 * 60 * 60 * 1000 * 6;
  var endD = new Date(date);
  var StartD = new Date(endD.getTime() - sec);
  y = StartD.getFullYear();
  m = StartD.getMonth() + 1;
  d = StartD.getDate();
  temp = y + '-' + m + '-' + d;
  // result = temp + ' - ' + date;
  result = {
    start: temp,
    end: date
  };
  return result
  // console.log(result)

}

/**
 * m化为km
 * @param m
 * @returns {string}
 */
function toKM(m) {
  if (!m) {
    console.log('参数不能为空');
    return
  }

  // var num = (m/1000).toFixed(2);
  // console.log(num)
  return (m / 1000).toFixed(2) + 'km'
}

/**
 * 要把经纬度坐标转换成地图容器坐标  0指向北 90西 180南 270东
 * @param start 起点经纬度
 * @param end 终点经纬度
 * @returns {number}
 */
function calcAngle(start, end) {
  // console.log(start,end);
  // var p_start = theMap.lngLatToContainer(start),
  //   p_end = theMap.lngLatToContainer(end);
  // console.log(p_start,p_end)
  //
  // var diff_x = p_end.x - p_start.x,
  //   diff_y = p_end.y - p_start.y;
  // console.log(diff_x,diff_y);
  // return 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI) + 90;

  var diff_x = end[0] - start[0],
    diff_y = end[1] - start[1];
  // console.log(diff_x,diff_y);
  return 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI);

}

// var a = [116.416354, 39.905993]; var b =  [121.416354, 34.905993];
// console.log('aaa',calcAngle(a,b))

/**
 * 根据角度,判断方向
 * @param angle 角度 int
 * @returns {string}
 */
function judgeDirection(angle) {
  if (typeof angle !== 'number') {
    console.log('参数类型不正确',angle);
    return
  }
  // console.log('angle',angle);
  var dir = '----';
  if (angle >= -45 && angle < 45) {
    dir = '由西向东'
  }
  if (angle >= 45 && angle < 135) {
    dir = '由南向北'
  }
  if (angle >= 135 && angle <= 180) {
    dir = '由东向西'
  }
  //
  // if (angle >= -45 && angle < 0) {
  //   dir = '由西向东'
  // }
  if (angle >= -135 && angle < -45) {
    dir = '由北向南'
  }
  if (angle >= -180 && angle < -135) {
    dir = '由东向西'
  }
  // if (angle >= 0 && angle < 45) {
  //   dir = '由南向北'
  // }
  // if (angle >= 45 && angle < 135) {
  //   dir = '由西向东'
  // }
  // if (angle >= 135 && angle < 225) {
  //   dir = '由北向南'
  // }
  // if (angle >= 225 && angle < 315) {
  //   dir = '由东向西'
  // }
  // if (angle >= 315 && angle <= 360) {
  //   dir = '由南向北'
  // }
  return dir
}

/**
 * 根据交通指数,返回不同的颜色
 * @param tpi
 */
function tpiToClass(tpi) {
  // if(!tpi){
  //   console.log('参数不对!');
  //   return
  // }
  var theClassArr = ['status1','status2','status3','status4','status5'];
  var theClass;
  tpi = parseFloat(tpi);
  if(tpi>=0 && tpi<2) {
    theClass = theClassArr[0]
  }
  if(tpi>=2 && tpi<4) {
    theClass = theClassArr[1]
  }
  if(tpi>=4 && tpi<6) {
    theClass = theClassArr[2]
  }
  if(tpi>=6 && tpi<8) {
    theClass = theClassArr[3]
  }
  if(tpi>=8 && tpi<=10) {
    theClass = theClassArr[4]
  }
  return theClass
}

/**
 * 判断是空对象
 * @param obj 对象
 * @returns {boolean}
 */
function isEmptyObject(obj){
  for(var key in obj){
    return false
  }
  return true
}

/**
 * 计算时段数组,并返回
 */
function calTimeArr() {
  var max = 24,theTimeArr = [],str = ':00';
  for (var i = 0; i < max; i++) {
    var preHour,aftHour,result;
    preHour = i;
    aftHour = i + 1;
    if(preHour<10) {
      preHour = '0' + preHour;
    }
    if(aftHour<10) {
      aftHour = '0' + aftHour;
    }
    preHour += str;
    aftHour += str;
    result = preHour + '-' + aftHour;
    theTimeArr.push(result);
  }
  return theTimeArr
}

/**
 * 判断是否已经过指定的分钟
 * @param timeStamp 上一个时间戳(毫秒)
 * @param interval 时间间隔(分钟)
 */
function canRefresh(timeStamp, interval) {
  // debugger
  var curTime = new Date().valueOf();
  interval = interval * 60000;
  timeStamp = timeStamp.valueOf();
  var result = curTime - timeStamp;
  return result > interval
}