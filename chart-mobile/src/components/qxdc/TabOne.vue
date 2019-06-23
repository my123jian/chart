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
                        {{item.no}}
                    </td>
                    <td>
                        {{item.no}}
                    </td>
                    <td>
                        {{item.no}}
                    </td>
                    <td>
                        {{item.no}}
                    </td>
                    <td>
                        {{item.no}}
                    </td>
                    <td>
                        {{item.no}}
                    </td>
                    <td>
                        {{item.no}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script>
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
            notifyParent(){
                this.$emit('dataChange',data);
            }
        },
        created: function () {
        },
        mounted: function () {
            this.items = [];
            for (var i = 0; i < 10; i++) {
                this.items.push({id: '1' + i, no: '1' + i});
            }
            this.initChart();
            console.log("加载数据!");
        },
        watch: {
            queryDate: function (newValue, oldValue) {
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