<template>
    <div class="wave-circle" :style="baseStyles" :id="id" ref="myEchart"></div>
</template>

<script>
    export default {
        name: "WaveCircle",
        props: {
            id: String,
            color: String,
            width: {type: [String, Number], default: 120},
            height: {type: [String, Number], default: 120},
            name: String,
            value: {type: Number, default: 0.6}
        },
        data: function () {
            return {
                baseStyles: 'width:120px;height:120px'
            };
        },
        mounted() {
            this.baseStyles = 'width:' + this.width + 'px;height:' + this.height + 'px';
            this.initChart();
        },
        watch: {
            width: function (newValue, oldValue) {
                this.baseStyles = 'width:' + newValue + 'px;height:' + this.height + 'px';
            },
            height: function (newValue, oldValue) {
                this.baseStyles = 'height:' + newValue + 'px;width:' + this.height + 'px';
            },
            value: function (newValue, oldValue) {
                this.drawChart(newValue);
            },
        },
        methods: {
            drawChart(value) {
                var theValue = value||0;
                var theColor = this.color;

                var theOptions = {
                    // backgroundColor: 'transparent',

                    series: [{
                        type: 'liquidFill',
                        data: [{
                            value:theValue,
                            itemStyle:{
                                normal:{
                                    color:theColor
                                }
                            }
                        }],
                        radius: '80%',
                        shape: 'circle',
                        waveAnimation: true,
                        // borderColor: theColor,
                         color:'rgba(255, 255, 255, 0.15)',
                         color: theColor,
                        backgroundStyle:{
                          color:'transparent'
                        },
                        itemStyle: {
                            opacity: 0.5,
                        },
                        outline: {
                            show: true,
                            borderDistance: 1,
                            itemStyle: {
                                // color: theColor,
                                borderColor:theColor,
                                borderWidth: 1,
                            }
                        },
                        label: {
                            normal: {
                                //fontSize:80    //这里也可以设置
                                textStyle: {
                                    color:theColor,
                                    insideColor:'white', //水波背景下的文字颜色
                                    fontSize: 20  //修改字体大小
                                }
                            }
                        }
                    }]
                };
                // debugger;
                // 把配置和数s据放这里
                this.chart.setOption(theOptions,true);
            },
            initChart() {

                this.chart = window.echarts.init(this.$refs.myEchart);
                this.drawChart();
            }
        }
    }

</script>

<style scoped>

</style>