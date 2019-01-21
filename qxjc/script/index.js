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
    var formateRgba = function (colorName, num) {
        // var theRgbaString = 'rgba';
        if (colorName.indexOf('#') >= 0) {
            var r = eval('0x' + colorName.substr(1, 2));
            var g = eval('0x' + colorName.substr(3, 2));//colorName.substr(3, 2);
            var b = eval('0x' + colorName.substr(5, 2)); //colorName.substr(5, 2);
            var theResult = `rgba(${r},${g},${b},${num})`;
            return theResult;
        }
    };
    var formateDate = function () {
        if (!theCurrentDate) {
            var theDate = new Date();// GetYesterdayDate();
            //theDate.setDate(theDate.getDate()-1);
            return theDate.getFullYear() + "-" + FormateDateNum(theDate.getMonth() + 1) + "-" + FormateDateNum(theDate.getDate());
        }
        return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
    }
    var formateDate1 = function () {
        if (!theCurrentDate) {
            var theDate = GetTodayDate();
            // theDate.setDate(theDate.getDate()-1);
            return theDate.getFullYear() + "年" + FormateDateNum(theDate.getMonth() + 1) + "月" + FormateDateNum(theDate.getDate()) + '日';
        }
        return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
    }
    var theXData = [];
    //var theTodayDate=new Date();
    for (var i = 0; i <= 24 * 12; i++) {
        theXData.push(i);
    }
    //debugger;
    /*一类图表基本设置*/
    var option1 = {
        /*title: {
            text: '折线图堆叠'
        },*/

        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: function (point, params, dom, rect, size) {
                // 固定在顶部
                return [point[0], '10%'];
            },
            formatter: function (params) {
                //debugger;
                var theTimeValue = parseInt(params[params.length - 1].name);
                var theHours = Math.floor(theTimeValue / 12) + "点" + (theTimeValue % 12) * 5 + '分';
                //debugger;
                var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[params.length - 1].color + ";\"></span>";

                //var theDate = new Date();
                //theDate.setTime(arg.value);
                //return theHours;//theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                return theHours + '<br/>' + theColorText + params[params.length - 1].data + '万';
            }
        },
        grid: {
            left: 30,
            right: 5,
            top: 30,
            bottom: 10,
            width: 480,
            height: 175,
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
            nameLocation: 'end',
            //interval:12,
            //splitNumber: 24,
            axisLabel: {
                interval: 11,
                formatter: function (value, idx) {
                    //debugger;
                    //return value;
                    if (value % (12 * 4) == 0) {
                        //console.log('x2:'+value/12);
                        //console.log('x:'+value/(60/5));
                        return value / 12;
                    }
                    else {
                        return "";
                    }
                }
            },
            /*axisPointer: {
                label: {
                    show: true,
                    color: '#05cffa',
                    formatter: function (arg) {
                        var theTimeValue = parseInt(arg.value);
                        var theHours = Math.floor(theTimeValue / 12) + "点" + (theTimeValue % 12) * 5 + '分';
                        //debugger;
                        //var theDate = new Date();
                        //theDate.setTime(arg.value);
                        return theHours;//theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                    }
                },
                lineStyle: {
                    color: '#05cffa',
                    shadowBlur: {
                        shadowColor: '#05cffa',
                        shadowBlur: 10
                    }
                }
            },*/
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: 'white'// '#557398'
                }
            },
            data: theXData
        },
        yAxis: {
            type: 'value',
            name: '(人数/万)',
            nameLocation: 'end',
            splitLine: {show: false},
            axisLine: {
                lineStyle: {
                    color: 'white'// '#557398'
                }
            }
        }

    };
    //显示第一行数据
    var formateNum1 = function (value) {
        var theValueStr = value.toFixed(2);
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
                    if (thePos >= theNumberStrArray.length) {
                        break;
                    }
                    else {
                        theCurrentChar = theNumberStrArray[thePos];
                        theFormateArray.push(theCurrentChar)
                    }
                }
                i = i + 2;
                //debugger;
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
                theTemplate += "<div class='num-contain' data-num='"+theCurrent+"'>" + theCurrent + "</div>";
            }
        }
        // theTemplate = theTemplate + "<span class=\"last\">万</span>";
        return theTemplate;
    }

    function PageViewModel() {
        this.initEvent();
        this.initCharts();
        this.loadData();
        this.initChartMap();
        this.start();
    }

    PageViewModel.prototype = new PageViewBase();
    /**
     * 定时任务开始
     */
    PageViewModel.prototype.onTimer = function () {
        console.log("开始刷新数据!");
        this.loadCurrent();
        this.loadPredict();

    }
    PageViewModel.prototype.updateDate = function () {
        $('#date-input').val(formateDate1());
    }
    PageViewModel.prototype.initEvent = function () {
        var me = this;
        this.updateDate();
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
        $('.chart-small').click(function () {
                $('.chart-small').removeClass('chart-big');
                $(this).addClass('chart-big');
                me.Chart4.resize();
                me.Chart6.resize();
            }
        );
        $('.btn-contain .btn').click(
            function () {
                if ($(this).hasClass('active')) {
                    return;
                }
                else {
                    $('.btn-contain .btn').removeClass('active');
                    $(this).addClass('active');
                    $('#chart4').data('mode', $(this).data('mode'));

                    var theData = $('#chart4').data('data') || {};
                    //1 人口总量 2  迁入迁出
                    var theMode = $('#chart4').data('mode') || 1;
                    if (theMode == 1) {
                        me.showChart4(theXData, theData['dataPopulationGd1'] || [], theData['dataPopulationGd2'] || [], theData['dataResi1'] || [], theData['dataResi2'] || [], theMode);
                    }
                    else {
                        me.showChart4(theXData, theData['dataMigOut1'] || [], theData['dataMigOut2'] || [], theData['dataMigIn1'] || [], theData['dataMigIn2'] || [], theMode);
                    }

                }
            }
        );
        // $('#date-action').click(function () {
        //$('#date-input').click();
        /*laydate.render({
            elem: '#date-input', //指定元素
            show: true,
            format: 'yyyy年MM月dd日',
        });*/
        //});
        var me = this;
        //var theDate=new Date();
        // theDate.setDate(theDate.getDate()-1);
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            format: 'yyyy年MM月dd日',
            value: formateDate1(),
            max: GetTodayDate().formate(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate != date) {
                    theCurrentDate = date;
                    me.loadPredict();
                }

            }
        });
        /*$('#date-input').change(function(){
            theCurrentDate=$(this).val();
            console.log('日期变化:'+theCurrentDate);
        });*/
    }
    PageViewModel.prototype.initChartMap = function () {
        if (!this.ChartMap) {
            echarts.registerMap('gd', theGdData);
            this.ChartMap = echarts.init(document.getElementById(theMapId));
        }
        option = null;
        var theCitys = {
            "广州市": [113.264385, 23.129112],
            "深圳市": [114.085947, 22.547],
            "珠海市": [113.553986, 22.224979],
            "汕头市": [116.708463, 23.37102],
            "佛山市": [113.122717, 23.028762],
            "韶关市": [113.597313, 24.811094],
            "河源市": [114.697802, 23.746266],
            "梅州市": [116.117582, 24.299112],
            "惠州市": [114.412599, 23.079404],
            "汕尾市": [115.364238, 22.774485],
            "东莞市": [113.746262, 23.046237],
            "中山市": [113.382391, 22.521113],
            "江门市": [113.094942, 22.590431],
            "阳江市": [111.982697, 21.857415],
            "湛江市": [110.364977, 21.274898],
            "茂名市": [110.919229, 21.659751],
            "肇庆市": [112.472529, 23.051546],
            "清远市": [113.051227, 23.685022],
            "潮州市": [116.632301, 23.661701],
            "揭阳市": [116.355733, 23.543778],
            "云浮市": [112.044439, 22.929801]
        };


        //var color = ['#a6c84c', '#ffa022', '#46bee9'];
        var color = ['#49ffff'];//
        var series = [];


        //选择目标区域
        /* PageView.ChartMap.dispatchAction({
             type: 'geoSelect',
             name: '广州市'
         })*/
        var me = this;
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
                selectedMode: 'single',
                map: 'gd',
                top: 82,
                scaleLimit: {
                    min: 1,
                    max: 1
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
                    position: 'top',
                    distance: 10,
                    show: true,
                    color: 'white',
                    fontSize: 12,
                    emphasis: {
                        color: 'white',
                        fontSize: 20,
                        fontWeight:'bold',

                        show: false
                    }
                },
                roam: false,//鼠标不可移动
                itemStyle: {
                    normal: {//选取前颜色
                        /* areaColor: {
                             type: 'linear',
                             x: 0,
                             y: 0,
                             x2: 0,
                             y2: 1,
                             colorStops: [{
                                 offset: 0, color: '#0033a0'//'#2b7ecc00' // 0% 处的颜色
                             }, {
                                 offset: 1, color: '#006dac'//'#2b7ecc' // 100% 处的颜色
                             }],
                             globalCoord: false // 缺省为 false
                         },*/
                        areaColor: '#00a5ff',
                        borderColor: '#13ffff'
                    },
                    emphasis: {//选取后颜色
                        label: {
                            show: false,
                        },
                        areaColor: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 1, color: '#13ffff'//'#2b7ecc00' // 0% 处的颜色
                            }, {
                                offset: 0, color: '#3fefff'//'#2b7ecc' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },//'#24b1e5'
                    }
                },
                // center: [113.5107, 23.2196],
                zoom: 0.8,


            },
            series: series

        };
        var me = this;
        if (option && typeof option === "object") {
            this.ChartMap.setOption(option, true);
            this.ChartMap.on('geoselectchanged', function (params) {

                if (params.batch.length > 0) {
                    var theAreaSelected = params.batch[0];
                    var theName = theAreaSelected.name;
                    if (theAreaNmae != theName && theAreaSelected.selected[theName]) {
                        theAreaNmae = theName;
                        $('.cityname').text(theAreaNmae);
                        var theCityPos = theCitys[theName];
                        var op = me.ChartMap.getOption();
                        op.series = [];
                        if (theCityPos) {
                            op.series.push(
                                {
                                    // name: item[0] + ' Top10',
                                    type: 'effectScatter',
                                    effectType: 'ripple',
                                    hoverAnimation: false,
                                    coordinateSystem: 'geo',
                                    zlevel: 1,
                                    z: 1,
                                    rippleEffect: {
                                        brushType: 'stroke'
                                    },
                                    symbolSize: function (val) {
                                        return 20;
                                    },
                                    /*label: {
                                        show: true,
                                        formatter: theAreaNmae,
                                        fontSize: 20,
                                        position: 'top',
                                    },*/
                                    itemStyle: {
                                        normal: {
                                            color: 'white',
                                            shadowBlur: 10,
                                            shadowColor: 'white'
                                        }
                                    },
                                    tooltip: {
                                        show: false
                                    },
                                    symbolOffset: [0, '100%'],
                                    data: [{
                                        name: theAreaNmae,
                                        value: theCityPos,
                                    }],
                                }
                            );
                        }
                        me.ChartMap.setOption(op);
                        console.log('选择区域变化，切换到区域' + theAreaNmae);
                        me.loadData();

                    }
                    else {
                        theAreaNmae = "";
                        $('.cityname').text('广东省');
                        var op = me.ChartMap.getOption();
                        op.series = [];
                        me.ChartMap.clear();
                        me.ChartMap.setOption(op);
                        me.loadData();
                    }

                }
                else {
                    console.log('选择区域变化，未找到值');
                }
                //console.log("111",params);
            });
            this.ChartMap.on('mapselectchanged', function (params) {
                var theName = params.name;
                //debugger;
                if (theAreaNmae != theName) {
                    theAreaNmae = theName;
                    me.loadData();
                }
                //console.log(params);
            });

            this.ChartMap.on('click', function (params) {
                // var theName = params.name;
                // console.log(params);
            })
        }

    }

    PageViewModel.prototype.loadChart1 = function (xData, data1, data2) {
        if (!this.Chart1) {
            this.Chart1 = echarts.init(document.getElementById('chart1'));
        }
        /* var theXData = [];
         for (var i = 0; i <= 24; i++) {
             theXData.push(i);
         }*/
        data1 = data1 || [];
        data2 = data2 || [];
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        theCurrentOption.series = [

            {
                //name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                symbol: 'none',
                data: data1.map(function (item) {
                    return (item / 10000).toFixed(2);
                }),
                color: '#ffff8b',
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: formateRgba('#ffff8b',0.3)// 'rgba(255,220,111,0.3)'
                            }, {
                                offset: 0.5, color:formateRgba('#ffff8b',0.15)// 'rgba(255,220,111,0.15)'
                            }, {
                                offset: 1, color: formateRgba('#ffff8b',0)//'rgba(255,220,111,0)'
                            }]
                        }
                    }
                },
                /*lineStyle: {
                    normal: {
                        color: '#ffdc6f'
                    }
                }*/
            },
            {
                //name: '搜索引擎',
                type: 'line',
                color: '#ffdc6f',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,

                            type: 'dotted'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                smooth: true,
                //stack: '总量',
                data: data2.map(function (item) {
                    return (item / 10000).toFixed(2)
                })
            }
        ]
        this.Chart1.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart2 = function (xData, data1, data2) {
        if (!this.Chart2) {
            this.Chart2 = echarts.init(document.getElementById('chart2'));
        }
        data1 = data1 || [];
        data2 = data2 || [];
        //debugger;
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        //theCurrentOption.yAxis.axisLine.onZero=true;
        theCurrentOption.series = [

            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                symbol: 'none',
                data: data1.map(function (item) {
                    return (item / 10000).toFixed(2);
                }),
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
                //  name: '搜索引擎',
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
                data: data2.map(function (item) {
                    return (item / 10000).toFixed(2)
                })
            }
        ];

        this.Chart2.setOption(theCurrentOption);

    }
    PageViewModel.prototype.loadChart3 = function (xData, data1, data2) {
        if (!this.Chart3) {
            this.Chart3 = echarts.init(document.getElementById('chart3'));
        }
        data1 = data1 || [];
        data2 = data2 || [];
        //debugger;
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                symbol: 'none',
                color: '#32ff4b',
                data: data1.map(function (item) {
                    return (item / 10000).toFixed(2);
                }),
                lineStyle: {
                    normal: {
                        //rgba(50,255,75
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
                //name: '搜索引擎',
                type: 'line',
                color: '#32ff4b',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,

                            type: 'dotted'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                smooth: true,
                //stack: '总量',
                data: data2.map(function (item) {
                    return (item / 10000).toFixed(2)
                })
            }
        ];
        this.Chart3.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart4 = function (theXData, dataPopulationGd1, dataMigIn1, dataMigOut1, dataPopulationGd2, dataMigIn2, dataMigOut2, dataResi1, dataResi2) {
        dataPopulationGd1 = dataPopulationGd1 || [];
        dataPopulationGd2 = dataPopulationGd2 || [];
        dataResi1 = dataResi1 || [];
        dataResi2 = dataResi2 || [];

        dataMigIn1 = dataMigIn1 || [];
        dataMigOut1 = dataMigOut1 || [];
        dataMigIn2 = dataMigIn2 || [];
        dataMigOut2 = dataMigOut2 || [];

        //return;
        $('#chart4,#chart6').data('data',
            {
                dataPopulationGd1: dataPopulationGd1,
                dataPopulationGd2: dataPopulationGd2,
                dataResi1: dataResi1,
                dataResi2: dataResi2,
                dataMigIn1: dataMigIn1,
                dataMigOut1: dataMigOut1,
                dataMigIn2: dataMigIn2,
                dataMigOut2: dataMigOut2
            });
        //1 人口总量 2  迁入迁出
        var theMode = $('#chart4').data('mode') || 1;
        this.showChart4(theXData, dataPopulationGd1, dataPopulationGd2, dataResi1, dataResi2, 1);
        this.showChart6(theXData, dataMigOut1, dataMigOut2, dataMigIn1, dataMigIn2, 2);
        /*if (theMode == 1) {
            this.showChart4(theXData,  dataPopulationGd1, dataPopulationGd2,dataResi1, dataResi2, theMode);
        }
        else {
            this.showChart6(theXData, dataMigOut1, dataMigOut2, dataMigIn1, dataMigIn2, theMode);
        }*/

    }
    /**
     *
     * @param theXData
     * @param data11
     * @param data12
     * @param data21
     * @param data22
     * @param theMode  //1 人口总量 2  迁入迁出
     */
    PageViewModel.prototype.showChart4 = function (theXData, data11, data12, data21, data22, theMode) {
        if (!this.Chart4) {
            this.Chart4 = echarts.init(document.getElementById('chart4'));
        }
        //var theModel =;
        //1 人口总量 2  迁入迁出
        var theMode = $('.chart-big').data('mode');

        var theBeginDate = new Date('2019-01-21');
        var theXData = [];
        var theColors = ['#ff8155',
            '#4ffd5f'];

        var theLegends = [
            {name: '人口总量', textStyle: {color: "#ff8155", fontSize: 16}},
            {name: '常驻人口', textStyle: {color: "#4ffd5f", fontSize: 16}},
        ];
        var theName1 = "人口总量";
        var theName2 = "常驻人口";
        /*if (theMode == 2) {
            theName1 = "迁出";
            theName2 = "迁入";
            theLegends = [
                {name: '迁出', textStyle: {color: "#32ff4b", fontSize: 16}},
                {name: '迁入', textStyle: {color: "#4293f2", fontSize: 16}}
            ];
        }*/
        theXData.push(theBeginDate.getTime());
        for (var i = 1; i < 40; i++) {
            theBeginDate.setDate(theBeginDate.getDate() + 1);
            theXData.push(theBeginDate.getTime());
        }
        var option = {
            tooltip: {
                trigger: 'axis',
                //show:true,
                axisPointer: {
                    type: 'line',
                    show: true,
                    label: {
                        // show: true
                    }
                },
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: function (point, params, dom, rect, size) {
                    // 固定在顶部
                    return [point[0], '10%'];
                },
                formatter: function (params) {
                    var theIndex = 0;
                    var theDatas = [];
                    //var theText = "";
                    if (params.length > 4) {
                        for (var i = 0; i < params.length; i = i + 2) {

                            var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                            theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    else {
                        for (var i = 0; i < params.length; i = i + 1) {
                            // debugger;
                            var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                            theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    var theDate = new Date();
                    theDate.setTime(params[0].name);
                    var theNameText = theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                    //debugger;
                    return theNameText + "<br/>" + theDatas.join('<br />');
                }
            },

            legend:  {
                //align:'right',//
                top: 15,
                left: 600,
                data:theLegends
            },
            color: theColors,
            grid: {
                left: 0,
                right: 40,
                top: 30,
                bottom: 5,
                width: 954,
                height: 216,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                name: '(日期)',
                axisLine: {
                    lineStyle: {
                        color: 'white'// '#557398'
                    }
                },
                /*axisPointer: {
                    label: {
                        color: '#05cffa',
                        formatter: function (arg) {
                            //debugger;
                            var theDate = new Date();
                            theDate.setTime(arg.value);
                            return theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                        }
                    },
                    lineStyle: {
                        color: '#05cffa',
                        shadowBlur: {
                            shadowColor: '#05cffa',
                            shadowBlur: 10
                        }
                    }
                },*/
                axisLabel: {
                    rotate: 30,
                    formatter: function (value, idx) {
                        var theDate = new Date();
                        theDate.setTime(parseInt(value));
                        console.log(theDate);
                        if (idx % 4 == 0) {
                            return theDate.getMonth() + 1 + '月' + theDate.getDate() + "日";
                        }
                        else {
                            return "";
                        }
                    }
                },
                data: theXData
            },
            yAxis: {
                type: 'value',
                name: '(人数/万)',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: 'white'// '#557398'
                    }
                }
            },
            series: [

                {
                    name: theName1,
                    type: 'line',
                    symbol: 'none',
                    //stack: '总量',
                    color: '#ff8155',
                    smooth: true,
                    data: data11.map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    lineStyle: {
                        normal: {
                            //rgba(66,147,242
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
                                    offset: 0, color: formateRgba('#32ff4b', 0.3)//'rgba(66,147,242,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba('#32ff4b', 0.15)//'rgba(66,147,242,0.15)'
                                }, {
                                    offset: 1, color: formateRgba('#32ff4b', 0)// 'rgba(66,147,242,0)'
                                }]
                            }
                        }
                    },
                },
                {
                    name: theName1,
                    type: 'line',
                    symbol: 'none',
                    color: '#ff8155',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,

                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: data12.map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                },
                {
                    name: theName2,
                    type: 'line',
                    symbol: 'none',
                    z: 1,
                    color: '#4ffd5f',
                    //stack: '总量',
                    smooth: true,
                    data: data21.map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    lineStyle: {
                        normal: {
                            //rgba(55,255,75
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
                                    offset: 0, color: formateRgba('#4293f2', 0.3)// 'rgba(55,255,75,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba('#4293f2', 0.15)// 'rgba(55,255,75,0.15)'
                                }, {
                                    offset: 1, color: formateRgba('#4293f2', 0)// 'rgba(55,255,75,0)'
                                }]
                            }
                        }
                    },
                },
                {
                    name: theName2,
                    symbol: 'none',
                    z: 2,
                    type: 'line',
                    color: '#4ffd5f',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,

                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: data22.map(function (item) {
                        return (item / 10000).toFixed(2)
                    })
                },
            ]
        };
        // debugger;
        this.Chart4.setOption(option);
        //this.Chart4.resize();


    }

    PageViewModel.prototype.showChart6 = function (theXData, data11, data12, data21, data22, theMode) {
        if (!this.Chart6) {
            this.Chart6 = echarts.init(document.getElementById('chart6'));
        }
        var theMode = $('.chart-big').data('mode');
        //1 人口总量 2  迁入迁出
        var theMode = theMode;

        var theBeginDate = new Date('2019-01-21');
        var theXData = [];
        var theColors = ['#ff8155',
            '#4ffd5f'];

        theName1 = "迁出";
        theName2 = "迁入";
        theLegends = [

            {name: '迁出', textStyle: {color: "#ff8155", fontSize: 16}},
            {name: '迁入', textStyle: {color: "#4ffd5f", fontSize: 16}}
        ];
        theXData.push(theBeginDate.getTime());
        for (var i = 1; i < 40; i++) {
            theBeginDate.setDate(theBeginDate.getDate() + 1);
            theXData.push(theBeginDate.getTime());
        }

        var option = {
            tooltip: {
                trigger: 'axis',
                //show:true,
                axisPointer: {
                    type: 'line',
                    show: true,
                    label: {
                        // show: true
                    }
                },
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: function (point, params, dom, rect, size) {
                    // 固定在顶部
                    return [point[0], '10%'];
                },
                formatter: function (params) {
                    var theIndex = 0;
                    var theDatas = [];
                    //var theText = "";
                    if (params.length > 4) {
                        for (var i = 0; i < params.length; i = i + 2) {

                            var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                            theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    else {
                        for (var i = 0; i < params.length; i = i + 1) {
                            // debugger;
                            var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                            theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    var theDate = new Date();
                    theDate.setTime(params[0].name);
                    var theNameText = theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                    //debugger;
                    return theNameText + "<br/>" + theDatas.join('<br />');
                }
            },

             legend:  {
            //align:'right',//
            top: 15,
                left: 600,
                data:theLegends
        },
            color: theColors,
            grid: {
                left: 30,
                right: 40,
                top: 30,
                bottom: 5,
                width: 924,
                height: 216,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                name: '(日期)',
                axisLine: {
                    lineStyle: {
                        color: 'white'// '#557398'
                    }
                },

                axisLabel: {
                    rotate: 30,
                    formatter: function (value, idx) {
                        var theDate = new Date();
                        theDate.setTime(parseInt(value));
                        console.log(theDate);
                        if (idx % 4 == 0) {
                            return theDate.getMonth() + 1 + '月' + theDate.getDate() + "日";
                        }
                        else {
                            return "";
                        }
                    }
                },
                data: theXData
            },
            yAxis: {
                type: 'value',
                name: '(人数/万)',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: 'white'// '#557398'
                    }
                }
            },
            series: [

                {
                    name: theName1,
                    type: 'line',
                    symbol: 'none',
                    //stack: '总量',
                    color: '#ff8155',
                    smooth: true,
                    data: data11.map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    lineStyle: {
                        normal: {
                            //rgba(66,147,242
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
                                    offset: 0, color: formateRgba('#32ff4b', 0.3)//'rgba(66,147,242,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba('#32ff4b', 0.15)//'rgba(66,147,242,0.15)'
                                }, {
                                    offset: 1, color: formateRgba('#32ff4b', 0)// 'rgba(66,147,242,0)'
                                }]
                            }
                        }
                    },
                },
                {
                    name: theName1,
                    type: 'line',
                    symbol: 'none',
                    color: '#ff8155',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,

                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: data12.map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                },
                {
                    name: theName2,
                    type: 'line',
                    symbol: 'none',
                    z: 1,
                    color: '#4ffd5f',
                    //stack: '总量',
                    smooth: true,
                    data: data21.map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    lineStyle: {
                        normal: {
                            //rgba(55,255,75
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
                                    offset: 0, color: formateRgba('#4293f2', 0.3)// 'rgba(55,255,75,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba('#4293f2', 0.15)// 'rgba(55,255,75,0.15)'
                                }, {
                                    offset: 1, color: formateRgba('#4293f2', 0)// 'rgba(55,255,75,0)'
                                }]
                            }
                        }
                    },
                },
                {
                    name: theName2,
                    symbol: 'none',
                    z: 2,
                    type: 'line',
                    color: '#4ffd5f',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,

                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    smooth: true,
                    //stack: '总量',
                    data: data22.map(function (item) {
                        return (item / 10000).toFixed(2)
                    })
                },
            ]
        };
        // debugger;
        this.Chart6.setOption(option);
        //this.Chart6.resize();


    }
    PageViewModel.prototype.loadChart5 = function (xData, data1) {
        if (!this.Chart5) {
            this.Chart5 = echarts.init(document.getElementById('chart5'));
        }
        //debugger;
        data1 = data1 || [];
        //debugger;
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        theCurrentOption.yAxis.axisLine.onZero = true;
        theCurrentOption.series = [

            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                color: '#13ffff',
                symbol: 'none',
                data: data1.map(function (item) {
                    return (item / 10000).toFixed(2);
                }),
                lineStyle: {
                    normal: {
                        // color: '#4293f2' //rgba(66,147,242
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
                                offset: 0, color: formateRgba('#13ffff',0.3),// 'rgba(66,147,242,0.3)'
                            }, {
                                offset: 0.5, color:formateRgba('#13ffff',0.15),//
                            }, {
                                offset: 1, color: formateRgba('#13ffff',0),//
                            }]
                        }
                    }
                },
            },
        ];

        this.Chart5.setOption(theCurrentOption);

    }
    PageViewModel.prototype.initCharts = function () {
        this.loadChart1()
        //this.loadChart2()
        //this.loadChart3()
        this.loadChart4();
        this.loadChart5();

    }

    PageViewModel.prototype.loadData = function () {
        //debugger;
        this.loadCurrent();
        this.loadHistoricalTrend();
        this.loadPredict();
    }
    /***
     * 迁徙实时人流接口
     */
    PageViewModel.prototype.loadCurrent = function () {
        var theCallUrl = "migrant/current.do";
        var theCallAreaName = theAreaNmae;
        var theCallAreaId = this.getAreaCode(theCallAreaName) || '广东省';
        var theCallArgument = {cityCode: theCallAreaId};
        var me = this;
        // debugger;
        me.bind('.numpart', {"populationGd": 0, "populationIn": 0, "populationOut": 0});
        this.load(theCallUrl, theCallArgument, function (data) {

            if (data && data.isSuccess) {
                var theResultDatas = data.data;
                var theViewData = {};
                if (theResultDatas && theResultDatas.length > 0) {
                    var theResultData = theResultDatas[0];
                    //可能出现空值 加入判断
                    //debugger;
                    if (theResultData) {
                        $.extend(true, theViewData, theResultData);
                    }
                    theViewData.populationGd = (theViewData.populationGd || 0) / 10000;
                    theViewData.populationIn = ((theViewData.populationIn || 0) / 10000).toFixed(2); //保留两位小数
                    theViewData.populationOut = ((theViewData.populationOut || 0) / 10000).toFixed(2); //保留两位小数
                    // ↑↓
                    var theSuStr = "↑";
                    if (theViewData.populationIn < 0) {
                        theSuStr = "↓";
                    }
                    else {
                        if (theViewData.populationIn == 0) {
                            theSuStr = "";
                        }
                    }
                    theViewData['populationGd'] = formateNum1(theViewData.populationGd);

                    //theSuStr+
                    //debugger;
                    $('#populationOut').removeClass('red');
                    $('#populationOut').removeClass('green');
                    if (theSuStr == '↑') {
                        $('#populationOut').addClass('red');
                    }
                    if (theSuStr == '↓') {
                        $('#populationOut').addClass('green');
                    }
                    theViewData.populationOut = theSuStr + Math.abs(theViewData.populationOut);
                }
                me.bind('.numpart', theViewData);
                //
                if(!me.NumbersEffect){
                    me.NumbersEffect= new NumbersEffect('.numpart');
                }
                me.NumbersEffect.restart();
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
        });
    }
    /**
     * 历史趋势接口
     */
    PageViewModel.prototype.loadHistoricalTrend = function () {
        var theCallUrl = "migrant/historicalTrend.do ";
        var theCallAreaName = theAreaNmae;
        var theCallAreaId = this.getAreaCode(theCallAreaName) || '广东省';
        var theCallArgument = {
            cityCode: theCallAreaId
        };
        var me = this;
        this.load(theCallUrl, theCallArgument, function (data) {
            if (data && data.isSuccess) {
                //debugger;
                var theResultDatas = data.data.dataList || data.data;//数据长度设置
                //provinceCity， ratio
                var thePredictCityRatioList = eval(data.data.predictCityRatio);//比例设置
                var thePredictList = data.data.predictList;//预测数据
                /*
                countNum: 151289016
                id: 201
                inNum: 3199341
                outNum: 4844850
                statDate: "2019-01-21"
                * */
                var dataMigOut1 = [];
                var dataMigIn1 = [];
                var dataPopulationGd1 = [];
                var dataMigOut2 = [];
                var dataMigIn2 = [];
                var dataPopulationGd2 = [];

                var dataResi1 = [];
                var dataResi2 = [];
                var data4 = [];
                var theXData = [];
                var thePreditDate = new Date('2019-01-20');
                var theBeginDate = new Date('2019-01-21');
                for (var i = 0; i < theResultDatas.length; i++) {
                    var theDataItem = theResultDatas[i];
                    var tehDataDate = theDataItem['statDate'];
                    var theDate = me.parserDate(tehDataDate);
                    if (theDate.getTime() < theBeginDate.getTime()) {
                        continue;
                    }
                    theXData.push(tehDataDate);

                    thePreditDate = theDate;
                    // if (theDate.getTime() <= new Date().getTime())
                    {
                        dataMigOut1.push(theDataItem.migOut || 0);
                        dataMigIn1.push(theDataItem.migIn || 0);
                        dataPopulationGd1.push(theDataItem.populationGd || 0);
                        dataResi1.push(theDataItem.populationResi || 0);
                    }
                    /*dataMigOut2.push('-');
                    dataMigIn2.push('-');
                    dataPopulationGd2.push('-');
                    dataResi2.push('-');*/

                    dataMigOut2.push(theDataItem.migOut || 0);
                    dataMigIn2.push(theDataItem.migIn || 0);
                    dataPopulationGd2.push(theDataItem.populationGd || 0);
                    dataResi2.push(theDataItem.populationResi || 0);
                }
                if (thePreditDate) {
                    thePreditDate = thePreditDate.next(1);
                }
                var theRate = 1;
                if (thePredictCityRatioList && theAreaNmae) {
                    for (var i = 0; i < thePredictCityRatioList.length; i++) {
                        var theItem = thePredictCityRatioList[i];
                        if (theItem.provinceCity + '市' == theAreaNmae) {
                            theRate = parseFloat(theItem.ratio || '0');
                            break;
                        }
                    }
                }
                //debugger;
                if (thePredictList && thePredictList.length > 0) {
                    for (var i = 0; i < thePredictList.length; i++) {
                        var theItem = thePredictList[i];
                        var theDate = new Date(theItem.statDate);
                        if (theDate.getTime() >= thePreditDate.getTime()) {
                            /*
               countNum: 151289016
               id: 201
               inNum: 3199341
               outNum: 4844850
               statDate: "2019-01-21"
               * */
                            // debugger;
                            dataPopulationGd2.push((theItem.countNum || 0) * theRate);
                            dataMigIn2.push((theItem.inNum || 0) * theRate);
                            dataMigOut2.push((theItem.outNum || 0) * theRate);
                            dataResi2.push((theItem.populationResi || 0) * theRate);
                        }
                    }
                }
                //debugger;
                me.loadChart4(theXData, dataPopulationGd1, dataMigIn1, dataMigOut1, dataPopulationGd2, dataMigIn2, dataMigOut2, dataResi1, dataResi2);
                //this.bind('.numpart', theViewData);
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
        });
    }
    /**
     * 迁徙预测接口
     */
    PageViewModel.prototype.loadPredict = function () {
        var theCallUrl = "migrant/predict.do ";
        var theCallAreaName = theAreaNmae;
        var theCallAreaId = this.getAreaCode(theCallAreaName) || '广东省';

        var theCallArgument = {
            cityCode: theCallAreaId,
            date: ''
        };
        /*if (theCurrentDate) {
            theCallArgument.date =formateDate();// theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//  'YYYY-mm-dd'
        }*/
        theCallArgument.date = formateDate();

        var me = this;
        this.load(theCallUrl, theCallArgument, function (data) {
            //debugger;
            var theDataList = [];
            var theLastData = null;
            if (data && data.isSuccess) {
                var theResultDatas = data.data;//数据长度
                var dataMigOut1 = [];
                var dataMigIn1 = [];
                var dataPopulationGd1 = [];
                var dataMigOut2 = [];
                var dataMigIn2 = [];
                var dataPopulationGd2 = [];
                var theXData = [];
                var data4 = [];
                var theCurrentDate = new Date();
                for (var i = 0; i < theResultDatas.length; i++) {
                    var theDataItem = theResultDatas[i];
                    var tehDataDate = theDataItem['statDate'];
                    var theDate = me.parserDate(tehDataDate);

                    if (theDate.getTime() <= theCurrentDate.getTime()) {
                        dataMigOut1.push(theDataItem.outNum);
                        dataMigIn1.push(theDataItem.inNum);
                        dataPopulationGd1.push(theDataItem.countNum);
                    }
                    dataMigOut2.push(theDataItem.outNum);
                    dataMigIn2.push(theDataItem.inNum);
                    dataPopulationGd2.push(theDataItem.countNum);
                    if (theLastData == null) {
                        theDataList.push(0);
                    }
                    else {
                        theDataList.push(theDataItem.countNum - theLastData);
                    }
                    theLastData = theDataItem.countNum;
                }
                //debugger;
                me.loadChart1(theXData, dataPopulationGd1, dataPopulationGd2);
                me.loadChart5(theXData, theDataList);
                //me.loadChart2(theXData,dataMigOut1, dataMigOut2 );
                //me.loadChart3(theXData, dataMigIn1, dataMigIn2);
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
        });
    }
    window.PageView = new PageViewModel();
})