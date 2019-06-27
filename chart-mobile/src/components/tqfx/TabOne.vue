<template>
    <div class="chart-group">
        <div class="chart-item">
            <div class="title chart-title">
                <span class="content-icon">
                    <span class="content">
平均单程通勤距离
                    </span>
                </span>
            </div>
            <div ref="chart1" class="chart"></div>
        </div>
        <div class="chart-item">
            <div class="title chart-title">
                <span class="content-icon">
                    <span class="content">
平均单程通勤时间
                    </span>
                </span></div>
            <div ref="chart2" class="chart"></div>
        </div>
        <div class="chart-item">
            <div class="title chart-title">  <span class="content-icon">
                    <span class="content">
通勤时点分布
                    </span>
                </span></div>
            <div ref="chart3" class="chart"></div>
        </div>
    </div>
</template>

<script>
    import DataConvert from '../../utils/DataConvert'
    import axios from "axios";

    export default {
        name: "TabOne",
        props: ["queryRegionCode", "queryDate"],
        data() {
            return {};
        },
        mounted() {
            this.initChart();
            this.loadData();
        },
        methods: {
            initChart() {
                this.chart1 = window.echarts.init(this.$refs.chart1);
                this.chart2 = window.echarts.init(this.$refs.chart2);
                this.chart3 = window.echarts.init(this.$refs.chart3);
            },
            drawChart1(datas) {
                var theResult = DataConvert.convertData(datas, 'distance', 'num',theTqDistinceType);
                var theOptions = {
                    color: ['#3398DB'],
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
                            data: theResult.x,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            // name: '籍贯',
                            type: 'bar',
                            barWidth: '60%',
                            data: theResult.y,// [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                this.chart1.setOption(theOptions);
            },
            drawChart2(datas) {
                var theResult = DataConvert.convertData(datas, 'timeDuration', 'num',theTqTimeType);
                var theOptions = {
                    color: ['#3398DB'],
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
                            data: theResult.x,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            // name: '籍贯',
                            type: 'bar',
                            barWidth: '60%',
                            data: theResult.y,// [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                this.chart2.setOption(theOptions);
            },
            drawChart3(datas) {
                var theResult = DataConvert.convertData(datas, 'timePoint', 'num',theTqPlace);
                var theOptions = {
                    color: ['#3398DB'],
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
                            data: theResult.x,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            // name: '籍贯',
                            type: 'bar',
                            barWidth: '60%',
                            data: theResult.y,// [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                this.chart3.setOption(theOptions);
            },
            //2.平均通勤距离
            loadTripDistance() {
                var theUrl1 = "/citytransport/tripDistance";
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    dateTime: this.queryDate.formateYearMonth(),
                    city: this.queryRegionCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        // debugger;
                        var theData = response.data;
                        me.drawChart1(theData.data);
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
            //3.平均通勤时长
            loadTripDuration() {
                //今日热门迁徙路线
                var theUrl1 = "/citytransport/tripDuration";
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
                        // debugger;
                        var theData = response.data;
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
            //4.平均出行时点
            loadTripTime() {
                //今日热门迁徙路线
                var theUrl1 = "/citytransport/tripTime";
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
                        // debugger;
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
            loadData() {
                this.loadTripDistance();
                this.loadTripDuration();
                this.loadTripTime();
            }
        },
        watch: {
            queryRegionCode(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
            },
            queryDate(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
            }
        }
    }
</script>

<style scoped>
    .chart-group {
        width: 100%;
        height: 100%;
    }

    .chart-item {
        height: 33.33%;
        /*width: 100%;*/
        padding-top: 18px;
        padding-left: 26px;
        pointer-events: visible;
        position: relative;
    }
    .chart{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
    }
</style>