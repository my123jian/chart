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
            this.initChart();

        },
        methods: {
            initChart() {
                var me = this;
                this.chartMap = window.echarts.init(this.$refs.chartMap);
                this.chartMap.setOption({
                    amap: {
                        maxPitch: 60,
                        pitch: 10, //45 俯仰角
                        viewMode: '3D',
                        zoom: 7.5,
                        expandZoomRange: true,
                        zooms: [3, 20],
                        mapStyle: 'amap://styles/785cdb67af60cfce35e24e8d6c56ed75', //地图主题
                        center: [113.275824, 22.994826], //中心点
                        rotation: 0,  //顺时针旋转角度
                        resizeEnable: true,
                    },
                    animation: false,
                    series: []
                });
                var layer = this.chartMap.getModel().getComponent('amap').getLayer();
                layer.render = function () {
                    var theOptions = me.chartMap.getOption();
                    me.setOption({
                        series: theOptions.series
                    });
                }
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