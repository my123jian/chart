<template>
    <div class="tabtwo">
        <div class="row row1">
            <div class="chart-item">
                <div class="chart-title">
                    <div class="content-icon">
                        <div class="content sex">
                            性别
                        </div>
                    </div>
                </div>
                <div class="canvas" ref="sex"></div>
            </div>
            <div class="chart-item">
                <div class="chart-title">
                    <div class="content-icon">
                        <div class="content age">
                            年龄
                        </div>
                    </div>
                </div>
                <div class="canvas" ref="age"></div>
            </div>
        </div>
        <div class="row row2">
            <div class="chart-item">
                <div class="chart-title">
                    <div class="content-icon">
                        <div class="content hobby">
                            爱好
                        </div>
                    </div>
                </div>
                <div class="canvas" ref="interest"></div>
            </div>
            <div class="chart-item">
                <div class="chart-title">
                    <div class="content-icon">
                        <div class="content consume">
                            消费能力
                        </div>
                    </div>
                </div>
                <div class="canvas" ref="consumption"></div>
            </div>
        </div>
        <div class="row row3">
            <div class="chart-item">
                <div class="chart-title">
                    <div class="content-icon">
                        <div class="content birth">
                            籍贯
                        </div>
                    </div>
                </div>
                <div class="canvas" ref="birthplace"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "TabTwo",
        props: ["queryRegionType", "queryRegionCode", "queryDirection", "queryDate", "sumType"],
        data: function () {
            return {
                tabIndex: 1,
                items: [],
                lineDate: ''//近半个月，近一个月
            };
        },
        methods: {
            //性别饼图
            drawSexChar(datas) {
                // {value: 335, name: '直接访问'},
                var theShowDatas = [];
                if (datas && datas.length > 0) {
                    var theItem = datas[0];
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theShowDatas.push({
                            value: theItem.ratio ,
                            name: theSexType[theItem.sex]// == 1 ? "男" : "女"
                        });
                    }
                }
                var theOptions1 = {
                    // title : {
                    //     text: '某站点用户访问来源',
                    //     subtext: '纯属虚构',
                    //     x:'center'
                    // },
                    color:['#63efe0','#67f782','#faff64','#64ceff','#ff5555', '#ff8155', '#ffc955', '#cafd4f', '#4ffd5f', '#4ffdca', '#4fe2fd', '#4f99fd', '#3b4dff', '#644cdb'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} :  ({d}%)"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },

                    // legend: {
                    //     orient: 'vertical',
                    //     left: 'left',
                    //     data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    // },
                    series: [
                        {
                            name: '性别',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            labelLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: theShowDatas,

                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },

                            }
                        }
                    ]
                };
                this.chart1.setOption(theOptions1);
            },
            //爱好
            drawInstertChar(datas) {
                var theShowDatas = [];
                if (datas && datas.length > 0) {
                    var theItem = datas[0];
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theShowDatas.push({
                            value: theItem.ratio ,
                            name: theItem.hobby
                        });
                    }
                }
                var theOptions3 = {
                    // title: {
                    //     text: '某站点用户访问来源',
                    //     subtext: '纯属虚构',
                    //     x: 'center'
                    // },
                    color:['#63efe0','#67f782','#faff64','#64ceff','#ff5555', '#ff8155', '#ffc955', '#cafd4f', '#4ffd5f', '#4ffdca', '#4fe2fd', '#4f99fd', '#3b4dff', '#644cdb'],
                    tooltip: {
                        trigger: 'item',
                        // formatter: "{a} <br/>{b} : {c} ({d}%)"
                        formatter: "{a} <br/>{b} :  ({d}%)"
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     left: 'left',
                    //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    // },
                    series: [
                        {
                            name: '爱好',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            labelLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: theShowDatas,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                this.chart3.setOption(theOptions3);
            },
            //年龄
            drawAgeChar(datas) {
                var theShowDatas = [];
                /**
                 * {{id: null, month: "2019-05", workCity: "广州", workType: 0, ageGroup: 1, num: 18000}
                 * */
                var theX = [];
                var theY = [];
                if (datas) {
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theY.push(theItem.num);
                        theX.push(theAgeGroups[theItem.ageGroup]);
                    }
                }
                var theOptions2 = {
                    color: ['#63efe0'],
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
                    yAxis: [
                        {
                            type: 'category',
                            data: theX,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisLine: {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                            axisTick: {
                                alignWithLabel: false
                            }
                        }
                    ],
                    xAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                show:false,
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                            axisTick: {show: false},
                            splitLine: {
                                show: false
                            }
                           ,
                        }
                    ],
                    series: [
                        {
                            name: '年龄',
                            type: 'bar',
                            barMaxWidth: 30,
                            data: theY,//[10, 52, 200, 334, 390, 330, 220]
                            itemStyle:{
                                normal:{
                                    barBorderRadius: 10
                                }
                            }
                        }
                    ]
                };
                this.chart2.setOption(theOptions2);
            },
            //消费
            drawConsumChar(datas) {
                var theShowDatas = [];
                /**
                 *{id: null, month: "2019-05", workCity: "广州", workType: 0, consume: 0, num: 23000}
                 * */
                var theX = [];
                var theY = [];
                if (datas) {
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theY.push(theItem.num);
                        theX.push(theConsumDegree[theItem.consume]);
                    }
                }
                var theOptions4 = {
                    color: ['#63efe0'],
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
                    yAxis: [
                        {
                            type: 'category',
                            data: theX,// ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisLine: {
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    xAxis: [
                        {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            axisTick: {show: false},
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: 'white'//'#557398'
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '消费能力',
                            type: 'bar',
                            barMaxWidth: 30,
                            data: theY,// [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                this.chart4.setOption(theOptions4);
            },
            //籍贯
            drawLocaionChar(datas) {
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
                if (datas) {
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theY.push(theItem.num);
                        theX.push(theItem.nativePlace);
                    }
                }
                var theOptions5 = {
                    color: ['#faff64'],
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
                            barMaxWidth: 30,
                            data: theY,// [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                this.chart5.setOption(theOptions5);
            },

            //  4--获取跨市通勤人群画像（性别、年龄、爱好、籍贯、消费能力）
            loadCommutingPortrait() {
                //迁徙人群画像分析-年龄
                var theUrl1 = "/cityCommuting/getCommutingPortrait";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    month: this.queryDate.formateYearMonth(),
                    type: this.sumType == 1 ? 0 : 1,
                    city: this.queryRegionCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        me.drawAgeChar(theData.data.commutingAge);
                        me.drawSexChar(theData.data.commutingSex);
                        me.drawLocaionChar(theData.data.commutingNativePlace);
                        me.drawInstertChar(theData.data.commutingHobby);
                        me.drawConsumChar(theData.data.commutingConsume);

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
            initChart() {
                this.chart1 = window.echarts.init(this.$refs.sex);
                this.chart2 = window.echarts.init(this.$refs.age);
                this.chart3 = window.echarts.init(this.$refs.interest);
                this.chart4 = window.echarts.init(this.$refs.consumption);
                this.chart5 = window.echarts.init(this.$refs.birthplace);
            },

            loadData() {
                this.loadCommutingPortrait();

            }
        },
        created: function () {
        },
        mounted: function () {
            this.items = [];
            this.initChart();
            this.loadData();
            console.log("加载数据!");
        },
        watch: {
            queryDate: function (newValue, oldValue) {
                this.loadData();
                // console.log("queryDate！", newValue, oldValue);
            },
            queryDirection: function (newValue, oldValue) {
                this.loadData();
                //console.log("queryDirection！", newValue, oldValue);
            },
            queryRegionCode: function (newValue, oldValue) {
                this.loadData();
                //console.log("queryRegionCode！", newValue, oldValue);
            },
            queryRegionType: function (newValue, oldValue) {
                this.loadData();
                // console.log("queryRegionType！", newValue, oldValue);
            },
            sumType(newValue,oldValue){
                if(newValue!=oldValue){
                    this.loadData();
                }
            }
        }
    }
</script>

<style scoped>
    .tabtwo {
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }

    .chart-item {
        position: relative;
    }

    .chart-item .chart-title {
        position: absolute;
        left: 16px;
        top: 19px;
    }

    .title {
        position: absolute;
        left: 0px;
        top: 0px;
    }

    .row {
        height: 33.33%;
        width: 100%;
    }

    .row > div {
        height: 100%;
        margin: 0px;
        padding: 0px;
        display: inline-block;
        position: relative;
    }

    .canvas {
        position: relative;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        background: transparent;
    }

    .row1 > div, .row2 > div {
        width: 50%;
    }

    .row3 > div {
        width: 100%;
    }
</style>