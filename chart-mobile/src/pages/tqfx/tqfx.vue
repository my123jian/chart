<template>
    <div id="app">
        <Header customActiveId="2"></Header>
        <EchartAMap level="3" :data="mapData" :areaMod="1"></EchartAMap>
        <!--<div id="container" class="map-full" style="overflow: hidden;" ref="mapview"></div>-->
        <div class="content">
            <div class="left-part">

                <div class="query-bar">
                    <div class="city field">
                        <div class="location-icon"></div>
                        <select v-model="queryRegionCode">
                            <option v-for="item in citys" :key="item.id" :value="item.value">
                                {{ item.name }}
                            </option>
                        </select>
                        <div class="down-icon"></div>
                    </div>
                    <div class="city field">
                        <div class="location-icon"></div>
                        <select v-model="queryAreaCode">
                            <option value="" selected>全部区域</option>
                            <option v-for="item in areas"  :value="item.value">
                                {{ item.name }}
                            </option>
                        </select>
                        <div class="down-icon"></div>
                    </div>
                    <div class="date field">
                        <Datepicker v-on:input="dateChange" format="YYYY-MM" name="queryDate"
                                    :value="queryDate"></Datepicker>
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
                        <div v-on:click="right_tab_index= 1;tab_three_index=0" :class="right_tab_index==1?'select':''">
                            <span>通勤洞察</span></div>
                        <div v-on:click="right_tab_index= 2" :class="right_tab_index==2?'select':''">
                            <span>通勤排行</span>
                        </div>
                        <!--<div v-on:click="right_tab_index= 3" :class="right_tab_index==3?'select':''">-->
                        <!--<span>人群画像</span>-->
                        <!--</div>-->
                    </div>

                    <div class="tab-content">
                        <div v-if="right_tab_index==1">
                            <TabOne :queryDate="queryDate" :queryRegionCode="queryRegionCode"
                                    :queryAreaCode="queryAreaCode"></TabOne>
                        </div>
                        <div v-if="right_tab_index==2&&tab_three_index==0">
                            <TabTwo v-on:select="onTabTwoSelect" :queryDate="queryDate"
                                    :queryRegionCode="queryRegionCode" :queryAreaCode="queryAreaCode"></TabTwo>
                        </div>
                        <div v-if="tab_three_index==1">
                            <TabThree v-on:return="onTabThreeReturn" :queryDate="queryDate" :queryRegionCode="queryRegionCode"
                                      :queryAreaCode="queryAreaCode" :data="selectItem"></TabThree>
                        </div>
                    </div>

                </div>

            </div>
            <div class="nav-bottom-bar">
                <div class="" @click="gotoPage">职住分析</div>
                <div class="select">通勤分析</div>

            </div>
        </div>

    </div>
</template>

<script>
    import Header from "../../components/Header";
    import TabOne from "../../components/tqfx/TabOne";
    import TabTwo from "../../components/tqfx/TabTwo";
    import TabThree from "../../components/tqfx/TabThree";
    import WaveCircle from "../../components/WaveCircle";
    import EchartAMap from "../../components/EchartAMap";
    import Datepicker from 'vue-datepicker-local';
    import CityCodeMap from "../../utils/CityCodeMap"
    import axios from "axios";


    export default {
        name: "tqfx",
        components: {
            TabTwo,
            TabOne,
            TabThree,
            WaveCircle,
            Datepicker,
            Header,
            EchartAMap
        },
        mounted() {
            // this.initMap();
            this.loadData();
            this.initCity();
            this.initArea();
        },
        methods: {
            initCity() {
                this.citys = CityCodeMap.getGdCityList();
                this.queryRegionCode=getDefaultCity();
            },
            initArea() {
                var theCode = CityCodeMap.getCityCode("广东省", this.queryRegionCode);
                if(!theCode){
                    return;
                }
                this.areas = CityCodeMap.getGdAreaList(theCode);
            },
            gotoPage() {
                window.gotoPage('zzfx.html')
            },
            dateChange(value) {
                this.queryDate = value;
            },
            loadData() {
                this.loadTripDistance();
                this.loadTripDetail();
            },
            onTabTwoSelect(item) {
                this.selectItem=item;
                this.tab_three_index=1;
            },
            onTabThreeReturn() {
                this.tab_three_index=0;
            },
            loadTripDistance() {
                var theUrl1 = "/citytransport/tripDistanceCount";
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

                        me.totalNum = theData.data.num;
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
                            theItem.from = theItem.startArea;
                            theItem.to = theItem.endArea;
                            theItem.value = theItem.num;

                            theResult.push(theItem);
                        }
                        me.items = theResult;
                        var mapData = {
                            name: me.queryRegionCode,
                            items: me.items
                        };
                        me.mapData = mapData;
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
        },
        watch: {
            queryAreaCode(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
            },
            queryRegionCode(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.queryAreaCode="";
                    this.loadData();
                    this.initArea();
                }
            },
            queryDate(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.loadData();
                }
            }
        },
        data() {
            return {
                queryRegionCode:  getDefaultCity(),//'广州',//省内 具体到市  省外是全国地图
                queryAreaCode: '',//所在区域信息
                queryDate: new Date(),//查询的日期
                right_tab_index: 1,
                defaultFeatures: ['bg', 'building', 'point'], // 地图默认特征
                totalNum: 0,

                Channel1Radio: 0.3,
                Channel2Radio: 0.3,
                Channel3Radio: 0.3,
                Channel4Radio: 0.3,
                mapData: {name: '广州市', items: []},
                selectItem:null,
                tab_three_index:0,//是否显示
                citys: [],
                areas: []
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
        z-index: 1000;
        bottom: 0px;
        right: 0px;
        pointer-events: none;
        position: absolute;
        background: transparent;
    }

</style>