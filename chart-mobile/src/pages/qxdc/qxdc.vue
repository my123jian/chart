<template>
    <div id="app">
        <div class="left-part">
            <iframe :src="mapurl" class="mapview" frameborder="no" style="overflow: hidden;"></iframe>
            <div class="wave-content">
                <WaveCircle  style="width: 200px;height: 200px;" width=200 height=200></WaveCircle>
                <WaveCircle  style="width: 200px;height: 200px;"  width=200 height=200></WaveCircle>
                <WaveCircle  style="width: 200px;height: 200px;"  width=200 height=200></WaveCircle>
                <WaveCircle  style="width: 200px;height: 200px;"  width=200 height=200></WaveCircle>
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
    </div>

</template>

<script>
    import TabOne from "../../components/qxdc/TabOne";
    import TabTwo from "../../components/qxdc/TabTwo";
    import WaveCircle from "../../components/WaveCircle";

    export default {
        name: 'app',
        components: {
            TabTwo,
            TabOne,
            WaveCircle
        },
        data() {
            return {
                queryRegionType: '',//分析的区域
                queryRegionCode: '',//省内 具体到市  省外是全国地图
                queryDirection: '',//查询的迁徙方向 迁入或者迁出
                queryDate: '',//查询的日期

                right_tab_index: 1,
                mapurl: 'country.html',
            };
        },
        mounted() {

        },
        methods: {
            //切换URL地址
            changePage: function (url) {
                location.href = url;
            },
            loadData1() {
                this.$refs.child1.handleParentClick("ssss");
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
        height: 400px;
        left: 0px;
        width: 100%;
    }

    .wave-content >*{
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
</style>