<template>
    <div id="app">
        <Header customActiveId="3"></Header>
        <EchartAMap :level="mapLevel" :data="mapData" :queryDirection="queryDirection"></EchartAMap>
        <div class="left-part">
            <!--<iframe :src="mapurl" class="mapview" frameborder="no" style="overflow: hidden;" ref="mapview"></iframe>-->
            <div class="query-bar">
                <div class="field">
                    <div class="location-icon"></div>
                    <div class="city field">
                        <div class="location-icon"></div>
                        <select v-model="queryRegionCode">
                            <option v-for="item in citys" :key="item.id" :value="item.value">
                                {{ item.name }}
                            </option>
                        </select>
                        <div class="down-icon"></div>
                    </div>
                    <div class="down-icon"></div>
                </div>
                <div class="date-field">
                    <Datepicker v-on:input="dateChange" name="queryDate" :value="queryDate"></Datepicker>
                    <div class="date-icon"></div>
                </div>
                <!--<div class="field">-->
                <!--&lt;!&ndash;<input placeholder="请输入日期"/>&ndash;&gt;-->
                <!--<div class="radio-grp">-->
                <!--<span :class="queryDirection==1?'select':''" v-on:click="queryDirection=1">迁入</span>-->
                <!--<span :class="queryDirection==2?'select':''" v-on:click="queryDirection=2">迁出</span>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="field">-->
                <!--<div class="radio-grp">-->
                <!--<span :class="queryRegionType==1?'select':''" v-on:click="queryRegionType=1">省内</span>-->
                <!--<span :class="queryRegionType==2?'select':''" v-on:click="queryRegionType=2">省外</span>-->
                <!--</div>-->
                <!--</div>-->


            </div>
            <div class="count-view">
                <div class="title">{{queryRegionType==1?'省内':'省外'}}{{queryDirection==1?'迁入':'迁出'}}总人数</div>
                <div class="num" v-html="totalNum.fromateDataString()"></div>
            </div>

        </div>
        <div class="wave-content">
            <table>
                <tr>
                    <td style="vertical-align: center">
                        <div class="onecloumn onecloumn-bg">
                            通勤方式
                        </div>
                    </td>
                    <td>

                        <WaveCircle color="#63efe0" :value="Channel1Radio"></WaveCircle>
                        <WaveCircle color="#67f782" :value="Channel2Radio"></WaveCircle>
                        <WaveCircle color="#faff64" :value="Channel3Radio"></WaveCircle>
                        <WaveCircle color="#64ceff" :value="Channel4Radio"></WaveCircle>
                    </td>
                </tr>
            </table>


        </div>
        <div class="right-part">
            <div class="tab-view">
                <div class="tab-title tab-title4">
                    <div v-on:click="top_tab_index= 1" :class="top_tab_index== 1?'select':''">
                        <span>省内迁入</span>
                    </div>
                    <div v-on:click="top_tab_index= 2" :class="top_tab_index== 2?'select':''">
                        <span>省外迁入</span>
                    </div>
                    <div v-on:click="top_tab_index= 3" :class="top_tab_index== 3?'select':''">
                        <span>省内迁出</span>
                    </div>
                    <div v-on:click="top_tab_index= 4" :class="top_tab_index== 4?'select':''">
                        <span>省外迁出</span>
                    </div>
                    <!--<div v-on:click="right_tab_index= 2" :class="right_tab_index== 2?'select':''">-->
                    <!--<span>人群画像</span>-->
                    <!--</div>-->
                </div>
                <div class="tab-subtitle tab-title2">
                    <div v-on:click="right_tab_index= 1" :class="right_tab_index==1?'select':''">
                        <span>迁徙规模</span></div>
                    <div v-on:click="right_tab_index= 2" :class="right_tab_index==2?'select':''">
                        <span>人群画像</span>
                    </div>
                </div>
                <div class="tab-content tab-sub-content">
                    <div v-if="right_tab_index==1">
                        <tab-one :queryDirection="queryDirection" :queryRegionType="queryRegionType"
                                 :queryDate="queryDate" :queryRegionCode="queryRegionCode"
                                 v-on:dataChange="dataChange"></tab-one>
                    </div>
                    <div v-if="right_tab_index==2">
                        <TabTwo :queryDirection="queryDirection" :queryRegionType="queryRegionType"
                                :queryDate="queryDate" :queryRegionCode="queryRegionCode"
                        ></TabTwo>
                    </div>
                </div>

            </div>

        </div>
        <div class="nav-bottom-bar">
            <div class="select">迁徙洞察</div>
            <div @click="gotoPage">跨市通勤</div>
        </div>
    </div>

</template>

<script>
    import Header from "../../components/Header";
    import TabOne from "../../components/qxdc/TabOne";
    import TabTwo from "../../components/qxdc/TabTwo";
    import WaveCircle from "../../components/WaveCircle";
    import Datepicker from 'vue-datepicker-local';
    import axios from "axios";
    import EchartAMap from "../../components/EchartAMap";
    import CityCodeMap from "../../utils/CityCodeMap"
    import PageUtil from "../../utils/PageUtil";

    export default {
        name: 'app',
        components: {
            TabTwo,
            TabOne,
            WaveCircle,
            Datepicker,
            Header,
            EchartAMap
        },
        data() {
            return {
                queryRegionType: '1',//分析的区域
                queryRegionCode: '',//'广州',//省内 具体到市  省外是全国地图
                queryDirection: '1',//查询的迁徙方向 迁入或者迁出
                queryDate: new Date(),//查询的日期
                right_tab_index: 1,
                top_tab_index: 1,
                mapurl: 'province.html',

                Channel1Radio: 0,
                Channel2Radio: 0,
                Channel3Radio: 0,
                Channel4Radio: 0,

                totalNum: 0,
                mapLevel: 2,
                mapData: {name: '广东省', level: 2},
                citys: [],
                areas: []
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
            top_tab_index(newValue, oldValue) {
                if (newValue != oldValue) {
                    switch (newValue) {
                        case 1:
                            this.queryDirection = 1;
                            this.queryRegionType = 1;
                            break;
                        case 2:
                            this.queryDirection = 1;
                            this.queryRegionType = 2;
                            break;
                        case 3:
                            this.queryDirection = 2;
                            this.queryRegionType = 1;
                            break;
                        case 4:
                            this.queryDirection = 2;
                            this.queryRegionType = 2;
                            break;
                    }
                }
            },
            queryDirection: function (newValue, oldValue) {
                console.log("queryDirection！", newValue, oldValue);
                this.loadData();
            },
            queryRegionCode: function (newValue, oldValue) {
                console.log("queryRegionCode！", newValue, oldValue);

                this.loadData();
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
            this.initCity();
            this.queryRegionCode=getDefaultCity();
        },
        methods: {
            initCity() {
                this.citys = CityCodeMap.getGdCityList();
            },
            initArea() {
                var theCode = CityCodeMap.getCityCode("广东省", this.queryRegionCode);
                if(!theCode){
                    return;
                }
                this.areas = CityCodeMap.getGdAreaList(theCode);
            },
            gotoPage() {
                window.gotoPage('kstq.html')
            },
            //切换URL地址
            changePage: function (url) {
                location.href = url;
            },
            loadData() {
                this.loadMigrateChannel();
                this.loadMigrateCount();
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
                    this.mapLevel=1;
                }
                else {
                    var theMapData = {name: '广东省', items: data};
                    this.mapData = theMapData;
                    this.mapLevel=2;
                }

            },
            //10.统计省内/省外总人数
            loadMigrateCount() {
                //迁徙人群画像分析-年龄
                var theUrl1 = "/citymigrate/migrateCount";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
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
                        me.totalNum = theData.data || 0;
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
            drawChannel(datas) {
                /**
                 * area: "广州"
                 channel: 1
                 dateTime: "2019-06-21"
                 id: 10
                 migSource: 1
                 migType: 1
                 num: 300000
                 ratio: 0.34
                 * */
                this.Channel1Radio = 0;
                this.Channel2Radio = 0;
                this.Channel3Radio = 0;
                this.Channel4Radio = 0;
                for (var i = 0; i < datas.length; i++) {
                    var theIem = datas[i];
                    switch (theIem.channel) {
                        case 1:
                            this.Channel1Radio = theIem.ratio;
                            break;
                        case 2:
                            this.Channel2Radio = theIem.ratio;
                            break;
                        case 3:
                            this.Channel3Radio = theIem.ratio;
                            break;
                        case 4:
                            this.Channel4Radio = theIem.ratio;
                            break;
                    }
                }
            },
            //迁徙渠道分析
            loadMigrateChannel() {
                //今日热门迁徙路线
                var me = this;
                var theUrl1 = "/citymigrate/migrateChannel";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    dateTime: this.queryDate.formate(),
                    migType: this.queryDirection,
                    migSource: this.queryRegionType,
                    area: this.queryRegionCode
                };
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        me.drawChannel(theData.data);
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
        pointer-events: none;
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
        margin: 10px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .radio-grp > span.select {
        background: #152d61;
        border-radius: 5px;
    }
</style>