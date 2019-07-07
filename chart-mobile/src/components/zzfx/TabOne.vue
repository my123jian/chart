<template>
    <div class="chart-group">
        <div class="row chart-item div-chart">
            <div class="work-chart">
                <div>
                    <div class="work-chart-title">工作人口数</div>
                    <div class="num-value">{{workCount}}</div>
                </div>

            </div>
            <div class="live-chart">
                <div>
                    <div class="live-chart-title">居住人口数</div>
                    <div class="num-value">{{liveCount}}</div>
                </div>
            </div>
            <div class="local-chart">
                <div>
                    <div class="local-chart-title"> 常驻人口数</div>
                    <div class="num-value">{{residentCount}}</div>
                </div>

            </div>
        </div>
        <div class="sub-chart-group">
            <div class="row chart-item">
                <div class="chart-title">
                <span class="content-icon">
                    <span  class="content work">工作区域分布</span>
                </span>
                </div>

                <div class="canvas" ref="chart1"></div>
            </div>
            <div class="row chart-item">
                <div class="chart-title">
                <span class="content-icon">
                    <span class="content live">居住区域分布</span>
                </span>
                </div>

                <div class="canvas" ref="chart2"></div>
            </div>
            <div class="row chart-item">
                <div class="chart-title">
                <span class="content-icon">
                    <span  class="content thread">职住人口趋势</span>
                </span>
                </div>

                <div class="canvas" ref="chart3"></div>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "tabOne",
        props: ["queryRegionType", "queryRegionCode", "queryDirection", "queryDate", "queryAreaCode"],
        data: function () {
            return {
                tabIndex: 1,
                items: [],
                lineDate: '',//近半个月，近一个月
                liveCount: "",
                residentCount: "",
                workCount: ""
            };
        },
        methods: {
            //爱好
            drawChart1(datas) {
                var theShowDatas = [];
                /**
                 *city: "广州"
                 dateTime: "2019-06-21"
                 id: 10
                 migSource: 1
                 migType: 1
                 nativePlace: "湖南长沙"
                 num: 10000
                 * */
                var theX = [];
                var theY = [];
                var theDatas = datas.populationData;
                // debugger;
                if (theDatas) {
                    for (var i = 0; i < theDatas.length; i++) {
                        var theItem = theDatas[i];
                        theY.push(theItem.workNum);
                        theX.push(theItem.area);
                    }
                }
                var theOptions = {
                    color: ['#33eace'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: theX,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisLine: {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '籍贯',
                            type: 'bar',
                            barWidth: 30,
                            data: theY,// [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                this.chart1.setOption(theOptions);
            },
            drawChart2(datas) {
                var theShowDatas = [];
                /**
                 *city: "广州"
                 dateTime: "2019-06-21"
                 id: 10
                 migSource: 1
                 migType: 1
                 nativePlace: "湖南长沙"
                 num: 10000
                 * */
                var theX = [];
                var theY = [];
                var theDatas = datas.populationData;
                if (theDatas) {
                    for (var i = 0; i < theDatas.length; i++) {
                        var theItem = theDatas[i];
                        theY.push(theItem.liveNum);
                        theX.push(theItem.area);
                    }
                }
                var theOptions = {
                    color: ['#33a7ea'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: theX,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisLine: {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '籍贯',
                            type: 'bar',
                            barWidth: 30,
                            data: theY,// [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                this.chart2.setOption(theOptions);
            },
            drawChart3(datas) {
                /**
                 * dateTime: "2019-06-20"
                 endArea: "长沙"
                 id: 14
                 migSource: 1
                 migType: 1
                 num: 10000
                 startArea: "广州"*/
                var theX = [];
                var theY1 = [];
                var theY2 = [];
                if (datas) {
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theY1.push(theItem.liveNum);
                        theY2.push(theItem.workNum);
                        theX.push(theItem.area);
                    }
                }
                var theOptions = {
                    // title: {
                    //     text: '折线图堆叠'
                    // },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        x: 'right',
                        data: [{name: '工作人口', textStyle: {color: "#6bff75", fontSize: 16}},
                            {name: '居住人口', textStyle: {color: "#fff36b", fontSize: 16}}]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    color: ['#479fc1'],
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: 'white'//'#557398'
                            }
                        },
                        data: theX,// ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'white'//'#557398'
                            }
                        },
                    },
                    series: [
                        {
                            name: '工作人口',
                            type: 'line',
                            stack: '总量',
                            color: '#6bff75',
                            smooth: true,
                            data: theY1,// [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '居住人口',
                            type: 'line',
                            stack: '总量',
                            color: '#fff36b',
                            smooth: true,
                            data: theY2,// [120, 132, 101, 134, 90, 230, 210]
                        }
                    ]
                };
                this.chart3.setOption(theOptions);
            },


            //2.人口分析
            loadAnalyPopulation() {
                var theUrl1 = "/citytransport/analyPopulation";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    dateTime: this.queryDate.formateYearMonth(),
                    city: this.queryRegionCode,
                    area: this.queryAreaCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;

                        me.liveCount = (theData.data.liveCount || 0).toLocaleString('en-US');
                        me.residentCount = (theData.data.residentCount || 0).toLocaleString('en-US');
                        me.workCount = (theData.data.workCount || 0).toLocaleString('en-US');

                        me.drawChart1(theData.data);
                        me.drawChart2(theData.data);
                        console.log(response, theData);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed
                    });
            },
            //3. 职住人口分析
            loadPopulationHistory() {
                var theUrl1 = "/citytransport/populationHistory";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    dateTime: this.queryDate.formateYearMonth(),
                    city: this.queryRegionCode,
                    area: this.queryAreaCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        me.drawChart3(theData.data);
                        console.log(response, theData);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed
                    });
            },

            //1. 职住地热力分布
            // loadSpace() {
            //     var theUrl1 = "/citytransport/space";
            //     //近期热门迁徙路线
            //     var theUrl = window.baseUrl + theUrl1;
            //     var theQueryObj = {
            //         dateTime: this.queryDate.formateYearMonth(),
            //         city: this.queryRegionCode,
            //         area: this.queryAreaCode
            //     };
            //     var me = this;
            //     axios.post(theUrl, window.toQuery(theQueryObj))
            //         .then(function (response) {
            //             // handle success
            //             var theData = response.data;
            //             me.drawChart4(theData.data);
            //             console.log(response, theData);
            //         })
            //         .catch(function (error) {
            //             // handle error
            //             console.log(error);
            //         })
            //         .finally(function () {
            //             // always executed
            //         });
            // },

            initChart() {
                this.chart1 = window.echarts.init(this.$refs.chart1);
                this.chart2 = window.echarts.init(this.$refs.chart2);
                this.chart3 = window.echarts.init(this.$refs.chart3);
            },

            loadData() {
                this.loadAnalyPopulation();
                this.loadPopulationHistory();
                // this.loadSpace();

            }
        },
        created: function () {
        },
        mounted: function () {
            this.items = [];
            this.initChart();
            this.loadData();
            // debugger;
            console.log("加载数据!");
        },
        watch: {
            queryDate: function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
                // console.log("queryDate！", newValue, oldValue);
            },
            queryDirection: function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
                //console.log("queryDirection！", newValue, oldValue);
            },
            queryAreaCode: function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
                //console.log("queryRegionCode！", newValue, oldValue);
            },
            queryRegionCode: function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
                //console.log("queryRegionCode！", newValue, oldValue);
            },
            queryRegionType: function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
                // console.log("queryRegionType！", newValue, oldValue);
            }
        }
    }
</script>

<style scoped>
    .div-chart {
        width: 100%;
        text-align: center;
        padding-top: 12px;
    }

    .work-chart {
        background-image: url("../../assets/工作人口数背景框.png");
        width: 200px;
        height: 75px;
        margin-right: 18px;
    }

    .live-chart {
        background-image: url("../../assets/居住人口数背景框.png");
        width: 200px;
        height: 75px;
        margin-right: 18px;
    }

    .local-chart {
        background-image: url("../../assets/常驻人口数背景框.png");
        width: 200px;
        height: 75px;
    }

    .work-chart-title {
        background-image: url("../../assets/工作人口icon.png");
        background-repeat: no-repeat;
        background-position: left center;
        font-size: 18px;
        margin-top: 4px;
        padding-left: 31px;
        display: inline-block;
        color: #2cecea;
    }

    .live-chart-title {
        background-image: url("../../assets/常驻人口icon.png");
        background-repeat: no-repeat;
        background-position: left center;
        font-size: 18px;
        margin-top: 4px;
        padding-left: 31px;
        display: inline-block;
        color: #27ee53;
    }

    .local-chart-title {
        background-image: url("../../assets/居住人口icon.png");
        background-repeat: no-repeat;
        background-position: left center;
        font-size: 18px;
        margin-top: 4px;
        padding-left: 31px;
        color: #c3ab42;
        display: inline-block;
    }

    .div-chart > div {
        /*width: 33.33%;*/
        display: inline-block;
        text-align: center;
    }

    .num-value {
        color: white;
        font-size: 20px;
        font-weight: bold;
        margin-top: 13px;
    }

    .chart-group {
        width: 100%;
        height: 100%;
    }

    .sub-chart-group {
        position: absolute;
        top: 85px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }

    .sub-chart-group > .chart-item {
        height: 33.33%;
        /*width: 100%;*/
        /*padding-top: 18px;*/
        /*padding-left: 26px;*/
        pointer-events: visible;
        position: relative;
    }

    .chart-title {
        left: 26px;
        top: 18px;
        position: absolute;
    }

    .canvas {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    }
</style>