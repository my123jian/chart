function PlacePointView(theMap) {
  var theStr = "公路|客运站|福田汽车客运站CBG|福田汽车客运站CBG:114.013401,22.532431;\n" +
    "公路|客运站|龙岗长途汽车客运站|龙岗长途汽车客运站:114.271555,22.724456;\n" +
    "公路|客运站|罗湖汽车站|罗湖汽车站:114.119196,22.530169;\n" +
    "民航|机场|深圳宝安国际机场|深圳宝安国际机场0:113.810358,22.629992;\n" +
    "铁路|铁路|深圳北站|深圳北站0:114.029177,22.609334;\n" +
    "\"公路|客运站|深圳汽车站|\n" +
    "深圳汽车站0:114.08951,22.568788;\"\n" +
    "铁路|铁路|深圳西站|深圳西站0:113.907746,22.527855;\n" +
    "铁路|铁路|深圳站|深圳站0:114.117235,22.531822;\n" +
    "民航|机场|白云国际机场二号航站楼|广州白云国际机场T2航站楼0:113.305761,23.396641;\n" +
    "公路|客运站|广东省汽车客运站|广东省汽车客运站:113.252621,23.148364;\n" +
    "\"民航|机场|广州白云国际机场|\n" +
    "广州白云国际机场0:113.302948,23.38648;\"\n" +
    "铁路|铁路|广州北站|广州北站0:113.204449,23.377045;\n" +
    "铁路|铁路|广州东站|广州东站0:113.324803,23.150176;\n" +
    "公路|客运站|广州芳村汽车客运站|广州芳村汽车客运站:113.235082,23.079645;\n" +
    "铁路|铁路|广州南站|广州南站0:113.269391,22.988766;\n" +
    "公路|客运站|广州市汽车客运站|广州市汽车客运站:113.252132,23.146737;\n" +
    "公路|客运站|广州市天河客运站|广州市天河客运站:113.342309,23.170892;\n" +
    "铁路|铁路|广州站|广州站0:113.257908,23.148532;\n" +
    "公路|客运站|茂名市客运中心站|茂名市客运中心站:110.925976,21.645277;\n" +
    "民航|机场|湛江机场|湛江机场0:110.363507,21.212952;\n" +
    "水路|港口|湛江徐闻海安港|海安港0:110.235751,20.265909;\n" +
    "公路|客运站|香洲长途站|香洲长途站:113.567377,22.279407;\n" +
    "公路|客运站|佛山汽车站|佛山汽车站:113.110902,23.041469;\n" +
    "公路|客运站|河源汽车总站|河源汽车总站:114.692044,23.737577;\n" +
    "民航|机场|揭阳机场|揭阳机场0:116.509274,23.546361;\n" +
    "公路|客运站|中山汽车总站|中山汽车总站:113.342613,22.521965;\n" +
    "公路|客运站|中山小榄客运站|小榄车站:113.257901,22.671356;\n" +
    "公路|客运站|江门汽车客运站|广东省江门汽车总站:113.066064,22.630537;\n" +
    "公路|客运站|惠州汽车总站|惠阳汽车客运总站:114.460283,22.8141;\n" +
    "铁路|铁路|惠州站|惠州站0:114.416115,23.151307;\n" +
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
    "公路|服务区|雅瑶服务区-向北|雅瑶服务区0:112.989548,22.716462;\n" +
    "公路|服务区|雅瑶服务区-向南|雅瑶服务区0:112.991689,22.715794;\n" +
    "公路|服务区|源潭服务区-向北|源潭服务区:113.228876,23.685219;\n" +
    "公路|服务区|安塘服务区-向东|安塘服务区0:112.185459,22.939408;\n" +
    "公路|服务区|安塘服务区-向西|安塘服务区0:112.185443,22.937901;\n" +
    "公路|服务区|莲花山服务区-向东|莲花山服务区0:115.116624,22.949461;\n" +
    "公路|服务区|莲花山服务区-向西|莲花山服务区0:115.111965,22.945835;\n" +
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


  var theStr2 = '"公路|收费站|清远西收费站|清清远西收费站(G4W2许广高速南向)2:113.022921,23.660767\n' +
    '清远西收费站(G4W2许广高速北向)1:113.023031,23.660808;"\n' +
    '"公路|收费站|广园收费站|广园收费站(S15沈海高速广州支线入口)0:113.273612,23.158289\n' +
    '\n' +
    '广园收费站(广园快速路出口广州长隆方向)3:113.360973,23.145926\n' +
    ';"\n' +
    '"公路|收费站|三元里收费站|三元里收费站(S41机场高速出口)0:113.256076,23.158451\n' +
    '三元里收费站(广园西路出口)2:113.256156,23.158285;"\n' +
    '"公路|收费站|勒流收费站|勒流收费站(G1501广州绕城高速出口北滘方向)0:113.187256,22.844037\n' +
    '勒流收费站(S82佛山一环高速出口西樵山方向)1:113.188553,22.847173\n' +
    '勒流收费站(G1501广州绕城高速出口北滘方向)2:113.193612,22.84502\n' +
    '勒流收费站(佛山一环南延线出口广东金融高新区方向)3:113.191199,22.841365;"\n' +
    '"公路|收费站|沙贝收费站|沙贝收费站(S15沈海高速广州支线出口)0:113.194773,23.154628\n' +
    '沙贝收费站(S15沈海高速广州支线入口)1:113.195602,23.153512\n' +
    '沙贝收费站入口(S81方向)2:113.195582,23.153543;"\n' +
    '"公路|收费站|佛山罗格收费站|罗格收费站(S5广明高速西向)0:113.011973,22.991334\n' +
    '罗格收费站(S5广明高速东南向)1:113.011811,22.991054;"\n' +
    '公路|高速|莞佛高速虎门大桥|虎门大桥0:113.605895,22.784986;\n' +
    '公路|高速|广佛高速沙贝立交|省站沙贝配客点2:113.197209,23.155074;\n' +
    '公路|高速|长深高速惠州段|S25长深高速惠州支线6:114.347452,23.002513;\n' +
    '公路|高速|沈海高速广州黄村立交|黄村立交桥0:113.396634,23.151224;\n' +
    '公路|高速|大广高速与机场高速连接段|机场立交与G45大广高速交叉口5:113.277728,23.351933;\n' +
    '公路|高速|济广高速金龙大道出入口|金龙大道0:114.380984,23.199481;\n' +
    '公路|高速|京港高速广汕公路出入口|广汕公路与G4京港澳高速出口交叉口6:113.48691,23.21447;\n' +
    '公路|高速|粤赣高速小金口到热水段|23.2216070000,114.4205430000;\n' +
    '公路|高速|京珠北高速|G4京港澳高速5:113.692056,24.260996;\n' +
    '公路|高速|华南快速|S303华南快速3:113.286245,23.226338;\n' +
    '公路|高速|广深高速|S3广深沿江高速入口(西北向)9:113.561042,23.027907;\n' +
    '公路|高速|花都白云机场高速|花都白云机场高速:113.285256,23.350941;\n';

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
      console.error("数据不对:" + theItem);
    }
    var theData = {
      "一级分类": theItem[0],
      "枢纽类别": theItem[1],
      "枢纽名称": theItem[2],
      "地址": theItem[3],
    }
    theDataObject.push(theData);
  }
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
  this.markes = [];

  this.findPointByName = function (n) {
    if(nameArr[n]) {
      // console.log(nameArr[n]);
      return nameArr[n]
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
  // console.log(lntlat, maxZoom)
  var theZoom = this.theMap.getZoom();
  var thePitchTimer = window.setInterval(function () {
    if (theZoom > maxZoom) {
      window.clearInterval(thePitchTimer);
      this.theMap.setPitch(45);
      console.log("结束导航到指定点!");
      return;
    }
    this.theMap.setZoomAndCenter(theZoom++, lntlat);
  }, 10);
}
//结束导航到指定点
PlacePointView.prototype.ReturnDefualt = function (defaultZoom, lntlat) {
  console.log("开始导航到该蓝图!");
  var theZoom = this.theMap.getZoom();
  defaultZoom = defaultZoom || 8;  // 默认放大等级
  var lntlat = lntlat || new AMap.LngLat(113.275824, 22.994826)
  var thePitchTimer = window.setInterval(function () {
    if (theZoom < defaultZoom || theZoom <= 1) {
      window.clearInterval(thePitchTimer);
      console.log("结束导航到该蓝图!");
      this.theMap.setPitch(0);
      return;
    }
    this.theMap.setZoomAndCenter(theZoom--, lntlat);
  }, 10);
}

//交通枢纽 客运站,铁路,机场,港口
PlacePointView.prototype.showPoints = function (pointType) {
  this.removePoints();
  var thePlaces = [];
  var thePointTypes = pointType.split(',');
  for (var i = 0; i < thePointTypes.length; i++) {
    var thePointType = thePointTypes[i];
    var theCurretTypePoints = this.getPlacePoints(thePointType);
    thePlaces = thePlaces.concat(theCurretTypePoints);
  }
  if (!thePlaces) {
    console.log("未找到点!");
    return;
  }
  for (var i = 0; i < thePlaces.length; i++) {
    var thePlace = thePlaces[i];
    //var theName = thePlace['名称'];
    var theNameLntLatStrs = thePlace['地址'];
    if (!theNameLntLatStrs || theNameLntLatStrs.length < 0) {
      console.log(theName + "坐标错误!");
    }
    for (var j = 0; j < theNameLntLatStrs.length; j++) {
      var theData = theNameLntLatStrs[j];
      var theName = theData.name.replace(/[0-9]/ig, "");
      var theLntLatStr = theData.lnglat;
      var theLntLats = theLntLatStr.split(',');

      var marker = null;
      var theValue = Math.round(Math.random() * 10);
      // console.log(theValue)

      // 模拟数据==========
      if (theValue >= 8) {
        marker = new AMap.Marker({
          position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: theName,
          content: '<div class="point1"><i>' + theName + '</i></div>',
          extData: thePlace//加入对象信息
        });
      }
      else if (theValue >= 5) {
        // debugger
        marker = new AMap.Marker({
          position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: theName,
          content: '<div class="point2"><i>' + theName + '</i></div>',
          extData: thePlace//加入对象信息
        });
      }
      else {
        marker = new AMap.Marker({
          position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: theName,
          content: '<div class="point3"><i>' + theName + '</i></div>',
          extData: thePlace//加入对象信息
        });
      }
      // 模拟数据=============


      var me = this;
      marker.on('click', function (arg) {
        //var thelng = arg.lnglat;

        var thelng = arg.target.getPosition();// new AMap.LngLat(113.2685860000, 22.9874720000);
        var theCurrentMaxLevel = 18;//arg.target.getExtData().maxLevel || theMaxLevel;
        //{ "latitude": , "longitude":  }
        var theZoom = theMap.getZoom();
        if (theZoom <= 10) {
          me.MoveToPoint(thelng, theCurrentMaxLevel);
        }
        else {
          me.ReturnDefualt();
        }
      })
      this.markes.push(marker);
      theMap.add(marker);
    }

  }

}
