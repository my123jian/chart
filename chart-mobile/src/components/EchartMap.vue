<template>
    <div ref="chartMap" style="    width: 1200px;
    height: 1040px;
    margin-top: 40px;
    position: absolute;
    left: 0px;
    top: 0px;">
    </div>
</template>

<script>
    export default {
        name: "EchartMap",
        props: ['data'],
        mounted() {
            this.initMap();
           this.colors = ['#ff5555', '#ff8155', '#ffc955', '#cafd4f', '#4ffd5f', '#4ffdca', '#4fe2fd', '#4f99fd', '#3b4dff', '#644cdb']

        },
        methods: {
            initMap() {
                this.chartMap = window.echarts.init(this.$refs.chartMap);
            },
            getCityNameByCode(name) {
                return name;
            },
            loadMap(name, path, callback) {
                $.get(path, function (chinaJson) {
                    window.echarts.registerMap('name', chinaJson);
                    callback && callback();
                });
            },
            geoCoordMap(name){
              return [0,0];
            },
            convertData(data){

                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var fromCoord = this.geoCoordMap[dataItem[0].name];
                    var toCoord = this.geoCoordMap[dataItem[1].name];

                    if (fromCoord && toCoord) {
                        var theLine = {
                            fromName: dataItem[0].name,
                            toName: dataItem[1].name,
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

                        res.push(theLine);
                    }
                }
                return res;
            },
            refresh(data) {
                var theMapName = data.name;
                var option = null;
                var theColors = ['#ff5555', '#ff8155', '#ffc955', '#cafd4f', '#4ffd5f', '#4ffdca', '#4fe2fd', '#4f99fd', '#3b4dff', '#644cdb']

                var theItems = data.items || [];

                var theMapHash = {};
                for (var i = 0; i < theItems.length; i++) {
                    var theItem = theItems[i];
                    var theKey = theItem.from + '_' + theItem.to;
                    theMapHash[theKey] = true;
                    if (!theItem.from || !theItem.to) {
                        continue;
                    }

                    data.push(
                        [
                            {name: this.getCityNameByCode(theItem.from)},
                            {
                                name: this.getCityNameByCode(theItem.to),
                                value: theItem.value
                            }
                        ]);
                }

                var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

                var theValidData = [];

                //var color = ['#a6c84c', '#ffa022', '#46bee9'];
                var color = ['#49ffff'];//
                var series = [];

                series.push(
                    {
                        // name: item[0] + ' Top10',
                        type: 'lines',  //静态线
                        zlevel: 1,
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
                        data: convertData(data),
                    },
                    {
                        //name: item[0] + ' Top10',
                        type: 'lines',  //动态线
                        zlevel: 2,
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
                        data: convertData(data),

                    },
                    {
                        //name: item[0] + ' Top10',
                        type: 'effectScatter',
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
                        coordinateSystem: 'geo',
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
                        data: theValidData.map(function (dataItem) {
                            return {
                                name: dataItem[1].name,
                                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                            };
                        }),
                    }
                );
                var option = {
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
                    /*legend: {
                        orient: 'vertical',
                        top: 'bottom',
                        left: 'right',
                        //data:['北京 Top10', '上海 Top10', '广州 Top10'],
                        textStyle: {
                            color: '#fff'
                        },
                        selectedMode: 'single'
                    },*/
                    geo: {
                        selectedMode: false,// 'single',
                        map: 'gd',
                        top: 82,
                        scaleLimit: {
                            //min: 1,
                            max: 6
                        },
                        /*regions: [{
                            name: '广州市',
                            itemStyle: {
                                areaColor: 'red',
                                color: 'red'
                            }
                        }],*/
                        //鼠标移入是否显示省份/城市
                        label: {
                            show: true,
                            color: 'white',
                            emphasis: {
                                color: 'white',
                                show: false
                            }
                        },
                        roam: false,//鼠标不可移动
                        itemStyle: {
                            normal: {//选取前颜色
                                /*areaColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#2b7ecc00' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#2b7ecc' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }*/
                                borderColor: '#13ffff',
                                areaColor: '#00a5ff',
                                // borderColor: '#49ffff'
                            },
                            emphasis: {//选取后颜色
                                areaColor: '#00a5ff',// '#24b1e5'
                            }
                        },
                        // center: [113.5107, 23.2196],
                        zoom: 0.8,


                    },
                    series: series,

                };

                this.chartMap.clear();
                this.chartMap.setOption(option, true);

                this.chartMap.on('geoselectchanged', function (params) {
                    //debugger;
                    if (params.batch.length > 0) {
                        var theAreaSelected = params.batch[0];
                        var theName = theAreaSelected.name;
                        if (theAreaNmae != theName) {
                            theAreaNmae = theName;
                            console.log('选择区域变化，切换到区域' + theAreaNmae);
                            // me.loadData();

                        }
                    }
                    else {
                        console.log('选择区域变化，未找到值');
                    }
                    //console.log("111",params);
                });
                this.chartMap.on('mapselectchanged', function (params) {
                    var theName = params.name;
                    //debugger;
                    if (theAreaNmae != theName) {
                        theAreaNmae = theName;
                        //me.loadData();
                    }
                    //console.log(params);
                });
                this.chartMap.on('click', function (params) {
                    // var theName = params.name;
                    // console.log(params);
                })
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

</style>