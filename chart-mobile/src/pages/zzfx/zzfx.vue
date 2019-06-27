<template>
    <div id="app">
        <Header customActiveId="2"></Header>
        <div id="container" class="map-full" style="overflow: hidden;" ref="mapview"></div>
    </div>
</template>

<script>
    import Header from "../../components/Header";
    import TabOne from "../../components/zzfx/TabOne";
    import TabTwo from "../../components/zzfx/TabTwo";
    import Datepicker from 'vue-datepicker-local';
    import axios from "axios";

    export default {
        name: "zzfx",
        components: {
            TabTwo,
            TabOne,
            Datepicker,
            Header
        },
        mounted() {
            this.initMap();
            this.loadSpace();
        },
        methods: {
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
    .tab-title {
        background: gray;
    }

    .tab-title div {
        display: inline-block;
        cursor: pointer;
        width: 50%;
        text-align: center;
    }

    .tab-title div.select {
        color: red;
    }

    .tab-content > div {
        height: 100%;
    }

    .left-part {
        height: 100%;
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

    .left-part {
        width: 50%;
        float: left;
    }

    .right-part {
        width: 50%;
        float: left;
        height: 100%;
    }

    .tab-view {
        height: 100%;
        position: relative;
    }

    .tab-content {
        position: absolute;
        bottom: 0px;
        width: 100%;
        top: 1.5em;
    }

    .query-bar {
        position: absolute;
        top: 1px;
        left: 5px;
        padding: 5px;
    }

    .query-bar > * {
        display: inline-block;
        height: 100%;
        margin: 2px;
        height: 34px;
    }

    .count-view {
        position: absolute;
        left: 5px;
        top: 100px;
    }

    #app {
        position: relative;
    }

    .nav-bottom-bar {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 2em;
        left: 0px;
        text-align: center;
        z-index: 10000
    }

    .nav-bottom-bar > * {
        display: inline-block;
        cursor: pointer;
        margin: 5px;
    }

    .radio-grp {

    }

    .radio-grp > span {
        cursor: pointer;
    }

    .radio-grp > span.select {
        background: red;
    }
</style>