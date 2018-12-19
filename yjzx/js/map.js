$(function () {
    //最大的缩放程度
    var theMaxZoom = 18;
    var overView;
//现在的缩放程度
    var theCurrentZoom = 1;
    var theMarks = [];
    var theMaxLevel = 18;
    //默认的地图中心
    var theCenterPoint = [113.275824, 22.994826];
//卫星地图
    var satellite = new AMap.TileLayer.Satellite();
//道路地图
    var roadNet = new AMap.TileLayer.RoadNet();
//3D建筑地图
    var building = new AMap.Buildings({
        zooms: [16, 18],
        zIndex: 100,
        heightFactor: 2//2倍于默认高度，3D下有效
    });
//实时交通地图
    var traffic = new AMap.TileLayer.Traffic({
        'autoRefresh': true,     //是否自动刷新，默认为false
        'interval': 180,         //刷新间隔，默认180s
    });
    var theDefaultMapStyle = 'amap://styles/9f47a75c5a80f716945988ccbc61aeb7';
//
    var theMakerLayer = null;
//室内地图层
    var theInnerLayer = null;
//热力图地图层
    var theHeartLayer = null;
    var theMap = null;
    var theMap2 = null;



    function floorBindClick() {
        var floors = $('#DivButton div');
        for (var i = 0; i < floors.length; i++) {
            var f = floors[i];
            $(f).on('click', function () {
                for (var j = 0; j < floors.length; j++) {
                    var f = floors[j];
                    $(f).removeClass('active');
                }

                $(this).addClass('active')
            })
        }
    }

    function MapBase() {
        var me = this;
//创建地图实例
        theMap = new AMap.Map('container', {
            pitch: 0,
            mapStyle: theDefaultMapStyle,
            viewMode: '3D',// 地图模式
            center: theCenterPoint,
            features: ['bg', 'building', 'point'],//['all'],// ['bg', 'building','point'],
            zoom: 8,
            keyboardEnable: false,
            layers: [
                //satellite,
                // building,
                //roadNet
            ]
        });
        window.theMap = theMap;
// 模拟鹰眼
        theMap2 = new AMap.Map('container2', {
            mapStyle: theDefaultMapStyle,
            center: theCenterPoint,
            //features: ['bg', 'building'],
            zoom: 5,
            dragEnable: false,
            zoomEnable: true,
            scrollWheel: false,
            doubleClickZoom: false,
            keyboardEnable: false,
            layers: [
                //disCountry,
                //indoorMap,
                //innerRoom
                // satellite,
                // building
                // object3Dlayer
                //roadNet
            ]
        });
        AMap.plugin('AMap.DistrictSearch', function () {
            // 创建行政区查询对象
            var district = new AMap.DistrictSearch({
                // 返回行政区边界坐标等具体信息
                extensions: 'all',
                // 设置查询行政区级别为 区
                level: 'province'
            });

            district.search('广东省', function (status, result) {
                // 获取朝阳区的边界信息
                var bounds = result.districtList[0].boundaries
                if (!bounds) {
                    console.log("未获取到数据!");
                    return;
                }

                var theBigBounds = null;
                window.theMap = theMap;
                for (var i = 0, l = bounds.length; i < l; i++) {

                    var theBound = bounds[i];
                    var polygon = {};

                    if (theBound.length >= 10000) {
                        theBigBounds = theBound;
                    }

                }
                me.showLine(theBigBounds, theMap, theMap2);

            })
        });
        this.initEvent();
      //  标注城市
      var theCitys = {
        "广州市": "113.264385,23.129112",
        "深圳市": "114.085947,22.547",
        "珠海市": "113.553986,22.224979",
        "汕头市": "116.708463,23.37102",
        "佛山市": "113.122717,23.028762",
        "韶关市": "113.597313,24.811094",
        "河源市": "114.697802,23.746266",
        "梅州市": "116.117582,24.299112",
        "惠州市": "114.412599,23.079404",
        "汕尾市": "115.364238,22.774485",
        "东莞市": "113.746262,23.046237",
        "中山市": "113.382391,22.521113",
        "江门市": "113.094942,22.590431",
        "阳江市": "111.982697,21.857415",
        "湛江市": "110.364977,21.274898",
        "茂名市": "110.919229,21.659751",
        "肇庆市": "112.472529,23.051546",
        "清远市": "113.051227,23.685022",
        "潮州市": "116.632301,23.661701",
        "揭阳市": "116.355733,23.543778",
        "云浮市": "112.044439,22.929801"
      };
      for (var theCityName in theCitys) {
        var thelngLat = theCitys[theCityName];
        var thelngLats = thelngLat.split(',');
        var marker = new AMap.Marker({
          position: new AMap.LngLat(parseFloat(thelngLats[0]), parseFloat(thelngLats[1])),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: theCityName,
          content: '<div style="color:white;width: 3em;font-size:20px;font-weight:bold">' + theCityName + '</div>'
        });
        theMap.add(marker);
      }


      var thePoints = {
//    "广州南站": {"latitude": 22.9874720000, "longitude": 113.2685860000, "type": "铁路", 'icon': 'tielu3.png'},
        // "深圳火车站": { "latitude": 22.5319900000, "longitude": 114.1176800000 },
//    "深圳北站": {"latitude": 22.6097250000, "longitude": 114.0291130000, "type": "铁路", 'icon': 'tielu3.png'},
        //"广州东站": { "latitude": 23.1505660000, "longitude": 113.3249000000 },
        //"广州火车站": { "latitude": 23.1494150000, "longitude": 113.2572910000 },
        //"广州北站": { "latitude": 23.3774050000, "longitude": 113.2037940000 },
        //"深圳西站": { "latitude": 22.5275730000, "longitude": 113.9073060000 },
        //"深圳东站": { "latitude": 22.6019860000, "longitude": 114.1199340000 },
//    "珠海站": {"latitude": 22.2153960000, "longitude": 113.5496410000, "type": "铁路", 'icon': 'tielu3.png'},
        //"白云国际机场": { "latitude": 23.3896270000, "longitude": 113.3076480000 },
//    "白云国际机场": {"latitude": 23.396544, "longitude": 113.306199, "type": "民航", 'maxLevel': 17, 'icon': 'feiji3.png'},
        //"宝安国际机场": { "latitude": 22.6333600000, "longitude": 113.8145490000 },
//    "宝安国际机场": {"latitude": 22.62506, "longitude": 113.812809, "type": "民航", 'icon': 'feiji3.png'},
        //"珠海金湾国际机场": { "latitude": 22.0057560000, "longitude": 113.3819450000 },
        //"揭阳潮汕国际机场": { "latitude": 23.5463610000, "longitude": 116.5092740000 }
      };

      for (var theCityName in thePoints) {
        var thelngLat = thePoints[theCityName];
//    debugger;
        var marker = new AMap.Marker({
          position: new AMap.LngLat(thelngLat.longitude, thelngLat.latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: theCityName,
          content: '<div style="color:white;width: 3em;font-size:14px">' + theCityName + '</div>'
        });
        theMap.add(marker);
      }

    }

    MapBase.prototype.initEvent = function () {
        this.initMapEvent();
        this.initMap2Event();
    }
    /**
     * 初始化大图事件
     */
    MapBase.prototype.initMapEvent = function () {
        var me = this;
        theMap.on("moveend", function () {
            //theMap2.off('moveend');
            theMap2.setCenter(theMap.getCenter());
        });

        theMap.on('zoomend', function () {
            var theZoom = theMap.getZoom();
            var theMinZoom = 3;
            var theCurrentZoom = theZoom - 3;
            if (theCurrentZoom < theMinZoom) {
                theCurrentZoom = theMinZoom;
            }
            //debugger;
            theMap2.setZoom(theCurrentZoom);
        });

        AMap.plugin(['AMap.IndoorMap', 'AMap.OverView'], function () {
            var indoorMap = new AMap.IndoorMap({alwaysShow: true});
            theMap.add(indoorMap);

            // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
            var OVOption = {
                isOpen: true
            };
            overView = new AMap.OverView(OVOption);
            // theMap.addControl(overView);
            // overView.hide()
        });
//地图加载完成事件
        theMap.on('complete', function () {
            console.log("地图加载完成!");
            //获取
            // var ambientLight = theMap.AmbientLight;   //获取环境光
            // var directionLight = theMap.DirectionLight; //获取平行光
            //修改
            // theMap.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
            //  theMap.DirectionLight = new AMap.Lights.DirectionLight([-6, -2, 14], [1, 1, 1], 0.5);
        });
//监听放大缩小事件
        theMap.on('zoom', function (arg) {
            var theZoom = theMap.getZoom();
            if (theZoom >= 17) {
                $('#container2').hide()
            } else {
                $('#container2').show()

            }
            if (theZoom >= 12) {
                // console.log("显示点");
                theMap.setFeatures(['bg', 'building', 'point']);
                theMap.add(roadNet);
                theMap.add(building);
                theMap.setPitch(45);
                theInnerLayer && theInnerLayer.setzIndex(1000);
                //theMap.add(satellite);
                //theMap.setMapStyle("normal");

            }
            else {
                console.log("隐藏点");
                //theHeartLayer && theHeartLayer.setMap(null);
                theHeartLayer && theHeartLayer.remove();
                theHeartLayer = null;
                // theMap.setFeatures(['bg', 'building']);
                theMap.remove(roadNet);
                theMap.remove(building);
                //theMap.remove(satellite);
                theMap.setPitch(0);
                //theMap.setMapStyle("amap://styles/grey");
            }
            if (!theMakerLayer) {
                return;
            }
            if (!theMakerLayer['show']) {
                return;
            }
            if (theZoom >= 10) {
                theMakerLayer.hide();
            }
            else {
                theMakerLayer.show();
            }
        });
        var theLayers = theMap.getLayers();
        for (var i = 0; i < theLayers.length; i++) {
            var theLayer = theLayers[i];
            if (theLayer.CLASS_NAME == 'AMap.IndoorMap') {
                console.log("找到室内图");
                theLayer.hideFloorBar();
                theInnerLayer = theLayer;

                theInnerLayer.off('complete');
                //theInnerLayer.off('floor_complete');
                theInnerLayer.on('click', function () {

                });

            }
        }
        theInnerLayer && theInnerLayer.on('complete', function (arg) {
            console.log('室内图层加载完!');
            //debugger;
            var theBuilding = null;
            setInterval(function () {
                var theZoom = theMap.getZoom();
                if (theZoom < 16) {
                    theBuilding = null;
                    $('#DivButton').empty();
                    return;
                }
                var theLastBuilding = theBuilding;
                theBuilding = theInnerLayer.getSelectedBuilding();
                if (theBuilding != theLastBuilding) {

                    if (!theBuilding) {
                        console.log('未找到建筑物!');
                        return;
                    }
                    //找到图层了
                    console.log('jiazaiwancheng@!1');
                    $('#DivButton').empty();
                    //floor_complete
                    var theFloors = theBuilding.floor_details.floor_nonas;
                    var theFloorIndex = theBuilding.floor_details.floor_indexs;
                    for (var i = 0; i < theFloors.length; i++) {
                        var theName = theFloors[i];
                        var theIndex = theFloorIndex[i];
                        $('<div data-index=' + theIndex + '>' + theName + '</div>').click(function () {
                            var theCurrentIndex = $(this).data('index');
                            theInnerLayer.showFloor(theCurrentIndex);
                            var theCurrentBuild = theInnerLayer.getSelectedBuilding();
                            var theLnt = theCurrentBuild.lnglat;
                            me.drawReli(theLnt.lng, theLnt.lat);

                        }).appendTo($('#DivButton'));
                        console.log(theFloors[i]);
                        //开始显示楼层
                        //theBuilding.showFloor();
                    }
                    ;
                    floorBindClick();
                }
            }, 500);
        });
    }
    /**
     * 初始化小图事件
     */
    MapBase.prototype.initMap2Event = function () {
        var theLastpoint;
        var yingYan = $('#yingyan');
        theMap2.on("mousedown", function (arg) {
            //theMap2.off('moveend');
            // theMap2.setCenter(theMap.getCenter())
            // ;
            theLastpoint = {x: arg.pixel.x, y: arg.pixel.y};

            theMap2.on('mousemove', function (arg) {

                if (theLastpoint) {
                    var theCurrentpoint = {x: arg.pixel.x, y: arg.pixel.y};

                    var theX = theCurrentpoint.x - theLastpoint.x;
                    var theY = theCurrentpoint.y - theLastpoint.y;
                    // console.log(theX,theY)
                    if (theX == 0 && theY == 0) {
                        return;
                    }

                    yingYan[0].style.top = yingYan.position().top + theY + 'px';
                    yingYan[0].style.left = yingYan.position().left + theX + 'px';

                    theLastpoint = theCurrentpoint;
                }

            });
        });
        theMap2.on("mouseup", function (arg) {
            //theMap2.off('moveend');
            // theMap2.setCenter(theMap.getCenter())
            // ;
            var lnglat = arg.lnglat;
            theMap.setCenter(lnglat);
            theMap2.setCenter(lnglat);
            theLastpoint = null;
            yingYan[0].style.top = '100px';
            yingYan[0].style.left = '100px';

        });
    }
    /**
     * 设置地图为默认样式
     */
    MapBase.prototype.restoreDefaultStyle = function () {
        theMap.setMapStyle(theDefaultMapStyle);
        theMap2.setMapStyle(theDefaultMapStyle);
    };
    /**
     * 设置为 高速路网样式
     */
    MapBase.prototype.setTrafficStyle = function () {
        theMap.setMapStyle('');
        theMap2.setMapStyle('');
    }

    MapBase.prototype.showLine = function (thePaths, map, map2) {
        console.log("开始绘制线！");
        if (!thePaths) {
            console.log("未找到最大的轮廓");
            return;
        }
        var theIndex = 1;
        var thePoints = [];
        thePoints.push(thePaths[0]);
        console.log("开始执行");

        var theTimer = window.setInterval(function () {
            // console.log(theIndex);
            thePoints.push(thePaths[theIndex]);
            theIndex++;
            for (var j = 0; j < 500; j++) {
                if (theIndex < thePaths.length) {
                    thePoints.push(thePaths[theIndex]);
                    theIndex++;
                }
                else {
                    break;
                }
            }

            if (theIndex >= thePaths.length) {
                // debugger;
                window.clearInterval(theTimer);
                if (thePoints.length > 0) {
                    var polyline = new AMap.Polyline({
                        path: thePoints,
                        map: map,
                        //strokeWeight: 100,
                        borderWeight: 8, // 线条宽度，默认为 1
                        strokeColor: 'white'//, // 线条颜色
                        //lineJoin: 'round' // 折线拐点连接处样式
                    });
                    if (map2) {
                        new AMap.Polyline({
                            path: thePoints,
                            map: map2,
                            //strokeWeight: 100,
                            borderWeight: 8, // 线条宽度，默认为 1
                            strokeColor: 'white'//, // 线条颜色
                            //lineJoin: 'round' // 折线拐点连接处样式
                        });
                    }
                    thePoints = [];
                }
                console.log("绘图结束！");
                return;
            }
            if (thePoints.length > 10) {
                //debugger;
                var polyline = new AMap.Polyline({
                    path: thePoints,
                    map: map,
                    borderWeight: 2, // 线条宽度，默认为 1
                    strokeColor: 'white'//, // 线条颜色
                    //lineJoin: 'round' // 折线拐点连接处样式
                });
                if (map2) {
                    new AMap.Polyline({
                        path: thePoints,
                        map: map2,
                        borderWeight: 2, // 线条宽度，默认为 1
                        strokeColor: 'white'//, // 线条颜色
                        //lineJoin: 'round' // 折线拐点连接处样式
                    });
                }
                var theLastPoint = thePoints[thePoints.length - 1];
                thePoints = [];
                thePoints.push(theLastPoint);

                // console.log("开始绘制线！");
            }

        }, 1);


    };


//开始导航到指定点
    MapBase.prototype.MoveToPoint = function (lntlat, maxZoom) {
        console.log("开始导航到指定点!");
        var theZoom = theMap.getZoom();
        var thePitchTimer = window.setInterval(function () {
            if (theZoom > maxZoom) {
                window.clearInterval(thePitchTimer);
                theMap.setPitch(45);
                console.log("结束导航到指定点!");
                return;
            }
            theMap.setZoomAndCenter(theZoom++, lntlat);
        }, 10);
        theMap.off('indoor_create');
        theMap.on('indoor_create', function (arg) {
        })
    }

//结束导航到指定点
    MapBase.prototype.ReturnDefualt = function (defaultZoom, lntlat) {
        console.log("开始导航到该蓝图!");
        var theZoom = theMap.getZoom();
        defaultZoom = defaultZoom || 7;
        var lntlat = lntlat || new AMap.LngLat(113.275824, 22.994826)
        var thePitchTimer = window.setInterval(function () {
            if (theZoom < defaultZoom || theZoom <= 1) {
                window.clearInterval(thePitchTimer);
                console.log("结束导航到该蓝图!");
                theMap.setPitch(0);
                return;
            }
            theMap.setZoomAndCenter(theZoom--, lntlat);
        }, 10);
    }

    /**
     * 切换为2d模式
     * @constructor
     */
    MapBase.prototype.Switch2D = function () {
        var theValue = 45;
        var thePitch = theMap.getPitch();
        if (thePitch <= 0) {
            return;
        }
        var thePitchTimer = window.setInterval(function (me) {
            console.log("角度:" + theValue);
            if (theValue < 0) {
                window.clearInterval(thePitchTimer);
                return;
            }
            else {
                theMap.setPitch(theValue);
            }
            theValue = theValue - 1;
        }, 10);
    }
    /**
     * 切换为3的模式
     * @constructor
     */
    MapBase.prototype.Switch3D = function () {
        var theValue = 1;
        var thePitch = theMap.getPitch();
        if (thePitch >= 45) {
            return;
        }
        var thePitchTimer = window.setInterval(function (me) {
            console.log("角度:" + theValue);
            if (theValue > 45) {
                window.clearInterval(thePitchTimer);
                return;
            }
            else {
                theMap.setPitch(theValue);
            }
            theValue = theValue + 1;
        }, 10);
    }

    MapBase.prototype.SwitchView = function (viewName) {
        this.ReturnDefualt();
        // ShowMark(viewName);
        theMap.remove(traffic);
        if (viewName == "公路") {
            theMap.add(traffic);
            this.Switch2D();
            theMap.setFeatures(['bg', 'building', 'point']);
            // AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
            //
            //   //图层切换控件
            //   theMap.addControl(new BasicControl.LayerSwitcher({
            //     position: 'rt'
            //   }));
            // });
            theMap.remove(satellite);
        }
        else {
            //Switch3D();
            theMap.setFeatures(['bg', 'building']);
            theMap.clearControl();
            theMap.add(satellite);
            theMap.remove(traffic);
        }
    }

    MapBase.prototype.moveTo = function (lng, lat) {
        var thePoint = new AMap.LngLat(lng, lat);
        theMap.panTo(thePoint);

    }

    MapBase.prototype.CreateHeartLayer = function () {
        if (!theHeartLayer) {
            var map = Loca.create(theMap);
            theHeartLayer = Loca.visualLayer({
                container: map,
                type: 'heatmap',
                // 基本热力图
                shape: 'normal'
            });
        }
    }


    MapBase.prototype.drawReli = function (lng, lat, data) {
        this.CreateHeartLayer();
        lng = lng || 113.23;
        lat = lat || 23.16;
        var theValue = Math.floor((Math.random() * 10));
        layer = theHeartLayer;
        var list = [];
        var i = -1, length = 400;
        while (++i < length) {
            //var item = heatmapData[i + theValue];
            //i = i + theValue;

            list.push({
                coordinate: [lng + Math.random() / 1000, lat + Math.random() / 1000],
                count: Math.floor((Math.random() * 100))
            })
        }

        layer.setData(list, {
            lnglat: 'coordinate',
            value: 'count'
        });

        layer.setOptions({
            style: {
                radius: 30,
                color: {
                    0.5: '#2c7bb6',
                    0.65: '#abd9e9',
                    0.7: '#ffffbf',
                    0.9: '#fde468',
                    1.0: '#d7191c'
                }
            }
        });

        layer.render();
    }



    window.MapBase = MapBase;


});
