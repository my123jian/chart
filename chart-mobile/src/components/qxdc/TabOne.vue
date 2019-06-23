<template>
    <div>
        <div class="row row1">
            <div class="chart-title">
                <div v-on:click="lineDate=1" :class="lineDate==1?'select':''">近半月</div>
                <div v-on:click="lineDate=2" :class="lineDate==2?'select':''">近一月</div>
            </div>
            <div class="canvas" ref="linechart"></div>
        </div>
        <div class="row row2">
            <div class="tab-title">
                <div v-on:click="tabIndex=1" :class="tabIndex==1?'select':''">
                    今日热门迁入路线
                </div>
                <div v-on:click="tabIndex=2" :class="tabIndex==2?'select':''">
                    近期热门迁入路线
                </div>
            </div>
            <table>
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
                    <td>
                        {{item.bus}}
                    </td>
                    <td>
                        {{item.train}}
                    </td>
                    <td>
                        {{item.fly}}
                    </td>
                    <td>
                        {{item.car}}
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
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        }
                    ]
                };
                this.chart1.setOption(theOptions1);
            },
            notifyParent(data) {
                this.$emit('dataChange', data);
            },
            loadChartData() {
                //今日热门迁徙路线
                var theUrl1 = "/citymigrate/migrateHistory";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    startTime: '2019-06-15',
                    endTime: '2019-06-21',
                    migType: this.queryDirection,
                    migSource: this.queryRegionType,
                    startArea: this.queryRegionCode
                };
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
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
            loadTableData() {
                //今日热门迁徙路线
                var theUrl1 = "/citymigrate/migrateAmount";
                //近期热门迁徙路线
                var theUrl2 = "/citymigrate/migrateDurationAmount";
                console.log(theUrl2);
                if(this.tabindex==1){
                    var theUrl = window.baseUrl + theUrl1;
                }
                else{
                    var theUrl = window.baseUrl + theUrl2;
                }
                var theQueryObj = {
                    dateTime: this.queryDate.formate(),
                    migType: this.queryDirection,
                    migSource: this.queryRegionType,
                    startArea: this.queryRegionCode
                };
                var me=this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                      var theNewDatas=[];
                        if (theData.code == 200) {
                         for(var i=0;i<theData.data.length;i++){
                             var theItem=theData.data[i];
                             var theNewData={
                                 order:i+1,
                                 startArea:theItem['startArea'],
                                 endArea:theItem['endArea'],
                                 from:theItem['startArea'],
                                 to:theItem['endArea'],
                                 desc:theItem['startArea']+'->'+theItem['endArea'],
                                 id:theItem['id'],
                                 total:theItem['num'],
                                 bus:theItem['busRatio'],
                                 train:theItem['trainRatio'],
                                 fly:theItem['flyRatio'],
                                 car:theItem['selfRatio'],
                             };
                             theNewDatas.push(theNewData);
                         }

                        }
                        me.items=theNewDatas;
                        me.notifyParent(theNewData);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed
                    });
            }
        },
        created: function () {
        },
        mounted: function () {
            this.initChart();
            this.loadChartData();
            this.loadTableData();
        },
        watch: {
            queryDate: function (newValue, oldValue) {
                console.log("queryDate！", newValue, oldValue);
                this.loadChartData();
                this.loadTableData();
            },
            queryDirection: function (newValue, oldValue) {
                console.log("queryDirection！", newValue, oldValue);
                this.loadChartData();
                this.loadTableData();
            },
            queryRegionCode: function (newValue, oldValue) {
                console.log("queryRegionCode！", newValue, oldValue);
                this.loadChartData();
                this.loadTableData();
            },
            queryRegionType: function (newValue, oldValue) {
                console.log("queryRegionType！", newValue, oldValue);
                this.loadChartData();
                this.loadTableData();
            },
            lineDate: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);
                this.loadChartData();
                this.loadTableData();
            },
            tabIndex: function (newValue, oldValue) {
                console.log("值发生了变化！", newValue, oldValue);
                this.loadTableData();
            }
        }
    }
</script>

<style scoped>
    .chart-title {

    }

    .chart-title div {
        display: inline-block;
        cursor: pointer;
    }

    .chart-title div.select {
        color: red;
    }

    .tab-title {

    }

    .tab-title div {
        display: inline-block;
        cursor: pointer;
    }

    .tab-title div.select {
        color: red;
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

    .row .chart-title {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 10000;
    }

    .canvas {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    }
</style>