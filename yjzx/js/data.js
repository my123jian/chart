function PlacePointView(theMap) {
  var theStr = "公路|客运站|深圳福田汽车客运站|深圳福田汽车客运站:114.013401,22.532431;\n" +
    "公路|客运站|深圳市龙岗汽车客运站|深圳市龙岗汽车客运站:114.271555,22.724456;\n" +
    "公路|客运站|深圳罗湖汽车客运站|深圳罗湖汽车客运站:114.119196,22.530169;\n" +
    "民航|机场|深圳宝安国际机场|深圳宝安国际机场0:113.812956,22.625566;\n" +
    // "民航|机场|深圳宝安国际机场|深圳宝安国际机场0:113.813080,22.626400;\n" +
    "铁路|铁路|深圳北站|深圳北站0:114.029177,22.609334;\n" +
    "\"公路|客运站|深圳汽车站|\n" +
    "深圳汽车站0:114.08951,22.568788;\"\n" +
    "铁路|铁路|深圳西站|深圳西站0:113.907746,22.527855;\n" +
    "铁路|铁路|深圳站|深圳站0:114.117235,22.531822;\n" +
    // "民航|机场|白云国际机场二号航站楼|广州白云国际机场T2航站楼0:113.305761,23.396641;\n" +
    "公路|客运站|省汽车客运站|省汽车客运站:113.252621,23.148364;\n" +
    "\"民航|机场|广州白云国际机场|\n" +
    "广州白云国际机场0:113.3029,23.386363;\"\n" +
    // "广州白云国际机场0:113.303119,23.387312;\"\n" +
    "铁路|铁路|广州北站|广州北站0:113.204449,23.377045;\n" +
    "铁路|铁路|广州东站|广州东站0:113.324803,23.150176;\n" +
    "公路|客运站|芳村汽车客运站|芳村汽车客运站:113.235082,23.079645;\n" +
    "铁路|铁路|广州南站|广州南站0:113.269391,22.988766;\n" +
    "公路|客运站|广州汽车客运站|广州汽车客运站:113.252132,23.146737;\n" +
    "公路|客运站|天河汽车客运站|天河汽车客运站:113.342309,23.170892;\n" +
    "铁路|铁路|广州火车站|广州火车站:113.257908,23.148532;\n" +
    "公路|客运站|茂名客运中心站|茂名客运中心站:110.925976,21.645277;\n" +
    "民航|机场|湛江机场|湛江机场0:110.366257,21.212231;\n" +
    // "水路|港口|湛江徐闻海安港|海安港0:110.235751,20.265909;\n" +
    "公路|客运站|香洲长途站|香洲长途站:113.567377,22.279407;\n" +
    "公路|客运站|佛山汽车站|佛山汽车站:113.110902,23.041469;\n" +
    "公路|客运站|河源汽车总站|河源汽车总站:114.692044,23.737577;\n" +
    "民航|机场|潮汕国际机场|潮汕国际机场:116.514158,23.546987;\n" +
    "公路|客运站|中山汽车总站|中山汽车总站:113.342613,22.521965;\n" +
    "公路|客运站|中山小榄客运站|小榄车站:113.257901,22.671356;\n" +
    "公路|客运站|江门汽车客运站|广东省江门汽车总站:113.066064,22.630537;\n" +
    "公路|客运站|惠州汽车总站|惠阳汽车客运总站:114.460283,22.8141;\n" +
    "铁路|铁路|惠州站|惠州站0:114.416426,23.151534;\n" +
    "铁路|铁路|东莞东|东莞东站0:114.039076,22.967182;\n" +
    "公路|客运站|东莞汽车总站|东莞总站:113.716865,23.031193;\n" +
    "铁路|铁路|东莞站|东莞站0:113.859736,23.088778;\n" +
    "公路|客运站|东莞长安车站|长安汽车站:113.822428,22.800907;\n" +
    "铁路|铁路|虎门站|虎门站0:113.673238,22.860575;\n" +
    "铁路|铁路|潮汕站|潮汕站0:116.588171,23.539591;\n" +
    "公路|客运站|潮州汽车客运站|潮州粤运汽车总站:116.635081,23.665183;\n" +
    "公路|客运站|清远汽车客运站|清远市城北汽车客运站:113.003648,23.723292;\n" +
    "公路|服务区|梁金山服务区-向东北|梁金山服务区0:112.684761,22.450952;\n" +
    "公路|服务区|梁金山服务区-向西南|梁金山服务区0:112.683634,22.452593;\n" +
    "公路|服务区|雅瑶服务区-向北|雅瑶服务区0:112.991689,22.715794;\n" +
    "公路|服务区|雅瑶服务区-向南|雅瑶服务区0:112.989548,22.716462;\n" +
    "公路|服务区|源潭服务区-向北|源潭服务区:113.228876,23.685219;\n" +
    "公路|服务区|安塘服务区-向东|安塘服务区0:112.185443,22.937901;\n" +
    "公路|服务区|安塘服务区-向西|安塘服务区0:112.185459,22.939408;\n" +
    "公路|服务区|莲花山服务区-向东|莲花山服务区0:115.111965,22.945835;\n" +
    "公路|服务区|莲花山服务区-向西|莲花山服务区0:115.116624,22.949461;\n" +
    "公路|服务区|阳江服务区-向东|阳江服务区0:111.954649,21.90365;\n" +
    "公路|服务区|阳江服务区-向西|阳江服务区0:111.953984,21.905044;\n" +
    "公路|服务区|黎溪服务区-向东北|黎溪服务区0:113.226716,23.976683;\n" +
    "公路|服务区|黎溪服务区-向西南|黎溪服务区0:113.2245,23.977502;\n" +
    "公路|服务区|勒流服务区-向东|勒流服务区0:113.165052,22.840909;\n" +
    "公路|服务区|勒流服务区-向西|勒流服务区0:113.164784,22.842427;\n" +
    "公路|服务区|顺德服务区-向北|顺德服务区0:113.269954,22.917632;\n" +
    "公路|服务区|顺德服务区-向南|顺德服务区0:113.268543,22.915645;\n" +
    "公路|服务区|热水服务区-向东北|热水服务区0:114.749369,23.822234;\n" +
    "公路|服务区|热水服务区-向西南|热水服务区0:114.748972,23.824565;\n" +
    "公路|服务区|石坝服务区-向东|石坝服务区0:114.63243,23.522732;\n" +
    "公路|服务区|石坝服务区-向西|石坝服务区0:114.631008,23.524596;\n" +
    "公路|服务区|泰美服务区-向北|泰美服务区0:114.48812,23.331663;\n" +
    "公路|服务区|泰美服务区-向南|泰美服务区0:114.486629,23.331643;\n" +
    "公路|服务区|龙甫服务区-向南|龙甫服务区0:112.713309,23.37604;\n" +
    "公路|服务区|龙甫服务区-向北|龙甫服务区0:112.714108,23.37769;\n" +
    "公路|服务区|电白服务区-向西|电白服务区0:111.057509,21.62957;\n" +
    "公路|服务区|电白服务区-向东|电白服务区0:111.057691,21.628508;\n" +
    "公路|服务区|沙埔服务区-向西|沙埔服务区0:113.676465,23.18926;\n" +
    "公路|服务区|沙埔服务区-向东|沙埔服务区0:113.675285,23.187159;\n" +
    "公路|服务区|广州花城服务区-向南|花城服务区0:113.313094,23.503159;\n" +
    "铁路|铁路|佛山西站|佛山西站0:113.033676,23.079483;\n" +
    "铁路|铁路|珠海站|珠海站0:113.549333,22.215148;\n";

  var theStr2 = '"公路|高速监测|清远西收费站|清清远西收费站(G4W2许广高速南向)2:113.022921,23.660767\n' +
    ';"\n' +
    '"公路|高速监测|广园收费站|广园收费站(S15沈海高速广州支线入口)0:113.273612,23.158289\n' +
    '\n' +
    '' +
    ';"\n' +
    '"公路|高速监测|三元里收费站|三元里收费站(S41机场高速出口)0:113.256076,23.158451\n' +
    ';"\n' +
    '"公路|高速监测|勒流收费站|勒流收费站(G1501广州绕城高速出口北滘方向)0:113.187256,22.844037\n' +
    '\n' +
    'n' +
    ';"\n' +
    '"公路|高速监测|沙贝收费站|沙贝收费站(S15沈海高速广州支线出口)0:113.194773,23.154628\n' +
    '\n' +
    ';"\n' +
    '"公路|高速监测|佛山罗格收费站|罗格收费站(S5广明高速西向)0:113.011973,22.991334\n' +
    ';"\n' +

    '"公路|高速监测|街口收费站|街口收费站(S16派街高速出口河源方向)0:113.579269,23.520948\n' +
    ';"\n';

  // var theStr2 = '"公路|收费站|清远西收费站|清清远西收费站(G4W2许广高速南向)2:113.022921,23.660767\n' +
  //   ';"\n' +
  //   '"公路|收费站|广园收费站|广园收费站(S15沈海高速广州支线入口)0:113.273612,23.158289\n' +
  //   '\n' +
  //   '' +
  //   ';"\n' +
  //   '"公路|收费站|三元里收费站(S41机场高速出口)|三元里收费站(S41机场高速出口)0:113.256076,23.158451\n' +
  //   ';"\n' +
  //   '"公路|收费站|勒流收费站|勒流收费站(G1501广州绕城高速出口北滘方向)0:113.187256,22.844037\n' +
  //   '\n' +
  //   'n' +
  //   ';"\n' +
  //   '"公路|收费站|沙贝收费站|沙贝收费站(S15沈海高速广州支线出口)0:113.194773,23.154628\n' +
  //   '\n' +
  //   ';"\n' +
  //   '"公路|收费站|佛山罗格收费站|罗格收费站(S5广明高速西向)0:113.011973,22.991334\n' +
  //   ';"\n' +
  //
  //   '"公路|收费站|街口收费站|街口收费站(S16派街高速出口河源方向)0:113.579269,23.520948\n' +
  //   ';"\n' +
  //   '公路|高速|莞佛高速虎门大桥|莞佛高速虎门大桥:113.605895,22.784986;\n' +
  //   '公路|高速|广佛高速沙贝立交|广佛高速沙贝立交:113.185576,23.146178;\n' +
  //   '公路|高速|长深高速惠州段|长深高速惠州段:114.366449,23.027328;\n' +
  //   '公路|高速|沈海高速广州黄村立交|沈海高速广州黄村立交:113.397606,23.151624;\n' +
  //   '公路|高速|大广高速与机场高速连接段|大广高速与机场高速连接段:113.276381,23.342038;\n' +
  //   '公路|高速|济广高速金龙大道出入口|济广高速金龙大道出入口:114.425594,23.222671;\n' +
  //   '公路|高速|京港高速广汕公路出入口|京港高速广汕公路出入口:113.482522,23.215015;\n' +
  //   '公路|高速|粤赣高速小金口到热水段|粤赣高速小金口到热水段:114.690675,23.789941;\n' +
  //   '公路|高速|京珠北高速|京珠北高速:113.412836,23.351586;\n' +
  //   '公路|高速|华南快速|华南快速:113.286245,23.226338;\n' +
  //   '公路|高速|广深高速|广深高速:113.840318,22.641758;\n' +
  //   '公路|高速|机场高速|机场高速:113.285256,23.350941;\n';


  var placeData = theStr + theStr2;

  var theGroups = placeData.split(';');
  var theDataObject = [];
  for (var i = 0; i < theGroups.length; i++) {
    var theItems = theGroups[i];
    if (!theItems) {
      console.log("错误:" + theItems);
      continue;
    }
    var theItem = theItems.split('|');
    // debugger
    // console.log(theItem)
    if (theItem.length < 4) {
      console.warn("数据不对:" + theItem);
    }
    var theData = {
      "一级分类": theItem[0],
      "枢纽类别": theItem[1],
      "枢纽名称": theItem[2],
      "地址": theItem[3],
    }
    theDataObject.push(theData);
  }
  // debugger
  // console.log('theDataObject:',theDataObject)
  var theRegexName = /([^:]*):(\d*\.\d*\,\d*\.\d*)/ig;
  for (var i = 0; i < theDataObject.length; i++) {
    var theItem = theDataObject[i];
    var theGpsData = theItem['地址'];
    var theGpsArray = [];
    var theMatchGroup = theRegexName.exec(theGpsData);
    // console.log(theGpsData)
    // console.log(theMatchGroup)
    while (theMatchGroup != null) {
      theGpsArray.push({
        "name": theMatchGroup[1],
        "lnglat": theMatchGroup[2]
      });
      theMatchGroup = theRegexName.exec(theGpsData);
    }
    theItem['地址'] = theGpsArray;
  }
  this.PlacePoints = theDataObject;
  var nameArr = {};
  for (var i = 0; i < this.PlacePoints.length; i++) {
    var obj = this.PlacePoints[i];
    nameArr[obj['枢纽名称']] = obj;
  }
  this.theMap = theMap;
  // debugger
  this.markes = [];
  this.unMatchYJData = [];

  this.findPointByName = function (n) {
    if(nameArr[n]) {
      console.log('找到:',nameArr[n]);
      return nameArr[n]
    } else {
      console.log('找不到:',nameArr[n]);

    }
  }
}

PlacePointView.prototype.getPlacePoints = function (pointType) {
  var thePlaces = [];
  for (var i = 0; i < this.PlacePoints.length; i++) {
    var thePlace = this.PlacePoints[i];
    if (thePlace['枢纽类别'] == pointType) {
      thePlaces.push(thePlace);
    }
  }
  return thePlaces;
}
PlacePointView.prototype.removePoints = function () {
  this.theMap.remove(this.markes);
  // this.theMap.remove(this.unMatchYJMarkers);
  this.unMatchYJData = [];
  this.markes = [];
}

PlacePointView.prototype.hideMarkers = function () {
  for (var i = 0; i < this.markes.length; i++) {
    var obj = this.markes[i];
    obj.hide();
  }
}
PlacePointView.prototype.showMarkers = function () {
  for (var i = 0; i < this.markes.length; i++) {
    var obj = this.markes[i];
    obj.show();
  }
}

PlacePointView.prototype.MoveToPoint = function (lntlat, maxZoom) {
  console.log("开始导航到指定点!");
  $('#DivButton').empty();

  // console.log(lntlat, maxZoom)
  var theZoom = this.theMap.getZoom();
  var thePitchTimer = window.setInterval(function () {
    if (theZoom > maxZoom) {
      window.clearInterval(thePitchTimer);
      this.theMap.setPitch(45);
      // console.log("结束导航到指定点!");
      return;
    }
    this.theMap.setZoomAndCenter(theZoom++, lntlat);
    // console.log(theZoom,maxZoom)
  }, 10);
  // debugger
  this.theMap.setZoomAndCenter(maxZoom, lntlat);

};
//结束导航到指定点
PlacePointView.prototype.ReturnDefualt = function (defaultZoom) {
  console.log("开始导航到该蓝图!");
  var theZoom = this.theMap.getZoom();
  defaultZoom = defaultZoom || 8;  // 默认放大等级
  var lntlat;
  if(window.nowTab!=='高速监测') {
    lntlat = new AMap.LngLat(113.275824, 22.994826);
  } else {
    lntlat = new AMap.LngLat(114.231635, 22.999883);
  }
  var thePitchTimer = window.setInterval(function () {
    if (theZoom < defaultZoom || theZoom <= 1) {
      window.clearInterval(thePitchTimer);
      console.log("结束导航到该蓝图!");
      this.theMap.setPitch(0);
      return;
    }
    this.theMap.setZoomAndCenter(theZoom--, lntlat);
  }, 10);
    // this.theMap.setZoomAndCenter(defaultZoom, lntlat);

};
/**
 * 找点的类别
 * @param pointName
 * @returns {*}
 */
PlacePointView.prototype.getPointType = function (pointName) {
  var theName = pointName;
  var theType;
  for (var i = 0; i < this.PlacePoints.length; i++) {
    var thePlace = this.PlacePoints[i];
    if (thePlace['枢纽名称'] == theName) {
      theType = thePlace['枢纽类别']
    }
  }
  if(!theType) {
    console.warn('没有找到点的类别')
    return
  }
  return theType;
}

/**
 * 显示地图点
 * @param pointType 当前tab类型
 * @param YJData 预警data
 */
PlacePointView.prototype.showPoints = function (pointType,YJData) {
  this.removePoints();
  var thePlaces = [];
  var theYJData = YJData;
  // console.log(theYJData);
  var thePointTypes = pointType.split(',');
  // debugger
  for (var i = 0; i < thePointTypes.length; i++) {
    var thePointType = thePointTypes[i];
    var theCurretTypePoints = this.getPlacePoints(thePointType);
    // debugger
    thePlaces = thePlaces.concat(theCurretTypePoints);
    // debugger
  }
  if (!thePlaces) {
    console.log("未找到点!");
    return;
  }
  for (var i = 0; i < thePlaces.length; i++) {
    var thePlace = thePlaces[i];
    // debugger

    var theNameLntLatStrs = thePlace['地址'];
    // debugger
    var pointName = thePlace['枢纽名称'];
    // console.log(pointName)
    if (!theNameLntLatStrs || theNameLntLatStrs.length < 0) {
      console.log(theName + "坐标错误!");
    }
    outer:
    for (var j = 0; j < theNameLntLatStrs.length; j++) {
      var theData = theNameLntLatStrs[j];
      // var theName = theData.name.replace(/[0-9]/ig, "");
      var theName = pointName;
      // console.log(theName)
      // debugger
      var theLntLatStr = theData.lnglat;
      var theLntLats = theLntLatStr.split(',');

      var marker = null;
      var theDataObj = null;
      // console.log(theValue)

      for (var k = 0; k < theYJData.length; k++) {
        var obj = theYJData[k];
        var theDataArr = obj.data;
        var theClassName = obj.pointClass;
        if(window.nowTab==='高速监测') {
          theClassName = 'point3-1'
        }
        // debugger
        for (var l = 0; l < theDataArr.length; l++) {
          theDataObj = theDataArr[l];
          // debugger
          if(theName===theDataObj.postionName) {  // 找到对应的名字,添加marker
            marker = new AMap.Marker({
              position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: theName,
              content: '<div class="' + theClassName + '"><i>' + theName + '</i></div>',
              extData: thePlace//加入对象信息
            });
            // debugger
            // console.log(this)
            this.markes.push(marker);
            // debugger
            theMap.add(marker);
            // console.log(theName,j);
            break outer
          }
        }
      }
      // console.log(theName)

      if(window.nowTab==='高速监测') {
        var theClassName2 = 'point3-1'
      } else {
        var theClassName2 = 'point3'

      }
      // 如果没找到对应名字, 默认添加到舒适状态marker
      marker = new AMap.Marker({
        position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: theName,
        content: '<div class="'+theClassName2+'"><i>' + theName + '</i></div>',
        extData: thePlace,//加入对象信息
        theData: theDataObj
      });

      // 模拟数据==========  todo 地图点的样式
      // var theValue = Math.round(Math.random() * 10);
      // if (theValue >= 8) {
      //   marker = new AMap.Marker({
      //     position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //     title: theName,
      //     content: '<div class="point1"><i>' + theName + '</i></div>',
      //     extData: thePlace//加入对象信息
      //   });
      // }
      // else if (theValue >= 5) {
      //   // debugger
      //   marker = new AMap.Marker({
      //     position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //     title: theName,
      //     content: '<div class="point2"><i>' + theName + '</i></div>',
      //     extData: thePlace//加入对象信息
      //   });
      // }
      // else {
      //   marker = new AMap.Marker({
      //     position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //     title: theName,
      //     content: '<div class="point3"><i>' + theName + '</i></div>',
      //     extData: thePlace//加入对象信息
      //   });
      // }
      // 模拟数据=============

      // this.unMatchYJData.push(marker);
      if(window.nowTab==='高速监测') {
        this.markes.push(marker);
        theMap.add(marker);
      }
      // this.markes.push(marker);
      // theMap.add(marker);
    }

  }

}
/**
 * 找点的坐标
 * @param name
 */
PlacePointView.prototype.findPointPosition = function (name) {
  for (var i = 0; i < this.markes.length; i++) {
    var m = this.markes[i];
    var mData = m.C.extData;
    if(name===mData['枢纽名称']) {
      return mData['地址'][0].lnglat
    }
  }
}