var traffic
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
    traffic = new AMap.TileLayer.Traffic({
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
//     var theHeartLayer = null;

    var theMap = null;
    var theMap2 = null;

    /**
     * 楼层切换绑定点击
     */
    function floorBindClick() {
        var floors = $('#DivButton div');

        for (var i = 0; i < floors.length; i++) {
            var f = floors[i];
            $(f).on('click', function () {
                //debugger;
                if (MapBase && MapBase.OnFloorClick) {
                    MapBase.OnFloorClick($(this).text());
                }
                for (var j = 0; j < floors.length; j++) {
                    var f = floors[j];
                    $(f).removeClass('active');
                }
                $(this).addClass('active');

            })
        }
    }

    function MapBase() {
        var me = this;
        this.theHeartLayer = null;
//创建地图实例
        theMap = new AMap.Map('container', {
            pitch: 0,
            mapStyle: theDefaultMapStyle,
            // viewMode: '3D',// 地图模式
            center: theCenterPoint,
            features: ['bg', 'building', 'point'],//['all'],// ['bg', 'building','point'],
            zoom: 8,
            expandZoomRange: true,  // 改变最大缩放等级
            zooms: [8, 18],  // 改变最大缩放等级
            keyboardEnable: false,
            layers: [
                //satellite,
                // building,
                //roadNet
            ]
        });
        window.theMap = theMap;
        theMap.plugin(["AMap.Heatmap"], function () {
            //初始化heatmap对象
            me.heartMap = new AMap.Heatmap(theMap, {
                radius: 10, //给定半径
                opacity: [0, 0.8]
            });
        });
        // AMap.plugin('AMap.DistrictSearch', function () {
        //   // 创建行政区查询对象
        //   var district = new AMap.DistrictSearch({
        //     // 返回行政区边界坐标等具体信息
        //     extensions: 'all',
        //     // 设置查询行政区级别为 区
        //     level: 'province'
        //   });
        //
        //   district.search('广东省', function (status, result) {
        //     // 获取朝阳区的边界信息
        //     var bounds = result.districtList[0].boundaries
        //     if (!bounds) {
        //       console.log("未获取到数据!");
        //       return;
        //     }
        //
        //     var theBigBounds = null;
        //     window.theMap = theMap;
        //     for (var i = 0, l = bounds.length; i < l; i++) {
        //
        //       var theBound = bounds[i];
        //       var polygon = {};
        //
        //       if (theBound.length >= 10000) {
        //         theBigBounds = theBound;
        //       }
        //
        //     }
        //     // console.log('theBigBounds',theBigBounds);
        //
        //
        //   })
        // });
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
    }
    MapBase.prototype.setBg = function () {
        theMap.setFeatures(['bg']);
    }
    MapBase.prototype.setBgRoadPoint = function () {
        // debugger
        theMap.setFeatures(['bg', 'point']);
    }
    MapBase.prototype.removeHeartMap = function () {
        if (this.theHeartLayer) {
            this.theHeartLayer.remove();
        }
        this.theHeartLayer = null;
    }
    /**
     * 初始化大图事件
     */
    MapBase.prototype.initMapEvent = function () {
        var me = this;
        theMap.on("moveend", function () {
            //theMap2.off('moveend');
        });

        theMap.on('zoomend', function () {
            var theZoom = theMap.getZoom();
            var theMinZoom = 3;
            var theCurrentZoom = theZoom - 3;
            if (theCurrentZoom < theMinZoom) {
                theCurrentZoom = theMinZoom;
            }
            //debugger;
        });

        AMap.plugin(['AMap.IndoorMap', 'AMap.OverView'], function () {
            var indoorMap = new AMap.IndoorMap({alwaysShow: true, hideFloorBar: false});
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
        });
//监听放大缩小事件
//     theMap.on('zoom', function (arg) {
//       var theZoom = theMap.getZoom();
//       if (theZoom >= 14) {
//         $('#container2').hide()
//       } else {
//         // console.log(window.nowTab);
//         // if(window.nowTab!=='高速监测') {
//           $('#container2').show()
//         // }
//       }
//       if(window.nowTab==='高速监测') {
//         $('#container2').hide()
//       }
//       if (theZoom >= 12) {
//         // console.log("显示点");
//         // console.log()
//         // debugger
//         if (me.isGaoSuLuWang || me.isGaoSuLuDuan) {
//           // debugger
//           theMap.setFeatures(['bg', 'road','point']);
//         }
//         else {
//           // debugger
//           theMap.setFeatures(['bg', 'building', 'point', 'road']);
//           // theMap.add(roadNet);
//           // theMap.add(traffic);
//           theMap.add(building);
//         }
//
//         theMap.setPitch(45);
//         theInnerLayer && theInnerLayer.setzIndex(1000);
//         //theMap.add(satellite);
//         //theMap.setMapStyle("normal");
//
//       }
//       else {
//         // console.log("隐藏点");
//         if (me.isGaoSuLuWang || me.isGaoSuLuDuan) {
//           theMap.setFeatures(['bg']);
//           // console.log(1)
//
//         } else {
//           // console.log(2)
//           theMap.setFeatures(['bg']);
//
//         }
//
//         //theHeartLayer && theHeartLayer.setMap(null);
//         this.theHeartLayer && this.theHeartLayer.remove();
//         this.theHeartLayer = null;
//         // theMap.setFeatures(['bg', 'building']);
//         theMap.remove(roadNet);
//         theMap.remove(building);
//         // theMap.remove(traffic);
//         theMap.setPitch(0);
//         //theMap.setMapStyle("amap://styles/grey");
//       }
//       if (!theMakerLayer) {
//         return;
//       }
//       if (!theMakerLayer['show']) {
//         return;
//       }
//       if (theZoom >= 10) {
//         theMakerLayer.hide();
//       }
//       else {
//         theMakerLayer.show();
//       }
//     });
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

        theComp();
        // theInnerLayer && theInnerLayer.on('complete', function (arg) {
        //   console.log('室内图层加载完!');
        //   $('#DivButton').empty();
        //   //debugger;
        //   var theBuilding = null;
        //   setInterval(function () {
        //     var theZoom = theMap.getZoom();
        //     if (theZoom < 16) {
        //       theBuilding = null;
        //       $('#DivButton').empty();
        //       return;
        //     }
        //     var theLastBuilding = theBuilding;
        //     theBuilding = theInnerLayer.getSelectedBuilding();
        //     // console.log(theBuilding)
        //     if (theBuilding != theLastBuilding) {
        //
        //       if (!theBuilding) {
        //         console.log('未找到建筑物!');
        //         $('#DivButton').empty();
        //         return;
        //       }
        //       //找到图层了
        //       console.log('jiazaiwancheng@!1');
        //       $('#DivButton').empty();
        //       if(!MapBase.IsFloorVisible()){
        //         return;
        //       }
        //       //floor_complete
        //       var theFloors = theBuilding.floor_details.floor_nonas;
        //       var theFloorIndex = theBuilding.floor_details.floor_indexs;
        //
        //       for (var i = 0; i < theFloors.length; i++) {
        //         var theName = theFloors[i];
        //         var theIndex = theFloorIndex[i];
        //         $('<div data-index=' + theIndex + '>' + theName + '</div>').click(function () {
        //           var theCurrentIndex = $(this).data('index');
        //           theInnerLayer.showFloor(theCurrentIndex,true);
        //           var theCurrentBuild = theInnerLayer.getSelectedBuilding();
        //           var theLnt = theCurrentBuild.lnglat;
        //           // me.drawReli(theLnt.lng, theLnt.lat);  // 热力图
        //
        //         }).appendTo($('#DivButton'));
        //         console.log(theFloors[i]);
        //         //开始显示楼层
        //         //theBuilding.showFloor();
        //       }
        //
        //       floorBindClick();
        //     }
        //   }, 500);
        // });
    }

    // 不在楼层切换控件展示的楼层
    var theHideFloor = ['广州南站B2', '广州南站2F', '广州南站3A', '深圳北站-1F', '广州白云国际机场B1', '广州白云国际机场T1航站楼B1', '广州白云国际机场T1航站楼F4'];

    function theComp() {
        console.log('室内图层加载完!');
        $('#DivButton').empty();
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
            // debugger
            // console.log(theBuilding)
            if (theBuilding != theLastBuilding) {

                if (!theBuilding) {
                    console.log('未找到建筑物!');
                    $('#DivButton').empty();
                    return;
                }
                //找到图层了
                console.log('jiazaiwancheng@!1');
                $('#DivButton').empty();
                if (!MapBase.IsFloorVisible()) {
                    return;
                }
                //floor_complete
                var theFloors = theBuilding.floor_details.floor_nonas;
                var theFloorIndex = theBuilding.floor_details.floor_indexs;
                var buildingName = theBuilding.name;

                outer:
                    for (var i = 0; i < theFloors.length; i++) {
                        var theName = theFloors[i];
                        var theIndex = theFloorIndex[i];
                        var theFullName = buildingName + theName;
                        console.log(theIndex);
                        // debugger
                        for (var j = 0; j < theHideFloor.length; j++) {
                            var fName = theHideFloor[j];
                            if (theFullName === fName) {
                                continue outer
                            }
                        }

                        $('<div data-index=' + theIndex + '>' + theName + '</div>').click(function () {
                            var theCurrentIndex = $(this).data('index');
                            theInnerLayer.showFloor(theCurrentIndex, true);
                            var theCurrentBuild = theInnerLayer.getSelectedBuilding();
                            var theLnt = theCurrentBuild.lnglat;
                            // me.drawReli(theLnt.lng, theLnt.lat);  // 热力图

                        }).appendTo($('#DivButton'));
                        console.log(theFloors[i]);
                        //开始显示楼层
                        //theBuilding.showFloor();
                    }

                floorBindClick();
            }
        }, 500);
    }

    MapBase.prototype.hideReli = function () {
        this.theHeartLayer && this.theHeartLayer.remove();
        this.theHeartLayer = null;
    }

    /**
     * 设置地图为默认样式
     */
    MapBase.prototype.restoreDefaultStyle = function () {
        this.isGaoSuLuWang = false;
        this.hideOtherProvince(false);
        theMap.setMapStyle(theDefaultMapStyle);
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
        // theMap.setFeatures(['bg','road','point']);

    }
    /**
     * 设置为 高速路段样式
     */
    MapBase.prototype.setLuDuanStyle = function () {
        this.isGaoSuLuDuan = true;
        this.hideOtherProvince(true);
        theMap.remove(traffic);
        theMap.remove(roadNet);
        // debugger
        theMap.add(traffic);
        // theMap.add(roadNet);
        theMap.setMapStyle(theMapStyle2);
        // theMap.setFeatures(['bg','road']);

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
        // debugger
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
        console.log("返回默认视角!");
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
        if (!this.theHeartLayer) {
            var map = Loca.create(theMap);
            this.theHeartLayer = Loca.visualLayer({
                container: map,
                type: 'heatmap',
                // 基本热力图
                shape: 'normal',
            });
            this.theHeartLayer.setZIndex(1001)
        }
    }


    /**
     * 画热力图
     * @param name 名称
     * @param data 人数
     */
    MapBase.prototype.drawReli = function (name, data, floor) {
        console.log('开始画热力图:' + name);
        // debugger
        var placeArr = {
            '深圳北站':
                [[114.027401, 22.609051], [114.029644, 22.61097], [114.030969, 22.609622], [114.028711, 22.607709]],
            '深圳北站1-2F':
                [[114.027401, 22.609051], [114.029644, 22.61097], [114.030969, 22.609622], [114.028711, 22.607709]],
            // '深圳北站2F':
            //   [[114.027416,22.608908],[114.029792,22.610936],[114.03091,22.609765],[114.028504,22.607729]],
            '广州南站':
                [[113.26794, 22.987108], [113.26713, 22.988296], [113.270557, 22.990331], [113.271209, 22.989086], [113.269443, 22.987991]],
            '广州南站1F':
                [[113.26828, 22.986995], [113.268163, 22.986952], [113.267541, 22.987627], [113.267082, 22.988393], [113.267195, 22.988525], [113.266682, 22.989209], [113.269799, 22.991051], [113.270231, 22.990419], [113.270411, 22.990505], [113.271486, 22.988975], [113.271389, 22.988842], [113.271739, 22.988352], [113.268652, 22.986511]],
            '广州南站2F':
                [[113.26794, 22.987108], [113.26713, 22.988296], [113.270557, 22.990331], [113.271209, 22.989086], [113.269443, 22.987991]],
            '广州南站3F':
                [[113.26794, 22.987108], [113.26713, 22.988296], [113.270557, 22.990331], [113.271209, 22.989086], [113.269443, 22.987991]],
            '广州南站B1F':
                [[113.271222, 22.989669], [113.27068, 22.98948], [113.270667, 22.989374], [113.269427, 22.988628], [113.269025, 22.988433], [113.268428, 22.988095], [113.268351, 22.98802], [113.268163, 22.988254], [113.268315, 22.988288], [113.268842, 22.988592], [113.268814, 22.988688], [113.270668, 22.989767], [113.270588, 22.989893], [113.270932, 22.990064]],
            // '广州白云国际机场':
            //   [[113.301301,23.385968],[113.301723,23.387568],[113.304613,23.386954],[113.304136,23.385315]],
            '广州白云国际机场':
                [[113.30328, 23.385591], [113.301375, 23.385844], [113.301379, 23.386515], [113.300948, 23.386618], [113.300826, 23.383974], [113.300252, 23.383962], [113.300247, 23.38548], [113.300391, 23.386952], [113.300505, 23.388481], [113.301069, 23.391377], [113.301367, 23.391226], [113.301616, 23.39122], [113.300935, 23.38719], [113.301445, 23.386956], [113.301736, 23.387464], [113.303139, 23.387074], [113.304637, 23.386858], [113.304558, 23.386358], [113.305236, 23.386183], [113.306637, 23.390066], [113.307288, 23.389942], [113.306601, 23.387793], [113.305731, 23.385765], [113.304164, 23.382891], [113.303692, 23.383354], [113.304973, 23.385728], [113.304464, 23.385812], [113.304118, 23.385209]],
            '广州白云区机场-1F':
                [[113.30328, 23.385591], [113.301375, 23.385844], [113.301379, 23.386515], [113.300948, 23.386618], [113.300826, 23.383974], [113.300252, 23.383962], [113.300247, 23.38548], [113.300391, 23.386952], [113.300505, 23.388481], [113.301069, 23.391377], [113.301367, 23.391226], [113.301616, 23.39122], [113.300935, 23.38719], [113.301445, 23.386956], [113.301736, 23.387464], [113.303139, 23.387074], [113.304637, 23.386858], [113.304558, 23.386358], [113.305236, 23.386183], [113.306637, 23.390066], [113.307288, 23.389942], [113.306601, 23.387793], [113.305731, 23.385765], [113.304164, 23.382891], [113.303692, 23.383354], [113.304973, 23.385728], [113.304464, 23.385812], [113.304118, 23.385209]],
            '广州白云区机场-2F':
                [[113.30328, 23.385591], [113.301375, 23.385844], [113.301379, 23.386515], [113.300948, 23.386618], [113.300826, 23.383974], [113.300252, 23.383962], [113.300247, 23.38548], [113.300391, 23.386952], [113.300505, 23.388481], [113.301069, 23.391377], [113.301367, 23.391226], [113.301616, 23.39122], [113.300935, 23.38719], [113.301445, 23.386956], [113.301736, 23.387464], [113.303139, 23.387074], [113.304637, 23.386858], [113.304558, 23.386358], [113.305236, 23.386183], [113.306637, 23.390066], [113.307288, 23.389942], [113.306601, 23.387793], [113.305731, 23.385765], [113.304164, 23.382891], [113.303692, 23.383354], [113.304973, 23.385728], [113.304464, 23.385812], [113.304118, 23.385209]],
            '广州白云区机场-3F':
                [[113.30328, 23.385591], [113.301375, 23.385844], [113.301379, 23.386515], [113.300948, 23.386618], [113.300826, 23.383974], [113.300252, 23.383962], [113.300247, 23.38548], [113.300391, 23.386952], [113.300505, 23.388481], [113.301069, 23.391377], [113.301367, 23.391226], [113.301616, 23.39122], [113.300935, 23.38719], [113.301445, 23.386956], [113.301736, 23.387464], [113.303139, 23.387074], [113.304637, 23.386858], [113.304558, 23.386358], [113.305236, 23.386183], [113.306637, 23.390066], [113.307288, 23.389942], [113.306601, 23.387793], [113.305731, 23.385765], [113.304164, 23.382891], [113.303692, 23.383354], [113.304973, 23.385728], [113.304464, 23.385812], [113.304118, 23.385209]],
            '广州白云区机场-4F':
                [[113.30328, 23.385591], [113.301375, 23.385844], [113.301379, 23.386515], [113.300948, 23.386618], [113.300826, 23.383974], [113.300252, 23.383962], [113.300247, 23.38548], [113.300391, 23.386952], [113.300505, 23.388481], [113.301069, 23.391377], [113.301367, 23.391226], [113.301616, 23.39122], [113.300935, 23.38719], [113.301445, 23.386956], [113.301736, 23.387464], [113.303139, 23.387074], [113.304637, 23.386858], [113.304558, 23.386358], [113.305236, 23.386183], [113.306637, 23.390066], [113.307288, 23.389942], [113.306601, 23.387793], [113.305731, 23.385765], [113.304164, 23.382891], [113.303692, 23.383354], [113.304973, 23.385728], [113.304464, 23.385812], [113.304118, 23.385209]],
            '宝安国际机场':
                [[113.811961, 22.623893], [113.811513, 22.624723], [113.812374, 22.625131], [113.813637, 22.625844], [113.814257, 22.626182], [113.814571, 22.62592], [113.814919, 22.625322]],
            '深圳宝安国际机场': [[113.811934, 22.623741], [113.811516, 22.624528], [113.811399, 22.624749], [113.812259, 22.625371], [113.812065, 22.626119], [113.811818, 22.627034], [113.811177, 22.628423], [113.811537, 22.628545], [113.812854, 22.626706], [113.8144, 22.626297], [113.814651, 22.625908], [113.815, 22.625189], [113.813993, 22.624684]],
            // '深圳宝安国际机场4F':[[113.811951,22.623779],[113.811538,22.624522],[113.811241,22.624599],[113.811128,22.624854],[113.811942,22.625724],[113.812063,22.626083],[113.812008,22.626458],[113.811534,22.627721],[113.811194,22.628423],[113.811547,22.628495],[113.812466,22.62705],[113.812998,22.626506],[113.813365,22.626393],[113.814527,22.626506],[113.814622,22.626257],[113.814569,22.626012],[113.815007,22.625184]],
            // '深圳宝安国际机场5F':[[113.811455,22.624561],[113.811208,22.624669],[113.811088,22.624875],[113.81193,22.625699],[113.812188,22.625328],[113.812322,22.624961],[113.813857,22.62569],[113.813464,22.626366],[113.814459,22.626532],[113.814636,22.626245],[113.814565,22.625988]],
            // '深圳宝安国际机场3F':[[113.814558,22.626086],[113.814537,22.626316],[113.812866,22.626263],[113.812196,22.625892],[113.811493,22.625112],[113.811276,22.624859],[113.811428,22.624627],[113.810592,22.624144],[113.810512,22.624519],[113.810963,22.62501],[113.811891,22.625846],[113.812071,22.626211],[113.81192,22.626658],[113.811647,22.627523],[113.810528,22.629548],[113.810203,22.629629],[113.808005,22.628592],[113.807815,22.628929],[113.81009,22.630119],[113.81008,22.630352],[113.808928,22.632559],[113.809213,22.63272],[113.810368,22.630711],[113.810716,22.630356],[113.812991,22.63133],[113.813167,22.631036],[113.810914,22.629913],[113.810921,22.629683],[113.812279,22.627289],[113.812931,22.626549],[113.813339,22.626404],[113.815419,22.626604],[113.815692,22.626357],[113.814778,22.626099],[113.814565,22.625988]],
            // '深圳宝安国际机场2F':[[113.814526,22.626387],[113.812709,22.62626],[113.812706,22.625984],[113.813139,22.625577],[113.81331,22.625603],[113.813265,22.625762],[113.81436,22.626307],[113.814985,22.625192],[113.813352,22.624432],[113.811976,22.623745],[113.811439,22.624748],[113.812561,22.625284],[113.812666,22.625438],[113.81263,22.625804],[113.81238,22.626167],[113.812196,22.625892],[113.811493,22.625112],[113.811276,22.624859],[113.81094,22.624535],[113.810592,22.624144],[113.810512,22.624519],[113.810963,22.62501],[113.811891,22.625846],[113.812071,22.626211],[113.81192,22.626658],[113.811647,22.627523],[113.810528,22.629548],[113.810203,22.629629],[113.808005,22.628592],[113.807815,22.628929],[113.81009,22.630119],[113.81008,22.630352],[113.808928,22.632559],[113.809213,22.63272],[113.810368,22.630711],[113.810716,22.630356],[113.812991,22.63133],[113.813167,22.631036],[113.810914,22.629913],[113.810921,22.629683],[113.812279,22.627289],[113.812931,22.626549],[113.813339,22.626404],[113.815419,22.626604],[113.815692,22.626357],[113.815363,22.626449],[113.815019,22.62642]],
            // '深圳宝安国际机场1F':[[113.814526,22.626387],[113.812942,22.626091],[113.812706,22.625984],[113.813053,22.625761],[113.813161,22.625823],[113.813271,22.625897],[113.813139,22.625577],[113.813224,22.62559],[113.81329,22.62589],[113.81331,22.625603],[113.813299,22.625643],[113.813287,22.625682],[113.813265,22.625762],[113.813611,22.6253],[113.813363,22.625123],[113.81354,22.624874],[113.813696,22.624912],[113.813778,22.624796],[113.814988,22.625301],[113.814985,22.625192],[113.813352,22.624432],[113.811976,22.623745],[113.811836,22.623897],[113.813265,22.624583],[113.813049,22.624987],[113.812723,22.624845],[113.81233,22.625444],[113.81263,22.625804],[113.81238,22.626167],[113.812196,22.625892],[113.811493,22.625112],[113.811276,22.624859],[113.81094,22.624535],[113.810592,22.624144],[113.810512,22.624519],[113.810963,22.62501],[113.811891,22.625846],[113.812071,22.626211],[113.81192,22.626658],[113.811647,22.627523],[113.810528,22.629548],[113.810203,22.629629],[113.808005,22.628592],[113.807815,22.628929],[113.81009,22.630119],[113.81008,22.630352],[113.808928,22.632559],[113.809213,22.63272],[113.810368,22.630711],[113.810716,22.630356],[113.812991,22.63133],[113.813167,22.631036],[113.810914,22.629913],[113.810921,22.629683],[113.812279,22.627289],[113.812931,22.626549],[113.813339,22.626404],[113.815419,22.626604],[113.815692,22.626357],[113.815363,22.626449],[113.815019,22.62642]],
            '深圳宝安国际机场4-5F': [[113.811951, 22.623779], [113.811538, 22.624522], [113.811241, 22.624599], [113.811128, 22.624854], [113.811942, 22.625724], [113.812063, 22.626083], [113.812008, 22.626458], [113.811534, 22.627721], [113.811194, 22.628423], [113.811547, 22.628495], [113.812466, 22.62705], [113.812998, 22.626506], [113.813365, 22.626393], [113.814527, 22.626506], [113.814622, 22.626257], [113.814569, 22.626012], [113.815007, 22.625184]],
            // '深圳宝安国际机场5F':[[113.811455,22.624561],[113.811208,22.624669],[113.811088,22.624875],[113.81193,22.625699],[113.812188,22.625328],[113.812322,22.624961],[113.813857,22.62569],[113.813464,22.626366],[113.814459,22.626532],[113.814636,22.626245],[113.814565,22.625988]],
            '深圳宝安国际机场3F': [[113.811934, 22.623741], [113.811516, 22.624528], [113.811399, 22.624749], [113.812259, 22.625371], [113.812065, 22.626119], [113.811818, 22.627034], [113.811177, 22.628423], [113.811537, 22.628545], [113.812854, 22.626706], [113.8144, 22.626297], [113.814651, 22.625908], [113.815, 22.625189], [113.813993, 22.624684]],
            '深圳宝安国际机场2F': [[113.811934, 22.623741], [113.811516, 22.624528], [113.811399, 22.624749], [113.812259, 22.625371], [113.812065, 22.626119], [113.811818, 22.627034], [113.811177, 22.628423], [113.811537, 22.628545], [113.812854, 22.626706], [113.8144, 22.626297], [113.814651, 22.625908], [113.815, 22.625189], [113.813993, 22.624684]],
            '深圳宝安国际机场1F': [[113.811934, 22.623741], [113.811516, 22.624528], [113.811399, 22.624749], [113.812259, 22.625371], [113.812065, 22.626119], [113.811818, 22.627034], [113.811177, 22.628423], [113.811537, 22.628545], [113.812854, 22.626706], [113.8144, 22.626297], [113.814651, 22.625908], [113.815, 22.625189], [113.813993, 22.624684]],

            '广州火车站':
                [[113.256631, 23.148886], [113.256898, 23.149427], [113.25737, 23.149234], [113.259263, 23.148291], [113.258991, 23.147797]],
            '广州火车站1F':
                [[113.256631, 23.148886], [113.256898, 23.149427], [113.25737, 23.149234], [113.259263, 23.148291], [113.258991, 23.147797]],
            '广州火车站2F':
                [[113.256631, 23.148886], [113.256898, 23.149427], [113.25737, 23.149234], [113.259263, 23.148291], [113.258991, 23.147797]],

            '广州站广场':
                [[113.257712, 23.148006], [113.257435, 23.147872], [113.25721, 23.147558], [113.257028, 23.147511], [113.25695, 23.147561], [113.256622, 23.14829], [113.256618, 23.14858], [113.256697, 23.148751], [113.257154, 23.148542], [113.258192, 23.148094], [113.258907, 23.147809], [113.258765, 23.147579]],
            '深圳西站': [[113.907892, 22.52737], [113.907261, 22.527392], [113.90724, 22.52857], [113.90782, 22.528569], [113.907867, 22.52831], [113.908066, 22.52837], [113.908247, 22.528336], [113.908289, 22.527416]],
            '深圳站': [[114.116723, 22.53082], [114.116417, 22.532785], [114.117635, 22.532917], [114.117728, 22.532397], [114.117933, 22.530966]],
            '广州北站': [[113.204512, 23.376661], [113.204217, 23.377545], [113.204462, 23.377598], [113.204548, 23.377334], [113.204734, 23.376676]],
            '广州东站': [[113.325658, 23.149821], [113.325512, 23.149838], [113.325467, 23.149706], [113.325391, 23.149712], [113.325188, 23.149524], [113.324994, 23.149604], [113.325017, 23.149786], [113.324798, 23.149859], [113.324718, 23.149707], [113.324605, 23.149667], [113.324408, 23.149498], [113.324361, 23.14956], [113.324434, 23.149712], [113.324517, 23.149998], [113.324298, 23.150079], [113.324229, 23.15026], [113.324168, 23.150458], [113.32393, 23.150523], [113.323823, 23.150425], [113.323411, 23.150636], [113.323075, 23.150878], [113.323168, 23.151249], [113.324707, 23.150709], [113.325293, 23.1505], [113.325947, 23.150261], [113.325783, 23.149886]],
            '惠州站': [[114.416387, 23.151128], [114.416159, 23.151044], [114.416034, 23.151343], [114.415819, 23.152289], [114.416115, 23.152307], [114.416378, 23.152362], [114.41648, 23.152259], [114.417839, 23.152296], [114.417867, 23.151247], [114.417499, 23.151236], [114.417026, 23.151194]],
            '东莞站': [[113.858974, 23.087851], [113.858614, 23.088312], [113.859, 23.089274], [113.859268, 23.089667], [113.860736, 23.088485], [113.859421, 23.087609]],
            '东莞东': [[114.038445, 22.967052], [114.038546, 22.967586], [114.039932, 22.967341], [114.039801, 22.966803]],
            '虎门站': [[113.67414, 22.86], [113.672408, 22.859826], [113.672408, 22.859427], [113.672284, 22.858887], [113.67192, 22.858601], [113.67081, 22.859676], [113.671113, 22.859936], [113.67102, 22.860401], [113.671248, 22.860442], [113.671259, 22.8609], [113.671721, 22.8609], [113.671679, 22.86164], [113.673488, 22.86277], [113.673872, 22.862094], [113.674108, 22.861262], [113.675597, 22.861527], [113.675687, 22.860955], [113.675752, 22.860168], [113.675983, 22.859948], [113.675206, 22.859093]],
            '潮汕站': [[116.590668, 23.538403], [116.587674, 23.53686], [116.586756, 23.538812], [116.585115, 23.53828], [116.584694, 23.539267], [116.5862, 23.539878], [116.586078, 23.540439], [116.586408, 23.540651], [116.586064, 23.54192], [116.587894, 23.54249], [116.588594, 23.540763], [116.590433, 23.541232], [116.591268, 23.539178]],
            '佛山西站': [[113.031569, 23.078005], [113.031278, 23.079144], [113.031093, 23.079968], [113.033599, 23.080705], [113.035848, 23.08096], [113.036052, 23.079898], [113.036203, 23.078892]],
            '珠海站': [[113.550709, 22.214759], [113.547828, 22.214842], [113.547843, 22.21551], [113.548416, 22.215488], [113.549476, 22.215445], [113.550743, 22.215456]],
            '深圳北F1': [[114.030934, 22.609699], [114.028728, 22.60764], [114.027344, 22.609023], [114.029113, 22.610725], [114.029697, 22.611235], [114.030512, 22.610263]],
            // '白云国际机场二号航站楼':[[113.307175,23.395893],[113.306315,23.396125],[113.30601,23.395096],[113.306876,23.394953],[113.306526,23.393817],[113.305468,23.394046],[113.305662,23.394867],[113.305011,23.394964],[113.304758,23.394154],[113.303734,23.394441],[113.304002,23.395589],[113.304689,23.39548],[113.304928,23.396389],[113.303478,23.396758],[113.303615,23.397293],[113.303889,23.398027],[113.305328,23.397661],[113.306713,23.397353],[113.308034,23.39698],[113.307785,23.395793]],
            // '白云国际机场二号航站楼F2':[[113.306846,23.394934],[113.306577,23.393805],[113.303754,23.394466],[113.304012,23.395575],[113.304815,23.395501],[113.304958,23.396366],[113.303576,23.396851],[113.302556,23.395867],[113.302337,23.395901],[113.302093,23.396513],[113.300268,23.396965],[113.300315,23.397435],[113.302586,23.397248],[113.303155,23.399242],[113.302676,23.400848],[113.301325,23.401388],[113.301481,23.401932],[113.303091,23.401489],[113.303573,23.399816],[113.306248,23.399028],[113.309022,23.398339],[113.310848,23.400094],[113.312108,23.399288],[113.311815,23.398764],[113.310647,23.398886],[113.309298,23.397868],[113.308815,23.395985],[113.309338,23.395533],[113.310847,23.395014],[113.310801,23.39446],[113.308944,23.39494],[113.308595,23.394743],[113.308222,23.394546],[113.307854,23.395796],[113.306353,23.396066],[113.306094,23.395256]],
            // '白云国际机场二号航站楼F4':[[113.30642,23.39619],[113.306326,23.396137],[113.305589,23.396209],[113.304972,23.396373],[113.304973,23.396399],[113.304955,23.396345],[113.304958,23.396366],[113.303576,23.396851],[113.302556,23.395867],[113.302337,23.395901],[113.302093,23.396513],[113.300268,23.396965],[113.300315,23.397435],[113.302586,23.397248],[113.303155,23.399242],[113.302676,23.400848],[113.301325,23.401388],[113.301481,23.401932],[113.303091,23.401489],[113.303573,23.399816],[113.306248,23.399028],[113.309022,23.398339],[113.310848,23.400094],[113.312108,23.399288],[113.311815,23.398764],[113.310647,23.398886],[113.309298,23.397868],[113.308815,23.395985],[113.309338,23.395533],[113.310847,23.395014],[113.310801,23.39446],[113.308944,23.39494],[113.308595,23.394743],[113.308222,23.394546],[113.307854,23.395796],[113.306353,23.396066],[113.306324,23.396062]],
            '深圳福田汽车客运站': [[114.012056, 22.531586], [114.01135, 22.531539], [114.01097, 22.532948], [114.012607, 22.533154], [114.014622, 22.533418], [114.016163, 22.531374], [114.016021, 22.531244], [114.015628, 22.531201], [114.014463, 22.53127]],
            '深圳市龙岗汽车客运站': [[114.271617, 22.724397], [114.271371, 22.724243], [114.271268, 22.724344], [114.271335, 22.724402], [114.271316, 22.724584], [114.271115, 22.724852], [114.271315, 22.725038], [114.271405, 22.725067], [114.271582, 22.724911], [114.271742, 22.724695], [114.27177, 22.724458]],
            '深圳罗湖汽车客运站': [[114.11881, 22.529349], [114.118615, 22.530741], [114.11931, 22.53083], [114.119498, 22.529403]],
            '深圳汽车站': [[114.089044, 22.569121], [114.089382, 22.569576], [114.089748, 22.569446], [114.090061, 22.569246], [114.090413, 22.568851], [114.089973, 22.568386]],
            '省汽车客运站': [[113.252192, 23.147864], [113.252122, 23.147958], [113.251915, 23.147917], [113.251787, 23.148272], [113.25183, 23.148599], [113.252022, 23.148733], [113.25225, 23.14883], [113.252576, 23.148877], [113.252929, 23.148857], [113.253052, 23.148594], [113.253257, 23.148542], [113.253378, 23.148044]],
            '芳村汽车客运站': [[113.234959, 23.07941], [113.234551, 23.07947], [113.234335, 23.079585], [113.23445, 23.080796], [113.23574, 23.080661], [113.235633, 23.079386]],
            '广州汽车客运站': [[113.252371, 23.146271], [113.252163, 23.146292], [113.251567, 23.146741], [113.251523, 23.147083], [113.252182, 23.147268], [113.252594, 23.147351], [113.252762, 23.146511]],
            '天河汽车客运站': [[113.344055, 23.170426], [113.343993, 23.170332], [113.343509, 23.170066], [113.343344, 23.17006], [113.342247, 23.170455], [113.341091, 23.170759], [113.341912, 23.172321], [113.342622, 23.171725], [113.343452, 23.170966]],
            '茂名客运中心站': [[110.9256, 21.644577], [110.925551, 21.645207], [110.925256, 21.645922], [110.926469, 21.645917], [110.926497, 21.644569]],
            '香洲长途站': [[113.56747, 22.278876], [113.567472, 22.279067], [113.567062, 22.279073], [113.566717, 22.279257], [113.566608, 22.279485], [113.566852, 22.280052], [113.567197, 22.279768], [113.56756, 22.280146], [113.568176, 22.27959], [113.567999, 22.279434], [113.568411, 22.279011], [113.568431, 22.278837]],
            '佛山汽车站': [[113.110713, 23.040922], [113.110807, 23.041307], [113.110512, 23.041384], [113.110601, 23.041872], [113.110976, 23.041762], [113.111108, 23.041996], [113.111348, 23.041892], [113.110948, 23.040844]],
            '河源汽车总站': [[114.692065, 23.737062], [114.691961, 23.737223], [114.691667, 23.737112], [114.6914, 23.737768], [114.691487, 23.737839], [114.691456, 23.737963], [114.691994, 23.737991], [114.692235, 23.738015], [114.692768, 23.737916], [114.692766, 23.737712], [114.692469, 23.737523], [114.692382, 23.737025]],
            '中山汽车总站': [[113.341645, 22.520804], [113.341517, 22.522978], [113.342458, 22.523098], [113.343617, 22.523101], [113.34372, 22.52114], [113.343574, 22.520934]],
            '中山小榄客运站': [[113.257991, 22.669648], [113.255691, 22.671666], [113.25817, 22.673003], [113.259648, 22.671422], [113.259656, 22.671075], [113.259405, 22.670558]],
            '江门汽车客运站': [[113.065897, 22.629317], [113.064133, 22.629622], [113.064527, 22.631424], [113.065712, 22.63196], [113.066663, 22.632395], [113.068051, 22.629622], [113.067961, 22.629371], [113.06763, 22.629216]],
            '惠州汽车总站': [[114.459516, 22.813094], [114.45905, 22.814655], [114.460824, 22.8151], [114.460972, 22.815006], [114.461594, 22.813795], [114.461452, 22.813572]],
            '东莞汽车总站': [[113.715748, 23.028943], [113.714904, 23.030266], [113.714684, 23.030985], [113.714479, 23.032067], [113.714734, 23.032638], [113.716387, 23.033091], [113.717436, 23.033203], [113.718278, 23.03303], [113.718774, 23.032776], [113.719208, 23.032293], [113.719138, 23.031047], [113.719563, 23.029712]],
            '东莞长安车站': [[113.822488, 22.8], [113.82152, 22.800452], [113.821947, 22.801262], [113.822428, 22.801907], [113.822642, 22.802044], [113.823302, 22.800847]],
            '潮州汽车客运站': [[116.63459, 23.664453], [116.634539, 23.66529], [116.635343, 23.665742], [116.636027, 23.66493]],
            '清远汽车客运站': [[113.004829, 23.72219], [113.002531, 23.722397], [113.002687, 23.724632], [113.00399, 23.72448], [113.003966, 23.723913], [113.004909, 23.723792]],
            '湛江机场': [[110.366151, 21.21142], [110.366056, 21.211578], [110.36569, 21.212832], [110.366198, 21.212984], [110.366393, 21.21243], [110.366481, 21.212437], [110.366575, 21.212116], [110.366519, 21.212031], [110.366679, 21.211528]],
            '潮汕国际机场': [[116.509711, 23.546987], [116.514106, 23.551198], [116.519517, 23.547137], [116.515465, 23.542488]],
            '湛江徐闻海安港': [[110.234299, 20.266591], [110.235046, 20.266973], [110.236036, 20.266228], [110.2357, 20.265696]],

            '梁金山服务区-向东北': [[112.68436, 22.449872], [112.683965, 22.449723], [112.683848, 22.449805], [112.683841, 22.449962], [112.683984, 22.450102], [112.683366, 22.4507], [112.685747, 22.452235], [112.686012, 22.451401], [112.685979, 22.451248], [112.68564, 22.450971]],
            '梁金山服务区-向西南': [[112.683934, 22.451992], [112.682994, 22.451322], [112.682616, 22.452088], [112.682327, 22.451924], [112.68219, 22.452402], [112.683772, 22.453535], [112.684261, 22.453908], [112.684448, 22.453596], [112.684383, 22.453498], [112.685292, 22.452781]],
            '雅瑶服务区-向北': [[112.992639, 22.715323], [112.992703, 22.715094], [112.992626, 22.714611], [112.992254, 22.714393], [112.992008, 22.714359], [112.990758, 22.714751], [112.99108, 22.716745], [112.991216, 22.717447], [112.992242, 22.717199], [112.992459, 22.716977], [112.992468, 22.716681], [112.992073, 22.716081], [112.992138, 22.715767]],
            '雅瑶服务区-向南': [[112.989264, 22.71515], [112.989179, 22.715763], [112.988781, 22.716515], [112.989018, 22.71754], [112.990261, 22.717514], [112.990176, 22.716777], [112.989914, 22.715029]],
            '源潭服务区-向北': [[113.229969, 23.684823], [113.229503, 23.684144], [113.229141, 23.683522], [113.228728, 23.683365], [113.227571, 23.686393], [113.229474, 23.68652], [113.229974, 23.685794], [113.229627, 23.685391]],
            '安塘服务区-向东': [[112.18595, 22.93701], [112.18523, 22.937261], [112.185408, 22.937505], [112.18437, 22.937835], [112.184243, 22.938835], [112.186713, 22.938013], [112.186596, 22.937639], [112.186486, 22.937458]],
            '安塘服务区-向西': [[112.184137, 22.939577], [112.184377, 22.940136], [112.186647, 22.939337], [112.186621, 22.938726]],
            '莲花山服务区-向东': [[115.113359, 22.945061], [115.110226, 22.944595], [115.110117, 22.944652], [115.109792, 22.946356], [115.112965, 22.946835], [115.114498, 22.947237], [115.114419, 22.947025], [115.114061, 22.946631], [115.113757, 22.946109], [115.113666, 22.9453]],
            '莲花山服务区-向西': [[115.114512, 22.947965], [115.114411, 22.948925], [115.118324, 22.950893], [115.11917, 22.950369]],
            '阳江服务区-向东': [[111.955125, 21.903195], [111.953901, 21.90291], [111.953717, 21.903611], [111.953265, 21.903842], [111.955668, 21.904483], [111.95567, 21.904093], [111.955747, 21.903676], [111.95537, 21.903509], [111.955235, 21.90344]],
            '阳江服务区-向西': [[111.955261, 21.904852], [111.953104, 21.904307], [111.952861, 21.905001], [111.953428, 21.905185], [111.953554, 21.905501], [111.954634, 21.905825], [111.954713, 21.90579], [111.954984, 21.905044]],
            '黎溪服务区-向东北': [[113.227406, 23.976299], [113.227452, 23.976196], [113.227071, 23.975794], [113.22619, 23.975745], [113.225806, 23.97551], [113.224828, 23.975519], [113.226716, 23.977683], [113.227577, 23.978356], [113.228103, 23.977529], [113.227929, 23.977282], [113.227783, 23.976873]],
            '黎溪服务区-向西南': [[113.224173, 23.976147], [113.224097, 23.975936], [113.223758, 23.976168], [113.223464, 23.977158], [113.222875, 23.977652], [113.223173, 23.978128], [113.223733, 23.978325], [113.224928, 23.978384], [113.225533, 23.978474], [113.226666, 23.978361], [113.225723, 23.977523]],
            '勒流服务区-向东': [[113.164526, 22.840239], [113.163787, 22.840956], [113.166061, 22.841649], [113.165935, 22.840662]],
            '勒流服务区-向西': [[113.163852, 22.841709], [113.163838, 22.842631], [113.165314, 22.843089], [113.166083, 22.842399]],
            '顺德服务区-向北': [[113.270698, 22.917741], [113.271213, 22.916846], [113.270083, 22.916466], [113.26949, 22.917497], [113.269486, 22.917795], [113.269067, 22.918051], [113.268713, 22.91855], [113.268878, 22.9187], [113.268995, 22.918909], [113.269354, 22.919043], [113.269955, 22.918594]],
            '顺德服务区-向南': [[113.269277, 22.914464], [113.268936, 22.915007], [113.268085, 22.91474], [113.267819, 22.915176], [113.267489, 22.916109], [113.267543, 22.91632], [113.268686, 22.916853], [113.269181, 22.915835], [113.269808, 22.914844]],
            '热水服务区-向东北': [[114.749973, 23.821582], [114.749198, 23.82101], [114.748132, 23.822199], [114.749708, 23.823412], [114.750398, 23.822666]],
            '热水服务区-向西南': [[114.748726, 23.823566], [114.747833, 23.824629], [114.749285, 23.825647], [114.750099, 23.824695]],
            '石坝服务区-向东': [[114.633554, 23.522092], [114.631976, 23.521553], [114.631692, 23.521658], [114.630643, 23.522918], [114.633638, 23.524076], [114.63368, 23.522533], [114.633735, 23.52226]],
            '石坝服务区-向西': [[114.630809, 23.523656], [114.629877, 23.523371], [114.62952, 23.524432], [114.629996, 23.525356], [114.630352, 23.525199], [114.631667, 23.525893], [114.632819, 23.524474], [114.631848, 23.524109]],
            '泰美服务区-向北': [[114.4886, 23.332239], [114.48868, 23.331871], [114.488635, 23.331116], [114.487959, 23.330527], [114.487742, 23.330422], [114.487706, 23.331569], [114.487688, 23.332244], [114.487517, 23.332842], [114.488372, 23.332572]],
            '泰美服务区-向南': [[114.487057, 23.331704], [114.48717, 23.330448], [114.486931, 23.330424], [114.486439, 23.330653], [114.4862, 23.330934], [114.486061, 23.331759], [114.486124, 23.332559], [114.487022, 23.332886]],
            '龙甫服务区-向南': [[112.711789, 23.37588], [112.712025, 23.376461], [112.711923, 23.37682], [112.711968, 23.376941], [112.715064, 23.376175], [112.714299, 23.375271]],
            '龙甫服务区-向北': [[112.7133, 23.377214], [112.712388, 23.377384], [112.712312, 23.377476], [112.713223, 23.378357], [112.713449, 23.378754], [112.713698, 23.378783], [112.715142, 23.378387], [112.715325, 23.377118], [112.715714, 23.376653], [112.715566, 23.376566]],
            '电白服务区-向西': [[111.056578, 21.629053], [111.056657, 21.629247], [111.056541, 21.62968], [111.058296, 21.630073], [111.058461, 21.629504]],
            '电白服务区-向东': [[111.056853, 21.627977], [111.056716, 21.628678], [111.058547, 21.629069], [111.058633, 21.628528], [111.058449, 21.62828]],
            '沙埔服务区-向西': [[113.675273, 23.189119], [113.675266, 23.189343], [113.676182, 23.189792], [113.676763, 23.189769], [113.677856, 23.189865], [113.678068, 23.18958], [113.675685, 23.188415]],
            '沙埔服务区-向东': [[113.673946, 23.18683], [113.673961, 23.187022], [113.676473, 23.188397], [113.676928, 23.187751], [113.675738, 23.187103], [113.675275, 23.186283], [113.674556, 23.185864]],
            '广州花城服务区-向南': [[113.313542, 23.502033], [113.312783, 23.501768], [113.31167, 23.502035], [113.31198, 23.504128], [113.312975, 23.504048], [113.314009, 23.504811], [113.314603, 23.504741], [113.313976, 23.502002]],

        };

        var path;
        // var theZoom;
        //this.CreateHeartLayer();
        var idx = 0;

        for (var key in placeArr) {
            idx++;
            // theZoom = thePlaceZoomObj[key] || 18;
            // console.log(idx);
            // console.log(key.indexOf('机场'))
            if (key.indexOf(name) !== -1) {
                path = placeArr[key];
                break
            }
        }
        // var path = placeArr[name+floor]||placeArr[name];
        // debugger
        var value = data;
        value = value || 1000;
        // if (!polygon) {
        //     console.log("未找到图形不展示");
        //     return;
        // }
        if (!path) {
            console.log("未找到对应的范围");
            return;
        }
        var thePorints = path;
        // debugger
        var lngs = thePorints.map(function (item) {
            return item[0];
        });
        var lats = thePorints.map(function (item) {
            return item[1];
        });
        // debugger
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
        var layer = this.theHeartLayer;

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
        /* layer.setData(theShowList, {
           lnglat: 'coordinate',
           value: 'count'
         });

         layer.setOptions({
           style: {
             radius: 15,
             color: {
               0.5: '#2c7bb6',
               0.65: '#abd9e9',
               0.7: '#ffffbf',
               0.9: '#fde468',
               1.0: '#d7423f'
             }
           }
         });

         layer.render();*/
        // theMap.setFitView(layer);
        // theMap.setZoom(theZoom)
        this.drawReliInner(theShowList);
    };

    MapBase.prototype.drawReliInner = function (theShowList) {
        theShowList = theShowList || [];
        var theDataList = theShowList.map(function (item) {
            return {lng: item.coordinate[0], lat: item.coordinate[1], count: item.count};
        });
        //debugger;
        this.heartMap.setDataSet({data: theDataList});

    }

    window.MapBase = MapBase;

    // var mapbase = new MapBase();
});
