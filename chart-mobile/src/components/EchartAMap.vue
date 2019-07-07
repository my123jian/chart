<template>
    <div ref="chartMap" class="mapview" id="mapview">
    </div>
</template>

<script>
    import CityMap from '../utils/CityMap';
    import ProvinceMap from '../utils/ProvinceMap';
    import CityCodeMap from '../utils/CityCodeMap';
    import GeoUtil from '../utils/GeoUtil';
    import GpsUtil from '../utils/GpsUtil';

    export default {
        name: "EchartAMap",
        props: {
            data: Object,
            level: {type: [String, Number], default: 1},
            areaMod: {type: [String, Number], default: 1},

        },
        data() {
            return {
                provinceCode: '440000',
                provinceName: '广东省',
                cityName: '广州市',
                cityCode: '',
                district: null,
                polygons: [],
                amap: null,
                colors: ['#ff5555', '#ff8155', '#ffc955', '#cafd4f', '#4ffd5f', '#4ffdca', '#4fe2fd', '#4f99fd', '#3b4dff', '#644cdb'],
                defaultFeatures: ['bg', 'building', 'point'], // 地图默认特征
            }
        },
        mounted() {
            this.initChart();

        },
        methods: {
            initChart() {
                var me = this;
                this.chartMap = window.echarts.init(this.$refs.chartMap);
                this.chartMap.setOption({
                    backgroundColor: '',
                    title: {
                        text: '',
                        //subtext: '数据覆盖率',
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    amap: {
                        maxPitch: 60,
                        pitch: 10, //45 俯仰角
                        viewMode: '3D',
                        zoom: 7.5,
                        expandZoomRange: true,
                        zooms: [3, 20],
                        mapStyle: 'amap://styles/785cdb67af60cfce35e24e8d6c56ed75', //地图主题
                        center: [113.275824, 22.994826], //中心点
                        rotation: 0,  //顺时针旋转角度
                        resizeEnable: true,
                        // zooms: [7.5, 15], // 改变最大缩放等级
                        keyboardEnable: false,
                        layers: [
                            //satellite,
                            // building,
                            //roadNet
                        ],
                        features: ['bg', 'building', 'point']
                    },
                    animation: false,
                    series: []
                });
                this.amap = this.chartMap.getModel().getComponent('amap').getAMap();
                var layer = this.chartMap.getModel().getComponent('amap').getLayer();
                layer.render = function () {
                    var theOptions = me.chartMap.getOption();
                    me.chartMap.setOption({
                        series: theOptions.series
                    });
                };

                AMapUI && AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function (DistrictExplorer, $) {
                    window.districtExplorer = new DistrictExplorer({
                        eventSupport: true, //打开事件支持
                        map: me.amap
                    });
                    me.navigateTo(me.amap, me.mapName);
                   // debugger;
                });
            },
            /**城市编码和名称的对照*/
            getCityNameByCode(name) {
                return name;
            },
            /*根据名字得到经纬度**/
            geoCoordMap(name) {

                //广东省查询
                if(this.level==1){
                    return GpsUtil.getByCityName(name);
                }
                if (this.areaMod == 1) {
                    var theCityCode = CityCodeMap.getCountyCode("广东省", this.cityName, name);
                    //debugger;
                    if (!theCityCode) {
                        var theCityCode = CityCodeMap.getCityCode("广东省", name);
                    }
                    return GpsUtil.getByAreaCode(theCityCode);
                }
                else {
                    return GpsUtil.getByCityName(name);
                }

            },
            /**根据名称转换经纬度*/
            convertData(data) {
                var res = [];
                if (!data) {
                    return {
                        lines: [],
                        points: []
                    };
                }
                var theValidPoints = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
// debugger;
                    var fromCoord = this.geoCoordMap(dataItem.from);
                    var toCoord = this.geoCoordMap(dataItem.to);
                    if (fromCoord && toCoord) {
                        fromCoord = [parseFloat(fromCoord[0]), parseFloat(fromCoord[1])];
                        toCoord = [parseFloat(toCoord[0]), parseFloat(toCoord[1])];
                        var theLine = {
                            fromName: dataItem.from,
                            toName: dataItem.to,
                            coords: [fromCoord, toCoord],
                            //设置线段颜色
                            lineStyle: {
                                normal: {
                                    color: this.colors[i > 10 ? 9 : i],
                                    width: 2,
                                    curveness: 0.2
                                }
                            }
                        };
                        theValidPoints.push(dataItem);
                        res.push(theLine);
                    }
                }
                return {
                    lines: res,
                    points: theValidPoints
                };
            },
            /*导航地址**/
            navigateAddress(map, mapName) {
                var me = this;
                if (!this.district) {
                    //实例化DistrictSearch
                    var opts = {
                        subdistrict: 1,   //获取边界不需要返回下级行政区
                        extensions: 'all',  //返回行政区边界坐标组等具体信息
                        level: 'district'  //查询行政级别为 市
                    };
                    this.district = new AMap.DistrictSearch(opts);
                }
                debugger;
                //行政区查询
                this.district.setLevel(this.level);
                var colors = [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                    "#651067", "#329262", "#5574a6", "#3b3eac"
                ];
                this.district.search(mapName, function (status, result) {
                    map.remove(me.polygons)//清除上次结果
                    me.polygons = [];
                    var bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                strokeWeight: 1,
                                path: bounds[i],
                                fillOpacity: 0.4,
                                fillColor: '#80d8ff',
                                strokeColor: '#0091ea'
                            });
                            me.polygons.push(polygon);
                        }
                    }
                    map.add(me.polygons)
                    map.setFitView(me.polygons);//视口自适应
                });
            },
            renderAreaPolygons(map, areaNode) {
                var colors = [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                    "#651067", "#329262", "#5574a6", "#3b3eac"
                ];
                //更新地图视野
                map.setBounds(areaNode.getBounds(), null, null, true);

                //清除已有的绘制内容
                districtExplorer.clearFeaturePolygons();

                //绘制子区域
                districtExplorer.renderSubFeatures(areaNode, function (feature, i) {

                    var fillColor = colors[i % colors.length];
                    var strokeColor = colors[colors.length - 1 - i % colors.length];

                    return {
                        cursor: 'default',
                        bubble: true,
                        strokeColor: strokeColor, //线颜色
                        strokeOpacity: 1, //线透明度
                        strokeWeight: 1, //线宽
                        fillColor: fillColor, //填充色
                        fillOpacity: 0.35, //填充透明度
                    };
                });

                //绘制父区域
                districtExplorer.renderParentFeature(areaNode, {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: 'black', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: null, //填充色
                    fillOpacity: 0.35, //填充透明度
                });
            },
            navigateTo(map, mapName) {

                var currentAreaNode = null;
                var me = this;
                var districtExplorer = window.districtExplorer;
                if(!districtExplorer){
                    return;
                }
                var adcode=CityCodeMap.getProvinceCode("广东省");
                if(this.level==1){
                    adcode=mapName;
                }
                else{
                    if(mapName){
                        var  tadcode=CityCodeMap.getCityCode("广东省",mapName);
                        if(tadcode){
                            adcode=tadcode;
                        }
                    }
                }

                districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
                    if (error) {
                        return;
                    }
                    currentAreaNode = window.currentAreaNode = areaNode;
                    //设置当前使用的定位用节点
                    districtExplorer.setAreaNodesForLocating([currentAreaNode]);
                    me.renderAreaPolygons(map, areaNode);
                });
            },
            /**根据数据进行呈现*/
            refresh(data) {

                var theMapName = data.name;
                // var theMapPath = this.getMapPath(theMapName);
                var me = this;
                if (this.mapName != theMapName) {
                    this.mapName = theMapName;
                    if(this.level==1){
                        this.navigateTo(this.amap, 100000);
                    }
                    else{
                        this.navigateTo(this.amap, this.mapName);
                    }
                }

                // debugger;
                me.drawMap(data);

            },
            /**根据数据呈现到地图上*/
            drawMap(data) {
                // name
                // from to value
                var me = this;
                var theMapName = data.name;
                var theItems = data.items || [];
                var theMapHash = {};

                var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

                var theConvertResult = this.convertData(data.items);

                var thePoints = theConvertResult.points;
                var theLines = theConvertResult.lines;

                var thePintHash = {};
                var theValidPoints = [];
                for (var i = 0; i < thePoints.length; i++) {
                    var thePoint = thePoints[i];
                    if (!thePintHash[thePoint.from]) {
                        thePintHash[thePoint.from] = true;
                        theValidPoints.push(thePoint.from);
                    }
                    if (!thePintHash[thePoint.to]) {
                        thePintHash[thePoint.to] = true;
                        theValidPoints.push(thePoint.to);
                    }
                }
                //var color = ['#a6c84c', '#ffa022', '#46bee9'];
                var color = ['#49ffff'];//
                var series = [];

                series.push(
                    {
                        // name: item[0] + ' Top10',
                        type: 'lines',  //静态线
                        zlevel: 1,
                        "coordinateSystem": "amap",
                        effect: {
                            show: false,
                            period: 6,
                            trailLength: 0.7,
                            color: '#49ffff',//'#fff',
                            symbolSize: 3
                        },
                        lineStyle: {
                            normal: {
                                color: '#49ffff',//color[i],
                                width: 1,
                                curveness: 0.2
                            }
                        },
                        data: theLines,
                    },
                    {
                        //name: item[0] + ' Top10',
                        type: 'lines',  //动态线
                        zlevel: 2,
                        "coordinateSystem": "amap",
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0.7,
                            color: '#fff',
                            symbol: 'arrow',
                            symbolSize: 5,
                            // shadowBlur: 10,
                        },
                        lineStyle: {
                            normal: {
                                color: color[0],
                                width: 1,
                                opacity: 0.5,
                                curveness: 0.2,
                                type: 'solid',
                                // shadowBlur: 5,
                                // shadowColor: color[i],
                            }
                        },
                        // emphasis: {
                        //   lineStyle: {
                        //     color: {
                        //       type: 'linear',
                        //       x: 0,
                        //       y: 0,
                        //       x2: 0,
                        //       y2: 1,
                        //       colorStops: [{
                        //           offset: 0, color: 'red' // 0% 处的颜色
                        //       }, {
                        //           offset: 1, color: 'blue' // 100% 处的颜色
                        //       }],
                        //       globalCoord: false // 缺省为 false
                        //     }
                        //   }
                        // },
                        symbol: ['none', 'arrow'],
                        symbolSize: 10,
                        data: theLines,

                    },
                    {
                        //name: item[0] + ' Top10',
                        type: 'effectScatter',
                        "coordinateSystem": "amap",
                        // symbol:'emptyCircle',
                        // markPoint: {
                        //   symbol: 'circle',
                        //   data: [
                        //     {
                        //       name: '某个坐标',
                        //       coord: [110.365554,21.276724],
                        //       value:965,

                        //     }
                        //   ]
                        // },
                        //   animationDelayUpdate: function (idx) {
                        //     return 1000;
                        // },
                        effectType: 'ripple',

                        hoverAnimation: true,
                        // coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: '{b}'
                            }
                        },
                        symbolSize: function (val) {
                            return 8 + (val[2] / 10000);
                        },
                        itemStyle: {
                            normal: {
                                color: color[0],
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        data: theValidPoints.map(function (dataItem) {
                            // var theLngLatPoints=me.geoCoordMap(me.queryDirection == 1 ? dataItem.from : dataItem.to);
                            // var thePoss=[parseFloat(theLngLatPoints[0]),parseFloat(theLngLatPoints[1])];
                            // return {
                            //     name: me.queryDirection == 1 ? dataItem.from : dataItem.to,
                            //     value: thePoss.concat([dataItem.value])
                            // };
                            var theLngLatPoints = me.geoCoordMap(dataItem);
                            var thePoss = [parseFloat(theLngLatPoints[0]), parseFloat(theLngLatPoints[1])];
                            return {
                                name: dataItem,
                                value: thePoss.concat([10])
                            };
                        }),
                    }
                );
                var option = {
                    series: series,

                };

                // this.chartMap.clear();
                this.chartMap.setOption(option);

            }
        },
        watch: {
            data(newValue, oldValue) {
                if (newValue != oldValue) {

                    this.refresh(newValue);
                }
            }
        }
    }

</script>

<style scoped>
    .mapview {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
    }
</style>