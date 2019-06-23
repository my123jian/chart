console.log("hello world!");
window.baseUrl="http://localhost:9000";

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

function toQuery(obj){
   var theItems=[];
    for(var key in obj){
        theItems.push(key+"="+(obj[key]||''));
    }
    return theItems.join("&");
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