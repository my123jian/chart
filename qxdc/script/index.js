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
    var theCurrentDate = null;

    function PageViewModel() {
        this.initEvent();
        this.start();
    }

    PageViewModel.prototype = new PageViewBase();
    /**
     * 初始化页面事件
     */
    PageViewModel.prototype.initEvent = function () {
        //debugger;
        var theParentContent = $('.tab-main').closest('.content');
        $('.tab-main .tab-item').click(function () {
            var theIndex = $(this).data('index');
            $('.tab-main .tab-item').removeClass('select');
            $('.tab-main .tab-item').addClass('select');
            $(theParentContent).removeClass('content-img1');
            $(theParentContent).removeClass('content-img2');
            $(theParentContent).removeClass('content-img3');
            $(theParentContent).addClass('content-img' + theIndex);
            $(theParentContent).find('.part1').hide();
            $(theParentContent).find('.part2').hide();
            $(theParentContent).find('.part-' + theIndex).show();
        });
        $('.tab-direction div').click(function () {
            $('.tab-direction div').removeClass('select');
            $(this).addClass('select');
        });
        var theChartIndex = 0;
        $('.chart-item').each(function () {
            // debugger;
            var theData = $(this).data();
            if (theData['name']) {
                new ChartHuan(this, theChartIndex++);
            }
        });

        $('#date-action').click(function () {
            //$('#date-input').click();
            laydate.render({
                elem: '#date-input', //指定元素
                show: true
            });
        });
        var me = this;
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            value: new Date(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate != date) {
                    theCurrentDate = date;
                    me.loadPredict();
                }

            }
        });
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