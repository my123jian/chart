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
                    if(datas[i]>theMinValue){
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

    var point = new AMap.LngLat(116.566298, 40.014179)
    var ring = [
        new AMap.LngLat(116.169465,39.932670),
        new AMap.LngLat(116.160260,39.924492),
        new AMap.LngLat(116.186138,39.879817),
        new AMap.LngLat(116.150625,39.710019),
        new AMap.LngLat(116.183198,39.709920),
        new AMap.LngLat(116.226950,39.777616),
        new AMap.LngLat(116.421078,39.810771),
        new AMap.LngLat(116.442621,39.799892),
        new AMap.LngLat(116.463478,39.790066),
        new AMap.LngLat(116.588276,39.809551),
        new AMap.LngLat(116.536091,39.808859),
        new AMap.LngLat(116.573856,39.839643),
        new AMap.LngLat(116.706380,39.916740),
        new AMap.LngLat(116.657285,39.934545),
        new AMap.LngLat(116.600293,39.937770),
        new AMap.LngLat(116.540039,39.937968),
        new AMap.LngLat(116.514805,39.982375),
        new AMap.LngLat(116.499935,40.013710),
        new AMap.LngLat(116.546520,40.030443),
        new AMap.LngLat(116.687668,40.129961),
        new AMap.LngLat(116.539697,40.080659),
        new AMap.LngLat(116.503390,40.058474),
        new AMap.LngLat(116.468800,40.052578)
    ];
    var isPointInRing = AMap.GeometryUtil.isPointInRing(point,ring);
})