<template>
    <div>
        <div class="row row1 chart-item">
            <div class="chart-title">
                <span class="content-icon">
                    <span>趋势分析</span>
                </span>
            </div>
            <div class="chart-title-btns">
                <div v-on:click="lineDate=1" :class="lineDate==1?'select':''">近半月</div>
                <div v-on:click="lineDate=2" :class="lineDate==2?'select':''">近一月</div>
            </div>
            <div class="canvas" ref="linechart"></div>
        </div>
        <div class="row row2">
            <div class="n-tab-title">
                <div v-on:click="tabIndex=1" :class="tabIndex==1?'select':''">
                    今日热门迁入路线
                </div>
                <div v-on:click="tabIndex=2" :class="tabIndex==2?'select':''">
                    近期热门迁入路线
                </div>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th>排名</th>
                    <th>迁入路线</th>
                    <th>迁入人数</th>
                    <th>汽车</th>
                    <th>火车</th>
                    <th>飞机</th>
                    <th>自驾</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items" :key="item.id">
                    <td>
                        {{item.order}}
                    </td>
                    <td>
                        {{item.desc}}
                    </td>
                    <td>
                        {{item.total}}
                    </td>
                    <td class="bus-color">
                        {{(item.bus*100).toFixed(2)}}%
                    </td>
                    <td class="train-color">
                        {{(item.train*100).toFixed(2)}}%
                    </td>
                    <td class="fly-color">
                        {{(item.fly*100).toFixed(2)}}%
                    </td>
                    <td class="car-color">
                        {{(item.car*100).toFixed(2)}}%
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
        props: ["queryRegionType", "queryRegionCode", "queryDirection", "queryDate"],
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
                 * dateTime: "2019-06-20"
                 endArea: "长沙"
                 id: 14
                 migSource: 1
                 migType: 1
                 num: 10000
                 startArea: "广州"*/
                var theX = [];
                var theY = [];
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        var theItem = data[i];
                        theX.push(theItem.dateTime);
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
            loadMigrateHistory() {
                //今日热门迁徙路线
                var theUrl1 = "/citymigrate/migrateHistory";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theBeginDate = new Date(this.queryDate).before(14);
                var theEndDate = this.queryDate;
                if (this.lineDate == 1) {
                    theBeginDate = new Date(this.queryDate).before(14);
                }
                else {
                    theBeginDate = new Date(this.queryDate).before(29);
                }
                var theQueryObj = {
                    startTime: theBeginDate.formate(),
                    endTime: theEndDate.formate(),
                    migType: this.queryDirection,
                    migSource: this.queryRegionType,
                    startArea: this.queryRegionCode
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
            //今日迁徙/近期迁徙
            loadTableData() {
                //今日热门迁徙路线
                var theUrl1 = "/citymigrate/migrateAmount";
                //近期热门迁徙路线
                var theUrl2 = "/citymigrate/migrateDurationAmount";
                console.log(theUrl2);
                //debugger;
                if (this.tabIndex == 1) {
                    var theUrl = window.baseUrl + theUrl1;
                }
                else {
                    var theUrl = window.baseUrl + theUrl2;
                }
                var theQueryObj = {
                    dateTime: this.queryDate.formate(),
                    migType: this.queryDirection,
                    migSource: this.queryRegionType,
                    startArea: this.queryRegionCode
                };
                var me = this;
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
                                    startArea: theItem['startArea'],
                                    endArea: theItem['endArea'],
                                    from: theItem['startArea'],
                                    to: theItem['endArea'],
                                    value:theItem['num'],
                                    desc: theItem['startArea'] + '->' + theItem['endArea'],
                                    id: theItem['id'],
                                    total: theItem['num'],
                                    bus: theItem['busRatio'],
                                    train: theItem['trainRadio'],
                                    fly: theItem['flyRatio'],
                                    car: theItem['selfRatio'],
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


        },
        created: function () {
        },
        mounted: function () {
            this.initChart();
            this.loadMigrateHistory();
            this.loadTableData();
        },
        watch: {
            queryDate: function (newValue, oldValue) {
                console.log("queryDate！", newValue, oldValue);
                this.loadMigrateHistory();
                this.loadTableData();
            },
            queryDirection: function (newValue, oldValue) {
                console.log("queryDirection！", newValue, oldValue);
                this.loadMigrateHistory();
                this.loadTableData();
            },
            queryRegionCode: function (newValue, oldValue) {
                console.log("queryRegionCode！", newValue, oldValue);
                this.loadMigrateHistory();
                this.loadTableData();
            },
            queryRegionType: function (newValue, oldValue) {
                console.log("queryRegionType！", newValue, oldValue);
                this.loadMigrateHistory();
                this.loadTableData();
            },
            lineDate: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);
                this.loadMigrateHistory();
            },
            tabIndex: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);
                this.loadTableData();
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
</style>