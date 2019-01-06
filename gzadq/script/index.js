$(function () {
    var theIntervals = 1000 * 60 * 5;
    ////视图类型
    //var ViewType = {
    //    OUT: "OUT",//迁出洞察
    //    IN: "IN",//迁入洞察
    //    PROVINCE: "PROVINCE"//省内迁徙
    //};
    ////迁徙方向
    //var DirectionType = {
    //    SHENG: "SHENG",//省
    //    GAT: "GAT",//港澳台
    //    JW: "JW"//境外
    //}
    var PageNameDic = {
        "SHENG": "qxdc_province.html",
        "COUNTRY": "qxdc_country.html",
        "GAT": "qxdc_video.html",
        "JINGWAI": "qxdc_video.html",
    }
    var theCurrentView = "";
    var theDirection = "";
    var isStopRefresh = true;
    var affiliationType = '国际';//1;//
    var theTimer = null;
    var theCurrentDate = null;
    var datebegin = null;
    var dateend = null;

    var road1 = "113.588394,22.208838;113.590149,22.21011;113.590599,22.2104;113.595665,22.213629;113.596802,22.214354;113.598633,22.215521;113.614006,22.225338;113.620605,22.229549;113.63002,22.235565;113.631332,22.236328;113.637299,22.239779;113.63958,22.241047;113.641769,22.24198;113.642578,22.242275;113.643295,22.24254;113.64563,22.243315;113.651047,22.244696;113.66011,22.24703;113.661095,22.247313;113.664551,22.248289;113.667458,22.249111;113.671799,22.250729;113.675491,22.252337;113.678452,22.253839;113.680527,22.255039;113.685425,22.258179;113.68557,22.258297;113.686523,22.259041;113.68853,22.260616;113.69072,22.262365;113.695602,22.266844;113.698349,22.26914;113.698563,22.269285;113.700981,22.270933;113.703171,22.272369;113.705627,22.273762;113.708496,22.275114;113.708603,22.275164;113.711372,22.276325;113.714485,22.277439;113.718124,22.278551;113.721848,22.27928;113.725845,22.279804;113.729912,22.280087;113.730469,22.280096;113.735283,22.280165;113.752434,22.280178;113.75515,22.280178;113.771355,22.280273;113.774216,22.280287;113.774414,22.280287;113.784065,22.280273;113.785217,22.280273;113.786385,22.280273;113.788612,22.280264;113.790833,22.280264";
    var road2 = "113.790833,22.280264;113.79277,22.28026;113.796379,22.280264;113.797493,22.280273;113.804657,22.280277;113.805443,22.280273;113.818352,22.280188;113.840332,22.280035;113.843056,22.280018;113.844658,22.279922;113.845665,22.279831;113.848297,22.279331;113.850136,22.27895;113.851761,22.27862;113.852592,22.278393;113.853432,22.278164;113.855408,22.277622;113.859734,22.276047;113.862305,22.275074;113.867935,22.272961;113.869301,22.272512;113.870056,22.272287;113.870796,22.272121;113.87146,22.272005;113.871979,22.271954;113.873421,22.271875;113.87455,22.271917;113.875565,22.272036;113.877388,22.272354;113.878021,22.272532;113.878799,22.272808;113.879883,22.273243;113.880302,22.273415;113.882492,22.274714;113.884277,22.275911;113.885223,22.276548;113.890862,22.280273;113.895134,22.283096;113.896568,22.284027;113.897781,22.284761;113.902382,22.287868;113.90303,22.288256;113.90435,22.289021;113.905319,22.289417;113.90625,22.289722;113.906883,22.28993;113.907982,22.290192;113.908791,22.290325;113.90976,22.290447;113.910194,22.290468;113.910667,22.290468;113.912407,22.290424;113.913292,22.290482;113.913643,22.290533;113.914009,22.290611;113.915291,22.291124;113.915558,22.291258;113.916428,22.291693;113.917114,22.291975;113.917488,22.292166;113.91777,22.292257;113.918198,22.292326;113.918762,22.292339;113.920692,22.292286;113.921295,22.292223;113.921867,22.292118;113.923981,22.291519;113.92485,22.291258;113.928223,22.290236;113.930382,22.289577;113.932014,22.289106;113.932594,22.288998;113.933487,22.288885;113.934364,22.288872;113.934891,22.288898;113.935272,22.288939;113.935913,22.289021;113.936821,22.289181;113.937378,22.289314";

    function PageViewModel() {
        this.initEvent();
        this.initCharts();
        this.initMap(1);
        var thePaths = road1.split(";").concat(road2.split(";")).map(function (item) {
            var points = item.split(',');
            return [points[0], points[1]];
        });
        this.drawRoad(thePaths);
        this.loadData();

    }

    PageViewModel.prototype = new PageViewBase();

    var theMapId = "mapbase";
    var theChar1Id = "chart1";
    var theChar2Id = "chart2";
    var theChar3Id = "chart3";
    var theChar4Id = "chart4";
    //var theGdData = GdGeoJson;
    var theViewType = 1;
    //当前选择的时间
    var theCurrentDate = null;
    var theCurrentDate1 = null;
    //当前的区域名称
    var theAreaNmae = "";

    var theXData = [];
    for (var i = 1; i <= 24; i++) {
        theXData.push(i);
    }
    //获取当前的日期数据
    var formateDate = function () {
        //debugger;
        if (!theCurrentDate) {
            var theDate = GetYesterdayDate();
            //var theBeginDay = theCurrentDate;// theDate.getDay();
            //var theBeginDate = theDate.addDays(theBeginDay);
            //var theEndDate = theBeginDate.addDays(6);
            // debugger
            //theDate.setDate(theDate.getDate() - 1);
            return theDate.getFullYear() + "-" + FormateDateNum(theDate.getMonth() + 1) + "-" + FormateDateNum(theDate.getDate());
            //+" - "+                theEndDate.getFullYear() + "-" + (theEndDate.getMonth() + 1) + "-" + theEndDate.getDate();
        }
        return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
    }
    var formateDate1 = function () {
        //debugger;
        if (!theCurrentDate1) {
            var theDate1 = GetFromDate();
            var theBeginDay1 = theDate1.getDay();
            var theBeginDate1 = theDate1.addDays(-theBeginDay1);
            var theEndDate1 = theBeginDate1.addDays(6);
            datebegin = theBeginDate1.getFullYear() + "-" + FormateDateNum(theBeginDate1.getMonth() + 1) + "-" + FormateDateNum(theBeginDate1.getDate());
            dateend = theEndDate1.getFullYear() + "-" + FormateDateNum(theEndDate1.getMonth() + 1) + "-" + FormateDateNum(theEndDate1.getDate());
            return theBeginDate1.getFullYear() + "-" + FormateDateNum(theBeginDate1.getMonth() + 1) + "-" + FormateDateNum(theBeginDate1.getDate()) + " - " +
                theEndDate1.getFullYear() + "-" + FormateDateNum(theEndDate1.getMonth() + 1) + "-" + FormateDateNum(theEndDate1.getDate());
        }
        return theCurrentDate1;
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
                interval: 0,
                rotate: 40,

            },
            boundaryGap: false,

            axisLine: {
                lineStyle: {
                    color: '#557398'
                }
            },
            data: ['0', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
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


    PageViewModel.prototype = new PageViewBase();
    /**
     * 刷新当前的数据
     */
    //PageViewModel.prototype.refresh = function () {
    //
    //    this.loadBridgeIslandsRatio(formateDate());
    //    //this.switchView(theCurrentView, true);
    //}
    /**
     * 定时任务开始
     */
    PageViewModel.prototype.onTimer = function () {
        console.log("开始刷新数据！");
    }

    PageViewModel.prototype.initEvent = function () {
        var theChartIndex = 0;
        $('.chart-item').each(function () {
            // debugger;
            var theData = $(this).data();
            if (theData['name']) {

                var theInstance = new ChartHuan(this, theChartIndex++);
                $(this).data('instance', theInstance);
            }
        });
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
        /*$('#date-action').click(function () {
            //$('#date-input').click();
            laydate.render({
                elem: '#date-input', //指定元素
                show: true
            });
        });
        $('#date-action1').click(function () {
            //$('#date-input').click();
            laydate.render({
                elem: '#date-input1', //指定元素
                show: true,
                //format:'yyyy年MM月dd日',
            });
        });*/
        //var personDirect=1;
        //var affiliationType=1;
        //$('.tab-left').click(function(){
        //    personDirect=1;
        //})
        //$('.tab-right').click(function(){
        //    personDirect=2;
        //})


        var me = this;
        var guishutype = '去往珠海澳门';//1;//
        //客流tab栏点击切换
        var theParentContent = $('.tab-main').closest('.content');

        $('.datediv,.datediv1').click(function(e){
            //debugger;
            e.stopPropagation();
        });

        $('.tab-main .tab-item-left ').click(function () {
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
            $('.tab-item-right .firstline').css('margin-left', '80px')
            $('.tab-item-left .firstline').css('margin-left', '54px');
            me.loadPart1();


        });


        $('.tab-main .tab-item-right').click(function () {
            //debugger;
            //var parent=$(this).parent();
            var theIndex = $(this).data('index');
            $('.tab-main .tab-item-left').addClass('select_a');
            $('.tab-main .tab-item-right').removeClass('select_a');
            $('.datediv,.dateline').hide();
            $('.datediv1,.dateline1').show();
            $('.tab-item-left .firstline').css('margin-left', '80px')
            $('.tab-item-right .firstline').css('margin-left', '54px')

            $(theParentContent).find('.part1').hide();
            $(theParentContent).find('.part2').hide();
            $(theParentContent).find('.part-' + theIndex).show();
            me.loadPart2();
            /*if (theIndex == 2) {
                me.loadPart2();
            }
            else {
                me.loadPart1();
            }*/
        });


        //归属分析香港-珠海澳门点击切换

        $('.tab-direction .tab-left,.tab-direction .tab-right').click(function () {
            var theIndex = $(this).data('index');//$(this).data('index');
            var theDataIndex=$(this).index();//theIndex;//
            $('.tab-direction div').removeClass('select');
            $('.tab-direction').removeClass('tab-imgage1');
            $('.tab-direction').removeClass('tab-imgage2');
            $('.tab-direction').addClass('tab-imgage' + (theDataIndex+1));
            $(this).addClass('select');
            guishutype = theIndex;
            //guishutype = theIndex;
            me.loadBridgeAttributionType(guishutype);
            //区域列表
            me.loadBridgeAttributionArea(guishutype, affiliationType);
        });
        //归属类型切换
        $('.guishu .tab-item').click(function () {
            var theIndex = $(this).data('index');
            affiliationType = theIndex
            $('.tab-item').removeClass('active');
            $(this).addClass('active');

            me.loadBridgeAttributionArea(guishutype, affiliationType);


        });
        //debugger
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            //range: true,//范围选择
            //format:'yyyy年MM月dd日',
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
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate1 != value) {
                    theCurrentDate1 = value;
                    // me.loadPredict();
                    me.loadPart2();

                }

            }
        });
        /*$('#date-input').change(function(){
            theCurrentDate=$(this).val();
            console.log('日期变化:'+theCurrentDate);
        });*/
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
        //注意修改参数
        this.loadWeather();
        //this.loadBridgeFlow();
        this.loadBridgeRealTimeNumber();
    }

    PageViewModel.prototype.loadChart1 = function (data) {
        if (!this.Chart1) {
            this.Chart1 = echarts.init(document.getElementById('chart1'));
        }
        var theXData = [];
        for (var i = 0; i <= 17; i++) {
            theXData.push(i);
        }
        var theCurrentOption = {};
        $.extend(true,theCurrentOption, option1);

//debugger;
        theCurrentOption.series = [

            {
                //name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                data: data,
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
            //{
            //    //name: '搜索引擎',
            //    type: 'line',
            //    itemStyle: {
            //        normal: {
            //            lineStyle: {
            //                width: 2,
            //                color: '#ffdc6f',
            //                type: 'dotted'  //'dotted'虚线 'solid'实线
            //            }
            //        }
            //    },
            //    smooth: true,
            //    //stack: '总量',
            //    data:data2|| [52, 55, 56, 67, 54, 62]
            //}
        ]
        this.Chart1.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart2 = function (xData, data1, data2, data3) {
        if (!this.Chart2) {
            this.Chart2 = echarts.init(document.getElementById('chart2'));
        }
        data1=data1||[];
        data2=data2||[];
        data3=data3||[];
        var theCurrentOption = {};
        $.extend(true,theCurrentOption, option1);
        var theDate1String=formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theBeginDate=new Date(datebegin);
        var theEndDate=new Date(dateend);
        var theXData=[];
        while (theEndDate.getTime()>theBeginDate.getTime()){
            theXData.push((theBeginDate.getMonth()+1)+'-'+FormateDateNum(theBeginDate.getDate()));
            theBeginDate.setDate(theBeginDate.getDate()+1);
        }
        theCurrentOption.xAxis.data=theXData;
        theCurrentOption.xAxis.axisLabel.rotate=0;
        theCurrentOption.legend = {
            data: [{name: '每日客流', textStyle: {color: "#85a8b8"}}, {
                name: '香港>>珠海澳门',
                textStyle: {color: "#85a8b8"}
            }, {name: '珠海澳门>>香港', textStyle: {color: "#85a8b8"}}
                // x:'left',
                //padding:50,
            ]
        },
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
                type: 'line',
                //stack: '总量',
                name: '每日客流',
                itemStyle: {
                    color: '#d1b96b'
                },
                //tooltip:{
                //    backgroundColor: 'red',
                //},
                smooth: true,
                data: data1.map(function (item) {
                    return (item/10000).toFixed(2);
                }),// || [1, 1, 1, 1, 1, 1],
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
                data: data2.map(function (item) {
                    return (item/10000).toFixed(2);
                }) ,//|| [2, 2, 2, 2, 2, 2, 2]
            },
            {
                //  name: '搜索引擎',
                type: 'line',
                name: '珠海澳门>>香港',
                itemStyle: {
                    normal: {
                        color: '#219553',
                        lineStyle: {

                            width: 2,
                            color: '#219553',
                            type: 'solid'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                smooth: true,
                //stack: '总量',
                data: data3.map(function (item) {
                    return (item/10000).toFixed();
                }) ,//|| [3, 3, 3, 3, 3, 3, 3]
            }
        ];

        this.Chart2.setOption(theCurrentOption);

    }

    PageViewModel.prototype.loadChart3 = function (xData, data1, data2) {
        if (!this.Chart3) {
            this.Chart3 = echarts.init(document.getElementById('chart3'));
        }
        data1=data1||[];
        data2=data2||[];
        var theCurrentOption = {};
        $.extend(true,theCurrentOption, option1);
        var theDate1String=formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theBeginDate=new Date(datebegin);
        var theEndDate=new Date(dateend);
        var theXData=[];
        while (theEndDate.getTime()>theBeginDate.getTime()){
            theXData.push((theBeginDate.getMonth()+1)+'-'+FormateDateNum(theBeginDate.getDate()));
            theBeginDate.setDate(theBeginDate.getDate()+1);
        }
        theCurrentOption.xAxis.data=theXData;
        theCurrentOption.xAxis.axisLabel.rotate=0;
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
        theCurrentOption.legend = {
            data: [{name: '每日客流', textStyle: {color: "#85a8b8"}}, {name: '观光客流', textStyle: {color: "#85a8b8"}}]
        },
            theCurrentOption.series = [
                {
                    // name: '搜索引擎',
                    type: 'line',
                    //stack: '总量',
                    name: '每日客流',
                    smooth: true,
                    data: data1.map(function (item) {
                        return (item/10000).toFixed(2);
                    }),// || [820, 932, 901, 934, 1290, 1330],
                    itemStyle: {color: '#d1b96b'},
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
                    name: '观光客流',

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
                    data: data2.map(function (item) {
                        return (item/10000).toFixed(2);
                    }) ,//|| [420, 532, 601, 534, 890, 930, 1320]
                }

            ];
        this.Chart3.setOption(theCurrentOption);
    }
    PageViewModel.prototype.loadChart4 = function (data) {
        if (!this.Chart4) {
            this.Chart4 = echarts.init(document.getElementById('chart4'));
        }
        var theCurrentOption = {};
        $.extend(true,theCurrentOption, option1);
        var theDate1String=formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theBeginDate=new Date(datebegin);
        var theEndDate=new Date(dateend);
        var theXData=[];
        while (theEndDate.getTime()>theBeginDate.getTime()){
            theXData.push((theBeginDate.getMonth()+1)+'-'+FormateDateNum(theBeginDate.getDate()));
            theBeginDate.setDate(theBeginDate.getDate()+1);
        }
        //debugger;
        theCurrentOption.xAxis.data=theXData;
        theCurrentOption.xAxis.axisLabel.rotate=0;
        theCurrentOption.series = [
            {
                // name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                data: data,// || [820, 932, 901, 934, 1290, 1330],
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
        this.loadChartBar();

    }

    PageViewModel.prototype.loadPart1 = function () {
        //debugger;
        this.loadBridgeIslandsRatio();
        this.loadBridgeInsightPassTime();
        this.loadBridgeAttributionType();
        this.loadBridgeFlow();
        this.loadBridgeAttributionArea();

    },
        PageViewModel.prototype.loadPart2 = function () {
            //debugger;
            this.loadBridgeFlowDirection();
            this.loadBridgeIslandsTrend();
            this.loadBridgeTrendDayPassTime();

        }

//客流洞察接口
    /***
     * 人工客流岛分析接口
     * @param date
     */
    PageViewModel.prototype.loadBridgeIslandsRatio = function () {

        var theCallUrl = "bridge/bridgeIslandsRatio.do";
        var theData = {
            date: formateDate()
        };
        var me = this;
        var theCharts = {};
        var theSelectDiv = ".part-1";
        $(theSelectDiv).find('.chart-item').each(function () {
            var theName = $(this).data('id');
            var theInstance = $(this).data('instance');
            theCharts[theName] = theInstance;

        });

        for (var key in theCharts) {
            theCharts[key].refresh('', (0).toFixed(1))
        }


        //debugger;
        this.load(theCallUrl, theData, function (data) {
            //debugger
            if (data && data.isSuccess) {
                console.log('请求成功' + data)
                var theData = data.data;//{"isSuccess":true,"msg":"success","data":[{
                // "flowType":"1",
                // "id":1,"
                // percent":10,"
                // postionName":"港珠澳大桥",
                // "postionType":"港珠澳大桥","
                // statDate":"2018-12-12","stayNum":1000000},{"flowType":"2","id":2,"percent":50,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000}]}
                //1、上桥去香港，2、下桥去珠海澳门，3、口岸观光
                if (theData && theData.length > 0) {
                    for (var i = 0; i < theData.length; i++) {
                        var theItem = theData[i];
                        //debugger

                        if (theCharts[theItem.flowType]) {
                            theCharts[theItem.flowType].refresh('', theItem.percent * 100);
                        }
                    }
                }
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
        });
    }
    /***
     * 时点通过时长接口  完成
     * @param date
     */
    PageViewModel.prototype.loadBridgeInsightPassTime = function () {
        var theCallUrl = "bridge/bridgeInsightPassTime.do";
        var theData = {
            date: formateDate()
        };
        var me = this;
        //debugger;
        this.load(theCallUrl, theData, function (data) {
            var chart1Data = []
            if (data && data.isSuccess) {
                var theResultDatas = data.data;//{"isSuccess":true,"msg":"success","data":[{"id":1,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","tTime":"6:00","tTimePass":15}]}
                //debugger
                for (var i = 0; i < theResultDatas.length; i++) {
                    var theItem = theResultDatas[i];
                    var theStayTime = theItem.tTimePass;
                    chart1Data.push(theStayTime)
                }
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
            me.loadChart1(chart1Data);
        });
    }

    /***
     * 归属类型分析接口 完成
     * @param personDirect,date
     */
    PageViewModel.prototype.loadBridgeAttributionType = function (personDirect) {
        //debugger
        var theCallUrl = "bridge/bridgeAttributionType.do";
        /*var theMap={
            '1':'去往珠海澳门',
            '2':'去往香港',
        };*/
        var theParamter = {
            personDirect: personDirect ||  '去往珠海澳门',//1,//
            date: formateDate()
        };

        var me = this;
        // debugger;
        this.load(theCallUrl, theParamter, function (data) {
            var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // $('#gzabelong1').text('(0%)');
            //$('#gzabelong2').text('(0%)');
            //$('#gzabelong3').text('(0%)');
            var theMap = {};
            $('.guishu .tab-item').each(function () {
                var theType = $(this).data('index');
                theMap[theType] = $(this).find('.secondline');
                theMap[theType].text('(0%)');
            });
            // debugger
            if (data && data.isSuccess) {
                /*{"data":[
                {"fromType":"1","id":1,"percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000,"toType":"1"},
                 {"fromType":"2","id":2,"percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000,"toType":"1"},
                 {"fromType":"3","id":3,"percent":80,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":80000000,"toType":"1"}],"isSuccess":true,"msg":"success"}*/

                //debugger;
                for (var i = 0; i < data.data.length; i++) {
                    var theItem = data.data[i];
                    if (theMap[theItem.fromType]) {
                        theMap[theItem.fromType].text('(' + (theItem.percent*100).toFixed(1) + '%)');
                    }

                }
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
        });
    },
        /***
         * 归属地市分析接口 完成
         * @param personDirect,date,affiliationType
         */
        PageViewModel.prototype.loadBridgeAttributionArea = function (personDirect, affiliationType) {
            affiliationType = affiliationType ||  '国际';//1;//
            var theCallUrl = "/bridge/bridgeAttributionArea.do";
            var theData = {
                personDirect: personDirect || '去往珠海澳门',//1,//
                affiliationType: affiliationType || '国际',//1,//
                date: formateDate()
            };
            var me = this;
            // debugger;
            this.load(theCallUrl, theData, function (data) {
                var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                $('.guishu-content ul').empty();
                if (data && data.isSuccess) {
                    /*{"data":[{"id":1,"nation":"美国","percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000,"toType":"1"}],"isSuccess":true,"msg":"success"}
                    {"data":[{"id":1,"percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","province":"湖南","statDate":"2018-12-12","stayNum":10000000,"toType":"1"}],"isSuccess":true,"msg":"success"}*/
                    var theIndex = 1;
                    for (var i = 0; i < 6; i++) {
                        var theItme = data.data[i];
                        // debugger;
                        var theTempalte = "";
                        if (theItme) {
                            if (affiliationType == '国际') {
                                theTempalte = '<li>\n' +
                                    '                                        <span class="guishu-icon">' + (i + 1) + '</span>\n' +
                                    '                                        <span class="guishu-cuntry">' + theItme.nation + '</span>\n' +
                                    '                                        <span class="guishu-line"></span>\n' +
                                    '                                        <span class="guishu-num">' + formateNum(theItme.stayNum) + '</span>人\n' +
                                    '                                    </li>';
                            } else if (affiliationType == '省外') {
                                theTempalte = '<li>\n' +
                                    '                                        <span class="guishu-icon">' + (i + 1) + '</span>\n' +
                                    '                                        <span class="guishu-cuntry">' + theItme.province + '</span>\n' +
                                    '                                        <span class="guishu-line"></span>\n' +
                                    '                                        <span class="guishu-num">' + formateNum(theItme.stayNum) + '</span>人\n' +
                                    '                                    </li>';
                            } else {
                                theTempalte = '<li>\n' +
                                    '                                        <span class="guishu-icon">' + (i + 1) + '</span>\n' +
                                    '                                        <span class="guishu-cuntry">' + theItme.city + '</span>\n' +
                                    '                                        <span class="guishu-line"></span>\n' +
                                    '                                        <span class="guishu-num">' + formateNum(theItme.stayNum) + '</span>人\n' +
                                    '                                    </li>';
                            }
                        }

                        $('.guishu-content ul').append(theTempalte);
                    }
                }
                else {
                    console.log("loadCurrent错误:" + data);
                }
            });
        }


//客流趋势接口
    /***
     * 大桥客流趋势接口 startDate ,endDate  OK
     */
    PageViewModel.prototype.loadBridgeFlowDirection = function () {
        // debugger
        var theCallUrl = "bridge/bridgeFlowDirection.do";
        var theDate1String = formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theCallArgument = {
            startDate: datebegin,
            endDate: dateend,

        };
        var me = this;
        // debugger;
        this.load(theCallUrl, theCallArgument, function (data) {
            var theData1 = [];
            var theData2 = [];
            var theData3 = [];
            var theX = [];
            if (data && data.isSuccess) {
                //{"isSuccess":true,"msg":"success","data":[{"id":1,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","toHkTra":1000000,"toMzTra":10000000}]}
                if (data.data.length > 1) {
                    var theItems = data.data;
                    for (var i = 0; i < theItems.length; i++) {
                        theData2.push(theItems[i].toMzTra);
                        theData3.push(theItems[i].toHkTra);
                        theData1.push(theItems[i].toMzTra + theItems[i].toHkTra);
                        theX.push(theItems[i].statDate);
                    }
                }

            }

            else {
                console.log("loadBridgeFlowDirection错误:" + data);
            }
            me.loadChart2(theX, theData1, theData2, theData3);
        });
    }
    /***
     * 人工岛客流趋势接口  OK
     */
    PageViewModel.prototype.loadBridgeIslandsTrend = function () {
        var theCallUrl = "/bridge/bridgeTrendPortFlow.do";//"/bridge/bridgeIslandsTrend.do";
        theDate1String = formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theCallArgument = {
            startDate: datebegin,
            endDate: dateend
        }

        var me = this;
        //debugger;
        /*
        [{"id":3,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","rgdValue":1383444,"rgdVisitor":143333,"statDate":"2018-12-20"},{"id":4,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","rgdValue":1383555,"rgdVisitor":1565381,"statDate":"2018-12-21"},{"id":5,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","rgdValue":1385552,"rgdVisitor":17899981,"statDate":"2018-12-22"}]
        * {"isSuccess":true,"msg":"success","data":[{"flowType":"1","id":1,"percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":1000000},{"flowType":"2","id":2,"percent":50,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000}]}
        * */
        this.load(theCallUrl, theCallArgument, function (data) {
            var theData1 = [];
            var theData2 = [];
            var theX = [];
            if (data && data.isSuccess) {
                if (data.data.length > 1) {
                    theItems = data.data;
                    for (var i = 0; i < theItems.length; i++) {
                        theData1.push(theItems[i].rgdValue);
                        theX.push(theItems[i].statDate);
                        theData2.push(theItems[i].rgdVisitor);
                    }
                }
            }
            else {
                console.log("loadBridgeIslandsTrend错误:" + data);
            }
            me.loadChart3(theX, theData1, theData2);
        });
    }

    /***
     * 每日平均通关时长接口 OK
     */
    PageViewModel.prototype.loadBridgeTrendDayPassTime = function () {
        var theCallUrl = "/bridge/bridgeTrendDayPassTime.do";
        theDate1String = formateDate1();
        var datebegin = theDate1String.split(" - ")[0];
        var dateend = theDate1String.split(" - ")[1];
        var theCallArgument = {
            startDate: datebegin,
            endDate: dateend
        }
        var me = this;
        // debugger;
        this.load(theCallUrl, theCallArgument, function (data) {
            var chart1Data = []
            if (data && data.isSuccess) {
                var theDatas = data.data;
                for (var i = 0; i < theDatas.length; i++) {
                    var theItem = theDatas[i];
                    var theStayTime = theItem.avePassTime;
                    chart1Data.push(theStayTime)
                }
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
            me.loadChart4(chart1Data);
        });
    }


    /***
     * 实时驻留时长图
     */
    PageViewModel.prototype.loadChartBar = function (data) {
        this.ChartBar = echarts.init(document.getElementById('form_1'));
        data = data || [];
        if(data.length>4){
            data=data.slice(0,4);
        }
        var option = {

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
//                        type : 'category',
                    data: ['0-1', '1-2', '2-3', '3-4'],// '4-5', '5-6', '6-7', '7-8', '8-24',],
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
        this.ChartBar.setOption(option);
    }


    /***
     * 实时驻留时长
     */
    PageViewModel.prototype.loadBridgeFlow = function () {
        var theCallUrl = "/bridge/bridgeFlow.do";
        var landsGps = [113.581696, 22.203582];
        var landsBounds = [[113.577594, 22.199503], [113.577383, 22.211506], [113.588696, 22.210284], [113.589762, 22.209237], [113.586109, 22.203609], [113.585467, 22.195599], [113.58378, 22.194395], [113.580179, 22.194547], [113.57709, 22.194409]];
        var bridgeGps = [113.728361, 22.28002];
        var bridgeBounds = [[113.730068, 22.278834], [113.711688, 22.274786], [113.695492, 22.264382], [113.678056, 22.251648], [113.643183, 22.240596], [113.63326, 22.23637], [113.594097, 22.20946], [113.591794, 22.211593], [113.636709, 22.24112], [113.669761, 22.252132], [113.685975, 22.259945], [113.701248, 22.273654], [113.714493, 22.279067], [113.728361, 22.28102], [113.755533, 22.28275], [113.787706, 22.280576]];
        var me = this;
        //debugger;
        me.addMarker2("格力人工岛", 113.581696, 22.203582);
        me.addMarker2("港珠澳大桥", 113.728361, 22.28002);

        this.load(theCallUrl, {}, function (res) {
            //debugger;
            if (res && res.isSuccess && res.data) {
                var theData = res.data;
                theData.bridgeUser = 0;
                theData.islandsUser = 0;
                for (var i = 0; i < theData.length; i++) {
                    var item = theData[i];
                    if (item.dataType == 1) {
                        theData.islandsUser = item.subscribercount;
                    }
                    else {
                        theData.bridgeUser = item.subscribercount;
                    }
                }
                var theBridgeUser = theData.bridgeUser;//大桥人数
                var thelandsUser = theData.islandsUser;//人工岛人数
                me.addMarker2("格力人工岛", 113.581696, 22.203582, ((thelandsUser || 0)));
                me.addMarker2("港珠澳大桥", 113.728361, 22.28002, ((theBridgeUser || 0)));
                var theReliArrays = [];
                theReliArrays.push({bounds: landsBounds, data: thelandsUser || 0, max: 1000});
                theReliArrays.push({bounds: bridgeBounds, data: theBridgeUser || 0, max: 1000});
                //me.drawReli(landsBounds, thelandsUser || 0);
                //me.drawReli(bridgeBounds, theBridgeUser || 0);
                me.drawRelis(theReliArrays);
            }

        });
    }

    /**
     * 查询实时人数
     */
    PageViewModel.prototype.loadBridgeRealTimeNumber = function () {
        var theCallUrl = "/bridge/bridgeRealTimeNumber.do";
        var me = this;
        this.load(theCallUrl, {}, function (res) {

            /*res = {
                "data": {
                    "ProCountPeople": [{
                        "id": 1,
                        "populationGd": 2000000,
                        "populationIn": 1000000,
                        "populationOut": 1000000,
                        "provinceCity": "港珠澳",
                        "statDate": "2018-12-20",
                        "statTime": "12:00"
                    }],
                    "StationTollStay": [{
                        "areaid": "港珠澳",
                        "id": 1,
                        "recordeddatetime": "2018-12-20 12:00",
                        "sourcescope": "6",
                        "statTime": "12:00",
                        "staytimespan": "3",
                        "subscribercount": 1000000
                    }],
                    "StationNewPeople": [{
                        "areaid": "港珠澳",
                        "id": 1,
                        "recordeddatetime": "2018-12-20 12:00",
                        "sourcescope": "6",
                        "statTime": "12:00",
                        "subscribercount": 1000000
                    }]
                }, "isSuccess": true, "msg": "success"
            };*/
            //debugger;
            if (res && res.isSuccess && res.data) {
                //var theProCountPeople = res.data["ProCountPeople"][0] || {};
                //var theStationNewPeople = res.data["StationNewPeople"][0] || {};
                var theStationTollStay = res.data["stay"];// res.data["StationNewPeople"];//实时驻留时长
                var theDatas = theStationTollStay.map(function (item) {
                    return item.subscribercount;//(item.subscribercount / 10000).toFixed(1);
                })
                me.loadChartBar(theDatas);
                var unitText = "万";
                var inPeople = (res.data["inPeople"] || 0);
                if (inPeople < 1000) {
                    unitText = "";
                }
                else {
                    unitText = "万";
                    inPeople = (inPeople / 10000).toFixed(1);
                }
                $('.newcome-num.in').html('<span class="newcome-people">' + inPeople + '</span>' + unitText); //进入
                var outPeople = (res.data["outPeople"] || 0);
                if (inPeople < 1000) {
                    unitText = "";
                }
                else {
                    unitText = "万";
                    outPeople = (outPeople / 10000).toFixed(1);
                }
                $('.newcome-num.out').html('<span class="newcome-people">' + outPeople + '</span>' + unitText);//离开
                var addPeople = (res.data["subscribercount"] || 0);
                if (Math.abs(addPeople) < 1000) {
                    unitText = "";
                }
                else {
                    unitText = "万";
                    addPeople = (addPeople / 10000).toFixed(1);
                }


                $('.newcome-num.add').html('<span class="newcome-people">' + addPeople + '</span>' + unitText);//新增
                //$('.newcome.out').text(( / 10000).toFixed(1));//离开
                //$('.newcome.add').text(( / 10000).toFixed(1));//新增
            }

        });
    }
    window.PageView = new PageViewModel();
})