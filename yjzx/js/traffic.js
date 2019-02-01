//https://report.amap.com/ajax/roadRank.do?roadType=1&timeType=0&cityCode=440100 得到点数据
//https://report.amap.com/ajax/roadDetail.do?roadType=1&timeType=0&cityCode=440100&lineCode=4391 得到详情数据
/*高速路网展示*/

function TrafficView(map, samllmap) {
  this.TrafficColor = {
    "畅通": "rgb(52, 176, 0)",
    "缓行": "rgb(254, 203, 0)",
    "拥堵": "rgb(223, 1, 0)",
    "严重拥堵": "rgb(142, 14, 11)"
  };
  this.TrafficPointCss = ["amap-marker pos_0_", "amap-marker pos_1_", "amap-marker pos_2_", "amap-marker pos_3_"];
  //    "畅通": "",
  //    "缓行": "",
  //    "拥堵": "",
  //    "严重拥堵": ""
  //};
  this.StartPointCss = "";
  this.EndPointCss = "";
  this.TheMap = map;
  this.MarkPoints = [];
  this.RoadPaths = [];
  //this.RoadPath = null;
  this.StartPoint = null;
  this.EndPoint = null;
  this.RoadZommLevel = 10;
  if (!this.TheMap) {
    console.log("地图实例不正确!");
    return;
  }
  var me = this;
  this.TheMap.on('zoomend', function (arg) {
    var theCurrentZoom = me.TheMap.getZoom();
    if (theCurrentZoom > me.RoadZommLevel) {
      //me.showRoad();
      me.hidePoints();
    }
    else {
      // me.hideRoad();
      me.showPoints();
    }
  })
  // this.TheSmallMap = samllmap;
  // this.TheMap.setMapStyle("");
  // this.TheSmallMap && this.TheSmallMap.setMapStyle("");
}

/*删除点*/
TrafficView.prototype.removePoints = function () {
  if (this.MarkPoints) {
    this.TheMap.remove(this.MarkPoints);
    this.MarkPoints = [];
  }
}
TrafficView.prototype.drawPoints = function () {

}


TrafficView.prototype.drawRoads = function (paramters, nowTab) {
  this.nowTab = nowTab;
  if (!paramters) {
    console.log("道路参数不正确!");
    return;
  }
  // debugger
  for (var i = 0; i < this.RoadPaths.length; i++) {
    this.TheMap.remove(this.RoadPaths[i]);
  }
  this.RoadPaths = [];
  for (var i = 0; i < paramters.length; i++) {
    var theParamter = paramters[i];
    // debugger
    var theRoad = this.drawRoad(theParamter);
    this.RoadPaths.push(theRoad);

  }

  this.showRoads();
}

/**
 * 重点路段
 * @param paramters
 */
TrafficView.prototype.drawKeyRoad = function (paramters) {
  for (var i = 0; i < this.RoadPaths.length; i++) {
    this.TheMap.remove(this.RoadPaths[i]);
  }
  this.RoadPaths = [];
  // debugger
  var pathArray = [];
  for (var i = 0; i < paramters.length; i++) {
    var p = paramters[i].split(',');
    if (p.length < 2) {
      console.log('数据不对', p)
      continue
    }
    // console.log(p)
    var a = new AMap.LngLat(parseFloat(p[0]), parseFloat(p[1]));
    pathArray.push(a);
  }

  // debugger;
  var RoadPath = new AMap.Polyline({
    path: pathArray,
    strokeColor: "#a61dff",
    strokeOpacity: "0.6",
    strokeWeight: "6",
    strokeStyle: "solid",
    zIndex: 1000,
    strokeDasharray: [10, 5]
  });

  // this.TheMap.add(RoadPath);  // 不画线
  this.RoadPaths.push(RoadPath);
  this.showRoads();
};

TrafficView.prototype.drawLuDuan = function (paramter) {
  // debugger
  var theRoad = this.drawRoad(paramter);
  this.RoadPaths.push(theRoad);
  this.showRoads();

};
var RoadPath;
/**
 * 画站点的矩形
 * @param paramters
 */
TrafficView.prototype.drawTheRectangle = function (paramters) {
  for (var i = 0; i < this.RoadPaths.length; i++) {
    this.TheMap.remove(this.RoadPaths[i]);
  }
  this.RoadPaths = [];
  // debugger
  var pathArray = [];
  for (var i = 0; i < paramters.length; i++) {
    var p = paramters[i];
    if (p.length < 2) {
      console.log('数据不对', p);
      continue
    }
    // console.log(p)
    var a = new AMap.LngLat(p[0], p[1]);
    pathArray.push(a);
  }
  console.log('开始画线');
  // debugger;
  RoadPath = new AMap.Polygon ({
    path: pathArray,
    fillColor: '#4fbefc', // 多边形填充颜色
    strokeWeight: 10, // 线条宽度，默认为 1
    strokeColor: '#fff', // 线条颜色
    strokeOpacity: 1, // 线条透明度
    fillOpacity: 0,
    zIndex: 10010,
    // strokeDasharray: [10, 5]
    isOutline: true,
    borderWeight: 3,
  });
  RoadPath.setMap(theMap);
  // 缩放地图到合适的视野级别
  theMap.setFitView([ RoadPath ]);
  // this.TheMap.add(RoadPath);  // 不画线
  this.RoadPaths.push(RoadPath);
  // this.showRoads();
};

TrafficView.prototype.drawLuDuan = function (paramter) {
  // debugger
  var theRoad = this.drawRoad(paramter);
  this.RoadPaths.push(theRoad);
  this.showRoads();

}

// var idx = 0;
/*画路线*/
TrafficView.prototype.drawRoad = function (paramter) {
  if (!paramter) {
    console.log("道路参数不正确!");
    return;
  }
  var path = paramter;
  this.pArr = [];
  var me = this;
  // debugger
  var pathArray = [];
  for (var i = 0; i < path.length; i++) {
    var p = path[i].split(',');
    if (p.length < 2) {
      console.log('数据不对', p)
      continue
    }
    // console.log(p)
    var a = new AMap.LngLat(parseFloat(p[0]), parseFloat(p[1]));
    pathArray.push(a);
  }

  // debugger;
  var RoadPath = new AMap.Polyline({
    path: pathArray,
    strokeColor: "#a61dff",
    strokeOpacity: "0.6",
    strokeWeight: "6",
    strokeStyle: "solid",
    zIndex: 1000,
    strokeDasharray: [10, 5]
  });


  // debugger
  //   this.TheMap.add(RoadPath);
  // idx++;
  // console.log(idx)

  // if (this.nowTab === '高速') {
  // console.log(1111)
  // this.TheMap.add(RoadPath);
  // }

  //this.RoadPath.setPath(path);
  // this.drawStart(theStartPoint);
  // this.drawEnd(theEndPoint);
  return RoadPath;
}
/*画起始点*/
TrafficView.prototype.drawStart = function (point) {
  if (!this.StartPoint) {
    this.StartPoint = new AMap.Marker({
      position: point,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '',
      content: '<div class="' + this.StartPointCss + '">起始点</div>',
      extData: point//加入对象信息
    });
    this.TheMap.add(this.StartPoint);
  }
  this.StartPoint.setPosition(point);
}
/*画结束点*/
TrafficView.prototype.drawEnd = function (point) {
  if (!this.EndPoint) {
    this.EndPoint = new AMap.Marker({
      position: point,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '',
      content: '<div class="' + this.EndPointCss + '">终点</div>',
      extData: point//加入对象信息
    });
    this.TheMap.add(this.EndPoint);
  }
  this.EndPoint.setPosition(point);
}
/*显示路况*/
TrafficView.prototype.showRoads = function () {

  this.hidePoints();
  if (this.StartPoint) {
    this.StartPoint.show();
  }
  if (this.EndPoint) {
    this.EndPoint.show();
  }
  if (this.RoadPaths) {
    for (var i = 0; i < this.RoadPaths.length; i++) {
      this.RoadPaths[i].show();
    }
    // console.log(this.RoadPaths)
    // debugger
    // this.TheMap.setFitView();
    this.TheMap.setFitView(this.RoadPaths);

  }

  // map.setFitView([polyline,marker1]);
}

//1543470480000
/*隐藏路况*/
TrafficView.prototype.hideRoads = function () {
  if (this.StartPoint) {
    this.StartPoint.hide();
  }
  if (this.EndPoint) {
    this.EndPoint.hide();
  }
  if (this.RoadPath) {
    if (this.RoadPaths) {
      for (var i = 0; i < this.RoadPaths.length; i++) {
        debugger
        this.RoadPaths[i].hide();
      }
    }
  }
}
/*显示交通状态点*/
TrafficView.prototype.showPoints = function () {
  if (this.MarkPoints && this.MarkPoints.length > 0) {
    for (var i = 0; i < this.MarkPoints.length; i++) {
      var thePoint = this.MarkPoints[i];
      thePoint.show();
    }
    this.TheMap.setFitView();
  }
}

/*隐藏交通状态点*/
TrafficView.prototype.hidePoints = function () {
  if (this.MarkPoints && this.MarkPoints.length > 0) {
    for (var i = 0; i < this.MarkPoints.length; i++) {
      var thePoint = this.MarkPoints[i];
      thePoint.hide();
    }
  }
}
/*删除实例*/
TrafficView.prototype.destory = function () {
  if (this.TheMap) {
    if (this.MarkPoints && this.MarkPoints.length > 0) {
      this.TheMap.remove(this.MarkPoints);
      this.MarkPoints = [];
    }
    if (this.StartPoint) {
      this.TheMap.remove(this.StartPoint);
    }
    if (this.EndPoint) {
      this.TheMap.remove(this.EndPoint);
    }
    if (this.RoadPaths) {
      for (var i = 0; i < this.RoadPaths.length; i++) {
        this.TheMap.remove(this.RoadPaths[i]);
      }
      this.RoadPaths = [];
    }
  }

}

// 清空高速路段
TrafficView.prototype.removePaths = function () {
  if (this.TheMap) {

    if (this.RoadPaths) {
      for (var i = 0; i < this.RoadPaths.length; i++) {
        this.TheMap.remove(this.RoadPaths[i]);
      }
      this.RoadPaths = [];
    }
  }

}
/*刷新表格数据*/
TrafficView.prototype.refreshTable = function (theJsonObj) {
  var theTableId = "#theTable";
  $(theTableId).find('tbody').empty();
  var getPoint = function (theTable) {
    if (theTable.index < 1.5) {
      return "green_point";
    } else if (theTable.index < 2) {
      return "yellow_point";
    }
    else if (theTable.index < 4) {
      return "red_point";
    }
    else {
      return "black_point";
    }
  }
  for (var i = 0; i < theJsonObj.tableData.length; i++) {
    var theTable = theJsonObj.tableData[i];
    theTable.id;//1002779
    theTable.index;//6.9
    theTable.length;//17412
    theTable.name;//"S303华南快速(天源路北侧)"
    theTable.dir;//"从S2广河高速到鸦岗大道"
    theTable.number;//1
    theTable.speed;//10.4
    theTable.travelTime;//100.2
    theTable.delayTime;//
    var theTempaltes =
      '<tr data-linecode="' + theTable.id + '">' +
      '<td>' + theTable.number + '</td>' +
      '<td>' + theTable.name + '<br>' + theTable.dir + '</td>' +
      '<td class="' + getPoint(theTable) + '">' +
      '<span>' + theTable.index + '</span></td>' +
      '<td>' + theTable.speed + '</td>' +
      '<td>' + theTable.travelTime + '</td>' +
      '<td>' + theTable.delayTime + '</td></tr>';
    var theRow = $(theTempaltes);
    var me = this;
    $(theRow).click(function () {
      var id = $(this).data('linecode');
      me.drawRoadById(id);
    });
    $(theTableId).find('tbody').append(theRow);
  }
}
/*加载数据*/
TrafficView.prototype.loadData = function (theJsonObj) {

  if (!theJsonObj || !theJsonObj.tableData) {
    console.log("无可用数据加载!");
    return;
  }
  this.refreshTable(theJsonObj);
  this.removePoints();
  var me = this;
  var getPoint = function (theTable) {
    if (theTable.index < 1.5) {
      return me.TrafficPointCss[0];
    } else if (theTable.index < 2) {
      return me.TrafficPointCss[1];
    }
    else if (theTable.index < 4) {
      return me.TrafficPointCss[2];
    }
    else {
      return me.TrafficPointCss[3];
    }
  }
  for (var i = 0; i < theJsonObj.tableData.length; i++) {
    var theTable = theJsonObj.tableData[i];
    var thePoint = theTable.coords[0];
    var theMarkPoint = new AMap.LngLat(thePoint.lon, thePoint.lat);
    //debugger;
    var theMarker = new AMap.Marker({
      position: theMarkPoint,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: theTable.name,
      content: '<div class="' + (getPoint(theTable) + i) + '"></div>',
      extData: theTable//加入对象信息
    });
    var me = this;
    theMarker.on('click', function (arg) {
      var theData = arg.target.getExtData();
      me.drawRoad(theData);
    });
    this.TheMap.add(theMarker);
    this.MarkPoints.push(theMarker)
  }
  this.showPoints();
};
/*刷新数据*/
TrafficView.prototype.refresh = function (theJsonObj) {
  this.loadData(theJsonObj);
};