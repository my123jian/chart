$(function () {
    //1、公路；2、民航；3、水路；4、铁路；5.其它
    //广东省内城市
    /*var theCitys = {
        "广州市": "113.264385,23.129112",
        "深圳市": "114.085947,22.547",
        "珠海市": "113.553986,22.224979",
        "汕头市": "116.708463,23.37102",
        "佛山市": "113.122717,23.028762",
        "韶关市": "113.597313,24.811094",
        "河源市": "114.697802,23.746266",
        "梅州市": "116.117582,24.299112",
        "惠州市": "114.412599,23.079404",
        "汕尾市": "115.364238,22.774485",
        "东莞市": "113.746262,23.046237",
        "中山市": "113.382391,22.521113",
        "江门市": "113.094942,22.590431",
        "阳江市": "111.982697,21.857415",
        "湛江市": "110.364977,21.274898",
        "茂名市": "110.919229,21.659751",
        "肇庆市": "112.472529,23.051546",
        "清远市": "113.051227,23.685022",
        "潮州市": "116.632301,23.661701",
        "揭阳市": "116.355733,23.543778",
        "云浮市": "112.044439,22.929801"
    };*/
    var theCitys = {
        "广州": "113.264385,23.129112",
        "深圳": "114.085947,22.547",
        "珠海": "113.553986,22.224979",
        "汕头": "116.708463,23.37102",
        "佛山": "113.122717,23.028762",
        "韶关": "113.597313,24.811094",
        "河源": "114.697802,23.746266",
        "梅州": "116.117582,24.299112",
        "惠州": "114.412599,23.079404",
        "汕尾": "115.364238,22.774485",
        "东莞": "113.746262,23.046237",
        "中山": "113.382391,22.521113",
        "江门": "113.094942,22.590431",
        "阳江": "111.982697,21.857415",
        "湛江": "110.364977,21.274898",
        "茂名": "110.919229,21.659751",
        "肇庆": "112.472529,23.051546",
        "清远": "113.051227,23.685022",
        "潮州": "116.632301,23.661701",
        "揭阳": "116.355733,23.543778",
        "云浮": "112.044439,22.929801"
    };
    //视图类型
    var ViewType = {
        OUT: 2,//迁出洞察
        IN: 1,//迁入洞察
        PROVINCE: 3//省内迁徙
    };
    //迁徙方向
    var DirectionType = {
        SHENG: 3,//省
        GAT: 2,//港澳台
        JW: 1//境外
    }
    //iframe 页面
    var PageNameDic = {
        "SHENG": "qxdc_province.html",
        "COUNTRY": "qxdc_country.html",
        "GAT": "qxdc_video.html",
        "JINGWAI": "qxdc_earth.html",
    }
    var theCurrentView = 2;
    var theDirection = DirectionType.SHENG;
    var theDirection1 = DirectionType.SHENG;
    var theDirection2 = DirectionType.SHENG;
    var isStopRefresh = true;
    var theTimer = null;
    var theCurrentDate = null;

    var theFromCityId = "from-city";
    var theToCityId = "to-city";

    //获取当前的日期数据
    var formateDate = function () {
        if (!theCurrentDate) {
            var theDate = new Date();
            return theDate.getFullYear() + "-" + (theDate.getMonth() + 1) + "-" + theDate.getDate();
        }
        return theCurrentDate.year + '-' + theCurrentDate.month + '-' + theCurrentDate.date;//
    }

    function PageViewModel() {
        this.initEvent();
        this.start();
        this.refresh();
    }

    PageViewModel.prototype = new PageViewBase();
    /**
     * 得到当前的视图格式
     * @returns {number}
     */
    PageViewModel.prototype.getCurrentView=function(){
        return theCurrentView;
    }
    /**
     * 初始化页面事件
     */
    PageViewModel.prototype.initEvent = function () {
        //debugger;
        var me = this;
        var tabNames = {'3': "省份", '2': "地区", '1': "国家"};
        var theParentContent = $('.tab-main').closest('.content');
        $('.tab-main .tab-item').click(function () {
            var theIndex = $(this).data('index');
            var theType = $(this).data('type');
            $('.tab-main .tab-item').removeClass('select');
            $(this).addClass('select');
            $(theParentContent).removeClass('content-img1');
            $(theParentContent).removeClass('content-img2');
            $(theParentContent).removeClass('content-img3');

            $(theParentContent).find('.part1').hide();
            $(theParentContent).find('.part2').hide();


            if (theIndex == 3) {
                //debugger;
                me.loadPage(PageNameDic.SHENG);
                $(theParentContent).find('.part-' + theIndex).show();
                $(theParentContent).addClass('content-img' + theIndex);
                me.switchView(ViewType.PROVINCE);

            }
            else {
                //debugger;
                if(theIndex==ViewType.IN){
                    if(theDirection1==DirectionType.JW){
                        me.loadPage(PageNameDic.JINGWAI);
                    }
                    else{
                        me.loadPage(PageNameDic.COUNTRY);
                    }

                }
                if(theIndex==ViewType.OUT)
                {
                    if(theDirection2==DirectionType.JW){
                        me.loadPage(PageNameDic.JINGWAI);
                    }
                    else{
                        me.loadPage(PageNameDic.COUNTRY);
                    }
                }

                me.switchView(theIndex);
                $(theParentContent).addClass('content-img' + theIndex);
                $(theParentContent).find('.part-' + theIndex).show();

            }

        });
        $('.tab-direction div').click(function () {
            $(this).closest('.tab-direction').find('div').removeClass('select');
            $(this).addClass('select');
            var theDirType = $(this).data('type');
            var theName = tabNames[theDirType];
            //debugger;

            if (theCurrentView != ViewType.PROVINCE) {
                if(theCurrentView==ViewType.IN){
                    if (theDirection1 != theDirType) {
                        theDirection1 = theDirType;
                        if (theDirType == DirectionType.JW) {
                            me.loadPage(PageNameDic.JINGWAI);
                        }
                        else {
                            me.loadPage(PageNameDic.COUNTRY);
                        }
                    }
                }
                if(theCurrentView==ViewType.OUT){
                    if (theDirection2 != theDirType) {
                        theDirection2 = theDirType;
                        if (theDirType == DirectionType.JW) {
                            me.loadPage(PageNameDic.JINGWAI);
                        }
                        else {
                            me.loadPage(PageNameDic.COUNTRY);
                        }
                    }
                }

            }

            $(this).closest('.part1').find('.hd-first').text(theName);
            if (theCurrentView == ViewType.IN) {
                //2,迁出 1.迁入
                //1.境外 2.港澳台 3省外
                //me.loadMigrantDirectType(ViewType.IN, theDirType, formateDate());

                me.loadInView(theCurrentView);
            }
            else if (theCurrentView == ViewType.OUT) {
                me.loadOutView(theCurrentView);
                //me.loadMigrantDirectType(ViewType.OUT, theDirType, formateDate());
            }
            else {
                //me.loadOutView(theCurrentView);
                me.loadMigrantDirectType(theCurrentView, null, formateDate());
            }
        });
        var theChartIndex = 0;
        $('.chart-item').each(function () {
            // debugger;
            var theData = $(this).data();
            if (theData['name']) {
                var theInstance = new ChartHuan(this, theChartIndex++);
                $(this).data('instance', theInstance);
            }
        });


        $('#date-action').click(function () {
            //$('#date-input').click();
            laydate.render({
                elem: '#date-input', //指定元素
                show: true,
                format: 'yyyy年MM月dd日',

            });
        });
        var me = this;
        laydate.render({
            elem: '#date-input', //指定元素
            trigger: 'click',
            format: 'yyyy年MM月dd日',
            //range: true,//范围选择
            value: new Date(),
            done: function (value, date, endDate) {
                //debugger;
                console.log('日期变化:' + value); //得到日期生成的值，如：2017-08-18
                console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (theCurrentDate != date) {
                    theCurrentDate = date;
                    // me.loadPredict();
                    me.refresh();
                }

            }
        });


        //初始化分页事件
        $('.page-item').click(function () {
            //debugger;
            $(this).siblings('.page-item').removeClass('select');
            $(this).addClass('select');
        });

        $('#' + theFromCityId + ",#" + theToCityId).each(function () {
            $(this).empty();
            $(this).append('<option value="">' + '请选择' + '</option>')
            for (var theCityName in theCitys) {
                $(this).append('<option value="' + theCityName + '">' + theCityName + '</option>')
            }
        });
        $('#' + theFromCityId + ",#" + theToCityId).change(function () {
            var theFromCityValue = $('#' + theFromCityId).val();
            var theToCityValue = $("#" + theToCityId).val();
            if ($.isEmptyObject(theFromCityValue) || $.isEmptyObject(theToCityValue)) {
                return;
            }

            if ($.isEmptyObject(theFromCityValue)) {
                alert("请选择来源城市!");
                return;
            }
            if ($.isEmptyObject(theToCityValue)) {
                alert("请选择目标城市!");
                return;
            }
            if (theFromCityValue == theToCityValue) {
                alert("来源城市和目标城市不能相同!");
                return;
            }
            me.loadMigrantChannelType(theCurrentView, formateDate(), theFromCityValue, theToCityValue);
        });
    }

    PageViewModel.prototype.loadPage = function (name) {
        $('#page_div').attr('src', name);
    }
    PageViewModel.prototype.refreshPage = function (data,type) {
        try {
            $('#page_div')[0].contentWindow.refresh(data,theCurrentView);
        }
        catch (e) {
            console.log(e);
        }

    }
    /**
     * 初始化视频地图
     */
    PageViewModel.prototype.initChartVideoMap = function () {

    }
    /**
     * 初始化国家地图
     */
    PageViewModel.prototype.initChartCountyMap = function () {


    }

    /**
     * 刷新当前的数据
     */
    PageViewModel.prototype.refresh = function () {
        this.loadMigrantType(formateDate());
        this.switchView(theCurrentView, true);
    }
    /***
     * 切换方向
     */
    PageViewModel.prototype.switchDirection = function () {

    }

    /***
     * 切换视图
     * @param viewName
     */
    PageViewModel.prototype.switchView = function (viewName, isrefresh) {
        if (theCurrentView == viewName && !isrefresh) {
            console.log("视图类型未改变" + viewName);
            return;
        }
        //debugger;
        //debugger;
        switch (viewName) {
            case ViewType.IN:
                theDirection = theDirection1|| DirectionType.SHENG;//设置为港澳台
                theCurrentView = viewName;

                this.loadInView(viewName);
                break;
            case  ViewType.OUT:
                theDirection = theDirection2|| DirectionType.SHENG;//设置为港澳台
                theCurrentView = viewName;
                this.loadOutView(viewName);
                break;
            case ViewType.PROVINCE:
                theDirection = DirectionType.SHENG;//设置为港澳台
                theCurrentView = viewName;
                this.loadProvinceView(viewName)
                break;
            default:
                console.log("视图类型错误:" + viewName);
                return;
        }
        var theDateString = formateDate();
        var fromCity = $(theFromCityId).val();
        var toCity = $(theToCityId).val();
        this.loadMigrantChannelType(theCurrentView, theDateString, fromCity, toCity);

    }

    /**
     * 加载迁出数据
     */
    PageViewModel.prototype.loadOutView = function (viewType) {
        var theDate = theCurrentDate;
        var theSelectDiv = $('.part-2');
        var theSubString = "迁出人数";
        var theSelectData = $(theSelectDiv).find('.tab-direction .select').data();
        var theTitle = theSelectData.name + theSubString;
        // this.loadMigrantOutType(formateDate());
        this.updateNum(theTitle, "");
        var me = this;
        this.loadMigrantDirectType(theCurrentView, theSelectData.type, formateDate());
        this.loadMigrantCountNum(theCurrentView, theSelectData.type, formateDate(), function (num) {
            me.updateNum(theTitle, num);
        });
    }
    /**
     * 加载迁入数据
     */
    PageViewModel.prototype.loadInView = function (viewType) {
        var theDate = theCurrentDate;
        var theSelectDiv = $('.part-1');
        var theSubString = "迁入人数";
        //this.loadMigrantFromSourceType(formateDate());
        var theSelectData = $(theSelectDiv).find('.tab-direction .select').data();
        var theTitle = theSelectData.name + theSubString;
        this.updateNum(theTitle, "");
        var me = this;
        this.loadMigrantDirectType(theCurrentView, theSelectData.type, formateDate());
        this.loadMigrantCountNum(theCurrentView, theSelectData.type, formateDate(), function (num) {
            me.updateNum(theTitle, num);
        });
    }
    /**
     * 加载省内数据
     */
    PageViewModel.prototype.loadProvinceView = function (viewType) {
        var theDate = theCurrentDate;
        var theSelectDiv = $('.part-3');
        var theTitle = "省内迁徙人数";
        //var theData = 111111111;
        this.updateNum(theTitle, "");
        var theCharts = {};
        $(theSelectDiv).find('.chart-item').each(function () {
            var theName = $(this).data('name');
            var theInstance = $(this).data('instance');
            theCharts[theName] = theInstance;
        });
        for (var key in theCharts) {
            theCharts[key].refresh('', (Math.random() * 100).toFixed(1))
        }
        this.loadMigrantDirectType(ViewType.PROVINCE, '', formateDate());
    }

    PageViewModel.prototype.updateNum = function (name, value) {
        $('.numpart .title').text(name);
        $('.numpart .num').text(((value || 0) / 10000).toFixed(1) + "万");
    }

    /***
     *迁徙类别分布人数 已过期
     * @param date 日期 yyyy-MM-dd
     * @param type 迁徙类别 1、迁入；2、迁出；3、省内迁徙
     */
    PageViewModel.prototype.loadMigrantTypeItem = function (date, migrantType) {
        var theUrl = "migrant/migrantType.do";
        var theData = {
            date: date,
            migrantType: migrantType
        };
        var me = this;
        console.log("开始获取迁徙类别分布人数", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束获取迁徙类别分布人数", res);
            if (res && res.isSuccess) {
                //debugger;
                var theData = res.data;//{"id":1,"migType":"1","num":"10000000","percentage":10,"statDate":"2018-12-10"}
                if (!theData) {
                    console.log("迁徙类别分布人数数据为空!");
                    return;
                }

                $('#num' + theData.migType).text((theData.num / 10000).toFixed(2));
                //debugger;
                if (theCurrentView == theData.migType) {
                    $('.numpart .num').text((theData.num / 10000).toFixed(2) + "万");

                }
            }
        })
    }

    /***
     * 迁入渠道人数比
     * @param date
     */
    PageViewModel.prototype.loadMigrantFromSourceType = function (date) {
        var theUrl = "migrant/migrantFromSourceType.do";
        var theData = {
            date: date
        };
        var me = this;
        var theSelectDiv = ".part-2";
        var theCharts = {};
        $(theSelectDiv).find('.chart-item').each(function () {
            var theName = $(this).data('id');
            var theInstance = $(this).data('instance');
            theCharts[theName] = theInstance;
        });
        for (var key in theCharts) {
            theCharts[key].refresh('', (0).toFixed(1))
        }
        console.log("开始获取迁入渠道人数比", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束迁入渠道人数比", res);
            //debugger;
            if (res && res.isSuccess) {
                var theData = res.data;//{"isSuccess":true,"msg":"success","data":[{"id":1,"inNum":"5000000","inPercentage":50,"inType":"1","statDate":"2018-12-10"},{"id":2,"inNum":"1000000","inPercentage":10,"inType":"2","statDate":"2018-12-10"},{"id":3,"inNum":"1000000","inPercentage":10,"inType":"3","statDate":"2018-12-10"},{"id":4,"inNum":"1000000","inPercentage":10,"inType":"4","statDate":"2018-12-10"},{"id":5,"inNum":"1000000","inPercentage":10,"inType":"5","statDate":"2018-12-10"}]}
                if (theData && theData.length > 0) {
                    for (var i = 0; i < theData.length; i++) {
                        var theItem = theData[i];
                        if (theCharts[theItem.inType]) {
                            theCharts[theItem.inType].refresh('', theItem.inPercentage);
                        }
                    }
                }
                else {
                    console.log("结果数据为空!");
                }
            }
        })
    }


    //最新的接口
    /***
     *迁徙类别分布人数 一次获取全部数据
     * @param date 日期 yyyy-MM-dd
     * @param type 迁徙类别 1、迁入；2、迁出；3、省内迁徙
     */
    PageViewModel.prototype.loadMigrantType = function (date) {
        var theUrl = "migrant/migrantType.do";
        var theData = {
            date: date,
            //migrantType: migrantType
        };
        var me = this;
        console.log("开始获取迁徙类别分布人数", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束获取迁徙类别分布人数", res);
            if (res && res.isSuccess) {
                //debugger;
                var theDefaultData = {
                    "1": 0,
                    "2": 0,
                    "3": 0
                };
                var theDatas = res.data;//{"id":1,"migType":"1","num":"10000000","percentage":10,"statDate":"2018-12-10"}
                if (!theDatas || theDatas.length <= 0) {
                    console.log("迁徙类别分布人数数据为空!");
                    //return;
                }
                for (var i = 0; i < theDatas.length; i++) {
                    var theData = theDatas[i];
                    theDefaultData[theData.migType] = theData.num ;//.toFixed(2);
                }
                //debugger;
                for (var key in theDefaultData) {
                    $('#num' + key).text((theDefaultData[key] / 10000).toFixed(2));
                    //debugger;
                    if (theCurrentView == key) {
                        $('.numpart .num').text((theDefaultData[key] / 10000).toFixed(2) + "万");

                    }
                }

            }
        })
    }
    /***
     * 迁出渠道人数比
     * @param date
     */
    PageViewModel.prototype.loadMigrantOutType = function (date) {
        var theUrl = "migrant/migrantOutType.do";
        var theData = {
            date: date
        };
        var me = this;
        var theCharts = {};
        var theSelectDiv = ".part-1";
        $(theSelectDiv).find('.chart-item').each(function () {
            var theName = $(this).data('id');
            var theInstance = $(this).data('instance');
            theCharts[theName] = theInstance;
        });
        for (var key in theCharts) {
            theCharts[key].refresh('', (0).toFixed(1))
        }
        console.log("开始获取迁出渠道人数比", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束获取迁出渠道人数比", res);
            if (res && res.isSuccess) {
                // debugger;
                var theData = res.data;//{"isSuccess":true,"msg":"success","data":[{"id":1,"outNum":"1000000","outPercentage":10,"outType":1,"statDate":"2018-12-10"},{"id":2,"outNum":"5000000","outPercentage":50,"outType":2,"statDate":"2018-12-10"},{"id":3,"outNum":"1000000","outPercentage":10,"outType":3,"statDate":"2018-12-10"},{"id":4,"outNum":"1000000","outPercentage":10,"outType":4,"statDate":"2018-12-10"},{"id":5,"outNum":"1000000","outPercentage":10,"outType":5,"statDate":"2018-12-10"}]}
                if (theData && theData.length > 0) {
                    for (var i = 0; i < theData.length; i++) {
                        var theItem = theData[i];
                        if (theCharts[theItem.outType]) {
                            theCharts[theItem.outType].refresh('', theItem.outPercentage);
                        }
                    }
                }
                else {
                    console.log("返回结果为空!");
                }

            }
        })
    }
    /***
     * 迁徙洞察模块 渠道占比统计 环形图
     * @param seeType 洞察类型 :1,迁入 2.迁出，3 省内
     * @param date 日期
     * @param fromCity 城市出发地(仅限省内迁徙填写)
     * @param toCity 城市到达地(仅限省内迁徙填写)
     */
    PageViewModel.prototype.loadMigrantChannelType = function (seeType, date, fromCity, toCity) {
        var theUrl = "migrant/migrantChannelType.do";
        var theData = {
            seeType: seeType,
            date: date,
            fromCity: fromCity,
            toCity: toCity
        };

        var me = this;
        var theCharts = {};
        var theSelectDiv = ".part-" + seeType;
        $(theSelectDiv).find('.chart-item').each(function () {
            var theName = $(this).data('id');
            var theInstance = $(this).data('instance');
            theCharts[theName] = theInstance;
        });
        for (var key in theCharts) {
            theCharts[key].refresh('', (0).toFixed(1))
        }

        console.log("开始迁徙洞察模块 渠道占比统计", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束迁徙洞察模块 渠道占比统计", res);
            if (res && res.isSuccess) {
                //debugger;
                var theData = res.data;//{"isSuccess":true,"msg":"success","data":[{"id":1,"outNum":"1000000","outPercentage":10,"outType":1,"statDate":"2018-12-10"},{"id":2,"outNum":"5000000","outPercentage":50,"outType":2,"statDate":"2018-12-10"},{"id":3,"outNum":"1000000","outPercentage":10,"outType":3,"statDate":"2018-12-10"},{"id":4,"outNum":"1000000","outPercentage":10,"outType":4,"statDate":"2018-12-10"},{"id":5,"outNum":"1000000","outPercentage":10,"outType":5,"statDate":"2018-12-10"}]}
                if (seeType == 3){
                    $('#direction-num').text(0);
                }
                if (theData && theData.length > 0) {
                    var theDataList = theData;
                    if (seeType == 3) {
                        theDataList = theData && theData.length > 0 ? theData[0].list : [];
                        $('#direction-num').text(theData[0].countNum || 0);
                        //debugger;
                    }
                    for (var i = 0; i < theDataList.length; i++) {
                        var theItem = theDataList[i];
                        if (theCharts[theItem.outType || theItem.inType || theItem.migChannel]) {
                            theCharts[theItem.outType || theItem.inType || theItem.migChannel].refresh('', (theItem.outPercentage || theItem.inPercentage || theItem.oPercentage));
                        }
                    }
                }
                else {
                    console.log("返回结果为空!");
                }

            }
        })
    }
    /***
     * 统计迁入迁出 中的省外,港澳台,境外人数总人数
     * @param seeType 洞察类型 :1,迁入 2.迁出
     * @param sourceType 离开或者来源类型:1.境外 2.港澳台 3省外
     * @param date 日期
     */
    PageViewModel.prototype.loadMigrantCountNum = function (seeType, sourceType, date, callback) {
        var theUrl = "migrant/migrantCountNum.do";
        var theData = {
            seeType: seeType,
            sourceType: sourceType,
            date: date,
        };

        var me = this;


        console.log("开始统计迁入迁出 中的省外,港澳台,境外人数总人数", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束统计迁入迁出 中的省外,港澳台,境外人数总人数", res);
            if (res && res.isSuccess) {
                // debugger;
                var theData = res.data;//{"isSuccess":true,"msg":"success","data":[{"id":1,"outNum":"1000000","outPercentage":10,"outType":1,"statDate":"2018-12-10"},{"id":2,"outNum":"5000000","outPercentage":50,"outType":2,"statDate":"2018-12-10"},{"id":3,"outNum":"1000000","outPercentage":10,"outType":3,"statDate":"2018-12-10"},{"id":4,"outNum":"1000000","outPercentage":10,"outType":4,"statDate":"2018-12-10"},{"id":5,"outNum":"1000000","outPercentage":10,"outType":5,"statDate":"2018-12-10"}]}
                if (theData) {
                    var theNumer = theData.countNum || 0;
                    callback && callback(theNumer);
                }
                else {
                    console.log("返回结果为空!");
                }

            }
        })
    }
    /***
     * 迁徙洞察模块 去向或者来源查询 表格数据查询
     * @param seeType 洞察类型 :2,迁出 1.迁入 3.省内
     * @param sourceType 离开或者来源类型:1省外, 2.港澳台 3.境外
     * @param date
     */
    PageViewModel.prototype.loadMigrantDirectType = function (seeType, sourceType, date) {
        var theUrl = "migrant/migrantDirectType.do";
        var theData = {
            seeType: seeType,
            sourceType: sourceType,
            date: date
        };
        this.currentTable = [];
        // debugger;
        var me = this;
        console.log("开始获取迁出渠道人数比", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束获取迁出渠道人数比", res);
            if (res && res.isSuccess) {
                var theData = res.data;
                console.log(theData);
                theData = theData || [];
                var theTableList = [];
                var theChannelMap = {
                    "1": "gonglu",
                    "2": "minhang",
                    "3": "shuilu",
                    "4": "tielu",
                    "5": "qita",
                };

                for (var i = 0; i < theData.length; i++) {
                    var theDataItem = theData[i];
                    var theRow = {
                        "gonglu": 0,
                        "minhang": 0,
                        "shuilu": 0,
                        "tielu": 0,
                        "qita": 0,
                        "from": seeType == ViewType.OUT ? "广州" : "",
                        "to": seeType == ViewType.IN ? "广州" : "",
                        'type': seeType,
                        "sourceType": sourceType,
                        "value": 0
                    };
                    theRow['area'] = theDataItem.area;
                    if (seeType == ViewType.OUT) {
                        theRow['to'] = me.getProvinceCity(theDataItem.area);
                    }
                    else if (seeType == ViewType.IN) {
                        theRow['from'] = me.getProvinceCity(theDataItem.area);
                    }
                    else {
                        //debugger;
                        var theCitys = theDataItem.area.split('-');
                        theRow['from'] = theCitys[0];
                        theRow['to'] = theCitys[1];
                    }
                    /*
                    * fromCity: "广州"
id: 1
migChannel: "1"
migNum: 10000000
oPercentage: "81"
statDate: "2018-12-10"
toCity: "深圳"
                    * */
                    theRow['num'] = theDataItem.countNum;

                    for (var j = 0; j < theDataItem.list.length; j++) {
                        var theCellItem = theDataItem.list[j];
                        theRow[theChannelMap[theCellItem.outChannel || theCellItem.inChannel || theCellItem.migChannel]] = (theCellItem.outPercentage || theCellItem.inPercentage || theCellItem.oPercentage);
                    }
                    theTableList.push(theRow);
                }
                var theIndex = seeType;
                me.currentTable = theTableList;
                me.refreshPage(me.currentTable,theCurrentView)
                me.loadTemplateTable('table-' + theIndex, theTableList);
            }
        })
    }
    ///
    ///date,fromCity,toCity,seeType//数据占比统计
    window.PageView = new PageViewModel();
})