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
    var theMapStyle2 = 'amap://styles/b3469a25a850118cc6ac651282c9b5a7';
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
            // viewMode: '3D',// 地图模式
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
                // console.log('theBigBounds',theBigBounds);

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
                // console.log()
                // debugger
                if (me.isGaoSuLuWang) {
                    theMap.setFeatures(['bg', 'road']);
                }
                else {
                    // debugger
                    theMap.setFeatures(['bg', 'building', 'point', 'road']);
                    // theMap.add(roadNet);
                    // theMap.add(traffic);
                    theMap.add(building);
                }

                theMap.setPitch(45);
                theInnerLayer && theInnerLayer.setzIndex(1000);
                //theMap.add(satellite);
                //theMap.setMapStyle("normal");

            }
            else {
                console.log("隐藏点");
                if (me.isGaoSuLuWang) {
                    theMap.setFeatures(['bg', 'road']);

                } else {
                    theMap.setFeatures(['bg']);

                }

                //theHeartLayer && theHeartLayer.setMap(null);
                theHeartLayer && theHeartLayer.remove();
                theHeartLayer = null;
                // theMap.setFeatures(['bg', 'building']);
                theMap.remove(roadNet);
                theMap.remove(building);
                // theMap.remove(traffic);
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
                // console.log(theBuilding)
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
                            me.drawReli(theLnt.lng, theLnt.lat);  // 热力图

                        }).appendTo($('#DivButton'));
                        console.log(theFloors[i]);
                        //开始显示楼层
                        //theBuilding.showFloor();
                    }

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
        this.isGaoSuLuWang = false;
        this.hideOtherProvince(false);
        theMap.setMapStyle(theDefaultMapStyle);
        theMap2.setMapStyle(theDefaultMapStyle);
        theMap.remove(traffic);
        theMap.remove(roadNet);
    };
    /**
     * 设置为 高速路网样式
     */
    MapBase.prototype.setTrafficStyle = function () {
        // theMap.setMapStyle('');
        // theMap2.setMapStyle('');
        this.isGaoSuLuWang = true;
        this.hideOtherProvince(true);

        theMap.remove(traffic);
        theMap.remove(roadNet);

        theMap.add(traffic);
        // theMap.add(roadNet);
        theMap.setMapStyle(theMapStyle2);

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

    MapBase.prototype.hideOtherProvince = function (status) {

        if (!this.provinceLayer) {
            var thePaths = theGdProvincePath.map(function (m) {
                return [m.lng, m.lat];
            });
            var thePath2 = [
                [-180, -90],
                [-180, 90],
                [180, 90],
                [180, -90],
                [-180, -90]
            ];
            // debugger;
            this.provinceLayer = new AMap.Polygon({
                map: theMap,
                //strokeWeight: 10,
                fillColor: '#132c58',
                fillOpacity: 1,
                //strokeColor:'green',

                path: [thePath2, thePaths]
            });
        }
        if (!status) {
            this.provinceLayer.hide();
        }
        else {
            this.provinceLayer.show();
            //theMap.setFitView(this.provinceLayer);
        }
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

    MapBase.prototype.showRoad = function () {
        // var thePoint = new AMap.LngLat(lng, lat);
        // theMap.panTo(thePoint);
        theMap.add(traffic);

    }

    MapBase.prototype.CreateHeartLayer = function () {
        if (!theHeartLayer) {
            var map = Loca.create(theMap);
            theHeartLayer = Loca.visualLayer({
                container: map,
                type: 'heatmap',
                // 基本热力图
                shape: 'normal',
                zIndex: 10001
            });
            theHeartLayer.setZIndex(10001);
        }
    }


    MapBase.prototype.drawReli = function (name, data) {
        var theAreaPath = {
            '深圳北':
                [[114.0286, 22.608196], [114.027709, 22.609159], [114.029178, 22.610417], [114.02955, 22.610698], [114.030455, 22.609765]],
            '广州南':
                [[113.26794, 22.987108], [113.26713, 22.988296], [113.270557, 22.990331], [113.271209, 22.989086], [113.269443, 22.987991]],
            '白云机场':
                [[113.301301, 23.385968], [113.301723, 23.387568], [113.304613, 23.386954], [113.304136, 23.385315]],
            '宝安机场':
                [[113.811961, 22.623893], [113.811513, 22.624723], [113.812374, 22.625131], [113.813637, 22.625844], [113.814257, 22.626182], [113.814571, 22.62592], [113.814919, 22.625322]],
            '广州站':
                [[113.256631, 23.148886], [113.256898, 23.149427], [113.25737, 23.149234], [113.259263, 23.148291], [113.258991, 23.147797]],

            '广州站广场':
                [[113.257712, 23.148006], [113.257435, 23.147872], [113.25721, 23.147558], [113.257028, 23.147511], [113.25695, 23.147561], [113.256622, 23.14829], [113.256618, 23.14858], [113.256697, 23.148751], [113.257154, 23.148542], [113.258192, 23.148094], [113.258907, 23.147809], [113.258765, 23.147579]],


        };
        this.CreateHeartLayer();
        value = data || 1000;
        var path = theAreaPath[name];
        if (!path) {
            console.log("未找到对应的范围");
            return;
        }
        var thePorints = path;
        var lngs = thePorints.map(function (item) {
            return item[0];
        });
        var lats = thePorints.map(function (item) {
            return item[1];
        });

        var minLngs = lngs.min();
        var maxLngs = lngs.max();
        var minLats = lats.min();
        var maxLats = lats.max();


        var theValidPoints = [];
        for (var i = 0; i < 1000; i++) {
            var thePoint = Math.RandomPoint(minLngs, maxLngs, minLats, maxLats);
            if (AMap.GeometryUtil.isPointInRing(thePoint, thePorints)) {
                theValidPoints.push(thePoint);
            }
        }
        var layer = theHeartLayer;

        var theCurrentValue = value;
        var theShowList = [];
        var list = theValidPoints.map(function (item) {
            var theTempValue = 0;
            if (theCurrentValue <= 10) {
                theTempValue = theCurrentValue;
            }
            else {
                theTempValue = Math.floor(Math.RandomRange(1, 10));
            }
            theCurrentValue -= theTempValue;
            if (theTempValue > 0) {
                theShowList.push({
                    coordinate: [item[0], item[1]],
                    count: Math.floor(theTempValue)
                });
            }

        })
        layer.setData(theShowList, {
            lnglat: 'coordinate',
            value: 'count'
        });

        layer.setOptions({
            style: {
                radius: 10,
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
