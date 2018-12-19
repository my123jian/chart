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
    var theTimer = null;
    var theCurrentDate = null;
    var datebegin=null;
    var dateend=null;

    function PageViewModel() {
        this.initEvent();
        this.initCharts();
        this.loadData();
        this.initMap(1);
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
        if (!theCurrentDate) {
            var theDate = new Date();
            var theBeginDay=theDate.getDay();
            var theBeginDate=theDate.addDays(theBeginDay);
            var theEndDate=theBeginDate.addDays(6);
            return theBeginDate.getFullYear() + "-" + (theBeginDate.getMonth() + 1) + "-" + theBeginDate.getDate()+" - "+
                theEndDate.getFullYear() + "-" + (theEndDate.getMonth() + 1) + "-" + theEndDate.getDate();
        }
        return theCurrentDate;//theCurrentDate.year + '-' + theCurrentDate.month + '-' + theCurrentDate.date;//
    }
    var formateDate1 = function () {
        //debugger;
        if (!theCurrentDate1) {
            var theDate1 = new Date();
            var theBeginDay1=theDate1.getDay();
            var theBeginDate1=theDate1.addDays(theBeginDay1);
            var theEndDate1=theBeginDate1.addDays(6);
            datebegin=theBeginDate1.getFullYear() + "-" + (theBeginDate1.getMonth() + 1) + "-" + theBeginDate1.getDate();
            dateend=theEndDate1.getFullYear() + "-" + (theEndDate1.getMonth() + 1) + "-" + theEndDate1.getDate();
            return theBeginDate1.getFullYear() + "-" + (theBeginDate1.getMonth() + 1) + "-" + theBeginDate1.getDate()+" - "+
                theEndDate1.getFullYear() + "-" + (theEndDate1.getMonth() + 1) + "-" + theEndDate1.getDate();
        }
        return theCurrentDate1;//theCurrentDate.year + '-' + theCurrentDate.month + '-' + theCurrentDate.date;//
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

    }

    PageViewModel.prototype.initEvent = function () {
        var theChartIndex = 0;
        $('.chart-item').each(function () {
            // debugger;
            var theData = $(this).data();
            if (theData['name']) {

                var theInstance=new ChartHuan(this, theChartIndex++);
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
        $('#date-action').click(function () {
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
        });
        //var personDirect=1;
        //var affiliationType=1;
        //$('.tab-left').click(function(){
        //    personDirect=1;
        //})
        //$('.tab-right').click(function(){
        //    personDirect=2;
        //})


        var me = this;
        var guishutype=1
        //客流tab栏点击切换
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
            if(theIndex==2){
                me.loadPart2();
            }
            else{
                me.loadPart1();
            }
        });
        //归属分析香港-珠海澳门点击切换

        $('.tab-direction .tab-left,.tab-direction .tab-right').click(function () {
            var theIndex = $(this).data('index');
            $('.tab-direction div').removeClass('select');
            $('.tab-direction').removeClass('tab-imgage1');
            $('.tab-direction').removeClass('tab-imgage2');
            $('.tab-direction').addClass('tab-imgage' + theIndex);
            $(this).addClass('select');
            var personDirect=theIndex;
            guishutype=theIndex;
            me.loadBridgeAttributionType(personDirect)
        });
        //归属类型切换
        $('.guishu .tab-item').click(function () {
            var theIndex = $(this).data('index');
            affiliationType=theIndex
            $('.tab-item').removeClass('active');
            $(this).addClass('active');

            me.loadBridgeAttributionArea(guishutype,affiliationType);




        });
        //debugger
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            range: true,//范围选择
            //format:'yyyy年MM月dd日',
            value:formateDate(),
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
            value:formateDate1(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate != date) {
                    theCurrentDate = date;
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
        $.extend(theCurrentOption, option1);


        theCurrentOption.series = [

            {
                //name: '搜索引擎',
                type: 'line',
                //stack: '总量',
                smooth: true,
                data: data ,
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
    PageViewModel.prototype.loadChart2 = function (xData, data1, data2,data3) {
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
                data:data1|| [1, 1, 1, 1, 1, 1] ,
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
                data: data2||[2, 2, 2,2, 2, 2, 2]
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
                data: data3||[3, 3, 3,3, 3, 3, 3]
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
    PageViewModel.prototype.loadChart4 = function (data) {
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
                data: data||[820, 932, 901, 934, 1290, 1330] ,
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
        this.load(theCallUrl,theData, function (data) {
        //debugger
            if (data && data.isSuccess) {
                console.log('请求成功'+data)
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
                            theCharts[theItem.flowType].refresh('', theItem.percent);
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
            var chart1Data=[]
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
        var theParamter = {
            personDirect: 1||personDirect,
            date: formateDate()
        };
        var me = this;
        // debugger;
        this.load(theCallUrl, theParamter, function (data) {
            var theData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            $('#gzabelong1').text('(0%)');
            $('#gzabelong2').text('(0%)');
            $('#gzabelong3').text('(0%)');
            //debugger
            if (data && data.isSuccess) {
                /*{"data":[
                {"fromType":"1","id":1,"percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000,"toType":"1"},
                 {"fromType":"2","id":2,"percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000,"toType":"1"},
                 {"fromType":"3","id":3,"percent":80,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":80000000,"toType":"1"}],"isSuccess":true,"msg":"success"}*/
                for (var i = 0; i < res.data.length; i++) {
                    var theItem = res.data[i];
                    $('#gzabelong' + theItem.fromType).text('(' + theItem.percent + '%)');
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
    PageViewModel.prototype.loadBridgeAttributionArea = function (personDirect,affiliationType) {
        var theCallUrl = "/bridge/bridgeAttributionArea.do";
        var theData = {
            personDirect: 1||personDirect,
            affiliationType:1||affiliationType,
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
                for (var i = 0; i < data.data.length; i++) {
                    var theItme = data.data[i];
                    if(affiliationType==1){
                        var theTempalte = '<li>\n' +
                            '                                        <span class="guishu-icon">' + theIndex + '</span>\n' +
                            '                                        <span class="guishu-cuntry">' + theItme.nation + '</span>\n' +
                            '                                        <span class="guishu-line"></span>\n' +
                            '                                        <span class="guishu-num">' + formateNum(theItme.stayNum) + '</span>人\n' +
                            '                                    </li>';
                    }else if(affiliationType==2){
                        var theTempalte = '<li>\n' +
                            '                                        <span class="guishu-icon">' + theIndex + '</span>\n' +
                            '                                        <span class="guishu-cuntry">' + theItme.province + '</span>\n' +
                            '                                        <span class="guishu-line"></span>\n' +
                            '                                        <span class="guishu-num">' + formateNum(theItme.stayNum) + '</span>人\n' +
                            '                                    </li>';
                    }else{
                        var theTempalte = '<li>\n' +
                            '                                        <span class="guishu-icon">' + theIndex + '</span>\n' +
                            '                                        <span class="guishu-cuntry">' + theItme.city + '</span>\n' +
                            '                                        <span class="guishu-line"></span>\n' +
                            '                                        <span class="guishu-num">' + formateNum(theItme.stayNum) + '</span>人\n' +
                            '                                    </li>';
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
        debugger
        var theCallUrl = "bridge/bridgeFlowDirection.do";

        var theCallArgument = {
            startDate: datebegin,
            endDate:dateend,

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
                    var theItems = data.data[0];
                    for (var i = 0; i < theItems.length; i++) {
                        theData1.push(theItems[i].tra_value);
                        theX.push(theItems[i].statDate);
                    }
                }
                if (data.data.length >= 2) {
                    var theItems = data.data[1];
                    for (var i = 0; i < theItems.length; i++) {
                        theData2.push(theItems[i].toMzTra);
                        theData3.push(theItems[i].toHkTra);
                    }
                }
            }

            else {
                console.log("loadCurrent错误:" + data);
            }
            me.loadChart2(theX, theData1, theData2,theData3);
        });
    }
    /***
     * 人工岛客流趋势接口  OK
     */
    PageViewModel.prototype.loadBridgeIslandsTrend = function () {
        var theCallUrl = "/bridge/bridgeIslandsTrend.do";
        var theCallArgument = {
            startDate:datebegin,
            endDate:dateend
        }

        var me = this;
        // debugger;
        /*
        * {"isSuccess":true,"msg":"success","data":[{"flowType":"1","id":1,"percent":10,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":1000000},{"flowType":"2","id":2,"percent":50,"postionName":"港珠澳大桥","postionType":"港珠澳大桥","statDate":"2018-12-12","stayNum":10000000}]}
        * */
        this.load(theCallUrl, theCallArgument, function (data) {
            var theData1 = [];
            var theData2 = [];
            var theX = [];
            if (data && data.isSuccess) {
                if (data.data.length > 1) {
                    var theItems = data.data[0];
                    for (var i = 0; i < theItems.length; i++) {
                        theData1.push(theItems[i].rgd_value);
                        theX.push(theItems[i].statDate);
                    }
                }
                if (data.data.length >= 2) {
                    var theItems = data.data[1];
                    for (var i = 0; i < theItems.length; i++) {
                        theData2.push(theItems[i].rgd_visitor);
                    }
                }
            }
            else {
                console.log("loadCurrent错误:" + data);
            }
            me.loadChart3(theX, theData1, theData2);
        });
    }

    /***
     * 每日平均通关时长接口 OK
     */
    PageViewModel.prototype.loadBridgeTrendDayPassTime= function () {
        var theCallUrl = "/bridge/bridgeTrendDayPassTime.do";
        var theCallArgument = {
            startDate:datebegin,
            endDate:dateend
        }
        var me = this;
        // debugger;
        this.load(theCallUrl, theCallArgument, function (data) {
            var chart1Data=[]
            if (data && data.isSuccess) {
                var theDatas = data.data;
                for (var i = 0; i < theDatas.length; i++) {
                    var theItem = theDatas[i];
                    var theStayTime = theItem.qzStayTime;
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
        var option = {

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
//                        type : 'category',
                    data : ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-24',],
                    "axisTick":{       //y轴刻度线
                        "show":false
                    },
                    "splitLine": {     //网格线
                        "show": false
                    },
                    axisLine:{
                        show:false,
                        lineStyle:{
                            color:'#d9f1ff',

                        }

                    }
                }
            ],
            yAxis : [

                {
                    type : 'value',
                    min:'0',
                    max:'10',
                    "show" : false,
                    "axisTick":{       //y轴刻度线
                        "show":false
                    },
                    "splitLine": {     //网格线
                        "show": false
                    }
                }
            ],
            series : [

                {
                    //设置柱形条是否显示数据
                    label : {
                        normal: {
                            show: true,
                            'position':'top'
                        }
                    },
                    name:'累积',
                    type:'bar',
//                        barWidth:'33.3%',
                    data:data||[4,5,6,3,4.2,3.5],
                    itemStyle:{
                        normal:{
                            color:'#80ddfe'
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
    PageViewModel.prototype.loadBridgeFlow= function () {
        var theCallUrl = "/bridge/bridgeFlow.do";

        var me = this;
        this.load(theCallUrl,function (res) {

            if (res && res.isSuccess) {

            }

        });
    }


    window.PageView = new PageViewModel();
})