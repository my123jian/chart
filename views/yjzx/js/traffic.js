//https://report.amap.com/ajax/roadRank.do?roadType=1&timeType=0&cityCode=440100 得到点数据
//https://report.amap.com/ajax/roadDetail.do?roadType=1&timeType=0&cityCode=440100&lineCode=4391 得到详情数据
/*高速路网展示*/

function TrafficView(map,samllmap) {
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
    this.RoadPath = null;
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
    this.TheSmallMap = samllmap;
    this.TheMap.setMapStyle("");
    this.TheSmallMap && this.TheSmallMap.setMapStyle("");
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
/*画路段通过ID*/
TrafficView.prototype.drawRoadById = function (id) {
    if (this.MarkPoints && this.MarkPoints.length > 0) {
        for (var i = 0; i < this.MarkPoints.length; i++) {
            var thePoint = this.MarkPoints[i];
            var theData = thePoint.getExtData();
            if (theData.id == id) {
                this.drawRoad(theData);
                break;
            }
        }
    }
}
/*画路线*/
TrafficView.prototype.drawRoad = function (paramter) {
    if (!paramter) {
        console.log("道路参数不正确!");
        return;
    }
    var path = paramter.coords;
    var pathArray = [];
    for (var i = 0; i < path.length; i++) {
        var thePoint = path[i];
        pathArray.push(new AMap.LngLat(thePoint.lon, thePoint.lat));
    }
    path = pathArray;
    var theStartPoint = path[0];
    var theEndPoint = path[path.length - 1];
    //删除路径重新绘制
    if (this.RoadPath) {
        this.TheMap.remove(this.RoadPath);
    }
    debugger;
    this.RoadPath = new AMap.Polyline({
        path: path,
        strokeColor: "#9933ff",
        strokeOpacity: "0.6",
        strokeWeight: "6",
        strokeStyle: "solid",
        strokeDasharray: [10, 5]
    });
    this.TheMap.add(this.RoadPath);
    //this.RoadPath.setPath(path);
    this.drawStart(theStartPoint);
    this.drawEnd(theEndPoint);
    this.showRoad();
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
TrafficView.prototype.showRoad = function () {
   
    this.hidePoints();
    if (this.StartPoint) {
        this.StartPoint.show();
    }
    if (this.EndPoint) {
        this.EndPoint.show();
    }
    if (this.RoadPath) {
        this.RoadPath.show();
    }
    this.TheMap.setFitView();
}

//1543470480000
/*隐藏路况*/
TrafficView.prototype.hideRoad = function () {
    if (this.StartPoint) {
        this.StartPoint.hide();
    }
    if (this.EndPoint) {
        this.EndPoint.hide();
    }
    if (this.RoadPath) {
        this.RoadPath.hide();
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
        if (this.RoadPath) {
            this.TheMap.remove(this.RoadPath);
        }
    }

}
/*刷新表格数据*/
TrafficView.prototype.refreshTable = function (theJsonObj) {
    var theTableId = "#theTable";
    $(theTableId).find('tbody').empty();
    var getPoint=function(theTable){
        if (theTable.index<1.5){
            return "green_point";
        }else if(theTable.index<2){
            return "yellow_point";
        }
        else if(theTable.index<4){
            return "red_point";
        }
        else{
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
            content: '<div class="' + (getPoint(theTable)+i) + '"></div>',
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