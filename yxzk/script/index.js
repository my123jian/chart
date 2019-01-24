$(function () {
        var theChar1Id = "chart1";
        var theChar2Id = "chart2";

        //当前选择的时间
        var theCurrentDate = null;
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

        var formateDateNumText = function (ele, date) {
            var theDateText = date.year + '-' + FormateDateNum(date.month) + '-' + FormateDateNum(date.date);
            var theDate = new Date(theDateText);
            var theBeginDate = new Date('2019-01-20');
            var theMaxDate = new Date('2019-03-02');
            //debugger;
            if (theDate.getTime() > theMaxDate.getTime() || theBeginDate.getTime() > theDate.getTime()) {
                //$(ele).closest('.date-text').hide();
                $(ele).text(0);
            }
            if (theBeginDate.getTime() < theDate.getTime()) {
                var theDays = Date.daysBetween(theBeginDate, theDate) + 1;
                //debugger;
                var theText = theDays;
                $(ele).text(theText);
            }
        }
        //格式化为中文的数字
        /* var formateCnNum = function (num) {
                 var theNums = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
                 if (num > 0 && num < 100) {
                     if (num <= 10) {
                         return theNums[num - 1];
                     }
                     var theNumStrs = [];
                     var theSourceStrNum = num + "";
                     if (theSourceStrNum.length >= 2) {
                         for (var i = 0; i < theSourceStrNum.length; i++) {
                             var theNumVal = parseInt(theSourceStrNum[i]);
                             if (theNumVal == 0) {
                                 theNumStrs.push('十');
                             } else {
                                 theNumStrs.push(theSourceStrNum[theNumVal - 1]);
                             }
                         }
                     }
                 }
                 return theNumStrs.join('');

             }*/
        var formateDate = function () {
            if (!theCurrentDate) {
                var theDate = GetYesterdayDate();// GetYesterdayDate();
                //theDate.setDate(theDate.getDate()-1);
                if (theDate.getHours() < 12) {
                    theDate = theDate.addDays(-1);
                }
                return theDate.getFullYear() + "-" + FormateDateNum(theDate.getMonth() + 1) + "-" + FormateDateNum(theDate.getDate());
            }
            return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
        }
        var formateDate1 = function () {
            if (!theCurrentDate) {
                var theDate = GetYesterdayDate();
                //var theCurrentDate = new Date();
                if (theDate.getHours() < 12) {
                    theDate = theDate.addDays(-1);
                }
                // theDate.setDate(theDate.getDate()-1);
                return theDate.getFullYear() + "年" + FormateDateNum(theDate.getMonth() + 1) + "月" + FormateDateNum(theDate.getDate()) + '日';
            }
            return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
        }


        function PageViewModel() {
            this.initEvent();
            this.initCharts();
            this.loadData();
            this.start();
        }

        PageViewModel.prototype = new PageViewBase();
        /**
         * 定时任务开始
         */
        PageViewModel.prototype.onTimer = function () {
            console.log("开始刷新数据!");
            this.loadData1();
        }
        PageViewModel.prototype.updateDate = function () {
            $('.date').val(formateDate1());
        }
        PageViewModel.prototype.initEvent = function () {
            //this.updateDate();
            var me = this;

            var theMaxDate = new Date('2019-03-01');
            var theMinDate = new Date('2019-02-21');
            if (GetTodayDate().getTime() > theMaxDate.getTime() || GetTodayDate().getTime() < theMinDate.getTime()) {
                $('.date-text').hide();
            }
            else {
                formateDateNumText('#date2', GetTodayDate());
                formateDateNumText('#date3', GetTodayDate());
            }

            //$('#date2,#date3').val(formateDate1());
            laydate.render({
                elem: '#date1', //指定元素
                trigger: 'click',
                format: 'yyyy年MM月dd日',
                value: formateDate1(),
                max: GetTodayDate().formate(),
                done: function (value, date, endDate) {
                    //debugger;
                    formateDateNumText('.date1-num', date);
                    //console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                    //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                    //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    if (theCurrentDate != date) {
                        theCurrentDate = date;
                        me.loadData1();
                        //me.loadPredict();
                    }

                }
            });
            $('.part22-btn .btn').click(function () {
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.part22-btn .btn').removeClass('active');
                $(this).addClass('active');
                me.loadData2();
            });
            $('.part2 .item').click(function () {
                if ($(this).hasClass('active')) {
                    return;
                }
                //debugger;
                $('.part2 .item').removeClass('active');
                $(this).addClass('active');
                var theModel = $(this).data('mode');
                $('.part2').removeClass('active');
                if (theModel == 2) {
                    $('.part2').addClass('active')
                    $('.chart-group1').hide();
                    $('.chart-group2').show();
                }
                else {
                    //$('.part22').hide();
                    $('.chart-group1').show();
                    $('.chart-group2').hide();
                    //$('.chart-2').show();
                }
                // $('.btn-contain .btn').hide();
                // $('#chart1,#chart3').hide();
                //$('.btn-contain .btn' + theModel).show();
                //$('.part2' + theModel).show();
                $('.part2').data('mode', theModel);
                //debugger;

                me.loadData2();
            });
            $('.select').change(function () {

                me.loadData3();
            });
            $('.chart-group1 .chart-small').click(function (item) {
                if (!$(this).hasClass('chart-big')) {
                    $('.chart-group1 .chart-small').removeClass('chart-big');
                    $(this).addClass('chart-big');
                    me.ChartGonglu.resize();
                    me.ChartTotal.resize();
                    me.ChartTielu.resize();
                    me.ChartShuilu.resize();
                    me.ChartMinhang.resize();
                }
            });

            $('.chart-group2 .chart-small').click(function (item) {
                if (!$(this).hasClass('chart-big')) {
                    $('.chart-group2 .chart-small').removeClass('chart-big');
                    $(this).addClass('chart-big');
                    me.chart2Hangban.resize();
                    me.chart2Lieche.resize();
                    me.chart2Gaotie.resize();
                }
            });
            var theInstance = this;
            $('.chart-group1 .chart-small').each(function () {
                var me = this;
                $(me).find('.btn-contain .btn1').click(function (item) {
                    if ($(this).hasClass('active')) {
                        return;
                    }
                    $(me).find('.btn-contain .btn1').removeClass('active');
                    $(this).addClass('active');
                    theInstance.loadData2();
                });
                $(me).find('.btn-contain .btn2').click(function (item) {
                    if ($(this).hasClass('active')) {
                        return;
                    }
                    $(me).find('.btn-contain .btn2').removeClass('active');
                    $(this).addClass('active');
                    theInstance.loadData2();
                });
            });

            $('.chart-group2 .chart-small').each(function () {
                var me = this;
                $(me).find('.btn-contain .btn1').click(function (item) {
                    if ($(this).hasClass('active')) {
                        return;
                    }
                    $(me).find('.btn-contain .btn1').removeClass('active');
                    $(this).addClass('active');
                    theInstance.loadData2();
                });
                /* $(me).find('.btn-contain .btn2').click(function (item) {
                     if ($(this).hasClass('active')) {
                         return;
                     }
                     $(me).find('.btn-contain .btn2').removeClass('active');
                     $(this).addClass('active');
                     theInstance.loadData2();
                 });*/
            });

        }


        PageViewModel.prototype.loadChart1 = function (theXData, dataArray1, dataArray2) {
            /*if (!this.Chart1) {
                this.Chart1 = echarts.init(document.getElementById('chart1'));
            }*/
            if (!this.ChartTotal) {
                this.ChartTotal = echarts.init(document.getElementById('chart-total'));
            }
            if (!this.ChartGonglu) {
                this.ChartGonglu = echarts.init(document.getElementById('chart-gonglu'));
            }
            if (!this.ChartTielu) {
                this.ChartTielu = echarts.init(document.getElementById('chart-tielu'));
            }
            if (!this.ChartShuilu) {
                this.ChartShuilu = echarts.init(document.getElementById('chart-shuilu'));
            }
            if (!this.ChartMinhang) {
                this.ChartMinhang = echarts.init(document.getElementById('chart-minhang'));
            }

            var theValues = [];
            $('.chart-group1').find('.btn.active').each(function () {
                theValues.push($(this).data('value'));
            });


            var theCharts = [this.ChartTotal, this.ChartGonglu, this.ChartTielu, this.ChartShuilu, this.ChartMinhang];
            //debugger;
            dataArray1 = dataArray1 || [[], [], [], [], []];
            dataArray2 = dataArray2 || [[], [], [], [], []];
            var theItemConfig = [
                {name: theValues[0] == '发送量' ? '发送总量' : '累计发送量', textStyle: {color: "#ffdc6f"}},
                {name: theValues[1] == '发送量' ? '发送总量' : '累计发送量', textStyle: {color: "#ffdc6f"}},
                {
                    name: theValues[2] == '发送量' ? '发送总量' : '累计发送量', textStyle: {color: "#ffdc6f"}
                },
                {name: theValues[3] == '发送量' ? '发送总量' : '累计发送量', textStyle: {color: "#ffdc6f"}}
                , {name: theValues[4] == '发送量' ? '发送总量' : '累计发送量', textStyle: {color: "#ffdc6f"}}];
            var theBeginDate = new Date('2019-01-21');
            var theXData = [];
            theXData.push(theBeginDate.getTime());
            for (var i = 1; i < 40; i++) {
                theBeginDate.setDate(theBeginDate.getDate() + 1);
                theXData.push(theBeginDate.getTime());
            }
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
                                //show: true
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
                            var theKeyMap = {};
                            for (var i = 0; i < params.length; i = i + 1) {
                                if (!theKeyMap[params[i].seriesName]) {
                                    //debugger;
                                    var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                                    theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data) + '万');
                                    theKeyMap[params[i].seriesName] = true;
                                }
                            }
                            var theDate = new Date();
                            theDate.setTime(params[0].name);
                            var theNameText = theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                            return theNameText + '<br/>' + theDatas.join('<br />');
                        }
                    },

                    /*legend: {
                        //align:'right',//
                        top: 30,
                        right: 320,
                        textStyle: {
                            color: '#557398',
                        },
                        data: theItemConfig
                    },*/
                    color: theItemConfig.map(function (item) {
                        return item.textStyle.color;
                    }),
                    grid: {
                        left: 20,
                        right:
                            30,
                        top:
                            40,
                        bottom:
                            20,
                        width:
                            680,
                        height:
                            190,
                        containLabel:
                            true
                    }
                    ,
                    xAxis: {
                        type: 'category',
                        boundaryGap:
                            false,
                        name:
                            '(日期)',
                        axisLine:
                            {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            }
                        ,
                        axisPointer: {
                            label: {

                                color: '#05cffa',
                                formatter:

                                    function (arg) {
                                        //debugger;
                                        var theDate = new Date();
                                        theDate.setTime(arg.value);
                                        return theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                                    }
                            }
                            ,
                            lineStyle: {
                                color: '#05cffa',
                                shadowBlur:
                                    {
                                        shadowColor: '#05cffa',
                                        shadowBlur:
                                            10
                                    }
                            }
                        }
                        ,
                        axisLabel: {
                            rotate: 30,
                            formatter:

                                function (value, idx) {
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
                        }
                        ,
                        data: theXData
                    }
                    ,
                    yAxis: {
                        type: 'value',
                        name:
                            '(人数/万)',
                        splitLine:
                            {
                                show: false
                            }
                        ,
                        axisLine: {
                            lineStyle: {
                                color: 'white'//'#557398'
                            }
                        }
                    }
                    ,
                    series: []
                }
            ;
            var series = [];
            var getSeries = function (name, color, data) {
                data = data || [];
                var theSeries1 = {
                    name: name,
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    color: color,
                    showSymbol: false,
                    tooltip: {
                        position: 'left',
                    },
                    data: data[0].map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: formateRgba(color, 0.3)// 'rgba(255,220,111,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba(color, 0.15)// 'rgba(255,220,111,0.15)'
                                }, {
                                    offset: 1, color: formateRgba(color, 0)//  'rgba(255,220,111,0)'
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: color
                        }
                    }
                };
                var theSeries2 = {
                    name: name,
                    type: 'line',
                    symbol: 'none',
                    color: color,
                    smooth: true,
                    showSymbol: false,
                    tooltip: {
                        position: 'left',
                    },
                    data: data[1].map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: formateRgba('#916C49', 0.3)// 'rgba(255,220,111,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba('#916C49', 0.15)// 'rgba(255,220,111,0.15)'
                                }, {
                                    offset: 1, color: formateRgba('#916C49', 0)//  'rgba(255,220,111,0)'
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: color,
                            type: 'dotted'  //'dotted'虚线 'solid'实线
                        }
                    }
                };
                return [theSeries1, theSeries2];
            }
            //dataArray = dataArray || [];
            for (var i = 0; i < theItemConfig.length; i++) {
                var theItem = theItemConfig[i];
                var theOptions = {};
                $.extend(true, theOptions, option);
                series = getSeries(theItem.name, theItem.textStyle.color, [dataArray1[i], dataArray2[i]] || [[], []]);
                //debugger;
                theOptions.series = series;
                theCharts[i].setOption(theOptions);
            }

            //this.Chart1.setOption(option);
        }
        PageViewModel.prototype.loadChart3 = function (theXData, dataArray) {
            //发送 到达 延误
            var theItemConfig = [
                {name: '发送', textStyle: {color: "#cfccfc"}},
                {name: '到达', textStyle: {color: "#ffdc6f"}},
                {
                    name: '延误', textStyle: {color: "#32ff4a"}
                }];
            var theChartMap = {};
            var theValues = ["Flight", "Train", "HighTrain"];
            if (!this.chart2Hangban) {
                this.chart2Hangban = echarts.init(document.getElementById('chart2-hangban'));

            }
            theChartMap['Flight'] = this.chart2Hangban;
            if (!this.chart2Lieche) {
                this.chart2Lieche = echarts.init(document.getElementById('chart2-lieche'));

            }
            theChartMap['Train'] = this.chart2Lieche;
            if (!this.chart2Gaotie) {
                this.chart2Gaotie = echarts.init(document.getElementById('chart2-gaotie'));

            }
            theChartMap['HighTrain'] = this.chart2Gaotie;
            //debugger;
            var theBeginDate = new Date('2019-01-21');
            var theXData = [];
            theXData.push(theBeginDate.getTime());
            for (var i = 1; i < 40; i++) {
                theBeginDate.setDate(theBeginDate.getDate() + 1);
                theXData.push(theBeginDate.getTime());
            }
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
                                //show: true
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
                            for (var i = 0; i < params.length; i = i + 1) {
                                if(params[i].data==undefined){
                                    continue;
                                }
                                var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                                theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data) + '次');
                            }
                            /* while (theIndex < params.length - 1) {

                                     theText += params[theIndex].data + "<br />";
                                     theIndex += 2;
                                 }*/
                            var theDate = new Date();
                            theDate.setTime(params[0].name);
                            var theNameText = theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                            return theNameText + '<br/>' + theDatas.join('<br />');
                        }
                    },

                    legend: {
                        //align:'right',//
                        top: 30,
                        right: 320,
                        textStyle: {
                            color: '#557398',
                        },
                        data: theItemConfig
                    },
                    color: theItemConfig.map(function (item) {
                        return item.textStyle.color;
                    }),
                    grid: {
                        left: 40,
                        right:
                            30,
                        top:
                            40,
                        bottom:
                            20,
                        width:
                            630,
                        height:
                            190,
                        containLabel:
                            true
                    }
                    ,
                    xAxis: {
                        type: 'category',
                        boundaryGap:
                            false,
                        name:
                            '(日期)',
                        axisLine:
                            {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            }
                        ,
                        axisPointer: {
                            label: {

                                color: '#05cffa',
                                formatter:

                                    function (arg) {
                                        //debugger;
                                        var theDate = new Date();
                                        theDate.setTime(arg.value);
                                        return theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                                    }
                            }
                            ,
                            lineStyle: {
                                color: '#05cffa',
                                shadowBlur:
                                    {
                                        shadowColor: '#05cffa',
                                        shadowBlur:
                                            10
                                    }
                            }
                        }
                        ,
                        axisLabel: {
                            rotate: 30,
                            formatter:

                                function (value, idx) {
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
                        }
                        ,
                        data: theXData
                    }
                    ,
                    yAxis: {
                        type: 'value',
                        name:
                            '(次)',
                        splitLine:
                            {
                                show: false
                            }
                        ,
                        axisLine: {
                            lineStyle: {
                                color: 'white'//'#557398'
                            }
                        }
                    }
                    ,
                    series: []
                }
            ;
            // var series = [];
            var getSeries = function (name, color, data) {
                data = data || [];
                var theSeries = {
                    name: name,
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    showSymbol: false,
                    tooltip: {
                        position: 'left',
                    },
                    data: data.map(function (item) {
                        return item
                    }),
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: formateRgba(color, 0.3)//  'rgba(255,220,111,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba(color, 0.15)//  'rgba(255,220,111,0.15)'
                                }, {
                                    offset: 1, color: formateRgba(color, 0)// 'rgba(255,220,111,0)'
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: color
                        }
                    }
                };
                return theSeries;
            }
            dataArray = dataArray || [];
            var theDataKeys = ['send', 'reach', 'delay'];
            for (var i = 0; i < theValues.length; i++) {
                var theValue = theValues[i];
                var theOptions = {};
                $.extend(true, theOptions, option);
                var theSeries = [];
                var theLength = 3;
                if (theValue == "HighTrain") {
                    theLength = 2;
                }

                for (var j = 0; j < theLength; j++) {
                    var theItem = theItemConfig[j];
                    theSeries.push(getSeries(theItem.name, theItem.textStyle.color, (dataArray[i] || []).map(
                        function (item) {
                            return item[theDataKeys[j]];
                        }
                    ) || []));
                }
                theOptions.series = theSeries;
                theChartMap[theValue].setOption(theOptions);
            }
            /*this.chart2Hangban.setOption(option);
            this.chart2Lieche.setOption(option);
            this.chart2Gaotie.setOption(option);*/

        }
        PageViewModel.prototype.loadChart3Old = function (theXData, dataArray) {
            if (!this.Chart3) {
                this.Chart3 = echarts.init(document.getElementById('chart3'));
            }

            //发送 到达 延误
            var theItemConfig = [
                {name: '发送', textStyle: {color: "#cfccfc"}},
                {name: '到达', textStyle: {color: "#ffdc6f"}},
                {
                    name: '延误', textStyle: {color: "#32ff4a"}
                }];
            dataArray && (theItemConfig.length = dataArray.length);
            //debugger;
            var theBeginDate = new Date('2019-01-21');
            var theXData = [];
            theXData.push(theBeginDate.getTime());
            for (var i = 1; i < 40; i++) {
                theBeginDate.setDate(theBeginDate.getDate() + 1);
                theXData.push(theBeginDate.getTime());
            }
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
                                //show: true
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
                            for (var i = 0; i < params.length; i = i + 1) {
                                var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                                theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data) + '万');
                            }
                            /* while (theIndex < params.length - 1) {

                                     theText += params[theIndex].data + "<br />";
                                     theIndex += 2;
                                 }*/
                            var theDate = new Date();
                            theDate.setTime(params[0].name);
                            var theNameText = theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                            return theNameText + '<br/>' + theDatas.join('<br />');
                        }
                    },

                    legend: {
                        //align:'right',//
                        top: 30,
                        right: 320,
                        textStyle: {
                            color: '#557398',
                        },
                        data: theItemConfig
                    },
                    color: theItemConfig.map(function (item) {
                        return item.textStyle.color;
                    }),
                    grid: {
                        left: 40,
                        right:
                            30,
                        top:
                            40,
                        bottom:
                            10,
                        width:
                            1740,
                        height:
                            210,
                        containLabel:
                            true
                    }
                    ,
                    xAxis: {
                        type: 'category',
                        boundaryGap:
                            false,
                        name:
                            '(日期)',
                        axisLine:
                            {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            }
                        ,
                        axisPointer: {
                            label: {

                                color: '#05cffa',
                                formatter:

                                    function (arg) {
                                        //debugger;
                                        var theDate = new Date();
                                        theDate.setTime(arg.value);
                                        return theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                                    }
                            }
                            ,
                            lineStyle: {
                                color: '#05cffa',
                                shadowBlur:
                                    {
                                        shadowColor: '#05cffa',
                                        shadowBlur:
                                            10
                                    }
                            }
                        }
                        ,
                        axisLabel: {
                            rotate: 30,
                            formatter:

                                function (value, idx) {
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
                        }
                        ,
                        data: theXData
                    }
                    ,
                    yAxis: {
                        type: 'value',
                        name:
                            '(次)',
                        splitLine:
                            {
                                show: false
                            }
                        ,
                        axisLine: {
                            lineStyle: {
                                color: 'white'//'#557398'
                            }
                        }
                    }
                    ,
                    series: []
                }
            ;
            var series = [];
            var getSeries = function (name, color, data) {
                data = data || [];
                var theSeries = {
                    name: name,
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    showSymbol: false,
                    tooltip: {
                        position: 'left',
                    },
                    data: data.map(function (item) {
                        return item
                    }),
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: formateRgba(color, 0.3)//  'rgba(255,220,111,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba(color, 0.15)//  'rgba(255,220,111,0.15)'
                                }, {
                                    offset: 1, color: formateRgba(color, 0)// 'rgba(255,220,111,0)'
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: color
                        }
                    }
                };
                return theSeries;
            }
            dataArray = dataArray || [];
            for (var i = 0; i < theItemConfig.length; i++) {
                var theItem = theItemConfig[i];
                series.push(getSeries(theItem.name, theItem.textStyle.color, dataArray[i] || []));
            }
            option.series = series;
            this.Chart3.setOption(option);
        }
        /**
         * 加载交通枢纽旅客趋势
         * @param theXData
         * @param dataArray
         */
        PageViewModel.prototype.loadChart2 = function (theXData, dataArray) {
            if (!this.Chart2) {
                this.Chart2 = echarts.init(document.getElementById('chart2'));
            }
            //debugger;
            var theItemConfig = [
                /*{name: '总旅客', textStyle: {color: "#cfccfc"}},*/
                {name: '发送', textStyle: {color1: "#ffff88", color2: "#c9ce07"}},
                {name: '到达', textStyle: {color1: "#4ffeff", color2: "#058fff"}}];
            var theBeginDate = new Date('2019-01-21');
            var theXData = [];
            theXData.push(theBeginDate.getTime());
            for (var i = 1; i < 45; i++) {
                theBeginDate.setDate(theBeginDate.getDate() + 1);
                theXData.push(theBeginDate.getTime());
            }
            var option = {
                /*title: {
                        text: '折线图堆叠'
                    },*/
                color: [
                    //'#cfccfc',
                    '#6a6d06',
                    '#0441a7'],
                //align: 'left',
                tooltip: {
                    trigger: 'axis',
                    //show:true,
                    axisPointer: {
                        type: 'line',
                        show: true,
                        label: {
                            //show: true
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
                        var theKeyMap = {};
                        //debugger;
                        var step = 1;
                        if (params.length >= 4) {
                            step = 2;
                        }
                        for (var i = 0; i < params.length; i = i + step) {
                            if (!theKeyMap[params[i].seriesName]) {
                                var theColorText = "<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" + params[i].color + ";\"></span>";
                                theDatas.push(theColorText + params[i].seriesName + ':' + (params[i].data) + '万');
                                theKeyMap[params[i].seriesName] = true;
                            }
                        }
                        var theDate = new Date();
                        theDate.setTime(params[0].name);
                        var theNameText = theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                        return theNameText + '<br/>' + theDatas.join('<br />');
                    }
                },

                /*legend: {
                    show: true,
                    textStyle: {
                        color: '#557398',
                    },
                    top: 10,
                    right: 320,
                    data: theItemConfig
                },*/

                grid: {
                    left: 40,
                    right:
                        30,
                    top:
                        40,
                    bottom:
                        20,
                    width:
                        1740,
                    height:
                        180,
                    containLabel:
                        true
                }
                ,
                /*toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },*/

                xAxis: {
                    type: 'category',
                    //boundaryGap: false,
                    name: '(日期)',
                    axisTick: {       //X轴刻度线
                        "show": false
                    },
                    axisLine:
                        {
                            lineStyle: {
                                color: 'white'// '#557398'
                            }
                        }
                    ,
                    axisPointer: {
                        label: {
                            color: '#05cffa',
                            formatter:
                                function (arg) {
                                    //debugger;
                                    var theDate = new Date();
                                    theDate.setTime(arg.value);

                                    if (theDate.getTime() > new Date('2019-03-01').getTime()) {
                                        return "";
                                    }
                                    return theDate.getMonth() + 1 + "月" + theDate.getDate() + "日";
                                }
                        }
                        ,
                        lineStyle: {
                            color: '#05cffa',
                            shadowBlur:
                                {
                                    shadowColor: '#05cffa',
                                    shadowBlur: 10
                                }
                        }
                    }
                    ,
                    axisLabel: {
                        rotate: 30,
                        formatter:

                            function (value, idx) {
                                var theDate = new Date();
                                theDate.setTime(parseInt(value));
                                console.log(theDate);

                                if (theDate.getTime() > new Date('2019-03-02').getTime()) {
                                    return "";
                                }
                                if (idx % 4 == 0) {
                                    return theDate.getMonth() + 1 + '月' + theDate.getDate() + "日";
                                }
                                else {
                                    return "";
                                }
                            }
                    }
                    ,
                    data: theXData
                }
                ,
                yAxis: {
                    type: 'value',
                    name:
                        '(人数/万)',
                    splitLine:
                        {
                            show: false
                        }
                    ,
                    axisLine: {
                        lineStyle: {
                            color: 'white'// '#557398'
                        }
                    }
                }
                ,
                series: []
            };
            var series = [];
            var getSeries = function (name, color1, color2, data) {
                data = data || [[], []];
                /*if (data[0].length <= 0) {
                    for (var i = 0; i < 20; i++) {
                        data[0].push(100000 * Math.random().toFixed(2));
                    }
                    if (data[1].length > 0) {
                        for (var i = 0; i < 20; i++) {
                            data[1][i]=0;//.push(100000 * Math.random().toFixed(2));
                        }
                    }
                }*/
                //debugger;
                var theSeries1 = {
                    name: name,
                    type: 'bar',
                    barGap: 0,
                    //smooth: true,
                    //symbol: 'none',
                    //showSymbol: false,
                    barWidth: '25%',
                    /*"axisTick": {       //X轴刻度线
                        "show": false
                    },*/
                    tooltip: {
                        position: 'left',
                    },
                    data: data[0].map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    color: color1,
                    /*areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: formateRgba(color, 0.3)//  'rgba(255,220,111,0.3)'
                                }, {
                                    offset: 0.5, color: formateRgba(color, 0.15)// 'rgba(255,220,111,0.15)'
                                }, {
                                    offset: 1, color: formateRgba(color, 0)//  'rgba(255,220,111,0)'
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                           // color: color
                        }
                    }*/
                };
                var theSeries2 = {
                    name: name,
                    type: 'bar',
                    barWidth: '25%',
                    //barWidth: '50%',
                    // smooth: true,
                    //symbol: 'none',
                    //showSymbol: false,
                    /* "axisTick": {       //X轴刻度线
                         "show": false
                     },*/
                    tooltip: {
                        position: 'left',
                    },
                    data: data[1].map(function (item) {
                        return (item / 10000).toFixed(2)
                    }),
                    color: color2,
                    lineStyle: {
                        normal: {
                            //color: color,
                            type: 'dotted'
                        }
                    }
                };
                return [theSeries1, theSeries2];
            }
            dataArray = dataArray || [];
            for (var i = 0; i < theItemConfig.length; i++) {
                var theItem = theItemConfig[i];
                //debugger;
                var theData = dataArray[i] || [[], []];
                series = series.concat(getSeries(theItem.name, theItem.textStyle.color1, theItem.textStyle.color2, theData));
            }
            option.series = series;

            this.Chart2.setOption(option);
        }
        PageViewModel.prototype.initCharts = function () {
            //this.loadChart1();
            //this.loadChart2();

        }

        PageViewModel.prototype.loadData = function () {
            this.loadData1();
            this.loadData2();
            this.loadData3();
        }
        /**
         * 加载第一部分数据的1
         * @param data1
         */
        PageViewModel.prototype.loadPart11 = function (data1) {
            var theLeft1 = {
                'postion_type1_total': 0, //同比发送总量
                'send_count_total': 0,//发送量同比
                'postion_type1_total_text': '',
                //750.86万<span class="green">↑1.56%</span>
                'postion_type1_gonglu': 0, //公路
                'send_count_gonglu': 0,//发送量同比
                'postion_type1_gonglu_text': '',

                'postion_type1_tielu': 0,//铁路
                'send_count_tielu': 0,//发送量同比
                'postion_type1_tielu_text': '',

                'postion_type1_shuilu': 0,//水路
                'send_count_shuilu': 0,//发送量同比
                'postion_type1_shuilu_text': '',

                'postion_type1_minhang': 0,//民航
                'send_count_minhang': 0,//发送量同比
                'postion_type1_minhang_text': '',


                'postion_type2_total': 0,//累计同比发送总量
                'total_count_total': 0,//累计发送量同比
                'postion_type2_total_text': '',

                'postion_type2_gonglu': 0,//公路
                'total_count_gonglu': 0,//累计发送量同比
                'postion_type2_gonglu_text': '',

                'postion_type2_tielu': 0,//铁路
                'total_count_tielu': 0,//累计发送量同比
                'postion_type2_tielu_text': '',

                'postion_type2_shuilu': 0,//水路
                'total_count_shuilu': 0,//累计发送量同比
                'postion_type2_shuilu_text': '',

                'postion_type2_minhang': 0,//民航
                'total_count_minhang': 0,//累计发送量同比
                'postion_type2_minhang_text': '',

            };
            $.extend(theLeft1, data1);
            var formateText = function (num1, num2) {
                var theNum1 = num1;
                var theNum2 = num2;
                var theColor = "";//green
                if (num2 > 0) {
                    theNum2 = "" + (num2).toFixed(2) + '% ↑';
                    theColor = 'green';
                }
                if (num2 < 0) {
                    theNum2 = "" + Math.abs(num2).toFixed(2) + '% ↓';
                    theColor = 'red';
                }
                if (num1 > 1000) {
                    theNum1 = (num1 / 10000).toFixed(2) + '万';
                }
                else {
                    theNum1 = num1;
                }
                if (num2 == 0) {
                    theNum2 = "";
                }
//debugger;
                var theText = `<span class="${theColor}">${theNum2}</span>`;
                return theText;
            }

            var fromateNum = function (num1) {
                var theNum1 = "";
                var theEndStr="<div>万</div>";
                if (num1 > 1000) {
                    var theNum1 = (num1 / 10000).toFixed(2) ;
                }
                else {
                    var theNum1 = num1+"";
                    theEndStr="";
                }
                var theNumberStrArray = [];
                for (var i = 0; i < theNum1.length; i++) {
                    theNumberStrArray.push(theNum1[i]);
                }
                var theTemplate = "";
                for (var i = 0; i < theNumberStrArray.length; i++) {
                    var theCurrent = theNumberStrArray[i];
                    if (theCurrent == '.') {
                        theTemplate += '<div>'+theCurrent+'</div>';
                    }
                    else {
                        theTemplate += "<div class='num-contain' data-num='"+theCurrent+"'>" + theCurrent + "</div>";
                    }
                }
                return theTemplate+theEndStr;
            }
            var formateLeft1 = function (data) {
                data.postion_type1_total_text = formateText(data.postion_type1_total, data.send_count_total);
                data.postion_type1_gonglu_text = formateText(data.postion_type1_gonglu, data.send_count_gonglu);
                data.postion_type1_tielu_text = formateText(data.postion_type1_tielu, data.send_count_tielu);
                data.postion_type1_shuilu_text = formateText(data.postion_type1_shuilu, data.send_count_shuilu);
                data.postion_type1_minhang_text = formateText(data.postion_type1_minhang, data.send_count_minhang);

                data.postion_type1_total = fromateNum(data.postion_type1_total, data.send_count_total);
                data.postion_type1_gonglu = fromateNum(data.postion_type1_gonglu, data.send_count_gonglu);
                data.postion_type1_tielu = fromateNum(data.postion_type1_tielu, data.send_count_tielu);
                data.postion_type1_shuilu = fromateNum(data.postion_type1_shuilu, data.send_count_shuilu);
                data.postion_type1_minhang = fromateNum(data.postion_type1_minhang, data.send_count_minhang);

                data.postion_type2_total_text = formateText(data.postion_type2_total, data.total_count_total);
                data.postion_type2_gonglu_text = formateText(data.postion_type2_gonglu, data.total_count_gonglu);
                data.postion_type2_tielu_text = formateText(data.postion_type2_tielu, data.total_count_tielu);
                data.postion_type2_shuilu_text = formateText(data.postion_type2_shuilu, data.total_count_shuilu);
                data.postion_type2_minhang_text = formateText(data.postion_type2_minhang, data.total_count_minhang);

                data.postion_type2_total = fromateNum(data.postion_type2_total, data.send_count_total);
                data.postion_type2_gonglu = fromateNum(data.postion_type2_gonglu, data.send_count_gonglu);
                data.postion_type2_tielu = fromateNum(data.postion_type2_tielu, data.send_count_tielu);
                data.postion_type2_shuilu = fromateNum(data.postion_type2_shuilu, data.send_count_shuilu);
                data.postion_type2_minhang = fromateNum(data.postion_type2_minhang, data.send_count_minhang);
            }
            //debugger;
            formateLeft1(theLeft1);
            this.bind('.part1-content', theLeft1);
            if(!this.NumbersEffect){
                this.NumbersEffect=  new NumbersEffect(document.body);
            }
            else{
                this.NumbersEffect.restart();
            }


        }
        /**
         * 加载第一部分数据的2
         * @param data1
         */
        PageViewModel.prototype.loadPart12 = function (data1) {
            //debugger;
            var theLeft2 = {
                stat_date: '',//统计时间（YYYY-MM-dd
                send_flight: 0,//发送航班数
                reach_flight: 0,//到达航班数
                delay_flight: 0,//延误航班数
                delay_gd: 0,//延误旅客数
            };
            $.extend(theLeft2, data1);
            this.bind('.airinfo', theLeft2);
        }
        /**
         * 加载第一部分数据的3
         * @param data1
         */
        PageViewModel.prototype.loadPart13 = function (data1) {
            var theLeft3 = {
                stat_date: '',//统计时间（YYYY-MM-dd
                send_train: '',//发送列次
                send_high_train: '',//高铁发送列次
                reach_train: '',//到
                reach_high_train: '',//高
                delay_train: '',//延误列次
                delay_gd: '',//延误旅客数
            }
            $.extend(theLeft3, data1);
            //debugger;
            this.bind('.traininfo', theLeft3);
        }
        /***
         * 加载第一部分数据
         */
        PageViewModel.prototype.loadData1 = function () {
            var theLeft1 = {
                'postion_type1_total': 0, //同比发送总量
                'send_count_total': 0,//发送量同比
                'postion_type1_total_text': '',
                //750.86万<span class="green">↑1.56%</span>
                'postion_type1_gonglu': 0, //公路
                'send_count_gonglu': 0,//发送量同比
                'postion_type1_gonglu_text': '',

                'postion_type1_tielu': 0,//铁路
                'send_count_tielu': 0,//发送量同比
                'postion_type1_tielu_text': '',

                'postion_type1_shuilu': 0,//水路
                'send_count_shuilu': 0,//发送量同比
                'postion_type1_shuilu_text': '',

                'postion_type1_minhang': 0,//民航
                'send_count_minhang': 0,//发送量同比
                'postion_type1_minhang_text': '',


                'postion_type2_total': 0,//累计同比发送总量
                'total_count_total': 0,//累计发送量同比
                'postion_type2_total_text': '',

                'postion_type2_gonglu': 0,//公路
                'total_count_gonglu': 0,//累计发送量同比
                'postion_type2_gonglu_text': '',

                'postion_type2_tielu': 0,//铁路
                'total_count_tielu': 0,//累计发送量同比
                'postion_type2_tielu_text': '',

                'postion_type2_shuilu': 0,//水路
                'total_count_shuilu': 0,//累计发送量同比
                'postion_type2_shuilu_text': '',

                'postion_type2_minhang': 0,//民航
                'total_count_minhang': 0,//累计发送量同比
                'postion_type2_minhang_text': '',

            };
            var theLeft2 = {
                stat_date: '',//统计时间（YYYY-MM-dd
                send_flight: 0,//发送航班数
                reach_flight: 0,//到达航班数
                delay_flight: 0,//延误航班数
                delay_gd: 0,//延误旅客数
            };
            var theLeft3 = {
                stat_date: '',//统计时间（YYYY-MM-dd
                send_train: 0,//发送列次
                send_high_train: 0,//高铁发送列次
                reach_train: 0,//到
                reach_high_train: 0,//高
                delay_train: 0,//延误列次
                delay_gd: 0,//延误旅客数
            };

            this.loadPart11(theLeft1);
            this.loadPart12(theLeft2);
            this.loadPart13(theLeft3);


            //输入日期 旅客发送趋势
            var theData1 = {
                stat_date: '',
                postion_type: '',//运输方式(公路/水路/铁路/民航
                total_count: '',//累
                send_count: '',//发送量
                total_count_zb: '',//累计发送量同比
                send_count_zb: '',//发送量同比
            };//

            //var theCallUrl = "migrant/predict.do ";
            var theDate = formateDate();
            var theCallArgument = {
                date: theDate
            };

            var me = this;
            //debugger;
            var theCallUrl1 = "cw/getSendTrend.do";
            this.load(theCallUrl1, theCallArgument, function (data) {
                /* data = {
                         "isSuccess": true,
                         "msg": "success",
                         "data": [{
                             "postionType": "公路",
                             "sendCount": 0,
                             "sendCountZb": 0,
                             "statDate": "2019-01-11",
                             "sumsend": 823932,
                             "sumsendzb": -0.94,
                             "totalCount": 0,
                             "totalCountZb": -1
                         }, {
                             "postionType": "民航",
                             "sendCount": 0,
                             "sendCountZb": -1,
                             "statDate": "2019-01-11",
                             "sumsend": 823932,
                             "sumsendzb": -0.94,
                             "totalCount": 0,
                             "totalCountZb": -1
                         }, {
                             "postionType": "水路",
                             "sendCount": 0,
                             "sendCountZb": 0,
                             "statDate": "2019-01-11",
                             "sumsend": 823932,
                             "sumsendzb": -0.94,
                             "totalCount": 0,
                             "totalCountZb": -1
                         }, {
                             "postionType": "铁路",
                             "sendCount": 823932,
                             "sendCountZb": 0.06,
                             "statDate": "2019-01-11",
                             "sumsend": 823932,
                             "sumsendzb": -0.94,
                             "totalCount": 2280700,
                             "totalCountZb": -0.03
                         }]
                     };*/
                if (data && data.isSuccess) {
                    var theDataList = data.data || [];
                    var keyMap = {
                        "tielu": "铁路",
                        "gonglu": "公路",
                        "shuilu": "水路",
                        "minhang": "民航",
                        "铁路": "tielu",
                        "公路": "gonglu",
                        "水路": "shuilu",
                        "民航": "minhang",
                        "总量": "total",
                    };
                    for (var i = 0; i < theDataList.length; i++) {
                        var theItem = theDataList[i];
                        var theKey = keyMap[theItem.postionType];
                        if (theKey) {
                            theLeft1['postion_type1_' + theKey] = theItem.sendCount || 0;
                            theLeft1['send_count_' + theKey] = theItem.sendCountZb || 0;
                            theLeft1['postion_type2_' + theKey] = theItem.totalCount || 0;
                            theLeft1['total_count_' + theKey] = theItem.totalCountZb || 0;

                            //统计总的数目
                            /* theKey = 'total';
                                 theLeft1['postion_type1_' + theKey] = theItem.sumsend || 0;//theItem.send_count;
                                 theLeft1['send_count_' + theKey] = theItem.sumsendzb || 0;//theItem.sendCountZb;
                                 theLeft1['postion_type2_' + theKey] = theItem.sumstotal || 0;//theItem.totalCount;
                                 theLeft1['total_count_' + theKey] = theItem.sumtotalzb || 0;//theItem.totalCountZb;*/
                        }
                    }
                    me.loadPart11(theLeft1);
                }
                else {
                    console.log('请求错误!');
                }
            });

            //return;
            var theCallUrl2 = "cw/getFlyTrain.do";
            this.load(theCallUrl2, theCallArgument, function (data) {
                /* data = {
                         "data": {
                             "fly": {
                                 "delayFlight": 0,
                                 "delayGd": 0,
                                 "reachFlight": 0,
                                 "sendFlight": 0,
                                 "statDate": "2019-01-11"
                             },
                             "train": {
                                 "delayGd": 0,
                                 "delayTrain": 0,
                                 "reachHighTrain": 981,
                                 "reachTrain": 1124,
                                 "sendHighTrain": 982,
                                 "sendTrain": 1122,
                                 "statDate": "2019-01-11"
                             }
                         }, "isSuccess": true, "msg": "success"
                     };*/

                //航班
                var theData2Map = {
                    statDate: 'stat_date',//统计时间（YYYY-MM-dd
                    sendFlight: 'send_flight',//发送航班数
                    reachFlight: 'reach_flight',//到达航班数
                    delayFlight: 'delay_flight',//延误航班数
                    delayGd: 'delay_gd',//延误旅客数
                };
                //列车
                var theData3Map = {
                    statDate: 'stat_date',//统计时间（YYYY-MM-dd
                    sendTrain: 'send_train',//发送列次
                    sendHighTrain: 'send_high_train',//高铁发送列次
                    reachTrain: 'reach_train',//到
                    reachHighTrain: 'reach_high_train',//高
                    delayTrain: 'delay_train',//延误列次
                    delayGd: 'delay_gd',//延误旅客数
                }

                if (data && data.isSuccess && data.data) {
                    if (data.data.fly) {
                        var theFly = {};
                        for (var key in theData2Map) {
                            theFly[theData2Map[key]] = data.data.fly[key];

                        }
                        me.loadPart12(theFly);
                    }
                    if (data.data.train) {
                        var theTrain = {};
                        for (var key in theData3Map) {
                            theTrain[theData3Map[key]] = data.data.train[key];

                        }
                        me.loadPart13(theTrain);
                    }


                }
                else {
                    console.log("请求错误");
                }
            });


        }


        PageViewModel.prototype.loadData2 = function () {


            var me = this;

            var theMode = $('.part2').data('mode') || 1;
            var theValue = $('.btn' + theMode + ".active").data('value');
            //debugger;
            if (theMode == 1) {
                me.loadChart1();
                var theCallUrl = "cw/getPassengerTend.do ";
                this.load(theCallUrl, {}, function (data) {
                    /* var data = {
                         "isSuccess": true,
                         "msg": "success",
                         "data": [
                             {
                                 "passengerTendForecast":
                                     [{
                                         "postionType": "公路",
                                         "sendCount": 510.8,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 531.36,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 532.93,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 528.53,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 519,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 516.53,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 509.84,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 509.15,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 504,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-29",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 497.05,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-30",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 486.75,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-31",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 471.39,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 453.05,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-02",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 422.53,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-03",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 351.99,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-04",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 314.88,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-05",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 365.36,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-06",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 369.77,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-07",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 389.83,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-08",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 400.2,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-09",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 424.29,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-10",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 443.48,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-11",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 450.26,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-12",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 457.14,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-13",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 464.49,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-14",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 469.98,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-15",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 463.62,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-16",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 474.72,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-17",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 485.44,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-18",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 498.15,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-19",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 519.58,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-20",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 529.21,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 525.21,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 525.5,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 530.08,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 534.5,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 538,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 546.78,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 545.64,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "公路",
                                         "sendCount": 537.55,
                                         "sendCountZb": 0,
                                         "statDate": "2019-03-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.7,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.85,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.63,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.86,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.05,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.65,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.99,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 23.49,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 23.63,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-29",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 23.67,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-30",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 23.46,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-31",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 23.39,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.72,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-02",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.52,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-03",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 19.94,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-04",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 20.24,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-05",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.49,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-06",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.22,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-07",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.82,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-08",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 23.12,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-09",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 23.25,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-10",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.95,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-11",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.76,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-12",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.95,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-13",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.78,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-14",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.04,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-15",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.97,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-16",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.82,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-17",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.6,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-18",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 20.56,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-19",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.48,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-20",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.52,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.45,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.93,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.66,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.39,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.31,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.76,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 22.15,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "民航",
                                         "sendCount": 21.96,
                                         "sendCountZb": 0,
                                         "statDate": "2019-03-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 10.16,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 12.93,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.04,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 12.45,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 12.4,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.63,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.49,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 12.67,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.45,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-29",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 16.45,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-30",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 19.4,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-31",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 19.89,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 19.23,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-02",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.83,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-03",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 11.81,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-04",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 20.74,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-05",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 26.9,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-06",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 27.29,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-07",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 23.91,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-08",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 22.02,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-09",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 14.06,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-10",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 11.75,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-11",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 14.27,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-12",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.91,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-13",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 14.29,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-14",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.21,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-15",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 12.46,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-16",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 10.76,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-17",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 9.78,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-18",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 10.73,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-19",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 14.83,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-20",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 14.69,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.19,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 13.05,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 10.51,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 10.5,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 12.76,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 14.77,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 14.57,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "水路",
                                         "sendCount": 12.03,
                                         "sendCountZb": 0,
                                         "statDate": "2019-03-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 88.15,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 97.84,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 98.68,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 100.44,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 100.95,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 102.3,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 104.22,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 110.18,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 118.67,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-29",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 125.44,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-30",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 123.54,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-31",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 117.68,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 108.47,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-02",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 95.32,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-03",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 74.07,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-04",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 56.67,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-05",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 68.67,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-06",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 80.91,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-07",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 87.3,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-08",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 94.04,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-09",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 97.9,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-10",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 97.83,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-11",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 95.75,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-12",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 91.94,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-13",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 88.92,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-14",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 86.6,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-15",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 83.12,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-16",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 80.37,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-17",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 82.27,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-18",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 83.32,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-19",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 91.62,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-20",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 94.3,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 86.6,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-22",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 80.71,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-23",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 75.6,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-24",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 72.41,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-25",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 73.73,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-26",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 81.27,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-27",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 84.8,
                                         "sendCountZb": 0,
                                         "statDate": "2019-02-28",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "铁路",
                                         "sendCount": 87.48,
                                         "sendCountZb": 0,
                                         "statDate": "2019-03-01",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }, {
                                         "postionType": "总量",
                                         "sendCount": 24299.18,
                                         "sendCountZb": 0,
                                         "statDate": "2019-01-21",
                                         "sumsend": 0,
                                         "sumsendzb": 0,
                                         "totalCount": 0,
                                         "totalCountZb": 0
                                     }],
                                 "passengerTend": [{
                                     "postionType": "总量",
                                     "sendCount": 0,
                                     "sendCountZb": 0,
                                     "statDate": "",
                                     "sumsend": 0,
                                     "sumsendzb": 0,
                                     "totalCount": 0,
                                     "totalCountZb": 0
                                 }]
                             }]
                     }*/
                    //debugger;
                    var theDataArray1 = [[], [], [], [], []];
                    var theDataArray2 = [[], [], [], [], []];
                    var theKeys = ["总量", "公路", "铁路", "水路", "民航"];
                    var theValues = [];
                    $('.chart-group1').find('.btn.active').each(function () {
                        theValues.push($(this).data('value'));
                    });
                    var theValueMao = {};
                    for (var i = 0; i < theKeys.length; i++) {
                        theValueMao[theKeys[i]] = theValues[i];
                    }
                    var theDates1 = [];
                    var theDateMap1 = {};
                    var theDates2 = [];
                    var theDateMap2 = {};
                    if (data && data.isSuccess && data.data && data.data.length == 1) {
                        $('.chart-group1').data('data', data);
                        var thepassengerTendForecast = data.data[0].passengerTendForecast;//预测
                        var thepassengerTend = data.data[0].passengerTend;//当前值

                        for (var i = 0; i < thepassengerTend.length; i++) {
                            var theItem = thepassengerTend[i];
                            var theDate = theItem.statDate;
                            if (!theDateMap1[theDate]) {
                                theDateMap1[theDate] = {};
                                theDates1.push(theDate);
                            }
                            //当天日期的数量
                            var theNewItem = theDateMap1[theDate];
                            theNewItem[theItem.postionType] = {
                                sendCount: theItem.sendCount,
                                totalCount: theItem.totalCount
                            };
                        }

                        for (var i = 0; i < thepassengerTendForecast.length; i++) {
                            var theItem = thepassengerTendForecast[i];
                            var theDate = theItem.statDate;
                            if (!theDateMap2[theDate]) {
                                theDateMap2[theDate] = {};
                                theDates2.push(theDate);
                            }
                            //当天日期的数量
                            var theNewItem = theDateMap2[theDate];
                            theNewItem[theItem.postionType] = {
                                sendCount: theItem.sendCount,
                                totalCount: theItem.totalCount
                            };
                        }
                    }
                    var theXData = [];
                    //历史数据
                    for (var i = 0; i < theKeys.length; i++) {
                        var theReuslt1 = theDataArray1[i];
                        var theReuslt2 = theDataArray2[i];
                        var theKey = theKeys[i];
                        for (var j = 0; j < theDates1.length; j++) {
                            var theCurrentDate = theDates1[j];
                            var theMapItem = theDateMap1[theCurrentDate] || {};
                            if (theMapItem[theKey]) {
                                var theDataItem = theMapItem[theKey];
                                theReuslt1.push(theValueMao[theKey] == "发送量" ? (theDataItem.sendCount || 0) : (theDataItem.totalCount || 0));
                                if(j==theDates1.length-1){
                                    theReuslt2.push(theValueMao[theKey] == "发送量" ? (theDataItem.sendCount || 0) : (theDataItem.totalCount || 0));
                                }
                                else{
                                    theReuslt2.push('-');
                                }

                                //theReuslt2.push(theValueMao[theKey] == "发送量" ? (theDataItem.sendCount || 0) : (theDataItem.totalCount || 0));
                            }
                            else {
                                theReuslt1.push(0);
                                if(j==theDates1.length-1){
                                    theReuslt2.push(theValueMao[theKey] == "发送量" ? (theDataItem.sendCount || 0) : (theDataItem.totalCount || 0));
                                }
                                else{
                                    theReuslt2.push('-');
                                }
                                //theReuslt2.push(0);
                            }
                        }
                        // theDataArray.push(theReuslt);
                    }
                    //预测数据
                    for (var i = 0; i < theKeys.length; i++) {
                        var theReuslt = theDataArray2[i];
                        var theKey = theKeys[i];
                        for (var j = 0; j < theDates2.length; j++) {
                            var theCurrentDate = theDates2[j];
                            var theMapItem = theDateMap2[theCurrentDate] || {};
                            if (theMapItem[theKey]) {
                                var theDataItem = theMapItem[theKey];
                                theReuslt.push(theValueMao[theKey] == "发送量" ? (theDataItem.sendCount || 0) : (theDataItem.totalCount || 0));
                            }
                            else {
                                theReuslt.push(0);
                            }
                        }
                    }

                    /* if(theDataArray){
                             for(var i=0;i<theDataArray.length;i++){
                                 var theItem=theDataArray[i];
                                 for(var j=0;j<10;j++){
                                     theItem.push(i*10000);
                                 }
                             }
                         }*/
                    me.loadChart1(theXData, theDataArray1, theDataArray2);
                });

            }
            else {
                me.loadChart3();
                var theDataArray = [];
                var theCallUrl = "cw/getFlyTrainTrend.do ";
                this.load(theCallUrl, {
                    date:'2019-01-21'
                }, function (data) {
                    //debugger;
                    /* var theLeft3 = {
                             stat_date: '',//统计时间（YYYY-MM-dd
                             send_train: 0,//发送列次
                             send_high_train: 0,//高铁发送列次
                             reach_train: 0,//到
                             reach_high_train: 0,//高
                             delay_train: 0,//延误列次
                             delay_gd: 0,//延误旅客数
                         };*/
                    var theResult1 = [];
                    var theResult2 = [];
                    var theResult3 = [];
                    if (data && data.isSuccess && data.data) {
                        for (var i = 0; i < data.data.length; i++) {
                            var theItem = data.data[i];
                            var theFly = theItem.fly;
                            var theTrain = theItem.train;
                            var theResult = {};
                            //debugger;
                            for (var j = 0; j < theFly.length; j++) {
                                theResult1.push({
                                    'send':(theFly[j]['sendFlight'] || 0),
                                    'reach':(theFly[j]['reachFlight'] || 0),
                                    'delay':(theFly[j]['delayFlight'] || 0),
                                });
                            }
                            for (var j = 0; j < theTrain.length; j++) {
                                theResult2.push({
                                    'send':(theTrain[j]['sendTrain'] || 0),
                                    'reach':(theTrain[j]['reachTrain'] || 0),
                                    'delay':(theTrain[j]['delayTrain'] || 0),
                                });
                                theResult3.push({
                                    'send':(theTrain[j]['sendHighTrain'] || 0),
                                    'reach':(theTrain[j]['reachHighTrain'] || 0),
                                });
                            }
                            theResult['Flight'] = theFly['sendFlight'] || 0;
                            theResult['Train'] = theTrain['sendTrain'] || 0;
                            theResult['HightTrain'] = theTrain['sendHighTrain'] || 0;
                            theResult1.push(theResult);

                            /*theResult2.push({
                                Flight: (theFly['reachFlight'] || 0),
                                Train: (theTrain['reachTrain'] || 0),
                                HightTrain: (theTrain['reachHighTrain'] || 0)
                            });*/
                            theResult = {};
                            theResult['Flight'] = theFly['reachFlight'] || 0;
                            theResult['Train'] = theTrain['reachTrain'] || 0;
                            theResult['HightTrain'] = theTrain['reachHighTrain'] || 0;
                            theResult2.push(theResult);

                            /*theResult3.push({
                                Flight: (theFly['delayFlight'] || 0),
                                Train: (theTrain['delayTrain'] || 0),
                                //HightTrain:(theTrain['delay' + theValue] || 0)
                            });*/
                            theResult = {};
                            theResult['Flight'] = theFly['delayFlight'] || 0;
                            theResult['Train'] = theTrain['delayTrain'] || 0;
                            //theResult['HightTrain']=theTrain['sendHighTrain'] || 0;
                            theResult3.push(theResult);

                            /*if (theValue == "Flight") {
                                theResult1.push(theFly['send' + theValue] || 0);
                                theResult2.push(theFly['reach' + theValue] || 0);
                                theResult3.push(theFly['delay' + theValue] || 0);
                            }
                            else {
                                theResult1.push(theTrain['send' + theValue] || 0);
                                theResult2.push(theTrain['reach' + theValue] || 0);
                                if (theValue == "Train") {
                                    theResult3.push(theTrain['delay' + theValue] || 0);
                                }
                            }*/


                        }
                        theDataArray.push(theResult1);
                        theDataArray.push(theResult2);
                        theDataArray.push(theResult3);
                        me.loadChart3([], theDataArray);
                    }
                });
            }


        }
        PageViewModel.prototype.loadData3 = function () {
            var me = this;
            //重点场站旅客趋势
            //一个参数 统计日期
            /* var theData = {
                     "stat_date": "2019-01-21",//统计时间（YYYY-MM-
                     "postion_type": "公路",//运输方式(公路/水路/铁路/民航
                     "position_name": "省汽车站",//场站名称
                     "send_count": 26031,//发送旅客
                     "reach_count": 0//到达旅客
                 };*/
            var theCallUrl = "cw/getTerminalTend.do";
            var thePosition = $('.select').val();
            var theCallArgument = {
                name: thePosition
            };
            me.loadChart2();
            this.load(theCallUrl, theCallArgument, function (data) {
                    var theDataArray = [];
                    /*data = {
                        "isSuccess": true, "msg": "success",
                        "data": [{
                            "terminalTendForecast": [
                                {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 7.684,
                                    "statDate": "2019-01-21"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 8.914,
                                    "statDate": "2019-01-22"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 9.301,
                                    "statDate": "2019-01-23"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 9.462,
                                    "statDate": "2019-01-24"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 9.603,
                                    "statDate": "2019-01-25"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 9.737,
                                    "statDate": "2019-01-26"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 9.807,
                                    "statDate": "2019-01-27"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 9.99,
                                    "statDate": "2019-01-28"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 10.236,
                                    "statDate": "2019-01-29"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 10.194,
                                    "statDate": "2019-01-30"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 10.158,
                                    "statDate": "2019-01-31"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 9.722,
                                    "statDate": "2019-02-01"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 8.97,
                                    "statDate": "2019-02-02"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 6.482,
                                    "statDate": "2019-02-03"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.234,
                                    "statDate": "2019-02-04"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 1.835,
                                    "statDate": "2019-02-05"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 2.805,
                                    "statDate": "2019-02-06"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.1,
                                    "statDate": "2019-02-07"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.508,
                                    "statDate": "2019-02-08"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.944,
                                    "statDate": "2019-02-09"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.471,
                                    "statDate": "2019-02-10"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.436,
                                    "statDate": "2019-02-11"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.52,
                                    "statDate": "2019-02-12"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.541,
                                    "statDate": "2019-02-13"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.541,
                                    "statDate": "2019-02-14"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.239,
                                    "statDate": "2019-02-15"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.028,
                                    "statDate": "2019-02-16"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.979,
                                    "statDate": "2019-02-17"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.113,
                                    "statDate": "2019-02-18"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.881,
                                    "statDate": "2019-02-19"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.944,
                                    "statDate": "2019-02-20"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.923,
                                    "statDate": "2019-02-21"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.67,
                                    "statDate": "2019-02-22"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.515,
                                    "statDate": "2019-02-23"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.262,
                                    "statDate": "2019-02-24"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.1,
                                    "statDate": "2019-02-25"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.325,
                                    "statDate": "2019-02-26"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.62,
                                    "statDate": "2019-02-27"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.543,
                                    "statDate": "2019-02-28"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 3.578,
                                    "statDate": "2019-03-01"
                                }, {
                                    "positionName": "广州",
                                    "postionType": "0",
                                    "reachCount": 0,
                                    "sendCount": 4.323,
                                    "statDate": "2019-03-02"
                                }], "terminalTend": []
                        }]
                    };*/
                    if (data && data.isSuccess && data.data && data.data.length == 1) {
                        var theDataArray = [];
                        // var theKeys = ["发送", "到达"];
                        var theDates1 = [];
                        var theDateMap1 = {};
                        var theDates2 = [];
                        var theDateMap2 = {};
                        var theResultObj = data.data[0];
                        var theTerminalTendForecast = theResultObj.terminalTendForecast || [];
                        var theTerminalTend = theResultObj.terminalTend || [];
                        //var theTotalData=(theTerminalTend||[]).concat(theTerminalTendForecast);

                        //debugger;
                        for (var i = 0; i < theTerminalTend.length; i++) {
                            var theItem = theTerminalTend[i];
                            var theDate = theItem.statDate;
                            if (!theDateMap1[theDate]) {
                                theDateMap1[theDate] = {};
                                theDates1.push(theDate);
                            }
                            var theNewItem = theDateMap1[theDate];
                            theNewItem['sendCount'] = theItem.sendCount;
                            theNewItem['reachCount'] = theItem.reachCount;
                        }

                        for (var i = 0; i < theTerminalTendForecast.length; i++) {
                            var theItem = theTerminalTendForecast[i];
                            var theDate = theItem.statDate;
                            if (!theDateMap2[theDate]) {
                                theDateMap2[theDate] = {};
                                theDates2.push(theDate);
                            }
                            var theNewItem = theDateMap2[theDate];
                            theNewItem['sendCount'] = theItem.sendCount;
                            theNewItem['reachCount'] = theItem.reachCount;

                        }

                        var theXData = [];
                        var theReuslt10 = [];
                        var theReuslt20 = [];

                        var theReuslt11 = [];
                        var theReuslt21 = [];

                        for (var j = 0; j < theDates1.length; j++) {
                            var theCurrentDate = theDates1[j];
                            var theMapItem = theDateMap1[theCurrentDate] || {};
                            theReuslt10.push((theMapItem.sendCount || 0));
                            theReuslt20.push((theMapItem.reachCount || 0));

                            theReuslt11.push(0);
                            theReuslt21.push(0);

                            //theReuslt11.push((theMapItem.sendCount || 0));
                            //theReuslt21.push((theMapItem.reachCount || 0));
                        }

                        for (var j = 0; j < theDates2.length; j++) {
                            var theCurrentDate = theDates2[j];
                            var theMapItem = theDateMap2[theCurrentDate] || {};
                            theReuslt11.push((theMapItem.sendCount || 0));
                            theReuslt21.push((theMapItem.reachCount || 0));
                        }


                        theDataArray.push([theReuslt10, theReuslt11]);
                        theDataArray.push([theReuslt20, theReuslt21]);
                        //debugger;
                        me.loadChart2(theXData, theDataArray);
                    }
                }
            );

        }
        /***
         *
         */
        /*PageViewModel.prototype.loadCurrent = function () {
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
                                theViewData['populationGd'] = formateNum1(theViewData.populationGd);
                            }
                            me.bind('.numpart', theViewData);
                        }
                        else {
                            console.log("loadCurrent错误:" + data);
                        }
                    });
                }*/

        window.PageView = new PageViewModel();
    }
)