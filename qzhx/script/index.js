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
            data: ['0', '12-28', '12-29', '12-30', '1-01', '1-02', '1-03', '1-04']
            //data: theXData
        },
        yAxis: {
            min: '0',
            max: '30',
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
            var theDate = new Date();
            return theDate.getFullYear() + "-" + (theDate.getMonth() + 1) + "-" + theDate.getDate();
        }
        return theCurrentDate.year + '-' + theCurrentDate.month + '-' + theCurrentDate.date;//
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
        debugger;
        if (!theCurrentDate1) {
            var theDate = new Date();
            return theDate.getFullYear() + "-" + (theDate.getMonth() + 1) + "-" + theDate.getDate();
        }
        return theCurrentDate.year + '-' + theCurrentDate.month + '-' + theCurrentDate.date;//
    }

    function PageViewModel() {
        this.initEvent();
        this.initCharts();
        this.loadData();
        this.initMap(2);
    }


    PageViewModel.prototype = new PageViewBase();
    /**
     * 定时任务开始
     */
    PageViewModel.prototype.onTimer = function () {

    }

    PageViewModel.prototype.initEvent = function () {
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
                    me.loadPart1();
                }

            }
        });
        laydate.render({
            elem: '#date-input1', //指定元素
            trigger: 'click',
            value: new Date(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate1 != date) {
                    theCurrentDate1 = date;
                    me.loadPart2();
                }

            }
        });
        //右边tab栏点击切换
        var theParentContent = $('.tab-main').closest('.content');
        $('.tab-main .tab-item-left').click(function () {
            var theIndex = $(this).data('index');
            $('.tab-main .tab-item-right').addClass('select_a');
            $('.tab-main .tab-item-left').removeClass('select_a');
            $('.datediv,.dateline').show();
            $('.datediv1,.dateline1').hide();
            theViewType = theIndex;

            $(theParentContent).find('.part1').hide();
            $(theParentContent).find('.part2').hide();
            $(theParentContent).find('.part-' + theIndex).show();


        });
        $('.tab-main .tab-item-right').click(function () {
            var theIndex = $(this).data('index');
            $('.tab-main .tab-item-left').addClass('select_a');
            $('.tab-main .tab-item-right').removeClass('select_a');
            $('.datediv,.dateline').hide();
            $('.datediv1,.dateline1').show();


            $(theParentContent).find('.part1').hide();
            $(theParentContent).find('.part2').hide();
            $(theParentContent).find('.part-' + theIndex).show();

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
        theCurrentOption.legend = {
            data: [{name: '每日客流', textStyle: {color: "#85a8b8"}}, {name: '香港>>珠海澳门', textStyle: {color: "#85a8b8"}}],
            x: 'right',
            y: 'top'
        };

        theCurrentOption.series = [

            {
                //name: '搜索引擎',
                type: 'line',
                name: '每日客流',
                itemStyle: {
                    color: '#d1b96b'
                },
                //stack: '总量',
                smooth: true,
                data: data1 || [11, 14, 22, 15, 7, 8],
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
                name: '香港>>珠海澳门',

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
                data: data2 || [5, 6, 7, 8, 11, 12]
            }
        ];
        this.Chart1.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart2 = function (xData, data1, data2) {
        if (!this.Chart2) {
            this.Chart2 = echarts.init(document.getElementById('chart2'));
        }
        var theCurrentOption = {};
        $.extend(theCurrentOption, option1);
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
                data: data1 || [11, 14, 22, 15, 7, 8],
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
        if (!this.Chart3) {
            this.Chart3 = echarts.init(document.getElementById('chart3'));
        }
        var theCurrentOption = {};
        $.extend(theCurrentOption, option1);
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                name: '每日客流',
                smooth: true,
                data: data1 || [11, 14, 22, 15, 7, 8],
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
        var theCurrentOption = {};
        $.extend(theCurrentOption, option1);
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                data: data1 || [11, 14, 22, 15, 7, 8],
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
    /***
     * 驻留时长图标
     */
    PageViewModel.prototype.loadChartBar = function (data) {
        this.ChartBar = echarts.init(document.getElementById('form_1'));
        var option = {

            grid: {
                left: 92,
                right: 5,
                top: 30,
                bottom: 5,
                width: 560,
                height: 110,
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
                    max: '30',
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
                            'position': 'top'
                        }
                    },

                    name: '累积',
                    type: 'bar',
                    barWidth: '50%',
                    data: data,//[4, 5, 6, 13, 14, 11, 8.5, 11, 12],
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
                    var theItem = theDatas[i];
                    var theStayTime = theItem.qzStayTime;
                    theData[theStayTime] = theItem.qzStayPercentage;
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
                var theGenders = res.data.gender;
                for (var i = 0; i < theGenders.length; i++) {
                    var theGender = theGenders[i];
                    if (theGender.qzGender == 1) {
                        theAgeObj.man = theGender.qzGenderPercentage;
                    }
                    if (theGender.qzGender == 2) {
                        theAgeObj.woman = theGender.qzGenderPercentage;
                    }
                }
                for (var i = 0; i < theAges.length; i++) {
                    var theAge = theAges[i];
                    theAgeObj['age' + theAge.qzAge] = theAge.qzGenderPercentage;

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
        $('.sex-boy-num').text(data.man + '%');
        $('.sex-girl-num').text(data.woman + '%');
        for (var i = 1; i <= 10; i++) {
            $('#age' + i).siblings('span').text((data['age' + i] || 0) + "%");
            $('#age' + i).css('width', data['age' + i] + 'px');
        }
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
                        theData1.push(theItems[i].allPeople);
                        theX.push(theItems[i].statDate);
                    }
                }
                if (res.data.length >= 2) {
                    var theItems = res.data[1];
                    for (var i = 0; i < theItems.length; i++) {
                        theData2.push(theItems[i].allPeople);
                    }
                }
            }
            me.loadChart1(theX, theData1, theData2);
        });
    }

    /**
     * 历史客流量趋势 ok
     */
    PageViewModel.prototype.loadQzFlowHistory = function () {
        var theCallUrl = "qz/qzFlowHistory.do";
        var theParamter = {};
        var me = this;
        this.load(theCallUrl, theParamter, function (res) {
            var theDataAll = [];
            var theDataIn = [];
            var theDataOut = [];
            var theXArray = [];
            res = {
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
            };
            if (res && res.isSuccess) {
                for (var i = 0; i < res.data.length; i++) {
                    var theItem = res.data[i];
                    theDataAll.push(theItem.allPeople);
                    theDataIn.push(theItem.inPeople);
                    theDataOut.push(theItem.outPeople);
                    theXArray.push(theItem.statDate);
                }
            }
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
        Q
        this.load(theCallUrl, theParamter, function (res) {
            var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            res = {
                "data": {
                    "id": 1,
                    "pepValue": 1200000,
                    "postionName": "淮安两港",
                    "postionType": "琼州海峡",
                    "statDate": "2018-12-12",
                    "statTime": "12:00"
                }, "isSuccess": true, "msg": "success"
            }

            ;
            if (res && res.isSuccess) {

            }
        });
    }

    /***
     * 归属地区分析 ok
     */
    PageViewModel.prototype.loadQzBelongArea = function () {
        var theCallUrl = "qz/qzBelongArea .do";
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
                    $('#qzBelong' + theItem.qzBelong).text('(' + theItem.qzBelongPercentage + '%)');
                }

            }
        });
    }

    /**
     * 查询最新一条数据
     */
    PageViewModel.prototype.loadSelectNewOne = function () {
        var theCallUrl = "qz/selectNewOne.do";
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

        var theData={};
            if (res && res.isSuccess) {
                theData=res.data;
            }
            $('.newcome-people.all').text(theData['allPeople']||0);
            $('.newcome-people.in').text(theData['inPeople']||0);
            $('.newcome-people.out').text(theData['outPeople']||0);
        });
    }
    /**
     * 归属类型分析 ok
     */
    PageViewModel.prototype.loadzQzBelongType = function (belongType) {
        var theCallUrl = "qz/qzBelongType.do";
        var theParamter = {
            belongType: belongType || 1,//归属类别(1.归属国家 2.归属省份 3. 归属城市)
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
                for (var i = 0; i < res.data.length; i++) {
                    var theItme = res.data[i];
                    var theTempalte = '<li>\n' +
                        '                                        <span class="guishu-icon">' + theIndex + '</span>\n' +
                        '                                        <span class="guishu-cuntry">' + theItme.qzBelongArea + '</span>\n' +
                        '                                        <span class="guishu-line"></span>\n' +
                        '                                        <span class="guishu-num">' + formateNum(theItme.qzNum) + '</span>人\n' +
                        '                                    </li>';
                    $('.guishu-content ul').append(theTempalte);
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
        this.loadzQzBelongType();
        this.loadQzBelongArea();
        this.loadSelectNewOne();
        this.loadQzRatio();
        this.loadQzStay();
        this.loadzFlow();
    }
    /***
     * 加载第二部分数据
     */
    PageViewModel.prototype.loadPart2 = function () {
        this.loadQzFlowHistory();
    }

    window.PageView = new PageViewModel();
})