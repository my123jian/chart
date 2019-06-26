<template>
    <div :id="id" ref="myEchart"></div>
</template>

<script>
    export default {
        name: "WaveCircle",
        props: {
            id: String,
            color: String,
            width: {type: [String, Number], default: 400},
            height: {type: [String, Number], default: 400},
            name: String,
            value: {type: Number, default: 0.6}
        },
        data: function () {
            return {
                baseStyles: 'width:200px;height:200px'
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
                    backgroundColor: '',

                    series: [{
                        type: 'liquidFill',
                        data: [theValue],
                        radius: '80%',
                        shape: 'circle',
                        color: theColor,
                        outLine: {
                            show: false,
                            borderDistance: 1, //边框距离
                            //
                        },
                        label: {
                            normal: {
                                //fontSize:80    //这里也可以设置
                                textStyle: {
                                    fontSize: 20  //修改字体大小
                                }
                            }
                        }
                    }]
                };
                // 把配置和数据放这里
                this.chart.setOption(theOptions);
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