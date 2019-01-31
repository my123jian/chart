/**
 * 视图的基类添加定时刷新和数据获取的支持
 * @constructor
 */
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
/***
 * 后几分钟
 * @param num
 * @returns {Date}
 */
Date.prototype.nextMinutes = function (num) {
    this.setMinutes(this.getMinutes() + (num || 0));
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
/*
概况：3号下午跑1号的数据
* 琼州海峡：3号下午跑1号的数据
港珠澳大桥：3号2号的数据
琼州海峡：  8号早上跑6号的数据(8号早上看6号数据，延迟2天)
港珠澳大桥：8号早上跑7号的数据(8号早上看7号数据，延迟1天)
* */
var theDefineDate = {
    "qxjc.html": '2019-01-01',
    "qzhx.html": "2019-01-01",
    "gzadq.html": "2019-01-02",
};
var theDefineDateDays = {
    //"qzhx.html": 5,
    //"gzadq.html": 5,
    //"qxdc.html": 3
}

function GetFromDate() {
    //debugger;
    var theLocationName = location.pathname;
    var theDate = new Date();
    if (theLocationName) {
        var theName = theLocationName.substr(theLocationName.lastIndexOf('/') + 1);
        if (theDefineDateDays[theName]) {
            //return new Date(theDefineDate[theName]);
            theDate.setDate(theDate.getDate() - theDefineDateDays[theName]);
        }
    }

    //theDate.setDate(theDate.getDate() - 2);
    return theDate;
}


function GetYesterdayDate() {
    //debugger;
    var theLocationName = location.pathname;
    /*if(theLocationName){
        var theName=theLocationName.substr(theLocationName.lastIndexOf('/')+1);
        if(theDefineDate[theName]){
            return new Date(theDefineDate[theName]);
        }
    }*/
    var theDate = GetFromDate();
    theDate.setDate(theDate.getDate() - 1);
    return theDate;
}

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

function PageViewBase(frameElement) {
    checkLS();
    var frameElement = frameElement;
    this.timer = null;
    this.interval = 10;
    this.currentTick = 0;
    this.isPause = false;
    this.eventListens = {}; //事件监听器
    //this.serviceBase="http://192.168.3.116:8080/gdcnymot/";
    // this.serviceBase = "http://localhost/gdcnymot/";
    this.serviceBase = serviceBase;
    this.initExtend();
    /* this.load("cw/initData.do",{},function () {

     });*/
    var theUrlMap = {
        "test": "qxjc.html",
        "insight": "qxdc.html",
        "bridge": "gzadq.html",
        "strait": "qzhx.html",
        "yxzk": 'yxzk.html',
        "lkyw": 'lkyw.html',// 'http://10.0.64.247:11000/StaticResource/Framework/Assets/global/plugins/uniform/css/uniform.default.css',//
    };
    $('.date-action,.date-icon').unbind().click(function (e) {
        //debugger;
        e.stopPropagation();
        e.preventDefault();
        var theElement = $(this).siblings('input');
        setTimeout(function () {
            $(theElement).click();
        }, 50);

    });
    if (frameElement) {
        var onHashChange = function () {
            var hash = location.hash;
            var theCls = 'yxzk';
            if (hash) {
                theCls = hash.replace('#', '');
            }
            $('.topbutton_new.' + theCls).click();
            $('.topbutton_1.' + theCls).click();
        };
        window.addEventListener("hashchange", onHashChange);
        //debugger;
        $(function () {
            onHashChange();
        })

    }
    if (parent) {
        $(function () {
            // $(document.body).css('background-image', 'transparent');
        });
    }
    $('.topbutton,.topbutton_new,.topbutton_1').click(function () {
        if ($(this).hasClass('active')) {
            return;
        }
        $('.topbutton,.topbutton_new,.topbutton_1').removeClass('active');
        $(this).addClass('active');
        if ($(this).hasClass('test')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['test']);
            }
            else {
                location.href = theUrlMap['test'];
            }
            location.hash = 'test';

        }
        if ($(this).hasClass('insight')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['insight']);
            }
            else {
                location.href = theUrlMap['insight'];
            }
            location.hash = 'insight';
        }
        if ($(this).hasClass('bridge')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['bridge']);
            }
            else {
                location.href = theUrlMap['bridge'];
            }
            location.hash = 'bridge';
        }
        if ($(this).hasClass('strait')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['strait']);
            }
            else {
                location.href = theUrlMap['strait'];
            }
            location.hash = 'strait';
        }
        if ($(this).hasClass('yxzk')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['yxzk']);
            }
            else {
                location.href = theUrlMap['yxzk'];
            }
            location.hash = 'yxzk';
        }
        if ($(this).hasClass('lkyw')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['lkyw']);
            }
            else {
                location.href = theUrlMap['lkyw'];
            }
            location.hash = 'lkyw';
        }
    });

}

PageViewBase.prototype.getProvinceCity = function (province) {
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
/**
 * 得到城市名称
 * @param cityCode
 * @returns {*}
 */
PageViewBase.prototype.getCityNameByCode = function (cityCode) {
    //return cityCode;
    for (var i = 0; i < AreaMap.length; i++) {
        var theItem = AreaMap[i];
        if (theItem.code == cityCode) {
            return theItem.name;
        }
    }

    return cityCode;
}
PageViewBase.prototype.getAreaCode = function (cityName) {

    // return cityName;
    /*for (var i = 0; i < AreaMap.length; i++) {
        var theItem = AreaMap[i];
        if (theItem.name + "市" == cityName || theItem.name == cityName) {
            return theItem.code;
        }
    }*/
    if (cityName) {
        return cityName.replace('市', '');
    }
    else {
        return cityName;
    }
}

PageViewBase.prototype.getRealAreaCode = function (cityName) {

    // return cityName;
    for (var i = 0; i < AreaMap.length; i++) {
        var theItem = AreaMap[i];
        if (theItem.name + "市" == cityName || theItem.name == cityName) {
            return theItem.code;
        }
    }
    if (cityName) {
        return cityName.replace('市', '');
    }
    else {
        return cityName;
    }
}

/**
 * 绑定数据到页面
 * @param ele
 * @param data
 */
PageViewBase.prototype.bind = function (ele, data) {
    var theFieldCls = '.field';
    $(ele).find(theFieldCls).each(function () {
        var theFieldName = $(this).data('field');
        if (theFieldName && data && data[theFieldName] != undefined) {
            var theText = data[theFieldName];
            if ($(this).is('input')) {
                $(this).val(theText);
            }
            else {
                $(this).html(theText);
            }
        }
    });
}
/**
 * 加载表格模板数
 * @param theTableId
 * @param data
 */
PageViewBase.prototype.loadTemplateTable = function (theTableId, data, pageindex, pagesize) {
    var theTemplate = $('#' + theTableId).find('.template');
    var theTableBody = $('#' + theTableId).find('.data');
    var thePageSize = $('#' + theTableId).data('pagesize');
    var theTemplateStr = $(theTemplate).html();
    pageindex = pageindex || 0;
    pagesize = pagesize || thePageSize || 5;
    $('#' + theTableId).unbind().mouseout(function () {
        //var me=this;
        $(this).data('pause', false);
    }).mouseover(function () {
        //var me=this;
        $(this).data('pause', true);
    });
    $('#' + theTableId).data('pagesize', pagesize);
    var theStartIndex = pagesize * (pageindex || 0);
    var theEndIndex = pagesize * (pageindex || 0) + pagesize;
    $(theTableBody).empty();
    var datas = data || [];
    var index = 0;//theStartIndex;
    var theTemArrays = [];
    for (var i = theStartIndex; i < theEndIndex; i++) {
        if (i >= datas.length) {
            break;
        }
        var data = datas[i];
        index = i;
        var theResultStr = eval('`' + theTemplateStr + '`');
        //index++;
        theTemArrays.push(theResultStr);
    }
    var theResultString = theTemArrays.join('');
    /*data.map(function (data) {
    var theResultStr = eval('`'+theTemplateStr+'`');
    index++;
    return theResultStr;
}).join('');*/
    $(theTableBody).append(theResultString);
    $('#' + theTableId).data('data', datas);
    //$(theTableBody).data('data', datas);
    var thePageNum = Math.floor(datas.length / pagesize) + (datas.length % pagesize > 0 ? 1 : 0);
    var thePageDiv = $('#' + theTableId).closest('.table-div').next('.page');
    $(thePageDiv).empty();
    var me = this;
    for (var i = 1; i <= thePageNum; i++) {
        var select = 'select';
        if (i != pageindex + 1) {
            select = '';
        }
        var thePageText = ` <div class="page-item-${i}  page-item ${select}" data-page='${i - 1}'></div>`;
        var thePageItem = $(thePageText);
        $(thePageItem).unbind().click(function () {
            //debugger;
            $(thePageDiv).find('.page-item').removeClass('select');
            $(this).addClass('select');
            var thePageIndex = $(this).data('page');
            me.loadTemplateTable(theTableId, datas, thePageIndex, pagesize);
        });
        $(thePageDiv).append(thePageItem);
    }
    $('#' + theTableId).data('PageCount', thePageNum);
    $('#' + theTableId).data('PageIndex', pageindex);
    if (me.pageTimer) {
        clearTimeout(me.pageTimer);
    }
    //debugger;
    if (thePageNum > 1) {
        me.pageTimer = setTimeout(function () {
            var thePageData = $('#' + theTableId).data();
            var theStep=1;
            if(thePageData.pause){
                //debugger;
                theStep=0;
                //return;
            }
            if (thePageData && thePageData.PageCount > 1) {
                //debugger;
                me.loadTemplateTable(theTableId, thePageData.data, ((thePageData.PageIndex + theStep) % 2), thePageData.pagesize);
            }

        }, 8000);
    }
}
/*
* 加载并展示表格数据
* */
PageViewBase.prototype.loadTable = function (theTableId, data, fieldRender) {
    var theTemplate = $('#' + theTableId).find('tbody.template');
    var theTemplateStr = $(theTemplate).innerHTML;
    $('#' + theTableId).find('tbody.data').empty();
    var theTableBody = $('#' + theTableId).find('tbody.data');
    var theFieldNames = $('#' + theTableId).data('field');
    var theFieldArrays = theFieldNames.split(',');
    data = data || [];
    for (var i = 0; i < data.length; i++) {
        var theRowData = data[i];
        if (!theRowData) {
            console.log("数据为空!");
            continue;
            var theRowString = "<tr>";
            for (var j = 0; j < theFieldArrays.length; j++) {
                var theFieldName = theFieldArrays[j];
                if (fieldRender) {
                    var theFieldText = fieldRender(theRowData, theFieldName);
                    theRowString += "<td>" + theFieldText + "</td>";
                }
                else {
                    theRowString += "<td>" + theRowData[theFieldName] + "</td>";
                }
            }
            theRowString += "</tr>";
            var theRowElement = $(theRowString);
            var me = this;
            $(theRowElement).data('data', theRowData);
            $(theRowElement).click(function () {
                var theCurrentData = $(this).data('data');
                console.log('当前的点击数据为:' + theCurrentData);
                if (this.eventListens['onSelect']) {
                    this.eventListens['onSelect'](theCurrentData);
                }

            });
            $(theTableBody).append(theRowElement);

        }
    }
}
/***
 * 定时器动画
 */
PageViewBase.prototype.onTimer = function () {

}
/**
 * 暂停计时
 */
PageViewBase.prototype.pause = function () {
    this.isPause = true;
}
/**
 * 重启计时
 */
PageViewBase.prototype.restart = function () {
    this.isPause = false;
}
/**
 * 开始执行任务
 */
PageViewBase.prototype.start = function () {
    if (!this.timer) {
        var me = this;
        this.currentTick = 0;
        console.log('开始初始化定时器');
        this.timer = window.setInterval(function () {
            if (me.isPause) {
                //暂停则不执行
                return;
            }
            me.currentTick++;
            if (me.currentTick >= me.interval) {
                try {
                    console.log('开始调用定时任务!');
                    me.onTimer();
                    console.log('结束调用定时任务!');
                }
                catch (e) {
                    console.log('定时任务错误:' + e);
                }
                finally {
                    me.currentTick = 0;
                }


            }
        }, 1000);
        console.log('初始化定时器成功');
    }
}
/**
 * 结束任务
 */
PageViewBase.prototype.stop = function () {
    if (this.timer) {
        console.log('开始清除定时器');
        window.clearInterval(this.timer);
        this.timer = null;
        console.log('结束清除定时器');
    }
}
PageViewBase.prototype.parserDate = function (dateStr) {
    if (!dateStr) {
        return null;
    }
    if (dateStr.indexOf('-') >= 0) {
        return new Date(dateStr);
    }
    if (dateStr.length == 8) {
        var theDateStr = dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2);
        return new Date(theDateStr);
    }
    return null;

}

/***
 * 添加扩展方法
 */
PageViewBase.prototype.initExtend = function () {
    if (typeof Array.prototype.map != "function") {
        Array.prototype.map = function (fn, context) {
            var arr = [];
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                    arr.push(fn.call(context, this[k], k, this));
                }
            }
            return arr;
        };
    }
    if (typeof Array.prototype.filter != "function") {
        Array.prototype.filter = function (fn, context) {
            var arr = [];
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                    fn.call(context, this[k], k, this) && arr.push(this[k]);
                }
            }
            return arr;
        };
    }
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
}
/**
 * 显示热力图
 * @param data
 */
/*PageViewBase.prototype.drawReli = function (data) {
    //var map = Loca.create(theMap);
    //var layer = Loca.visualLayer({
    //    container: map,
    //    type: 'heatmap',
    //    // 基本热力图
    //    shape: 'normal'
    //});
    var theCenter = this.theMap.getCenter();
    if (!this.theHeartLayer) {
        var map = Loca.create(this.theMap);
        this.theHeartLayer = Loca.visualLayer({
            container: map,
            type: 'heatmap',
            // 基本热力图
            shape: 'normal'
        });
    }
    lng = theCenter.lng;
    lat = theCenter.lat;
    var theValue = Math.floor((Math.random() * 10));
    layer = this.theHeartLayer;
    var list = [];
    var i = -1, length = 4000;
    while (++i < length) {
        //var item = heatmapData[i + theValue];
        //i = i + theValue;

        list.push({
            coordinate: [lng + Math.random(), lat + Math.random()],
            count: Math.floor((Math.random() * 1000))
        })
    }

    layer.setData(list, {
        lnglat: 'coordinate',
        value: 'count'
    });

    layer.setOptions({
        style: {
            radius: 30,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.7: '#ffffbf',
                0.9: '#fde468',
                1.0: '#d7191c'
            }
        }
    });

    layer.render();
}*/
PageViewBase.prototype.drawRoad = function (path) {
    var pathArray = path.map(function (item) {
        return new AMap.LngLat(parseFloat(item[0]), parseFloat(item[1]))
    });

    var theStartPoint = path[0];
    var theEndPoint = path[path.length - 1];

    // debugger;
    var RoadPath = new AMap.Polyline({
        path: pathArray,
        strokeColor: '#80ddfe',//"#0d305d",
        strokeOpacity: "0.6",
        strokeWeight: "6",
        strokeStyle: "solid",
        zIndex: 1000,
        strokeDasharray: [10, 5]
    });
    // debugger
    this.theMap.add(RoadPath);
    return RoadPath;
}
PageViewBase.prototype.getRandomPoints = function (bounds, value, max) {
    var thePorints = bounds;
    max = max || 1000;
    var theValidPoints = [];
    var lngs = thePorints.map(function (item) {
        return item[0];
    });
    var lats = thePorints.map(function (item) {
        return item[1];
    });
    var minLngs = lngs.min();
    var maxLngs = lngs.max();
    var minLats = lats.min();
    var maxLats = lats.max();

    for (var i = 0; i < max; i++) {
        var thePoint = Math.RandomPoint(minLngs, maxLngs, minLats, maxLats);
        if (AMap.GeometryUtil.isPointInRing(thePoint, thePorints)) {
            theValidPoints.push(thePoint);
        }
    }
    var theCurrentValue = value;
    var theShowList = [];
    var theMinValue = Math.ceil(value / max);
    var list = theValidPoints.map(function (item) {
        var theTempValue = 0;
        if (theCurrentValue <= 10) {
            theTempValue = theCurrentValue;
        }
        else {
            theTempValue = Math.floor(Math.RandomRange(theMinValue, theMinValue * 2));
        }
        theCurrentValue -= theTempValue;
        if (theTempValue > 0) {
            theShowList.push({
                coordinate: [item[0], item[1]],
                count: Math.floor(theTempValue)
            });
        }

    })
    return theShowList;
}
PageViewBase.prototype.drawRelis = function (reliDatas, r) {
    return this.drawRelis3D(reliDatas, r);
    var theShowList = [];

    if (reliDatas && reliDatas.length > 0) {
        for (var i = 0; i < reliDatas.length; i++) {
            var theItem = reliDatas[i];
            var theBounds = theItem.bounds;
            var theData = theItem.data;
            var theMaxPoint = theItem.max || 100;
            theShowList = theShowList.concat(this.getRandomPoints(theBounds, theData, theMaxPoint));
        }
    }
    var theDataList = theShowList.map(function (item) {
        return {lng: item.coordinate[0], lat: item.coordinate[1], count: item.count};
    });
    //debugger;
    this.heartMap.setDataSet({data: theDataList});

}

PageViewBase.prototype.drawRelis3D = function (reliDatas, r) {
    if (!this.heartLayer) {
        var map = Loca.create(this.theMap);
        this.heartLayer = Loca.visualLayer({
            container: map,
            type: 'heatmap',
            // 基本热力图
            shape: 'normal',
            zIndex: 1000
        });
    }
    var theShowList = [];
    //debugger;
    if (reliDatas && reliDatas.length > 0) {
        for (var i = 0; i < reliDatas.length; i++) {
            var theItem = reliDatas[i];
            var theBounds = theItem.bounds;
            var theData = theItem.data;
            var theMaxPoint = theItem.max || 30;
            theShowList = theShowList.concat(this.getRandomPoints(theBounds, theData, theMaxPoint));
        }
    }
    this.heartLayer.setData(theShowList, {
        lnglat: 'coordinate',
        value: 'count'
    });

    this.heartLayer.setOptions({
        style: {
            radius: r || 10,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.7: '#ffffbf',
                0.9: '#fde468',
                1.0: '#d7191c'
            }
        }
    });
    //this.heartLayer.setZIndex(1000);
    this.heartLayer.render();

}
PageViewBase.prototype.drawReli = function (bounds, data) {
    //var theAreaPath =bounds;
    //this.CreateHeartLayer();
    if (!this.heartLayer) {
        var map = Loca.create(this.theMap);
        this.heartLayer = Loca.visualLayer({
            container: map,
            type: 'heatmap',
            // 基本热力图
            shape: 'normal'
        });
    }
    value = data || 1000;
    var path = bounds;
    if (!path) {
        console.log("未找到对应的范围");
        return;
    }
    var thePorints = path;
    var lngs = thePorints.map(function (item) {
        return item[0];
    });
    var lats = thePorints.map(function (item) {
        return item[1];
    });

    var minLngs = lngs.min();
    var maxLngs = lngs.max();
    var minLats = lats.min();
    var maxLats = lats.max();


    var theValidPoints = [];
    for (var i = 0; i < 1000; i++) {
        var thePoint = Math.RandomPoint(minLngs, maxLngs, minLats, maxLats);
        if (AMap.GeometryUtil.isPointInRing(thePoint, thePorints)) {
            theValidPoints.push(thePoint);
        }
    }
    var layer = this.heartLayer;

    var theCurrentValue = value;
    var theShowList = [];
    var list = theValidPoints.map(function (item) {
        var theTempValue = 0;
        if (theCurrentValue <= 10) {
            theTempValue = theCurrentValue;
        }
        else {
            theTempValue = Math.floor(Math.RandomRange(1, 10));
        }
        theCurrentValue -= theTempValue;
        if (theTempValue > 0) {
            theShowList.push({
                coordinate: [item[0], item[1]],
                count: Math.floor(theTempValue)
            });
        }

    })
    layer.setData(theShowList, {
        lnglat: 'coordinate',
        value: 'count'
    });

    layer.setOptions({
        style: {
            radius: 10,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.7: '#ffffbf',
                0.9: '#fde468',
                1.0: '#d7191c'
            }
        }
    });

    layer.render();
}
/**
 *
 * @param name 1 港珠澳 2 琼州海峡
 */
PageViewBase.prototype.initMap = function (id) {
    var me = this;
    //最大的缩放程度
    var theMaxZoom = 18;
    //现在的缩放程度
    var theCurrentZoom = 1;
    //
    var theMakerLayer = null;
    //室内地图层
    var theInnerLayer = null;
    //热力图地图层
    var theHeartLayer = null;
    var theBounds1 = [[113.42469974130972, 22.652026255982374], [114.64627542077909, 22.652026255982374], [114.64627542077909, 22.01644131657448], [113.42469974130972, 22.01644131657448], [113.42469974130972, 22.652026255982374]];
    var theBounds2 = [[109.9814722996719, 20.427689848885844], [110.74924185159136, 20.427689848885844], [110.74924185159136, 20.022448878077956], [109.9814722996719, 20.022448878077956], [109.9814722996719, 20.427689848885844]];
    //创建地图实例
    var theMap = new AMap.Map('container', {
            pitch: 0,
            mapStyle: 'amap://styles/9f47a75c5a80f716945988ccbc61aeb7',
            //mapStyle: 'amap://styles/c6b6ea6de59432d8973e27caa9b04355',
            //mapStyle: 'amap://styles/grey',//'amap://styles/blue',
            viewMode: '3D',// 地图模式
            //lat: 22.251472
            //lng: 113.766128
            center: id == 1 ? [114.067447, 22.33259] : [110.432232, 20.225891],//港珠澳大桥

            //center:[110.322391,20.146053 ],//琼州海峡 //lat: 20.146053  lng: 110.322391

            //center: [113.275824, 22.994826],
            features: ['bg'],//, 'building', 'point', 'road'],//['all'],// ['bg', 'building','point'],
            zoom: id == 1 ? 11 : 11.5,// 11.78,
            zooms: [10, 20],
            keyboardEnable: false,
            layers:
                [
                    //satellite,
                    // building,
                    //roadNet
                ]
        })
    ;
    //debugger;
    this.theMap = theMap;

    /*if(id==1){
        theMap.setLimitBounds(theBounds1);
    }
    else{
        theMap.setLimitBounds(theBounds2);
    }*/
    theMap.plugin(["AMap.Heatmap"], function () {
        //初始化heatmap对象
        me.heartMap = new AMap.Heatmap(theMap, {
            radius: 10, //给定半径
            opacity: [0, 0.8]
        });
    });
    //地图加载完成事件
    theMap.on('complete', function () {
        var bounds = theMap.getBounds();
        theMap.setLimitBounds(bounds);
        // console.log("地图加载完成!");
    });
    //监听放大缩小事件
    theMap.on('zoom', function (arg) {
        var theZoom = theMap.getZoom();
        if (theZoom >= 12) {
            // console.log("显示点");
            //theMap.setFeatures(['bg', 'road']);// 'building', 'point'
            //theInnerLayer && theInnerLayer.setzIndex(1000);
            //theMap.add(satellite);
            //theMap.setMapStyle("normal");

        }
        else {
            console.log("隐藏点");
            //theHeartLayer && theHeartLayer.setMap(null);
            //theHeartLayer && theHeartLayer.remove() ;
            //theHeartLayer = null;
            //theMap.setMapStyle("amap://styles/grey");
        }

    });


}
/**
 * 加载服务端的数据
 * @param url
 * @param argment
 * @param callback
 */
PageViewBase.prototype.load = function (url, argment, callback, emal) {
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
    url = this.serviceBase + url;
    this.loadInner(url, argment, callback);
}

PageViewBase.prototype.loadInner = function (url, argment, callback) {
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
        timeout: 100000,
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
            //debugger;
            if (callback) {
                callback(r);
            }
            console.log('访问失败' + r);
        }

    });
}
/**
 * 加载数据天气
 * @param date
 * @param type
 * @param callback
 */
PageViewBase.prototype.loadWeather = function (name) {
    var theCallUrl = hostbase + "/lyzwether/forecast/" + name;
    //"/lyzwether/forecast/珠海";
    var theCallArgument = {}
    var me = this;
    /*var data = {
        "isSuccess": true,
        "msg": "success",
        "data": [{
            "DDATETIME": "2019-01-09 08:00:00.0",
            "OBTID": "59488",
            "PREDICTION_TIME": "24",
            "MAKE_TIME": "2019-01-09 06:45:00.0",
            "FORECASTER": null,
            "TEMPERATURE": null,
            "RELATIVE_HUMIDITY": null,
            "WIND_DIRECTION": null,
            "WIND_SPEED": null,
            "PRESSURE": null,
            "PRECIPITATION": null,
            "TOTAL_CLOUD_AMOUNT": null,
            "LOW_CLOUD_AMOUNT": null,
            "WEATHER_TYPE": null,
            "VISIBILITY": null,
            "MIN_TEMP_24": "17",
            "MAX_TEMP_24": "19.7",
            "MIN_HUM_24": null,
            "MAX_HUM_24": null,
            "PRECIPITATION_12": null,
            "PRECIPITATION_24": null,
            "TOTAL_CLOUD_12": null,
            "LOW_CLOUD_12": null,
            "WEATHER_TYPE_12": "阴",
            "WIND_DIRECTION_12": "微风",
            "WIND_SPEED_12": "小于3级",
            "CRTTIME": "2019-01-08 22:59:47.0",
            "KEYID": null,
            "SYNC_ROWID": null,
            "CRTTIME2": null,
            "V05001": "22.3",
            "V06001": "113.6",
            "V_COUNTY": "珠海",
            "V_CITY": "珠海",
            "V_PRCODE": "广东",
            "VF01015_CN": "珠海市气象局"
        }]
    };*/
    // debugger;
    this.loadInner(theCallUrl, theCallArgument, function (data) {
        if (data && data.isSuccess) {
            me.loadWeatherView(data);
        }
        else {
            console.log("loadWeather:" + data);
        }
    });
}
/***
 * 计算路径
 * @param startX
 * @param startY
 * @param r
 * @param deg
 * @param clockwise
 * @returns {string}
 */
PageViewBase.prototype.drawArcByRadiusDeg = function (startX, startY, r, deg, clockwise) {
    var cw = typeof clockwise !== 'undefined' ? clockwise : 1;
    var x = startX - r + r * Math.cos((deg + 90) * Math.PI / 180);
    var y = startY + (1 === cw ? 1 : -1) * r * Math.sin((deg + 90) * Math.PI / 180);
    var x1 = startX - r + r * Math.cos(90 * Math.PI / 180);
    var y1 = startY + (1 === cw ? 1 : -1) * r * Math.sin(90 * Math.PI / 180);

    var bigOrSmall = deg > 180 ? 1 : 0;
    var line = " L" + 59 + " " + 59 + " L" + x1 + " " + y1 + "Z";
    return "M " + x1 + " " + y1 + " A " + r + " " + r + " 0 " + bigOrSmall + " " + cw + " " + x + " " + y + line;
}
/***
 * 加载天气表格数据
 * @param data
 */
PageViewBase.prototype.loadWeatherView = function (data) {
    data = data.data || [];
    var theIndex = 0;
    $('.left-weather').each(function () {
        var theFields = $(this).find('.field');
        var theItem = data[theIndex] || {};
        /*
        日期 DDATETIME
最低温度 MIN_TEMP_24
最高温度 MAX_TEMP_24
12小时天气现象 WEATHER_TYPE_12
12小时风向 WIND_DIRECTION_12
12小时风速 WIND_SPEED_12
        * */
        var theIconMap = {
            "阵雨": "小雨.png"
        };
        $(theFields[0]).text(new Date(theItem['DDATETIME']).formateCN() || '暂无');//日期
        $(theFields[1]).text(theItem['MIN_TEMP_24'] + '℃-' + theItem['MAX_TEMP_24'] + '℃' || '暂无');//温度
        $(theFields[2]).text(theItem['WIND_DIRECTION_12'] || '暂无');//风力
        $(theFields[3]).text(theItem['WIND_SPEED_12'] || '暂无');//
        if (theItem['WEATHER_TYPE_12']) {
            var theImage = theIconMap[theItem['WEATHER_TYPE_12']];
            //debugger;
            if (!theImage) {
                var theImage = theItem['WEATHER_TYPE_12'];
                if (theImage.indexOf('-') > 0) {
                    theNames = theImage.split('-');
                    theImage = theNames[theImage.length - 1]
                }
                theImage += '.png';
                var theImageE = $(this).find('.weather-icon.change');
                theImageE.attr('src', theImageE.data('base') + theImage);
            }
        }

        $(theFields[4]).text(theItem['WEATHER_TYPE_12'] || '暂无');//
        theIndex += 1;
        //debugger;
    })


    /*date:2018年12月28日
    wendu:25℃
fengli:东风2级
    kejiandu:12公里
    jiangshui:0毫米*/
}

PageViewBase.prototype.addMarker = function (name, lng, lat, value) {
    this.markers = this.markers || {};
    var theNumText = value || 0;
    if (value > 1000) {
        theNumText = (value / 10000).toFixed(2) + "万";
    }
    var content = '<div class="marker-route marker-marker-point"></div><div class="infowindow" style="color:white">' +
        '<div class="first">实时客流</div><div class="second">' + theNumText + '</div></div><div style="text-align: center;color: white;    margin-left: -52px;\n' +
        '    width: 198px;\n' +
        '    display: inline-block;font-size: 24px;\n' +
        '    margin-top: 5px;">' + name + '</div>';

    if (!this.markers[name]) {
        var marker = new AMap.Marker({
            content: content,  // 自定义点标记覆盖物内容
            position: [lng, lat], // 基点位置
            offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
        });
        this.theMap.add(marker);
        this.markers[name] = marker;
    }
    else {
        this.markers[name].setContent(content);
    }
    return this.markers[name];
}

PageViewBase.prototype.addMarker2 = function (name, lng, lat, value) {
    this.markers = this.markers || {};
    var theNumText = value || 0;
    if (value > 1000) {
        theNumText = (value / 10000).toFixed(2) + "万";
    }

    var content = '<div class="infowindow" style="color:white">' +
        '<div class="first">实时客流</div><div class="second">' + theNumText + '</div></div><div class="marker-route marker-marker-point"></div><div style="text-align: center;color: white;    margin-left: -52px;\n' +
        '    width: 198px;\n' +
        '    display: inline-block;font-size: 24px;\n' +
        '    margin-top: 5px;">' + name + '</div>';
    if (!this.markers[name]) {
        var marker = new AMap.Marker({
            content: content,  // 自定义点标记覆盖物内容
            position: [lng, lat], // 基点位置
            offset: new AMap.Pixel(-98, -129) // 相对于基点的偏移位置
        });
        this.theMap.add(marker);
        this.markers[name] = marker;
    }
    else {
        this.markers[name].setContent(content);
    }
    return this.markers[name];
}
/***
 * 添加信息窗体
 * @param name
 * @param lng
 * @param lat
 * @returns {*}
 */
PageViewBase.prototype.addInfoWindow = function (name, lng, lat) {
    this.infos = this.infos || {};
    if (this.infos[name]) {
        return this.infos[name];
    }
    var content = '<div class="infowindow">测试</div>';
    // 创建 infoWindow 实例
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: content,  //传入 dom 对象，或者 html 字符串
        offset: new AMap.Pixel(30, 150)
    });
    this.infos[name] = infoWindow;
    infoWindow.open(this.theMap, [lng, lat]);
    return infoWindow;
}
