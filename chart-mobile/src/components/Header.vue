<template>
    <div class="header-box cd" ref="header">
        <div class="header">
            <div class="title">
                <div class="logo-img"></div>
                <span>蜂巢交通平台</span>
            </div>
            <div :class="['tab', 'cp', {'active': activeId==1}]" @click="clickTab(1)" v-if="jiance==true">
                {{jiance_text}}
                <div class="sanjiao" v-if="activeId==1"></div>
            </div>
            <div class="tab-line" v-if="guihua==true"></div>
            <div :class="['tab', 'cp', {'active': activeId==2}]" @click="clickTab(2)" v-if="guihua==true">
                {{guihua_text}}
                <div class="sanjiao" v-if="activeId==2"></div>
            </div>
            <div class="tab-line" v-if="fenxi==true"></div>
            <div :class="['tab', 'cp', {'active': activeId==3}]" @click="clickTab(3)" v-if="fenxi==true">
                {{fenxi_text}}
                <div class="sanjiao" v-if="activeId==3"></div>
            </div>
            <!--<div class="time-box">-->
            <!--<span>{{nowYear}}</span>-->
            <!--<span>年</span>-->
            <!--<span>{{nowMonth}}</span>-->
            <!--<span>月</span>-->
            <!--<span>{{nowDay}}</span>-->
            <!--<span>日</span>-->
            <!--<span>{{nowTime}}</span>-->
            <!--</div>-->
            <div class="right-box">
                <div class="right1">
                    <div class="r-btn cp" @click="doFullScreen"></div>
                </div>
                <div class="right2">
                    <div class="people" @click="gotoLogin"></div>
                    <div class="menu_div" v-if="menuVisible">
                        <div class="username">{{userName}}</div>
                        <div class="exit_btn" @click="gotoAdmin">后台管理</div>
                        <div class="exit_btn" @click="logout">注销</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import {utils} from '../common'
    import PageUtil from "../utils/PageUtil";
    import axios from "axios";
    export default {
        props: {customActiveId: {type: [String, Number], default: 1}},
        data() {
            return {
                activeId: 1,
                nowYear: null,
                nowMonth: null,
                nowDay: null,
                nowTime: null,
                timer: null,
                jiance: false,
                guihua: false,
                fenxi: false,
                jiance_text: "",
                guihua_text: "",
                fenxi_text: "",
                appname: '',
                userName: '',
                menuVisible: false,
                isFullScreen: false
            }
        },

        components: {},

        computed: {},
        watch: {
            customActiveId(newVaue, oldValue) {
                if (newVaue != oldValue) {
                    this.activeId = newVaue;
                }

            }
        },
        methods: {
            gotoLogin() {
                // location.href=window.adminUrl;
                // window.gotoPage('login.html');
                this.menuVisible = !this.menuVisible;
            },
            gotoAdmin() {
                location.href = window.adminUrl;
            },
            isFullscreen() {
                return document.fullscreen ||
                    document.mozFullScreen ||
                    document.webkitIsFullScreen || false;
            },
            doExitFullScreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    return;
                }
                //兼容火狐
                console.log(document.mozExitFullscreen)
                if (document.mozExitFullscreen) {
                    document.mozExitFullscreen();
                    return;
                }
                //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
                if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                    return;
                }
                //兼容IE,只能写msRequestFullscreen
                if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                    return;
                }
            },
            doFullScreen() {
                if (this.isFullscreen()) {
                    this.doExitFullScreen();
                    return;
                }
                if (document.documentElement.RequestFullScreen) {
                    document.documentElement.RequestFullScreen();
                    return;
                }
                //兼容火狐
                console.log(document.documentElement.mozRequestFullScreen)
                if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                    return;
                }
                //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
                if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen();
                    return;
                }
                //兼容IE,只能写msRequestFullscreen
                if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                    return;
                }
            },
            logout() {
                var theUrl1 = "/logout";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {};
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        var res = response.data;
                        if (res.code == 200) {

                        }
                        else {
                            alert(res.message);
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        // alert("登出失败");
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed

                    });
                doLogoff();
                location.href = "login.html";
            },
            loadPriv() {
                var theMenuList = window.menuList;
                if (theMenuList && theMenuList.length > 0) {
                    for (var i = 0; i < theMenuList.length; i++) {
                        var theMenu = theMenuList[i];
                        if (theMenu.url == "index.html") {
                            this.jiance = true;
                            this.jiance_text = theMenu.text;
                        }
                        if (theMenu.url == "tqfx.html" || theMenu.url == "zzfx.html") {
                            this.guihua = true;
                            this.guihua_text = theMenu.text;
                        }
                        if (theMenu.url == "qxdc.html" || theMenu.url == "kstq.html") {
                            this.fenxi = true;
                            this.fenxi_text = theMenu.text;
                        }
                    }
                }

            },
            clickTab(id) {
                this.activeId = id;
                if (id == 1) {
                    window.gotoPage('index.html');
                }
                if (id == 2) {
                    window.gotoPage('tqfx.html');
                }
                if (id == 3) {

                    window.gotoPage('qxdc.html');
                }

            },
            /**
             * 发送高度
             */
            sendHeight() {
                const headerHeight = this.$refs['header'].offsetHeight
                this.$emit('getHeaderHeight', headerHeight)
            },
            /**
             * 处理时间
             */
            handleTime() {
                let st = new Date()
                this.nowYear = st.getFullYear()
                this.nowMonth = st.getMonth() + 1
                this.nowDay = st.getDate()
                this.nowTime = st.getHours() + ' : ' + st.getMinutes()
            }
        },

        created() {
            var me = this;

        },

        mounted() {
            this.loadPriv();
            this.userName = getLoginName();
            this.activeId = this.customActiveId;
            // utils.hasSetRem(this.sendHeight)
            // this.handleTime()
            // let me = this
            //this.timer = setInterval(me.handleTime, 1000)
            if (this.activeId == 1) {
                window.moduleNmae = this.jiance_text;// "实时交通监测";
            }
            if (this.activeId == 2) {
                window.moduleNmae = this.guihua_text;// "市内交通规划";
            }
            if (this.activeId == 3) {
                window.moduleNmae = this.fenxi_text;// "跨市迁徙分析";
            }
            this.appname = window.appname;

        },

        beforeDestroy() {
            clearTimeout(this.timer)
        }
    }
</script>

<style scoped>
    .username{
        border-bottom: white dotted 2px;
        padding-bottom: 5px;
    }
    .exit_btn {
        margin-top: 10px;
        cursor: pointer;
        padding-top: 4px;
    }

    .exit_btn:hover {
        background: #c3c3c3;
    }

    .menu_div {
        position: absolute;
        bottom: 0px;
        right: 10px;
        background: white;
        opacity: 80%;
        width: 200px;
        top: 80px;
        padding: 10px;
        height: 140px;
        color: white;
        font-size: 25px;
        background: #418edd;
        z-index: 99999;
        border-radius: 10px;
    }

    .header {
        width: 100%;
        height: 78px;
        display: flex;
        align-items: center;
        border-bottom: 2px solid #2b73cd;
    }

    .title {
        width: 388px;
        height: 79px;
        background: url("../assets/顶部导航栏_LOGO背景.png") no-repeat;
        background-size: contain;
        color: #f3f7ff;
        font-size: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logo-img {
        width: 28px;
        height: 31px;
        background: url("../assets/logo.png") no-repeat;
        background-size: contain;
        margin-right: 20px;
    }

    .tab {
        width: 217px;
        height: 61px;
        color: #97c6ff;
        margin: 9px 28px;
        font-size: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .sanjiao {
        position: absolute;
        top: 77%;
        left: 50%;
        width: 10px;
        height: 9px;
        margin-left: -6px;
        z-index: 10;
        background: url("../assets/sanjiao.png") no-repeat;
        background-size: contain;
    }

    .tab.active {
        background: url("../assets/顶部导航栏选中框.png.png") no-repeat;
        color: white;
        background-size: contain;
    }

    .tab-line {
        width: 10px;
        height: 30px;
        background: url("../assets/顶部导航栏_标题分割线.png") no-repeat;
        background-size: contain;
    }

    .time-box {
        width: 327px;
        height: 39px;
        background: url("../assets/顶部导航栏_时间框背景.png") no-repeat;
        background-size: contain;
        margin-left: 153px;
        margin-right: 53px;
        color: #cde4ff;
        font-size: 22px;
        line-height: 39px;
        text-align: center;

        /*span:nth-child(2n+1) {*/
        /*font-family: unidreamledregular;*/
        /*font-size: 26px;*/
        /*}*/

    }

    .right-box {
        width: 194px;
        height: 100%;
        position: absolute;
        right: 0px;
        display: flex;
        align-items: center;
    }

    .right1 {
        width: 128px;
        height: 54px;
        background: url("../assets/顶部导航栏_缩放背景.png") no-repeat;
        background-size: contain;
        position: relative;
    }

    .right2 {
        width: 78px;
        height: 78px;
        background: url("../assets/顶部导航栏_人物信息icon_背景.png") no-repeat;
        background-size: contain;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 99999;
    }

    .people {
        width: 34px;
        height: 36px;
        background: url("../assets/顶部导航栏_人物信息icon.png") no-repeat;
        background-size: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .r-btn {
        width: 35px;
        height: 35px;
        background: url("../assets/顶部导航栏_缩放icon.png") no-repeat;
        background-size: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .header-box {
        position: relative;
        z-index: 1100;
    }
</style>
