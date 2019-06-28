<template>
    <div ref="chartMap" class="mapview" id="mapview">
    </div>
</template>

<script>
    import CityMap from '../utils/CityMap';
    import ProvinceMap from '../utils/ProvinceMap';
    import axios from "axios";
    import GeoUtil from '../utils/GeoUtil';

    export default {
        name: "EchartAMap",
        props: {
            data: Object,
            level: {type: [String, Number], default: 1}
        },
        data() {
            return {
                provinceCode: '440000',
                provinceName: '广东省',
                cityName: '广州市',
                cityCode: '',
                colors: ['#ff5555', '#ff8155', '#ffc955', '#cafd4f', '#4ffd5f', '#4ffdca', '#4fe2fd', '#4f99fd', '#3b4dff', '#644cdb'],
                defaultFeatures: ['bg', 'building', 'point'], // 地图默认特征
            }
        },
        mounted() {
            this.initMap();
            GeoUtil.queryRegion("province","广东省",'',function () {
                var theResult=GeoUtil.getRegion();
                console.log("区域数据结果",theResult);
            });



        },
        methods: {
            initMap() {
                const theDefaultMapStyle = 'amap://styles/785cdb67af60cfce35e24e8d6c56ed75' // 默认地图样式
                const theCenterPoint = [113.275824, 22.994826] // 默认地图中心
                let theMap = new AMap.Map('mapview', {
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
            data(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.refresh(newValue);
                }
            }
        }
    }

</script>

<style scoped>
    .mapview {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
    }
</style>