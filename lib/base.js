var serviceBase = "http://localhost/gdcnymot";  // 基地址
var hostbase="http://localhost";//
if(window.location.hostname==='localhost') {
    serviceBase = "http://localhost/gdcnymot/";///gdcnymot/";
    hostbase="http://localhost";
} else {
    //serviceBase = "http://123.207.31.17/gdcnymot/";
   // hostbase="http://123.207.31.17";
    serviceBase = "http://14.23.164.13:7001/gdcnymot/";
    hostbase="http://14.23.164.13:7001";
}
$(function () {
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

})

/*
   * 1：设置当前的元素的值 自己设置
   * 2：动画进行初始化操作 开始动画操作，结束动画操作
   * 3：开始滚动动画操作 动画结束 定时结束
   * */

function NumbersEffect(ele) {
    this.timer = null;
    this.ele = ele;
    this.init(this.ele);
}
NumbersEffect.prototype.restart=function(){

    if(this.ele){
        this.init(this.ele);
    }
    else{
        console.log('初始化错误！');
    }
}
NumbersEffect.prototype.resume=function(){
    this.isPause=false;
}
NumbersEffect.prototype.pause=function(){
    this.isPause=true;
}
NumbersEffect.prototype.addNums = function (ele) {
    var theNumChildren = "<div class='nums' style='margin: 0px'>";
    for (var i = 0; i < 10; i++) {
        theNumChildren += '<div>' + i + '</div>';
    }
    theNumChildren += '</div>';
    $(ele).empty();
    $(ele).css('overflow','hidden');
    $(ele).append($(theNumChildren));
}
NumbersEffect.prototype.init = function (ele) {
    if(this.timer){
        this.end();
    }
    this.theNumMap = [];
    var me = this;
    $('.num-contain').each(function () {
        me.addNums(this);
        var theNum = $(this).data('num') || 0;
        var theStart = $(this).data('start', 0);
        var theHeight=$(this).height();
        me.theNumMap.push({
            obj: this,
            num: theNum,
            height:theHeight,
            start: 0
        });
    });

    this.timer=setInterval(function () {
        if(!me.isPause&& me.next()){
            me.end();
        }
    },50);
}
NumbersEffect.prototype.next = function () {
    var hasFinish = true;
    if (!this.theNumMap || this.theNumMap.length == 0) {
        return true;
    }
    for (var item of this.theNumMap) {
        //debugger;
        var theCur = item;
        var theElement = item.obj;
        var theNum = theCur.num;
        var theStart = theCur.start||0;
        var theHeight=theCur.height;
        if (theStart <= theNum) {
            //debugger;
            console.log(theStart,theNum,theStart*theHeight);
            $(theElement).find('.nums').css('margin-top', -(theStart*10*theHeight)/10 + 'px');
           // theStart = (theStart + 0.2);
            //theCur.start = theStart;
            theCur.start=(theCur.start*10+2)/10;
            if(theCur.start>theNum){
                //debugger;
            }
           // $(theElement).data('start', theStart);
            hasFinish = false;
        }
        else {
            //debugger;
        }
    }
    return hasFinish;
}

NumbersEffect.prototype.end = function () {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
    this.isPause=false;
}