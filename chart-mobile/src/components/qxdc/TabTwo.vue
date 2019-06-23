<template>
    <div class="tabtwo">
        <div class="row row1">
            <div>
                <div class="title">性别</div>
                <div class="canvas" ref="sex"></div>
            </div>
            <div>
                <div class="title">年龄</div>
                <div class="canvas" ref="age"></div>
            </div>
        </div>
        <div class="row row2">
            <div>
                <div class="title">爱好</div>
                <div class="canvas" ref="interest"></div>
            </div>
            <div>
                <div class="title">消费能力</div>
                <div class="canvas" ref="consumption"></div>
            </div>
        </div>
        <div class="row row3">
            <div>
                <div class="title">籍贯</div>
                <div class="canvas" ref="birthplace"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabTwo",
        props: ["queryRegionType", "queryRegionCode", "queryDirection", "queryDate"],
        data: function () {
            return {
                tabIndex: 1,
                items: [],
                lineDate: ''//近半个月，近一个月
            };
        },
        methods: {
            //画线段
            drawPie() {

            },
            drawBar() {

            },
            drawBigBar() {

            },
            initChart() {
                this.chart1 = window.echarts.init(this.$refs.sex);
                this.chart2 = window.echarts.init(this.$refs.age);
                this.chart3 = window.echarts.init(this.$refs.interest);
                this.chart4 = window.echarts.init(this.$refs.consumption);
                this.chart5 = window.echarts.init(this.$refs.birthplace);

                // 把配置和数据放这里


                var theOptions1 = {
                    // title : {
                    //     text: '某站点用户访问来源',
                    //     subtext: '纯属虚构',
                    //     x:'center'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                            name: '访问来源',
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
                            data: [
                                {value: 335, name: '直接访问'},
                                {value: 310, name: '邮件营销'},
                                {value: 234, name: '联盟广告'},
                                {value: 135, name: '视频广告'},
                                {value: 1548, name: '搜索引擎'}
                            ],

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
                var theOptions2 =  {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis : [
                        {
                            type : 'category',
                            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    xAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '60%',
                            data:[10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                var theOptions3 = {
                    // title: {
                    //     text: '某站点用户访问来源',
                    //     subtext: '纯属虚构',
                    //     x: 'center'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     left: 'left',
                    //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    // },
                    series: [
                        {
                            name: '访问来源',
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
                            data: [
                                {value: 335, name: '直接访问'},
                                {value: 310, name: '邮件营销'},
                                {value: 234, name: '联盟广告'},
                                {value: 135, name: '视频广告'},
                                {value: 1548, name: '搜索引擎'}
                            ],
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
                var theOptions4 =  {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis : [
                        {
                            type : 'category',
                            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    xAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '60%',
                            data:[10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                var theOptions5 =  {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '60%',
                            data:[10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };

                this.chart1.setOption(theOptions1);
                this.chart2.setOption(theOptions2);
                this.chart3.setOption(theOptions3);
                this.chart4.setOption(theOptions4);
                this.chart5.setOption(theOptions5);
            }
        },
        created: function () {
        },
        mounted: function () {
            this.items = [
                {id: '11', no: '11'}
            ];
            this.initChart();
            console.log("加载数据!");
        },
        watch: {
            queryDate: function (newValue, oldValue) {
                debugger;
                console.log("queryDate！", newValue, oldValue);
            },
            queryDirection: function (newValue, oldValue) {
                console.log("queryDirection！", newValue, oldValue);
            },
            queryRegionCode: function (newValue, oldValue) {
                console.log("queryRegionCode！", newValue, oldValue);
            },
            queryRegionType: function (newValue, oldValue) {
                console.log("queryRegionType！", newValue, oldValue);
            },
            lineDate: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);
            },
            tabIndex: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);
            }
        }
    }
</script>

<style scoped>
    .tabtwo {
        height: 100%;
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