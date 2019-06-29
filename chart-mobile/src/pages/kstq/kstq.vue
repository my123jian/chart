<template>
    <div id="app">
        <Header customActiveId="3"></Header>
        <div class="left-part">
            <!--<iframe :src="mapurl" class="mapview" frameborder="no" style="overflow: hidden;" ref="mapview"></iframe>-->
            <EchartMap :level="mapLevel" :data="mapData"></EchartMap>
            <div class="query-bar">
                <div class="field">
                    <div class="location-icon"></div>
                    <select v-model="queryRegionCode">
                        <option value="广州">广州市</option>
                        <option value="深圳">深圳市</option>
                    </select>
                    <div class="down-icon"></div>
                </div>
                <div class="field">
                    <Datepicker v-on:input="dateChange" format="YYYY-MM" name="queryDate"
                                :value="queryDate"></Datepicker>
                    <div class="date-icon"></div>
                </div>
                <div class="field big-field">
                    <div class="radio-grp">
                        <span :class="sumType==1?'select':''" v-on:click="sumType=1">按日跨市通勤</span>
                        <span :class="sumType==2?'select':''" v-on:click="sumType=2">按周跨市通勤</span>
                    </div>
                </div>

            </div>
            <div class="count-view">
                <div class="title">{{sumType==1?'日':'周'}}跨市通勤人数</div>
                <div class="num" v-html="totalNum.fromateDataString()"></div>
            </div>

        </div>
        <div class="right-part">
            <div class="tab-view">
                <div class="tab-title tab-title2">
                    <div v-on:click="right_tab_index= 1" :class="right_tab_index== 1?'select':''">
                        <span>通勤洞察</span>
                    </div>
                    <div v-on:click="right_tab_index= 2" :class="right_tab_index== 2?'select':''">
                        <span>人群画像</span>
                    </div>
                </div>
                <div class="tab-content">
                    <div v-if="right_tab_index==1">
                        <tab-one :queryDirection="queryDirection" :queryRegionType="queryRegionType"
                                 :queryDate="queryDate" :queryRegionCode="queryRegionCode" :sumType="sumType"
                                 v-on:dataChange="dataChange"></tab-one>
                    </div>
                    <div v-if="right_tab_index==2">
                        <TabTwo :queryDirection="queryDirection" :queryRegionType="queryRegionType"
                                :queryDate="queryDate" :queryRegionCode="queryRegionCode" :sumType="sumType"
                        ></TabTwo>
                    </div>
                </div>

            </div>

        </div>
        <div class="nav-bottom-bar">
            <div @click="gotoPage">迁徙洞察</div>
            <div class="select">跨市通勤</div>
        </div>
    </div>

</template>

<script>
    import Header from "../../components/Header";
    import TabOne from "../../components/kstq/TabOne";
    import TabTwo from "../../components/kstq/TabTwo";
    import Datepicker from 'vue-datepicker-local';
    import axios from "axios";
    import EchartMap from "../../components/EchartMap";
    import PageUtil from "../../utils/PageUtil";

    export default {
        name: 'kstq',
        components: {
            TabTwo,
            TabOne,
            Datepicker,
            Header,
            EchartMap
        },
        data() {
            return {
                queryRegionType: '1',//分析的区域
                queryRegionCode: '广州',//省内 具体到市  省外是全国地图
                queryDirection: '1',//查询的迁徙方向 迁入或者迁出
                queryDate: new Date(),//查询的日期
                right_tab_index: 1,
                mapurl: 'province.html',
                sumType: 1,//1 日统计 2 周统计

                Channel1Radio: 0,
                Channel2Radio: 0,
                Channel3Radio: 0,
                Channel4Radio: 0,

                totalNum: 0,
                mapLevel: 2,
                mapData: {name: '广东省', level: 2}
            };
        },
        watch: {
            queryDate: function (newDate) {
                console.log('日期选择变化!', newDate);
                this.loadData();
            },
            queryDate: function (newValue, oldValue) {
                console.log("queryDate！", newValue, oldValue);
                this.loadData();
            },
            queryDirection: function (newValue, oldValue) {
                console.log("queryDirection！", newValue, oldValue);
                this.loadData();
            },
            queryRegionCode: function (newValue, oldValue) {
                console.log("queryRegionCode！", newValue, oldValue);

                this.loadData();
            },
            sumType(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
            },
            queryRegionType: function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return;
                }
                if (newValue == 2) {
                    this.mapLevel = 1;
                    //this.mapurl = "country.html";
                }
                else {
                    this.mapLevel = 2;
                    // this.mapurl = "province.html";
                }
                this.loadData();
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            gotoPage() {
                window.gotoPage('qxdc.html')
            },
            //切换URL地址
            changePage: function (url) {
                location.href = url;
            },
            loadData() {
                this.loadCommutingNum();
            },
            dataChange(data) {
                //var theWindow = this.$refs.mapview;
                //刷新子窗口数据  同时 刷新 球状图数据
                // debugger;
                //theWindow.contentWindow&& theWindow.contentWindow.refresh(data);
                // console.log(theWindow,data);
                if (this.queryRegionType == 2) {
                    var theMapData = {name: '中国', items: data};
                    this.mapData = theMapData;
                }
                else {
                    var theMapData = {name: '广东省', items: data};
                    this.mapData = theMapData;
                }

            },
            //1--获取跨市通勤总人数（type：0按日跨市，1按周跨市）
            loadCommutingNum() {
                //迁徙人群画像分析-年龄
                var theUrl1 = "/cityCommuting/getCommutingNum";
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
                        me.totalNum = theData.data && theData.data.num || 0;
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
            dateChange(value) {
                this.queryDate = value;
            }
        }
    }
</script>

<style scoped>
    /*.tab-title {*/
    /*background: gray;*/
    /*}*/

    /*.tab-title div {*/
    /*display: inline-block;*/
    /*cursor: pointer;*/
    /*width: 50%;*/
    /*text-align: center;*/
    /*}*/

    /*.tab-title div.select {*/
    /*color: red;*/
    /*}*/

    /*.tab-content > div {*/
    /*height: 100%;*/
    /*}*/

    .left-part {
        height: 100%;
        width: 50%;
        float: left;
        position: relative;
    }

    .big-field {
        width: 290px;
    }

    .wave-content {
        z-index: 1000;
        position: absolute;
        left: 59px;
        height: 120px;
        bottom: 108px;
        /*width: 100%;*/
    }

    .wave-content > table {
        width: 100%;
    }

    .wave-circle {
        /*width: 25%;*/
        float: left;
        margin-right: 100px;
    }

    .mapview {
        width: 100%;
        height: 100%;
    }

    #app {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
        overflow-y: hidden;
    }

    .right-part {
        /*width: 50%;*/
        float: right;
        height: 100%;
        position: relative;
    }

    /*.tab-view {*/
    /*height: 100%;*/
    /*position: relative;*/
    /*}*/

    /*.tab-content {*/
    /*position: absolute;*/
    /*bottom: 0px;*/
    /*width: 100%;*/
    /*top: 1.5em;*/
    /*}*/

    #app {
        position: relative;
    }

    /*.nav-bottom-bar {*/
    /*position: absolute;*/
    /*bottom: 0px;*/
    /*width: 100%;*/
    /*height: 2em;*/
    /*left: 0px;*/
    /*text-align: center;*/
    /*z-index: 10000*/
    /*}*/

    .radio-grp {
        color: white;
    }

    .radio-grp > span {
        cursor: pointer;
        /*display: inline-block;*/
        width: 110px;
        text-align: center;
        /*margin: 10px;*/
        /*padding-top: 5px;*/
        /*padding-bottom: 5px;*/
        padding: 5px;
    }

    .radio-grp > span.select {
        background: #054881;
        border-radius: 4px;
    }
</style>