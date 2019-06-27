<template>
    <div>
        <div class="row">

            <div>
                <div ref="chart1"></div>
            </div>
            <div>
                <div ref="chart2"></div>
            </div>
        </div>
        <div class="row">
            <div class="title"></div>
            <div ref="chart3"></div>
        </div>
        <div class="row">
            <div class="title"></div>
            <div ref="chart4"></div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "tabOne",
        props: ["queryRegionType", "queryRegionCode", "queryDirection", "queryDate"],
        data: function () {
            return {
                tabIndex: 1,
                items: [],
                lineDate: ''//近半个月，近一个月
            };
        },
        methods: {
            //爱好
            drawChart1(datas) {
                var theShowDatas = [];
                if (datas && datas.length > 0) {
                    var theItem = datas[0];
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theShowDatas.push({
                            value: theItem.ratio * 100,
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
            drawChart2(datas) {
                var theShowDatas = [];
                if (datas && datas.length > 0) {
                    var theItem = datas[0];
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theShowDatas.push({
                            value: theItem.ratio * 100,
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
            drawChart3(datas) {
                var theShowDatas = [];
                if (datas && datas.length > 0) {
                    var theItem = datas[0];
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theShowDatas.push({
                            value: theItem.ratio * 100,
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
            drawChart4(datas) {
                var theShowDatas = [];
                if (datas && datas.length > 0) {
                    var theItem = datas[0];
                    for (var i = 0; i < datas.length; i++) {
                        var theItem = datas[i];
                        theShowDatas.push({
                            value: theItem.ratio * 100,
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


            //人口分析 工作/居住人口  两个图表
            loadPopulation() {
                var theUrl1 = "/citytransport/population";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    dateTime: this.queryDate.formateYearMonth(),
                    city: this.queryRegionCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        // me.drawAgeChar(theData.data);
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
                    city: this.queryRegionCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        // me.drawAgeChar(theData.data);
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

            //4. 人口类型分析 常驻/流动人口
            loadPopulationtype() {
                var theUrl1 = "/citytransport/populationtype";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    dateTime: this.queryDate.formateYearMonth(),
                    city: this.queryRegionCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        // me.drawAgeChar(theData.data);
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
                this.chart1 = window.echarts.init(this.$refs.chart1);
                this.chart2 = window.echarts.init(this.$refs.chart2);
                this.chart3 = window.echarts.init(this.$refs.chart3);
                this.chart4 = window.echarts.init(this.$refs.chart4);
            },

            loadData() {
                this.loadMigrateAge();
                this.loadMigrateSex();
                this.loadMigrateNativePlace();
                this.loadMigrateHobby();
                this.loadMigrateconsume();

            }
        },
        created: function () {
        },
        mounted: function () {
            this.items = [
                {id: '11', no: '11'}
            ];
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
            }
        }
    }
</script>

<style scoped>

</style>