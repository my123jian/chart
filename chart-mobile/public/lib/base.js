window.baseUrl = "http://localhost:9000";

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

function toQuery(obj) {
    var theItems = [];
    for (var key in obj) {
        if(obj[key]==undefined||obj[key]==null){
            theItems.push(key + "=" + (obj[key]||''));
        }
        else{
            theItems.push(key + "=" + (obj[key]));
        }

    }
    return theItems.join("&");
}

/*格式化年月日日期*/
Date.prototype.formate = function () {
    return this.getFullYear() + "-" + FormateDateNum(this.getMonth() + 1) + "-" + FormateDateNum(this.getDate());
}
Date.prototype.formateYearMonth = function () {
    return this.getFullYear() + "-" + FormateDateNum(this.getMonth() + 1);
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
/***
 * 格式化为数字显示格式
 * @param value
 */
Number.prototype.fromateDataString = function () {

    var theNumber = (this / 10000).toFixed(2);
    var theNumberStr = theNumber + "";
    var theResultStr = "";
    for (var i = 0; i < theNumberStr.length; i++) {
        var theItem = theNumberStr[i];
        if (theItem == ".") {
            theResultStr += "<div class='dian'>" + theItem + "</div>";
        }
        else {
            theResultStr += "<div class='numitem'>" + theItem + "</div>";
        }
    }
    theResultStr += "<div class='last'>万</div>";
    return theResultStr;
}

function gotoPage(name) {
    location.href = name;
}

Array.prototype.min = function (compare) {
    var theMinValue = null;
    var datas=this;
    if (datas && datas.length > 0) {
        for (var i = 0; i < datas.length; i++) {
            if (theMinValue == null) {
                theMinValue = datas[i];
            }
            else{
                if(compare){
                    if(compare(datas[i],theMinValue)){
                        theMinValue = datas[i];
                    }
                    continue;
                }
                if(datas[i]<theMinValue){
                    theMinValue = datas[i];
                }
            }
        }
    }
    return theMinValue;
}
Array.prototype.max = function () {
    var datas=this;
    var theMaxValue = null;
    if (datas && datas.length > 0) {
        for (var i = 0; i < datas.length; i++) {
            if (theMaxValue == null) {
                theMaxValue = datas[i];
            }
            else{
                if(datas[i]>theMaxValue){
                    theMaxValue = datas[i];
                }
            }
        }
    }
    return theMaxValue;
}
Math.RandomRange=function(mindata,maxdata){
    return Math.random() * (maxdata - mindata) + mindata;
}
Math.RandomPoint=function(mindata1,maxdata1,mindata2,maxdata2){
    return [Math.RandomRange(mindata1,maxdata1),Math.RandomRange(mindata2,maxdata2)];
}

//年龄组分段
var theAgeGroups = {};
theAgeGroups[0] = "未知";
theAgeGroups[1] = "[0-20)岁";
theAgeGroups[2] = "[20-30)岁";
theAgeGroups[3] = "[30-40)岁";
theAgeGroups[4] = "[40-50)岁";
theAgeGroups[5] = "[50-60)岁";
theAgeGroups[6] = "60岁以上";

//性别
var theSexType = {};
theSexType[0] = "未知";
theSexType[1] = "男";
theSexType[2] = "女";

//消费能力
var theConsumDegree = {};
theConsumDegree[0] = "低";
theConsumDegree[1] = "中低";
theConsumDegree[2] = "中等";
theConsumDegree[3] = "中高";
theConsumDegree[4] = "高";

//迁徙渠道类型
var theChannelType = {};
theChannelType[1] = '汽车';
theChannelType[2] = '火车';
theChannelType[3] = '飞机';
theChannelType[4] = '自驾';

//通勤距离段
var theTqDistinceType = {};
theTqDistinceType[0] = '<2km';
theTqDistinceType[1] = '2-4km';
theTqDistinceType[2] = '4-6km';
theTqDistinceType[3] = '6-8km';
theTqDistinceType[4] = '8-10km';
theTqDistinceType[5] = '10-15km';
theTqDistinceType[6] = '15-20km';
theTqDistinceType[7] = '20-25km';
theTqDistinceType[8] = '<25km';

//通勤距离段
var theTqTimeType = {};
theTqTimeType[0] = '<20min';
theTqTimeType[1] = '20-30min';
theTqTimeType[2] = '30-40min';
theTqTimeType[3] = '40-50min';
theTqTimeType[4] = '50-60min';
theTqTimeType[5] = '>60min';


//通勤时点分布
var theTqPlace = {};
theTqPlace[0] = '<6h';
theTqPlace[1] = '6-7h';
theTqPlace[2] = '7-8h';
theTqPlace[3] = '8-9h';
theTqPlace[4] = '>9h';