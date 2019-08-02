<template>
    <div class="chart-view chart-group">
        <div class="chart-item">
            <div class="title chart-title">
                <span class="content-icon">
                    <span class="content">
通勤成本排行
                    </span>
                </span>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th>
                        排名
                    </th>
                    <th>
                        通勤路线
                    </th>
                    <th>
                        通勤人数
                    </th>
                    <th>
                        单程平均通行时间(min)
                    </th>
                    <th>
                        单程平均通行距离(km)
                    </th>


                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items" :key="item.id">
                    <th>{{item.order}}</th>
                    <th>{{item.line}}</th>
                    <th>{{item.num}}</th>
                    <th>{{item.avgTime}}</th>
                    <th>{{item.avgDistance}}
                        <div class="table-btn" @click="notifyChange(item)">画像分析</div>
                    </th>

                </tr>
                </tbody>
            </table>
        </div>

        <div title="平均通勤距离" class="part-item part-item2">
            <table>
                <tr>
                    <td>
                        <div class="title onecloumn">
                            平均通勤距离
                        </div>
                    </td>
                    <td style="width: 100%">
                        <div class="content chart" ref="chart1">

                        </div>
                    </td>
                </tr>
            </table>


        </div>
    </div>

</template>

<script>
    import DataConvert from '../../utils/DataConvert'
    import axios from "axios";

    export default {
        name: "TabTwo",
        props: ["queryRegionCode", "queryDate", "queryAreaCode"],
        data() {
            return {items: []};
        },
        mounted() {
            this.initChart();
            this.loadData();
        },
        methods: {
            initChart() {
                this.chart1 = window.echarts.init(this.$refs.chart1);
            },
            //平均通勤距离
            drawLine(datas) {
                /***
                 * area: "天河"
                 city: "广州"
                 dateTime: "2019-06"
                 distance: 500000
                 id: 10
                 liveDistance: 1000000
                 wordDistance: 200000
                 * */
                var theLiveLine = DataConvert.convertData(datas, "area", "1000000");
                var theWorkLine = DataConvert.convertData(datas, "area", "wordDistance");
                var theDistanceLine = DataConvert.convertData(datas, "area", "distance");
                var option = {
                    // title: {
                    //     text: '未来一周气温变化',
                    //     subtext: '纯属虚构'
                    // },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        x: 'right',
                        data: [{name: '工作', textStyle: {color: "#6bff75", fontSize: 16}},
                            {name: '居住', textStyle: {color: "#fff36b", fontSize: 16}}]
                    },
                    // toolbox: {
                    //     show: true,
                    //     feature: {
                    //         dataZoom: {
                    //             yAxisIndex: 'none'
                    //         },
                    //         dataView: {readOnly: false},
                    //         magicType: {type: ['line', 'bar']},
                    //         restore: {},
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
                        data: theLiveLine.x//['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
                        axisLabel: {
                            formatter: '{value} km'
                        }
                    },
                    series: [
                        {
                            name: '工作',
                            type: 'line',
                            color: '#6bff75',
                            smooth: true,
                            data: theWorkLine.y,//[11, 11, 15, 13, 12, 13, 10],
                            // markPoint: {
                            //     data: [
                            //         {type: 'max', name: '最大值'},
                            //         {type: 'min', name: '最小值'}
                            //     ]
                            // },
                            // markLine: {
                            //     data: [
                            //         {type: 'average', name: '平均值'}
                            //     ]
                            // }
                        },
                        {
                            name: '居住',
                            type: 'line',
                            color: '#fff36b',
                            smooth: true,
                            data: theWorkLine.y,//[1, -2, 2, 5, 3, 2, 0],
                            // markPoint: {
                            //     data: [
                            //         {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                            //     ]
                            // },
                            // markLine: {
                            //     data: [
                            //         {type: 'average', name: '平均值'},
                            //         [{
                            //             symbol: 'none',
                            //             x: '90%',
                            //             yAxis: 'max'
                            //         }, {
                            //             symbol: 'circle',
                            //             label: {
                            //                 normal: {
                            //                     position: 'start',
                            //                     formatter: '最大值'
                            //                 }
                            //             },
                            //             type: 'max',
                            //             name: '最高点'
                            //         }]
                            //     ]
                            // }
                        },
                        {
                            name: '平均值',
                            type: 'line',
                            data: theDistanceLine.y,//[1, -2, 2, 5, 3, 2, 0],
                            // markPoint: {
                            //     data: [
                            //         {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                            //     ]
                            // },
                            // markLine: {
                            //     data: [
                            //         {type: 'average', name: '平均值'},
                            //         [{
                            //             symbol: 'none',
                            //             x: '90%',
                            //             yAxis: 'max'
                            //         }, {
                            //             symbol: 'circle',
                            //             label: {
                            //                 normal: {
                            //                     position: 'start',
                            //                     formatter: '最大值'
                            //                 }
                            //             },
                            //             type: 'max',
                            //             name: '最高点'
                            //         }]
                            //     ]
                            // }
                        }
                    ]
                };
                this.chart1.setOption(option);
            },
            loadData() {
                this.loadTripAnalysis();
                this.loadTripDetail();
            },

            //5.通勤排行详情
            loadTripDetail() {
                var theUrl1 = "/citytransport/tripDetail";
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
                        // debugger;
                        var theData = response.data;
                        /**
                         * avgDistance: 400000
                         avgTime: 50
                         city: "广州"
                         dateTime: "2019-06"
                         endArea: "番禺"
                         id: 10
                         num: 1000000
                         startArea: "天河
                         * */
                        var theResult = [];
                        for (var i = 0; i < theData.data.length; i++) {
                            var theItem = theData.data[i];
                            theItem.order = i + 1;
                            theItem.line = theItem.startArea + "->" + theItem.endArea;
                            theResult.push(theItem);
                        }
                        me.items = theResult;
                        // debugger;
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
            //6.通勤平均距离对比
            loadTripAnalysis() {
                var theUrl1 = "/citytransport/tripAnalysis";
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
                        // debugger;
                        var theData = response.data;
                        /***
                         * area: "天河"
                         city: "广州"
                         dateTime: "2019-06"
                         distance: 500000
                         id: 10
                         liveDistance: 1000000
                         wordDistance: 200000
                         * */
                        me.drawLine(theData.data);
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
            notifyChange(item) {
                this.$emit('select', item);
            }
        },
        watch: {
            queryAreaCode(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
            },
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
    .table-btn {
        background-image: url("../../assets/hxfx_bg.png");
        height: 22px;
        width: 88px;
        line-height: 22px;
        cursor: pointer;
        color: #001532;
        font-size: 14px;
        display: inline-block;
    }

    .table {
        position: absolute;
        top: 60px;
        left: 16px;
        right: 16px;
        bottom: 10px;
        width: 650px;
    }

    .chart-title {
        position: absolute;
        left: 26px;
        top: 18px;
    }

    .chart-view {
        position: relative;
    }

    .part-item > * {
        display: inline-block;
        position: relative;
    }

    /*.part-item .content {*/
        /*width: 578px;*/
        /*vertical-align: top;*/
    /*}*/

    .part-item1 {
        bottom: 230px;
        left: 0px;
        top: 0px;
        right: 0px;
        position: absolute;
    }

    .part-item2 {
        height: 330px;
        bottom: 0px;
        left: 0px;
        top: 510px;
        position: absolute;
    }

    .chart {
        height: 330px;
        width: 100%;/*578px;*/
        left: 0px;
        top: 0px;
    }
</style>