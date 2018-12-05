$(function () {
    var theIntervals = 1000 * 60 * 5;
    //视图类型
    var ViewType = {
        OUT: "OUT",//迁出洞察
        IN: "IN",//迁入洞察
        PROVINCE: "PROVINCE"//省内迁徙
    };
    //迁徙方向
    var DirectionType = {
        SHENG: "SHENG",//省
        GAT: "GAT",//港澳台
        JW: "JW"//境外
    }
    var theCurrentView = "";
    var theDirection = "";
    var isStopRefresh = true;
    var theTimer = null;

    function PageViewModel() {
        this.initEvent();
        this.start();
    }

    PageViewModel.prototype=new PageViewBase();
    /**
     * 初始化页面事件
     */
    PageViewModel.prototype.initEvent = function () {

    }
    /**
     * 开始自动查询数据
     */
    /*PageViewModel.prototype.start = function () {
        if (isStopRefresh) {
            isStopRefresh = false;
        }
        else {
            return;
        }
        var me = this;
        theTimer = window.setInterval(function () {
            me.refresh();
        }, theIntervals);
    }*/
    /**
     * 停止查询数据
     */
   /* PageViewModel.prototype.stop = function () {
        if (theTimer) {
            window.clearInterval(theTimer);
            theTimer = null;
        }
    }*/
    /**
     * 刷新当前的数据
     */
    PageViewModel.prototype.refresh = function () {

    }
    /***
     * 切换方向
     */
    PageViewModel.prototype.switchDirection = function () {

    }
    /**
     * 迁出视图
     */
    PageViewModel.prototype.initInView = function () {

    }
    /**
     * 迁入视图
     */
    PageViewModel.prototype.initOutView = function () {

    }
    /**
     * 省内视图
     */
    PageViewModel.prototype.initProvinceView = function () {

    }
    /***
     * 切换视图
     * @param viewName
     */
    PageViewModel.prototype.switchView = function (viewName) {
        if (theCurrentView == viewName) {
            console.log("视图类型未改变" + viewName);
            return;
        }
        switch (viewName) {
            case ViewType.IN:
                theDirection = DirectionType.SHENG;//设置为港澳台
                theCurrentView = viewName;
                this.initInView();
                break;
            case  ViewType.OUT:
                theDirection = DirectionType.SHENG;//设置为港澳台
                theCurrentView = viewName;
                this.initOutView();
                break;
            case ViewType.PROVINCE:
                theDirection = DirectionType.SHENG;//设置为港澳台
                theCurrentView = viewName;
                this.initProvinceView();
                break;
            default:
                console.log("视图类型错误:" + viewName);
                return;
        }

    }
    window.PageView = new PageViewModel();
})