var serviceBase = "http://localhost/gdcnymot/";  // 基地址
$(function () {
    Array.prototype.min = function () {
        var theMinValue = null;
        var datas=this;
        if (datas && datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                if (theMinValue == null) {
                    theMinValue = datas[i];
                }
                else{
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

})