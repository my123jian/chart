<template>
    <div id="app">
        <div class="left-part">
            <iframe :src="mapurl" class="mapview" frameborder="no" style="overflow: hidden;"></iframe>
            <div class="query-bar">
                <select v-model="queryRegionCode">
                    <option value="gz">广州市</option>
                    <option value="sz">深圳市</option>
                </select>
                <Datepicker v-on:input="dateChange" name="queryDate" :value="queryDate"></Datepicker>
                <!--<input placeholder="请输入日期"/>-->
                <div class="radio-grp">
                    <span :class="queryDirection==1?'select':''" v-on:click="queryDirection=1">迁入</span>
                    <span :class="queryDirection==2?'select':''" v-on:click="queryDirection=2">迁出</span>
                </div>
                <div class="radio-grp">
                    <span :class="queryRegionType==1?'select':''" v-on:click="queryRegionType=1">省内</span>
                    <span :class="queryRegionType==2?'select':''" v-on:click="queryRegionType=2">省外</span>
                </div>
            </div>
            <div class="count-view">
                <div class="title">省内迁出总人数</div>
                <div>308.15万</div>
            </div>
            <div class="wave-content">
                <WaveCircle style="width: 200px;height: 200px;" width=200 height=200></WaveCircle>
                <WaveCircle style="width: 200px;height: 200px;" width=200 height=200></WaveCircle>
                <WaveCircle style="width: 200px;height: 200px;" width=200 height=200></WaveCircle>
                <WaveCircle style="width: 200px;height: 200px;" width=200 height=200></WaveCircle>
            </div>
        </div>
        <div class="right-part">
            <div class="tab-view">
                <div class="tab-title">
                    <div v-on:click="right_tab_index= 1">迁入分析</div>
                    <div v-on:click="right_tab_index= 2">人群画像</div>
                </div>
                <div class="tab-content">
                    <div v-if="right_tab_index==1">
                        <tab-one :queryDirection="queryDirection" :queryRegionType="queryRegionType"
                                 :queryDate="queryDate" :queryRegionCode="queryRegionCode"></tab-one>
                    </div>
                    <div v-if="right_tab_index==2">
                        <TabTwo :queryDirection="queryDirection" :queryRegionType="queryRegionType"
                                :queryDate="queryDate" :queryRegionCode="queryRegionCode"></TabTwo>
                    </div>
                </div>

            </div>

        </div>
        <div class="nav-bottom-bar">
            <div>迁徙洞察</div>
            <div>跨市同期</div>
        </div>
    </div>

</template>

<script>
    import TabOne from "../../components/qxdc/TabOne";
    import TabTwo from "../../components/qxdc/TabTwo";
    import WaveCircle from "../../components/WaveCircle";
    import Datepicker from 'vue-datepicker-local';
    import axios from "axios";

    export default {
        name: 'app',
        components: {
            TabTwo,
            TabOne,
            WaveCircle,
            Datepicker
        },
        data() {
            return {
                queryRegionType: '',//分析的区域
                queryRegionCode: '',//省内 具体到市  省外是全国地图
                queryDirection: '',//查询的迁徙方向 迁入或者迁出
                queryDate: new Date(),//查询的日期

                right_tab_index: 1,
                mapurl: 'country.html',
            };
        },
        watch: {
            queryDate: function (newDate) {
                console.log('日期选择变化!', newDate);
                this.loadData1();
            },
            queryRegionType: function (newValue, oldValue) {
                if (newValue == 1) {
                    this.mapurl = "country.html";
                }
                else {
                    this.mapurl = "province.html";
                }
            }
        },
        mounted() {

        },
        methods: {
            //切换URL地址
            changePage: function (url) {
                location.href = url;
            }
            ,
            loadData1() {
                // this.$refs.child1.handleParentClick("ssss"); 调用组件的方法
                axios.get('/user?ID=12345')
                    .then(function (response) {
                        // handle success
                        console.log(response);
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