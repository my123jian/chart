/**
 * 视图的基类添加定时刷新和数据获取的支持
 * @constructor
 */

function PageViewBase() {
    this.timer = null;
    this.interval = 1000 * 60 * 5;
    this.currentTick = 0;
    this.isPause = false;
    this.eventListens = {}; //事件监听器
    //this.serviceBase="http://192.168.3.116:8080/gdcnymot/";
    this.serviceBase = "http://localhost/gdcnymot/";
    this.initExtend();
    var theUrlMap = {
        "test": "qxjc.html",
        "insight": "qxdc.html",
        "bridge": "gzadq.html",
        "strait": "",
    };
    $('.topbutton').click(function () {
        if ($(this).hasClass('test')) {
            location.href = theUrlMap['test'];
        }
        if ($(this).hasClass('insight')) {
            location.href = theUrlMap['insight'];
        }
        if ($(this).hasClass('bridge')) {
            location.href = theUrlMap['bridge'];
        }
        if ($(this).hasClass('strait')) {
            location.href = theUrlMap['strait'];
        }
    });
}

PageViewBase.prototype.getAreaCode = function (cityName) {
    var AreaMap = [
        {
            "name": "广州",
            "code": "0",
        },
        {
            "name": "深圳",
            "code": "1",

        },
        {
            "name": "珠海",
            "code": "2",

        },
        {
            "name": "汕头",
            "code": "3",

        },
        {
            "name": "韶关",
            "code": "4",

        },
        {
            "name": "佛山",
            "code": "5",

        },
        {
            "name": "江门",
            "code": "6",

        },
        {
            "name": "湛江",
            "code": "7",

        },
        {
            "name": "茂名",
            "code": "8",

        },
        {
            "name": "肇庆",
            "code": "9",

        },
        {
            "name": "惠州",
            "code": "10",

        },
        {
            "name": "梅州",
            "code": "11",

        },
        {
            "name": "汕尾",
            "code": "12",

        },
        {
            "name": "河源",
            "code": "13",

        },
        {
            "name": "阳江",
            "code": "14",

        },
        {
            "name": "清远",
            "code": "15",

        },
        {
            "name": "东莞",
            "code": "16",

        },
        {
            "name": "中山",
            "code": "17",

        },
        {
            "name": "潮州",
            "code": "18",

        },
        {
            "name": "揭阳",
            "code": "19",

        },
        {
            "name": "云浮",
            "code": "20",

        }
    ];
    for (var i = 0; i < AreaMap.length; i++) {
        var theItem = AreaMap[i];
        if (theItem.name == cityName + "市" || theItem.name == cityName) {
            return theItem.code;
        }
    }
    return "";
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
        if (theFieldName && data.hasOwnProperty(theFieldName)) {
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
    var theTemplateStr = $(theTemplate).html();
    pageindex = pageindex || 0;
    pagesize = pagesize || 5;
    var theStartIndex = pagesize * index;
    var theEndIndex = pagesize * index + pagesize;
    $(theTableBody).empty();
    data = data || [];
    var index = 0;
    var theTemArrays = [];
    for (; theStartIndex < theEndIndex; theStartIndex++) {
        var data = data[theStartIndex];
        var theResultStr = eval('`' + theTemplateStr + '`');
        index++;
        theTemArrays.push(theResultStr);
    }
    var theResultString = theTemArrays.join('');
    /*data.map(function (data) {
    var theResultStr = eval('`'+theTemplateStr+'`');
    index++;
    return theResultStr;
}).join('');*/
    $(theTableBody).append(theResultString);
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
    return new Date(dateStr);
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
}
/**
 * 加载服务端的数据
 * @param url
 * @param argment
 * @param callback
 */
PageViewBase.prototype.load = function (url, argment, callback) {
    console.log("访问地址：" + url);
    console.log("访问参数:" + argment);
    if (!url) {
        console.log("访问地址不能为空：");
        return;
    }
    url = this.serviceBase + url;
    argment = argment || {};
    $.ajax({
        url: url,
        type: 'post',
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