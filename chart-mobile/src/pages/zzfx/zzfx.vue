<template>
    <div id="app">
        <Header customActiveId="2"></Header>
        <div id="container" class="map-full" style="overflow: hidden;" ref="mapview"></div>
        <!--<div id="container" class="map-full" style="overflow: hidden;" ref="mapview"></div>-->
        <div class="content">
            <div class="left-part">

                <div class="query-bar">
                    <div class="city field">
                        <div class="location-icon"></div>
                        <select v-model="queryRegionCode">
                            <option value="广州">广州市</option>
                            <option value="深圳">深圳市</option>
                            <option value="肇庆">肇庆市</option>
                            <option value="河源">河源市</option>
                            <option value="云浮">云浮市</option>
                            <option value="惠州">惠州市</option>
                            <option value="珠海">珠海市</option>
                            <option value="中山">中山市</option>
                            <option value="东莞">东莞市</option>
                            <option value="汕头">汕头市</option>
                        </select>
                        <div class="down-icon"></div>
                    </div>
                    <div class="date field">
                        <Datepicker v-on:input="dateChange"  format="YYYY-MM" name="queryDate" :value="queryDate"></Datepicker>
                        <div class="date-icon"></div>
                    </div>
                    <!--<input placeholder="请输入日期"/>-->

                </div>
                <div class="count-view">
                    <div class="title">通勤人数</div>
                    <div class="num" v-html="totalNum.fromateDataString()"></div>
                </div>
                <!--<div class="wave-content">-->
                <!--<WaveCircle style="width: 200px;height: 200px;" :value="Channel1Radio" width=200-->
                <!--height=200></WaveCircle>-->
                <!--<WaveCircle style="width: 200px;height: 200px;" :value="Channel2Radio" width=200-->
                <!--height=200></WaveCircle>-->
                <!--<WaveCircle style="width: 200px;height: 200px;" :value="Channel3Radio" width=200-->
                <!--height=200></WaveCircle>-->
                <!--<WaveCircle style="width: 200px;height: 200px;" :value="Channel4Radio" width=200-->
                <!--height=200></WaveCircle>-->
                <!--</div>-->
            </div>
            <div class="right-part">
                <div class="tab-view">
                    <div class="tab-title tab-title2">
                        <div v-on:click="right_tab_index= 1" :class="right_tab_index==1?'select':''">
                            <span>人口分析</span></div>
                        <div v-on:click="right_tab_index= 2" :class="right_tab_index==2?'select':''">
                            <span>人群画像</span>
                        </div>
                    </div>
                    <div class="tab-content">
                        <div v-if="right_tab_index==1">
                            <TabOne :queryDate="queryDate" :queryRegionCode="queryRegionCode"></TabOne>
                        </div>
                        <div v-if="right_tab_index==2">
                            <TabTwo :queryDate="queryDate" :queryRegionCode="queryRegionCode"></TabTwo>
                        </div>
                    </div>

                </div>

            </div>
            <div class="nav-bottom-bar">
                <div @click="gotoPage" >通勤分析</div>
                <div class="select">职住分析</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from "../../components/Header";
    import TabOne from "../../components/zzfx/TabOne";
    import TabTwo from "../../components/zzfx/TabTwo";
    import PageUtil from "../../utils/PageUtil";
    import Datepicker from 'vue-datepicker-local';
    import axios from "axios";

    export default {
        name: "zzfx",
        data() {
            return {
                queryRegionCode: '广州',//省内 具体到市  省外是全国地图
                queryDate: new Date(),//查询的日期
                right_tab_index: 1,
                defaultFeatures: ['bg', 'building', 'point'], // 地图默认特征
                totalNum: 0,

                Channel1Radio: 0.3,
                Channel2Radio: 0.3,
                Channel3Radio: 0.3,
                Channel4Radio: 0.3,
                mapData:{name:'广州市',items:[]}
            }
        },
        components: {
            TabTwo,
            TabOne,
            Datepicker,
            Header
        },
        mounted() {
            this.queryDate = new Date();
            this.initMap();
            this.loadSpace();
        },
        methods: {
            gotoPage(){
                window.gotoPage('tqfx.html')
            },
            dateChange(value) {
                this.queryDate = value;
            },
            //1. 职住地热力分布
            loadSpace() {
                var theUrl1 = "/citytransport/space";
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
            /**
             * 初始化地图
             */
            initMap() {
                const theDefaultMapStyle = 'amap://styles/785cdb67af60cfce35e24e8d6c56ed75' // 默认地图样式
                const theCenterPoint = [113.275824, 22.994826] // 默认地图中心
                let theMap = new AMap.Map('container', {
                    pitch: 45,
                    mapStyle: theDefaultMapStyle,
                    viewMode: '3D', // 地图模式
                    center: theCenterPoint,
                    features: this.defaultFeatures,
                    zoom: 7.5,
                    expandZoomRange: true, // 改变最大缩放等级
                    zooms: [7.5, 20], // 改变最大缩放等级
                    keyboardEnable: false,
                    layers: [
                        //satellite,
                        // building,
                        //roadNet
                    ]
                })
                window.theMap = theMap
            }
        }
    }
</script>

<style scoped>
    .tab-content > div {
        height: 100%;
        pointer-events: visible;
    }

    .left-part {
        height: 100%;
        width: 50%;
        position: relative;
    }

    .wave-content {
        z-index: 1000;
        position: absolute;
        bottom: 0px;
        /*height: 400px;*/
        left: 0px;
        width: 100%;
    }

    .wave-content > * {
        width: 25%;
        float: left;
    }

    #app {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
        overflow-y: hidden;
        position: relative;
    }

    .left-part {
        width: 50%;
        float: left;
    }

    .right-part {
        float: right;
        height: 100%;
    }

    #app {
        position: relative;
    }

    .radio-grp {

    }

    .radio-grp > span {
        cursor: pointer;
    }

    .radio-grp > span.select {
        background: red;
    }

    .content {
        top: 78px;
        left: 0px;
        z-index: 10000;
        bottom: 0px;
        right: 0px;
        pointer-events: none;
        position: absolute;
        background: transparent;
    }
</style>