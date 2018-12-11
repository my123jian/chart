$(function () {
    //1、公路；2、民航；3、水路；4、铁路；5.其它
    //广东省内城市
    var theCitys = {
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
    };
    //视图类型
    var ViewType = {
        OUT: 2,//迁出洞察
        IN: 1,//迁入洞察
        PROVINCE: 3//省内迁徙
    };
    //迁徙方向
    var DirectionType = {
        SHENG: "SHENG",//省
        GAT: "GAT",//港澳台
        JW: "JW"//境外
    }
    var PageNameDic = {
        "SHENG": "qxdc_province.html",
        "COUNTRY": "qxdc_country.html",
        "GAT": "qxdc_video.html",
        "JINGWAI": "qxdc_video.html",
    }
    var theCurrentView = 2;
    var theDirection = DirectionType.SHENG;
    var isStopRefresh = true;
    var theTimer = null;
    var theCurrentDate = null;

    var theFromCityId = "from-city";
    var theToCityId = "to-city";

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
        // debugger;
        this.refresh();
    }

    PageViewModel.prototype = new PageViewBase();
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
            $('.tab-main .tab-item').addClass('select');
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
                me.loadPage(PageNameDic.COUNTRY);
                //debugger;
                if (theIndex == 2) {
                   // debugger;
                    me.switchView(ViewType.OUT);
                    $(theParentContent).addClass('content-img' + 1);
                    $(theParentContent).find('.part-1').show();
                }
                else {
                    me.switchView(ViewType.IN);
                    $(theParentContent).addClass('content-img' + 2);
                    $(theParentContent).find('.part-2').show();
                }

            }

        });
        $('.tab-direction div').click(function () {
            $(this).closest('.tab-direction').find('div').removeClass('select');
            $(this).addClass('select');
            var theDirType = $(this).data('type');
            var theName = tabNames[theDirType];
            //debugger;
            $(this).closest('.part1').find('.hd-first').text(theName);
            if (theCurrentView == ViewType.IN) {
                //2,迁出 1.迁入
                //1.境外 2.港澳台 3省外
                me.loadMigrantDirectType(ViewType.IN, theDirType, formateDate());
                //me.loadInView(theCurrentView);
            }
            else if (theCurrentView == ViewType.OUT) {
                me.loadMigrantDirectType(ViewType.OUT, theDirType, formateDate());
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
            for (var theCityName in theCitys) {
                $(this).append('<option value="' + theCityName + '">' + theCityName + '</option>')
            }
        });
    }

    PageViewModel.prototype.loadPage = function (name) {

        $('#page_div').attr('src', name);
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
        switch (viewName) {
            case ViewType.IN:
                theDirection = DirectionType.SHENG;//设置为港澳台
                theCurrentView = viewName;
                this.loadInView(viewName);
                break;
            case  ViewType.OUT:
                theDirection = DirectionType.SHENG;//设置为港澳台
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
        this.loadMigrantType(theDateString, theCurrentView);

    }

    /**
     * 加载迁出数据
     */
    PageViewModel.prototype.loadOutView = function (viewType) {
        var theDate = theCurrentDate;
        var theSelectDiv = $('.part-1');
        var theSubString = "迁出人数";
        var theSelectData = $(theSelectDiv).find('.tab-direction .select').data();
        var theTitle = theSelectData.name + theSubString;
        this.loadMigrantOutType(formateDate());
        this.updateNum(theTitle, "");
        this.loadMigrantDirectType(theCurrentView, theSelectData.type, formateDate());
    }
    /**
     * 加载迁入数据
     */
    PageViewModel.prototype.loadInView = function (viewType) {
        var theDate = theCurrentDate;
        var theSelectDiv = $('.part-2');
        var theSubString = "迁入人数";
        this.loadMigrantFromSourceType(formateDate());
        var theSelectData = $(theSelectDiv).find('.tab-direction .select').data();
        var theTitle = theSelectData.name + theSubString;
        this.updateNum(theTitle, "");
        this.loadMigrantDirectType(theCurrentView, theSelectData.type, formateDate());
    }
    /**
     * 加载省内数据
     */
    PageViewModel.prototype.loadProvinceView = function (viewType) {
        var theDate = theCurrentDate;
        var theSelectDiv = $('.part-3');
        var theTitle = "省内迁徙人数";
        //var theData = 111111111;
        //this.updateNum(theTitle, theData);
        var theCharts = {};
        $(theSelectDiv).find('.chart-item').each(function () {
            var theName = $(this).data('name');
            var theInstance = $(this).data('instance');
            theCharts[theName] = theInstance;
        });
        for (var key in theCharts) {
            theCharts[key].refresh('', (Math.random() * 100).toFixed(1))
        }
        this.loadMigrantDirectType(ViewType.SHENG, '', formateDate());
    }

    PageViewModel.prototype.updateNum = function (name, value) {
        $('.numpart .title').text(name);
        $('.numpart .num').text(((value || 0) / 10000).toFixed(1) + "万");
    }
    /***
     *迁徙类别分布人数
     * @param date 日期 yyyy-MM-dd
     * @param type 迁徙类别 1、迁入；2、迁出；3、省内迁徙
     */
    PageViewModel.prototype.loadMigrantType = function (date, migrantType) {
        this.loadMigrantTypeItem(date, 1);
        this.loadMigrantTypeItem(date, 2);
        this.loadMigrantTypeItem(date, 3);
    }
    /***
     *迁徙类别分布人数
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
     * 迁徙洞察模块 去向或者来源查询
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
        var me = this;
        console.log("开始获取迁出渠道人数比", theData);
        this.load(theUrl, theData, function (res) {
            console.log("结束获取迁出渠道人数比", res);
            if (res && res.isSuccess) {
                //debugger;
                /*
                * id: 1
 inChannel: 1
 inNum: "1000000"
 inPercentage: 10
 inProvince: "广东"
 statDate: "2018-12-10"
                * */
                var theData = res.data;//{"data":[{"id":1,"inNum":"5000000","inPercentage":50,"inType":"1","statDate":"2018-12-10"},{"id":2,"inNum":"1000000","inPercentage":10,"inType":"2","statDate":"2018-12-10"},{"id":3,"inNum":"1000000","inPercentage":10,"inType":"3","statDate":"2018-12-10"},{"id":4,"inNum":"1000000","inPercentage":10,"inType":"4","statDate":"2018-12-10"},{"id":5,"inNum":"1000000","inPercentage":10,"inType":"5","statDate":"2018-12-10"}],"isSuccess":true,"msg":"success"}
                console.log(theData);
                theData = theData || [];

                var theIndex = seeType;
                if (theIndex == ViewType.OUT) {
                    theIndex = 1;
                }
                else if (theIndex == ViewType.IN) {
                    theIndex = 2;
                }
                //debugger;
                me.loadTemplateTable('table-' + theIndex, theData);
            }
        })
    }
    ///
    window.PageView = new PageViewModel();
})