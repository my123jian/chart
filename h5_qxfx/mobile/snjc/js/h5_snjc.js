var pointControl;

$(function () {
  window.mapbase = new MapBase();
  pointControl = new PlacePointView(theMap);
  var name = '广州南站';
  var pepNum = 1000;
  var defaultZoom = 16;
  var positionType = 1;
  var curPosition = '广州南站';
  var lnglat = lntlat = new AMap.LngLat(113.269391, 22.988766);
  // mapbase.drawReli(name, pepNum);
  // theMap.setZoomAndCenter(defaultZoom, lnglat);

  var thePlaceZoomObj = {  // 不同地点的缩放级别
    // '深圳西站': 18,
    // '湛江机场': 18,
    '潮汕国际机场': 16,
    // '广州北站': 18
    '广州白云国际机场': 17
  };
  var theAllList;  // 存放全部预警数据

  function init() {
    // layer.load();
    searchOnInput();
    $('#back-icon').on('click', function () {
      $('#search-box').hide();
      $('#basepage').show();
    });
    $('#place-sel').on('click', function () {
      console.log(123);
      $('#search-box').show();
      console.log(234);
      try{
        showSearchCB()
      } catch (e) {
        console.log('11',e);
      }
    });
    reqTerminalWarningList();
    reqServiceAreaWarningList();
    reqWeather(curPosition);
    tab2Li2InitEchart()
  }

  init();


  /**
   * 改变input的值
   * @param val
   */
  function changeInput1(val) {
    $('#input1').val(val);
  }

  /**
   * 显示搜索框后,加入默认的列表
   */
  function showSearchCB() {
    getResultListH();
    $('#input1').blur();
    $('#basepage').hide();
    clearResultList();
    var tabBox = $('#tab-box');
    var resultList = $('#result-list');
    var theTabLi = tabBox.find('li');
    for (var i = 0; i < theTabLi.length; i++) {
      var liDom = theTabLi[i];
      if ($(liDom).hasClass('active')) {
        console.log(i)
        var tabName = $(liDom).text();
        var theArr = pointControl.getPlacePoints(tabName);
        console.log(i)
        // return
        for (var j = 0; j < theArr.length; j++) {
          var point = theArr[j];
          var theName = point['枢纽名称'];
          console.log(theName);
          outer:
            for (var h = 0; h < theAllList.length; h++) {
              var obj = theAllList[h];
              for (var l = 0; l < obj.data.length; l++) {
                var objData = obj.data[l];
                // debugger
                if(objData.postionName===theName) {
                  // debugger
                  var liStr = '<li>' + theName + '</li>';
                  var theLiDom = $(liStr);
                  theLiDom.data('name', tabName);
                  resultLiClick(theLiDom);
                  resultList.append(theLiDom);
                  console.log('break');
                  break outer
                }
              }
            }
        }

        // for (var j = 0; j < theArr.length; j++) {
        //   var point = theArr[j];
        //   var theName = point['枢纽名称'];
        //   console.log(theName)
        //   var liStr = '<li>' + theName + '</li>';
        //   var theLiDom = $(liStr);
        //   theLiDom.data('name', tabName);
        //   // console.log(theLiDom.attr('name'));
        //   // debugger
        //   resultLiClick(theLiDom);
        //   resultList.append(theLiDom)
        // }
        // debugger
        break
      }
    }
  }

  // positionType映射
  var tabMap = {
    '铁路': 1,
    '客运站': 1,
    '机场': 1,
    '服务区': 2
  };

  /**
   * 点击搜索结果li
   */
  function resultLiClick(dom) {
    dom.on('click', function () {
      var searchBox = $('#search-box');
      var theText = $(this).text();
      var theTabName = $(this).data('name');
      var type = tabMap[theTabName];
      // debugger
      if (!type) {
        console.log('没有找到类型');
        return
      }
      positionType = type;
      curPosition = theText;
      changeInput1(curPosition);
      goToPointByName(curPosition);
      tab2Li2Echart1reqData(returnDate());

      searchBox.hide();
      $('#basepage').show();

    })
  }

  /**
   * 根据名字移动到地点
   * @param name 地点名称
   */
  function goToPointByName(name) {
    var floorMsg = $('#floor-msg');
    floorMsg.hide();
    // debugger
    var clickTarget = pointControl.findPointByName(name);
    if (!clickTarget) {
      console.log('没有匹配的地点:', clickTarget);
      return
    }
    // debugger
    if (clickTarget) {
      // console.log(clickTarget)
      var lng = clickTarget['地址'][0].lnglat.split(',')[0];
      var lat = clickTarget['地址'][0].lnglat.split(',')[1];
      var arg = {
        P: lat,
        R: lng,
        lat: lat,
        lng: lng
      };
      var theZoom = thePlaceZoomObj[name] || 17;
      // debugger
      pointControl.MoveToPoint(arg, theZoom);
      reqWeather(name);
      reqReliData(name);
      var resultObj = getStatus(name);
      try {
        $('#color-div').attr('class', resultObj.color);
        $('#status-font').text(resultObj.status);
      }
      catch (err) {
        console.log('没有预警数据');
      }
      // getYJData()
    }
  }

  /**
   * 动态给搜索结果box高度
   */
  function getResultListH() {
    var searchBox = $('#search-box');
    var sHeader = $('.s-header');
    var tabBox = $('#tab-box');
    var resultList = $('#result-list');
    var rlOuter = $('#rl-outer');
    // console.log(searchBox.height(),sHeader.outerHeight(),tabBox.outerHeight());
    var theH = searchBox.height() - sHeader.outerHeight() - tabBox.outerHeight();
    // debugger
    rlOuter.height(theH);
    // console.log(rlOuter.height())
  }

  /**
   * 清空搜索列表
   */
  function clearResultList() {
    var resultList = $('#result-list');
    resultList.empty();
  }
  /**
   * 两个预警列表是否已加载
   * @returns {Number}
   */
  function YJIsLoaded() {
    var theLen;
    var tLen = TerminalWarningList.length;
    var sLen = ServiceAreaWarningList.length;
    // debugger
    // if(nowTab===tabArr[0]) {
    //   theLen = tLen
    // } else if (nowTab===tabArr[1]) {
    //   theLen = sLen
    // }
    // return theLen
    return tLen && sLen
  }

  /**
   * 获取地点的状态
   * @param name
   */
  function getStatus(name) {
    var theList;
    if (positionType === 1) {
      theList = TerminalWarningList;
    } else {
      theList = ServiceAreaWarningList;
    }
    // debugger
    for (var i = 0; i < theList.length; i++) {
      var obj = theList[i];
      for (var j = 0; j < obj.data.length; j++) {
        var dataObj = obj.data[j];
        // debugger
        if (dataObj.postionName == name) {
          var resultObj = {
            status: obj.name,
            color: obj.color
          };
          // debugger
          return resultObj
        }
      }
    }
  }

  /**
   * 请求天气数据
   * @param name
   */
  function reqWeather(name) {
    var url = 'postionAreaWeather/getPostionAreaWeather.do?postionName=' + name;
    $.axpost(url, {}, function (data) {
      // debugger
      if (data.isSuccess && data.data.length) {
        // debugger
        var theData = data.data[0];
        // console.log(theData);
        var theIconMap = {
          "阵雨": "小雨"
        };
        var weatherName;
        $('#weather').text(theData.WEATHER_TYPE_12);
        // $('#wind').text('' + theData.WIND_DIRECTION_12);
        var minTemp = parseFloat(theData.MIN_TEMP_24);
        var maxTemp = parseFloat(theData.MAX_TEMP_24);
        var averageTemp = (minTemp + maxTemp) / 2;
        // $('#temperature').text(theData.MIN_TEMP_24 + '℃ - ' + theData.MAX_TEMP_24 + '℃');
        $('#temperature').text(averageTemp.toFixed(1) + '℃');

        // $('#weather-date').text(theData.DDATETIME.split(' ')[0]);
        $('#wind-speed').text(theData.WIND_SPEED_12);
        weatherName = theData.WEATHER_TYPE_12;
        if (weatherName == '阵雨') {
          weatherName = theIconMap['阵雨']
        }
        var imgUrl = 'mobile/snjc/img/weather/' + weatherName + '.png';
        $('#weather-img').attr('src', imgUrl);
      }
    })
  }

  var TerminalWarningList = [], ServiceAreaWarningList = [];
  var tab0Time, tab1Time;  // 记录枢纽,服务区预警初始化时间

  /**
   * 请求枢纽预警数据
   */
  function reqTerminalWarningList() {
    // var isLoading = layer.load();
    var url, keyName, theNumKey;
    // url = 'terminal/getTerminalWarningList.do';
    url = 'terminal/getTerminalWarningListApp.do';
    keyName = 'listTerminal';
    theNumKey = 'userCnt';

    $.ajax({
      type: "POST",
      url: serviceBase + url,
      data: {},
      dataType: "json",
      success: function (data) {
        // console.log('reqRoadData',data)
        // clearYjUL();
        tab0Time = new Date();
        TerminalWarningList = [];
        if (data && data.isSuccess) {

          var ss = {
            name: '舒适',
            color: 'color-div1',
            pointClass: 'point3',
            data: data.data[keyName + '_ss'],
          };
          var sz = {
            name: '适中',
            color: 'color-div2',
            pointClass: 'point2',
            data: data.data[keyName + '_sz'],

          };
          var yj = {
            name: '拥挤',
            color: 'color-div3',
            pointClass: 'point1',
            data: data.data[keyName + '_yj']
          };

          var dataArr = [ss, sz, yj];
          TerminalWarningList = dataArr;
          goToPointByName(curPosition);
          var isLoaded = YJIsLoaded();
          if (isLoaded) {
            //   debugger
            theAllList = ServiceAreaWarningList.concat(TerminalWarningList);
            searchTabBindClick();
            layer.closeAll();
          }
        }
      }
    });
  }

  /**
   * 请求服务区预警数据
   */
  function reqServiceAreaWarningList() {
    var url, keyName, theNumKey;
    // url = 'serviceArea/getServiceAreaWarningList.do';
    url = 'serviceArea/getServiceAreaWarningListApp.do';
    keyName = 'listServiceArea';
    theNumKey = 'userCnt';

    $.ajax({
      type: "POST",
      url: serviceBase + url,
      data: {},
      dataType: "json",
      success: function (data) {
        // console.log('reqRoadData',data)
        // clearYjUL();
        tab1Time = new Date();
        ServiceAreaWarningList = [];
        if (data && data.isSuccess) {

          var ss = {
            name: '舒适',
            color: 'color-div1',
            pointClass: 'point3',
            data: data.data[keyName + '_ss'],
          };
          var sz = {
            name: '适中',
            color: 'color-div2',
            pointClass: 'point2',
            data: data.data[keyName + '_sz'],

          };
          var yj = {
            name: '拥挤',
            color: 'color-div3',
            pointClass: 'point1',
            data: data.data[keyName + '_yj']
          };


          var dataArr = [ss, sz, yj];
          ServiceAreaWarningList = dataArr;
          var isLoaded = YJIsLoaded();
          if (isLoaded) {
            //   debugger
            theAllList = ServiceAreaWarningList.concat(TerminalWarningList);
            searchTabBindClick();
            layer.closeAll()
          }
        }
      }
    });

  }


  /**
   * tab绑定点击
   */
  function searchTabBindClick() {
    // debugger
    var tabBox = $('#tab-box');
    var resultList = $('#result-list');
    var theTabLi = tabBox.find('li');
    // debugger
    for (var i = 0; i < theTabLi.length; i++) {
      var tab = theTabLi[i];
      $(tab).on('click', function () {
        for (var k = 0; k < theTabLi.length; k++) {
          var theTab = theTabLi[k];
          $(theTab).removeClass('active');
        }
        $(this).addClass('active');

        var tabName = $(this).text();
        // debugger
        clearResultList();
        var theText = $(this).text();
        var theArr = pointControl.getPlacePoints(theText);
        // debugger
        for (var j = 0; j < theArr.length; j++) {
          var point = theArr[j];
          var theName = point['枢纽名称'];
          outer:
          for (var h = 0; h < theAllList.length; h++) {
            var obj = theAllList[h];
            for (var l = 0; l < obj.data.length; l++) {
              var objData = obj.data[l];
              // debugger
              if(objData.postionName===theName) {
                // debugger
                var liStr = '<li>' + theName + '</li>';
                var theLiDom = $(liStr);
                theLiDom.data('name', tabName);
                resultLiClick(theLiDom);
                resultList.append(theLiDom);
                break outer
              }
            }
          }
        }
      })
    }
  }

  MapBase.IsFloorVisible = function () {
    var theName = ['深圳北站', '广州南站', '广州白云国际机场', '深圳宝安国际机场', '广州站'];
    //debugger;
    for (var i = 0; i < theName.length; i++) {
      if (curPosition == theName[i]) {
        return true;
      }
    }
    return false;
  };

  MapBase.OnFloorClick = function (name) {
    // debugger;
    var isTheReliFloor = filterFloor(name);
    if (!isTheReliFloor) {
      mapbase.hideReli();
      return;
    }
    floorClick(name);
  };

  var theFloorMap = {
    '深圳北站F1': '深圳北站1-2F',
    '深圳北站F2': '深圳北站1-2F',
    // '广州南站地铁站厅': '广州南站B1F',
    // '广州南站一楼进出站层': '广州南站1F',
    // '广州南站2F': '广州南站2F',
    // '广州南站候车层': '广州南站3F',
    '广州南站B1': '广州南站B1F',
    '广州南站1F': '广州南站1F',
    '广州南站2F': '广州南站2F',
    '广州南站3F': '广州南站3F',

    '深圳宝安国际机场F1': '深圳宝安国际机场1F',
    '深圳宝安国际机场F2': '深圳宝安国际机场2F',
    '深圳宝安国际机场F3': '深圳宝安国际机场3F',
    '深圳宝安国际机场F4': '深圳宝安国际机场4-5F',
    '深圳宝安国际机场F5': '深圳宝安国际机场4-5F',
    '广州白云国际机场1F': '广州白云区机场-1F',
    '广州白云国际机场2F': '广州白云区机场-2F',
    '广州白云国际机场3F': '广州白云区机场-3F',
    '广州白云国际机场4F': '广州白云区机场-4F',
    '广州白云国际机场F1': '广州白云区机场-1F',
    '广州白云国际机场F2': '广州白云区机场-2F',
    '广州白云国际机场F3': '广州白云区机场-3F',
    '广州白云国际机场F4': '广州白云区机场-4F',

  };
  var theFloorMsg = {  // 楼层别名map
    '广州南站1F': '一楼进出站层',
    '广州南站3F': '候车层',
    '广州南站B1': '地铁站厅',
    '深圳北站F1': '一楼进出站层',
    '深圳北站F2': '商业区',
    '深圳宝安国际机场F1': '国际到达厅',
    '深圳宝安国际机场F2': '国内到达厅',
    '深圳宝安国际机场F3': '候机厅',
    '深圳宝安国际机场F4': '值机厅',
    '深圳宝安国际机场F5': '餐饮区',

    '广州白云国际机场1F': '到达接机厅',
    '广州白云国际机场2F': '到达中转厅',
    '广州白云国际机场3F': '出发候机厅',
    '广州白云国际机场4F': '贵宾服务',
    '广州白云国际机场F1': '到达接机厅',
    '广州白云国际机场F2': '到达中转厅',
    '广州白云国际机场F3': '出发候机厅',
    '广州白云国际机场F4': '贵宾服务',

  };

  /**
   * 处理楼层点击
   * name 楼层名,例如1F
   */
  function floorClick(name) {
    // var fullName;
    var fullName = curPosition + name;
    var floorMsg = $('#floor-msg');

    var theMapName;
    console.log('楼层:',fullName);
    // debugger
    // return
    theMapName = theFloorMap[fullName];
    if(!theMapName) {
      console.log('没有对应的楼层名字!');
      return
    }
    reqReliData(theMapName, true);

    var floorName = theFloorMsg[fullName];
    if(!floorName) {
      console.log('没有楼层别名!');
      return
    }
    floorMsg.show();
    floorMsg.text(floorName);


  }

  /**
   * 区分不用显示热力楼层
   * floorName 楼层名字
   */
  function filterFloor(floorName) {

    // 不显示热力的楼层
    var hideReliFloorOArr = ['广州南站2F', '广州南站3A', '广州南站B2', '深圳北站-1F', '广州白云国际机场B1'];
    // debugger
    var theName = curPosition + floorName;
    for (var i = 0; i < hideReliFloorOArr.length; i++) {
      var nameItem = hideReliFloorOArr[i];
      if (nameItem === theName) {
        return false
      }
    }
    return true
  }

  // 监听搜索input输入
  function searchOnInput() {
    $('#search').on('input', function () {
      // console.log($(this).val());
      var resultList = $('#result-list');
      resultList.empty();
      var v = $(this).val().trim();
      console.log(v);

      if (!v) {
        console.log('搜索值不能为空');
        // resultList.hide();
        showSearchCB();
        return
      }
      var markerArr = pointControl.PlacePoints;
      var resultArr = [];
      // debugger
      for (var i = 0; i < markerArr.length; i++) {
        var m = markerArr[i];
        // debugger
        if (!m['枢纽名称']) {
          console.log('名字不对');
          continue
        }
        if (v === m['枢纽名称'].substr(0, v.length)) {
          console.log(m['枢纽名称']);
          resultArr.push(m['枢纽名称'])
          // debugger
        }
      }
      // console.log(resultArr);

      // debugger
      if (!resultArr) {
        console.log('没符合条件的值');
        resultList.hide();
        return
      }
      for (var j = 0; j < resultArr.length; j++) {
        // console.log(j);

        var r = resultArr[j];
        var theLi = $('<li>' + r + '</li>');
        var that = this;
        theLi.on('click', function () {
          $(that).val('');

          var searchBox = $('#search-box');
          var theText = $(this).text();
          var type = pointControl.getPointType(theText);
          type = tabMap[type];
          // debugger
          if (!type) {
            console.log('没有找到类型');
            return
          }
          positionType = type;
          curPosition = theText;
          changeInput1(curPosition);
          goToPointByName(curPosition);
          tab2Li2Echart1reqData(returnDate());

          searchBox.hide();
          $('#basepage').show();

        });
        // debugger
        // console.log(resultList);

        resultList.append(theLi);
        resultList.show()
      }
    });

  }

  /**
   * 请求热力数据
   * @param name
   */
  function reqReliData(name) {
    // debugger
    var url;
    if (positionType === 1) {
      url = 'terminal/selectTerminalFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + name;
    }
    if (positionType === 2) {
      url = 'serviceArea/selectServiceFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + name;
    }
    $.axpost(url, {}, function (data) {
      // console.log(data);
      // debugger
      if (data.isSuccess && !isEmptyObject(data.data)) {
        var pepNum = data.data.userCnt;
        // var theName = data.data.postionName;
        // var theData,infoWindow;
        // var lnglat = pointControl.findPointPosition(curPosition).split(',').map(function (t) { return parseFloat(t) });

        // debugger
        // return
        // if (isCLickFloor) {
        //   theData = {
        //     name: theName,
        //     data1: '当前楼层人数: ' + pepNum + '人',
        //     data2: ''
        //   };
        //   infoWindow = new AMap.InfoWindow({
        //     isCustom: true,  //使用自定义窗体
        //     content: createInfoWindow(theData),
        //     // content: createInfoWindow2(theData),
        //     offset: new AMap.Pixel(11, 0),
        //     position: new AMap.LngLat(lnglat[0],lnglat[1])
        //   });
        //   infoWindow.open(theMap);
        // } else {
        //   // debugger
        //   theData = {
        //     name: theName,
        //     data1: '当前人数: ' + pepNum + '人',
        //     data2: ''
        //   };
        //   infoWindow = new AMap.InfoWindow({
        //     isCustom: true,  //使用自定义窗体
        //     content: createInfoWindow(theData),
        //     // content: createInfoWindow2(theData),
        //     offset: new AMap.Pixel(11, 0),
        //     position: new AMap.LngLat(lnglat[0],lnglat[1])
        //   });
        //   infoWindow.open(theMap);
        // }
        mapbase.drawReli(name, pepNum);
      }
    })
  }

  var tab2Li2Echart1;

  function tab2Li2InitEchart() {
    var SSKL = $('#chart');
    if (!tab2Li2Echart1) {
      tab2Li2Echart1 = echarts.init(SSKL[0]);
    }
    option = null;
    var date = [];

    for (var i = 0; i < 25; i++) {  // 时间(小时)
      date.push(i);
    }

    option = {
      title: {
        show: false,
        text: '实时客流趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
        }
      },
      tooltip: {  // 提示框样式
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        // formatter: "{c}人",
        formatter: function (params) {
          console.log(params)
          return params[params.length - 1].data[1] + '人';
        },
        backgroundColor: '#065f89',
        padding: 10,
        borderColor: '#28eefb',
        borderWidth: 1,
        axisPointer: {
          lineStyle: {
            color: '#68e5ff'
          }
        },
        show: false
      },
      grid: {
        left: '5%',
        right: '15%',
        bottom: '5%',
        top: '15%',
        // height: 400,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时点',
        data: date,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
        axisLabel: {
          interval: 3
        }
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
        // 分割线
        splitLine: {
          show: false
        },
        // min: 0,
        // max: 50000,
        // interval: 10000
      },
      series: [
        {
          name: '实时客流',
          type: 'line',
          smooth: true,
          symbol: 'none',
          // stack: 'a',
          label: {
            normal: {
              show: false
            }
          },
          // 填充区域样式
          areaStyle: {
            normal: {
              // color: 'rgb(62,139,230)',
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#68e5ff' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: 'rgb(62,139,230)',
          },
          data: [],
        }
      ]
    };

    tab2Li2Echart1reqData(returnDate());

    if (option && typeof option === "object") {
      tab2Li2Echart1.setOption(option, true);
    }
  }

  function tab2Li2Echart1reqData(date) {
    var url;
    tab2Li2Echart1.showLoading();    //加载动画
    if (positionType == 1) {
      url = 'terminal/selectTerminalFlowTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + date;
    } else {
      url = 'serviceArea/selectServiceFlowTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + date;
    }
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab2Li2InitEchart',data);
        var d = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            var tempArr = obj.countTime.split('-');
            var hour = strDelZero(tempArr[tempArr.length - 1]);
            var objArr = [hour, obj.userCnt];
            d.push(objArr);
          }
        }
        // console.log(d);

        // debugger
        tab2Li2Echart1.hideLoading();    //隐藏加载动画
        tab2Li2Echart1.setOption({
          series: [
            {
              name: '实时客流',
              data: d
            }
          ]
        })

        tab2Li2Echart1.resize();

      }
    });
  }
});