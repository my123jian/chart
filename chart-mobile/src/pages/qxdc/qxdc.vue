<template>
    <div id="app">
        <Header customActiveId="3"></Header>
        <div class="left-part">
            <iframe :src="mapurl" class="mapview" frameborder="no" style="overflow: hidden;" ref="mapview"></iframe>
            <div class="query-bar">
                <div class="field">
                    <select v-model="queryRegionCode">
                        <option value="广州">广州市</option>
                        <option value="深圳">深圳市</option>
                    </select>
                </div>
               <div class="field">
                   <Datepicker v-on:input="dateChange" name="queryDate" :value="queryDate"></Datepicker>
               </div>
              <div class="field">
                  <!--<input placeholder="请输入日期"/>-->
                  <div class="radio-grp">
                      <span :class="queryDirection==1?'select':''" v-on:click="queryDirection=1">迁入</span>
                      <span :class="queryDirection==2?'select':''" v-on:click="queryDirection=2">迁出</span>
                  </div>
              </div>
                <div class="field">
                    <div class="radio-grp">
                        <span :class="queryRegionType==1?'select':''" v-on:click="queryRegionType=1">省内</span>
                        <span :class="queryRegionType==2?'select':''" v-on:click="queryRegionType=2">省外</span>
                    </div>
                </div>


            </div>
            <div class="count-view">
                <div class="title">省内迁出总人数</div>
                <div>{{totalNum/10000}}万</div>
            </div>
            <div class="wave-content">
                <WaveCircle style="width: 200px;height: 200px;" :value="Channel1Radio" width=200 height=200></WaveCircle>
                <WaveCircle style="width: 200px;height: 200px;" :value="Channel2Radio" width=200 height=200></WaveCircle>
                <WaveCircle style="width: 200px;height: 200px;" :value="Channel3Radio" width=200 height=200></WaveCircle>
                <WaveCircle style="width: 200px;height: 200px;" :value="Channel4Radio" width=200 height=200></WaveCircle>
            </div>
        </div>
        <div class="right-part">
            <div class="tab-view">
                <div class="tab-title tab-title2s">
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
                                :queryDate="queryDate" :queryRegionCode="queryRegionCode"
                                v-on:dataChange="dataChange"></TabTwo>
                    </div>
                </div>

            </div>

        </div>
        <div class="nav-bottom-bar">
            <div>迁徙洞察</div>
            <div>跨市通勤</div>
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

    export default {
        name: 'app',
        components: {
            TabTwo,
            TabOne,
            WaveCircle,
            Datepicker,
            Header
        },
        data() {
            return {
                queryRegionType: '1',//分析的区域
                queryRegionCode: '广州',//省内 具体到市  省外是全国地图
                queryDirection: '1',//查询的迁徙方向 迁入或者迁出
                queryDate: new Date(),//查询的日期
                right_tab_index: 1,
                mapurl: 'province.html',

                Channel1Radio:0,
                Channel2Radio:0,
                Channel3Radio:0,
                Channel4Radio:0,

                totalNum:0,
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
                    this.mapurl = "country.html";
                }
                else {
                    this.mapurl = "province.html";
                }
                this.loadData();
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            //切换URL地址
            changePage: function (url) {
                location.href = url;
            },
            loadData() {
                this.loadMigrateChannel();
                this.loadMigrateCount();
            },
            dataChange(data) {
                var theWindow = this.$ref.mapview;
                //刷新子窗口数据  同时 刷新 球状图数据
                debugger;
                theWindow.contentWindow.refresh(data);
                // console.log(theWindow,data);
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
                var me=this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        // handle success
                        var theData = response.data;
                        me.totalNum=theData.data||0;
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
            drawChannel(datas){
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
                this.Channel1Radio=0;
                this.Channel2Radio=0;
                this.Channel3Radio=0;
                this.Channel4Radio=0;
                for(var i=0;i<datas.length;i++){
                    var theIem=datas[i];
                    switch (theIem.channel){
                        case 1:this.Channel1Radio=theIem.ratio; break;
                        case 2:this.Channel2Radio=theIem.ratio; break;
                        case 3:this.Channel3Radio=theIem.ratio; break;
                        case 4:this.Channel4Radio=theIem.ratio; break;
                    }
                }
            },
            //迁徙渠道分析
            loadMigrateChannel() {
                //今日热门迁徙路线
                var me=this;
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



    .radio-grp {

    }

    .radio-grp > span {
        cursor: pointer;
    }

    .radio-grp > span.select {
        background: red;
    }
</style>