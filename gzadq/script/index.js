$(function () {
    var theIntervals = 1000 * 60 * 5;
    //视图类型
    var ViewType = {
        OUT: "OUT",//迁出洞察
        IN: "IN",//迁入洞察
        PROVINCE: "PROVINCE"//省内迁徙
    };
    //迁徙方向
    var DirectionType = {
        SHENG: "SHENG",//省
        GAT: "GAT",//港澳台
        JW: "JW"//境外
    }
    var PageNameDic = {
        "SHENG": "qxdc_province.html",
        "COUNTRY": "qxdc_country.html",
        "GAT": "qxdc_video.html",
        "JINGWAI": "qxdc_video.html",
    }
    var theCurrentView = "";
    var theDirection = "";
    var isStopRefresh = true;
    var theTimer = null;
    var theCurrentDate = null;

    function PageViewModel() {

        this.initEvent();
        this.start();
        this.initMap(1);
    }

    PageViewModel.prototype = new PageViewBase();
    /**
     * 初始化页面事件
     */
    PageViewModel.prototype.initEvent = function () {

        var theChartIndex = 0;
        $('.chart-item').each(function () {
            // debugger;
            var theData = $(this).data();
            if (theData['name']) {

                new ChartHuan(this, theChartIndex++);
            }
        });

        $('#date-action').click(function () {
            //$('#date-input').click();
            laydate.render({
                elem: '#date-input', //指定元素
                show: true,

            });
        });
        $('#date-action1').click(function () {
            //$('#date-input').click();
            laydate.render({
                elem: '#date-input1', //指定元素
                show: true,

            });
        });
        var me = this;
        //debugger;
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            range:true,//范围选择
            //value: new Date(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate != date) {
                    theCurrentDate = date;
                    // me.loadPredict();
                }

            }
        });
        laydate.render({
            elem: '#date-input1', //指定元素
            trigger: 'click',
            //range: true,//范围选择
            value: new Date(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate != date) {
                    theCurrentDate = date;
                    // me.loadPredict();
                }

            }
        });
    }


    window.PageView = new PageViewModel();
})



$(function () {
    var theMapId = "mapbase";
    var theChar1Id = "chart1";
    var theChar2Id = "chart2";
    var theChar3Id = "chart3";
    var theChar4Id = "chart4";
    //var theGdData = GdGeoJson;
    //当前选择的时间
    var theCurrentDate = null;
    //当前的区域名称
    var theAreaNmae = "";

    var theXData = [];
    for (var i = 1; i <= 24; i++) {
        theXData.push(i);
    }
    /*一类图表基本设置*/
    var option1 = {
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
        grid: {
            left:92,
            right: 5,
            top: 30,
            bottom: 5,
            width: 620,
            height: 130,
            containLabel: true
        },

        xAxis: {
            type: 'category',
            name: '(时点)',
            nameLocation: 'end',
            //splitNumber: 5,
            axisTick: {show: false},
            axisLabel: {
                interval:0,
                rotate:40,

            },
            boundaryGap: false,

            axisLine: {
                lineStyle: {
                    color: '#557398'
                }
            },
            data : ['0','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00']
            //data: theXData
        },
        yAxis: {
            type: 'value',
            name: '(时长/分钟)',
            nameLocation: 'end',
            splitLine: {show: false},

            axisLine: {
                lineStyle: {
                    color: '#557398'
                }
            }
        }

    };
    //显示第一行数据
    var formateNum1 = function (value) {
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
                    if (thePos >= theNumberStrArray.length) {
                        break;
                    }
                    else {
                        theCurrentChar = theNumberStrArray[thePos];
                        theFormateArray.push(theCurrentChar)
                    }
                }
                i = i + 2;
                if (i + 1 <= theNumberStrArray.length) {
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


    PageViewModel.prototype.loadChart1 = function (xData, data1, data2) {
        if (!this.Chart1) {
            this.Chart1 = echarts.init(document.getElementById('chart1'));
        }
        var theXData = [];
        for (var i = 0; i <= 17; i++) {
            theXData.push(i);
        }
        var theCurrentOption = {};
        $.extend(theCurrentOption, option1);


        theCurrentOption.series = [

            {
                //name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                data: data1||[52, 55, 56, 67, 54, 62],
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
                        color: '#FEDC6E'
                    }
                }
            },
            {
                //name: '搜索引擎',
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
                data:data2|| [52, 55, 56, 67, 54, 62]
            }
        ]
        this.Chart1.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart2 = function (xData, data1, data2) {
        if (!this.Chart2) {
            this.Chart2 = echarts.init(document.getElementById('chart2'));
        }
        var theCurrentOption = {};
        $.extend(theCurrentOption, option1);
        theCurrentOption.legend= {
            data:[{name:'每日客流',textStyle:{color:"#85a8b8"}},{name:'香港>>珠海澳门',textStyle:{color:"#85a8b8"}},{name:'珠海澳门>>香港',textStyle:{color:"#85a8b8"}}
            // x:'left',
            //padding:50,
        ]
        },
            theCurrentOption.yAxis=[{
                name:'（人数/万）',
                type: 'value',
                nameLocation: 'end',
                splitLine: {show: false},

                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                }
            }]
        theCurrentOption.series = [

            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                name:'每日客流',
                itemStyle:{
                    color:'#d1b96b'
                },
                //tooltip:{
                //    backgroundColor: 'red',
                //},
                smooth: true,
                data:data1|| [820, 932, 901, 934, 1290, 1330] ,
                lineStyle: {
                    normal: {
                        color: '#d1b96b' //rgba(66,147,242
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
                name:'香港>>珠海澳门',

                itemStyle: {

                    normal: {
                        color:'#357acb',
                        lineStyle: {

                            width: 2,
                            color: '#357acb',
                            type: 'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                smooth: true,
                //stack: '总量',
                data: data2||[420, 532, 601,534, 890, 930, 1320]
            },
            {
                //  name: '搜索引擎',
                type: 'line',
                name:'珠海澳门>>香港',
                itemStyle: {
                    normal: {
                        color:'#219553',
                        lineStyle: {

                            width: 2,
                            color: '#219553',
                            type: 'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                smooth: true,
                //stack: '总量',
                data: data2||[150, 232, 251,124, 110, 220, 320]
            }
        ];

        this.Chart2.setOption(theCurrentOption);

    }

    PageViewModel.prototype.loadChart3 = function (xData, data1, data2) {
        if (!this.Chart3) {
            this.Chart3 = echarts.init(document.getElementById('chart3'));
        }
        var theCurrentOption = {};
        $.extend(theCurrentOption, option1);
        theCurrentOption.legend= {
            data:[{name:'每日客流',textStyle:{color:"#85a8b8"}},{name:'观光客流',textStyle:{color:"#85a8b8"}}]
        },
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                name:'每日客流',
                smooth: true,
                data: data1||[820, 932, 901, 934, 1290, 1330] ,
                itemStyle:{color: '#d1b96b'},
                lineStyle: {
                    normal: {
                        color: '#d1b96b'//rgba(50,255,75
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
                //  name: '搜索引擎',
                type: 'line',
                name:'观光客流',

                itemStyle: {

                    normal: {
                        color:'#357acb',
                        lineStyle: {

                            width: 2,
                            color: '#357acb',
                            type: 'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                smooth: true,
                //stack: '总量',
                data: data2||[420, 532, 601,534, 890, 930, 1320]
            }

        ];
        this.Chart3.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart4 = function (xData, data1, data2) {
        if (!this.Chart4) {
            this.Chart4 = echarts.init(document.getElementById('chart4'));
        }
        var theCurrentOption = {};
        $.extend(theCurrentOption, option1);
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                data: data1||[820, 932, 901, 934, 1290, 1330] ,
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

        ];
        this.Chart4.setOption(theCurrentOption);
    }

    PageViewModel.prototype.initCharts = function () {
        this.loadChart1()
        this.loadChart2()
        this.loadChart3()
        this.loadChart4()

    }

    PageViewModel.prototype.loadData = function () {
        //debugger;
        //this.loadCurrent();
        this.loadHistoricalTrend();
        this.loadPredict();
    }

    window.PageView = new PageViewModel();
})