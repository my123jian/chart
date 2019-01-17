$(function () {
    var theCurrentDate = "";

    var ViewType = {
        OUT: 2,//迁出洞察
        IN: 1,//迁入洞察
        PROVINCE: 3//省内迁徙
    };
    var theCurrentView = ViewType.OUT;
    var seeType = ViewType.OUT;
    //迁徙方向
    var DirectionType = {
        SHENG: 3,//省
        GAT: 2,//港澳台
        JW: 1//境外
    };
    var AreaMap = [
        {
            "name": "广州",
            "code": "GZ",
        },
        {
            "name": "深圳",
            "code": "SZ",

        },
        {
            "name": "珠海",
            "code": "ZH",

        },
        {
            "name": "汕头",
            "code": "ST",

        },
        {
            "name": "韶关",
            "code": "SG",

        },
        {
            "name": "佛山",
            "code": "FS",

        },
        {
            "name": "江门",
            "code": "JM",

        },
        {
            "name": "湛江",
            "code": "ZJ",

        },
        {
            "name": "茂名",
            "code": "MM",

        },
        {
            "name": "肇庆",
            "code": "ZQ",

        },
        {
            "name": "惠州",
            "code": "HZ",

        },
        {
            "name": "梅州",
            "code": "MZ",

        },
        {
            "name": "汕尾",
            "code": "SW",

        },
        {
            "name": "河源",
            "code": "HY",

        },
        {
            "name": "阳江",
            "code": "YJ",

        },
        {
            "name": "清远",
            "code": "QY",

        },
        {
            "name": "东莞",
            "code": "DG",

        },
        {
            "name": "中山",
            "code": "ZS",

        },
        {
            "name": "潮州",
            "code": "CZ",

        },
        {
            "name": "揭阳",
            "code": "JY",

        },
        {
            "name": "云浮",
            "code": "YF",

        }
    ];

    function FormateDateNum(num) {
        var theValue = num + "";
        if (theValue.length == 0) {
            return '00';
        }
        if (theValue.length == 1) {
            return '0' + num;
        }
        return num;
    }

    /*
    得到今天的日期
    */
    function GetTodayDate() {
        return new Date();
    }

    /*格式化年月日日期*/
    Date.prototype.formate = function () {
        return this.getFullYear() + "-" + FormateDateNum(this.getMonth() + 1) + "-" + FormateDateNum(this.getDate());
    }
    /*格式化年月日日期中文*/
    Date.prototype.formateCN = function () {
        return this.getFullYear() + "年" + FormateDateNum(this.getMonth() + 1) + "月" + FormateDateNum(this.getDate()) + '日';
    }
    /*前几天*/
    Date.prototype.before = function (num) {
        this.setDate(this.getDate() - (num || 0));
        return this;
    };
    /*
    后几天
    * */
    Date.prototype.next = function (num) {
        this.setDate(this.getDate() + (num || 0));
        return this;
    }
    /**
     * 相邻之间的日期间隔
     * @param date1
     * @param date2
     * @returns {number}
     */
    Date.daysBetween = function (date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    function formateDate() {
        if (!theCurrentDate) {
            return (new Date()).before(3).formate();
        }
        return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
    }

    function getProvinceCity(province) {
        var theShengs =
            {
                "北京市": "北京",
                "北京": "北京",
                "天津市": "天津",
                "天津": "天津",
                "上海市": "上海",
                "上海": "上海",
                "重庆市": " 重庆",
                "重庆": " 重庆",
                "河北省": "石家庄",
                "山西省": "太原",
                "陕西省": " 西安",
                "山东省": " 济南",
                "河南省": "郑州",
                "辽宁省": " 沈阳",
                "吉林省": " 长春",
                "黑龙江省": " 哈尔滨",
                "江苏省": "南京",
                "浙江省": "杭州",
                "安徽省": "合肥",
                "江西省": "南昌",
                "福建省": "福州",
                "湖北省": "武汉",
                "湖南省": "长沙",
                "四川省": "成都",
                "贵州省": "贵阳",
                "云南省": "昆明",
                "广东省": "广州",
                "海南省": "海口",
                "甘肃省": "兰州",
                "青海省": "西宁",
                "台湾省": "台北",
                "内蒙古自治区": "呼和浩特",
                "内蒙古": "呼和浩特",
                "新疆维吾尔自治区": "乌鲁木齐",
                "新疆": "乌鲁木齐",
                "西藏自治区": "拉萨",
                "西藏": "拉萨",
                "广西壮族自治区": "南宁",
                "广西": "南宁",
                "宁夏回族自治区": "银川",
                "宁夏": "银川",
                "香港特别行政区": "香港",
                "香港": "香港",
                "澳门特别行政区": "澳门",
                "澳门": "澳门"
            };

        return theShengs[province] || theShengs[province + '省'];

    }

    function getCityNameByCode(cityCode) {
        //return cityCode;
        for (var i = 0; i < AreaMap.length; i++) {
            var theItem = AreaMap[i];
            if (theItem.code == cityCode) {
                return theItem.name;
            }
        }

        return cityCode;
    }

    function load(url, argment, callback, emal) {
        console.log("访问地址：" + url);
        console.log("访问参数:" + argment);
        if (!url) {
            console.log("访问地址不能为空：");
            return;
        }
        if (emal) {
            callback && callback();
            return;
        }
        url = serviceBase + url;
        loadInner(url, argment, callback);
    }

    function loadInner(url, argment, callback) {
        console.log("访问地址：" + url);
        console.log("访问参数:" + argment);
        if (!url) {
            console.log("访问地址不能为空：");
            return;
        }
        //url = this.serviceBase + url;
        argment = argment || {};
        $.ajax({
            url: url,
            cache: false,
            type: 'post',
            timeout: 10000,
            data: argment,
            success: function (r) {
                if (typeof(r) == "string") {
                    r = JSON.parse(r);
                }
                if (callback) {
                    callback(r);
                }
                console.log("访问成功:" + r);
            },
            error: function (r) {
                if (callback) {
                    callback(r);
                }
                console.log('访问失败' + r);
            }

        });
    }

    function refreshPage(data, type, selectItem) {
        try {
            $('#inner-page')[0].contentWindow.refresh(data, theCurrentView, selectItem);
        }
        catch (e) {
            console.log(e);
        }

    }

    var formateDate1 = function () {
        if (!theCurrentDate) {
            var theDate = GetTodayDate().before(3);// GetFromDate();
            //theDate.setDate(theDate.getDate()-1);
            return theDate.getFullYear() + "年" + FormateDateNum(theDate.getMonth() + 1) + "月" + FormateDateNum(theDate.getDate()) + '日';
        }
        return theCurrentDate.year + '-' + FormateDateNum(theCurrentDate.month) + '-' + FormateDateNum(theCurrentDate.date);//
    }

    //迁出
    function loadMigrantDirectType(seeType, sourceType, date) {
        var theUrl = "migrant/migrantDirectType.do";
        var theData = {
            seeType: seeType,
            sourceType: sourceType,
            date: date
        };
        window.currentTable = [];

        load(theUrl, theData, function (res) {
            console.log("结束获取迁出渠道人数比", res);
            //debugger;
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

                var theRowMap = {};
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
                    //debugger;
                    if (seeType == ViewType.OUT) {
                        theRow['to'] = getProvinceCity(theDataItem.area);
                        theRow['area'] = "广东----"+theDataItem.area;
                    }
                    else if (seeType == ViewType.IN) {
                        theRow['from'] = getProvinceCity(theDataItem.area);
                    }
                    else {
                        //debugger;
                        var theCitys = theDataItem.area.split('-');
                        theDataItem.area = getCityNameByCode(theCitys[0]) + '----' + getCityNameByCode(theCitys[1]);
                        theRow['area'] = theDataItem.area;
                        theRow['from'] = theCitys[0];
                        theRow['to'] = theCitys[1];
                    }

                    theRow['num'] = theDataItem.countNum;

                    for (var j = 0; j < theDataItem.list.length; j++) {
                        var theCellItem = theDataItem.list[j];

                        theRow[theChannelMap[theCellItem.outChannel || theCellItem.inChannel || theCellItem.migChannel]] = ((theCellItem.outPercentage || theCellItem.inPercentage || theCellItem.oPercentage || 0) * 100).toFixed(2);
                        //debugger;

                    }
                    theTableList.push(theRow);
                }
                var theIndex = seeType;
                window.currentTable = theTableList;
                if (seeType == ViewType.PROVINCE) {
                    refreshPage(window.currentTable, theCurrentView, null);
                }
                else {
                    refreshPage(window.currentTable, theCurrentView, null);
                }

                $('#col1-list').empty();
                $('.col2 ul').empty();
                $('.col3 ul').empty();


                if (theTableList && theTableList.length > 0) {
                    for (var i = 0; i < theTableList.length; i++) {
                        var theRow = theTableList[i];
                        var theNum = (theRow.value || theRow.num || 0);
                        if (theNum > 1000) {
                            theNum = (theNum / 10000).toFixed(2) + '万';
                        }
                        $('#col1-list').append($(' <li>\n' +
                            '              <i>' + (i + 1) + '</i>\n' +
                            '              <span>' + theRow.area + '</span>\n' +
                            '            </li>'));
                        $('.col2 ul').append($('<li>' + theNum + '</li>'));

                        $('.col3 ul').append($('<li>\n' +
                            '                <section>\n' +
                            '                  <div class="pillar" style="width:' + theRow.tielu + 'px"></div>\n' +
                            '                  <div class="num">' + theRow.tielu + '%</div>\n' +
                            '                </section>\n' +
                            '                <section>\n' +
                            '                  <div class="pillar" style="width:' + theRow.gonglu + 'px"></div>\n' +
                            '                  <div class="num">' + theRow.gonglu + '%</div>\n' +
                            '                </section>\n' +
                            '                <section>\n' +
                            '                  <div class="pillar" style="width:' + theRow.shuilu + 'px"></div>\n' +
                            '                  <div class="num" style="width:px">' + theRow.shuilu + '%</div>\n' +
                            '                </section>\n' +
                            '                <section>\n' +
                            '                  <div class="pillar" style="width:' + theRow.minhang + 'px"></div>\n' +
                            '                  <div class="num" style="width:px">' + theRow.minhang + '%</div>\n' +
                            '                </section>\n' +
                            '              </li>'));
                    }
                }
                //me.loadTemplateTable('table-' + theIndex, theTableList);
            }
        })
    }

    function tabClick() {
        $('#domestic').on('click', function () {
            $('#inner-page').attr('src', 'h5_country.html');
            $('.tab-box div').removeClass('active');
            loadMigrantDirectType(ViewType.OUT, DirectionType.SHENG, formateDate());
            seeType = ViewType.OUT;
            theCurrentView = ViewType.OUT;
            $(this).addClass('active');
            $('.tab-title').html('国内迁徙');
        });
        $('#province').on('click', function () {
            $('#inner-page').attr('src', 'h5_province.html');
            $('.tab-box div').removeClass('active');
            loadMigrantDirectType(ViewType.PROVINCE, DirectionType.SHENG, formateDate());
            $(this).addClass('active');
            seeType = ViewType.PROVINCE;
            theCurrentView = ViewType.PROVINCE;
            $('.tab-title').html('省内迁徙');
        });
        $('.btm-box-header section').click(function () {
            if ($(this).hasClass('active')) {
                return;
            }
            $('.btm-box-header section').removeClass('active');
            $(this).addClass('active');
        });

    }

    $('#document').ready(function () {
        // getEchartsC();
        // initChartMap();
        laydate.render({
            elem: '#date', //指定元素
            trigger: 'click',
            format: 'yyyy年MM月dd日',
            value: formateDate1(),
            max: GetTodayDate().formate(),
            done: function (value, date, endDate) {

                if (theCurrentDate != date) {
                    theCurrentDate = date;
                    //me.loadPredict();
                    loadMigrantDirectType(seeType, DirectionType.SHENG, formateDate());
                }

            }
        });
        tabClick();
        loadMigrantDirectType(ViewType.OUT, DirectionType.SHENG, formateDate());
    });
})