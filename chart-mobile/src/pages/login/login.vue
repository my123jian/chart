<template>
    <table id="app">
        <tr>
            <td>
                <div class="layout">
                    <div class="left">
                        <div class="title"><span class="icon-text">蜂巢交通大数据平台</span></div>
                    </div>
                    <div class="right">
                        <div class="login-title"><span>欢迎登录</span></div>
                        <div class="login-user">
                            <span class="login-user-b-icon"></span>
                            <input type="text" placeholder="请输入用户名" v-model="userName"/>
                            <span class="login-user-a-icon"></span>
                        </div>
                        <div class="login-pwd">
                            <span class="login-pwd-b-icon"></span>
                            <input type="password" placeholder="请输入密码" v-model="userPwd"/>
                            <span class="login-pwd-a-icon"></span>
                        </div>
                        <div class="login-pwd login-code">
                            <!--<span class="login-pwd-b-icon"></span>-->
                            <input type="text" placeholder="请输入验证码" v-model="userCode"/>
                            <img :src="imgUrl" class="code-img" @click="changeImage"></img>
                        </div>
                        <div>
                            <div class="login-btn" @click="login">登录</div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>

    </table>
</template>

<script>
    import axios from "axios";

    export default {
        name: "login",
        data() {
            return {
                userName: '',//用户名
                userPwd: '',//用户密码
                userCode: '',//验证码
                imgUrl: '',
            }
        },
        components: {},
        mounted() {
            this.changeImage();
        },
        methods: {
            changeImage() {
                var theUrl = baseUrl + "gifCode.gif?data" + new Date();
                this.imgUrl = theUrl;
            },
            login() {
                if (!this.userName) {
                    alert("请输入用户名!");
                    return;
                }
                if (!this.userPwd) {
                    alert("请输入用户密码!");
                    return;
                }
                if (!this.userCode) {
                    alert("请输入验证码!");
                    return;
                }
                var theUrl1 = "/traffic/login";
                //近期热门迁徙路线
                var theUrl = window.baseUrl + theUrl1;
                var theQueryObj = {
                    userName: this.userName,
                    password: this.userPwd,
                    code: this.userCode
                };
                var me = this;
                axios.post(theUrl, window.toQuery(theQueryObj))
                    .then(function (response) {
                        var res = response.data;
                        if (res.code == 200) {
                            var theData = res.data;
                            setLoginData(res.data);
                            setLoginName(me.userName);
                            location.href = "qxdc.html";
                        }
                        else {
                            me.changeImage();
                            alert(res.message);
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        me.changeImage();
                        alert("登录失败");
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed
                    });
            }
        },
        watch: {}
    }
</script>

<style scoped>
    #app {
        width: 100%;
        height: 100%;
        background-image: url("../../images/login/整体背景.png");
        background-size: cover;
        background-repeat: no-repeat;
        text-align: center;
        /*line-height: 1080px;*/
    }

    .layout {
        width: 1920px;
        height: 1080px;
        position: relative;
        text-align: center;
        display: inline-block;
    }

    .code-img {
        width: 194px;
        /*height: 33px;*/
    }

    .left {
        width: 1684px;
        height: 857px;
        background-image: url("../../images/login/突出背景.png");
        background-size: 1684px 857px;
        position: absolute;
        left: 118px;
        /*line-height: 1080px;*/
        top: 111.5px;
        text-align: left;
        /*vertical-align: middle;*/
    }

    .right {
        width: 671px;
        height: 839px;
        top: 120.5px;
        right: 118px;
        background-image: url("../../images/login/登录背景.png");
        background-size: 671px 839px;
        position: absolute;
        text-align: center;
    }

    .right > * {
        display: block;

    }

    .title {
        background-image: url("../../images/login/标题下方光效.png");
        /*width: 426px;*/
        background-size: 426px 16px;
        background-position: bottom;
        font-size: 30px;
        color: white;
        height: 40px;
        background-repeat: no-repeat;
        margin-top: 34px;
        margin-left: 60px;
        padding-bottom: 20px;
        display: inline-block;
    }

    .icon-text {
        background-image: url("../../images/login/LOGO .png");
        background-size: 41px 33px;
        padding-left: 50px;
        background-position: left center;
        background-repeat: no-repeat;
    }

    .login-btn {
        width: 452px;
        height: 77px;
        color: white;
        font-size: 40px;
        line-height: 77px;
        background-image: url("../../images/login/登录按钮背景.png");
        background-size: 452px 77px;
        cursor: pointer;
        display: inline-block;
        margin-top: 70px;

    }

    .login-title {
        margin-top: 195px;
        margin-top: 155px;
        font-size: 36px;
        font-weight: bold;

    }

    .login-user {
        margin-top: 75px;
        height: 48px;
        line-height: 48px;
        width: 448px;
        font-size: 23px;
        color: #404142;
        display: inline-block;
        padding-bottom: 15px;
        border-bottom: #c5c5c5 1px solid;
    }

    .login-user input {
        width: 354px;
    }

    .login-user-b-icon {
        width: 26px;
        height: 48px;
        margin-right: 18px;
        background-size: contain;
        background-image: url("../../images/login/图层 4 拷贝.png");
        background-position: left bottom;
        background-repeat: no-repeat;
        display: inline-block;
    }

    .login-user-a-icon {
        background-size: contain;
        background-image: url("../../images/login/图层 4.png");
        width: 21px;
        height: 48px;
        display: inline-block;
        background-position: left bottom;
        background-repeat: no-repeat;
    }

    .login-pwd-b-icon {
        width: 26px;
        height: 48px;
        margin-right: 18px;
        background-size: contain;
        display: inline-block;
        background-image: url("../../images/login/图层 4 拷贝 3.png");
        background-position: left bottom;
        background-repeat: no-repeat;
    }

    .login-pwd-a-icon {
        background-size: contain;
        background-image: url("../../images/login/图层 5.png");
        width: 16px;
        height: 48px;
        display: inline-block;
        background-position: left bottom;
        background-repeat: no-repeat;
    }

    .login-pwd {
        margin-top: 50px;
        height: 48px;
        width: 448px;
        line-height: 48px;
        font-size: 23px;
        color: #3a5ddf;
        display: inline-block;
        padding-bottom: 15px;
        border-bottom: #c5c5c5 1px solid;
    }

    .login-pwd input {
        width: 359px;
    }

    .login-code input {
        width: 159px;
    }

    .login-title > span {
        border-bottom: #3a5ddf solid 4px;
        padding-bottom: 10px;
    }

    input {
        background: transparent;
        border: none;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        -o-appearance: none;
        appearance: none;
    }
</style>