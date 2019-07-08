<template>
    <div>
        <div class="row row1 chart-item">
            <div class="chart-title">
                <span class="content-icon">
                    <span class="content thread">趋势分析</span>
                </span>
            </div>
            <div class="canvas" ref="linechart"></div>
        </div>
        <div class="row row2 chart-item">
            <div class="chart-title">
                <span class="content-icon">
                    <span class="content">通勤路线</span>
                </span>
            </div>
            <table class="table table-view">
                <thead>
                <tr>
                    <th>排名</th>
                    <th>居住城市</th>
                    <th>工作城市</th>
                    <th>人数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items" :key="item.id">
                    <td>
                        {{item.order}}
                    </td>
                    <td>
                        {{item.startArea}}
                    </td>
                    <td>
                        {{item.endArea}}
                    </td>
                    <td>
                        {{item.value}}
                    </td>

                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "TabOne",
        props: ["queryRegionType", "queryRegionCode", "queryDirection", "queryDate", "sumType"],
        data: function () {
            return {
                tabIndex: 1,
                items: [],
                lineDate: 1//近半个月，近一个月
            };
        },

        methods: {
            //画线段
            initChart() {
                this.chart1 = window.echarts.init(this.$refs.linechart);

            },
            notifyParent(data) {
                this.$emit('dataChange', data);
            },
            drawLine(data) {
                /**
                 *  {id: null, city: "广州市", month: "2019-05", workType: 0, num: 430000}*/
                var theX = [];
                var theY = [];
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        var theItem = data[i];
                        theX.push(theItem.month);
                        theY.push(theItem.num);
                    }
                }
                var theOptions1 = {
                    // title: {
                    //     text: '折线图堆叠'
                    // },
                    tooltip: {
                        trigger: 'axis'
                    },
                    // legend: {
                    //     data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                    // },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    color:['#479fc1'],
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
                        axisTick: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: 'white'//'#557398'
                            }
                        },
                    },
                    series: [
                        {
                            name: '趋势分析',
                            type: 'line',
                            stack: '总量',
                            smooth: true,
                            data: theY,// [120, 132, 101, 134, 90, 230, 210]
                        }
                    ]
                };
                this.chart1.setOption(theOptions1);
            },
            //2--获取跨市通勤趋势分析（type：0按日跨市，1按周跨市）
            loadCommutingTrend() {
                //2--获取跨市通勤趋势分析（type：0按日跨市，1按周跨市）
                var theUrl =window.baseUrl+ "/cityCommuting/getCommutingTrend";

                var theQueryObj = {
                    month: this.queryDate.formateYearMonth(),
                    type: this.sumType == 1 ? 0 : 1,
                    city: this.queryRegionCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        // debugger;
                        var theData = response.data;
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
            //3--获取跨市通勤路线排名（type：0按日跨市，1按周跨市）
            loadTableData() {
                //3--获取跨市通勤路线排名（type：0按日跨市，1按周跨市）
                var theUrl1 = "/cityCommuting/getCommutingRank";
                var theUrl = window.baseUrl + theUrl1;

                var theQueryObj = {
                    month: this.queryDate.formateYearMonth(),
                    type: this.sumType == 1 ? 0 : 1,
                    city: this.queryRegionCode
                };
                var me = this;
                // debugger;
                //{id: null, workType: 0, month: "2019-05", workCity: "佛山", liveCity: "广州", num: 9800}
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        var theNewDatas = [];
                        if (theData.code == 200) {
                            for (var i = 0; i < theData.data.length; i++) {
                                var theItem = theData.data[i];
                                var theNewData = {
                                    order: i + 1,
                                    startArea: theItem['liveCity'],
                                    endArea: theItem['workCity'],
                                    from: theItem['liveCity'],
                                    to: theItem['workCity'],
                                    value: theItem['num'],
                                    desc: theItem['liveCity'] + '->' + theItem['workCity'],
                                    id: theItem['id']
                                };
                                theNewDatas.push(theNewData);
                            }

                        }
                        me.items = theNewDatas;
                        me.notifyParent(theNewDatas);
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
                this.loadCommutingTrend();
                this.loadTableData();
            }


        },
        created: function () {
        },
        mounted: function () {
            this.initChart();
            this.loadData();
        },
        watch: {
            queryDate: function (newValue, oldValue) {
                console.log("queryDate！", newValue, oldValue);
                this.loadData();
            },
            queryDirection: function (newValue, oldValue) {
                console.log("queryDirection！", newValue, oldValue);

            },
            queryRegionCode: function (newValue, oldValue) {
                console.log("queryRegionCode！", newValue, oldValue);
                this.loadData();
            },
            queryRegionType: function (newValue, oldValue) {
                console.log("queryRegionType！", newValue, oldValue);

            },
            lineDate: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);
                ;
            },
            tabIndex: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);

            },
            sumType(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
            }
        }
    }
</script>

<style scoped>
    .chart-title-btns {
        pointer-events: visible;
        top: 16px;
        right: 54px;
        z-index: 10000;
        position: absolute;
        color: white;
    }

    .chart-title-btns div {
        display: inline-block;
        cursor: pointer;
        background: #00F7DE;
        border-radius: 10px;
        margin-left: 10px;
        padding: 5px;
        color: #b0d2f9;
    }

    .chart-title-btns div.select {
        color: white;
    }

    .n-tab-title {
        color: white;
        border-bottom: solid 1px #b0d2f9;
    }

    .n-tab-title div {
        display: inline-block;
        cursor: pointer;
        width: 50%;
        text-align: center;
    }

    .n-tab-title div.select {
        color: white;
        font-weight: bolder;
    }

    table {

        width: 100%;

    }

    .row {
        position: relative;
    }

    .row1 {
        height: 200px;
    }



    .row2 {
        padding-left: 15px;
        padding-right: 15px;
    }

    .canvas {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    }

    .chart-item .chart-title{
        left:26px;
        top:18px;
        position: absolute;
    }
    .chart{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
    }
    .table-view{
        top:50px;
        position: absolute;
        /*left:16px;*/
        right: 0px;
    }
</style>