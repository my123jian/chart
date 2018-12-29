/**
 * 视图的基类添加定时刷新和数据获取的支持
 * @constructor
 */

function PageViewBase(frameElement) {
    var frameElement = frameElement;
    this.timer = null;
    this.interval = 1000 * 60 * 5;
    this.currentTick = 0;
    this.isPause = false;
    this.eventListens = {}; //事件监听器
    //this.serviceBase="http://192.168.3.116:8080/gdcnymot/";
    // this.serviceBase = "http://localhost/gdcnymot/";
    this.serviceBase = serviceBase;
    this.initExtend();
    var theUrlMap = {
        "test": "qxjc.html",
        "insight": "qxdc.html",
        "bridge": "gzadq.html",
        "strait": "qzhx.html",
    };
    if (parent) {
        $(function () {
            $(document.body).css('background-image', 'transparent');
        });
    }
    $('.topbutton').click(function () {
        if ($(this).hasClass('active')) {
            return;
        }
        $('.topbutton').removeClass('active');
        $(this).addClass('active');
        if ($(this).hasClass('test')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['test']);
            }
            else {
                location.href = theUrlMap['test'];
            }

        }
        if ($(this).hasClass('insight')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['insight']);
            }
            else {
                location.href = theUrlMap['insight'];
            }
        }
        if ($(this).hasClass('bridge')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['bridge']);
            }
            else {
                location.href = theUrlMap['bridge'];
            }
        }
        if ($(this).hasClass('strait')) {
            if (frameElement) {
                $('#' + frameElement).attr('src', theUrlMap['strait']);
            }
            else {
                location.href = theUrlMap['strait'];
            }
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
        if (theItem.name + "市" == cityName || theItem.name == cityName) {
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
    var theStartIndex = pagesize * (index || 0);
    var theEndIndex = pagesize * (index || 0) + pagesize;
    $(theTableBody).empty();
    var datas = data || [];
    var index = 0;
    var theTemArrays = [];
    for (var i = theStartIndex; i < theEndIndex; i++) {
        if (i >= datas.length) {
            break;
        }
        var data = datas[i];
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
    $(theTableBody).data('data', datas);
    var thePageNum = Math.floor(datas.length / pagesize) + (datas.length % pagesize > 0 ? 1 : 0);
    var thePageDiv = $('#' + theTableId).closest('.table-div').next('.page');
    $(thePageDiv).empty();
    var me = this;
    for (var i = 1; i <= thePageNum; i++) {
        var select = 'select';
        if (i != pageindex + 1) {
            select = '';
        }
        var thePageText = ` <div class="page-item-${i} data-page='${i - 1}' page-item ${select}"></div>`;
        var thePageItem = $(thePageText);
        $(thePageItem).unbind().click(function () {
            $(thePageDiv).find('.page-item').removeClass('select');
            $(this).addClass('select');
            var thePageIndex = $(this).data('page');
            me.loadTemplateTable(theTableId, datas, thePageIndex, pagesize);
        });
        $(thePageDiv).append(thePageItem);
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
PageViewBase.prototype.getRandomPoints=function(bounds,value,max){
    var thePorints = bounds;
    max=max||1000;
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
    var theCurrentValue=value;
    var theShowList=[];
    var theMinValue=Math.ceil(value/max);
    var list = theValidPoints.map(function (item) {
        var theTempValue = 0;
        if (theCurrentValue <= 10) {
            theTempValue = theCurrentValue;
        }
        else {
            theTempValue = Math.floor(Math.RandomRange(theMinValue, theMinValue*2));
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
PageViewBase.prototype.drawRelis=function(reliDatas,r){
    if (!this.heartLayer) {
        var map = Loca.create(this.theMap);
        this.heartLayer = Loca.visualLayer({
            container: map,
            type: 'heatmap',
            // 基本热力图
            shape: 'normal'
        });
    }
    var theShowList=[];
    if(reliDatas&&reliDatas.length>0){
        for(var i=0;i<reliDatas.length;i++){
            var theItem=reliDatas[i];
            var theBounds=theItem.bounds;
            var theData=theItem.data;
            var theMaxPoint=theItem.max||1000;
            theShowList=  theShowList.concat(this.getRandomPoints(theBounds,theData,theMaxPoint));
        }
    }
    this.heartLayer.setData(theShowList, {
        lnglat: 'coordinate',
        value: 'count'
    });

    this.heartLayer.setOptions({
        style: {
            radius: r||10,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.7: '#ffffbf',
                0.9: '#fde468',
                1.0: '#d7191c'
            }
        }
    });

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
            center: id == 1 ? [114.067447, 22.33259] : [110.427377, 20.260057],//港珠澳大桥

            //center:[110.322391,20.146053 ],//琼州海峡 //lat: 20.146053  lng: 110.322391

            //center: [113.275824, 22.994826],
            features: ['bg', 'building', 'point', 'road'],//['all'],// ['bg', 'building','point'],
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

    //地图加载完成事件
    theMap.on('complete', function () {
        var bounds = theMap.getBounds();
        theMap.setLimitBounds(bounds);
        console.log("地图加载完成!");
    });
    //监听放大缩小事件
    theMap.on('zoom', function (arg) {
        var theZoom = theMap.getZoom();
        if (theZoom >= 12) {
            console.log("显示点");
            theMap.setFeatures(['bg', 'road']);// 'building', 'point'
            theInnerLayer && theInnerLayer.setzIndex(1000);
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

/**
 * 加载数据天气
 * @param date
 * @param type
 * @param callback
 */
PageViewBase.prototype.loadWeather = function (date, type) {
    var theCallUrl = "/bridge/weather.do";
    var theCallArgument = {}
    var me = this;
    // debugger;
    this.load(theCallUrl, theCallArgument, function (data) {

        if (data && data.isSuccess) {
            me.loadWeatherView(data);
        }
        else {
            console.log("loadWeather:" + data);
        }
    });
}

/***
 * 加载天气表格数据
 * @param data
 */
PageViewBase.prototype.loadWeatherView = function (data) {
    data = data || [];
    var theIndex = 0;
    $('.left-weather, .weather-content ul li').each(function () {
        var theFields = $(this).find('.field');
        var theItem = data[theIndex] || {};
        $(theFields[0]).text(theItem['date'] || '暂无');
        $(theFields[1]).text(theItem['wendu'] || '暂无');
        $(theFields[2]).text(theItem['fengli'] || '暂无');
        $(theFields[3]).text(theItem['kejiandu'] || '暂无');
        $(theFields[4]).text(theItem['jiangshui'] || '暂无');
        theIndex += 1;
    })


    /*date:2018年12月28日
    wendu:25℃
fengli:东风2级
    kejiandu:12公里
    jiangshui:0毫米*/
}

PageViewBase.prototype.addMarker = function (name, lng, lat, value) {
    this.markers = this.markers || {};
    var content = '<div class="marker-route marker-marker-point"></div><div class="infowindow" style="color:#ddf3ff">' +
        '<div class="first">实时客流</div><div class="second">' + (value || 0) + '万</div></div><div style="text-align: center;color: #ddf3ff;    margin-left: -52px;\n' +
        '    width: 198px;\n' +
        '    display: inline-block;font-size: 24px;\n' +
        '    margin-top: 5px;">' + name + '</div>';

    if(!this.markers[name]){
        var marker = new AMap.Marker({
            content: content,  // 自定义点标记覆盖物内容
            position: [lng, lat], // 基点位置
            offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
        });
        this.theMap.add(marker);
        this.markers[name] = marker;
    }
    else{
        this.markers[name].setContent(content);
    }
    return this.markers[name];
}

PageViewBase.prototype.addMarker2 = function (name, lng, lat, value) {
    this.markers = this.markers || {};


    var content = '<div class="infowindow" style="color:#ddf3ff">' +
        '<div class="first">实时客流</div><div class="second">' + (value || 0) + '万</div></div><div class="marker-route marker-marker-point"></div><div style="text-align: center;color: #ddf3ff;    margin-left: -52px;\n' +
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
    else{
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
