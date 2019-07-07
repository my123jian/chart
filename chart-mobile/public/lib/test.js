var map = new AMap.Map('container', {
    zoom: 4
});
//just some colors
var colors = [
    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
    "#651067", "#329262", "#5574a6", "#3b3eac"
];

AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {

    //创建一个实例
    var districtExplorer = window.districtExplorer = new DistrictExplorer({
        eventSupport: true, //打开事件支持
        map: map
    });

    //当前聚焦的区域
    var currentAreaNode = null;

    //鼠标hover提示内容
    var $tipMarkerContent = $('<div class="tipMarker top"></div>');

    var tipMarker = new AMap.Marker({
        content: $tipMarkerContent.get(0),
        offset: new AMap.Pixel(0, 0),
        bubble: true
    });

    //根据Hover状态设置相关样式
    function toggleHoverFeature(feature, isHover, position) {

        tipMarker.setMap(isHover ? map : null);

        if (!feature) {
            return;
        }

        var props = feature.properties;

        if (isHover) {

            //更新提示内容
            $tipMarkerContent.html(props.adcode + ': ' + props.name);
            //更新位置
            tipMarker.setPosition(position || props.center);
        }

        $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover);

        //更新相关多边形的样式
        var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
        for (var i = 0, len = polys.length; i < len; i++) {

            polys[i].setOptions({
                fillOpacity: isHover ? 0.5 : 0.2
            });
        }
    }







    //绘制某个区域的边界
    function renderAreaPolygons(areaNode) {

        //更新地图视野
        map.setBounds(areaNode.getBounds(), null, null, true);

        //清除已有的绘制内容
        districtExplorer.clearFeaturePolygons();

        //绘制子区域
        districtExplorer.renderSubFeatures(areaNode, function(feature, i) {

            var fillColor = colors[i % colors.length];
            var strokeColor = colors[colors.length - 1 - i % colors.length];

            return {
                cursor: 'default',
                bubble: true,
                strokeColor: strokeColor, //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 1, //线宽
                fillColor: fillColor, //填充色
                fillOpacity: 0.35, //填充透明度
            };
        });

        //绘制父区域
        districtExplorer.renderParentFeature(areaNode, {
            cursor: 'default',
            bubble: true,
            strokeColor: 'black', //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线宽
            fillColor: null, //填充色
            fillOpacity: 0.35, //填充透明度
        });
    }

    //切换区域后刷新显示内容
    function refreshAreaNode(areaNode) {

        districtExplorer.setHoverFeature(null);

        renderAreaPolygons(areaNode);
    }

    //切换区域
    function switch2AreaNode(adcode, callback) {

        if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
            return;
        }

        districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
            if (error) {

                if (callback) {
                    callback(error);
                }

                return;
            }

            currentAreaNode = window.currentAreaNode = areaNode;

            //设置当前使用的定位用节点
            districtExplorer.setAreaNodesForLocating([currentAreaNode]);

            refreshAreaNode(areaNode);

            if (callback) {
                callback(null, areaNode);
            }
        });


    }







    //全国
    switch2AreaNode(100000);
});