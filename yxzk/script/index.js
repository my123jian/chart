$(function () {
    var theChar1Id = "chart1";
    var theChar2Id = "chart2";

    //当前选择的时间
    var theCurrentDate = null;

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
            var theDate = GetYesterdayDate();
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
    }
    PageViewModel.prototype.updateDate = function () {
        $('.date').val(formateDate1());
    }
    PageViewModel.prototype.initEvent = function () {
        //this.updateDate();
        laydate.render({
            elem: '#date1', //指定元素
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
        laydate.render({
            elem: '#date2', //指定元素
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
        laydate.render({
            elem: '#date3', //指定元素
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
    }


    PageViewModel.prototype.loadChart1 = function (theXData, dataArray) {
        if (!this.Chart1) {
            this.Chart1 = echarts.init(document.getElementById('chart1'));
        }

        var theItemConfig=[{name: '发送总量', textStyle: {color: "#cfccfc"}},
            {name: '公路发送', textStyle: {color: "#ffdc6f"}},
            {name: '铁路发送', textStyle: {color: "#32ff4a"}
            },
            {name: '水路发送', textStyle: {color: "#328eff"}}
            , {name: '民航发送', textStyle: {color: "#e407e7"}}];
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
                        show: true
                    }
                },
                backgroundColor: 'transparent',
                formatter: function (params) {
                    var theIndex = 0;
                    var theDatas = [];
                    //var theText = "";
                    if (params.length > 4) {
                        for (var i = 0; i < params.length; i = i + 2) {
                            theDatas.push(params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    else {
                        for (var i = 0; i < params.length; i = i + 1) {
                            theDatas.push(params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    /* while (theIndex < params.length - 1) {

                         theText += params[theIndex].data + "<br />";
                         theIndex += 2;
                     }*/
                    return theDatas.join('<br />');
                }
            },

            legend: {
                textStyle: {
                    color: '#557398',
                },
                data: theItemConfig
            },

            grid: {
                left: 30,
                right: 30,
                top: 30,
                bottom: 10,
                width: 1740,
                height: 210,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                name: '(日期)',
                axisLine: {
                    lineStyle: {
                        color: '#557398'
                    }
                },
                axisPointer: {
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
                        color: '#557398'
                    }
                }
            },
            series: [ ]
        };
        var series=[];
        var getSeries=function (name,color,data) {
            var theSeries={
                name: name,
                type: 'line',
                smooth: true,
                showSymbol: false,
                tooltip: {
                    position: 'left',
                },
                data: data.map(function (item) {
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
                        color: color
                    }
                }
            };
            return theSeries;
        }
        for(var i=0;i<theItemConfig.length;i++){
            var theItem=theItemConfig[i];
            series.push(getSeries(theItem.name,theItem.textStyle.color,[]));
        }
        option.series=series;
        this.Chart1.setOption(option);
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
        var theItemConfig= [
            {name: '总旅客', textStyle: {color: "#cfccfc"}},
            {name: '发送',  textStyle: {color: "#ffdc6f"}},
            {name: '到达',  textStyle: {color: "#32ff4a"}}];
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
            color:['#cfccfc','#ffdc6f','#32ff4a'],
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
                    var theIndex = 0;
                    var theDatas = [];
                    //var theText = "";
                    if (params.length > 4) {
                        for (var i = 0; i < params.length; i = i + 2) {
                            theDatas.push(params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    else {
                        for (var i = 0; i < params.length; i = i + 1) {
                            theDatas.push(params[i].seriesName + ':' + (params[i].data || params[i + 1].data) + '万');
                        }
                    }
                    /* while (theIndex < params.length - 1) {

                         theText += params[theIndex].data + "<br />";
                         theIndex += 2;
                     }*/
                    return theDatas.join('<br />');
                }
            },

            legend: {
                show:true,
                textStyle: {
                    color: '#557398',
                },
                data: theItemConfig
            },
            grid: {
                left: 30,
                right: 30,
                top: 30,
                bottom: 10,
                width: 1740,
                height: 210,
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
                axisPointer: {
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
                        color: '#557398'
                    }
                }
            },
            series: [

            ]
        };
        var series=[];
        var getSeries=function (name,color,data) {
            var theSeries={
                name: name,
                type: 'line',
                smooth: true,
                showSymbol: false,
                tooltip: {
                    position: 'left',
                },
                data: data.map(function (item) {
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
                        color: color
                    }
                }
            };
            return theSeries;
        }
        for(var i=0;i<theItemConfig.length;i++){
            var theItem=theItemConfig[i];
            series.push(getSeries(theItem.name,theItem.textStyle.color,[]));
        }
        option.series=series;

        this.Chart2.setOption(option);
    }
        PageViewModel.prototype.initCharts = function () {
            this.loadChart1()
            this.loadChart2()

        }

        PageViewModel.prototype.loadData = function () {
            //debugger;

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