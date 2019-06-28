export default {
    data: {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    name: "",
                    center: [],
                },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: []
                }
            }
        ]
    },
    regions: [],
    getRegion() {
        return this.regions;
    },
    convertData(data) {
        var theResult = {
            type: "FeatureCollection",
            features: []
            // features: [
            //     {
            //         type: "Feature",
            //         properties: {
            //             name: "",
            //             center: [],
            //         },
            //         geometry: {
            //             type: "MultiPolygon",
            //             coordinates: []
            //         }
            //     }
            // ]
        };
        if (data.children) {
            for (var i = 0; i < data.children.length; i++) {
                var theItem = data.children[i];
                var theItemFeature =
                    {
                        type: "Feature",
                        properties: {
                            name: theItem.name,
                            // center: [],
                        },
                        geometry: {
                            type: "MultiPolygon",
                            coordinates: []
                        }
                    };
                theResult.features.push(theItemFeature);
                var theArrayResult=[];
                for (var j = 0; j < theItem.boundaries.length; j++) {
                    var theBoundaryItem = theItem.boundaries[j];
                    if (theBoundaryItem&&theBoundaryItem.length) {
                        var theBoundaryResult = theBoundaryItem.map(m => [m.lng, m.lat]);
                        if(theBoundaryResult[0][0]!=theBoundaryResult[theBoundaryResult.length-1][0]){
                            theBoundaryResult.push(theBoundaryResult[0]);
                        }
                        theArrayResult.push(theBoundaryResult);
                    }
                    else {
                        theArrayResult .push([theBoundaryItem.lng, theBoundaryItem.lat]);
                    }

                }
                theItemFeature.geometry.coordinates.push(theArrayResult);


            }
        }
        return theResult;
    },
    queryRegion(level, name, adCode, callback) {

        var levels = ['province', 'city', 'district'];
        var opts = {
            subdistrict: 1,   //获取边界不需要返回下级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
        };
        var district = new AMap.DistrictSearch(opts);

        district.setLevel(level)
        var me = this;
        district.search(name, function (status, result) {
            //debugger;
            console.log("查询数据", name);
            if (!result.districtList || result.districtList.length <= 0) {
                callback && callback();
                return;
            }
            var theResult = result.districtList[0];
            var theBoundaries = theResult.boundaries;
            var theCener = theResult.center;
            var theName = theResult.name;
            var theLevel = theResult.level;
            var theAdCode = theResult.adcode;
            var theParentCode = adCode || "";
            var theResultData = {
                boundaries: theBoundaries,
                center: theCener,
                name: theName,
                level: theLevel,
                adcode: theAdCode,
                parentCode: theParentCode
            };
            me.regions.push(theResultData);
            //debugger;
            // debugger;
            if (theResult['districtList'] == undefined) {
                callback && callback();
                return;
            }
            if (level == "district") {
                callback && callback();
                return;
            }
            for (var i = 0; i < theResult.districtList.length; i++) {
                var theItem = theResult.districtList[i];

                me.queryRegion(theItem.level, theItem.name, theAdCode, callback);
            }
            callback && callback();
        });
    }
}