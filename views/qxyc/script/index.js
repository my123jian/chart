$(function () {
    var theMapId = "mapbase";
    var theChar1Id = "chart1";
    var theChar2Id = "chart2";
    var theChar3Id = "chart3";
    var theChar4Id = "chart4";
    var theGdData = GdGeoJson;
    //当前选择的时间
    var theCurrentDate = null;
    //当前的区域名称
    var theAreaNmae = "";

    //显示第一行数据
    var ShowNumber1 = function (city, value) {
        $('#numpart1').find('.cityname').val(city);
        var theValueStr = value.toFixed(1);
        var theNumberStrArray = [];
        for (var i = 0; i < theValueStr.length; i++) {
            theNumberStrArray.push(theValueStr[i]);
        }
        theNumberStrArray = theNumberStrArray.reverse();
        var theFormateArray = [];
        var hasDone = false;
        for (var i = 0; i < theNumberStrArray.length; i++) {
            var theCurrentChar = theNumberStrArray[i];
            if (!hasDone) {
                theFormateArray.push(theCurrentChar);
            }
            if (hasDone) {
                for (var j = 0; j < 3; j++) {
                    var thePos = i + j;
                    if (thePos > theNumberStrArray.length) {
                        break;
                    }
                    else {
                        theCurrentChar = theNumberStrArray[thePos];
                        theFormateArray.push(theCurrentChar)
                    }
                }
                i = i + 3;
                if (i + 1 < theNumberStrArray.length) {
                    theFormateArray.push(',');
                }
            }
            if (!hasDone && theCurrentChar == '.') {
                hasDone = true;
            }
        }
        theFormateArray = theFormateArray.reverse();
        var theTemplate = "";
        for (var i = 0; i < theFormateArray.length; i++) {
            var theCurrent = theFormateArray[i];
            if (theCurrent == ',' || theCurrent == '.') {
                theTemplate += theCurrent;
            }
            else {
                theTemplate += "<div>" + theCurrent + "</div>";
            }
        }
        theTemplate = theTemplate + "<span class=\"last\">万</span>";
        return theTemplate;
    }
    //显示第2行数据
    var ShowNumber2 = function (city, value) {
        $('#numpart2').find('.cityname').val(city);
    }
    //显示第3行数据
    var ShowNumber3 = function (city, value) {
        $('#numpart3').find('.cityname').val(city);
    }

    function PageViewModel() {
        this.initEvent();
        this.initCharts();
        this.initChartMap();
        this.start();
    }
    PageViewModel.prototype = new PageViewBase();
    /**
     * 定时任务开始
     */
    PageViewModel.prototype.onTimer=function(){

    }
    PageViewModel.prototype.initEvent = function () {
        $('.topbutton').click(function () {
            var theUrl = $(this).data('url');
            if (theUrl) {
                console.log("找到对应的URL:" + theUrl);
                location.href = theUrl;
            }
            else {
                console.log("未找到对应的URL不跳转！");
            }
        });
        $('#date-action').click(function () {
            //$('#date-input').click();
            laydate.render({
                elem: '#date-input', //指定元素
                show: true
            });
        });
        var me = this;
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            value: new Date(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            }
        });
        /*$('#date-input').change(function(){
            theCurrentDate=$(this).val();
            console.log('日期变化:'+theCurrentDate);
        });*/
    }
    PageViewModel.prototype.initChartMap = function () {
        echarts.registerMap('gd', theGdData);
        this.ChartMap = echarts.init(document.getElementById(theMapId));

        option = null;
        var geoCoordMap = {
            '上海': [121.4648, 31.2891],
            '东莞': [113.8953, 22.901],
            '东营': [118.7073, 37.5513],
            '中山': [113.4229, 22.478],
            '临汾': [111.4783, 36.1615],
            '临沂': [118.3118, 35.2936],
            '丹东': [124.541, 40.4242],
            '丽水': [119.5642, 28.1854],
            '乌鲁木齐': [87.9236, 43.5883],
            '佛山': [112.8955, 23.1097],
            '保定': [115.0488, 39.0948],
            '兰州': [103.5901, 36.3043],
            '包头': [110.3467, 41.4899],
            '北京': [116.4551, 40.2539],
            '北海': [109.314, 21.6211],
            '南京': [118.8062, 31.9208],
            '南宁': [108.479, 23.1152],
            '南昌': [116.0046, 28.6633],
            '南通': [121.1023, 32.1625],
            '厦门': [118.1689, 24.6478],
            '台州': [121.1353, 28.6688],
            '合肥': [117.29, 32.0581],
            '呼和浩特': [111.4124, 40.4901],
            '咸阳': [108.4131, 34.8706],
            '哈尔滨': [127.9688, 45.368],
            '唐山': [118.4766, 39.6826],
            '嘉兴': [120.9155, 30.6354],
            '大同': [113.7854, 39.8035],
            '大连': [122.2229, 39.4409],
            '天津': [117.4219, 39.4189],
            '太原': [112.3352, 37.9413],
            '威海': [121.9482, 37.1393],
            '宁波': [121.5967, 29.6466],
            '宝鸡': [107.1826, 34.3433],
            '宿迁': [118.5535, 33.7775],
            '常州': [119.4543, 31.5582],
            '广州': [113.5107, 23.2196],
            '廊坊': [116.521, 39.0509],
            '延安': [109.1052, 36.4252],
            '张家口': [115.1477, 40.8527],
            '徐州': [117.5208, 34.3268],
            '德州': [116.6858, 37.2107],
            '惠州': [114.6204, 23.1647],
            '成都': [103.9526, 30.7617],
            '扬州': [119.4653, 32.8162],
            '承德': [117.5757, 41.4075],
            '拉萨': [91.1865, 30.1465],
            '无锡': [120.3442, 31.5527],
            '日照': [119.2786, 35.5023],
            '昆明': [102.9199, 25.4663],
            '杭州': [119.5313, 29.8773],
            '枣庄': [117.323, 34.8926],
            '柳州': [109.3799, 24.9774],
            '株洲': [113.5327, 27.0319],
            '武汉': [114.3896, 30.6628],
            '汕头': [116.688529, 23.359091],
            '江门': [112.6318, 22.1484],
            '沈阳': [123.1238, 42.1216],
            '沧州': [116.8286, 38.2104],
            '河源': [114.917, 23.9722],
            '泉州': [118.3228, 25.1147],
            '泰安': [117.0264, 36.0516],
            '泰州': [120.0586, 32.5525],
            '济南': [117.1582, 36.8701],
            '济宁': [116.8286, 35.3375],
            '海口': [110.3893, 19.8516],
            '淄博': [118.0371, 36.6064],
            '淮安': [118.927, 33.4039],
            '深圳': [114.5435, 22.5439],
            '清远': [112.9175, 24.3292],
            '温州': [120.498, 27.8119],
            '渭南': [109.7864, 35.0299],
            '湖州': [119.8608, 30.7782],
            '湘潭': [112.5439, 27.7075],
            '滨州': [117.8174, 37.4963],
            '潍坊': [119.0918, 36.524],
            '烟台': [120.7397, 37.5128],
            '玉溪': [101.9312, 23.8898],
            '珠海': [113.582557, 22.276564],
            '盐城': [120.2234, 33.5577],
            '盘锦': [121.9482, 41.0449],
            '石家庄': [114.4995, 38.1006],
            '福州': [119.4543, 25.9222],
            '秦皇岛': [119.2126, 40.0232],
            '绍兴': [120.564, 29.7565],
            '聊城': [115.9167, 36.4032],
            '肇庆': [112.1265, 23.5822],
            '舟山': [122.2559, 30.2234],
            '苏州': [120.6519, 31.3989],
            '莱芜': [117.6526, 36.2714],
            '菏泽': [115.6201, 35.2057],
            '营口': [122.4316, 40.4297],
            '葫芦岛': [120.1575, 40.578],
            '衡水': [115.8838, 37.7161],
            '衢州': [118.6853, 28.8666],
            '西宁': [101.4038, 36.8207],
            '西安': [109.1162, 34.2004],
            '贵阳': [106.6992, 26.7682],
            '连云港': [119.1248, 34.552],
            '邢台': [114.8071, 37.2821],
            '邯郸': [114.4775, 36.535],
            '郑州': [113.4668, 34.6234],
            '鄂尔多斯': [108.9734, 39.2487],
            '重庆': [107.7539, 30.1904],
            '金华': [120.0037, 29.1028],
            '铜川': [109.0393, 35.1947],
            '银川': [106.3586, 38.1775],
            '镇江': [119.4763, 31.9702],
            '长春': [125.8154, 44.2584],
            '长沙': [113.0823, 28.2568],
            '长治': [112.8625, 36.4746],
            '阳泉': [113.4778, 38.0951],
            '青岛': [120.4651, 36.3373],
            '韶关': [113.7964, 24.7028],
            '湛江': [110.365554, 21.276724],
            '茂名': [110.931541, 21.669064],
        };

        var SZData = [
            [{name: "深圳"}, {name: "东莞", value: 95}],
            [{name: "深圳"}, {name: "江门", value: 90}],
            [{name: "深圳"}, {name: "珠海", value: 80}],
            [{name: "深圳"}, {name: "佛山", value: 70}],
            [{name: "深圳"}, {name: "惠州", value: 60}],
            [{name: "深圳"}, {name: "汕头", value: 50}],
            [{name: "深圳"}, {name: "深圳", value: 40}],
            [{name: "深圳"}, {name: "湛江", value: 30}],
            [{name: "深圳"}, {name: "韶关", value: 20}],
            [{name: "深圳"}, {name: "茂名", value: 10}],
            [{name: "深圳"}, {name: "深圳", value: 10}],
        ];

        var SHData = [
            [{name: '上海'}, {name: '包头', value: 95}],
            [{name: '上海'}, {name: '昆明', value: 90}],
            [{name: '上海'}, {name: '广州', value: 80}],
            [{name: '上海'}, {name: '郑州', value: 70}],
            [{name: '上海'}, {name: '哈尔滨', value: 60}],
            [{name: '上海'}, {name: '重庆', value: 50}],
            [{name: '上海'}, {name: '长沙', value: 40}],
            [{name: '上海'}, {name: '北京', value: 30}],
            [{name: '上海'}, {name: '丹东', value: 20}]
        ];

        var GZData = [
            [{name: "广州"}, {name: "东莞", value: 95}],
            [{name: "广州"}, {name: "江门", value: 90}],
            [{name: "广州"}, {name: "珠海", value: 80}],
            [{name: "广州"}, {name: "佛山", value: 70}],
            [{name: "广州"}, {name: "惠州", value: 60}],
            [{name: "广州"}, {name: "汕头", value: 50}],
            [{name: "广州"}, {name: "深圳", value: 40}],
            [{name: "广州"}, {name: "湛江", value: 30}],
            [{name: "广州"}, {name: "韶关", value: 20}],
            [{name: "广州"}, {name: "茂名", value: 10}],
            [{name: "广州"}, {name: "广州", value: 10}],
        ];
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            console.log(res);

            return res;
        };

        //var color = ['#a6c84c', '#ffa022', '#46bee9'];
        var color = ['#49ffff'];//
        var series = [];

// ['北京', BJData], ['上海', SHData],
        [['广州', GZData], ['深圳', SZData]].forEach(function (item, i) {
            // debugger
            series.push({
                    name: item[0] + ' Top10',
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
                    data: convertData(item[1]),
                },
                {
                    name: item[0] + ' Top10',
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
                            color: color[i],
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
                    data: convertData(item[1]),

                },
                {
                    name: item[0] + ' Top10',
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
                        return val[2] / 8;
                    },
                    itemStyle: {
                        normal: {
                            color: color[i],
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    }),
                }
            );
            // console.log('ss:',series);

        });
        //选择目标区域
        /* PageView.ChartMap.dispatchAction({
             type: 'geoSelect',
             name: '广州市'
         })*/
        option = {
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
                selectedMode: 'single',
                map: 'gd',
                top: 82,
                scaleLimit: {
                    min: 1,
                    max: 1
                },
                //鼠标移入是否显示省份/城市
                label: {
                    show: true,
                    color: 'white',
                    emphasis: {
                        color: 'white',
                        show: true
                    }
                },
                roam: false,//鼠标不可移动
                itemStyle: {
                    normal: {//选取前颜色
                        areaColor: {
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
                        }
                        // '#2b7ecc'
                        ,
                        borderColor: '#49ffff'
                    },
                    emphasis: {//选取后颜色
                        areaColor: '#24b1e5'
                    }
                },
                // center: [113.5107, 23.2196],
                zoom: 0.8,


            },
            /*series: series,*/

        };
        if (option && typeof option === "object") {
            this.ChartMap.setOption(option, true);
            this.ChartMap.on('geoselectchanged', function (params) {
                console.log(params);
            });
            this.ChartMap.on('mapselectchanged', function (params) {
                console.log(params);
            });

            this.ChartMap.on('click', function (params) {
                var theName = params.name;
                console.log(params);
            })
        }

    }

    PageViewModel.prototype.loadChart1 = function (data) {
        this.Chart1 = echarts.init(document.getElementById('chart1'));
        var option = {
            /*title: {
                text: '折线图堆叠'
            },*/
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'transparent',
                formatter: function (params) {
                    return params[params.length - 1].data;
                }
            },
            /*legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },*/
            /* grid: {
                 left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true
             },*/
            grid: {
                left: 0,
                right: 50,
                top: 5,
                bottom: 5,
                width: 550,
                height: 100,
                containLabel: true
            },
            /*toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },*/
            xAxis: {
                type: 'category',
                name: '(时点)',
                //nameLocation: 'end',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                },
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                }
            },
            series: [

                {
                    name: '搜索引擎',
                    type: 'line',
                    //stack: '总量',
                    smooth: true,
                    data: [820, 932, 901, 934, 1290, 1330],
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(255,220,111,0.3)'
                                }, {
                                    offset: 0.5, color: 'rgba(255,220,111,0.15)'
                                }, {
                                    offset: 1, color: 'rgba(255,220,111,0)'
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#ffdc6f'
                        }
                    }
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,
                                color: '#ffdc6f',
                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
        this.Chart1.setOption(option);
    }
    PageViewModel.prototype.loadChart2 = function (data) {
        this.Chart2 = echarts.init(document.getElementById('chart2'));
        var option = {
            /*title: {
                text: '折线图堆叠'
            },*/
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'transparent',
                formatter: function (params) {
                    return params[params.length - 1].data;
                }
            },
            /*legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },*/
            /* grid: {
                 left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true
             },*/
            grid: {
                left: 0,
                right: 5,
                top: 5,
                bottom: 5,
                width: 600,
                height: 100,
                containLabel: true
            },
            /*toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },*/
            xAxis: {
                type: 'category',
                name: '(时点)',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                },
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                }
            },
            series: [

                {
                    name: '搜索引擎',
                    type: 'line',
                    //stack: '总量',
                    smooth: true,
                    data: [820, 932, 901, 934, 1290, 1330],
                    lineStyle: {
                        normal: {
                            color: '#4293f2' //rgba(66,147,242
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(66,147,242,0.3)'
                                }, {
                                    offset: 0.5, color: 'rgba(66,147,242,0.15)'
                                }, {
                                    offset: 1, color: 'rgba(66,147,242,0)'
                                }]
                            }
                        }
                    },
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,
                                color: '#4293f2',
                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
        this.Chart2.setOption(option);
    }
    PageViewModel.prototype.loadChart3 = function (data) {
        this.Chart3 = echarts.init(document.getElementById('chart3'));
        var option = {
            /*title: {
                text: '折线图堆叠'
            },*/
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'transparent',
                formatter: function (params) {
                    return params[params.length - 1].data;
                }
            },
            /*legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },*/
            /* grid: {
                 left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true
             },*/
            grid: {
                left: 0,
                right: 5,
                top: 5,
                bottom: 5,
                width: 600,
                height: 100,
                containLabel: true
            },
            /*toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },*/
            xAxis: {
                type: 'category',
                name: '(时点)',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                },
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                }
            },
            series: [

                {
                    name: '搜索引擎',
                    type: 'line',
                    //stack: '总量',
                    smooth: true,
                    data: [820, 932, 901, 934, 1290, 1330],
                    lineStyle: {
                        normal: {
                            color: '#32ff4b'//rgba(50,255,75
                        }
                    },

                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(50,255,75,0.3)'
                                }, {
                                    offset: 0.5, color: 'rgba(50,255,75,0.15)'
                                }, {
                                    offset: 1, color: 'rgba(50,255,75,0)'
                                }]
                            }
                        }
                    },
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,
                                color: '#32ff4b',
                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
        this.Chart3.setOption(option);
    }
    PageViewModel.prototype.loadChart4 = function (data) {
        this.Chart4 = echarts.init(document.getElementById('chart4'));
        var option = {
            /*title: {
                text: '折线图堆叠'
            },*/
            tooltip: {
                trigger: 'axis',
                //show:true,
                axisPointer: {
                    type: 'line',
                    show: true,
                    label: {
                        show: true
                    }
                },
                backgroundColor: 'transparent',
                formatter: function (params) {
                    return params[params.length - 1].data;
                }
            },

            legend: {
                textStyle: {
                    color: '#557398',
                },
                data: ['搜索引擎']
            },
            /* visualMap:{
                 show:false,
                 seriesIndex:1,
             },*/
            /*legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },*/
            /* grid: {
                 left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true
             },*/
            grid: {
                left: 0,
                right: 5,
                top: 5,
                bottom: 5,
                width: 1194,
                height: 236,
                containLabel: true
            },
            /*toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },*/
            xAxis: {
                type: 'category',
                boundaryGap: false,
                name: '(时间/点)',
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                },
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                }
            },
            series: [

                {
                    name: '搜索引擎',
                    type: 'line',
                    z: 1,
                    //stack: '总量',
                    smooth: true,
                    data: [820, 932, 901, 934, 1290, 1330],
                    lineStyle: {
                        normal: {
                            color: '#32ff4b'//rgba(55,255,75
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(55,255,75,0.3)'
                                }, {
                                    offset: 0.5, color: 'rgba(55,255,75,0.15)'
                                }, {
                                    offset: 1, color: 'rgba(55,255,75,0)'
                                }]
                            }
                        }
                    },
                },
                {
                    name: '搜索引擎',
                    symbol: 'none',
                    z: 2,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,
                                color: '#32ff4b',
                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                },


            ]
        };
        this.Chart4.setOption(option);
    }
    PageViewModel.prototype.initCharts = function () {
        this.loadChart1()
        this.loadChart2()
        this.loadChart3()
        this.loadChart4()

    }

    PageViewModel.prototype.Load = function () {

    }
    window.PageView = new PageViewModel();
})