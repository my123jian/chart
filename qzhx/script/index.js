$(function () {
    var theMapId = "mapbase";
    var theChar1Id = "chart1";
    var theChar2Id = "chart2";
    var theChar3Id = "chart3";
    var theChar4Id = "chart4";
    var theViewType = 1;
    //var theGdData = GdGeoJson;
    //当前选择的时间
    var theCurrentDate = null;
    var theCurrentDate1 = null;
    //当前的区域名称
    var theAreaNmae = "";
    var belongType = 2;
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
                var theDatas = [];
                if (params.length > 1) {
                    for (var i = 0; i < params.length; i++) {
                        theDatas.push(params[i].seriesName + ':' + params[i].data + "万");
                    }
                } else {
                    for (var i = 0; i < params.length; i++) {
                        theDatas.push(params[i].data + "万");
                    }
                }
                return theDatas.join('<br />');
            }
        },
        grid: {
            left: 92,
            right: 5,
            top: 30,
            bottom: 5,
            width: 560,
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
                interval: 0,
                //rotate:40,

            },
            boundaryGap: false,

            axisLine: {
                lineStyle: {
                    color: '#557398'
                }
            },
            axisPointer: {
                label: {
                    show: true,
                    color: '#05cffa',
                    formatter: function (arg) {
                        return arg.value;
                    }
                },
                lineStyle: {
                    color: '#05cffa',
                    shadowBlur: {
                        shadowColor: '#05cffa',
                        shadowBlur: 10
                    }
                }
            },
            data: ['0', '12-28', '12-29', '12-30', '1-01', '1-02', '1-03', '1-04']
            //data: theXData
        },
        yAxis: {
            min: '0',
            // max: '30',
            type: 'value',
            name: '(人数/万)',
            nameLocation: 'end',
            splitLine: {show: false},

            axisLine: {
                lineStyle: {
                    color: '#557398'
                }
            }
        }

    };

    //获取当前的日期数据
    var formateDate = function () {
        if (!theCurrentDate) {
            return GetTodayDate().before(2).formate();
        }
        return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
    }

    var formateNum = function (num) {
        var theNumString = num + "";
        var theStringArrays = [];
        for (var i = 0; i < theNumString.length; i++) {
            theStringArrays.push(theNumString[i]);
        }
        theStringArrays = theStringArrays.reverse();
        var theResultArrays = [];
        for (var i = 0; i < theStringArrays.length; i++) {

            if (i > 0 && i % 3 == 0) {
                theResultArrays.push(',');
            }
            theResultArrays.push(theStringArrays[i]);
        }
        return theResultArrays.reverse().join('');
    }
    var formateDate1 = function () {
        //debugger;
        if (!theCurrentDate1) {
            var theDate = GetFromDate();
            var theBeginDay = theDate.getDay();
            var theBeginDate = theDate.addDays(-theBeginDay);
            var theEndDate = theBeginDate.addDays(6);
            return theBeginDate.getFullYear() + "-" + FormateDateNum(theBeginDate.getMonth() + 1) + "-" + FormateDateNum(theBeginDate.getDate()) + " - " +
                theEndDate.getFullYear() + "-" + FormateDateNum(theEndDate.getMonth() + 1) + "-" + FormateDateNum(theEndDate.getDate());
        }
        return theCurrentDate1;//theCurrentDate.year + '-' + theCurrentDate.month + '-' + theCurrentDate.date;//
    }

    function PageViewModel() {
        this.initEvent();
        this.initCharts();
        this.initMap(2);
        this.loadData();
    }


    PageViewModel.prototype = new PageViewBase();
    /**
     * 定时任务开始
     */
    PageViewModel.prototype.onTimer = function () {
        console.log("开始刷新数据!");
    }

    PageViewModel.prototype.initEvent = function () {
        var me = this;
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            max: GetTodayDate().formate(),
            value: formateDate(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate != date) {
                    theCurrentDate = date;
                    me.loadPart1();
                }

            }
        });
        laydate.render({
            elem: '#date-input1', //指定元素
            trigger: 'click',
            range: true,//范围选择
            value: formateDate1(),
            max: GetTodayDate().formate(),
            done: function (value, date, endDate) {
                //debugger;
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(value); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate1 != value) {
                    theCurrentDate1 = value;
                    me.loadPart2();
                }

            }
        });
        $('.datediv,.datediv1').click(function (e) {
            //debugger;
            e.stopPropagation();
        });
        //右边tab栏点击切换
        var theParentContent = $('.tab-main').closest('.content');
        $('.tab-main .tab-item-left').click(function () { //firstline
            //var parent=$(this).parent();
            var theIndex = $(this).data('index');
            $('.tab-main .tab-item-right').addClass('select_a');
            $('.tab-main .tab-item-left').removeClass('select_a');
            $('.datediv,.dateline').show();
            $('.datediv1,.dateline1').hide();
            theViewType = theIndex;

            $(theParentContent).find('.part1').hide();
            $(theParentContent).find('.part2').hide();
            $(theParentContent).find('.part-' + theIndex).show();

            me.loadPart1();
        });
        $('.tab-main .tab-item-right').click(function () {//firstline
            //var parent=$(this).parent();
            var theIndex = $(this).data('index');
            $('.tab-main .tab-item-left').addClass('select_a');
            $('.tab-main .tab-item-right').removeClass('select_a');
            $('.datediv,.dateline').hide();
            $('.datediv1,.dateline1').show();


            $(theParentContent).find('.part1').hide();
            $(theParentContent).find('.part2').hide();
            $(theParentContent).find('.part-' + theIndex).show();
            me.loadPart2();
            //debugger;

        });
        $('.tab-direction .tab-left,.tab-direction .tab-right').click(function () {
            var theIndex = $(this).data('index');
            $('.tab-direction div').removeClass('select');
            $('.tab-direction').removeClass('tab-imgage1');
            $('.tab-direction').removeClass('tab-imgage2');
            $('.tab-direction').addClass('tab-imgage' + theIndex);
            $(this).addClass('select');
        });

        $('.guishu .tab-item').click(function () {
            var theIndex = $(this).data('index');
            $('.tab-item').removeClass('active');
            $(this).addClass('active');
            belongType = theIndex;
            me.loadzQzBelongType(theIndex);
        });
        $('#weather-open').click(function () {
            $('.left-weather').hide();
            $('.weather-content').show()
        });
        $('#weather-close').click(function () {
            $('.weather-content').hide();
            $('.left-weather').show()
        });
    }

    /**
     * 开始加载数据
     */
    PageViewModel.prototype.loadData = function () {
        if (theViewType == 1) {
            this.loadPart1();
        }
        else {
            this.loadPart2();
        }
        //注意修改数据
        this.loadSelectNewOne();
        this.loadzFlow();
        this.loadWeather('湛江/徐闻');
    }
    PageViewModel.prototype.loadChart1 = function (xData, data1, data2) {
        if (!this.Chart1) {
            this.Chart1 = echarts.init(document.getElementById('chart1'));
        }
        //debugger;
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        theCurrentOption.grid.height = 100;
        theCurrentOption.grid.bottom = 10;
        var theXData = [];
        //var theTodayDate=new Date();
        for (var i = 0; i <= 24; i++) {
            theXData.push(i);
        }
        theCurrentOption.xAxis = {
            type: 'category',
            name: '(时点)',
            nameLocation: 'end',
            //interval:12,
            //splitNumber: 24,
            axisLabel: {
                interval: 3,
                formatter: function (value, idx) {
                    //debugger;
                    //return value;
                    if (value % 4 == 0) {
                        //console.log('x2:'+value/12);
                        //console.log('x:'+value/(60/5));
                        return value;
                    }
                    else {
                        return "";
                    }
                }
            },
            axisPointer: {
                label: {
                    show: true,
                    color: '#05cffa',
                    formatter: function (arg) {
                        return arg.value;
                    }
                },
                lineStyle: {
                    color: '#05cffa',
                    shadowBlur: {
                        shadowColor: '#05cffa',
                        shadowBlur: 10
                    }
                }
            },
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#557398'
                }
            },
            data: theXData
        };
        //theCurrentOption.xAxis.data = xData || theCurrentOption.xAxis.data;
        theCurrentOption.legend = {
            data: [{
                name: '粤海铁路北港',
                textStyle: {color: "#d1b96b"}
//                textStyle: {color: "#85a8b8"}
            },
                {
                    name: '海安港',
                    textStyle: {color: "#357acb"}
                    //textStyle: {color: "#85a8b8"}
                }],
            x: 'right',
            y: 'top'
        };

        theCurrentOption.series = [

            {
                //name: '搜索引擎',
                type: 'line',
                name: '粤海铁路北港',
                itemStyle: {
                    color: '#d1b96b'
                },
                //stack: '总量',
                smooth: true,
                data: data1,//|| [11, 14, 22, 15, 7, 8],
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
                name: '海安港',

                itemStyle: {
                    normal: {
                        color: '#357acb',
                        lineStyle: {
                            width: 2,
                            color: '#357acb',
                            type: 'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                smooth: true,
                //stack: '总量',
                data: data2 //|| [5, 6, 7, 8, 11, 12]
            }
        ];
        this.Chart1.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart2 = function (xData, data1, data2) {
        if (!this.Chart2) {
            this.Chart2 = echarts.init(document.getElementById('chart2'));
        }
        data1 = data1 || [];
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        theCurrentOption.xAxis.name = "(日期)";
        var theDate1String = formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theBeginDate = new Date(datebegin);
        var theEndDate = new Date(dateend);
        var theXData = [];
        var theValidData = [];
        var theMap = {};
        xData = xData || [];
        for (var i = 0; i < xData.length; i++) {
            theMap[xData[i]] = data1[i];
        }
        var maxDate = xData.max();
        for (var i = 0; i < xData.length; i++) {
            theMap[xData[i]] = data1[i];
        }
        while (theEndDate.getTime() > theBeginDate.getTime()) {

            var thekey = theBeginDate.getFullYear() + '' + FormateDateNum(theBeginDate.getMonth() + 1) + '' + FormateDateNum(theBeginDate.getDate());
            theXData.push((theBeginDate.getMonth() + 1) + '-' + FormateDateNum(theBeginDate.getDate()));

            if (maxDate) {
                if (theBeginDate.getTime() > new Date(maxDate).getTime()) {
                    theBeginDate.setDate(theBeginDate.getDate() + 1);
                    continue;
                }
                if (theMap[thekey]) {
                    theValidData.push(theMap[thekey]);
                }
                else {
                    theValidData.push(0);
                }
            }
            theBeginDate.setDate(theBeginDate.getDate() + 1);
        }
        data1 = theValidData;
        theCurrentOption.xAxis.data = theXData;

        //theCurrentOption.xAxis.data = xData || theCurrentOption.xAxis.data;
        theCurrentOption.yAxis = [{
            name: '（人数/万）',
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
                //symbol: "none", //去掉圆点
                type: 'line',
                itemStyle: {
                    color: '#d1b96b'
                },
                smooth: true,
                data: data1.map(function (item) {
                    return (item / 10000).toFixed(2);
                }),// || [11, 14, 22, 15, 7, 8],
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

        this.Chart2.setOption(theCurrentOption);

    }

    PageViewModel.prototype.loadChart3 = function (xData, data1, data2) {
        //debugger;
        if (!this.Chart3) {
            this.Chart3 = echarts.init(document.getElementById('chart3'));
        }
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        theCurrentOption.xAxis.name = "(日期)";
        // theCurrentOption.xAxis.data = xData || theCurrentOption.xAxis.data;
        var theDate1String = formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theBeginDate = new Date(datebegin);
        var theEndDate = new Date(dateend);

        var theXData = [];
        var theValidData = [];
        var theMap = {};
        xData = xData || [];
        for (var i = 0; i < xData.length; i++) {
            theMap[xData[i]] = data1[i];
        }
        var maxDate = xData.max();
        for (var i = 0; i < xData.length; i++) {
            theMap[xData[i]] = data1[i];
        }
        while (theEndDate.getTime() > theBeginDate.getTime()) {

            var thekey = theBeginDate.getFullYear() + '' + FormateDateNum(theBeginDate.getMonth() + 1) + '' + FormateDateNum(theBeginDate.getDate());
            theXData.push((theBeginDate.getMonth() + 1) + '-' + FormateDateNum(theBeginDate.getDate()));

            if (maxDate) {
                if (theBeginDate.getTime() > new Date(maxDate).getTime()) {
                    theBeginDate.setDate(theBeginDate.getDate() + 1);
                    continue;
                }
                if (theMap[thekey]) {
                    theValidData.push(theMap[thekey]);
                }
                else {
                    theValidData.push(0);
                }
            }
            theBeginDate.setDate(theBeginDate.getDate() + 1);
        }
        data1 = theValidData;
        theCurrentOption.xAxis.data = theXData;
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                name: '每日客流',
                smooth: true,
                data: data1.map(function (item) {
                    return (item / 10000).toFixed(2);
                }),// || [11, 14, 22, 15, 7, 8],
                itemStyle: {color: '#d1b96b'},
                lineStyle: {
                    normal: {
                        color: '#357acb'//rgba(50,255,75
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

        ];
        this.Chart3.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart4 = function (xData, data1, data2) {
        if (!this.Chart4) {
            this.Chart4 = echarts.init(document.getElementById('chart4'));
        }
        //debugger;
        var theCurrentOption = {};
        $.extend(true, theCurrentOption, option1);
        theCurrentOption.xAxis.name = "(日期)";
        // theCurrentOption.xAxis.data = xData || theCurrentOption.xAxis.data;
        var theDate1String = formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theBeginDate = new Date(datebegin);
        var theEndDate = new Date(dateend);
        var theXData = [];
        var theValidData = [];
        var theMap = {};
        xData = xData || [];
        var maxDate = xData.max();
        for (var i = 0; i < xData.length; i++) {
            theMap[xData[i]] = data1[i];
        }
        while (theEndDate.getTime() > theBeginDate.getTime()) {

            var thekey = theBeginDate.getFullYear() + '' + FormateDateNum(theBeginDate.getMonth() + 1) + '' + FormateDateNum(theBeginDate.getDate());
            theXData.push((theBeginDate.getMonth() + 1) + '-' + FormateDateNum(theBeginDate.getDate()));

            if (maxDate) {
                if (theBeginDate.getTime() > new Date(maxDate).getTime()) {
                    theBeginDate.setDate(theBeginDate.getDate() + 1);
                    continue;
                }
                if (theMap[thekey]) {
                    theValidData.push(theMap[thekey]);
                }
                else {
                    theValidData.push(0);
                }
            }
            theBeginDate.setDate(theBeginDate.getDate() + 1);
        }
        data1 = theValidData;
        theCurrentOption.xAxis.data = theXData;
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                data: data1.map(function (item) {
                    return (item / 10000).toFixed(2);
                }),// || [11, 14, 22, 15, 7, 8],
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
        //debugger;
        this.Chart4.setOption(theCurrentOption);
    }
    /***
     * 驻留时长图标
     */
    PageViewModel.prototype.loadChartBar = function (data) {
        //debugger;
        data = data || [];
        if (!this.ChartBar) {
            this.ChartBar = echarts.init(document.getElementById('form_1'));
        }
        var option = {

            grid: {
                left: 92,
                right: 5,
                top: 30,
                bottom: 0,
                width: 560,
                height: 80,
                containLabel: true
            },
            xAxis: [
                {
//                        type : 'category',
                    data: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-24',],
                    "axisTick": {       //X轴刻度线
                        "show": false
                    },
                    name: '(小时)',
                    "splitLine": {     //网格线
                        "show": false
                    },
                    axisLine: {
//                    show:false,
                        lineStyle: {
                            color: '#557398'
                        }

                    }
                }
            ],
            yAxis: [

                {
                    type: 'value',
                    min: '0',
                    //max: '30',
                    splitLine: '3',
                    name: '(百分比)',
                    nameLocation: 'end',
//                "show" : false,
//                "axisTick":{       //y轴刻度线
//                    "show":false
//                },
                    axisLine: {
//                    show:false,
                        lineStyle: {
                            color: '#557398'

                        }

                    },
                    "splitLine": {     //网格线
                        "show": false
                    }
                }
            ],
            series: [

                {
                    //设置柱形条是否显示数据
                    label: {
                        normal: {
                            show: true,
                            'position': 'top',
                            formatter: function (arg) {
                                return arg.value + '%';
                                //return arg;
                            },
                        }
                    },

                    name: '累积',
                    type: 'bar',
                    barWidth: '50%',
                    data: data.map(function (item) {
                        return item;
                    }),//[4, 5, 6, 13, 14, 11, 8.5, 11, 12],
                    itemStyle: {
                        normal: {
                            color: '#80ddfe'
                        }
                    }
                },

            ]
        };

        this.ChartBar.setOption(option);
    }
    /**
     * 得到驻留时长 ok
     */
    PageViewModel.prototype.loadQzStay = function () {
        var theCallUrl = "qz/qzStay.do";
        var theParamter = {
            date: formateDate()
        };
        var me = this;
        this.load(theCallUrl, theParamter, function (res) {
            var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            /*res = {
                "isSuccess": true,
                "msg": "success",
                "data": [{
                    "id": 1,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡",
                    "qzStayNum": 100000000,
                    "qzStayPercentage": 20,
                    "qzStayTime": 10,
                    "statDate": "2018-12-12"
                }, {
                    "id": 2,
                    "postionName": "琼州海峡",
                    "postionType": "琼州海峡",
                    "qzStayNum": 100000000,
                    "qzStayPercentage": 20,
                    "qzStayTime": 12,
                    "statDate": "2018-12-12"
                }]
            };*/

            if (res && res.isSuccess) {
                var theDatas = res.data;
                for (var i = 0; i < theDatas.length; i++) {
                    //debugger;
                    var theItem = theDatas[i];
                    var theStayTime = theItem.qzStayTime;
                    if (theStayTime >= 8) {
                        theData[theData.length - 1] = (theItem.qzStayPercentage * 100).toFixed(2);
                        continue;
                    }
                    if (theStayTime < 1) {
                        theData[0] = (theItem.qzStayPercentage * 100).toFixed(2);
                        //continue;
                    }
                    else {

                        theData[Math.ceil(theStayTime)] = (theItem.qzStayPercentage * 100).toFixed(2);
                    }

                }
            }

            me.loadChartBar(theData);
        });
    }
    /***
     * 查询性别和年龄占比 0k
     */
    PageViewModel.prototype.loadQzRatio = function () {
        var me = this;
        var theCallUrl = "qz/qzRatio.do";
        var theParamter = {
            date: formateDate(),
        };
        this.load(theCallUrl, theParamter, function (res) {
            var theAgeObj = {
                "age1": 0,
                "age2": 0,
                "age3": 0,
                "age4": 0,
                "age5": 0,
                "age6": 0,
                "age7": 0,
                "age8": 0,
                "age9": 0,
                "age10": 0,
                "woman": 0,
                "man": 0,
            };
            /*res = {
                "data": {
                    "age": [{
                        "id": 1,
                        "postionName": "淮安两港",
                        "postionType": "琼州海峡",
                        "qzAge": "18",
                        "qzAgeNum": 200000000,
                        "qzAgePercentage": 10,
                        "statDate": "2018-12-12"
                    }],
                    "gender": [{
                        "id": 1,
                        "postionName": "淮安两港",
                        "postionType": "琼州海峡",
                        "qzGender": 1,
                        "qzGenderNum": 10000000,
                        "qzGenderPercentage": 50,
                        "statDate": "2018-12-12"
                    }, {
                        "id": 2,
                        "postionName": "淮安两港",
                        "postionType": "琼州海峡",
                        "qzGender": 2,
                        "qzGenderNum": 10000000,
                        "qzGenderPercentage": 50,
                        "statDate": "2018-12-12"
                    }]
                }, "isSuccess": true, "msg": "success"
            };*/
            if (res && res.isSuccess && res.data) {
                var theAges = res.data.age;
                // var theGenders = res.data.gender;
                theAgeObj.man = Math.ceil((res.data.man || 0) * 100);
                theAgeObj.woman = 100 - theAgeObj.man;
                /*for (var i = 0; i < theGenders.length; i++) {
                    var theGender = theGenders[i];
                    if (theGender.qzGender == 1&&!theAgeObj.man) {
                        theAgeObj.man = (theGender.qzGenderPercentage*100).toFixed(0);
                    }
                    if (theGender.qzGender == 2&&!theAgeObj.woman) {
                        theAgeObj.woman = (theGender.qzGenderPercentage*100).toFixed(0);
                    }
                }*/
                for (var i = 0; i < theAges.length; i++) {
                    var theAge = theAges[i];
//debugger;
                    theAgeObj['age' + parseInt(theAge.qzAge.split(' ', 2)[0] || '0')] = (theAge.qzAgePercentage * 100).toFixed(2);

                }
            }
            me.loadAgeView(theAgeObj);
        });
    }

    /**
     * 加载年龄段的数据 ok
     * @param data
     */
    PageViewModel.prototype.loadAgeView = function (data) {

        var man = data.man;
        var woman = 0;
        if (man <= 0.6 * 100) {
            man = (0.6 * 100).toFixed(0);
            woman = 100 - man;
        }
        else {
            man = ((0.25 * (man / 100 - 0.6) + 0.6) * 100).toFixed(0);
            woman = 100 - man;
        }
        $('.man-icon').text(man + '%');
        $('.woman-icon').text(woman + '%');
        // debugger;
        var theDegaer =man * 360 / 100
        var thePath = this.drawArcByRadiusDeg(118, 59, 59, (theDegaer || 0), 1);
        ;$('#per-path').attr('d', thePath);
        var theDatas = [];
        for (var i = 1; i <= 10; i++) {
            theDatas.push(data['age' + i]);
            /*$('#age' + i).siblings('span').text((data['age' + i] || 0) + "%");
            $('#age' + i).css('width', (data['age' + i] / 2) + 'px');*/
        }
        //debugger;
        this.loadAgeChartBar(theDatas);
    }
    /***
     * 实时客流趋势 ok 需要注意横坐标
     */
    PageViewModel.prototype.loadQzFlowTrend = function () {
        var theCallUrl = "qz/qzFlowTrend.do";
        var theParamter = {date: formateDate()};
        var me = this;

        this.load(theCallUrl, theParamter, function (res) {
            var theData1 = [];
            var theData2 = [];

            var theX1 = [];
            var theX2 = [];
            var theX1Obj = {};
            var theX2Obj = {};
            var theX = [];
            /*res = {
                "data": [[{
                    "allPeople": 40000000,
                    "id": 1,
                    "inPeople": 20000000,
                    "outPeople": 20000000,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡",
                    "statDate": "2018-12-12"
                }, {
                    "allPeople": 20000000,
                    "id": 2,
                    "inPeople": 1000000,
                    "outPeople": 10000000,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡",
                    "statDate": "2018-12-13"
                }], [{
                    "allPeople": 4000000,
                    "id": 3,
                    "inPeople": 2000000,
                    "outPeople": 2000000,
                    "postionName": "铁路北港",
                    "postionType": "琼州海峡",
                    "statDate": "2018-12-12"
                }, {
                    "allPeople": 40000000,
                    "id": 4,
                    "inPeople": 2000000,
                    "outPeople": 2000000,
                    "postionName": "铁路北港",
                    "postionType": "琼州海峡",
                    "statDate": "2018-12-12"
                }]], "isSuccess": true, "msg": "success"
            };*/
            if (res && res.isSuccess) {
                if (res.data.length > 1) {
                    var theItems = res.data[0];
                    for (var i = 0; i < theItems.length; i++) {
                        //theData1.push((theItems[i].allPeople/10000).toFixed(1));
                        theX1.push(theItems[i].statDate);
                        theX1Obj[theItems[i].statDate] = (theItems[i].subscribercount / 10000).toFixed(2);
                    }
                }
                if (res.data.length >= 2) {
                    var theItems = res.data[1];
                    for (var i = 0; i < theItems.length; i++) {
                        //theData2.push((theItems[i].allPeople/10000).toFixed(1));
                        theX2.push(theItems[i].statDate);
                        theX2Obj[theItems[i].statDate] = (theItems[i].subscribercount / 10000).toFixed(2);
                    }
                }
            }
            var theTmpArray = theX1.concat(theX2);
            theTmpArray.sort();
            var theHash = {};
            for (var i = 0; i < theTmpArray.length; i++) {
                if (!theHash[theTmpArray[i]]) {
                    theHash[theTmpArray[i]] = true;
                    theX.push(theTmpArray[i]);
                    theData1.push(theX1Obj[theTmpArray[i]] || 0);
                    theData2.push(theX2Obj[theTmpArray[i]] || 0);
                }
            }
            //debugger;
            me.loadChart1(theX, theData1, theData2);
        });
    }

    /**
     * 历史客流量趋势 ok
     */
    PageViewModel.prototype.loadQzFlowHistory = function () {
        var theCallUrl = "qz/qzFlowHistory.do";
        var theDate = formateDate1();
        var theDates = theDate.split(' - ')
        var theParamter = {
            startDate: theDates[0],
            endDate: theDates[1],
        };
        var me = this;
        //debugger;
        this.load(theCallUrl, theParamter, function (res) {
            var theDataAll = [];
            var theDataIn = [];
            var theDataOut = [];
            var theXArray = [];
            /* res = {
                 "isSuccess": true,
                 "msg": "success",
                 "data": [{
                     "allPeople": 40000000,
                     "id": 1,
                     "inPeople": 20000000,
                     "outPeople": 20000000,
                     "postionName": "淮安两港",
                     "postionType": "琼州海峡",
                     "statDate": "2018-12-12"
                 }, {
                     "allPeople": 20000000,
                     "id": 2,
                     "inPeople": 1000000,
                     "outPeople": 10000000,
                     "postionName": "淮安两港",
                     "postionType": "琼州海峡",
                     "statDate": "2018-12-13"
                 }]
             };*/
            if (res && res.isSuccess) {
                for (var i = 0; i < res.data.length; i++) {
                    var theItem = res.data[i];
                    theDataAll.push(theItem.allPeople);
                    theDataIn.push(theItem.inPeople);
                    theDataOut.push(theItem.outPeople);
                    theXArray.push(theItem.statDate);
                }
            }
            //debugger;
            me.loadChart2(theXArray, theDataAll);
            me.loadChart3(theXArray, theDataIn);
            me.loadChart4(theXArray, theDataOut);
        });
    }

    /**
     * 实时客流
     */
    PageViewModel.prototype.loadzFlow = function () {
        var theCallUrl = "qz/qzFlow.do";
        var theParamter = {};
        var me = this;
        //粤海铁路北港码头0:110.130713,20.226732
        //海安新港0:110.216824,20.267225
        this.addMarker("粤海铁路北港", 110.130713, 20.226732);
        var yhbgBounds = [[110.13105, 20.225806], [110.129529, 20.226263], [110.129431, 20.233007], [110.123572, 20.232898], [110.131067, 20.234793]];
        var haianBounds = [[110.218008, 20.26316], [110.215798, 20.26669], [110.215341, 20.267565], [110.216824, 20.268225], [110.224952, 20.27459], [110.235985, 20.26588], [110.234317, 20.266659], [110.233084, 20.265605], [110.227222, 20.268448], [110.220356, 20.268853], [110.217824, 20.267225]];
        // this.addInfoWindow("粤海铁路北港",110.130713,20.226732);
        this.addMarker("海安港", 110.221102, 20.270894);
        // this.addInfoWindow("海安新港",110.216824,20.267225);
        //debugger;
        this.load(theCallUrl, theParamter, function (res) {
            var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            /*res = {
                "data": {
                    "id": 1,
                    "pepValue": 1200000,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡",
                    "statDate": "2018-12-12",
                    "statTime": "12:00"
                }, "isSuccess": true, "msg": "success"
            };*/
            //粤海铁路北港码头0:110.130713,20.226732
            //海安新港0:110.216824,20.267225
            var theReliArrays = [];
            //debugger;
            if (res && res.isSuccess && res.data) {
                for (var i = 0; i < res.data.length; i++) {
                    var theItem = res.data[i];

                    if (theItem.positionName == "湛江徐闻海安港" || "湛江徐闻海安港" == theItem.positionName) {
                        me.addMarker("海安港", 110.221102, 20.270894, ((theItem.subscribercount || 0)));
                        theReliArrays.push({
                            bounds: haianBounds,
                            data: theItem.subscribercount || 0,
                            max: 10000,
                        });
                    }
                    if (theItem.positionName == "铁路北港" || "铁路北港" == theItem.positionName) {
                        me.addMarker("粤海铁路北港", 110.221102, 20.270894, ((theItem.subscribercount || 0)));
                        theReliArrays.push({
                            bounds: yhbgBounds,
                            data: theItem.subscribercount || 0,
                            max: 10000,
                        });
                    }
                }

            }
            me.drawRelis(theReliArrays);
        });
    }

    /***
     * 归属地区分析 ok
     */
    PageViewModel.prototype.loadQzBelongArea = function () {
        var theCallUrl = "qz/qzBelongArea.do";
        var theParamter = {
            date: formateDate()
        };
        /*qzBelong 1、境外；2、省外；3、省内*/
        this.load(theCallUrl, theParamter, function (res) {
            var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            /*res = {
                "data": [{
                    "id": 2,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡 ",
                    "qzBelong": 1,
                    "qzBelongArea": "美国",
                    "qzBelongPercentage": 10,
                    "qzNum": 100000,
                    "statDate": "2018-12-12"
                }, {
                    "id": 3,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡 ",
                    "qzBelong": 2,
                    "qzBelongArea": "湖南",
                    "qzBelongPercentage": 10,
                    "qzNum": 1000000,
                    "statDate": "2018-12-12"
                }, {
                    "id": 4,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡 ",
                    "qzBelong": 3,
                    "qzBelongArea": "长沙",
                    "qzBelongPercentage": 10,
                    "qzNum": 1000000,
                    "statDate": "2018-12-12"
                }], "isSuccess": true, "msg": "success"
            };*/
            $('#qzBelong1').text('(0%)');
            $('#qzBelong2').text('(0%)');
            $('#qzBelong3').text('(0%)');
            if (res && res.isSuccess) {
                for (var i = 0; i < res.data.length; i++) {
                    var theItem = res.data[i];
                    if (theItem.qzBelongPercentage == 1) {
                        $('#qzBelong' + theItem.qzBelong).text('(100%)');
                    }
                    else {
                        $('#qzBelong' + theItem.qzBelong).text('(' + ((theItem.qzBelongPercentage || 0) * 100 % 100).toFixed(2) + '%)');
                    }

                }

            }
        });
    }

    /**
     * 加载年龄
     * @param data
     */
    PageViewModel.prototype.loadAgeChartBar = function (data) {
        if (!this.ChartAgeBar) {
            this.ChartAgeBar = echarts.init(document.getElementById('age-chartview'));
        }

        data = data || [];
        if (data.length > 6) {
            data = data.slice(0, 6);
        }
        var option = {

            grid: {
                left: 10,
                right: 20,
                bottom: 10,
                width: 370,
                height: 90,
                containLabel: true
            },
            barWidth: 30,
            xAxis: [
                {
//                        type : 'category',
                    data: ['0-17', '18-24', '25-34', '35-44', '55-54', '55以上'],// '4-5', '5-6', '6-7', '7-8', '8-24',],
                    "axisTick": {       //y轴刻度线
                        "show": false
                    },
                    "splitLine": {     //网格线
                        "show": false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#d9f1ff',

                        }

                    }
                }
            ],
            yAxis: [

                {
                    type: 'value',
                    min: '0',
                    //max: '10',
                    "show": false,
                    "axisTick": {       //y轴刻度线
                        "show": false
                    },
                    "splitLine": {     //网格线
                        "show": false
                    }
                }
            ],
            series: [

                {
                    //设置柱形条是否显示数据
                    label: {
                        normal: {
                            show: true,
                            formatter: function (arg) {
                                return arg.value + '%';
                                //return arg;
                            },
                            'position': 'top'
                        }
                    },
                    name: '累积',
                    type: 'bar',
//                        barWidth:'33.3%',
                    data: data,// || [4, 5, 6, 3, 4.2, 3.5],
                    itemStyle: {
                        normal: {
                            color: '#80ddfe'
                        }
                    }
                },

            ]
        };
        this.ChartAgeBar.setOption(option);
    }
    /**
     * 查询最新一条数据
     */
    PageViewModel.prototype.loadSelectNewOne = function () {
        var theCallUrl = "qz/qzTotalOutIn.do";// "qz/selectNewOne.do";
        var theParamter = {};

        this.load(theCallUrl, theParamter, function (res) {
            // var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            /* res = {
                 "data": {
                     "allPeople": 40000,
                     "id": 5,
                     "inPeople": 200000,
                     "outPeople": 200000,
                     "postionName": "淮安两港",
                     "postionType": "琼州海峡",
                     "statDate": "2018-12-17"
                 }, "isSuccess": true, "msg": "success"
             };*/

            var theData = {};
            if (res && res.isSuccess) {
                theData = res.data;
            }
            //debugger;
            var inPeople = ((theData['inPeople']) || 0);
            var outPeople = ((theData['outPeople']) || 0);
            var allPeople = (outPeople - inPeople);
            var unitText = '万';
            if (inPeople < 1000) {
                unitText = "";
            } else {
                unitText = "万";
                inPeople = (inPeople / 10000).toFixed(2);
            }
            $('.newcome-num.in').html('<span class="newcome-people">' + inPeople + '</span>' + unitText);
            if (outPeople < 1000) {
                unitText = "";
            } else {
                unitText = "万";
                outPeople = (outPeople / 10000).toFixed(2);
            }
            $('.newcome-num.out').html('<span class="newcome-people">' + outPeople + '</span>' + unitText);
            if (Math.abs(allPeople) < 1000) {
                unitText = "";
            } else {
                unitText = "万";
                allPeople = (allPeople / 10000).toFixed(2);
            }
            $('.newcome-num.all').html('<span class="newcome-people">' + allPeople + '</span>' + unitText);
        });
    }
    /**
     * 归属类型分析 ok
     */
    PageViewModel.prototype.loadzQzBelongType = function (belongType) {
        var theCallUrl = "qz/qzBelongType.do";
        var theParamter = {
            belongType: belongType || 2,//归属类别(1.归属国家 2.归属省份 3. 归属城市)
            date: formateDate()//日期
        };

        this.load(theCallUrl, theParamter, function (res) {
            var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            /* res = {
                 "data": [{
                     "id": 2,
                     "postionName": "淮安两港",
                     "postionType": "琼州海峡 ",
                     "qzBelong": 1,
                     "qzBelongArea": "美国",
                     "qzBelongPercentage": 10,
                     "qzNum": 100000,
                     "statDate": "2018-12-12"
                 }, {
                     "id": 3,
                     "postionName": "淮安两港",
                     "postionType": "琼州海峡 ",
                     "qzBelong": 2,
                     "qzBelongArea": "湖南",
                     "qzBelongPercentage": 10,
                     "qzNum": 1000000,
                     "statDate": "2018-12-12"
                 }, {
                     "id": 4,
                     "postionName": "淮安两港",
                     "postionType": "琼州海峡 ",
                     "qzBelong": 3,
                     "qzBelongArea": "长沙",
                     "qzBelongPercentage": 10,
                     "qzNum": 1000000,
                     "statDate": "2018-12-12"
                 }], "isSuccess": true, "msg": "success"
             };*/
            $('.guishu-content ul').empty();
            if (res && res.isSuccess) {
                var theIndex = 1;
                var theMaxLength = 6;
                if (res.data.length < theMaxLength) {
                    theMaxLength = res.data.length;
                }
                for (var i = 0; i < theMaxLength; i++) {
                    var theItme = res.data[i];
                    var theTempalte = '<li>\n' +
                        '                                        <span class="guishu-icon">' + theIndex + '</span>\n' +
                        '                                        <span class="guishu-cuntry">' + theItme.qzBelongArea + '</span>\n' +
                        '                                        <span class="guishu-line"></span>\n' +
                        '                                        <span class="guishu-num">' + formateNum(theItme.qzNum) + '</span>人\n' +
                        '                                    </li>';
                    $('.guishu-content ul').append(theTempalte);
                    theIndex++;
                }

            }
        });
    }

    PageViewModel.prototype.initCharts = function () {
        this.loadChart1();
        this.loadChart2();
        this.loadChart3();
        this.loadChart4();
        this.loadChartBar();

    }

    /**
     * 加载第一部分数据
     */
    PageViewModel.prototype.loadPart1 = function () {
        this.loadzQzBelongType(belongType);
        this.loadQzBelongArea();

        this.loadQzRatio();
        this.loadQzStay();

        this.loadQzFlowTrend();
    }
    /***
     * 加载第二部分数据
     */
    PageViewModel.prototype.loadPart2 = function () {
        this.loadQzFlowHistory();
    }

    window.PageView = new PageViewModel();
})