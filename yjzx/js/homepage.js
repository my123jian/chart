var pointControl;
var jamListMarkers = [];
var keyRoadDataArr = [], perPageNum = 7;
var keyRoadDataArr2 = [];

$(function () {
  var hourArr = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-24'];
  var hourArr2 = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8'];

  var ageObj = {  // 年龄组
    0: '',
    1: '0-17岁',
    2: '18-24岁',
    3: '25-34岁',
    4: '35-44岁',
    5: '45-54岁',
    6: '55岁以上'
  };
  var thePlaceZoomObj = {  // 不同地点的缩放级别
    //   '深圳西站': 19,
    //   '湛江机场': 19,
    //   '三元里收费站': 20,
    //   '莞佛高速虎门大桥': 15,
    //   '潮州汽车客运站': 19,
    //   '广州北站': 20,
    //   '广州火车站': 19,
    //   '深圳站': 19,
    //   '东莞东': 19,
    //   '虎门站': 17,
    //   '潮汕站': 17,
    //   '深圳市龙岗汽车客运站': 19,
    //   '深圳罗湖汽车客运站': 19,
    //   '深圳汽车站': 19,
    //   '芳村汽车客运站': 19,
    //   '广州汽车客运站': 19,
    //   '佛山汽车站': 19,
    //   '河源汽车总站': 19,
    //   '东莞汽车总站': 17,
    //   '潮州汽车客运站': 19,
    //   '潮汕国际机场': 15,
    //   '惠州站': 19
  };
  // var tabArr = ['客运站,铁路,机场,港口', '服务区', '收费站', '高速监测'];
  var tabArr = ['客运站,铁路,机场,港口', '服务区', '高速监测'];
  var tieluArr, gongluArr;
  var tabDomNameArr = ['#tab2', '#tab3', '#tab4'];
  var tabArrDom = tabArr.map(function (item, index) {
    return {
      name: item,
      class: tabDomNameArr[index]
    }
  });
  var whiteColor = '#FFFFFF';
  var bdColor = '#28eefb';  // 边框颜色
  var lightBoxBc = 'rgba(16,75,179,.9)';  // 框 底色
  var cldColor = '#0a214b';  // 日历
  // 记录日历的日期
  var tab2Li3Date, tab3Li3Date;
  var tab2Li2DefaultDate, tab3Li2DefaultDate, tab4Li2DefaultDate;  // 枢纽,服务区,收费站-洞察部分,默认日期
  var myTime;  // 记录高速监测初始化时间
  var tab0Time, tab1Time;  // 记录枢纽,服务区预警初始化时间
  var keyRoadTime;  // 重点路段时间
  var nowTab = tabArr[0];
  window.nowTab = nowTab;
  //postionType-位置类别：1场站，2服务区，3收费站
  var positionType = 1;
  var curPosition;  // 目前位置 点击marker 预警 变化

  // console.log(tabArrDom)
  var tabBoxes = $('.tab-box');
  var tabBoxes2 = $('#tab2 .tab-box2-li');
  var tabBoxes3 = $('#tab3 .tab-box2-li');
  var tabBoxes4 = $('#tab4 .tab-box2-li');
  var tabBoxes5 = $('#tab5 .tab-box2-li');
  var tabBoxesArr = [tabBoxes2, tabBoxes3, tabBoxes4, tabBoxes5];
  var isHideStation = true;
  var isDefaultView = true;  // 默认视角
  // console.log(tabBoxes2)
  window.mapbase = new MapBase();
  var title = $('#title');
  pointControl = new PlacePointView(window.theMap);
  var traffic = new TrafficView(theMap);
  init();
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
    //debugger;

    // hideCurLocaction();
    // var curPosDataBox = $('#cur-pos-data-box');
    // curPosDataBox.hide();
    // isHideStation = true;
    // tabBoxCur.find('.arrow.up').removeClass('dn');
    // tabBoxCur.find('.arrow.down').addClass('dn');
    closeInfoWindow();
    var isTheReliFloor = filterFloor(name);
    if (!isTheReliFloor) {
      mapbase.hideReli();
      closeInfoWindow();
      return;
    }
    floorClick(name);
  };

  /**
   * 初始化应用
   */
  function init() {
    checkLS();
    myTime = tab0Time = tab1Time = new Date();

    moment.locale('zh-cn');
    console.log('切换到:', nowTab);
    // console.log('map:', theMap);
    // 设置洞察部分默认日期
    tab2Li2DefaultDate = returnDate(1);  // 枢纽
    tab3Li2DefaultDate = returnDate(1);  // 服务区
    tab4Li2DefaultDate = returnDate(1);  // 场站

    // 点击标题
    title.on('click', function () {
      toDefaultView();
    });
    panelBindClick();
    flightBindClick();
    trainBindClick();
    fliTrendTabBindClick();
    backDivBandClick();
    weatherClick();
    tabArrowClick();
    // 点击搜索按钮  todo
    $('#search-btn').on('click', function () {
      var v = $('#search').val();
      console.log('搜索值为:', v);
    });
    // console.log($('input[type="text"]'));
    inputReadOnly();
    flightAddTime();

    // 监听搜索input输入
    $('#search').on('input', function () {
      // console.log($(this).val());
      var resultList = $('#result-list');
      resultList.empty();
      var v = $(this).val().trim();
      console.log(v);

      if (!v) {
        console.log('搜索值不能为空');
        resultList.hide();
        return
      }
      var markerArr = pointControl.markes;
      var resultArr = [];
      for (var i = 0; i < markerArr.length; i++) {
        var m = markerArr[i];
        if (v === m.C.extData['枢纽名称'].substr(0, v.length)) {
          console.log(m.C.extData['枢纽名称']);
          resultArr.push(m.C.extData['枢纽名称'])
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
          resultList.empty();
          resultList.hide();
          var name = $(this).text();
          curPosition = name;
          var curPosDataBox = $('#cur-pos-data-box');
          var tabBoxCur = $('#tab-box-cur');
          var arrows = tabBoxCur.find('.arrow');
          tabBoxCur.find('.up').addClass('dn');
          tabBoxCur.find('.down').removeClass('dn');

          curPosDataBox.hide(300);
          isHideStation = true;
          goToPointByName(name);
          // console.log('m',m.C.extData['枢纽名称']);
          // changePosText(name);
          hideTabs()
          // $('#tab-name').text($(this).text());
        });
        // debugger
        // console.log(resultList);

        resultList.append(theLi);
        resultList.show()
      }
    });

    // 左右屏切换
    $('#switch-btn').on('click', function (e) {
      e.stopPropagation();
      window.location.href = 'left.html';
    });

    // 1级tab绑定点击事件
    for (var i = 0; i < tabBoxes.length; i++) {
      var box = tabBoxes[i];
      $(box).on('click', clickTab)
    }

    // 2级tab绑定点击事件
    for (var j = 0; j < tabBoxesArr.length; j++) {
      var tArr = tabBoxesArr[j];
      tabBoxesBindClick(tArr)
    }
    arrowBindClick();
    dongchaTabBindClick();
    reqTerminalWarningList();
    reqServiceAreaWarningList();
    reqJamList();
  }

  /**
   * 实时监控-监控中心,调度中心点击 todo
   */
  function zhongxinClick() {
    var sszxArr = $('.jkzx'), ddzxArr = $('.ddzx');

  }

  /**
   * 将input元素设置为readonly
   */
  function inputReadOnly() {
    var theInputArr = $('input[type="text"]');
    for (var i = 0; i < theInputArr.length; i++) {
      var inputDom = theInputArr[i];
      $(inputDom).attr("readonly", "readonly")//将input元素设置为readonly
    }
  }

  var theFloorMap = {
    '深圳北站F1': '深圳北站1-2F',
    '深圳北站F2': '深圳北站1-2F',
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

  };

  /**
   * 处理楼层点击
   * name 楼层名,例如1F
   */
  function floorClick(name) {
    //
    var fullName = curPosition + name;
    var theMapName;
    console.log('楼层:', fullName);
    // debugger
    // return
    if (nowTab === tabArr[0]) {
      theMapName = theFloorMap[fullName];
      if (!theMapName) {
        console.log('没有对应的楼层名字!');
        return
      }
      reqReliData(theMapName, true, fullName);
    }
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

  /**
   * 请求热力数据
   * @param name 映射后的楼层名
   * @param isCLickFloor 是否点击楼层
   * @param originalName 原名
   */
  function reqReliData(name, isCLickFloor, originalName) {
    // debugger
    var url;
    if (nowTab === tabArr[0]) {
      url = 'terminal/selectTerminalFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + name;
    }
    if (nowTab === tabArr[1]) {
      url = 'serviceArea/selectServiceFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + name;
    }
    $.axpost(url, {}, function (data) {
      // console.log(data);
      // debugger
      if (data.isSuccess && !isEmptyObject(data.data)) {
        var pepNum = data.data.userCnt;
        var theName = data.data.postionName;
        var theData, infoWindow;
        var lnglat = pointControl.findPointPosition(curPosition).split(',').map(function (t) {
          return parseFloat(t)
        });
        // debugger
        // return
        if (isCLickFloor) {
          theData = {
            name: theName,
            data1: '当前楼层人数: ' + pepNum + '人',
            data2: ''
          };
          infoWindow = new AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: createInfoWindow(theData),
            // content: createInfoWindow2(theData),
            offset: new AMap.Pixel(11, 0),
            position: new AMap.LngLat(lnglat[0], lnglat[1])
          });
          infoWindow.open(theMap);
        } else {
          // debugger
          theData = {
            name: theName,
            data1: '当前人数: ' + pepNum + '人',
            data2: ''
          };
          infoWindow = new AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: createInfoWindow(theData),
            // content: createInfoWindow2(theData),
            offset: new AMap.Pixel(11, 0),
            position: new AMap.LngLat(lnglat[0], lnglat[1])
          });
          infoWindow.open(theMap);
        }
        mapbase.drawReli(name, pepNum, originalName);
        // var theZoom = thePlaceZoomObj[name] || 18;
        // debugger
        // pointControl.MoveToPoint(arg, theZoom);
      }
    })
  }

  /**
   * 查看天气的点击i
   */
  function weatherClick() {
    $('#weather-open').click(function () {
      $('.left-weather').hide();
      $('.weather-content').show()
    });
    $('#weather-close').click(function () {
      $('.weather-content').hide();
      $('.left-weather').show()
    });
  }

  function showWeather() {
    $('.weather-content').hide();
    $('#left-weather').show()
  }

  function hideWeather() {
    $('.weather-content').hide();
    $('#left-weather').hide()
  }

  /**
   * 请求天气数据
   * @param name
   */
  function reqWeather(name) {
    showWeather();
    var url = 'postionAreaWeather/getPostionAreaWeather.do?postionName=' + name;
    $.axpost(url, {}, function (data) {
      // console.log('天气:',data.data);
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
        // $('#wind').text('' + theData.WIND_DIRECTION_12 + ' , ' + theData.WIND_SPEED_12);
        $('#wind').text('' + theData.WIND_DIRECTION_12);
        $('#temperature').text(theData.MIN_TEMP_24 + '℃ - ' + theData.MAX_TEMP_24 + '℃');
        $('#weather-date').text(theData.DDATETIME.split(' ')[0]);
        $('#wind-speed').text(theData.WIND_SPEED_12);
        weatherName = theData.WEATHER_TYPE_12;
        if (weatherName == '阵雨') {
          weatherName = theIconMap['阵雨']
        }
        var imgUrl = 'yjzx/img/weather/' + weatherName + '.png';
        $('#weather-img').attr('src', imgUrl);
      }
    })
  }

  // 添加交通枢纽
  function addStation() {
    clearStation();
    showStation();
    var gonglu = '福田汽车客运站CBG|\n' +
      '龙岗长途汽车客运站|\n' +
      '罗湖汽车站|\n' +
      '深圳汽车站|\n' +
      '广东省汽车客运站|\n' +
      '广州芳村汽车客运站|\n' +
      '广州市汽车客运站|\n' +
      '广州市天河客运站|\n' +
      '茂名市客运中心站|\n' +
      '香洲长途站|\n' +
      '佛山汽车站|\n' +
      '河源汽车总站|\n' +
      '中山汽车总站|\n' +
      '中山小榄客运站|\n' +
      '江门汽车客运站|\n' +
      '惠州汽车总站|\n' +
      '东莞汽车总站|\n' +
      '东莞长安车站|\n' +
      '潮州汽车客运站|\n' +
      '清远汽车客运站';

    var tielu = '深圳北站|\n' +
      '深圳西站|\n' +
      '深圳站|\n' +
      '广州北站|\n' +
      '广州东站|\n' +
      '广州南站|\n' +
      '广州站|\n' +
      '惠州站|\n' +
      '东莞东|\n' +
      '东莞站|\n' +
      '虎门站|\n' +
      '潮汕站|\n' +
      '佛山西站|\n' +
      '珠海站'

    var shuiluminhang = '深圳宝安国际机场|\n' +
      // '湛江徐闻海安港|\n' +
      '白云国际机场二号航站楼|\n' +
      '广州白云国际机场|\n' +
      '湛江机场|\n' +
      '揭阳机场'

    tieluArr = tielu.trim().split('|').map(function (t2) {
      return t2.replace(/[\r\n]/g, "")
    });
    // debugger
    gongluArr = gonglu.trim().split('|').map(function (t2) {
      return t2.replace(/[\r\n]/g, "")
    });
    var shuiluminhangArr = shuiluminhang.trim().split('|');

    // console.log(tieluArr)
    for (var i = 0; i < tieluArr.length; i++) {
      // var t = tieluArr[i].replace(/[\r\n]/g,"");
      var t = tieluArr[i];
      if (!t) {
        console.log(t);
        continue
      }
      var stationDom = $('<li>' + t + '</li>');
      stationDom.on('click', function () {
        var name = $(this).text();
        curPosition = name;
        var curPosDataBox = $('#cur-pos-data-box');
        var tabBoxCur = $('#tab-box-cur');
        var arrows = tabBoxCur.find('.arrow');
        tabBoxCur.find('.up').addClass('dn');
        tabBoxCur.find('.down').removeClass('dn');

        curPosDataBox.hide(300);
        isHideStation = true;
        hideTabs(nowTab);
        goToPointByName(name);
        // $('#tab-name').text($(this).text());
        // changePosText(name);
      });
      $('#station-box-1').find('ul').append(stationDom);
      // $('#station-box-1').find('ul').append($('<li>'+ t +'</li>'));
    }
    for (var j = 0; j < gongluArr.length; j++) {
      // console.log(1111)
      var g = gongluArr[j].replace(/[\r\n]/g, "");
      // debugger
      if (!g) {
        // console.log(t);
        continue
      }
      var stationDom2 = $('<li>' + g + '</li>');
      stationDom2.on('click', function () {
        isHideStation = true;
        var name = $(this).text();
        var curPosDataBox = $('#cur-pos-data-box');

        var tabBoxCur = $('#tab-box-cur');
        var arrows = tabBoxCur.find('.arrow');
        tabBoxCur.find('.up').addClass('dn');
        tabBoxCur.find('.down').removeClass('dn');

        curPosDataBox.hide(300);
        goToPointByName(name);
        // $('#tab-name').text($(this).text());
        // changePosText(name);
        hideTabs(nowTab);

      })
      $('#station-box-2').find('ul').append(stationDom2);
    }
    for (var k = 0; k < shuiluminhangArr.length; k++) {
      var s = shuiluminhangArr[k].replace(/[\r\n]/g, "");
      if (!s) {
        // console.log(t);
        continue
      }
      var stationDom3 = $('<li>' + s + '</li>');
      stationDom3.on('click', function () {
        isHideStation = true;
        var name = $(this).text();
        var curPosDataBox = $('#cur-pos-data-box');
        var tabBoxCur = $('#tab-box-cur');
        var arrows = tabBoxCur.find('.arrow');
        tabBoxCur.find('.up').addClass('dn');
        tabBoxCur.find('.down').removeClass('dn');
        curPosDataBox.hide(300);
        goToPointByName(name);
        // $('#tab-name').text($(this).text());
        // changePosText(name);
        hideTabs(nowTab);

      });
      $('#station-box-3').find('ul').append(stationDom3);
    }
    $('#station-box-3').find('header').text('机场、港口');
    $('#station-box-2').find('header').text('客运站');
  }

  /**
   * 遮罩div 返回默认视角
   */
  function backDivBandClick() {
    var backDiv = $('#back-div');
    backDiv.on('click', function () {
      if (!isDefaultView) {
        toDefaultView()
      }
    })
  }

  /**
   * 返回默认视角
   */
  function toDefaultView() {
    isDefaultView = true;
    pointControl.ReturnDefualt();  // 默认视角
    pointControl.showMarkers();  // 显示点标记

    traffic.removePaths();  // 清除高速路段的线
    clearCenterMarker();
    mapbase.removeHeartMap();
    hideWeather();
    hideFlightDom();
    hideTrainDom();
    hideCamTab();
    showTabs();
    hideTab2();
    hideCurLocaction();
    $('#floor').addClass('dn');
    $('#tab-name').empty();
    initCenterBG();
    showTheTabArrow()
  }

  /**
   * 2级tab绑定点击事件
   * @param boxesArr
   */
  function tabBoxesBindClick(boxesArr) {
    for (var j = 0; j < boxesArr.length; j++) {
      var b = boxesArr[j];
      $(b).on('click', function () {
        clickTab2(boxesArr, this)
      })
    }
  }

  /**
   * 隐藏特定场站的数据
   */
  function hideSpecialData() {
    $('#bao-an').addClass('dn');
    $('#tie-lu').addClass('dn');
    $('#keyunzhan').addClass('dn');
  }

  function hideTabArrow() {
    var tabArrows = $('.tab-arrow');
    for (var i = 0; i < tabArrows.length; i++) {
      var t = tabArrows[i];
      $(t).hide();
    }
  }

  /**
   * 根据名字移动到地点
   * @param name 地点名称
   */
  function goToPointByName(name) {
    // debugger
    curPosition = name;
    changePosText(name);
    hideSpecialData();
    hideTabArrow();
    hideFlightDom();
    hideTrainDom();
    initRealTimeNum();
    $('#tab-box-cur').show();

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
      var theZoom = thePlaceZoomObj[name] || 18;
      // debugger
      pointControl.MoveToPoint(arg, theZoom);
      isDefaultView = false;
      showFlightDom();
      showTrainDom();
      removeDongChaTab();
      checkCamTab();
      if (nowTab === tabArr[0] || nowTab === tabArr[1] || nowTab === tabArr[2]) {
        drawTheRectangle(name);
      }
      if (nowTab === tabArr[0] || nowTab === tabArr[1]) {
        // debugger
        reqWeather(name);
        // reqReliData(name,false);
        var thePeopleNum = getPeopleNum(name);

        var theData = {
          name: name,
          data1: '当前人数: ' + thePeopleNum + '人',
          data2: ''
        };
        var lnglat = pointControl.findPointPosition(name).split(',').map(function (t) {
          return parseFloat(t)
        });
        var infoWindow = new AMap.InfoWindow({
          isCustom: true,  //使用自定义窗体
          content: createInfoWindow(theData),
          // content: createInfoWindow2(theData),
          offset: new AMap.Pixel(11, 0),
          position: new AMap.LngLat(lnglat[0], lnglat[1])
        });
        infoWindow.open(theMap);
        mapbase.drawReli(name, thePeopleNum);
        addCamLi(name);
      }
    }
  }

  /**
   * 遍历预警数据数组,得到人数
   * @param name
   * @returns {*}
   */
  function getPeopleNum(name) {
    var theList, result;
    if (nowTab === tabArr[0]) {
      theList = TerminalWarningList;
    } else if (nowTab === tabArr[1]) {
      theList = ServiceAreaWarningList;
    }
    for (var i = 0; i < theList.length; i++) {
      var obj = theList[i];
      for (var j = 0; j < obj.data.length; j++) {
        var dataObj = obj.data[j];
        if (name === dataObj.postionName) {
          result = dataObj.userCnt;
          return result
        }
      }
    }
  }

  /**
   * 显示洞察tab
   */
  function showDongChaTab() {
    var dongchaTab = $('#tab2').find('.data-box').find('.dongcha-tab');
    for (var i = 0; i < dongchaTab.length; i++) {
      var tab = dongchaTab[i];
      $(tab).show();
    }
  }

  /**
   * 隐藏实时监控tab
   */
  function hideCamTab() {
    var n = tabArrDom.filter(function (t) {
      return t.name === nowTab
    });
    var tgtTab = $(n[0].class).find('.tab-box2-li1');
    tgtTab.addClass('vh');

  }

  /**
   * 没有摄像头的地点
   */
  function checkCamTab() {
    var nowName = curPosition;
    var n = tabArrDom.filter(function (t) {
      return t.name === nowTab
    });

    // debugger
    var tgtTab = $(n[0].class).find('.tab-box2-li1');
    var liTabBoxArr = tgtTab.find('.li-tab-box');
    for (var i = 0; i < theCamArr.length; i++) {
      var camObj = theCamArr[i];
      var camName = camObj.name;
      // console.log(nowName,camName);
      if (nowName === camName) {
        // debugger
        console.log('有摄像头');
        // tgtTab.show();
        tgtTab.removeClass('vh');
        // tgtTab.css('visibility','visible');
        // for (var j = 0; j < liTabBoxArr.length; j++) {
        //   var li = liTabBoxArr[j];
        //   debugger
        //   var oldH = $(li).css('top');
        //   oldH = parseInt(oldH);
        //   $(li).css('top',oldH-150+'px');
        // }
        return
      }
      console.log('没摄像头')
      // tgtTab.hide();
      tgtTab.addClass('vh');

      // tgtTab.css('visibility','hidden');

      // for (var j = 0; j < liTabBoxArr.length; j++) {
      //   var li = liTabBoxArr[j];
      //   var oldH = $(li).css('top');
      //   oldH = parseInt(oldH);
      //   $(li).css('top',oldH+150+'px');
      // }


    }
  }

  /**
   * 铁路-客运站 删除境外tab   机场-删除省内tab
   */
  function removeDongChaTab() {
    showDongChaTab();
    var dongchaTab = $('#tab2').find('.data-box').find('.dongcha-tab');
    var theName = curPosition, theMarkers = pointControl.markes;
    for (var i = 0; i < theMarkers.length; i++) {
      var m = theMarkers[i];
      if (theName === m.C.extData['枢纽名称']) {
        // console.log(theName)
        var mType = m.C.extData['枢纽类别'];
        if (mType !== '机场') {
          // debugger
          for (var j = 0; j < dongchaTab.length; j++) {
            var tab = dongchaTab[j];
            var theText = $(tab).text().trim();
            // console.log(theText)
            if (theText === '境外') {
              $(tab).hide();
            }
          }
        }
        if (mType === '机场') {
          for (var k = 0; k < dongchaTab.length; k++) {
            var tab2 = dongchaTab[k];
            var theText2 = $(tab2).text().trim();
            // console.log(theText)
            if (theText2 === '省内') {
              $(tab2).hide();
            }
          }
        }
      }
    }
  }

  /**
   * 服务区,消费站画线
   * @param name 地点名称
   */
  function drawTheRectangle(name) {
    for (var key in rectangleDataObj) {
      if (name === key) {
        // console.log(key);
        var theLngLatArr = rectangleDataObj[key];
        // debugger
        traffic.drawTheRectangle(theLngLatArr);
        return
      }
    }
  }

  /**
   * 航班时间选择dom添加option
   */
  function flightAddTime() {
    var theTimeArr = calTimeArr();
    var timeBoxArr = $('.time-box');
    var treDate = $('#tre-date');
    var treDate2 = $('#tre-date2');
    var treDate3 = $('#tre-date3');
    var nowDate = moment().format('YYYY/MM/DD');
    treDate.text(nowDate);
    treDate2.text(nowDate);
    treDate3.text(nowDate);
    var nowHour = moment().format('HH');
    var afterHourNum = parseInt(nowHour) + 1;
    afterHourNum = afterHourNum < 10 ? '0' + afterHourNum : afterHourNum;

    var theDefaultTimeItem = nowHour + ':00-' + afterHourNum + ':00';
    // debugger
    // var theDefaultTimeItem = '03:00-04:00';  // 默认时段
    for (var i = 0; i < timeBoxArr.length; i++) {
      var timeBoxDom = timeBoxArr[i];
      for (var j = 0; j < theTimeArr.length; j++) {
        var theTimeItem = theTimeArr[j];
        var optionStr = '<option value="' + theTimeItem + '">' + theTimeItem + '</option>';
        var optionDom = $(optionStr);
        if (theTimeItem === theDefaultTimeItem) {
          optionDom.attr('selected', 'selected');
        }
        $(timeBoxDom).find('select').append($(optionDom));
      }
    }
    // if(curPosition==='广州白云国际机场' || curPosition==='深圳宝安国际机场') {
    flightTimeBindClick();
    flightTimeBindClick2();
    // }else {
    trainTimeBindClick();
    trainTimeBindClick2();
    // }

  }

  /**
   * 航班时段点击
   */
  function flightTimeBindClick() {
    var sendTimeBox = $('#send-time-box');
    $(sendTimeBox).on('change', function () {
      console.log($(this).val());
      reqFlightData(curPosition, 'send');
    })
  }

  function flightTimeBindClick2() {
    var arrTimeBox = $('#arr-time-box');
    // var sendListUl = $('#send-list-ul');
    // var sendFooter = $('#send-paging');
    $(arrTimeBox).on('change', function () {
      console.log($(this).val());
      reqFlightData(curPosition, 'arr');
    })
  }

  function trainTimeBindClick() {
    var sendTimeBox = $('#send-time-box2');
    $(sendTimeBox).on('change', function () {
      console.log($(this).val());
      reqTrainData(curPosition, 'send');
    })
  }

  function trainTimeBindClick2() {
    var arrTimeBox = $('#arr-time-box2');
    // var sendListUl = $('#send-list-ul');
    // var sendFooter = $('#send-paging');
    $(arrTimeBox).on('change', function () {
      console.log($(this).val());
      // $(this).attr('disabled',true);
      // $(this).attr('cursor','not-allowed');
      reqTrainData(curPosition, 'arr');
    })
  }

  var theSendFlightArr = [], theArrFlightArr = [];
  var theSendTrainArr = [], theArrTrainArr = [];

  /**
   * 请求航班数据
   * @param name
   * @param status 是状态,决定请求 'all'代表全部, 'send'代表发送
   */
  function reqFlightData(name, status) {
    clearFlightList(status);
    clearFooter(status);

    $('#flight-list-tab').addClass('active');
    $('#flight-trend-tab').removeClass('active');
    $('#flight-data-box2').hide();
    $('#flight-data-box').show();
    var nameStr;
    if (name === '广州白云国际机场') {
      nameStr = 'byjc'
    }
    if (name === '深圳宝安国际机场') {
      nameStr = 'bajc'
    }
    var arrivalTime, sendTime;
    if (status === 'all') {
      arrivalTime = $('#arr-time-box').val();
      sendTime = $('#send-time-box').val();
    } else if (status === 'send') {
      sendTime = $('#send-time-box').val();
      arrivalTime = '';
    } else {
      arrivalTime = $('#arr-time-box').val();
      sendTime = '';
    }
    // debugger
    var url = 'terminal/selectAirInfo.do?sendTime=' + sendTime + '&arrivalTime=' + arrivalTime + '&airport=' + nameStr;
    // debugger
    $.axpost(url, {}, function (data) {
      console.log('航班信息:', data);
      if (data.isSuccess && !isEmptyObject(data.data)) {
        clearFlightList(status);
        clearFooter(status);
        var num = 4;

        theSendFlightArr = data.data.sendList;
        theArrFlightArr = data.data.arrivalList;
        // debugger
        if (theSendFlightArr) {
          handleFlightData(theSendFlightArr, num, true);
        }
        if (theArrFlightArr) {
          handleFlightData(theArrFlightArr, num, false);
        }
      }
    })
  }

  function reqTrainData(name, status) {
    clearTrainList(status);
    clearTrainFooter(status);

    $('#train-list-tab').addClass('active');
    $('#train-trend-tab').removeClass('active');
    $('#train-data-box2').hide();
    $('#train-data-box').show();
    // var nameStr;
    // if (name === '广州白云国际机场') {
    //   nameStr = 'byjc'
    // }
    // if (name === '深圳宝安国际机场') {
    //   nameStr = 'bajc'
    // }
    var arrivalTime, sendTime, theName = name;
    if (status === 'all') {
      arrivalTime = $('#arr-time-box2').val();
      sendTime = $('#send-time-box2').val();
    } else if (status === 'send') {
      sendTime = $('#send-time-box2').val();
      arrivalTime = '';
    } else {
      arrivalTime = $('#arr-time-box2').val();
      sendTime = '';
    }
    // debugger
    var url = 'terminal/selectTrainInfo.do?sendTime=' + sendTime + '&arrivalTime=' + arrivalTime + '&postionName=' + theName;
    // debugger
    $.axpost(url, {}, function (data) {
      console.log('列车信息:', data);
      if (data.isSuccess && !isEmptyObject(data.data)) {
        clearTrainList(status);
        clearTrainFooter(status);
        // if (status === 'all') {
        //   $('#arr-time-box2').attr('disabled',false);
        //   $('#send-time-box2').attr('disabled',false);
        // } else if (status === 'send') {
        //   $('#send-time-box2').attr('disabled',false);
        // } else {
        //   $('#arr-time-box2').attr('disabled',false);
        //   $('#arr-time-box2').attr('cursor','default');
        // }
        var num = 4;
        // debugger
        theSendTrainArr = data.data.sendList;
        theArrTrainArr = data.data.arrivalList;
        // debugger
        if (theSendTrainArr) {
          handleTrainData(theSendTrainArr, num, true);
        }
        if (theArrTrainArr) {
          handleTrainData(theArrTrainArr, num, false);
        }
      }
    })
  }

  /**
   * 处理航班数据渲染
   * @param dataArr
   * @param num 渲染条数
   * @param isSend 是否是发送航班
   */
  function handleFlightData(dataArr, num, isSend) {
    var cityKey, timeKey, theTgtUl, footer, theMaxNum = 12;
    var theDataArr = dataArr;
    if (!theDataArr) {
      console.log('没有航班数据')
    }
    // debugger
    if (isSend) {
      cityKey = 'endCity';
      timeKey = 'depTime';
      theTgtUl = $('#send-list-ul');
      footer = $('#send-paging')
    } else {
      cityKey = 'fromCity';
      timeKey = 'arrTime';
      theTgtUl = $('#arr-list-ul');
      footer = $('#arr-paging')
    }
    // if(!theDataArr.length) {
    //   console.log('没有航班数据');
    //   return
    // }
    for (var i = 0; i < theDataArr.length; i++) {
      if (i >= num) {
        break
      }
      var theDataItem = theDataArr[i];
      var h = theDataItem[timeKey].hours;
      var m = theDataItem[timeKey].minutes;
      m = m < 10 ? '0' + m : m;
      h = h < 10 ? '0' + h : h;
      var theTimeVal = h + ':' + m;
      var theLiStr = '                <li>\n' +
        '                  <span title="' + theDataItem.fltno + '">' + theDataItem.fltno + '</span>\n' +
        '                  <span>' + theTimeVal + '</span>\n' +
        '                  <span title="' + theDataItem[cityKey] + '">' + theDataItem[cityKey] + '</span>\n' +
        // '                  <span title="' + theDataItem.passenger + '">' + theDataItem.passenger + '</span>\n' +
        '                </li>';
      theTgtUl.append($(theLiStr));
    }

    var pagingNum;
    pagingNum = Math.ceil(theDataArr.length / 4);
    for (var j = 0; j < pagingNum; j++) {
      var theNum = j + 1;
      var theSpanStr;
      if (theNum === 1) {
        theSpanStr = '<span class="active">' + theNum + '</span>';
      } else {
        theSpanStr = '<span>' + theNum + '</span>';
      }
      var theFooter = $(theSpanStr);
      theFooter.on('click', function () {  // 分页点击
        var id = $(this).parent().attr('id');
        if (id === 'arr-paging') {
          clearFlightList();
        } else {
          clearFlightList('send');
        }
        // debugger
        var fSpan = footer.find('span');
        for (var z = 0; z < fSpan.length; z++) {
          var spanDom = fSpan[z];
          $(spanDom).removeClass('active')
        }
        $(this).addClass('active');

        var theText = parseInt($(this).text());
        var theRenderList = [];
        theRenderList = theDataArr.slice(theText * 4 - 4, theText * 4);

        // debugger
        for (var k = 0; k < theRenderList.length; k++) {
          var theDataItem = theRenderList[k];
          // debugger
          var h = theDataItem[timeKey].hours;
          var m = theDataItem[timeKey].minutes;
          m = m < 10 ? '0' + m : m;
          h = h < 10 ? '0' + h : h;
          var theTimeVal = h + ':' + m;
          var theLiStr = '                <li>\n' +
            '                  <span title="' + theDataItem.fltno + '">' + theDataItem.fltno + '</span>\n' +
            '                  <span>' + theTimeVal + '</span>\n' +
            '                  <span title="' + theDataItem[cityKey] + '">' + theDataItem[cityKey] + '</span>\n' +
            // '                  <span title="' + theDataItem.passenger + '">' + theDataItem.passenger + '</span>\n' +
            '                </li>';
          theTgtUl.append($(theLiStr));
        }
      });
      footer.append(theFooter);
    }
  }

  function handleTrainData(dataArr, num, isSend) {
    // debugger
    var cityKey, timeKey, theTgtUl, footer, theMaxNum = 12;
    var theDataArr = dataArr;
    if (!theDataArr) {
      console.log('没有列车数据');
      return
    }
    // debugger
    if (isSend) {
      cityKey = 'ZDZ';
      timeKey = 'SFSJ';
      theTgtUl = $('#send-list-ul2');
      footer = $('#send-paging2')
    } else {
      cityKey = 'SFZ';
      timeKey = 'ZDSJ';
      theTgtUl = $('#arr-list-ul2');
      footer = $('#arr-paging2')
    }

    for (var i = 0; i < theDataArr.length; i++) {
      if (i >= num) {
        break
      }
      var theDataItem = theDataArr[i];
      // debugger
      var thePos = theDataItem[cityKey].trim();
      var theNO = theDataItem.SFCC.trim();
      var theTimeVal = theDataItem[timeKey].trim();
      var theLiStr = '                <li>\n' +
        '                  <span title="' + theNO + '">' + theNO + '</span>\n' +
        '                  <span>' + theTimeVal + '</span>\n' +
        '                  <span title="' + thePos + '">' + thePos + '</span>\n' +
        // '                  <span title="' + theDataItem.passenger + '">' + theDataItem.passenger + '</span>\n' +
        '                </li>';
      theTgtUl.append($(theLiStr));
    }

    var pagingNum;
    pagingNum = Math.ceil(theDataArr.length / 4);
    for (var j = 0; j < pagingNum; j++) {
      var theNum = j + 1;
      var theSpanStr;
      if (theNum === 1) {
        theSpanStr = '<span class="active">' + theNum + '</span>';
      } else {
        theSpanStr = '<span>' + theNum + '</span>';
      }
      var theFooter = $(theSpanStr);
      theFooter.on('click', function () {  // 分页点击
        var id = $(this).parent().attr('id');
        if (id === 'arr-paging2') {
          clearTrainList();
        } else {
          clearTrainList('send');
        }
        // debugger
        var fSpan = footer.find('span');
        for (var z = 0; z < fSpan.length; z++) {
          var spanDom = fSpan[z];
          $(spanDom).removeClass('active')
        }
        $(this).addClass('active');

        var theText = parseInt($(this).text());
        var theRenderList = [];
        theRenderList = theDataArr.slice(theText * 4 - 4, theText * 4);

        // debugger
        for (var k = 0; k < theRenderList.length; k++) {
          var theDataItem = theRenderList[k];
          // debugger
          var thePos = theDataItem[cityKey].trim();
          var theNO = theDataItem.SFCC.trim();
          var theTimeVal = theDataItem[timeKey].trim();
          var theLiStr = '                <li>\n' +
            '                  <span title="' + theNO + '">' + theNO + '</span>\n' +
            '                  <span>' + theTimeVal + '</span>\n' +
            '                  <span title="' + thePos + '">' + thePos + '</span>\n' +
            // '                  <span title="' + theDataItem.passenger + '">' + theDataItem.passenger + '</span>\n' +
            '                </li>';
          theTgtUl.append($(theLiStr));
        }
      });
      footer.append(theFooter);
    }
  }

  /**
   * 清空航班列表
   */
  function clearFlightList(status) {
    var sendListUl = $('#send-list-ul');
    var arrListUl = $('#arr-list-ul');
    if (status === 'all') {
      sendListUl.empty();
      arrListUl.empty();
    } else if (status === 'send') {
      sendListUl.empty();
    } else {
      arrListUl.empty();
    }
  }

  function clearTrainList(status) {
    var sendListUl = $('#send-list-ul2');
    var arrListUl = $('#arr-list-ul2');
    if (status === 'all') {
      sendListUl.empty();
      arrListUl.empty();
    } else if (status === 'send') {
      sendListUl.empty();
    } else {
      arrListUl.empty();
    }
  }

  /**
   * 航班趋势,旅客趋势 绑定点击
   */
  function fliTrendTabBindClick() {
    var flightBox = $('#flight-box');
    var tabs = flightBox.find('.chart-tab').find('span');
    // debugger
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      $(tab).on('click', function () {
        // debugger
        for (var j = 0; j < tabs.length; j++) {
          var theTab = tabs[j];
          $(theTab).removeClass('active');
        }
        $(this).addClass('active');

        var theText = $(this).text();
        if (theText === '航班趋势') {
          fliTrendInitChart1()
        }
        if (theText === '旅客趋势') {
          fliTrendInitChart2()
        }
      })
    }
  }

  /**
   * 清除分页
   */
  function clearFooter(status) {
    var sendFooter = $('#send-paging');
    var arrFooter = $('#arr-paging');
    if (status === 'all') {
      sendFooter.empty();
      arrFooter.empty();
    } else if (status === 'send') {
      sendFooter.empty();
    } else {
      arrFooter.empty();
    }
  }

  function clearTrainFooter(status) {
    var sendFooter = $('#send-paging2');
    var arrFooter = $('#arr-paging2');
    if (status === 'all') {
      sendFooter.empty();
      arrFooter.empty();
    } else if (status === 'send') {
      sendFooter.empty();
    } else {
      arrFooter.empty();
    }
  }

  function hideTrainDom() {
    var trainBox = $('#train-box');
    trainBox.hide();
  }

  /**
   * 显示航班,铁路表,请求数据
   */
  function showTrainDom() {
    if (nowTab === tabArr[0]) {
      var trainBox = $('#train-box');
      var theName = curPosition;
      var theArr = pointControl.markes;
      for (var i = 0; i < theArr.length; i++) {
        var m = theArr[i];
        // debugger
        var mName = m.C.extData['枢纽名称'];
        if (theName === mName) {
          var mType = m.C.extData['枢纽类别'];
          if (mType === '铁路') {
            trainBox.show();
            $('#train-tab-box').show();
            $('#train-tab-box2').addClass('dn');
            trainBox.find('.flight-data-box').show();
            trainBox.find('.flight-data-box2').hide();
            clearFlightList();
            clearFooter();
            // reqFlightData(curPosition, 'all');
            reqTrainData(curPosition, 'all');
          }
        }

      }
    }

  }

  /**
   * 请求铁路数据
   */
  function reqTrainTrendData() {

  }

  /**
   * 显示航班,铁路表,请求数据
   */
  function showFlightDom() {
    var flightBox = $('#flight-box');

    if (curPosition === '广州白云国际机场' || curPosition === '深圳宝安国际机场') {
      flightBox.show();

      if (curPosition === '广州白云国际机场') {
        $('#flight-tab-box').hide();
        $('#flight-tab-box2').removeClass('dn');
        flightBox.find('.flight-data-box').hide();
        flightBox.find('.flight-data-box2').show();
        fliTrendInitChart1();
      } else {
        // debugger
        $('#flight-tab-box').show();
        $('#flight-tab-box2').addClass('dn');
        flightBox.find('.flight-data-box').show();
        flightBox.find('.flight-data-box2').hide();
        clearFlightList();
        clearFooter();
        reqFlightData(curPosition, 'all');
      }
    }

  }

  function hideFlightDom() {
    $('#flight-box').hide();
  }

  /**
   * 请求航班趋势数据
   * type 0 航班趋势  1 旅客趋势
   */
  function reqFlightTrendData(name, type) {
    var theName, trendType = type;
    if (name === '广州白云国际机场') {
      theName = 'byjc'
    }
    if (name === '深圳宝安国际机场') {
      theName = 'bajc'
    }
    var url = 'terminal/selectAirTrend.do?airport=' + theName + '&trendType=' + trendType;
    $.axpost(url, {}, function (data) {
      console.log('航班趋势:', data);
      if (trendType === 1) {

      } else {
        fliTrendChart1reqData()
      }
    })
  }

  /**
   * 航班,铁路的信息表的点击
   */
  function flightBindClick() {
    var flightBox = $('#flight-box');
    var flightTabArr = flightBox.find('.flight-tab');
    $('#flight-trend-tab').on('click', function () {
      flightBox.find('.flight-data-box').hide();
      flightBox.find('.flight-data-box2').show();
      for (var f = 0; f < flightTabArr.length; f++) {
        var ftab = flightTabArr[f];
        $(ftab).removeClass('active')
      }
      $(this).addClass('active');
      fliTrendInitChart1();
    });
    $('#flight-list-tab').on('click', function () {
      flightBox.find('.flight-data-box').show();
      flightBox.find('.flight-data-box2').hide();
      for (var f = 0; f < flightTabArr.length; f++) {
        var ftab = flightTabArr[f];
        $(ftab).removeClass('active')
      }
      $(this).addClass('active');
      reqFlightData(curPosition, 'all');
      // fliTrendInitChart2()
    })
  }

  function trainBindClick() {
    var trainBox = $('#train-box');
    var trainArr = trainBox.find('.flight-tab');

    $('#train-trend-tab').on('click', function () {
      trainBox.find('.flight-data-box').hide();
      trainBox.find('.flight-data-box2').show();
      for (var f = 0; f < trainArr.length; f++) {
        var ftab = trainArr[f];
        $(ftab).removeClass('active')
      }
      $(this).addClass('active');
      trainTrendInitChart1();
    });
    $('#train-list-tab').on('click', function () {
      trainBox.find('.flight-data-box').show();
      trainBox.find('.flight-data-box2').hide();
      for (var f = 0; f < trainArr.length; f++) {
        var ftab = trainArr[f];
        $(ftab).removeClass('active')
      }
      $(this).addClass('active');
      // reqFlightData(curPosition, 'all');
      // fliTrendInitChart2()
    })
  }

  /**
   * 日历初始化
   */
  function initCalendar() {
    if (nowTab === tabArr[0]) {

      // 交通枢纽 实时客流
      $('#tab2-li2-cld').val(returnDate());
      lay('#SSKL-cld-box').on('click', function (e) { //假设 test1 是一个按钮
        laydate.render({
          elem: '#tab2-li2-cld'
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#SSKL-cld-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            tab2Li2Echart1reqData(value);
          }
        });
      });
      // 交通枢纽 旅客洞察
      $('#tab2-li4-cld').val(tab2Li2DefaultDate);
      lay('#tab2-li4-cld-box').on('click', function (e) {
        laydate.render({
          elem: '#tab2-li4-cld'
          // ,value: returnDate(1)
          , show: true //直接显示
          , max: 0 //禁止选未来日期
          , closeStop: '#tab2-li4-cld-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            initRealTimeNum();
            initDongchaTab();
            tab2Li3Date = value;
            getPassengerData(value);
            // tab2Li3Echart1reqData(value);
            tab2Li3Echart2ReqData(value);
            tab2Li3Echart3ReqData(value);
            tab2Li3Echart4ReqData(value);
            getAreaData($('#tab2'), '省外', value)
          }
        })
      })

      // 交通枢纽 旅客趋势
      $('#tab2-li3-cld').val(returnDate(7) + " - " + returnDate(1));
      lay('#tab2-li3-cld-box').on('click', function (e) {
        laydate.render({
          elem: '#tab2-li3-cld-1'
          // ,range: true
          // ,value: returnDate(7) + ' - ' + returnDate(1)
          // ,min: -8 //7天前
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#tab2-li3-cld-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            // console.log(value,date,endDate);
            var dateObj = calDate(value);
            $('#tab2-li3-cld').val(dateObj.start + " - " + dateObj.end);
            tab2Li4EchartReqData(dateObj);
            tab2Li4Echart2ReqData(dateObj)
          }
        });
      })

    }
    if (nowTab === tabArr[1]) {
      // 服务区
      $('#tab3-li3-cld2').val(returnDate(7) + ' - ' + returnDate(1));
      lay('#tab3-li3-cld2-box').on('click', function (e) {
        laydate.render({
          elem: '#tab3-li3-cld2-1'
          // ,range: true
          // ,value: returnDate(7) + ' - ' + returnDate(1)
          // ,min: -8 //7天前
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#tab3-li3-cld2-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            // console.log(value,date,endDate);
            var dateObj = calDate(value);
            $('#tab3-li3-cld2').val(dateObj.start + " - " + dateObj.end);
            tab3Li4EchartReqData(dateObj);
          }
        });
      });

      // 服务区 旅客洞察日历
      $('#tab-li4-cld2').val(returnDate(1));
      lay('#tab-li4-cld2-box').on('click', function (e) {
        laydate.render({
          elem: '#tab-li4-cld2'
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#tab-li4-cld2-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            initDongchaTab2();
            tab3Li3Date = value;
            // tab3Li3Echart1reqData(value);
            tab3Li3Echart2ReqData(value);
            guishufenxiReqData(value);
            getAreaData2($('#tab3'), '境外', value)
          }
        });
      });


      $('#sskl-cld2').val(returnDate());
      lay('#tab3-cld1-box').on('click', function (e) {
        laydate.render({
          elem: '#sskl-cld2'
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#tab3-cld1-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            tab3Li2Echart1reqData(value);
          }
        })
      })

    }
    if (nowTab === tabArr[2]) {

      // 收费站
      $('#tab4-klqs-cld2').val(returnDate());
      lay('#tab4-klqs-cld2-box').on('click', function (e) {
        laydate.render({
          elem: '#tab4-klqs-cld2'
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#tab4-klqs-cld2-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            tab4Li2Echart2reqData(value);
          }
        })
      });

      $('#tab4-m-cld').val(returnDate(1));
      lay('#tab4-m-cld-box').on('click', function (e) {
        laydate.render({
          elem: '#tab4-m-cld'
          , type: 'date'//默认为date
          , trigger: 'click'//默认为click，即点击后出现日历框
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#tab4-m-cld-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            getDayCarFlowT3(value);
            tab4Li3Echart1reqData(value);
            tab4Li3Echart2reqData(value);
            tab4Li2Echart3ReqData(value);
          }
        })
      });

      // laydate.render({
      //   elem:'#tab4-big-cld'
      //   ,type:'date'//默认为date
      //   ,trigger:'click'//默认为click，即点击后出现日历框
      //   ,range: true
      //   ,value: returnDate(7) + ' - ' + returnDate(1)
      //   ,done: function(value, date, endDate){
      //     if(date) {
      //       var dateObj = {
      //         start: date.year+'-'+date.month+'-'+date.date,
      //         end: endDate.year+'-'+endDate.month+'-'+endDate.date,
      //       };
      //       // console.log(dateObj)
      //       tab4Li4EchartReqData(dateObj);
      //       tab4Li4Echart2ReqData(dateObj);
      //     } else {
      //       console.log('date不能为空');
      //     }
      //   }
      // })

      $('#tab4-big-cld').val(returnDate(7) + ' - ' + returnDate(1));
      lay('#tab4-big-cld-box').on('click', function (e) {
        laydate.render({
          elem: '#tab4-big-cld-1'
          // ,range: true
          // ,value: returnDate(7) + ' - ' + returnDate(1)
          // ,min: -8 //7天前
          , max: 0 //禁止选未来日期
          , show: true //直接显示
          , closeStop: '#tab4-big-cld-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
          , done: function (value, date, endDate) {
            // console.log(value,date,endDate);
            var dateObj = calDate(value);
            $('#tab4-big-cld').val(dateObj.start + " - " + dateObj.end);
            tab4Li4EchartReqData(dateObj);
            // tab4Li4Echart2ReqData(dateObj);
          }
        });
      })

    }
    // if(nowTab===tabArr[3]) {
    //   // 高速路段
    //   $('#tab5-klqs-cld').val(returnDate());
    //   lay('#tab5-cld1').on('click',function (e) {
    //     laydate.render({
    //       elem:'#tab5-klqs-cld'
    //       ,max: 0 //禁止选未来日期
    //       ,show: true //直接显示
    //       ,closeStop: '#tab5-cld1' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
    //       ,done: function(value, date, endDate){
    //         tab5Li2Echart1reqData(value);
    //       }
    //     })
    //   });
    //
    //   $('#tab5-klqs-cld2').val(returnDate());
    //   lay('#tab5-cld2').on('click',function (e) {
    //     laydate.render({
    //       elem:'#tab5-klqs-cld2'
    //       ,show: true //直接显示
    //       ,max: 0 //禁止选未来日期
    //       ,closeStop: '#tab5-cld2' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
    //       ,done: function(value, date, endDate){
    //         tab5Li2Echart2reqData(value);
    //       }
    //     })
    //   });
    //
    //   $('#tab5-big-cld').val(returnDate(7) + ' - ' + returnDate(1));
    //   lay('#tab5-big-cld-box').on('click').on('click',function (e) {
    //     laydate.render({
    //       elem:'#tab5-big-cld-1'
    //       ,type:'date'//默认为date
    //       ,trigger:'click'//默认为click，即点击后出现日历框
    //       // ,range: true
    //       // ,value: returnDate(7) + ' - ' + returnDate(1)
    //       // ,min: -8 //7天前
    //       ,max: 0 //禁止选未来日期
    //       ,show: true //直接显示
    //       ,closeStop: '#tab5-big-cld-box' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
    //       ,done: function(value, date, endDate){
    //         // console.log(value,date,endDate);
    //         var dateObj = calDate(value);
    //         $('#tab5-big-cld').val(dateObj.start+" - "+dateObj.end);
    //         tab5Li3Echart1ReqData(dateObj);
    //         tab5Li3Echart2ReqData(dateObj);
    //         tab5Li3Echart3reqData(dateObj);
    //       }
    //     });
    //   })
    //
    // }
  }

  var timer;

  /**
   * 更新时间
   */
  function refreshTime() {
    var curDate = $('#curDate');
    var curTime = $('#curTime');
    var curWeek = $('#curWeek');

    function changeFont() {
      curDate.text(moment().format('LL'));
      curTime.text(moment().format('H:mm:ss'));
      curWeek.text(moment().format('dddd'));
    }

    changeFont();
    timer = setInterval(changeFont, 1000)
  }

  // 隐藏tab2
  function hideTab2() {
    var temp;
    if (nowTab === tabArr[0]) {
      temp = $('#tab2');
    }
    if (nowTab === tabArr[1]) {
      temp = $('#tab3');
    }
    // if (nowTab === '收费站') {
    //   temp = $('#tab4');
    // }
    if (nowTab === tabArr[2]) {
      temp = $('#tab4');
    }

    temp.addClass('vh');
    var tabs = temp.find('.tab-box2-li');
    for (var j = 0; j < tabs.length; j++) {
      var obj = tabs[j];
      $(obj).removeClass('active');
    }
    var liTabBox = temp.find('.li-tab-box');
    for (var i = 0; i < liTabBox.length; i++) {
      var obj1 = liTabBox[i];
      $(obj1).css('visibility', 'hidden');
    }
  }

  /**
   * 隐藏2级tab的litabbox
   */
  function hideLiTabBox() {
    var temp;
    if (nowTab === '客运站,铁路,机场,港口') {
      temp = $('#tab2');
    }
    if (nowTab === '服务区') {
      temp = $('#tab3');
    }
    if (nowTab === '收费站') {
      temp = $('#tab4');
    }

    // temp.addClass('vh');
    var tabs = temp.find('.tab-box2-li');
    for (var j = 0; j < tabs.length; j++) {
      var obj = tabs[j];
      $(obj).removeClass('active');
    }
    var liTabBox = temp.find('.li-tab-box');
    for (var i = 0; i < liTabBox.length; i++) {
      var obj1 = liTabBox[i];
      $(obj1).css('visibility', 'hidden');
    }
  }


  /**
   * 主tab点击事件
   */
  function clickTab() {
    var t = $(this).data('name');
    if (t !== nowTab) {
      for (var j = 0; j < tabBoxes.length; j++) {
        var obj = tabBoxes[j];
        $(obj).removeClass('tab-box-active');
      }
      $(this).addClass('tab-box-active');

      nowTab = t;
      window.nowTab = nowTab;
      console.log('切换到:', t);
      moveTheMap();
      clearYjUL();
      pointControl.ReturnDefualt();
      pointControl.hideMarkers();
      clearStation();
      showTheTabArrow();
      $('#tab-box-cur').hide();
      hideCurLocaction();
      clearCenterMarker();
      removeJamMarkers();
      // getYJData();

      if (nowTab === tabArr[0]) {
        positionType = 1;  // 场站type
        clearInterval(timer);
        $('#top3').show();
        // $('#luwang-box').hide();
        $('#container2').show();
        mapbase.isGaoSuLuDuan = false;
        mapbase.restoreDefaultStyle();
        mapbase.setBg();
        traffic.removePaths();  // 清除高速路段的线
        $('#gaosujiance').hide();
        refreshTerminalWarningList();

      }
      if (nowTab === tabArr[1]) {
        positionType = 2;  // 服务区type
        clearInterval(timer);
        $('#top3').show();
        // $('#luwang-box').hide();
        $('#container2').show();
        mapbase.isGaoSuLuDuan = false;
        mapbase.restoreDefaultStyle();
        mapbase.setBg();
        traffic.removePaths();  // 清除高速路段的线
        $('#gaosujiance').hide();
        refreshServiceAreaWarningList()
      }
      if (nowTab === tabArr[2]) {
        positionType = 3;  // 收费站,高速监测

        refreshTime();
        initPanel();
        $('#top3').hide();
        mapbase.setTrafficStyle();
        mapbase.setBgRoadPoint();
        refreshJamList();
        // reqKeyRoadData();
        checkKeyRoad();
        $('#container2').hide();
        $('#gaosujiance').show();
        traffic.removePaths();  // 清除高速路段的线
        pointControl.showPoints(nowTab, []);
        markerBindClick();
        addStation2();
      }

    }


  }

  /**
   * 清空拥挤列表
   */
  function clearJamList() {
    $('#jiance-top10-ul').empty();
  }

  /**
   * 高速监测要向左平移地图,其他不用
   */
  function moveTheMap() {
    var lnglat;
    var defaultZoom = 8;
    // if (nowTab !== tabArr[3]) {
    if (nowTab !== tabArr[2]) {
      lntlat = new AMap.LngLat(113.275824, 22.994826);
    } else {
      lntlat = new AMap.LngLat(114.231635, 22.999883);
    }
    theMap.setZoomAndCenter(defaultZoom, lnglat)
  }

  /**
   * 移动一级tab对应的箭头
   */
  function moveTheTabArrow() {
    var topDis, top = 130, left = 190,
      theTabArr = $('#tab-arrow'), tabBoxCur = $('#tab-box-cur');
    // theTabArr.show();
    if (nowTab === tabArr[0]) {
      // debugger
      topDis = 0;
    }
    else if (nowTab === tabArr[1]) {
      topDis = top;
    }
    else if (nowTab === tabArr[2]) {
      topDis = top * 2;
    } else {
      hideCurLocaction();
      return
    }
    // showCurLocaction();
    // theTabArr.css('left',left);
    // theActiveTab.addClass('moveAndShow')
    tabBoxCur.css('top', topDis);
  }

  /**
   * 显示不同tab对应的箭头
   */
  function showTheTabArrow() {
    var tab = $('#tab');
    var theActiveTab = tab.find('.tab-box-active');
    var theTabs = tab.find('.tab-box');
    var tabBoxCur = $('#tab-box-cur');
    tabBoxCur.hide();
    if (nowTab === tabArr[3] || nowTab === tabArr[4]) {
      for (var i = 0; i < theTabs.length; i++) {
        var tabDom = $(theTabs[i]).find('.tab-arrow');
        $(tabDom).hide();

        $(tabDom).removeClass('moveAndShow');
        $(tabDom).addClass('moveAndHide');

      }
      return
    }

    // 隐藏
    for (var i = 0; i < theTabs.length; i++) {
      var tabDom = $(theTabs[i]).find('.tab-arrow');
      $(tabDom).hide();
      $(tabDom).removeClass('moveAndShow');
      $(tabDom).addClass('moveAndHide');
    }
    // 显示
    var theActiveArrow = theActiveTab.find('.tab-arrow');
    theActiveArrow.show();
    theActiveArrow.removeClass('moveAndHide');
    theActiveArrow.addClass('moveAndShow');
    moveTheTabArrow();
  }

  /**
   * 一级tab对应箭头的点击
   */
  function tabArrowClick() {
    var arrowsArr = $('#tab').find('.tab-arrow');
    var tabBoxCur = $('#tab-box-cur');
    var arrows = tabBoxCur.find('.arrow');

    for (var i = 0; i < arrowsArr.length; i++) {
      var arrowDom = arrowsArr[i];
      $(arrowDom).on('click', function (e) {
        e.stopPropagation();
        $(this).hide();
        tabBoxCur.show();
        showCurLocaction();
        clickArrow(nowTab, arrows);
      })
    }

  }

  var mList = [];

  /**
   * 隐藏拥堵路段markers
   */
  function hideJamMarkers() {
    for (var i = 0; i < jamListMarkers.length; i++) {
      var obj = jamListMarkers[i];
      obj.hide();
    }
  }

  function showJamMarkers() {
    for (var i = 0; i < jamListMarkers.length; i++) {
      var obj = jamListMarkers[i];
      obj.show();
    }
  }

  /**
   * 删除拥堵路段markers
   */
  function removeJamMarkers() {
    if (nowTab !== tabArr[2]) {
      for (var i = 0; i < jamListMarkers.length; i++) {
        var obj = jamListMarkers[i];
        if (obj) {
          obj.setMap(null);
          obj = null;
        }
        // theMap.remove(obj);
      }
    }

  }

  /**
   * 拥挤路段top10 markers
   * @param theJamList
   */
  function addJamListMarker(theJamList) {
    var theIdx = 0;
    var resultArr = {};
    for (var i = 0; i < theJamList.length; i++) {
      theIdx++;
      if (i >= 10) {
        break
      }
      var theJamItem = theJamList[i];
      var theName = theJamItem.roadName;
      var theDetailArr = theJamItem.congestionDetailsArray;
      var pointArr = [];
      for (var j = 0; j < theDetailArr.length; j++) {
        var r = theDetailArr[j].xys.split(';');
        for (var k = 0; k < r.length; k++) {
          var ritem = r[k].split(',');
          pointArr.push(ritem);
        }
      }
      // debugger

      var theMidLngLat = pointArr[parseInt(pointArr.length / 2)].map(function (t) {
        return parseFloat(t)
      });
      resultArr[theName] = theMidLngLat;
      // debugger
      // 道路中间点
      // console.log(theIdx);
      var roadCenterMarker = new AMap.Marker({
        position: new AMap.LngLat(theMidLngLat[0], theMidLngLat[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: theName,
        content: '<div class="point4"><i>' + theIdx + '</i></div>',
        extData: {lnglat: theMidLngLat}//加入对象信息
      });
      jamListMarkers.push(roadCenterMarker);
      theMap.add(roadCenterMarker);
    }
    return resultArr
  }

  var jamList = [];

  /**
   * 查询高速拥堵top10事件列表
   */
  // function reqJamList() {
  //   var url = 'highSpeed/selectGsCongestionAndDetails.do';
  //   $.axpost(url, {}, function (data) {
  //     // console.log('reqJamList:', data);
  //     if (data.isSuccess && data.data.rows.length) {
  //       clearJamList();
  //       var jamList = data.data.rows;
  //       // debugger
  //       // console.log('1',jamList);
  //       jamList = _.sortBy(jamList, function (item) {  // 按照拥堵距离排序
  //         return -item.jamDist;
  //       });
  //       var theLngLatObj = addJamListMarker(jamList);
  //       // debugger
  //       // console.log('jamList:',jamList);
  //       var idx = 0;
  //       var jamRankUl = $('#jiance-top10-ul');
  //
  //       for (var j = 0; j < jamList.length; j++) {
  //         // debugger
  //         idx++;
  //         if (idx > 10) {  // 要前10
  //           break
  //         }
  //         var liData = jamList[j];
  //         var liDetailsArray = liData.congestionDetailsArray;
  //
  //         // debugger
  //         var startLngLat = liDetailsArray[0].xys.split(';')[0].split(',').map(function (t) {
  //           return parseFloat(t)
  //         });  // 起点经纬度
  //         var temp = liDetailsArray[liDetailsArray.length - 1].xys.split(';');
  //         var endLngLat = temp[temp.length - 1].split(',').map(function (t) {
  //           return parseFloat(t)
  //         });  // 终点经纬度
  //         // debugger
  //         var angle = calcAngle(startLngLat, endLngLat);  // 角度
  //         var dir = judgeDirection(angle);  // 方向 todo 方向不准确
  //         // debugger
  //         // 道路中间点
  //         // var roadCenterMarker = new AMap.Marker({
  //         //   position: new AMap.LngLat(theLntLats[0], theLntLats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
  //         //   title: theName,
  //         //   content: '<div class="' + theClassName + '"><i>' + theName + '</i></div>',
  //         //   extData: thePlace//加入对象信息
  //         // });
  //         var liStr = '          <li>\n' +
  //           '            <section><span class="idx">' + idx + '</span></section>\n' +
  //           '            <section>' + liData.roadName + ' (' + dir + ')</section>\n' +
  //           '            <section>' + toKM(liData.jamDist) + '</section>\n' +
  //           '            <section>' + liData.jamSpeed + 'km/h</section>\n' +
  //           '          </li>';
  //
  //         var liDom = $(liStr);
  //         liDom[0].dataset.eventId = liData.eventId;
  //         liDom[0].dataset.insertTime = liData.insertTime;
  //         liDom[0].dataset.jamDist = toKM(liData.jamDist);
  //         liDom[0].dataset.dir = dir;
  //         liDom[0].dataset.roadName = liData.roadName;
  //         liDom[0].dataset.lnglat = theLngLatObj[liData.roadName];
  //
  //         liDom.on('click', function () {
  //           var me = this;
  //           var theData = {
  //             name: me.dataset.roadName,
  //             data1: '拥堵长度: ' + me.dataset.jamDist,
  //             data2: '方向: ' + me.dataset.dir
  //           }
  //           clearCenterMarker();
  //           // console.log(this.dataset);
  //           var theEventId = this.dataset.eventId;
  //           var theInsertTime = this.dataset.insertTime;
  //           var xy = this.dataset.lnglat;
  //           // var theMiddlePointArr = pointArr[parseInt(pointArr.length / 2)];
  //           var theMiddlePointArr = xy.split(',').map(function (t) {
  //             return parseFloat(t)
  //           });
  //           // debugger
  //           addLuWangMarker(theMiddlePointArr, theData);
  //
  //           // var url = 'highSpeed/selectGsCongestionDetails.do';
  //           // var data = {
  //           //   eventId: theEventId,
  //           //   insertTime: theInsertTime
  //           // };
  //           // $.axpost(url, data, function (data) {
  //           //   // console.log('dtlData:',data);
  //           //   var rows = data.data.rows;
  //           //   var eve = data.data.event;
  //           //   // console.log('row',rows)
  //           //   var theRows = [];
  //           //   var pointArr = [];
  //           //   for (var i = 0; i < rows.length; i++) {
  //           //     var r = rows[i].xys.split(';');
  //           //     for (var k = 0; k < r.length; k++) {
  //           //       var ritem = r[k].split(',');
  //           //       pointArr.push(ritem);
  //           //     }
  //           //     // console.log('r',r);
  //           //     // debugger
  //           //     theRows.push(r);
  //           //   }
  //           //   // debugger
  //           //   // console.log('theRow:',theRows);
  //           //   // console.log('pointArr:',pointArr);
  //           //
  //           //   // var centerRow = rows[parseInt(rows.length/2)];
  //           //   // var lnglat = xy.split(',').map(function (t) { return parseFloat(t) });
  //           //
  //           //   traffic.drawRoads(theRows, nowTab);
  //           //   var theMiddlePointArr = pointArr[parseInt(pointArr.length / 2)];
  //           //   // debugger
  //           //   addLuWangMarker(theMiddlePointArr, theData);
  //           //
  //           //   // theMap.remove(mList);
  //           //   // var mIdx = 'm';
  //           //   // for (var i = 0; i < rows.length; i++) {
  //           //   //   // debugger
  //           //   //   var p = rows[i].xy.split(',');
  //           //   //   mIdx+=i;
  //           //   //
  //           //   //   mIdx = new AMap.Marker({
  //           //   //     position: new AMap.LngLat(parseFloat(p[0]),parseFloat(p[1])),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
  //           //   //     title: '中间点',
  //           //   //     content: '<div style="color:#fff;font-size:20px">'+i+'</div>'
  //           //   //   });
  //           //   //   mList.push(mIdx)
  //           //   // }
  //           //   // theMap.add(mList);
  //           //
  //           // })
  //         });
  //         jamRankUl.append(liDom);
  //       }
  //     }
  //   })
  // }


  function refreshJamList() {
    var timeToR = canRefresh(myTime, 5);
    var emptyJamList = jamList.length === 0;
    // debugger
    if (emptyJamList) {
      reqJamList();
      return
    }
    if (timeToR) {
      reqJamList();
    } else {
      renderJamList();
    }
  }

  /**
   * 渲染高速拥堵列表
   */
  function renderJamList() {
    clearJamList();

    var theLngLatObj = addJamListMarker(jamList);
    // debugger
    // console.log('jamList:',jamList);
    var idx = 0;
    var jamRankUl = $('#jiance-top10-ul');

    for (var j = 0; j < jamList.length; j++) {
      // debugger
      idx++;
      if (idx > 10) {  // 要前10
        break
      }
      var liData = jamList[j];
      var liDetailsArray = liData.congestionDetailsArray;
      // debugger
      var startLngLat = liDetailsArray[0].xys.split(';')[0].split(',').map(function (t) {
        return parseFloat(t)
      });  // 起点经纬度
      var temp = liDetailsArray[liDetailsArray.length - 1].xys.split(';');
      var endLngLat = temp[temp.length - 1].split(',').map(function (t) {
        return parseFloat(t)
      });  // 终点经纬度

     /* var theTotalDatas= liDetailsArray.map(function(m){return m.xys}).join(";").split(";");

      debugger*/
      var angle = calcAngle(startLngLat, endLngLat);  // 角度
      var dir = judgeDirection(angle);  // 方向 todo 方向不准确

      var liStr = '          <li>\n' +
        '            <section><span class="idx">' + idx + '</span></section>\n' +
        '            <section>' + liData.roadName + ' (' + dir + ')</section>\n' +
        '            <section>' + toKM(liData.jamDist) + '</section>\n' +
        '            <section>' + liData.jamSpeed + 'km/h</section>\n' +
        '          </li>';

      var liDom = $(liStr);
      liDom.data('lnglat', [startLngLat, endLngLat]);
      liDom[0].dataset.eventId = liData.eventId;
      liDom[0].dataset.insertTime = liData.insertTime;
      liDom[0].dataset.jamDist = toKM(liData.jamDist);
      liDom[0].dataset.dir = dir;
      liDom[0].dataset.roadName = liData.roadName;
      liDom[0].dataset.lnglat = theLngLatObj[liData.roadName];
      // debugger
      liDom.on('click', function () {
        var me = this;
        var s = $(me).data('lnglat');
        // debugger
        // var mIdx = new AMap.Marker({
        //   position: new AMap.LngLat(s[0][0],s[0][1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        //   title: '1',
        //   // content: '<div style="color:#fff;font-size:20px"></div>'
        // });
        //
        // var mIdx2 = new AMap.Marker({
        //   position: new AMap.LngLat(s[1][0],s[1][1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        //   title: '2',
        //   // content: '<div style="color:#fff;font-size:20px"></div>'
        // });
        //
        // theMap.add(mIdx);  // 起点 终点
        // theMap.add(mIdx2);
        var theData = {
          name: me.dataset.roadName,
          data1: '拥堵长度: ' + me.dataset.jamDist,
          data2: '方向: ' + me.dataset.dir
        }
        clearCenterMarker();
        // console.log(this.dataset);
        var theEventId = this.dataset.eventId;
        var theInsertTime = this.dataset.insertTime;
        var xy = this.dataset.lnglat;
        // var theMiddlePointArr = pointArr[parseInt(pointArr.length / 2)];
        var theMiddlePointArr = xy.split(',').map(function (t) {
          return parseFloat(t)
        });
        // debugger
        addLuWangMarker(theMiddlePointArr, theData);
        showTabs();
        hideTab2();
        hideCurLocaction();
        $('#floor').addClass('dn');
        $('#tab-name').empty();
        initCenterBG();
        showTheTabArrow()
      });
      jamRankUl.append(liDom);
    }
  }

  /**
   * 查询高速拥堵top10事件列表
   */
  function reqJamList() {
    var url = 'highSpeed/selectGsCongestionAndDetails.do';
    clearJamList();
    $.axpost(url, {}, function (data) {
      myTime = new Date();
      jamList = [];
      // console.log('reqJamList:', data);
      if (data.isSuccess && data.data.rows.length) {
        jamList = data.data.rows;
        jamList = _.sortBy(jamList, function (item) {  // 按照拥堵距离排序
          return -item.jamDist;
        });
        if (nowTab !== tabArr[2]) {
          return
        }
        renderJamList()
      }
    })
  }

  // var keyRoadDataArr = [], perPageNum = 7;

  /**
   * 检查重点路段
   */
  function checkKeyRoad() {
    if (keyRoadDataArr.length === 0) {
      reqKeyRoadData();
      return
    }
    var timeToRefresh = canRefresh(keyRoadTime, 5);
    if (timeToRefresh) {
      reqKeyRoadData()
    } else {

    }
  }

  /**
   * 查询高速重点路段数据
   */

  function reqKeyRoadData() {
    var url = 'http://gdjtapi.televehicle.com/gd_traffic/api/highWayKpi/RoadLinksTpi';
    var loading = layer.load();
    keyRoadDataArr = [];
    var timeStamp = moment().format('YYYYMMDDHHmmss') + '';

    var keyIdx = 0;
    for (var i = 0; i < LuDuanDataArr.length; i++) {
      var data = {
        "auth": {
          "opCode": "SJT",
          "opPass": "XQWPwai8XOTW",
          "signature": "A2A65DED49FF531B4A38A5C8E21AA19C",
          "timeStamp": "20151203220306"
        }
      };
      var lObj = LuDuanDataArr[i];
      var theRoadID = lObj.roadId;
      data['roadId'] = theRoadID;
      data = JSON.stringify(data);

      var xhr = $.ajax({
        type: "POST",
        url: url,
        data: data,
        lObj: lObj,
        success: function (data) {
          if (data.returnMsg === '操作成功' && data.data.length) {
            keyRoadTime = new Date();
            keyIdx++;
            console.log(keyIdx, data);
            var linksArr = [];
            var dirs = data.data[0].dirs;
            for (var j = 0; j < dirs.length; j++) {
              var d = dirs[j];
              for (var k = 0; k < d.links.length; k++) {
                var theLink = d.links[k];
                theLink['name'] = this.lObj.name;
                // debugger
                var dtlName = theLink.from + '--' + theLink.to;
                try {
                  theLink['fData'] = this.lObj.fData[dtlName];
                } catch (err) {
                  // console.log('没有路段详细坐标',err);
                  theLink['fData'] = null
                }
                linksArr.push(theLink);
                keyRoadDataArr2.push(theLink);
              }
            }
            linksArr = _.sortBy(linksArr, function (item) {
              return -item.tpi;
            });
            for (var i = 0; i < linksArr.length; i++) {
              if (i >= 3) {
                break
              }
              var l = linksArr[i];
              // console.log(l.name)
              keyRoadDataArr.push(l);
            }
            if (keyIdx >= 12) {
              layer.closeAll();
              keyRoadDataArr = _.sortBy(keyRoadDataArr, function (item) {
                return -item.tpi;
              });
              handleKeyRoadArr()
            }
          }
        },
        complete: function (XMLHttpRequest, status) {
          if (status == 'timeout') {
            xhr.abort();    // 超时后中断请求
            // alert('网络超时,请刷新')
            // location.reload
            if (keyIdx >= 9) {
              layer.closeAll();
              keyRoadDataArr = _.sortBy(keyRoadDataArr, function (item) {
                return -item.tpi;
              });
              handleKeyRoadArr()
            }
          }
        }
      })
    }

  }

  /**
   * 处理重点路段数据
   */

  var perRoadNum = 3; // 每条路要展示的条数
  var keyRoadRenderList = [];

  function handleKeyRoadArr() {

    // console.log(keyRoadDataArr)
    addKeyRoadLi(keyRoadDataArr);
    addKeyRoadPgn();
  }

  var theStatsMap = {
    '重度拥堵': '重度缓行',
    '中度拥堵': '中度缓行',
    '轻度拥堵': '轻度缓行',
  };

  function addKeyRoadLi(arr) {
    var theUl = $('#jiance-key-ul');
    theUl.empty();
    for (var i = 0; i < arr.length; i++) {
      if (i >= perPageNum) {
        break
      }
      var dataObj = arr[i];
      var theRoadName = dataObj.name;
      var fData = dataObj.fData;
      var ftMsg = '(' + dataObj.from + '--' + dataObj.to + '段)';

      var theStatusClass = tpiToClass(dataObj.tpi);
      var theTpi = dataObj.tpi;
      var theStatus = dataObj.status;
      theStatus = theStatsMap[theStatus] ? theStatsMap[theStatus] : theStatus;
      var theSpeed = dataObj.speed;
      var liStr = '          <li>\n' +
        '            <section>' + '<span>' + theRoadName + '</span>' + '<span>' + ftMsg + '</span>' + '</section>\n' +
        '            <section>' + theTpi + '</section>\n' +
        '            <section>\n' +
        '              <div class="tips-font ' + theStatusClass + '">' + theStatus + '</div>\n' +
        '            </section>\n' +
        '            <section>' + theSpeed + 'km/h</section>\n' +
        '          </li>';
      var theLiDom = $(liStr);
      theLiDom.data('theName', theRoadName);
      theLiDom.data('theStatus', theStatus);
      theLiDom.data('theSpeed', theSpeed);
      theLiDom.data('fData', fData);
      keyRoadClick(theLiDom);
      theUl.append(theLiDom);
    }
  }

  /**
   * 重点路段列表--分页
   */
  function addKeyRoadPgn() {
    var theLen = keyRoadDataArr.length;
    var pgnNum = Math.ceil(theLen / 7);
    var pagination = $('#pagination');
    pagination.empty();
    for (var i = 0; i < pgnNum; i++) {
      var idx = i + 1, theSpan;
      if (i === 0) {
        theSpan = '<span class="active">' + idx + '</span>';
      } else {
        theSpan = '<span>' + idx + '</span>';
      }
      var theSpanDom = $(theSpan);
      theSpanDom.on('click', function () {
        var theSpanArr = pagination.find('span');
        for (var j = 0; j < theSpanArr.length; j++) {
          var span = theSpanArr[j];
          $(span).removeClass('active');
        }
        $(this).addClass('active');

        var theText = parseInt($(this).text());
        var theRenderList = keyRoadDataArr.slice(theText * 7 - 7, theText * 7);
        addKeyRoadLi(theRenderList)

      });
      pagination.append(theSpanDom);
    }

  }

  /**
   * 高速路段分页点击
   */
  function paginationClick() {
    // console.log(1111)
    var theUl = $('#jiance-key-ul');
    var theShowList, midIdx = 7;  // 要显示的列表,第一页要显示7条
    var PgnArr = $('#pagination').find('span');
    // debugger
    for (var i = 0; i < PgnArr.length; i++) {
      var pgn = PgnArr[i];
      $(pgn).on('click', function () {
        for (var j = 0; j < PgnArr.length; j++) {
          var p = PgnArr[j];
          $(p).removeClass('active');
        }
        $(this).addClass('active');

        theUl.empty();
        var num = $(this).text();
        // debugger
        if (num == '1') {
          theShowList = keyRoadDataArr.slice(0, midIdx)
        } else {
          theShowList = keyRoadDataArr.slice(midIdx)
        }

        for (var i = 0; i < theShowList.length; i++) {
          var dataObj = theShowList[i];
          var liStr = '          <li>\n' +
            '            <section>' + dataObj.name + '</section>\n' +
            '            <section>' + dataObj.tpi + '</section>\n' +
            '            <section>\n' +
            '              <div class="tips-font">' + dataObj.status + '</div>\n' +
            '            </section>\n' +
            '            <section>' + dataObj.avgSpeed + 'km/h</section>\n' +
            '          </li>';
          var theLiDom = $(liStr);
          theLiDom.data('theName', dataObj.name);
          theLiDom.data('theStatus', dataObj.status);
          theLiDom.data('theSpeed', dataObj.avgSpeed);
          keyRoadClick(theLiDom);
          theUl.append(theLiDom)
        }

      })
    }
  }

  /**
   * 重点路段li点击事件
   * @param liDom
   */
  function keyRoadClick(liDom) {
    liDom.on('click', function () {
      // window['nowTab'] = nowTab;
      // debugger
      // console.log($(this).data('theName'));
      var theName = $(this).data('theName');
      var theSpeed = $(this).data('theSpeed');
      var theStatus = $(this).data('theStatus');
      var fData = $(this).data('fData');
      // debugger
      if (fData) {
        fData = fData.map(function (t) {
          return t + ''
        });
      }

      var theData = {
        name: theName,
        data1: '平均车速: ' + theSpeed + 'km/h',
        data2: '通行状态: ' + theStatus
      };
      for (var i = 0; i < LuDuanDataArr.length; i++) {
        var roadObj = LuDuanDataArr[i];
        if (theName === roadObj.name) {
          drawKeyRoadLine(roadObj.xys);
          var xysArr = roadObj.xys.split(';');
          var theMiddlePointArr = fData ? fData : xysArr[parseInt(xysArr.length / 2)].split(',');
          // debugger
          addLuWangMarker(theMiddlePointArr, theData);
          break
        }
      }
      // showTabs();
      // hideTab2();
      // hideCurLocaction();
      // showTheTabArrow();
      // $('#tab-name').empty();
      // initCenterBG();

      showTabs();
      hideTab2();
      hideCurLocaction();
      $('#floor').addClass('dn');
      $('#tab-name').empty();
      initCenterBG();
      showTheTabArrow()
    })
  }

  var luWangMarker = null;  // 路网  路中心点
  /**
   * 清除路网的marker,关闭信息窗体
   */
  function clearCenterMarker() {
    if (luWangMarker) {
      theMap.remove(luWangMarker)
    }
    closeInfoWindow()
  }

  /**
   * 高速路网 点击道路li后 显示中心的marker
   * @param lnglatArr 经纬度数组
   * @param dataObj 目标数据数组
   */
  function addLuWangMarker(lnglatArr, dataObj) {
    // debugger
    clearCenterMarker();
    var theArr = lnglatArr.map(function (t) {
      return parseFloat(t)
    });
    var title = dataObj.name, content = [];

    if (title === '莞佛高速虎门大桥') {
      luWangMarker = new AMap.Marker({
        position: new AMap.LngLat(113.613506, 22.789804),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '中间点',
        content: '<div style="color: black;"></div>'
      });
    } else {
      luWangMarker = new AMap.Marker({
        position: new AMap.LngLat(theArr[0], theArr[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '中间点',
        content: '<div style="color: black;"></div>'
      });
    }

    //实例化信息窗体
    var infoWindow = new AMap.InfoWindow({
      isCustom: true,  //使用自定义窗体
      content: createInfoWindow(dataObj),
      offset: new AMap.Pixel(11, 0),
      position: luWangMarker.getPosition()
    });

    theMap.add(luWangMarker);
    // 打开信息窗体
    infoWindow.open(theMap);
    // theMap.setFitView(luWangMarker, theMap.RoadPaths);
    var theZoom = thePlaceZoomObj[title];
    if (nowTab === tabArr[2]) {
      theZoom = 13;
    }
    theMap.setFitView(luWangMarker, null, null, theZoom);
  }

  //构建自定义信息窗体
  function createInfoWindow(content) {
    var container = document.createElement("div");
    var info = document.createElement("div");
    info.className = "amap-info-content2 amap-info-outer";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var roadNameContainer = document.createElement('div');
    var camImg = document.createElement('img');
    var camImg2 = document.createElement('img');
    var titleD = document.createElement("h4");
    var p = document.createElement("p");
    var closeX = document.createElement("a");
    var bottom = document.createElement("div");

    roadNameContainer.className = 'road-name-container';


    titleD.className = 'infoTitle';
    titleD.innerHTML = content.name;
    p.className = 'infoContent';
    $(p).attr('id', 'infoContent');
    // p.innerHTML = '方向:' + content.dir + ' ' + '长度:' + content.jamDist;
    p.innerHTML = content.data1 + ' ' + content.data2;
    closeX.className = 'amap-info-close';
    closeX.href = 'javascript: void(0)';
    closeX.innerHTML = 'x';
    // closeX.src = "https://webapi.amap.com/images/close2.gif";

    roadNameContainer.appendChild(titleD);
    closeX.onclick = closeInfoWindow;
    bottom.className = 'amap-info-sharp';

    // info.appendChild(titleD);
    info.appendChild(roadNameContainer);
    if (nowTab === tabArr[2]) {  // 高速监测要显示
      // info.appendChild(camImg);
      var theResultArr = createCamDom(content, theRoadCamObj);
      if (theResultArr) {
        for (var i = 0; i < theResultArr.length; i++) {
          var theImgDom = theResultArr[i];
          $(roadNameContainer).append(theImgDom)
        }
      }

    }
    info.appendChild(p);
    container.appendChild(info);
    container.appendChild(closeX);
    container.appendChild(bottom);

    return container;
  }

  /**
   * 创建摄像头dom
   * @param content
   * @param camObj
   */
  function createCamDom(content, camObj) {
    var theContent = content;
    var theCamObj = camObj;
    var idx = 0;
    var resultArr = [];

    var theCamArr = theCamObj[theContent.name];
    if (!theCamArr) {
      console.log('没有摄像头id!');
      return
    }
    // debugger
    for (var i = 0; i < theCamArr.length; i++) {
      idx++;
      var theCamId = theCamArr[i];
      var theImgDom = $('<img>');
      var titleData = theContent.name + idx + '号摄像头';
      theImgDom.attr('title', titleData);
      theImgDom.data('id', theCamId);
      theImgDom.attr('src', 'yjzx/img/cam_active.png');
      theImgDom.on('click', function () {
        var theId = $(this).data('id');
        window.location.href = 'SHWGOIE:http://14.23.164.13:7001/video/?vid=' + theId;
      });
      resultArr.push(theImgDom);
    }
    return resultArr
  }

  //构建自定义信息窗体2,直接用string
  function createInfoWindow2(content) {
    var result = '';
    if (nowTab === tabArr[0]) {
      result = '  <div>\n' +
        '    <div class="amap-info-content2 amap-info-outer"><h4 class="infoTitle">' + content.name + '</h4>\n' +
        '      <p class="infoContent">' + content.data1 + '</p></div>\n' +
        '    <a class="amap-info-close" href="javascript: void(0)">x</a>\n' +
        '    <div class="amap-info-sharp"></div>\n' +
        '  </div>';
    } else {
      if (content.name === '华南快速') {
        var theImgStr = '<img class="road-cam-img" id="road-cam-img" src="yjzx/img/cam_active.png"></img>\n';
        result = '  <div>\n' +
          '<div class="amap-info-content2 amap-info-outer">' +
          '<div class="road-name-container">\n' +
          '<h4 class="infoTitle">' + content.name + '</h4>\n' +
          theImgStr +
          '</div>\n' +
          '   <p class="infoContent">' + content.data1 + '</p></div>\n' +
          '    <a class="amap-info-close" href="javascript: void(0)" onclick="closeInfoWindow">x</a>\n' +
          '    <div class="amap-info-sharp"></div>\n' +
          '  </div>';

      } else {
        result = '  <div>\n' +
          '    <div class="amap-info-content2 amap-info-outer"><h4 class="infoTitle">' + content.name + '</h4>\n' +
          '      <p class="infoContent">' + content.data1 + '</p></div>\n' +
          '    <a class="amap-info-close" href="javascript: void(0)">x</a>\n' +
          '    <div class="amap-info-sharp"></div>\n' +
          '  </div>';
      }
    }


    return result
  }

  /**
   * 道路摄像头点击
   */
  function clickRoadCam() {
    // debugger
    console.log(123, this.dataset.roadName);
    var theName = this.dataset.roadName;
    var theID = theRoadCamObj[theName][0];
    if (!theID) {
      console.log('没有道路Id!');
      return
    }
    window.location.href = 'SHWGOIE:http://14.23.164.13:7001/video/?vid=' + theID;
  }


//关闭信息窗体
  function closeInfoWindow() {
    theMap.clearInfoWindow();
  }

  /**
   * 清空搜索框下的站点
   */
  function clearStation() {
    var sb3 = $('#station-box-3');
    var sb2 = $('#station-box-2');
    var sb1 = $('#station-box-1');
    var theArr = [sb1, sb2, sb3];
    for (var i = 0; i < theArr.length; i++) {
      var sb = theArr[i];
      // sb.find('header').empty();
      sb.find('ul').empty();
    }
  }

  /**
   * 显示搜索框下的站点
   */
  function showStation() {
    var sb3 = $('#station-box-3');
    var sb2 = $('#station-box-2');
    var sb1 = $('#station-box-1');
    var theArr = [sb1, sb2, sb3];
    for (var i = 0; i < theArr.length; i++) {
      var sb = theArr[i];
      // sb.find('header').empty();
      sb.show()
    }
  }

  /**
   *  搜索框站点列表的点击
   */
  function stationLiBindClick() {
    var stationLiArr = $('#station-box').find('li');
    for (var i = 0; i < stationLiArr.length; i++) {
      var theLi = stationLiArr[i];
      $(theLi).on('click', function () {
        var theLiName = $(this).text();
        goToPointByName(theLiName);
        curPosition = theLiName;
        var curPosDataBox = $('#cur-pos-data-box');
        var tabBoxCur = $('#tab-box-cur');
        var arrows = tabBoxCur.find('.arrow');
        tabBoxCur.find('.up').addClass('dn');
        tabBoxCur.find('.down').removeClass('dn');

        curPosDataBox.hide(300);
        isHideStation = true;
        // console.log('m',m.C.extData['枢纽名称']);
        // changePosText(theLiName);
        hideTabs(nowTab)
      })

    }
  }

  /**
   * 高速监测-控制面板的初始化
   */
  function initPanel() {
    var jiancePanel = $('#jiance_panel');
    var liArr = jiancePanel.find('li');
    for (var i = 0; i < liArr.length; i++) {
      var liDom = liArr[i];
      $(liDom).removeClass('no-active');
    }
  }

  /**
   * 高速监测-控制面板的点击
   */
  function panelBindClick() {
    var jiancePanel = $('#jiance_panel');
    var liArr = jiancePanel.find('li');
    for (var i = 0; i < liArr.length; i++) {
      var liDom = liArr[i];
      $(liDom).on('click', function () {
        for (var j = 0; j < liArr.length; j++) {
          var li = liArr[j];
          $(li).removeClass('no-active');
        }
        $(this).addClass('no-active');
        var theText = $(this).text();
        if (theText === '高速路段') {
          pointControl.hideMarkers();
          showJamMarkers()
        } else {
          pointControl.showMarkers();
          hideJamMarkers()
        }
      })
    }
  }

  /**
   * nowTab是枢纽时, 搜索框站点列表的操作
   */
  function addTab0Station() {
    var stationDom;
    var markerArr = pointControl.markes;
    var sb1 = $('#station-box-1');
    var sb2 = $('#station-box-2');
    var sb3 = $('#station-box-3');
    for (var i = 0; i < markerArr.length; i++) {
      var hasCam = false;
      var m = markerArr[i];
      var mType = m.C.extData['枢纽类别'];
      var mName = m.C.extData['枢纽名称'];
      stationDom = $('<li>' + mName + '</li>');

      for (var j = 0; j < theCamArr.length; j++) {
        var camObj = theCamArr[j];
        if (camObj.name === mName) {
          hasCam = true;
          break
        }
      }
      if (hasCam) {
        stationDom = $('<li>' + mName + '<i class="cam-icon"></i></li>');
      }

      if (mType === '铁路') {
        // stationDom = $('<li>' + mName + '</li>');

        sb1.find('header').text(mType);
        // debugger
        sb1.find('ul').append(stationDom);
      }
      else if (mType === '机场') {
        // stationDom = $('<li>' + mName + '</li>');

        sb3.find('header').text(mType);
        // debugger
        sb3.find('ul').append(stationDom);
      }
      else if (mType === '客运站') {
        // stationDom = $('<li>' + mName + '</li>');

        sb2.find('header').text(mType);
        // debugger
        sb2.find('ul').append(stationDom);
      }
    }
    stationLiBindClick();
  }

  /**
   * 显示不同tab的筛选地点
   */
  function addStation2() {
    clearStation();  // 先清空
    showStation();

    var tgt;
    var sb1 = $('#station-box-1');
    var sb2 = $('#station-box-2');
    var sb3 = $('#station-box-3');
    var markerArr = pointControl.markes;
    if (nowTab === tabArr[0]) {  // 枢纽
      addTab0Station();
      showStation();
      return
    }
    else if (nowTab === tabArr[1]) {  // 服务区
      sb1.hide();
      sb3.hide();
      tgt = sb2;
    }
    else if (nowTab === tabArr[2]) {  // 收费站
      sb1.hide();
      sb2.hide();
      tgt = sb3;
    }

    // debugger
    for (var i = 0; i < markerArr.length; i++) {
      var m = markerArr[i];

      var stationDom = $('<li>' + m.C.extData['枢纽名称'] + '</li>');
      // debugger
      // debugger
      tgt.find('ul').append(stationDom);
    }
    tgt.find('header').text(m.C.extData['枢纽类别']);

    stationLiBindClick();

  }

  /**
   * 点击2级tab
   * @param target  目标
   * @param me  this
   */
  function clickTab2(target, me) {
    // console.log(target,me);

    // 隐藏
    $('.arrow.up').addClass('dn');
    $('.arrow.down').removeClass('dn');
    isHideStation = true;
    // 组织冒泡
    $(me).find('.li-tab-box').on('click', function (e) {
      e.stopPropagation()
    });

    if ($(me).hasClass('active')) {  // 如果点击的是已经active的tab
      $(me).removeClass('active');
      $(me).find('.li-tab-box').css('visibility', 'hidden')
      return
    }
    for (var j = 0; j < target.length; j++) {
      var obj = target[j];
      $(obj).removeClass('active');
      $(obj).find('.li-tab-box').css('visibility', 'hidden')
    }
    $(me).addClass('active');
    $(me).find('.li-tab-box').css('visibility', 'visible')
    // myChart.resize();

    initTab2(me.dataset.name);
  }

  /**
   * 刷新信息窗体人数
   */
  function refreshInfoWindow(num) {
    // debugger
    var infoC = $('#infoContent');
    infoC.text('当前人数: ' + num + '人');
  }

  /**
   * 点击2级tab后,初始化相关图表,日历
   * @param tab2Name
   */
  function initTab2(tab2Name) {
    initCalendar();
    initRealTimeNum();
    if (nowTab === tabArr[0] && tab2Name === '实时客流') {  // 交通枢纽
      // 请求客流量数据
      getRealTimeFlowDataT1();
      tab2Li2InitEchart();
      tab2Li2InitEchart2();
      // initCalendar();
    }
    if (nowTab === tabArr[0] && tab2Name === '旅客洞察') {
      initDongchaTab();
      getPassengerData(tab2Li2DefaultDate);
      getAreaData($(tabDomNameArr[0]), '省外', tab2Li2DefaultDate);  // 默认省外

      // tab2Li3InitEchart1();
      tab2Li3InitEchart2();
      tab2Li3InitEchart3();
      tab2Li3InitEchart4();
    }
    if (nowTab === tabArr[0] && tab2Name === '旅客趋势') {

      tab2Li4InitEchart();
      tab2Li4InitEchart2();
    }

    if (nowTab === tabArr[1] && tab2Name === '实时客流') {  // 服务区
      getRealTimeFlowDataT2();
      tab3Li2InitEchart1();
      tab3Li2InitEchart2();
    }
    if (nowTab === tabArr[1] && tab2Name === '旅客洞察') {
      initDongchaTab2();
      getAreaData2($(tabDomNameArr[1]), '境外', tab3Li2DefaultDate);  // 默认省外
      // tab3Li3InitEchart();
      tab3Li3InitKLHX2();
      guishufenxiChart();
    }
    if (nowTab === tabArr[1] && tab2Name === '旅客趋势') {
      tab3Li4InitEchart()
    }

    if (nowTab === tabArr[2] && tab2Name === '实时客流') {  // 收费站
      getRealTimeFlowDataT3();
      tab4Li2initEchart();
      tab4Li2initEchart2();
    }
    if (nowTab === tabArr[2] && tab2Name === '旅客洞察') {
      getDayCarFlowT3(tab4Li2DefaultDate);
      tab4Li3InitEchart1();
      tab4Li3InitEchart2();
      tab4Li2InitEchart3();  // 客流画像
    }
    if (nowTab === tabArr[2] && tab2Name === '旅客趋势') {
      tab4Li4InitEchart1();
      // tab4Li4InitEchart2();
    }


  }

  function getmaxLen(tgt) {
    // var videoList = $(id);
    var videoList = tgt;

    var listLis = videoList.find('li');
    var liLen = parseInt($(listLis[0]).css('width'));
    var listLisLen = liLen * listLis.length;
    // debugger
    var maxLen = listLisLen - parseInt(videoList.css('width'));

    console.log('maxLen:', maxLen);
    return maxLen
  }

  function jiankongEvent(whichLi) {
    var tgt = $(whichLi);
    // var addBox = $('.add-box');
    // var videoPlayBox2 = $('.video-play-box2');
    // var closeIcon = $('.close-icon');
    console.log(tgt)
    var addBox = tgt.find('.add-box');
    var videoPlayBox2 = tgt.find('.video-play-box2');
    var closeIcon = tgt.find('.close-icon');

    addBox.on('click', function () {
      videoPlayBox2.addClass('db');

    });
    closeIcon.on('click', function () {
      videoPlayBox2.removeClass('db');

    });
    //可拖拽的进度条
    var theScale = function (btn, bar) {
      this.btn = document.getElementById(btn);
      this.bar = document.getElementById(bar);
      this.init();
    };
    theScale.prototype = {
      init: function () {
        var f = this, g = document, b = window, m = Math;
        f.btn.onmousedown = function (e) {
          var x = (e || b.event).clientX;
          var l = this.offsetLeft;
          var max = f.bar.offsetWidth - this.offsetWidth;
          g.onmousemove = function (e) {
            var thisX = (e || b.event).clientX;
            var to = m.min(max, m.max(-2, l + (thisX - x)));
            f.btn.style.left = to + 'px';
            // f.ondrag(m.round(m.max(0, to / max) * 100), to);
            f.ondrag((to / max), to, tgt);
            b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
          };
          g.onmouseup = new Function('this.onmousemove=null');
        };
      },
      ondrag: function (percent, x, target) {  // 百分比,位移距离

        var ul = target.find('.video-list').find('ul');
        console.log(ul)
        var maxLen = getmaxLen(target.find('.video-list'));

        // console.log(percent)
        ul.css('left', (-1 * percent * maxLen) + 'px')
      }
    };

    new theScale('tuodong', 'line');
    new theScale('tuodong2', 'line2');
    new theScale('tuodong3', 'line3');
    // console.log('dis:',tuodong.dis)

  }

  /**
   * 情况摄像头列表
   */
  function clearCamLi() {
    var theDom;
    if (nowTab === tabArr[0]) {
      theDom = $('#tab2')
    }
    else if (nowTab === tabArr[1]) {
      theDom = $('#tab2')
    } else {
      return
    }
    var theUl = theDom.find('.camera-box').find('ul');
    theUl.empty();
  }

  /**
   * 添加摄像头Li
   */
  function addCamLi() {
    clearCamLi();
    var theDom, theCamData;
    if (nowTab === tabArr[0]) {
      theDom = $('#tab2')
    }
    else if (nowTab === tabArr[1]) {
      theDom = $('#tab2')
    } else {
      return
    }
    var theUl = theDom.find('.camera-box').find('ul');
    // var theArr = theCamObj[curPosition];
    for (var k = 0; k < theCamArr.length; k++) {
      var camObj = theCamArr[k];
      var thePlaceName = camObj.name;
      if (thePlaceName === curPosition) {
        console.log('找到摄像头数据了');
        theCamData = camObj.data;
        break
      }
    }
    var tgt = tabArrDom.filter(function (t) {
      return t.name === nowTab
    });
    if (!theCamData) {
      console.log('没有摄像头数据');
      var theTgtTab = $(tgt[0].class);
      // theTgtTab.find('.tab-box2-li1').hide();
      // var liTabBoxArr = theTgtTab.find('.li-tab-box');
      // for (var i = 0; i < liTabBoxArr.length; i++) {
      //   var litabbox = liTabBoxArr[i];
      //   // console.log($(litabbox).css('top'));
      //   var oldTop = parseInt($(litabbox).css('top'));
      //
      //   $(litabbox).css('top',oldTop + 150 + 'px')
      // }
      // debugger
      return
    }
    var idx = 0;
    for (var i = 0; i < theCamData.length; i++) {
      if (i >= 4) {  // 最多展示4个
        break
      }
      var idItem = theCamData[i];
      var theFullName = '';
      var camNameData = idItem[0].split(' ');
      var theId = idItem[1];
      var otherData = idItem[2];
      for (var j = 0; j < camNameData.length; j++) {
        var item = camNameData[j];
        if (!item) {
          continue
        }
        theFullName += item;
      }
      idx++;
      var liStr = ' <li>\n' +
        '              <section>\n' +
        '                <img src="yjzx/img/cam_nor.png" alt="">\n' +
        '              </section>\n' +
        '              <span>' + theFullName + '</span>\n' +
        '            </li>';
      var liDom = $(liStr);
      liDom.data('id', theId);
      liDom.on('click', function () {
        var theId = $(this).data('id');
        window.location.href = 'SHWGOIE:http://14.23.164.13:7001/video/?vid=' + theId;
      });
      theUl.append(liDom);
    }
    $(tgt[0].class).find('.tab-box2-li1').show();

  }

  /**
   * 清空预警列表
   */
  function clearYjUL() {
    var theUlArr = $('#top3 ul');
    var yjNum = theUlArr.find('.yj-num');
    for (var j = 0; j < yjNum.length; j++) {
      var num = yjNum[j];
      num.empty()
    }
    for (var i = 0; i < theUlArr.length; i++) {
      var ulDom = theUlArr[i];
      $(ulDom).empty();
    }
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

  var getYJDataAjax = null;
  var TerminalWarningList = [], ServiceAreaWarningList = [];

  /**
   * 获取3级预警数据
   */
  // function getYJData(theTab) {
  //   var url, keyName, theNumKey;
  //   if (nowTab === tabArr[0]) {
  //     url = 'terminal/getTerminalWarningList.do';
  //     keyName = 'listTerminal';
  //     theNumKey = 'userCnt'
  //   }
  //   else if (nowTab === tabArr[1]) {
  //     url = 'serviceArea/getServiceAreaWarningList.do';
  //     keyName = 'listServiceArea';
  //     theNumKey = 'userCnt'
  //   }
  //   else if (nowTab === tabArr[2]) {
  //     url = 'toll/getTollWarningList.do';
  //     keyName = 'listToll';
  //     theNumKey = 'pepValue';
  //     pointControl.showPoints(nowTab, []);
  //     markerBindClick();
  //     addStation2();
  //     return
  //   } else {
  //     return
  //   }
  //
  //   var top3 = $('#top3');
  //   var isLoading = top3.data('isLoading');
  //   // if(isLoading) {
  //   //   return
  //   // }
  //   top3.data('isLoading', true);
  //
  //   // if (getYJDataAjax) {
  //   //   // debugger
  //   //   clearYjUL();
  //   //   getYJDataAjax.abort();
  //   // }
  //   var data = {};
  //   $.ajax({
  //     type: "POST",
  //     url: serviceBase + url,
  //     data: {},
  //     dataType: "json",
  //     theTab: nowTab,
  //     success: function (data) {
  //       // console.log('reqRoadData',data)
  //       top3.data('isLoading', false);
  //       // clearYjUL();
  //       if (data && data.isSuccess) {
  //
  //         getYJDataAjax = null;
  //         var yongji = $('#yongji');
  //         var shizhong = $('#shizhong');
  //         var shushi = $('#shushi');
  //         var ss = {
  //           name: '舒适',
  //           dom: shushi,
  //           icon: 'top3-icon3',
  //           pointClass: 'point3',
  //           data: data.data[keyName + '_ss'],
  //         };
  //         var sz = {
  //           name: '适中',
  //           dom: shizhong,
  //           icon: 'top3-icon2',
  //           pointClass: 'point2',
  //           data: data.data[keyName + '_sz'],
  //
  //         };
  //         var yj = {
  //           name: '拥挤',
  //           dom: yongji,
  //           icon: 'top3-icon1',
  //           pointClass: 'point1',
  //           data: data.data[keyName + '_yj']
  //         };
  //
  //         var dataArr = [ss, sz, yj];
  //         if (this.theTab === nowTab) {
  //           // debugger
  //           pointControl.showPoints(nowTab, dataArr); // 刷新了markers
  //           markerBindClick();
  //           addStation2();
  //         }
  //
  //         for (var i = 0; i < dataArr.length; i++) {
  //           var item = dataArr[i];
  //           // debugger
  //           for (var j = 0; j < item.data.length; j++) {
  //             var temp = item.data[j];
  //             var num;
  //             // if(temp.userCnt>=10000) {
  //             // num = temp.userCnt.toString();
  //             // num = num.slice(0, num.length - 4);
  //             // temp.userCnt = parseInt(num);
  //             temp.userCnt = toWan2(temp[theNumKey]);
  //             // }
  //           }
  //           if (nowTab !== tabArr[2] && this.theTab === nowTab) {
  //             // debugger
  //             addYjLi(item)
  //           }
  //         }
  //
  //       }
  //     }
  //   });
  //
  //   // $.axpost(url, data, function (data) {
  //   //   // console.log('c',curAjax);
  //   //   top3.data('isLoading',false);
  //   //   clearYjUL();
  //   //   if (data && data.isSuccess) {
  //   //
  //   //     getYJDataAjax = null;
  //   //     var yongji = $('#yongji');
  //   //     var shizhong = $('#shizhong');
  //   //     var shushi = $('#shushi');
  //   //     var ss = {
  //   //       name: '舒适',
  //   //       dom: shushi,
  //   //       icon: 'top3-icon3',
  //   //       pointClass: 'point3',
  //   //       data: data.data[keyName + '_ss'],
  //   //     };
  //   //     var sz = {
  //   //       name: '适中',
  //   //       dom: shizhong,
  //   //       icon: 'top3-icon2',
  //   //       pointClass: 'point2',
  //   //       data: data.data[keyName + '_sz'],
  //   //
  //   //     };
  //   //     var yj = {
  //   //       name: '拥挤',
  //   //       dom: yongji,
  //   //       icon: 'top3-icon1',
  //   //       pointClass: 'point1',
  //   //       data: data.data[keyName + '_yj']
  //   //     };
  //   //
  //   //     var dataArr = [ss, sz, yj];
  //   //     pointControl.showPoints(nowTab, dataArr); // 刷新了markers
  //   //     markerBindClick();
  //   //     addStation2();
  //   //
  //   //     for (var i = 0; i < dataArr.length; i++) {
  //   //       var item = dataArr[i];
  //   //       // debugger
  //   //       for (var j = 0; j < item.data.length; j++) {
  //   //         var temp = item.data[j];
  //   //         var num;
  //   //         // if(temp.userCnt>=10000) {
  //   //         // num = temp.userCnt.toString();
  //   //         // num = num.slice(0, num.length - 4);
  //   //         // temp.userCnt = parseInt(num);
  //   //         temp.userCnt = toWan2(temp[theNumKey]);
  //   //         // }
  //   //       }
  //   //       if(nowTab!==tabArr[2]) {
  //   //         addYjLi(item)
  //   //       }
  //   //     }
  //   //
  //   //   }
  //   // });
  //
  //   function addYjLi(item) {
  //     var index = 0;
  //     for (var i = 0; i < item.data.length; i++) {
  //       var liData = item.data[i];
  //       index++;
  //       var liDom = '<li class="top3-li" title="' + liData.postionName + '">\n' +
  //         '<i class="' + item.icon + '">' + index + '</i>\n' +
  //         '<p><label class="p-name ellipsis">' + liData.postionName + '</label> <span>当前客流 <i class="num">' + liData.userCnt + '</i>人</span></p>\n' +
  //         '</li>';
  //       var temp = $(liDom);
  //
  //       temp.on('click', function () {
  //         // debugger
  //         var name = $(this).find('.p-name').text();
  //         curPosition = name;
  //         goToPointByName(name);
  //         hideTabs(name);
  //         pointControl.hideMarkers();
  //         hideLiTabBox();
  //       });
  //       item.dom.append(temp)
  //     }
  //
  //     item.dom.parent().find('.yj-num').text(item.data.length + '处');
  //   }
  // }

  /**
   * 请求枢纽预警数据
   */
  function reqTerminalWarningList() {
    var isLoading = layer.load();
    var url, keyName, theNumKey;
    // url = 'terminal/getTerminalWarningList.do';
    url = 'terminal/getTerminalWarningListApp.do';
    keyName = 'listTerminal';
    theNumKey = 'userCnt';

    var xhr = $.ajax({
      type: "POST",
      url: serviceBase + url,
      data: {},
      timeout: 15000,          // 设置超时时间
      dataType: "json",
      theTab: nowTab,
      success: function (data) {
        // console.log('reqRoadData',data)
        // clearYjUL();
        tab0Time = new Date();
        TerminalWarningList = [];
        if (data && data.isSuccess) {
          var yongji = $('#yongji');
          var shizhong = $('#shizhong');
          var shushi = $('#shushi');
          var ss = {
            name: '舒适',
            dom: shushi,
            icon: 'top3-icon3',
            pointClass: 'point3',
            data: data.data[keyName + '_ss'],
          };
          var sz = {
            name: '适中',
            dom: shizhong,
            icon: 'top3-icon2',
            pointClass: 'point2',
            data: data.data[keyName + '_sz'],
          };
          var yj = {
            name: '拥挤',
            dom: yongji,
            icon: 'top3-icon1',
            pointClass: 'point1',
            data: data.data[keyName + '_yj']
          };

          var dataArr = [ss, sz, yj];
          TerminalWarningList = dataArr;
          // debugger
          if (nowTab === tabArr[0]) {
            // debugger
            pointControl.showPoints(nowTab, dataArr); // 刷新了markers
            markerBindClick();
            addStation2();
          }

          for (var i = 0; i < dataArr.length; i++) {
            var item = dataArr[i];
            // debugger
            for (var j = 0; j < item.data.length; j++) {
              var temp = item.data[j];
              temp.userCnt = toWan2(temp[theNumKey]);
            }
            if (nowTab === tabArr[0]) {
              // debugger
              addYjLi(item)
            }
          }
          var isLoaded = YJIsLoaded();
          if (isLoaded) {
            //   debugger
            layer.closeAll()
          }
        }
      },
      complete: function (XMLHttpRequest, status) {
        if (status == 'timeout') {
          xhr.abort();    // 超时后中断请求
          alert('网络超时,请刷新')
          location.reload()
        }
      }
    });

    // $.axpost(url,{},function (data) {
    //   // console.log('reqRoadData',data)
    //   // clearYjUL();
    //   tab0Time = new Date();
    //   TerminalWarningList = [];
    //   if (data && data.isSuccess) {
    //     var yongji = $('#yongji');
    //     var shizhong = $('#shizhong');
    //     var shushi = $('#shushi');
    //     var ss = {
    //       name: '舒适',
    //       dom: shushi,
    //       icon: 'top3-icon3',
    //       pointClass: 'point3',
    //       data: data.data[keyName + '_ss'],
    //     };
    //     var sz = {
    //       name: '适中',
    //       dom: shizhong,
    //       icon: 'top3-icon2',
    //       pointClass: 'point2',
    //       data: data.data[keyName + '_sz'],
    //     };
    //     var yj = {
    //       name: '拥挤',
    //       dom: yongji,
    //       icon: 'top3-icon1',
    //       pointClass: 'point1',
    //       data: data.data[keyName + '_yj']
    //     };
    //
    //     var dataArr = [ss, sz, yj];
    //     TerminalWarningList = dataArr;
    //     // debugger
    //     if (nowTab === tabArr[0]) {
    //       // debugger
    //       pointControl.showPoints(nowTab, dataArr); // 刷新了markers
    //       markerBindClick();
    //       addStation2();
    //     }
    //
    //     for (var i = 0; i < dataArr.length; i++) {
    //       var item = dataArr[i];
    //       // debugger
    //       for (var j = 0; j < item.data.length; j++) {
    //         var temp = item.data[j];
    //         temp.userCnt = toWan2(temp[theNumKey]);
    //       }
    //       if (nowTab === tabArr[0]) {
    //         // debugger
    //         addYjLi(item)
    //       }
    //     }
    //     var isLoaded = YJIsLoaded();
    //     if(isLoaded) {
    //       //   debugger
    //       layer.closeAll()
    //     }
    //   }
    // })
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
    var isLoading2 = layer.load();

    var xhr = $.ajax({
      type: "POST",
      url: serviceBase + url,
      data: {},
      timeout: 15000,          // 设置超时时间

      dataType: "json",
      theTab: nowTab,
      success: function (data) {
        // console.log('reqRoadData',data)
        // clearYjUL();
        tab1Time = new Date();
        ServiceAreaWarningList = [];
        if (data && data.isSuccess) {

          var yongji = $('#yongji');
          var shizhong = $('#shizhong');
          var shushi = $('#shushi');
          var ss = {
            name: '舒适',
            dom: shushi,
            icon: 'top3-icon3',
            pointClass: 'point3',
            data: data.data[keyName + '_ss'],
          };
          var sz = {
            name: '适中',
            dom: shizhong,
            icon: 'top3-icon2',
            pointClass: 'point2',
            data: data.data[keyName + '_sz'],

          };
          var yj = {
            name: '拥挤',
            dom: yongji,
            icon: 'top3-icon1',
            pointClass: 'point1',
            data: data.data[keyName + '_yj']
          };

          var dataArr = [ss, sz, yj];
          ServiceAreaWarningList = dataArr;
          if (nowTab === tabArr[1]) {
            // debugger
            pointControl.showPoints(nowTab, dataArr); // 刷新了markers
            markerBindClick();
            addStation2();
          }

          for (var i = 0; i < dataArr.length; i++) {
            var item = dataArr[i];
            // debugger
            for (var j = 0; j < item.data.length; j++) {
              var temp = item.data[j];
              temp.userCnt = toWan2(temp[theNumKey]);
            }
            if (nowTab === tabArr[1]) {
              // debugger
              addYjLi(item)
            }
          }
          var isLoaded = YJIsLoaded();
          // debugger
          if (isLoaded) {

            layer.closeAll()
          }
        }
      },
      complete: function (XMLHttpRequest, status) {
        if (status == 'timeout') {
          xhr.abort();    // 超时后中断请求
          alert('网络超时,请刷新')
          location.reload()
        }
      }
    });

    // $.axpost(url, {}, function (data) {
    //   // console.log('reqRoadData',data)
    //   // clearYjUL();
    //   tab1Time = new Date();
    //   ServiceAreaWarningList = [];
    //   if (data && data.isSuccess) {
    //
    //     var yongji = $('#yongji');
    //     var shizhong = $('#shizhong');
    //     var shushi = $('#shushi');
    //     var ss = {
    //       name: '舒适',
    //       dom: shushi,
    //       icon: 'top3-icon3',
    //       pointClass: 'point3',
    //       data: data.data[keyName + '_ss'],
    //     };
    //     var sz = {
    //       name: '适中',
    //       dom: shizhong,
    //       icon: 'top3-icon2',
    //       pointClass: 'point2',
    //       data: data.data[keyName + '_sz'],
    //
    //     };
    //     var yj = {
    //       name: '拥挤',
    //       dom: yongji,
    //       icon: 'top3-icon1',
    //       pointClass: 'point1',
    //       data: data.data[keyName + '_yj']
    //     };
    //
    //     var dataArr = [ss, sz, yj];
    //     ServiceAreaWarningList = dataArr;
    //     if (nowTab === tabArr[1]) {
    //       // debugger
    //       pointControl.showPoints(nowTab, dataArr); // 刷新了markers
    //       markerBindClick();
    //       addStation2();
    //     }
    //
    //     for (var i = 0; i < dataArr.length; i++) {
    //       var item = dataArr[i];
    //       // debugger
    //       for (var j = 0; j < item.data.length; j++) {
    //         var temp = item.data[j];
    //         temp.userCnt = toWan2(temp[theNumKey]);
    //       }
    //       if (nowTab === tabArr[1]) {
    //         // debugger
    //         addYjLi(item)
    //       }
    //     }
    //     var isLoaded = YJIsLoaded();
    //     // debugger
    //     if (isLoaded) {
    //
    //       layer.closeAll()
    //     }
    //   }
    // })

  }

  function renderTerminalWarningList() {
    clearYjUL();
    var theNumKey = 'userCnt';

    if (nowTab === tabArr[0]) {
      pointControl.showPoints(nowTab, TerminalWarningList); // 刷新了markers
      markerBindClick();
      addStation2();
    }

    for (var i = 0; i < TerminalWarningList.length; i++) {
      var item = TerminalWarningList[i];
      // debugger
      for (var j = 0; j < item.data.length; j++) {
        var temp = item.data[j];
        temp.userCnt = toWan2(temp[theNumKey]);
      }
      if (nowTab === tabArr[0]) {
        // debugger
        addYjLi(item)
      }
    }
  }

  function renderServiceAreaWarningList() {
    clearYjUL();
    var theNumKey = 'userCnt';
    if (nowTab === tabArr[1]) {
      pointControl.showPoints(nowTab, ServiceAreaWarningList); // 刷新了markers
      markerBindClick();
      addStation2();
    }
    for (var i = 0; i < ServiceAreaWarningList.length; i++) {
      var item = ServiceAreaWarningList[i];
      // debugger
      for (var j = 0; j < item.data.length; j++) {
        var temp = item.data[j];
        temp.userCnt = toWan2(temp[theNumKey]);
      }
      if (nowTab === tabArr[1]) {
        // debugger
        addYjLi(item)
      }
    }
  }

  function refreshTerminalWarningList() {
    var timeToRefresh = canRefresh(tab0Time, 5);
    if (timeToRefresh) {
      reqTerminalWarningList()
    } else {
      renderTerminalWarningList()
    }
  }

  function refreshServiceAreaWarningList() {
    var timeToRefresh = canRefresh(tab1Time, 5);
    if (timeToRefresh) {
      reqServiceAreaWarningList()
    } else {
      renderServiceAreaWarningList()
    }
  }

  function addYjLi(item) {
    var index = 0;
    for (var i = 0; i < item.data.length; i++) {
      var liData = item.data[i];
      index++;
      var liDom = '<li class="top3-li" title="' + liData.postionName + '">\n' +
        '<i class="' + item.icon + '">' + index + '</i>\n' +
        // '<p><label class="p-name ellipsis">' + liData.postionName + '</label> <span>当前客流 <i class="num">' + liData.userCnt + '</i>人</span></p>\n' +
        '<p><label class="p-name ellipsis">' + liData.postionName + '</label> <span><i class="num">' + liData.userCnt + '</i>人</span></p>\n' +
        '</li>';
      var temp = $(liDom);

      temp.on('click', function () {
        // debugger
        var name = $(this).find('.p-name').text();
        curPosition = name;
        goToPointByName(name);
        hideTabs(name);
        pointControl.hideMarkers();
        hideLiTabBox();
      });
      item.dom.append(temp)
    }

    item.dom.parent().find('.yj-num').text(item.data.length + '处');
  }


  // 清空位置图片
  function initCenterBG() {
    var imgBox = $('#center-img');
    imgBox.empty();
    // for (var i = 0; i < 2; i++) {
    //   var newImage = new Image();
    //   newImage.src = 'yjzx/img/menu/icon_lower_center.png';
    //   imgBox.append(newImage)
    // }
  }

  /**
   * 初始化实时人数等数据
   */
  function initRealTimeNum() {
    // debugger
    var ssklNumArr = $('.sskl-num');
    var ssklInArr = $('.sskl-in');
    var ssklOutArr = $('.sskl-out');
    var ssklHourAddArr = $('.sskl-hour-add');
    var theArr = [ssklNumArr, ssklInArr, ssklOutArr, ssklHourAddArr];
    $('.total-psg').empty();
    $('.arrival-psg').empty();
    $('.leave-psg').empty();
    theArr.map(function (arr) {
      for (var i = 0; i < arr.length; i++) {
        var theDom = arr[i];
        $(theDom).empty();
      }
    })
  }

  /**
   * 改变当前位置文字
   * @param posName 地名 String
   */
  function changePosText(posName) {
    // console.log(posName);
    // debugger
    initCenterBG();
    var theNum = 2;
    if (posName.length > theNum) {
      var imgBox = $('#center-img');
      var temp = posName.length - theNum;
      var img = imgBox.find('img')[0];
      for (var j = 0; j < temp; j++) {
        var newImage = new Image();
        // newImage.src = img.src;
        newImage.src = 'yjzx/img/menu/icon_lower_center.png';

        // console.log('temp:',temp)
        imgBox.append(newImage)
      }
    }
    // debugger
    $('#tab-name').text(posName);
  }

  // 隐藏1级tab,显示2级tab
  function hideTabs(name) {
    var tab = $('#tab');
    var theTop = '-102px';
    var tabBox = tab.find('.tab-box');
    var noActive;
    // console.log(tab)
    pointControl.hideMarkers();
    // curPosition = name;
    // console.log(curPosition);

    // tab移动
    for (var i = 0; i < tabBox.length; i++) {
      var tabLi = $(tabBox[i]);
      tabLi.css('top', theTop);
      noActive = tabLi.attr('class').indexOf('tab-box-active') == '-1';

      if (noActive) {
        tabLi.css('z-index', '-1');
        tabLi.addClass('vh')
      } else {
        tabLi.css('z-index', '10')
      }
    }
    showCurLocaction();

    var tabBoxCur = $('#tab-box-cur');
    tabBoxCur.css('top', theTop);
    // var tab2 = $('#tab2');
    // tabBoxCur.find('.up').removeClass('dn');
    // tabBoxCur.find('.down').addClass('dn');
    // tab2.removeClass('vh');
    $('#floor').removeClass('dn');

    showWhichTab()
  }

  /**
   * 交通枢纽-实时客流 获取实时客流量
   */
  function getRealTimeFlowDataT1() {
    // debugger
    var url = 'terminal/selectTerminalFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url2 = 'terminal/selectTerminalIn.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url3 = 'terminal/selectTerminalOut.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url4 = 'terminal/selectTerminalHourAdd.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;

    var data = {};
    $.axpost(url, data, function (data) {
      if (data.isSuccess && !isEmptyObject(data.data)) {
        // console.log(data);
        $('#tab2 .sskl-num').html(toMoney(data.data.userCnt));
        refreshInfoWindow(data.data.userCnt);
      }
    });
    $.axpost(url2, data, function (data) {
      if (data.isSuccess && !isEmptyObject(data.data)) {
        // console.log(data);
        $('#tab2 .sskl-in').html(toWan(data.data.userIn))
      }
    });
    $.axpost(url3, data, function (data) {
      if (data.isSuccess && !isEmptyObject(data.data)) {
        // console.log(data);
        $('#tab2 .sskl-out').html(toWan(data.data.userOut));
      }
    });
    // $.axpost(url4, data, function (data) {
    //   if (data.isSuccess && !isEmptyObject(data.data)) {
    //     // console.log(data);
    //     $('#tab2 .sskl-hour-add').html(toWan(data.data.userPerhourAdd));
    //   }
    // });

  }

  /**
   * 交通枢纽-旅客洞察 获取旅客量 默认昨天
   */
  function getPassengerData(date) {
    var d;
    d = date ? date : returnDate(4);
    // d = date?date:returnDate(1);
    var url = 'terminal/selectTerminalPassenger.do?' + 'postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;

    $.axpost(url, {}, function (data) {

      if (data.isSuccess && data.data.length) {
        // console.log('getPassengerData:',data);

        $('#tab2 .scroll-box .total-psg').html(toWan(data.data[0].travelers));
        $('#tab2 .scroll-box .arrival-psg').html(toWan(data.data[0].arrivalValue));
        $('#tab2 .scroll-box .leave-psg').html(toWan(data.data[0].leaveValue));
      }
    });
  }

  /**
   * 服务区-实时客流 获取实时客流量
   */
  function getRealTimeFlowDataT2() {
    var url = 'serviceArea/selectServiceFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url2 = 'serviceArea/selectServiceIn.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url3 = 'serviceArea/selectServiceOut.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url4 = 'serviceArea/selectServiceHourAdd.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;

    var data = {};
    $.axpost(url, data, function (data) {
      if (data.isSuccess && !isEmptyObject(data.data)) {
        // console.log(data);
        $('#tab3 .sskl-num').text(toMoney(data.data.userCnt));
        refreshInfoWindow(data.data.userCnt);

      }
    });
    $.axpost(url2, data, function (data) {
      if (data.isSuccess && !isEmptyObject(data.data)) {
        // console.log(data);
        $('#tab3 .sskl-in').html(toWan(data.data.userIn))
      }
    });
    $.axpost(url3, data, function (data) {
      if (data.isSuccess && !isEmptyObject(data.data)) {
        // console.log(data);
        $('#tab3 .sskl-out').html(toWan(data.data.userOut))
      }
    });
    $.axpost(url4, data, function (data) {
      if (data.isSuccess && !isEmptyObject(data.data)) {
        // console.log(data);
        $('#tab3 .sskl-hour-add').html(toWan(data.data.userPerhourAdd))
      }
    });

  }

  /**
   * 收费站-实时客流
   */
  function getRealTimeFlowDataT3() {
    var url = 'toll/selectTollFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    // var url2 = 'toll/selectTollIn.do?'+'postionType='+positionType+'&postionName='+curPosition;
    // var url3 = 'toll/selectTollOut.do?'+'postionType='+positionType+'&postionName='+curPosition;

    var data = {};
    $.axpost(url, data, function (data) {
      if (!isEmptyObject(data.data) && data.isSuccess) {
        console.log(data);
        // debugger
        $('#tab4 .sskl-num').html(toWan(data.data.pepValue));
        refreshInfoWindow(data.data.pepValue);

      }
    });
    // $.axpost(url2,data,function (data) {
    //   if(data.data&&data.isSuccess) {
    //     // console.log(data);
    //     $('#tab4 .sskl-in').html(toWan(data.data.carIn))
    //   }
    // });
    // $.axpost(url3,data,function (data) {
    //   if(data.data&&data.isSuccess) {
    //     // console.log(data);
    //     $('#tab4 .sskl-out').html(toWan(data.data.carOut))
    //   }
    // });

  }

  /**
   * 收费站-旅客洞察
   */
  function getDayCarFlowT3(date) {
    var url = 'toll/selectTollDayFlow.do?' + 'postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + date;
    var data = {};
    $.axpost(url, data, function (data) {
      if (data.data.length && data.isSuccess) {
        // console.log(data);
        $('#tab4 .qtkl-num').html(toWan(data.data[0].allPeople));
        // $('#tab4 .qtcl-in').html(toWan(data.data[0].inValue));
        // $('#tab4 .qtcl-out').html(toWan(data.data[0].outValue))
      }
    });

  }

  /**
   * 高速路段-查询高速路段实时客流量
   */
  function getRealTimeFlowDataT4() {
    // var str = '虎门大桥';
    var url = 'highSpeed/selectGsFlowRealtime.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url2 = 'highSpeed/selectGsIn.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;
    var url3 = 'highSpeed/selectGsOut.do?' + 'postionType=' + positionType + '&postionName=' + curPosition;

    var data = {};
    $.axpost(url, data, function (data) {
      if (data.data && data.isSuccess) {
        // console.log(data);
        $('#tab5 .sskl-num').html(toWan(data.data.peopleNum))
      }
    });
    $.axpost(url2, data, function (data) {
      if (data.data && data.isSuccess) {
        // console.log(data);
        $('#tab5 .sskl-in').html(toWan(data.data.carNum))
      }
    });
    $.axpost(url3, data, function (data) {
      if (data.data && data.isSuccess) {
        // console.log(data);
        $('#tab5 .sskl-out').html(toWan(data.data.carNum))
      }
    });

  }

  /**
   * 显示2级tab
   */
  function showWhichTab() {
    // 交通枢纽
    if (nowTab === tabArr[0]) {
      $('#tab2').removeClass('vh');
    }
    // 服务区
    if (nowTab === tabArr[1]) {
      $('#tab3').removeClass('vh');

    }
    // 收费站
    if (nowTab === tabArr[2]) {
      $('#tab4').removeClass('vh');

    }
    // 高速监测
    if (nowTab === tabArr[3]) {
      $('#tab5').removeClass('vh');
    }
    isDefaultView = false;
  }

  /**
   * 客流画像-男女占比
   * @param domObj dom对象
   * @param keyName 键值str
   * @param arrName 数据数组
   */
  function addSexNum(domObj, keyName, arrName) {
    // debugger
    if (arrName[keyName].length) {
      var manNum, womenNum;
      for (var j = 0; j < arrName[keyName].length; j++) {
        var obj1 = arrName[keyName][j];
        // debugger
        if (obj1.sex === 1) {
          manNum = formatSexDecimal(obj1.manZb);
          // debugger
          if (manNum <= 0.6 * 100) {
            manNum = (0.6 * 100).toFixed(0);
            womenNum = 100 - manNum;
          }
          else {
            manNum = ((0.25 * (manNum / 100 - 0.6) + 0.6) * 100).toFixed(0);
            womenNum = 100 - manNum;
          }
          // debugger
          // dom.find('.hm.man span').text(formatDecimal(obj1.manZb)+'%')
          domObj.find('.hm.man span').text(manNum + '%');
          // debugger
          domObj.find('.hm.woman span').text(womenNum + '%')
        }
        // if (obj1.sex === 2) {
        //   // dom.find('.hm.woman span').text(formatDecimal(obj1.manZb)+'%')
        //   var womenNum = 100 - parseInt(manNum);
        //   // debugger
        //   domObj.find('.hm.woman span').text(womenNum + '%')
        // }
      }
      domObj.find('.hm.man span').show();
      domObj.find('.hm.woman span').show();
    } else {
      // debugger
      domObj.find('.hm.man span').hide();
      domObj.find('.hm.woman span').hide();
    }


  }

  /**
   * 请求高速路段数据
   * @param name 路段名字
   */
  function reqRoadData(name) {
    console.log('name:', name);

    var url = 'http://restapi.amap.com/v3/road/roadname?city=020&key=8d3ac117e5e739d89d425f8c6798b781&keywords=' + name;
    $.ajax({
      type: "GET",
      url: url,
      data: {},
      dataType: "json",
      success: function (data) {
        // console.log('reqRoadData',data)
        handleRoadData(data.roads);
      }
    });
  }

  /**
   * 重点高速画线-多条
   */
  function drawKeyRoadLines() {
    var lngLatArr = [];
    for (var i = 0; i < LuDuanDataArr.length; i++) {
      var luDuan = LuDuanDataArr[i];
      var theArr = luDuan.xys.split(';');
      lngLatArr.push(theArr);

      // debugger
      // console.log(lngLatArr)
      // traffic.drawLuDuan(lngLatArr);

    }
    traffic.drawRoads(lngLatArr, nowTab);
    // console.log(lngLatArr)
  }

  /**
   * 重点高速画线-单条
   * @param lnglatStr
   */
  function drawKeyRoadLine(lnglatStr) {
    var theArr = lnglatStr.split(';');
    // debugger
    traffic.drawKeyRoad(theArr);
  }

  /**
   * 处理高速路段数据
   * @param arr
   */
  function handleRoadData(arr) {
    var theDataArr = [];

    for (var i = 0; i < arr.length; i++) {
      var lnglatArr = arr[i].polylines;
      // console.log(lnglatArr)
      theDataArr.push(lnglatArr)

    }
    // console.log(theDataArr)
    var theRoadsArr = [];
    for (var j = 0; j < theDataArr.length; j++) {
      var theArr = theDataArr[j];
      for (var k = 0; k < theArr.length; k++) {
        var lnglat = theArr[k];
        // debugger
        var paramArr = lnglat.split(';');
        theRoadsArr.push(paramArr)
      }
    }
    console.log(theRoadsArr)
    // 高速路段画线
    // debugger
    traffic.drawRoads(theRoadsArr, nowTab);
  }

  // 显示1级tab
  function showTabs() {
    var dis = 130;
    var tab = $('#tab');
    var tabBox = tab.find('.tab-box');
    for (var i = 0; i < tabBox.length; i++) {
      var tabLi = $(tabBox[i]);
      tabLi.css('z-index', '1')
      tabLi.removeClass('vh')
      tabLi.css('top', (dis * i) + 'px')
    }

  }

  /**
   * 点击箭头
   * @param tabName 当前一级tab
   * @param arrows  箭头数组
   */
  function clickArrow(tabName, arrows) {
    // debugger
    closeInfoWindow();
    if (isHideStation) {
      isHideStation = false;
      // debugger
      $('#cur-pos-data-box').show()
    } else {
      $('#cur-pos-data-box').hide();
      isHideStation = true;

    }
    for (var j = 0; j < arrows.length; j++) {
      var a2 = arrows[j];
      $(a2).toggleClass('dn')
    }
    var n = tabArrDom[tabName];

    var tabBox2LiArr = $(n).find('.tab-box2-li');
    // var tabBox2LiArr = $('.tab-box2 .tab-box2-li');

    // 左边tab去除active
    for (var i = 0; i < tabBox2LiArr.length; i++) {
      // debugger
      var t = tabBox2LiArr[i];
      $(t).removeClass('active');
      $(t).find('.li-tab-box').css('visibility', 'hidden')
    }
  }

  /**
   * 箭头绑定点击事件
   */
  function arrowBindClick() {
    // console.log($('#tab-box-cur .arrow'))
    var tabBoxCur = $('#tab-box-cur');
    var curPosDataBox = $('#cur-pos-data-box');
    var arrows = tabBoxCur.find('.arrow');

    // 阻止冒泡
    curPosDataBox.on('click', function (e) {
      // console.log('e',e);
      e.stopPropagation()
    });

    tabBoxCur.on('click', function () {
      // debugger
      clickArrow(nowTab, arrows)

    })
  }

  /**
   * 枢纽-洞察 请求省内省外境外来源去向洞察数据
   * @param dom   当前所在主tab
   * @param area  区域:省内 省外 境外
   * @param date  日期:yyyy-mm-dd
   */
  function getAreaData(dom, area, date) {
    var AreaMap = [
      {
        "name": "广州",
        "code": "GZ",
      },
      {
        "name": "深圳",
        "code": "SZ",

      },
      {
        "name": "珠海",
        "code": "ZH",

      },
      {
        "name": "汕头",
        "code": "ST",

      },
      {
        "name": "韶关",
        "code": "SG",

      },
      {
        "name": "佛山",
        "code": "FS",

      },
      {
        "name": "江门",
        "code": "JM",

      },
      {
        "name": "湛江",
        "code": "ZJ",

      },
      {
        "name": "茂名",
        "code": "MM",

      },
      {
        "name": "肇庆",
        "code": "ZQ",

      },
      {
        "name": "惠州",
        "code": "HZ",

      },
      {
        "name": "梅州",
        "code": "MZ",

      },
      {
        "name": "汕尾",
        "code": "SW",

      },
      {
        "name": "河源",
        "code": "HY",

      },
      {
        "name": "阳江",
        "code": "YJ",

      },
      {
        "name": "清远",
        "code": "QY",

      },
      {
        "name": "东莞",
        "code": "DG",

      },
      {
        "name": "中山",
        "code": "ZS",

      },
      {
        "name": "潮州",
        "code": "CZ",

      },
      {
        "name": "揭阳",
        "code": "JY",

      },
      {
        "name": "云浮",
        "code": "YF",

      }
    ];
    var apiName;
    if (area === '省外') {
      apiName = 'listOutProvinceOrigin'
    }
    if (area === '省内') {
      apiName = 'listInProvinceOrigin'
    }
    if (area === '境外') {
      apiName = 'listForgeinOrigin'
    }
    dom.find('.from-chart ul.body').empty();
    dom.find('.to-chart ul.body').empty();
    var d = date ? date : returnDate(4);
    var url = 'terminal/selectTerminalOriginAndLeaveTop.do?postionType=' + positionType + '&postionName=' + curPosition + '&area=' + area + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      if (data.isSuccess && data.data[apiName].length && data.data[apiName].length) {
        // dom.find('.from-chart ul.body').empty();
        // dom.find('.to-chart ul.body').empty();
        var oriArr, toArr;
        if (area === '省外') {
          oriArr = _.sortBy(data.data.listOutProvinceOrigin, function (item) {
            return -item.travelerValue;
          });
          toArr = _.sortBy(data.data.listOutProvinceLeave, function (item) {
            return -item.travelerValue;
          });
        }
        if (area === '省内') {
          oriArr = _.sortBy(data.data.listInProvinceOrigin, function (item) {
            return -item.travelerValue;
          });
          toArr = _.sortBy(data.data.listInProvinceLeave, function (item) {
            return -item.travelerValue;
          });
          for (var i = 0; i < oriArr.length; i++) {
            var oriObj = oriArr[i];
            for (var j = 0; j < AreaMap.length; j++) {
              var areaObj = AreaMap[j];
              if (areaObj.code == oriObj.originAreaName) {
                oriObj.originAreaName = areaObj.name;
                break
              }
            }
          }
          for (var k = 0; k < toArr.length; k++) {
            var toObj = toArr[k];
            for (var g = 0; g < AreaMap.length; g++) {
              var areaObj2 = AreaMap[g];
              if (areaObj2.code == toObj.toAreaName) {
                toObj.toAreaName = areaObj2.name;
                break
              }
            }
          }
        }
        if (area === '境外') {
          oriArr = _.sortBy(data.data.listForgeinOrigin, function (item) {
            return -item.travelerValue;
          });
          toArr = _.sortBy(data.data.listForgeinLeave, function (item) {
            return -item.travelerValue;
          });
        }
        var num = 0;
        for (var i = 0; i < oriArr.length; i++) {
          var obj = oriArr[i];
          // var val = formatVal(obj.travelerValue);
          var val = toMoney(obj.travelerValue);
          // console.log('val:',val);

          num++;
          var str = '<li>\n' +
            '<i class="index">' + num + '</i>\n' +
            '<label>' + obj.originAreaName + '</label>\n' +
            '<i class="line"></i>\n' +
            '<span class="num">' + val + '人</span>\n' +
            '</li>';
          var li = $(str);
          dom.find('.from-chart ul.body').append(li)
        }

        var num2 = 0;
        for (var j = 0; j < toArr.length; j++) {
          var obj2 = toArr[j];
          num2++;
          var str2 = '<li>\n' +
            '<i class="index">' + num2 + '</i>\n' +
            '<label>' + obj2.toAreaName + '</label>\n' +
            '<i class="line"></i>\n' +
            '<span class="num">' + obj2.travelerValue + '人</span>\n' +
            '</li>';
          var li2 = $(str2);
          dom.find('.to-chart ul.body').append(li2)
        }
      }
    })
  }

  /**
   * 服务区-旅客洞察-归属top5
   * @param dom
   * @param area
   * @param date
   */
  function getAreaData2(dom, area, date) {
    var d = date ? date : returnDate(1);  // 默认昨天
    dom.find('.from-chart ul.body').empty();

    var url = 'serviceArea/selectServiceAscriptionTop.do?postionType=' + positionType + '&postionName=' + curPosition + '&area=' + area + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      var theName, theKey, theDom, theArr, num = 0;
      if (area === '省外') {
        theKey = 'listServiceProvince';
        theName = 'provinceName'
      }
      if (area === '省内') {
        theKey = 'listServiceInProvince';
        theName = 'cityName';
      }
      if (area === '境外') {
        theKey = 'listServiceForgein';
        theName = 'foreignName';
      }
      if (data.isSuccess && data.data[theKey].length) {
        // console.log('theKey:',theKey);
        for (var j = 0; j < data.data[theKey].length; j++) {
          // var obj1 = data.data[theKey][j];
          theArr = _.sortBy(data.data[theKey], function (item) {
            return -item.travelerValue;
          });
        }

        for (var i = 0; i < theArr.length; i++) {
          num++;
          var obj = theArr[i];
          var liStr = '<li>\n' +
            '<i class="index">' + num + '</i>\n' +
            '<label title="' + obj[theName] + '">' + obj[theName] + '</label>\n' +
            '<i class="line2"></i>\n' +
            '<span class="num" title="' + obj.travelerValue + '">' + obj.travelerValue + '人</span>\n' +
            '</li>';
          theDom = $(liStr);
          dom.find('.from-chart ul.body').append(theDom)
        }
      }

    })
  }

  /**
   * 初始化 枢纽-旅客洞察的top5-tab
   */
  function initDongchaTab() {
    var dongchaTab = $('#tab2 .dongcha-tab');
    for (var i = 0; i < dongchaTab.length; i++) {
      var tab = dongchaTab[i];
      $(tab).removeClass('active');
    }
    $(dongchaTab[0]).addClass('active');
  }

  /**
   * 初始化 服务区-旅客洞察的top5-tab
   */
  function initDongchaTab2() {
    var dongchaTab = $('#tab3 .dongcha-tab');
    for (var i = 0; i < dongchaTab.length; i++) {
      var tab = dongchaTab[i];
      $(tab).removeClass('active');
    }
    $(dongchaTab[0]).addClass('active');
  }

  /**
   * 枢纽-旅客洞察点击
   */
  function dongchaTabBindClick() {
    // 枢纽 洞察点击i
    var dongchaTabs = $('#tab2 .dongcha-tab');
    var area;
    var dom;
    for (var i = 0; i < dongchaTabs.length; i++) {
      var t = dongchaTabs[i];
      $(t).on('click', function () {
        for (var j = 0; j < dongchaTabs.length; j++) {
          var t = dongchaTabs[j];
          $(t).removeClass('active')
        }
        $(this).addClass('active');
        area = $(this).text().trim();
        dom = $('#tab2');
        // console.log('area:',area);
        getAreaData(dom, area, tab2Li3Date)
      })
    }

    // 服务区 洞察点击i
    var dongchaTabs2 = $('#tab3 .dongcha-tab');
    for (var k = 0; k < dongchaTabs2.length; k++) {
      var t2 = dongchaTabs2[k];
      $(t2).on('click', function () {
        for (var j = 0; j < dongchaTabs2.length; j++) {
          var t2 = dongchaTabs2[j];
          $(t2).removeClass('active')
        }
        $(this).addClass('active');
        area = this.dataset.name;
        dom = $('#tab3');
        // debugger
        getAreaData2(dom, area, tab3Li3Date)
      })
    }
  }

  /**
   * 显示当前地点(点击地图点放大后)
   */
  function showCurLocaction() {

    var tabBoxCur = $('#tab-box-cur');
    var curPosDataBox = $('#cur-pos-data-box');
    // tabBoxCur.removeClass('dn');
    // tabBoxCur.addClass('moveAndShow');
    // tabBoxCur.removeClass('moveAndHide');
    tabBoxCur.css('opacity', 1);
    tabBoxCur.find('.arrow.up').addClass('dn');
    tabBoxCur.find('.arrow.down').removeClass('dn');

    // curPosDataBox.show(300);
    // isHideStation = false;
  }

  /**
   * 隐藏当前地点(点击地图点放大后)
   */
  function hideCurLocaction() {
    var tabBoxCur = $('#tab-box-cur');
    var curPosDataBox = $('#cur-pos-data-box');
    // tabBoxCur.removeClass('moveAndShow');
    // tabBoxCur.addClass('moveAndHide');
    // tabBoxCur.addClass('dn');
    // tabBoxCur.find('.arrow.up').removeClass('dn');
    // tabBoxCur.find('.arrow.down').addClass('dn');
    // tabBoxCur.hide();
    curPosDataBox.hide();
    tabBoxCur.css('opacity', 0);
    isHideStation = true;
  }

  // 地图点绑定点击事件
  function markerBindClick() {
    for (var k = 0; k < pointControl.markes.length; k++) {
      var m = pointControl.markes[k];
      // console.log(m.C.position) 点的经纬度
      // console.log(m.C.extData['枢纽名称'])
      // debugger
      m.on('click', function () {
        $('#tab-box-cur').removeClass('dn');

        // console.log(this.C.extData['枢纽名称']);
        var theName = this.C.extData['枢纽名称'];
        // debugger
        goToPointByName(theName);
        hideTabs(theName);

      })
    }
  }

  // 交通枢纽图表
  // 枢纽 实时客流
  var tab2Li2Echart1;

  function tab2Li2InitEchart() {
    var SSKL = $('#SSKL');
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
        text: '实时客流趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',

          // fontWeight:400
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
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时点',
        data: date,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 3
        }
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '实时客流',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'a',
          label: {
            normal: {
              show: false
            }
          },
          // 填充区域样式
          areaStyle: {
            normal: {
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: bdColor,
          },
          data: [],
        },
      ]
    };

    tab2Li2Echart1reqData(returnDate());

    if (option && typeof option === "object") {
      tab2Li2Echart1.setOption(option, true);
    }
  }

  function tab2Li2Echart1reqData(date) {
    $('#SSKL-cld-box').hide();
    tab2Li2Echart1.showLoading();    //加载动画
    var url = 'terminal/selectTerminalFlowTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + date;
    var url2 = 'terminal/selectTerminalFlowPredict.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + date;
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
        $('#SSKL-cld-box').show();
        tab2Li2Echart1.hideLoading();    //隐藏加载动画
        tab2Li2Echart1.setOption({
          series: [
            {
              name: '实时客流',
              data: d
            }
          ]
        })
      }
    });

    // $.axpost(url2, {}, function (data) {
    //   console.log('tab2Li2InitEchart', data);
    //   var d = [];
    //   // d = data.data;
    //   for (var i = 0; i < data.data.length; i++) {
    //     var obj = data.data[i];
    //     var tempArr = obj.countTime.split('-');
    //     var hour = strDelZero(tempArr[tempArr.length - 1]);
    //     var objArr = [hour, obj.preUserCnt];
    //     d.push(objArr);
    //   }
    //   console.log(d);
    //
    //   // debugger
    //   // $('#SSKL-cld-box').show();
    //   tab2Li2Echart1.hideLoading();    //隐藏加载动画
    //   tab2Li2Echart1.setOption({
    //     series: [
    //       {
    //         name: '客流预测',
    //         data: d
    //       }
    //     ]
    //   })
    // })
  }

  var tab2Li2Echart2;

  /**
   * 检查类型
   * @returns {boolean}
   */
  function checkPosType() {
    var posType = pointControl.getPointType(curPosition);
    return posType === '客运站' || posType === '服务区'
  }

  function tab2Li2InitEchart2() {
    var dom = $('#ZLSC1');
    if (!tab2Li2Echart2) {
      tab2Li2Echart2 = echarts.init(dom[0]);
    }
    option = null;
    var date = hourArr;
    var isKYorFW = checkPosType();
    date = isKYorFW ? hourArr2 : hourArr;

    option = {
      title: {
        text: '实时驻留时长分析',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // legend: {
      //   data: ['小时', '人数']
      // },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        name: '占比',
        // 分割线
        splitLine: {
          show: false
        },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        }
      },
      xAxis: {
        type: 'category',
        data: date,
        name: '小时',
        nameGap: '5',
        // padding: [10, 10, 0, 0],
        // axisLabel: {
        //   interval: 0,
        //   rotate: 45,
        //   //倾斜度 -90 至 90 默认为0
        //   margin: 10,
        //   textStyle: {
        //     // fontWeight: "bolder",
        //     // color: "#000000"
        //   }
        // },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      series: [
        {
          name: '占比',
          type: 'bar',
          stack: '总量',
          barWidth: '50%',
          // 柱子颜色
          itemStyle: {
            color: bdColor
          },
          label: {
            show: true,
            position: 'top',
            align: 'middle',
            // verticalAlign: 'middle'
            formatter: '{c}%'
          },
          data: []
        },
      ]
    };

    tab2Li2Echart2reqData(returnDate());

    if (option && typeof option === "object") {
      tab2Li2Echart2.setOption(option, true);
    }
  }

  function tab2Li2Echart2reqData(date) {
    tab2Li2Echart2.showLoading();    //加载动画
    var flag = '';
    var isKYorFW = checkPosType();
    flag = isKYorFW ? '' : true;

    var url = 'terminal/selectTerminalFlowLinger.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + date + '&flag=' + flag;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab2Li2Echart2',data);
        var d = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            // d.push(obj.timeZb);
            d[parseInt(obj.timeGroup)] = obj.timeZb;
          }
        }
        // debugger
        // console.log(d);

        tab2Li2Echart2.hideLoading();    //隐藏加载动画

        tab2Li2Echart2.setOption({
          series: [
            {
              name: '占比',
              data: d
            }
          ]
        })
      }
    })

  }

  // 枢纽 旅客趋势
  var tab2Li4Echart;

  function tab2Li4InitEchart() {
    var dom = $('#KLQS');
    if (!tab2Li4Echart) {
      tab2Li4Echart = echarts.init(dom[0]);
    }
    option = null;

    option = {
      title: {
        text: '每日总客流趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '日期',
        data: [],
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: true
        },
        axisLabel: {
          interval: 0,
          rotate: 45,
          //倾斜度 -90 至 90 默认为0
          margin: 10,
          textStyle: {
            // fontWeight: "bolder",
            // color: "#000000"
          }
        },
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '客流量',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'a',
          label: {
            normal: {
              show: false
            }
          },
          // 填充区域样式
          areaStyle: {
            normal: {
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#ad9955' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: 'rgb(255,215,93)'
          },
          data: [],

        },

      ]
    };

    tab2Li4EchartReqData();

    if (option && typeof option === "object") {
      tab2Li4Echart.setOption(option, true);
    }
  }

  function tab2Li4EchartReqData(date) {
    var d;
    if (date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);

    }
    tab2Li4Echart.showLoading();    //加载动画
    var url = 'terminal/selectTerminalPassengerTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&startDate=' + d.start + '&endDate=' + d.end;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.listTerminalPassengerTrend.length) {
      if (data.isSuccess) {
        // console.log('tab2Li4Echart',data);
        var dayArr = [];
        var dataArr = [];
        if (data.data.listTerminalPassengerTrend.length) {
          for (var i = 0; i < data.data.listTerminalPassengerTrend.length; i++) {
            var obj = data.data.listTerminalPassengerTrend[i];
            dayArr.push(obj.statDate);
            dataArr.push(obj.travelers);
          }
        }

        // debugger
        tab2Li4Echart.hideLoading();    //隐藏加载动画
        tab2Li4Echart.setOption({
          xAxis: {
            data: dayArr
          },
          series: [
            {
              name: '客流量',
              data: dataArr
            }
          ]
        })
      }
    })
  }

  var tab2Li4Echart2;

  function tab2Li4InitEchart2() {
    var dom = $('#LKQS');
    if (!tab2Li4Echart2) {
      tab2Li4Echart2 = echarts.init(dom[0]);
    }
    option = null;

    option = {
      title: {
        text: '旅客趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: [],
        textStyle: {
          color: 'rgb(221,243,255)'
        }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        name: '人数',
        // 分割线
        splitLine: {
          show: false
        },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      xAxis: {
        type: 'category',
        data: [],
        name: '日期',
        axisLabel: {
          interval: 0,
          rotate: 45,
          //倾斜度 -90 至 90 默认为0
          margin: 10,
          textStyle: {
            // fontWeight: "bolder",
            // color: "#000000"
          }
        },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      series: [
        {
          name: '出发旅客量',
          type: 'bar',
          stack: '总量',
          barWidth: '50%',
          itemStyle: {
            color: 'rgb(97,80,218)'
          },
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          data: []
        },
        {
          name: '到达旅客量',
          type: 'bar',
          stack: '总量',
          barWidth: '50%',
          itemStyle: {
            color: 'rgb(254,157,79)'
          },
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          data: []
        },

      ]
    };

    tab2Li4Echart2ReqData();

    if (option && typeof option === "object") {
      tab2Li4Echart2.setOption(option, true);
    }
  }

  function tab2Li4Echart2ReqData(date) {
    var d;
    if (date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab2Li4Echart2.showLoading();    //加载动画
    var url = 'terminal/selectTerminalPassengerTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&startDate=' + d.start + '&endDate=' + d.end;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.listTerminalPassengerTrend.length) {
      if (data.isSuccess) {
        // console.log('tab2Li4Echart2',data);
        var dayArr = [];
        var ariArr = [];
        var leaArr = [];
        if (data.data.listTerminalPassengerTrend.length) {
          for (var i = 0; i < data.data.listTerminalPassengerTrend.length; i++) {
            var obj = data.data.listTerminalPassengerTrend[i];
            dayArr.push(obj.statDate);
            ariArr.push(obj.arrivalValue);
            leaArr.push(obj.leaveValue);
          }
        }
        // debugger

        tab2Li4Echart2.hideLoading();    //隐藏加载动画

        tab2Li4Echart2.setOption({
          legend: {
            data: ['出发旅客量', '到达旅客量']
          },
          xAxis: {
            data: dayArr
          },
          series: [
            {
              name: '出发旅客量',
              data: leaArr
            },
            {
              name: '到达旅客量',
              data: ariArr
            }
          ]
        })
      }

    })
  }

  // 枢纽 旅客洞察
  var tab2Li3Echart1;

  function tab2Li3InitEchart1() {
    var dom = $('#ZLSC');
    if (!tab2Li3Echart1) {
      tab2Li3Echart1 = echarts.init(dom[0]);
    }
    option = null;
    var date = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-24'];

    option = {

      title: {
        text: '驻留时长分析',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // legend: {
      //   data: ['小时', '人数']
      // },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        name: '人数',
        // 分割线
        splitLine: {
          show: false
        },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      xAxis: {
        type: 'category',
        data: date,
        name: '小时',
        nameGap: '5',
        // padding: [10, 10, 0, 0],
        // axisLabel: {
        //   interval: 0,
        //   rotate: 45,
        //   //倾斜度 -90 至 90 默认为0
        //   margin: 10,
        //   textStyle: {
        //     // fontWeight: "bolder",
        //     // color: "#000000"
        //   }
        // },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      series: [
        {
          name: '人数',
          type: 'bar',
          stack: '总量',
          barWidth: '50%',
          // 柱子颜色
          itemStyle: {
            color: bdColor
          },
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          data: []
        },


      ]
    };

    tab2Li3Echart1reqData(tab2Li2DefaultDate);

    if (option && typeof option === "object") {
      tab2Li3Echart1.setOption(option, true);
    }
  }

  function tab2Li3Echart1reqData(date) {
    tab2Li3Echart1.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(4);
    var url = 'terminal/selectTerminalLinger.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab2Li3Echart1',data);
        var dataArr = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            // debugger
            dataArr[parseInt(obj.timeGroup)] = obj.timeValue;
          }
        }

        tab2Li3Echart1.hideLoading();    //隐藏加载动画
        tab2Li3Echart1.setOption({
          series: [
            {
              name: '人数',
              data: dataArr
            }
          ]
        })
      }
    })
  }

  var tab2Li3Echart2;

  function tab2Li3InitEchart2() {
    var dom = document.getElementById("KLHX");
    if (!tab2Li3Echart2) {
      tab2Li3Echart2 = echarts.init(dom);
    }
    // console.log(echarts.version)
    var app = {};
    option = null;
    app.title = '环形图';

    option = {
      title: {
        text: '客流画像',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      // tooltip: {
      //   trigger: 'item',
      //   formatter: "{a} <br/>{b}: {c} ({d}%)"
      // },
      // legend: {
      //   orient: 'vertical',
      //   x: 'left',
      //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      // },
      series: [
        {
          name: '客流画像',
          type: 'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: true,
          animation: false,
          itemStyle: {
            color: 'rgb(104,228,255)',
            borderColor: cldColor,
            // borderColor:'rgba(10, 33, 75, 0.9)',
            borderWidth: 15
          },
          label: {
            // normal: {
            //   show: true,
            //   position: 'center'
            // },
            silent: true,
            normal: {
              // \n\n可让文字居于牵引线上方，很关键
              //  {b}  代表显示的内容标题
              // {c}代表数据
              formatter: '{b}\n{c}% ',
              fontSize: 20,

              // textAlign: 'left',//'left'、 'center'、 'right'，
              // textVerticalAlign: 'bottom',//文字垂直对齐方式，可取值：'top'、 'middle'、 'bottom'，默认根据 textPosition 计算。
              //rich: {
              //    b: {
              //        font: '16px Microsoft YaHei',
              //        textFill: 'rgb(104,228,225)'
              //    },
              //    c: {
              //        font: '24px Microsoft YaHei',
              //        textFill: 'white'
              //    }
              //},
              borderWidth: 10,
              borderRadius: 4,
              padding: [0, -10],
              rich: {
                // b: {
                //   color: 'green',
                //   fontSize: 12,
                //   lineHeight: 20
                // },
                c: {
                  fontSize: 26,
                  lineHeight: 20,
                  color: 'white'
                }
              }
            },

            emphasis: {
              show: true,
              textStyle: {
                fontSize: '25',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value: 335, name: '直接访问'},
            // {value: 310, name: '邮件营销'},
            // {value: 234, name: '联盟广告'},
            // {value: 135, name: '视频广告'},
            // {value: 1548, name: '搜索引擎'}
          ]
        }
      ]
    };

    tab2Li3Echart2ReqData(tab2Li2DefaultDate);

    if (option && typeof option === "object") {
      tab2Li3Echart2.setOption(option, true);
    }
  }

  function tab2Li3Echart2ReqData(date) {
    tab2Li3Echart2.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(4);
    var url = 'terminal/selectTerminalSexAge.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // console.log('tab2Li3Echart2',data);
      // if(data.isSuccess&&data.data.terminalAgeList.length&&data.data.terminalSexList.length) {
      if (data.isSuccess) {
        var dataArr = [];
        if (data.data.terminalAgeList.length) {
          for (var i = 0; i < data.data.terminalAgeList.length; i++) {
            var obj = data.data.terminalAgeList[i];
            // debugger
            if (obj.ageGroup == 0) {
              continue
            }
            dataArr.push({
              name: ageObj[obj.ageGroup],
              value: formatDecimal(obj.ageZb)
            })
          }

        }
        // console.log('111dataArr:',dataArr);

        tab2Li3Echart2.hideLoading();    //隐藏加载动画
        tab2Li3Echart2.setOption({
          series: [
            {
              name: '客流画像',
              data: dataArr
            }
          ]
        });
        // if(data.data.terminalSexList.length) {
        var dom = $("#KLHX").parent();
        addSexNum(dom, 'terminalSexList', data.data)
        // }

      } else {
        // debugger


      }


    })
  }

  var tab2Li3Echart3;

  function tab2Li3InitEchart3() {
    var dom = document.getElementById("laiyuan");
    if (!tab2Li3Echart3) {
      tab2Li3Echart3 = echarts.init(dom);
    }
    var app = {};
    option = null;
    app.title = '环形图';

    option = {
      title: {
        text: '来源洞察',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        // x: 'top',
        top: '90%',
        data: [],
        textStyle: {
          color: '#fff'
        }
      },
      series: [
        {
          name: '来源洞察',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: true,
          animation: false,
          label: {
            normal: {
              show: true,
              // position: 'center',
              formatter: '{c}%',
              padding: [0, -30],
              fontSize: '20'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value: 335, name: '境外',itemStyle: {color:colors[0]}},
            // {value: 310, name: '省内',itemStyle: {color:colors[1]}},
            // {value: 234, name: '省外',itemStyle: {color:colors[2]}}
          ]
        }
      ]
    };

    tab2Li3Echart3ReqData(tab2Li2DefaultDate);

    if (option && typeof option === "object") {
      tab2Li3Echart3.setOption(option, true);
    }

  }

  /**
   * 判断是否是机场
   * @returns {boolean}
   */
  function isAirport() {
    var theName = curPosition, theMarkers = pointControl.markes;
    for (var i = 0; i < theMarkers.length; i++) {
      var m = theMarkers[i];
      if (theName === m.C.extData['枢纽名称']) {
        // console.log(theName)
        var mType = m.C.extData['枢纽类别'];
        if (mType === '机场') {
          return true
        }
      }
    }
    return false
  }

  function tab2Li3Echart3ReqData(date) {
    var colors = ['rgb(252,162,34)', 'rgb(152,113,253)', 'rgb(38,229,225)'];
    tab2Li3Echart3.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(4);
    var url = 'terminal/selectTerminalOriginAndLeave.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&!isEmptyObject(data.data.originMap)) {
      if (data.isSuccess) {
        // console.log('tab2Li3Echart3', data);
        var tempArr = [];
        var dataArr = [];
        var legendArr = ['省内', '省外'];
        var name, snNum;
        var isAir = isAirport();

        if (!isEmptyObject(data.data.originMap)) {
          for (var key in data.data.originMap) {
            tempArr.push({
              type: key,
              value: data.data.originMap[key]
            })
          }
          for (var i = 0; i < tempArr.length; i++) {
            // debugger
            var obj = tempArr[i];
            if (obj.type === 'inProvinceOrigin') {
              name = '省内';
              snNum = formatDecimal(obj.value.travelerZb);
            }
            if (obj.type === 'outProvinceOrigin') {
              name = '省外'
            }
            if (obj.type === 'forgeinOrigin') {
              name = '境外'
            }
            var theData = {
              name: name,
              value: formatDecimal(obj.value.travelerZb),
              itemStyle: {
                color: colors[i]
              }
            };
            if (name === '境外' && !isAir) {
              continue
            }
            dataArr.push(theData);
          }
          if (!isAir) {
            correctDongChaNum(dataArr, snNum);
          }
          if (isAir) {
            legendArr = ['省内', '省外', '境外']
          }

          // console.log('tempArr:', dataArr,tempArr);

        }

        tab2Li3Echart3.hideLoading();    //隐藏加载动画
        tab2Li3Echart3.setOption(
          {
            series: [
              {
                name: '来源洞察',
                data: dataArr
              }
            ],
            legend: {
              data: legendArr
              // data: ['省内', '省外']
            }
          }
        )
      }
    })
  }

  function correctDongChaNum(arr, snNum) {
    if (arr.length > 2) {
      return
    }
    var swNum;
    swNum = (100 - snNum).toFixed(1);
    // debugger
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.name === '省外') {
        item.value = swNum;
      }
    }

  }

  var tab2Li3Echart4;

  function tab2Li3InitEchart4() {
    var dom = document.getElementById("quxiang");
    if (!tab2Li3Echart4) {
      tab2Li3Echart4 = echarts.init(dom);
    }
    var app = {};
    option = null;
    app.title = '环形图';
    // var colors = ['rgb(252,162,34)','rgb(152,113,253)','rgb(38,229,225)'];

    option = {
      title: {
        text: '去向洞察',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        // x: 'top',
        top: '90%',
        data: [],
        textStyle: {
          color: '#fff'
        }
      },
      series: [
        {
          name: '去向洞察',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: true,
          animation: false,
          label: {
            normal: {
              show: true,
              // position: 'center',
              formatter: '{c}%',
              padding: [0, -30],
              fontSize: '20'

            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value: 335, name: '境外',itemStyle: {color:colors[0]}},
            // {value: 310, name: '省内',itemStyle: {color:colors[1]}},
            // {value: 234, name: '省外',itemStyle: {color:colors[2]}}

          ]
        }
      ]
    };

    tab2Li3Echart4ReqData(tab2Li2DefaultDate);

    if (option && typeof option === "object") {
      tab2Li3Echart4.setOption(option, true);
    }

  }

  function tab2Li3Echart4ReqData(date) {
    var colors = ['rgb(252,162,34)', 'rgb(152,113,253)', 'rgb(38,229,225)'];
    tab2Li3Echart4.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(4);
    var url = 'terminal/selectTerminalOriginAndLeave.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      if (data.isSuccess) {
        // console.log('tab2Li3Echart4', data);
        var tempArr = [];
        var dataArr = [];
        var legendArr = ['省内', '省外'];
        var name, snNum;
        var isAir = isAirport();

        if (!isEmptyObject(data.data.leaveMap)) {
          for (var key in data.data.leaveMap) {
            tempArr.push({
              type: key,
              value: data.data.leaveMap[key]
            })
          }
          for (var i = 0; i < tempArr.length; i++) {
            var obj = tempArr[i];
            if (obj.type === 'inProvinceLeave') {
              name = '省内';
              snNum = formatDecimal(obj.value.travelerZb)
            }
            if (obj.type === 'outProvinceLeave') {
              name = '省外'
            }
            if (obj.type === 'forgeinLeave') {
              name = '境外'
            }
            if (name === '境外' && !isAir) {
              continue
            }

            dataArr.push({
              name: name,
              value: formatDecimal(obj.value.travelerZb),
              itemStyle: {
                color: colors[i]
              }
            });
          }
          if (isAir) {
            legendArr = ['省内', '省外', '境外']
          }
          if (!isAir) {
            correctDongChaNum(dataArr, snNum);
          }
          // console.log('tempArr:', dataArr,tempArr);
        }

        tab2Li3Echart4.hideLoading();    //隐藏加载动画
        tab2Li3Echart4.setOption({
          legend: {
            data: legendArr
            // data: ['境外', '省内', '省外']
          },
          series: [
            {
              name: '去向洞察',
              data: dataArr
            }
          ]
        })
      }
    })
  }

  // 服务区图表
  var tab3Li2Echart2;

  function tab3Li2InitEchart2() {
    var dom = document.getElementById("tab3li2-chart1");
    if (!tab3Li2Echart2) {
      tab3Li2Echart2 = echarts.init(dom);
    }
    var date = hourArr;
    var isKYorFW = checkPosType();
    date = isKYorFW ? hourArr2 : hourArr;

    var option = null;
    option = {
      title: {
        text: '实时驻留时长分析',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: date,
        name: '小时',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '占比',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '占比',
          data: [],
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            align: 'middle',
            // verticalAlign: 'middle'
            formatter: '{c}%'
          },
          // 柱子颜色
          itemStyle: {
            color: bdColor
          },
          barWidth: '50%',


        }]
    };

    tab3Li2Echart2reqData();

    if (option && typeof option === "object") {
      tab3Li2Echart2.setOption(option, true);
    }
  }

  function tab3Li2Echart2reqData(date) {
    var d = date ? date : returnDate();
    tab3Li2Echart2.showLoading();    //加载动画
    var url = 'serviceArea/selectServiceLingerRealtime.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab3Li2Echart2',data);
        var d = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            // d.push(obj.timeZb);
            d[parseInt(obj.timeGroup)] = obj.timeZb;
          }
        }
        // debugger

        tab3Li2Echart2.hideLoading();    //隐藏加载动画

        tab3Li2Echart2.setOption({
          series: [
            {
              name: '占比',
              data: d
            }
          ]
        })
      }

    })

  }

  var tab3Li2Echart1;

  function tab3Li2InitEchart1() {
    if (!tab3Li2Echart1) {
      tab3Li2Echart1 = echarts.init(document.getElementById('tab3li2-chart2'));
    }
    var date = [];
    for (var i = 0; i < 25; i++) {
      date.push(i)
    }
    var option = {
      title: {
        text: '实时客流趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {  // 提示框样式
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        formatter: function (params) {
          // console.log(params)
          return params[params.length - 1].data[1] + '人';
        },
        // formatter: "{c}人",
        backgroundColor: '#065f89',
        padding: 10,
        borderColor: '#28eefb',
        borderWidth: 1,
        axisPointer: {  // 指示线
          lineStyle: {
            color: '#68e5ff'
          }
        }
      },

      legend: {
        show: false,
        textStyle: {
          color: '#557398',
        },
        data: []
      },
      grid: {
        left: '5%',
        right: '10%',
        top: '25%',
        bottom: '5%',
        // width: 1194,
        // height: 236,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '(时点)',
        axisLine: {
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 3
        },
        data: date
      },
      yAxis: {
        type: 'value',
        name: '人',
        splitLine: {show: false},
        axisLine: {
          lineStyle: {
            color: whiteColor
          }
        },

      },
      series: [
        {
          name: '实时客流量',
          type: 'line',
          z: 2,
          symbol: 'none',
          //stack: '总量',
          smooth: true,
          data: [],
          lineStyle: {
            normal: {
              color: bdColor//rgba(55,255,75
            }
          },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(70,158,228,0.3)'
                }, {
                  offset: 0.5, color: 'rgba(70,158,228,0.15)'
                }, {
                  offset: 1, color: 'rgba(70,158,228,0)'
                }]
              }
            }
          },
        },
        {
          name: '预测客流量',
          symbol: 'none',
          z: 3,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 1,
                color: bdColor,
                type: 'dotted'  //'dotted'虚线 'solid'实线
              }
            }
          },
          smooth: true,
          //stack: '总量',
          data: []
        },


      ]
    };
    tab3Li2Echart1reqData();

    tab3Li2Echart1.setOption(option);
  }

  function tab3Li2Echart1reqData(date) {
    var d = date ? date : returnDate();
    $('#tab3-cld1-box').hide();
    tab3Li2Echart1.showLoading();    //加载动画
    var url = 'serviceArea/selectServiceFlowTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    var url2 = 'serviceArea/selectServiceFlowPredict.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;

    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab2Li2InitEchart',data);
        var dataArr = [];
        // d = data.data;
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            var tempArr = obj.countTime.split('-');
            var hour = strDelZero(tempArr[tempArr.length - 1]);
            var objArr = [hour, obj.userCnt];
            dataArr.push(objArr);
          }
        }

        // debugger
        $('#tab3-cld1-box').show();
        tab3Li2Echart1.hideLoading();    //隐藏加载动画
        tab3Li2Echart1.setOption({
          series: [
            {
              name: '实时客流量',
              data: dataArr
            }
          ]
        })
      } else {
        tab3Li2Echart1.hideLoading();    //隐藏加载动画
        $('#tab3-cld1-box').show();
      }
    });

  }

  var tab3Li3Echart2;

  function tab3Li3InitKLHX2() {
    var dom = document.getElementById("KLHX2");
    if (!tab3Li3Echart2) {
      tab3Li3Echart2 = echarts.init(dom);
    }
    // console.log(echarts.version)
    var app = {};
    option = null;
    app.title = '环形图';

    option = {
      title: {
        text: '客流画像',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      // tooltip: {
      //   trigger: 'item',
      //   formatter: "{a} <br/>{b}: {c} ({d}%)"
      // },
      // legend: {
      //   orient: 'vertical',
      //   x: 'left',
      //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      // },
      series: [
        {
          name: '客流画像',
          type: 'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: true,
          animation: false,
          itemStyle: {
            color: 'rgb(104,228,255)',
            borderColor: cldColor,
            borderWidth: 15
          },
          label: {
            // normal: {
            //   show: true,
            //   position: 'center'
            // },
            silent: true,
            normal: {
              // \n\n可让文字居于牵引线上方，很关键
              //  {b}  代表显示的内容标题
              // {c}代表数据
              formatter: '{b}\n{c}% ',
              fontSize: 20,

              // textAlign: 'left',//'left'、 'center'、 'right'，
              // textVerticalAlign: 'bottom',//文字垂直对齐方式，可取值：'top'、 'middle'、 'bottom'，默认根据 textPosition 计算。
              //rich: {
              //    b: {
              //        font: '16px Microsoft YaHei',
              //        textFill: 'rgb(104,228,225)'
              //    },
              //    c: {
              //        font: '24px Microsoft YaHei',
              //        textFill: 'white'
              //    }
              //},
              borderWidth: 10,
              borderRadius: 4,
              padding: [0, -10],
              rich: {
                // b: {
                //   color: 'green',
                //   fontSize: 12,
                //   lineHeight: 20
                // },
                c: {
                  fontSize: 26,
                  lineHeight: 20,
                  color: 'white'
                }
              }
            },

            emphasis: {
              show: true,
              textStyle: {
                fontSize: '25',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value: 335, name: '直接访问'},
            // {value: 310, name: '邮件营销'},
            // {value: 234, name: '联盟广告'},
            // {value: 135, name: '视频广告'},
            // {value: 1548, name: '搜索引擎'}
          ]
        }
      ]
    };

    tab3Li3Echart2ReqData(tab3Li2DefaultDate);
    if (option && typeof option === "object") {
      tab3Li3Echart2.setOption(option, true);
    }
  }

  function tab3Li3Echart2ReqData(date) {
    tab3Li3Echart2.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(1);
    var url = 'serviceArea/selectServiceSexAge.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // console.log('tab3Li3Echart2',data);
      // if(data.isSuccess&&data.data.serviceAgeList.length&&data.data.serviceSexList.length) {
      if (data.isSuccess) {
        var dataArr = [];
        if (data.data.serviceAgeList.length) {
          for (var i = 0; i < data.data.serviceAgeList.length; i++) {
            var obj = data.data.serviceAgeList[i];
            // debugger
            if (obj.ageGroup == 0) {
              continue
            }
            dataArr.push({
              name: ageObj[obj.ageGroup],
              value: formatDecimal(obj.ageZb)
            })
          }
          console.log('dataArr:', dataArr);
        }

        // debugger
        tab3Li3Echart2.hideLoading();    //隐藏加载动画
        tab3Li3Echart2.setOption({
          series: [
            {
              name: '客流画像',
              data: dataArr
            }
          ]
        });
        // if(data.data.serviceSexList.length) {
        var dom = $("#KLHX2").parent();
        addSexNum(dom, 'serviceSexList', data.data)

      } else {

      }

    })
  }

  var tab3Li3Echart1;

  function tab3Li3InitEchart() {
    var dom = document.getElementById("tab3li3-chart1");
    var hourArr = ['0-1', '1-2', '2-3', '3-4'];
    if (!tab3Li3Echart1) {
      tab3Li3Echart1 = echarts.init(dom);
    }
    option = null;
    option = {
      title: {
        text: '驻留时长分析',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: hourArr,
        name: '小时',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '人',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [{
        data: [],
        name: '驻留时长',
        type: 'bar',
        // 数据显示位置
        label: {
          show: true,
          position: 'top',
          align: 'middle',
          // verticalAlign: 'middle'

        },
        // 柱子颜色
        itemStyle: {
          color: bdColor
        },
        barWidth: '50%',
      }]
    };
    tab3Li3Echart1reqData(tab3Li2DefaultDate);
    if (option && typeof option === "object") {
      tab3Li3Echart1.setOption(option, true);
    }
  }

  function tab3Li3Echart1reqData(date) {
    tab3Li3Echart1.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(1);
    var url = 'serviceArea/selectServiceLinger.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab3Li3Echart1',data);
        var dataArr = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            var timeGroup = parseInt(obj.timeGroup);
            // debugger
            console.log(obj);
            if (timeGroup <= 3) {
              dataArr[parseInt(timeGroup)] = obj.timeValue;
            } else {
              break
            }
          }
        }

        tab3Li3Echart1.hideLoading();    //隐藏加载动画
        tab3Li3Echart1.setOption({
          series: [
            {
              name: '人数',
              data: dataArr
            }
          ]
        })
      }

    })
  }

  var tab3Li4Echart1;

  function tab3Li4InitEchart() {
    var dom = $('#tab3li4-chart1');
    if (!tab3Li4Echart1) {
      tab3Li4Echart1 = echarts.init(dom[0]);
    }
    option = null;

    option = {
      title: {
        text: '每日总客流趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '日期',
        data: [],
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        },
        axisLabel: {
          interval: 0,
          rotate: 45,
          //倾斜度 -90 至 90 默认为0
          margin: 10,
          textStyle: {
            // fontWeight: "bolder",
            // color: "#000000"
          }
        },
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '客流量',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'a',
          label: {
            normal: {
              show: false
            }
          },
          // 填充区域样式
          areaStyle: {
            normal: {
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#ad9955' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: 'rgb(255,215,93)'
          },
          data: []
        }
      ]
    };
    tab3Li4EchartReqData();
    if (option && typeof option === "object") {
      tab3Li4Echart1.setOption(option, true);
    }
  }

  function tab3Li4EchartReqData(date) {
    var d;
    if (date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab3Li4Echart1.showLoading();    //加载动画
    var url = 'serviceArea/selectServicePassengerTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&startDate=' + d.start + '&endDate=' + d.end;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.listServiceFlowTrend.length) {
      if (data.isSuccess) {
        // console.log('tab3Li4Echart1',data);
        var dayArr = [];
        var dataArr = [];
        if (data.data.listServiceFlowTrend.length) {
          for (var i = 0; i < data.data.listServiceFlowTrend.length; i++) {
            var obj = data.data.listServiceFlowTrend[i];
            dayArr.push(obj.statDate);
            dataArr.push(obj.userCnt);
          }
        }
        // debugger

        tab3Li4Echart1.hideLoading();    //隐藏加载动画

        tab3Li4Echart1.setOption({
          xAxis: {
            data: dayArr
          },
          series: [
            {
              name: '客流量',
              data: dataArr
            }
          ]
        })
      }

    })
  }

  var guishufenxi;

  function guishufenxiChart() {
    var dom = document.getElementById("guishufenxi");
    if (!guishufenxi) {
      guishufenxi = echarts.init(dom);
    }
    var app = {};
    option = null;
    app.title = '环形图';
    // var colors = ['rgb(252,162,34)','rgb(152,113,253)','rgb(38,229,225)'];

    option = {
      title: {
        text: '归属分析--类别占比',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        show: true,
        // orient: 'horizontal',
        // x: 'left',
        top: '90%',
        data: [],
        textStyle: {
          color: '#fff'
        }
      },
      series: [
        {
          name: '归属分析',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: true,
          animation: false,
          label: {
            normal: {
              show: true,
              // position: 'center',
              formatter: '{c}%',
              padding: [0, -30],
              fontSize: '20'

            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value: 335, name: '境外',itemStyle: {color:colors[0]}},
            // {value: 310, name: '省内',itemStyle: {color:colors[1]}},
            // {value: 234, name: '省外',itemStyle: {color:colors[2]}}
          ]
        }
      ]
    };
    guishufenxiReqData(tab3Li2DefaultDate);
    if (option && typeof option === "object") {
      guishufenxi.setOption(option, true);
    }
  }

  function guishufenxiReqData(date) {
    var colors = ['rgb(252,162,34)', 'rgb(152,113,253)', 'rgb(38,229,225)'];
    guishufenxi.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(1);  // 默认访问昨天
    var url = 'serviceArea/selectServiceAscription.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        var dataArr = [];
        var myObj = {
          1: '省内',
          2: '省外',
          3: '境外'
        }
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            // debugger
            dataArr.push({
              name: myObj[obj.categoryName],
              value: formatDecimal(obj.travelerZb),
              itemStyle: {
                color: colors[i]
              }
            })
          }
        }
        // console.log('tempArr:', dataArr,tempArr);

        guishufenxi.hideLoading();    //隐藏加载动画
        guishufenxi.setOption({
          series: [
            {
              name: '归属分析',
              data: dataArr
            }
          ],
          legend: {
            data: ['境外', '省内', '省外']
          }
        })
      }

    })
  }

  // 收费站图表
  var tab4Li2Echart1;

  function tab4Li2initEchart() {
    var dom = $('#tab4-zlsc');
    if (!tab4Li2Echart1) {
      tab4Li2Echart1 = echarts.init(dom[0]);
    }
    var date = hourArr;
    var isKYorFW = checkPosType();
    date = isKYorFW ? hourArr2 : hourArr;


    var option = {
      title: {
        text: '实时驻留时长分析',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // legend: {
      //   data: ['小时', '人数']
      // },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        name: '人数',
        // 分割线
        splitLine: {
          show: false
        },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      xAxis: {
        type: 'category',
        data: date,
        name: '小时',
        nameGap: '5',
        // padding: [10, 10, 0, 0],
        // axisLabel: {
        //   interval: 0,
        //   rotate: 45,
        //   //倾斜度 -90 至 90 默认为0
        //   margin: 10,
        //   textStyle: {
        //     // fontWeight: "bolder",
        //     // color: "#000000"
        //   }
        // },
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      series: [
        {
          name: '驻留时长',
          type: 'bar',
          stack: '总量',
          barWidth: '50%',
          // 柱子颜色
          itemStyle: {
            color: bdColor
          },
          label: {
            show: true,
            position: 'top',
            align: 'middle',
            // verticalAlign: 'middle'
            formatter: '{c}%'
          },
          data: []
        },
      ]
    };

    tab4Li2Echart1reqData();

    if (option && typeof option === "object") {
      tab4Li2Echart1.setOption(option, true);
    }
  }

  function tab4Li2Echart1reqData(date) {
    var d = date ? date : returnDate();
    tab4Li2Echart1.showLoading();    //加载动画
    var url = 'toll/selectTollLingerRealtime.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab4Li2Echart1',data);
        var dataArr = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            // d.push(obj.timeZb);
            dataArr[parseInt(obj.timeGroup)] = obj.timeZb;
          }
        }
        // debugger
        tab4Li2Echart1.hideLoading();    //隐藏加载动画

        tab4Li2Echart1.setOption({
          series: [
            {
              name: '驻留时长',
              data: dataArr
            }
          ]
        })
      }

    })
  }

  var tab4Li2Echart2;

  function tab4Li2initEchart2() {
    var dom = $('#tab4-klqs');
    if (!tab4Li2Echart2) {
      tab4Li2Echart2 = echarts.init(dom[0]);
    }

    option = null;
    var date = [];
    for (var i = 0; i < 25; i++) {
      date.push(i)
    }

    option = {
      title: {
        text: '实时客流趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      grid: {
        left: '5%',
        right: '10%',
        top: '15%',
        bottom: '5%',
        // width: 1194,
        // height: 236,
        containLabel: true
      },
      tooltip: {  // 提示框样式
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        formatter: function (params) {
          // console.log(params)
          return params[params.length - 1].data[1] + '人';
        },
        // formatter: "{c}人",
        backgroundColor: '#065f89',
        padding: 10,
        borderColor: '#28eefb',
        borderWidth: 1,
        axisPointer: {  // 指示线
          lineStyle: {
            color: '#68e5ff'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时点',
        data: date,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 3
        },
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '实时客流趋势',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'a',
          label: {
            normal: {
              show: false
            }
          },
          // 填充区域样式
          areaStyle: {
            normal: {
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: bdColor,
          },
          data: [],

        },
        {
          name: '预测客流趋势',
          type: 'line',
          smooth: true,
          symbol: 'none',
          // stack: 'a',
          // areaStyle: {
          //   normal: {
          //   }
          // },
          itemStyle: {
            normal: {
              lineStyle: {
                width: 1,
                color: bdColor,
                type: 'dotted'  //'dotted'虚线 'solid'实线
              }
            }
          },
          data: []
        }
      ]
    };

    tab4Li2Echart2reqData()
    if (option && typeof option === "object") {
      tab4Li2Echart2.setOption(option, true);
    }

  }

  function tab4Li2Echart2reqData(date) {
    var d = date ? date : returnDate();
    $('#tab4-klqs-cld2-box').hide();
    tab4Li2Echart2.showLoading();    //加载动画
    var url = 'toll/selectTollFlowTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    var url2 = 'toll/selectTollFlowPredict.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab2Li2InitEchart',data);
        var dataArr = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            // var obj = data.data[i];
            // dataArr.push(obj.pepValue);

            var obj = data.data[i];
            var tempArr = obj.countTime.split('-');
            var hour = strDelZero(tempArr[tempArr.length - 1]);
            var objArr = [hour, obj.pepValue];
            dataArr.push(objArr);
          }
        }

        // debugger
        $('#tab4-klqs-cld2-box').show();
        tab4Li2Echart2.hideLoading();    //隐藏加载动画
        tab4Li2Echart2.setOption({
          series: [
            {
              name: '实时客流趋势',
              data: dataArr
            }
          ]
        })
      } else {
        $('#tab4-klqs-cld2-box').show();
        tab4Li2Echart2.hideLoading();    //隐藏加载动画
      }

    })
    // $.axpost(url2,{},function (data) {
    //   // console.log('tab2Li2InitEchart',data);
    //   var dataArr = [];
    //   for (var i = 0; i < data.data.length; i++) {
    //     // var obj = data.data[i];
    //     // dataArr.push(obj.pepValue);
    //
    //     var obj = data.data[i];
    //     var tempArr = obj.countTime.split('-');
    //     var hour = strDelZero(tempArr[tempArr.length-1]);
    //     var objArr = [hour,obj.preUserCnt];
    //     dataArr.push(objArr);
    //   }
    //   // debugger
    //   $('#tab4-klqs-cld2-box').show();
    //   tab4Li2Echart2.hideLoading();    //隐藏加载动画
    //   tab4Li2Echart2.setOption({
    //     series: [
    //       {
    //         name: '预测客流趋势',
    //         data: dataArr
    //       }
    //     ]
    //   })
    // })
  }

  var tab4Li2Echart3;

  function tab4Li2InitEchart3() {
    var dom = document.getElementById("tab4-klhx");
    if (!tab4Li2Echart3) {
      tab4Li2Echart3 = echarts.init(dom);
    }
    var app = {};
    option = null;
    app.title = '环形图';

    option = {
      title: {
        text: '客流画像',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      // tooltip: {
      //   trigger: 'item',
      //   formatter: "{a} <br/>{b}: {c} ({d}%)"
      // },

      series: [
        {
          name: '客流画像',
          type: 'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: true,
          animation: false,
          itemStyle: {
            color: 'rgb(104,228,255)',
            borderColor: cldColor,
            borderWidth: 10
          },
          label: {
            // normal: {
            //   show: true,
            //   position: 'center'
            // },
            silent: true,
            normal: {
              // \n\n可让文字居于牵引线上方，很关键
              //  {b}  代表显示的内容标题
              // {c}代表数据
              formatter: '{b}\n{c}%',
              fontSize: 20,

              // textAlign: 'left',//'left'、 'center'、 'right'，
              // textVerticalAlign: 'bottom',//文字垂直对齐方式，可取值：'top'、 'middle'、 'bottom'，默认根据 textPosition 计算。
              //rich: {
              //    b: {
              //        font: '16px Microsoft YaHei',
              //        textFill: 'rgb(104,228,225)'
              //    },
              //    c: {
              //        font: '24px Microsoft YaHei',
              //        textFill: 'white'
              //    }
              //},
              borderWidth: 20,
              borderRadius: 4,
              padding: [0, -10],
              rich: {
                // b: {
                //   color: 'green',
                //   fontSize: 12,
                //   lineHeight: 20
                // },
                c: {
                  fontSize: 26,
                  lineHeight: 20,
                  color: 'white'
                }
              }
            },

            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value: 335, name: '直接访问'},
            // {value: 310, name: '邮件营销'},
            // {value: 234, name: '联盟广告'},
            // {value: 135, name: '视频广告'},
            // {value: 1548, name: '搜索引擎'}
          ]
        }
      ]
    };
    tab4Li2Echart3ReqData(tab4Li2DefaultDate);

    if (option && typeof option === "object") {
      tab4Li2Echart3.setOption(option, true);
    }
  }

  function tab4Li2Echart3ReqData(date) {
    tab4Li2Echart3.showLoading();    //加载动画
    var d;
    d = date ? date : returnDate(1);
    var url = 'toll/selectTollSexAge.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.tollAgeList.length&&data.data.tollSexList.length) {
      if (data.isSuccess) {
        // console.log('tab4Li2Echart3',data);
        var dataArr = [];
        if (data.data.tollAgeList.length) {
          for (var i = 0; i < data.data.tollAgeList.length; i++) {
            var obj = data.data.tollAgeList[i];
            // debugger
            if (obj.ageGroup == 0) {
              continue
            }
            dataArr.push({
              name: ageObj[obj.ageGroup],
              value: formatDecimal(obj.ageZb)
            })
          }
        }

        // console.log('dataArr:',dataArr);

        tab4Li2Echart3.hideLoading();    //隐藏加载动画
        tab4Li2Echart3.setOption({
          series: [
            {
              name: '客流画像',
              data: dataArr
            }
          ]
        });
        // if(data.data.tollAgeList.length) {
        var dom = $("#tab4-klhx").parent();
        addSexNum(dom, 'tollSexList', data.data)


      }
    })
  }

  var tab4Li3Echart1;

  function tab4Li3InitEchart1() {
    var dom = document.getElementById("tab4-zlsc-day");
    if (!tab4Li3Echart1) {
      tab4Li3Echart1 = echarts.init(dom);
    }
    var date = hourArr;
    var isKYorFW = checkPosType();
    date = isKYorFW ? hourArr2 : hourArr;

    option = null;
    option = {
      title: {
        text: '全天驻留时长分析',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: date,
        name: '小时',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '人数',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [{
        name: '驻留时长',
        data: [],
        type: 'bar',
        // 数据显示位置
        label: {
          show: true,
          position: 'top',
          align: 'middle',
          // verticalAlign: 'middle'

        },
        // 柱子颜色
        itemStyle: {
          color: bdColor
        },
        barWidth: '50%',
      }]
    };
    tab4Li3Echart1reqData(tab4Li2DefaultDate);

    if (option && typeof option === "object") {
      tab4Li3Echart1.setOption(option, true);
    }
  }

  function tab4Li3Echart1reqData(date) {
    var d = date ? date : returnDate();
    tab4Li3Echart1.showLoading();    //加载动画
    var url = 'toll/selectTollLinger.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.length) {
      if (data.isSuccess) {
        // console.log('tab4Li3Echart1',data);
        var dataArr = [];
        if (data.data.length) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            // d.push(obj.timeZb);
            dataArr[parseInt(obj.timeGroup)] = obj.timeValue;
          }
        }

        // debugger

        tab4Li3Echart1.hideLoading();    //隐藏加载动画
        tab4Li3Echart1.setOption({
          series: [
            {
              name: '驻留时长',
              data: dataArr
            }
          ]
        })
      }

    })
  }


  var tab4Li3Echart2,
    colorArr = ['#4472C5', '#ED7C30', '#80FF80', '#FF8096', '#800080', '#d147e2', '#7d7c80', '#d4d00b', '#3ee4e4'];

  function tab4Li3InitEchart2() {
    if (!tab4Li3Echart2) {
      tab4Li3Echart2 = echarts.init(document.getElementById('tab4-zlsc2'));
    }
    var date = [];

    for (var i = 0; i < 25; i++) {  // 时间(小时)
      date.push(i);
    }
    var option = {
      title: {
        text: '实时驻留时长',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        //show:true,
        // axisPointer: {
        //   type: 'line',
        //   show: true,
        //   label: {
        //     normal: {
        //       show: false
        //     }
        //   },
        // },
        // backgroundColor: 'transparent',
        // formatter: function (params) {
        //   return params[params.length - 1].data;
        // }
      },
      color: colorArr,
      legend: {
        show: true,
        textStyle: {
          color: '#557398'
        },
        data: [],
        width: 300,
        height: 50,
        right: 10,
        top: 10
      },
      grid: {
        left: '5%',
        right: '10%',
        top: '25%',
        bottom: '10%',
        // width: 1194,
        // height: 236,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '(小时)',
        axisLine: {
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 3
        },
        data: date
      },
      yAxis: {
        type: 'value',
        name: '(人数)',
        splitLine: {show: false},
        axisLine: {
          lineStyle: {
            color: whiteColor
          }
        },

      },
      // series: handleOption()
      series: []

    };
    tab4Li3Echart2reqData(tab4Li2DefaultDate);
    tab4Li3Echart2.setOption(option);
  }

  function tab4Li3Echart2reqData(date) {
    var d = date ? date : returnDate(1);
    tab4Li3Echart2.showLoading();    //加载动画
    var url = 'toll/selectTollLingerDay.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    var url2 = 'toll/selectTollLingerPredict.do?postionType=' + positionType + '&postionName=' + curPosition + '&countDate=' + d;
    $.axpost(url, {}, function (data) {
      if (data.isSuccess) {
        var dataArr = [];
        var index = 0;
        if (!isEmptyObject(data.data)) {
          for (var key in data.data) {
            var newArr = [];
            for (var i = 0; i < data.data[key].length; i++) {
              var obj = data.data[key][i];
              newArr.push(obj.timeValue)
            }
            dataArr.push({
              name: hourArr[index],
              data: newArr,
              type: 'line',
              z: 2,
              // stack: 'a',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  // color: bdColor//rgba(55,255,75
                  color: colorArr[i]//rgba(55,255,75
                }
              },
              label: {
                normal: {
                  show: false
                }
              },
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: 'rgba(70,158,228,0.3)'
                    }, {
                      offset: 0.5, color: 'rgba(70,158,228,0.15)'
                    }, {
                      offset: 1, color: 'rgba(70,158,228,0)'
                    }]
                  }
                }
              },
            });
            index++;
          }
        }

        // console.log('dataArr',dataArr);
        // debugger
        tab4Li3Echart2.hideLoading();    //隐藏加载动画
        tab4Li3Echart2.setOption({
          series: dataArr,
          legend: {
            data: hourArr
          }
        })
      }

    })

  }

  var tab4Li4Echart1;

  function tab4Li4InitEchart1() {
    var dom = $('#tab4-zklqs');
    if (!tab4Li4Echart1) {
      tab4Li4Echart1 = echarts.init(dom[0]);
    }
    option = null;

    option = {
      title: {
        text: '每日总客流趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '日期',
        data: [],
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        },
        axisLabel: {
          interval: 0,
          rotate: 45,
          //倾斜度 -90 至 90 默认为0
          margin: 10,
          textStyle: {
            // fontWeight: "bolder",
            // color: "#000000"
          }
        },
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '客流量',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'a',
          label: {
            normal: {
              show: false
            }
          },
          // 填充区域样式
          areaStyle: {
            normal: {
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#ad9955' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: 'rgb(255,215,93)'
          },
          data: []
        }
      ]
    };
    tab4Li4EchartReqData();
    if (option && typeof option === "object") {
      tab4Li4Echart1.setOption(option, true);
    }
  }

  function tab4Li4EchartReqData(date) {
    var d;
    if (date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab4Li4Echart1.showLoading();    //加载动画
    var url = 'toll/selectTollDayflowTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&startDate=' + d.start + '&endDate=' + d.end;
    $.axpost(url, {}, function (data) {
      // if(data.isSuccess&&data.data.listTollDayFlow.length) {
      if (data.isSuccess) {
        // console.log('tab4Li4Echart1',data);
        var dayArr = [];
        var dataArr = [];
        if (data.data.listTollDayFlow.length) {
          for (var i = 0; i < data.data.listTollDayFlow.length; i++) {
            var obj = data.data.listTollDayFlow[i];
            dayArr.push(obj.statDate);
            dataArr.push(obj.allPeople);
          }
        }
        // debugger

        tab4Li4Echart1.hideLoading();    //隐藏加载动画
        tab4Li4Echart1.setOption({
          xAxis: {
            data: dayArr
          },
          series: [
            {
              name: '客流量',
              data: dataArr
            }
          ]
        })
      }

    })
  }

  var tab4Li4Echart2;

  function tab4Li4InitEchart2() {
    var dom = document.getElementById("tab4-clqs");
    if (!tab4Li4Echart2) {
      tab4Li4Echart2 = echarts.init(dom);
    }
    option = null;

    option = {
      title: {
        text: '车辆趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },

      legend: {
        data: [],
        textStyle: {
          color: 'rgb(221,243,255)'
        }
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: '5%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.1],
        name: '数量',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      xAxis: {
        type: 'category',
        data: [],
        name: '日期',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 0,
          rotate: 45,
          //倾斜度 -90 至 90 默认为0
          margin: 10,
          textStyle: {
            // fontWeight: "bolder",
            // color: "#000000"
          }
        },
      },
      series: [
        {
          name: '进入车辆',
          type: 'bar',
          barGap: 0,
          // 柱子颜色
          itemStyle: {
            color: 'rgb(97,80,218)'
          },
          data: []
        },
        {
          name: '离开车辆',
          type: 'bar',
          barGap: 0,
          // 柱子颜色
          itemStyle: {
            color: 'rgb(254,158,79)'
          },
          data: []
        }
      ]
    };
    tab4Li4Echart2ReqData();
    if (option && typeof option === "object") {
      tab4Li4Echart2.setOption(option, true);
    }
  }

  function tab4Li4Echart2ReqData(date) {
    var d;
    if (date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab4Li4Echart2.showLoading();    //加载动画
    var url = 'toll/selectTollDayflowTrend.do?postionType=' + positionType + '&postionName=' + curPosition + '&startDate=' + d.start + '&endDate=' + d.end;
    $.axpost(url, {}, function (data) {
      console.log('tab4Li4Echart2', data);
      var dayArr = [];
      var ariArr = [];
      var leaArr = [];
      for (var i = 0; i < data.data.listTollDayFlow.length; i++) {
        var obj = data.data.listTollDayFlow[i];
        dayArr.push(obj.statDate);
        ariArr.push(obj.inValue);
        leaArr.push(obj.outValue);
      }
      // debugger

      tab4Li4Echart2.hideLoading();    //隐藏加载动画

      tab4Li4Echart2.setOption({
        legend: {
          data: ['进入车辆', '离开车辆']
        },
        xAxis: {
          data: dayArr
        },
        series: [
          {
            name: '离开车辆',
            data: leaArr
          },
          {
            name: '进入车辆',
            data: ariArr
          }
        ]
      })
    })
  }

  // 高速路段图表
  // var tab5Li2Echart1;
  // function tab5Li2initEchart1() {
  //   var dom = $('#tab5-klqs');
  //   if(!tab5Li2Echart1) {
  //     tab5Li2Echart1 = echarts.init(dom[0]);
  //   }
  //
  //   option = null;
  //   var date = [];
  //
  //   for (var i = 0; i < 25; i++) {  // 时间(小时)
  //     date.push(i);
  //   }
  //
  //   option = {
  //     title: {
  //       text: '实时客流趋势',
  //       textStyle: {
  //         color: 'rgb(221,243,255)',
  //         fontSize: 18,
  //         fontFamily: 'Microsoft YaHei',
  //         // fontWeight:400
  //       }
  //     },
  //     tooltip: {  // 提示框样式
  //       trigger: 'axis',
  //       // formatter: "{a} <br/>{b}: {c} ({d}%)"
  //       formatter: function (params) {
  //         // console.log(params)
  //         return params[params.length - 1].data[1] + '人';
  //       },
  //       // formatter: "{c}人",
  //       backgroundColor: '#065f89',
  //       padding: 10,
  //       borderColor: '#28eefb',
  //       borderWidth: 1,
  //       axisPointer: {  // 指示线
  //         lineStyle: {
  //           color: '#68e5ff'
  //         }
  //       }
  //     },
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       name: '时点',
  //       data: date,
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       axisLabel: {
  //         interval: 3
  //       },
  //     },
  //     yAxis: {
  //       boundaryGap: [0, '50%'],
  //       type: 'value',
  //       name: '人数',
  //       // 轴 样式
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       // 分割线
  //       splitLine: {
  //         show: false
  //       }
  //     },
  //     series: [
  //       {
  //         name: '实时客流趋势',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         stack: 'a',
  //         label: {
  //           normal: {
  //             show: false
  //           }
  //         },
  //         // 填充区域样式
  //         areaStyle: {
  //           normal: {
  //             // color: bdColor,
  //             // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  //             color: {
  //               type: 'linear',
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [{
  //                 offset: 0, color: '#183d74' // 0% 处的颜色
  //               }, {
  //                 offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
  //               }],
  //               globalCoord: false // 缺省为 false
  //             }
  //           }
  //         },
  //         lineStyle: {
  //           color: bdColor,
  //         },
  //         data: [],
  //
  //       },
  //       {
  //         name: '预测客流趋势',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         // stack: 'a',
  //         // areaStyle: {
  //         //   normal: {
  //         //   }
  //         // },
  //         itemStyle: {
  //           normal: {
  //             lineStyle: {
  //               width: 1,
  //               color: bdColor,
  //               type: 'dotted'  //'dotted'虚线 'solid'实线
  //             }
  //           }
  //         },
  //         data: []
  //       }
  //     ]
  //   };
  //   tab5Li2Echart1reqData();
  //   if (option && typeof option === "object") {
  //     tab5Li2Echart1.setOption(option, true);
  //   }
  //
  // }
  //
  // function tab5Li2Echart1reqData(date) {
  //   var d = date?date:returnDate();
  //   var str = '虎门大桥';
  //   $('#tab5-cld1').hide();
  //   tab5Li2Echart1.showLoading();    //加载动画
  //   // var url = 'highSpeed/selectGsFlowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
  //   var url = 'highSpeed/selectGsFlowTrend.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+d;
  //   var url2 = 'highSpeed/selectGsFlowPredict.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+d;
  //   $.axpost(url,{},function (data) {
  //     // console.log('tab2Li2InitEchart',data);
  //     var dataArr = [];
  //     for (var i = 0; i < data.data.length; i++) {
  //       var obj = data.data[i];
  //       // dataArr.push(obj.peopleNum);
  //
  //       var tempArr = obj.countTime.split('-');
  //       var hour = strDelZero(tempArr[tempArr.length-1]);
  //       var objArr = [hour,obj.peopleNum];
  //       dataArr.push(objArr);
  //     }
  //     // console.log('dataArr:',dataArr);
  //
  //     // debugger
  //     $('#tab5-cld1').show();
  //     tab5Li2Echart1.hideLoading();    //隐藏加载动画
  //     tab5Li2Echart1.setOption({
  //       series: [
  //         {
  //           name: '实时客流趋势',
  //           data: dataArr
  //         }
  //       ]
  //     })
  //   })
  //
  //   $.axpost(url2,{},function (data) {
  //     // console.log('tab2Li2InitEchart',data);
  //     var dataArr = [];
  //     for (var i = 0; i < data.data.length; i++) {
  //       var obj = data.data[i];
  //       // dataArr.push(obj.peopleNum);
  //
  //       var tempArr = obj.countTime.split('-');
  //       var hour = strDelZero(tempArr[tempArr.length-1]);
  //       var objArr = [hour,obj.preUserCnt];
  //       dataArr.push(objArr);
  //     }
  //     // debugger
  //     $('#tab5-cld1').show();
  //     tab5Li2Echart1.hideLoading();    //隐藏加载动画
  //     tab5Li2Echart1.setOption({
  //       series: [
  //         {
  //           name: '预测客流趋势',
  //           data: dataArr
  //         }
  //       ]
  //     })
  //   })
  //
  // }
  //
  // var tab5Li2Echart2;
  // function tab5Li2initEchart2() {
  //   var dom = $('#tab5-yxsd');
  //   if(!tab5Li2Echart2) {
  //     tab5Li2Echart2 = echarts.init(dom[0]);
  //   }
  //
  //   option = null;
  //   var date = [];
  //
  //   for (var i = 0; i < 25; i++) {  // 时间(小时)
  //     date.push(i);
  //   }
  //
  //   option = {
  //     title: {
  //       text: '实时平均通行速度',
  //       textStyle: {
  //         color: 'rgb(221,243,255)',
  //         fontSize: 18,
  //         fontFamily: 'Microsoft YaHei',
  //         // fontWeight:400
  //       }
  //     },
  //     tooltip: {  // 提示框样式
  //       trigger: 'axis',
  //       // formatter: "{a} <br/>{b}: {c} ({d}%)"
  //       formatter: function (params) {
  //         return params[params.length - 1].data + '人';
  //       },
  //       backgroundColor: '#065f89',
  //       padding: 10,
  //       borderColor: '#28eefb',
  //       borderWidth: 1,
  //       axisPointer: {  // 指示线
  //         lineStyle: {
  //           color: '#68e5ff'
  //         }
  //       }
  //     },
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       name: '时点',
  //       data: date,
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       axisLabel: {
  //         interval: 3
  //       },
  //     },
  //     yAxis: {
  //       boundaryGap: [0, '50%'],
  //       type: 'value',
  //       name: '(km/h)',
  //       // 轴 样式
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       // 分割线
  //       splitLine: {
  //         show: false
  //       }
  //     },
  //     series: [
  //       {
  //         name: '实时平均通行速度',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         stack: 'a',
  //         label: {
  //           normal: {
  //             show: false
  //           }
  //         },
  //         // 填充区域样式
  //         areaStyle: {
  //           normal: {
  //             // color: bdColor,
  //             // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  //             color: {
  //               type: 'linear',
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [{
  //                 offset: 0, color: '#15ad64' // 0% 处的颜色
  //               }, {
  //                 offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
  //               }],
  //               globalCoord: false // 缺省为 false
  //             }
  //           }
  //         },
  //         lineStyle: {
  //           color: '#15ad64'
  //         },
  //         data: [],
  //
  //       },
  //       {
  //         name: '预测平均通行速度',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         stack: 'a',
  //         // areaStyle: {
  //         //   normal: {
  //         //   }
  //         // },
  //         lineStyle: {
  //           type: 'dotted',
  //           color: '#15ad64'
  //
  //         },
  //         data: []
  //       }
  //     ]
  //   };
  //   tab5Li2Echart2reqData();
  //   if (option && typeof option === "object") {
  //     tab5Li2Echart2.setOption(option, true);
  //   }
  //
  // }
  //
  // function tab5Li2Echart2reqData(date) {
  //   var d = date?date:returnDate();
  //   var str = '虎门大桥';
  //   $('#tab5-cld2').hide();
  //   tab5Li2Echart2.showLoading();    //加载动画
  //   // var url = 'highSpeed/selectGsAveSpeed.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
  //   var url = 'highSpeed/selectGsAveSpeed.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+d;
  //   var url2 = 'highSpeed/selectGsAveSpeedPredict.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+d;
  //   $.axpost(url,{},function (data) {
  //     // console.log('tab2Li2InitEchart',data);
  //     var dataArr = [];
  //     for (var i = 0; i < data.data.length; i++) {
  //       var obj = data.data[i];
  //       // dataArr.push(obj.avgSpeed);
  //
  //       var tempArr = obj.countTime.split('-');
  //       var hour = strDelZero(tempArr[tempArr.length-1]);
  //       var objArr = [hour,obj.avgSpeed];
  //       dataArr.push(objArr);
  //     }
  //     console.log('dataArr:',dataArr);
  //
  //     // debugger
  //     $('#tab5-cld2').show();
  //     tab5Li2Echart2.hideLoading();    //隐藏加载动画
  //     tab5Li2Echart2.setOption({
  //       series: [
  //         {
  //           name: '实时平均通行速度',
  //           data: dataArr
  //         }
  //       ]
  //     })
  //   })
  //
  //   $.axpost(url2,{},function (data) {
  //     // console.log('tab2Li2InitEchart',data);
  //     var dataArr = [];
  //     for (var i = 0; i < data.data.length; i++) {
  //       var obj = data.data[i];
  //       // dataArr.push(obj.avgSpeed);
  //
  //       var tempArr = obj.countTime.split('-');
  //       var hour = strDelZero(tempArr[tempArr.length-1]);
  //       var objArr = [hour,obj.preAvgSpeed];
  //       dataArr.push(objArr);
  //     }
  //     // debugger
  //     $('#tab5-cld2').show();
  //     tab5Li2Echart2.hideLoading();    //隐藏加载动画
  //     tab5Li2Echart2.setOption({
  //       series: [
  //         {
  //           name: '预测平均通行速度',
  //           data: dataArr
  //         }
  //       ]
  //     })
  //   })
  //
  // }
  //
  // var tab5Li3Echart1;
  // function tab5Li3InitEchart1() {
  //   var dom = $('#tab5-klqs-week');
  //   if(!tab5Li3Echart1) {
  //     tab5Li3Echart1 = echarts.init(dom[0]);
  //   }
  //   option = null;
  //
  //   option = {
  //     title: {
  //       text: '每周总客流趋势',
  //       textStyle: {
  //         color: 'rgb(221,243,255)',
  //         fontSize: 18,
  //         fontFamily: 'Microsoft YaHei',
  //         // fontWeight:400
  //       }
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       // formatter: "{a} <br/>{b}: {c} ({d}%)"
  //     },
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       name: '日期',
  //       data: [],
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       // 分割线
  //       splitLine: {
  //         show: false
  //       },
  //       axisLabel: {
  //         interval: 0,
  //         rotate: 45,
  //         //倾斜度 -90 至 90 默认为0
  //         margin: 10,
  //         textStyle: {
  //           // fontWeight: "bolder",
  //           // color: "#000000"
  //         }
  //       },
  //     },
  //     yAxis: {
  //       boundaryGap: [0, '50%'],
  //       type: 'value',
  //       name: '人数',
  //       // 轴 样式
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       // 分割线
  //       splitLine: {
  //         show: false
  //       }
  //     },
  //     series: [
  //       {
  //         name: '每周总客流趋势',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         stack: 'a',
  //         label: {
  //           normal: {
  //             show: false
  //           }
  //         },
  //         // 填充区域样式
  //         areaStyle: {
  //           normal: {
  //             // color: bdColor,
  //             // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  //             color: {
  //               type: 'linear',
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [{
  //                 offset: 0, color: '#ad9955' // 0% 处的颜色
  //               }, {
  //                 offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
  //               }],
  //               globalCoord: false // 缺省为 false
  //             }
  //           }
  //         },
  //         lineStyle: {
  //           color: 'rgb(255,215,93)'
  //         },
  //         data: []
  //       }
  //     ]
  //   };
  //   tab5Li3Echart1ReqData();
  //   if (option && typeof option === "object") {
  //     tab5Li3Echart1.setOption(option, true);
  //   }
  // }
  //
  // function tab5Li3Echart1ReqData(date) {
  //   var str = '虎门大桥'
  //   var d;
  //   if(date) {
  //     d = date;
  //   } else {
  //     d = {
  //       start: returnDate(7),
  //       end: returnDate(1)
  //     };
  //     // console.log('d',d);
  //   }
  //   tab5Li3Echart1.showLoading();    //加载动画
  //   // var url = 'highSpeed/selectGsPeopleAndCarTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
  //   var url = 'highSpeed/selectGsPeopleAndCarTrend.do?postionType='+ positionType +'&postionName='+ str +'&startDate='+d.start + '&endDate='+d.end;
  //   $.axpost(url,{},function (data) {
  //     // console.log('tab5Li3Echart1',data);
  //     var dayArr = [];
  //     var dataArr = [];
  //     for (var i = 0; i < data.data.listGsTrendDayFlowDAO.length; i++) {
  //       var obj = data.data.listGsTrendDayFlowDAO[i];
  //       dayArr.push(obj.statDate);
  //       dataArr.push(obj.peopleNum);
  //     }
  //     // debugger
  //
  //     tab5Li3Echart1.hideLoading();    //隐藏加载动画
  //     tab5Li3Echart1.setOption({
  //       xAxis: {
  //         data: dayArr
  //       },
  //       series: [
  //         {
  //           name: '每周总客流趋势',
  //           data: dataArr
  //         }
  //       ]
  //     })
  //   })
  // }
  //
  // var tab5Li3Echart2;
  // function tab5Li3InitEchart2() {
  //   var dom = $('#tab5-clqs-week');
  //   if(!tab5Li3Echart2) {
  //     tab5Li3Echart2 = echarts.init(dom[0]);
  //   }
  //   option = null;
  //
  //   option = {
  //     title: {
  //       text: '每周总车流量趋势',
  //       textStyle: {
  //         color: 'rgb(221,243,255)',
  //         fontSize: 18,
  //         fontFamily: 'Microsoft YaHei',
  //         // fontWeight:400
  //       }
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       // formatter: "{a} <br/>{b}: {c} ({d}%)"
  //     },
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       name: '日期',
  //       data: [],
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       // 分割线
  //       splitLine: {
  //         show: false
  //       },
  //       axisLabel: {
  //         interval: 0,
  //         rotate: 45,
  //         //倾斜度 -90 至 90 默认为0
  //         margin: 10,
  //         textStyle: {
  //           // fontWeight: "bolder",
  //           // color: "#000000"
  //         }
  //       },
  //     },
  //     yAxis: {
  //       boundaryGap: [0, '50%'],
  //       type: 'value',
  //       name: '辆',
  //       // 轴 样式
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       // 分割线
  //       splitLine: {
  //         show: false
  //       }
  //     },
  //     series: [
  //       {
  //         name: '每周总车流量趋势',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         stack: 'a',
  //         label: {
  //           normal: {
  //             show: false
  //           }
  //         },
  //         // 填充区域样式
  //         areaStyle: {
  //           normal: {
  //             // color: bdColor,
  //             // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  //             color: {
  //               type: 'linear',
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [{
  //                 offset: 0, color: '#15e1d8' // 0% 处的颜色
  //               }, {
  //                 offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
  //               }],
  //               globalCoord: false // 缺省为 false
  //             }
  //           }
  //         },
  //         lineStyle: {
  //           color: '#15e1d8'
  //         },
  //         data: []
  //       }
  //     ]
  //   };
  //   tab5Li3Echart2ReqData();
  //   if (option && typeof option === "object") {
  //     tab5Li3Echart2.setOption(option, true);
  //   }
  // }
  //
  // function tab5Li3Echart2ReqData(date) {
  //   var str = '虎门大桥'
  //   var d;
  //   if(date) {
  //     d = date;
  //   } else {
  //     d = {
  //       start: returnDate(7),
  //       end: returnDate(1)
  //     };
  //     // console.log('d',d);
  //   }
  //   tab5Li3Echart2.showLoading();    //加载动画
  //   // var url = 'toll/selectTollDayflowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
  //   var url = 'highSpeed/selectGsPeopleAndCarTrend.do?postionType='+ positionType +'&postionName='+ str +'&startDate='+d.start + '&endDate='+d.end;
  //   $.axpost(url,{},function (data) {
  //     // console.log('tab5Li3Echart2',data);
  //     var dayArr = [];
  //     var dataArr = [];
  //     for (var i = 0; i < data.data.listGsTrendDayFlowDAO.length; i++) {
  //       var obj = data.data.listGsTrendDayFlowDAO[i];
  //       dayArr.push(obj.statDate);
  //       dataArr.push(obj.carNum);
  //     }
  //     // debugger
  //
  //     tab5Li3Echart2.hideLoading();    //隐藏加载动画
  //     tab5Li3Echart2.setOption({
  //       xAxis: {
  //         data: dayArr
  //       },
  //       series: [
  //         {
  //           name: '每周总车流量趋势',
  //           data: dataArr
  //         }
  //       ]
  //     })
  //   })
  // }
  //
  // var tab5Li3Echart3;
  // function tab5Li3initEchart3() {
  //   var carArr = [''];
  //   var dom = $('#tab5-clfb-week');
  //   if(!tab5Li3Echart3) {
  //     tab5Li3Echart3 = echarts.init(dom[0]);
  //   }
  //
  //   function handleOption() {
  //     var result = [];
  //     // for (var key in dataObj) {
  //     //   result.push({
  //     //     name: key,
  //     //     data: dataObj[key]
  //     //   })
  //     // }
  //     for (var i = 0; i < hourArr.length; i++) {
  //       var d = hourArr[i];
  //       result.push(
  //         {
  //           name: '实时',
  //           type: 'line',
  //           smooth: true,
  //           symbol: 'none',
  //           stack: 'a',
  //           label: {
  //             normal: {
  //               show: true
  //             }
  //           },
  //           // 填充区域样式
  //           areaStyle: {
  //             normal: {
  //               // color: bdColor,
  //               // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  //               color: {
  //                 type: 'linear',
  //                 x: 0,
  //                 y: 0,
  //                 x2: 0,
  //                 y2: 1,
  //                 colorStops: [{
  //                   offset: 0, color: '#183d74' // 0% 处的颜色
  //                 }, {
  //                   offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
  //                 }],
  //                 globalCoord: false // 缺省为 false
  //               }
  //             }
  //           },
  //           lineStyle: {
  //             color: bdColor,
  //           },
  //           data: data,
  //
  //         }
  //         // {
  //         //   name: '预测',
  //         //   type: 'line',
  //         //   smooth: true,
  //         //   symbol: 'none',
  //         //   stack: 'a',
  //         //   // areaStyle: {
  //         //   //   normal: {
  //         //   //   }
  //         //   // },
  //         //   lineStyle: {
  //         //     type: 'dotted'
  //         //   },
  //         //   data: data2
  //         // }
  //
  //     )
  //     }
  //     return result
  //   }
  //
  //   option = null;
  //
  //   option = {
  //     title: {
  //       text: '每周车辆类型分布',
  //       textStyle: {
  //         color: 'rgb(221,243,255)',
  //         fontSize: 18,
  //         fontFamily: 'Microsoft YaHei',
  //         // fontWeight:400
  //       }
  //     },
  //
  //     legend: {
  //       show:true,
  //       textStyle: {
  //         color: '#557398'
  //       },
  //       data: [],
  //       width: 300,
  //       height: 50,
  //       right: 10,
  //       top: 10
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       // formatter: "{a} <br/>{b}: {c} ({d}%)"
  //     },
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       name: '时点',
  //       data: [],
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       axisLabel: {
  //         interval: 0,
  //         rotate: 45,
  //         //倾斜度 -90 至 90 默认为0
  //         margin: 10,
  //         textStyle: {
  //           // fontWeight: "bolder",
  //           // color: "#000000"
  //         }
  //       },
  //     },
  //     yAxis: {
  //       boundaryGap: [0, '50%'],
  //       type: 'value',
  //       name: '人数',
  //       // 轴 样式
  //       axisLine: {
  //         onZero: false,
  //         lineStyle: {
  //           color: whiteColor
  //         }
  //       },
  //       // 分割线
  //       splitLine: {
  //         show: false
  //       }
  //     },
  //     series: [
  //       // {
  //       //   name: '实时',
  //       //   type: 'line',
  //       //   smooth: true,
  //       //   symbol: 'none',
  //       //   stack: 'a',
  //       //   label: {
  //       //     normal: {
  //       //       show: true
  //       //     }
  //       //   },
  //       //   // 填充区域样式
  //       //   areaStyle: {
  //       //     normal: {
  //       //       // color: bdColor,
  //       //       // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  //       //       color: {
  //       //         type: 'linear',
  //       //         x: 0,
  //       //         y: 0,
  //       //         x2: 0,
  //       //         y2: 1,
  //       //         colorStops: [{
  //       //           offset: 0, color: '#183d74' // 0% 处的颜色
  //       //         }, {
  //       //           offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
  //       //         }],
  //       //         globalCoord: false // 缺省为 false
  //       //       }
  //       //     }
  //       //   },
  //       //   lineStyle: {
  //       //     color: bdColor,
  //       //   },
  //       //   data: [],
  //       //
  //       // },
  //       // {
  //       //   name: '预测',
  //       //   type: 'line',
  //       //   smooth: true,
  //       //   symbol: 'none',
  //       //   stack: 'a',
  //       //   // areaStyle: {
  //       //   //   normal: {
  //       //   //   }
  //       //   // },
  //       //   lineStyle: {
  //       //     type: 'dotted'
  //       //   },
  //       //   data: data2
  //       // }
  //     ]
  //   };
  //   tab5Li3Echart3reqData();
  //   if (option && typeof option === "object") {
  //     tab5Li3Echart3.setOption(option, true);
  //   }
  //
  // }
  //
  // function tab5Li3Echart3reqData(date) {
  //   var str = '虎门大桥'
  //   var d;
  //   if(date) {
  //     d = date;
  //   } else {
  //     d = {
  //       start: returnDate(7),
  //       end: returnDate(1)
  //     };
  //     // console.log('d',d);
  //   }
  //   tab5Li3Echart3.showLoading();    //加载动画
  //   // var url = 'highSpeed/selectGsCarType.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+date;
  //   // var url = 'highSpeed/selectGsCarType.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+date;
  //   var url = 'highSpeed/selectGsCarType.do?postionType='+ positionType +'&postionName='+ str +'&startDate='+d.start + '&endDate='+d.end;
  //
  //   $.axpost(url,{},function (data) {
  //
  //     var dataArr = [];
  //     var lgdArr = [];
  //     var xArr = [];
  //
  //     var index = 0;
  //     for (var key in data.data) {
  //       lgdArr.push(key);
  //       var newArr = [];
  //       for (var i = 0; i < data.data[key].length; i++) {
  //         var obj = data.data[key][i];
  //         newArr.push(obj.peopleNum);
  //         if(xArr.length<7) {
  //           xArr.push(obj.statDate)
  //         }
  //       }
  //       dataArr.push(
  //         {
  //           name: lgdArr[index],
  //           data: newArr,
  //           type: 'line',
  //           smooth: true,
  //           symbol: 'none',
  //           stack: 'a',
  //           label: {
  //             // normal: {
  //             //   show: true
  //             // }
  //             show: false
  //           },
  //           // 填充区域样式
  //           areaStyle: {
  //             normal: {
  //               // color: bdColor,
  //               // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
  //               color: {
  //                 type: 'linear',
  //                 x: 0,
  //                 y: 0,
  //                 x2: 0,
  //                 y2: 1,
  //                 colorStops: [{
  //                   offset: 0, color: '#183d74' // 0% 处的颜色
  //                 }, {
  //                   offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
  //                 }],
  //                 globalCoord: false // 缺省为 false
  //               }
  //             }
  //           },
  //           lineStyle: {
  //             color: bdColor
  //           }
  //         }
  //       );
  //       index++;
  //     }
  //     console.log('dataArr',dataArr,xArr);
  //
  //
  //     // debugger
  //     tab5Li3Echart3.hideLoading();    //隐藏加载动画
  //     tab5Li3Echart3.setOption({
  //       series: dataArr,
  //       legend: {
  //         data: lgdArr
  //       },
  //       xAxis: {
  //         data: xArr
  //       }
  //     })
  //   })
  //
  // }


  var fliTrendChart1;

  function fliTrendInitChart1() {
    var cbox = $('#flight-chart-box1');
    var cbox2 = $('#flight-chart-box2');
    cbox.show();
    cbox2.hide();
    if (!fliTrendChart1) {
      fliTrendChart1 = echarts.init(cbox[0]);
    }
    option = null;
    var date = [];
    for (var i = 0; i < 24; i++) {  // 时间(小时)
      date.push(i);
    }
    option = {
      title: {
        show: false,
        text: '航班趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {  // 提示框样式
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        // formatter: "{c}人",
        // formatter: function (params) {
        //   console.log(params)
        //   return params[params.length - 1].data[1] + '人';
        // },
        backgroundColor: '#065f89',
        padding: 10,
        borderColor: '#28eefb',
        borderWidth: 1,
        axisPointer: {
          lineStyle: {
            color: '#68e5ff'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时点',
        data: date,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 3
        }
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '班次',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      legend: {
        data: [],
        textStyle: {
          color: '#fff'
        },
        top: 20
      },
      color: ['#f9d76f', bdColor],
      series: [
        {
          name: '出发航班',
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
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: '#f9d76f',
          },
          data: [],
        },
        {
          name: '到达航班',
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
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: bdColor,
          },
          data: [],
        }
      ]
    };

    fliTrendChart1reqData();

    if (option && typeof option === "object") {
      fliTrendChart1.setOption(option, true);
    }
  }

  function fliTrendChart1reqData() {
    fliTrendChart1.showLoading();
    $('#fli-chart-tab').hide();
    var theName;
    if (curPosition === '深圳宝安国际机场') {
      theName = 'bajc'
    }
    if (curPosition === '广州白云国际机场') {
      theName = 'byjc'
    }
    var trendType = 0;
    var url = 'terminal/selectAirTrend.do?airport=' + theName + '&trendType=' + trendType;
    $.axpost(url, {}, function (data) {
      if (data.isSuccess) {
        console.log('航班趋势:', data);
        fliTrendChart1.hideLoading();    //隐藏加载动画
        $('#fli-chart-tab').show();
        var tData = data.data;
        var leaArr = [], ariArr = [];
        for (var i = 0; i < tData.arrivalTrendList.length; i++) {
          var tItem = tData.arrivalTrendList[i];
          ariArr.push(tItem.passenger)
        }
        for (var j = 0; j < tData.sendTrendList.length; j++) {
          var tItem2 = tData.sendTrendList[j];
          leaArr.push(tItem2.passenger)
        }

        fliTrendChart1.setOption({
          legend: {
            data: ['出发航班', '到达航班']
          },
          series: [
            {
              name: '出发航班',
              data: leaArr
            },
            {
              name: '到达航班',
              data: ariArr
            }
          ]
        })
      }

    })
  }

  var fliTrendChart2;

  function fliTrendInitChart2() {
    var cbox = $('#flight-chart-box2');
    var cbox1 = $('#flight-chart-box1');
    cbox.show();
    cbox1.hide();
    if (!fliTrendChart2) {
      fliTrendChart2 = echarts.init(cbox[0]);
    }
    option = null;
    var date = [];
    for (var i = 0; i < 25; i++) {  // 时间(小时)
      date.push(i);
    }
    option = {
      title: {
        show: false,
        text: '旅客趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',

          // fontWeight:400
        }
      },
      tooltip: {  // 提示框样式
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        // formatter: "{c}人",
        // formatter: function (params) {
        //   console.log(params)
        //   return params[params.length - 1].data[1] + '人';
        // },
        backgroundColor: '#065f89',
        padding: 10,
        borderColor: '#28eefb',
        borderWidth: 1,
        axisPointer: {
          lineStyle: {
            color: '#68e5ff'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时点',
        data: date,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 3
        }
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      legend: {
        top: 20,
        data: [],
        textStyle: {
          color: '#fff'
        }
      },
      color: ['#f9d76f', bdColor],
      series: [
        {
          name: '出发旅客',
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
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: '#f9d76f',
          },
          data: [],
        },
        {
          name: '到达旅客',
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
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: bdColor,
          },
          data: [],
        }
      ]
    };

    fliTrendChart2reqData();

    if (option && typeof option === "object") {
      fliTrendChart2.setOption(option, true);
    }
  }

  function fliTrendChart2reqData() {
    $('#fli-chart-tab').hide();
    fliTrendChart2.showLoading();
    var theName;
    if (curPosition === '深圳宝安国际机场') {
      theName = 'bajc'
    }
    if (curPosition === '广州白云国际机场') {
      theName = 'byjc'
    }
    var trendType = 1;
    var url = 'terminal/selectAirTrend.do?airport=' + theName + '&trendType=' + trendType;
    $.axpost(url, {}, function (data) {
      if (data.isSuccess) {
        console.log('旅客趋势:', data);
        fliTrendChart2.hideLoading();    //隐藏加载动画
        $('#fli-chart-tab').show();
        var tData = data.data;
        var leaArr = [], ariArr = [];
        for (var i = 0; i < tData.arrivalTrendList.length; i++) {
          var tItem = tData.arrivalTrendList[i];
          ariArr.push(tItem.passenger)
        }
        for (var j = 0; j < tData.sendTrendList.length; j++) {
          var tItem2 = tData.sendTrendList[j];
          leaArr.push(tItem2.passenger)
        }

        fliTrendChart2.setOption({
          legend: {
            data: ['出发旅客', '到达旅客']
          },
          series: [
            {
              name: '出发旅客',
              data: leaArr
            },
            {
              name: '到达旅客',
              data: ariArr
            }
          ]
        })
      }

    })
  }

  var trainTrendChart1;

  function trainTrendInitChart1() {
    var cbox = $('#train-chart-box1');
    // var cbox2 = $('#flight-chart-box2');
    cbox.show();
    // cbox2.hide();
    if (!trainTrendChart1) {
      trainTrendChart1 = echarts.init(cbox[0]);
    }
    option = null;
    var date = [];
    for (var i = 0; i < 24; i++) {  // 时间(小时)
      date.push(i);
    }
    option = {
      title: {
        show: false,
        text: '列车趋势',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },
      tooltip: {  // 提示框样式
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        // formatter: "{c}人",
        // formatter: function (params) {
        //   console.log(params)
        //   return params[params.length - 1].data[1] + '人';
        // },
        backgroundColor: '#065f89',
        padding: 10,
        borderColor: '#28eefb',
        borderWidth: 1,
        axisPointer: {
          lineStyle: {
            color: '#68e5ff'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时点',
        data: date,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        axisLabel: {
          interval: 3
        }
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '车次',
        // 轴 样式
        axisLine: {
          onZero: false,
          lineStyle: {
            color: whiteColor
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      legend: {
        data: [],
        textStyle: {
          color: '#fff'
        },
        top: 20
      },
      color: ['#f9d76f', bdColor],
      series: [
        {
          name: '出发列车',
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
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: '#f9d76f',
          },
          data: [],
        },
        {
          name: '到达列车',
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
              // color: bdColor,
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#183d74' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: bdColor,
          },
          data: [],
        }
      ]
    };

    trainTrendChart1reqData();

    if (option && typeof option === "object") {
      trainTrendChart1.setOption(option, true);
    }
  }

  function trainTrendChart1reqData() {
    trainTrendChart1.showLoading();
    $('#train-chart-tab').hide();
    var theName = curPosition;

    // var trendType = 0;
    var url = 'terminal/selectTrainTrend.do?postionName=' + theName;
    $.axpost(url, {}, function (data) {
      if (data) {
        console.log('列车趋势:', data);
        trainTrendChart1.hideLoading();    //隐藏加载动画
        $('#train-chart-tab').show();
        var tData = data;
        var leaArr = [], ariArr = [];
        for (var i = 0; i < tData.arrivalTrendList.length; i++) {
          var tItem = tData.arrivalTrendList[i];
          ariArr.push(tItem.passenger)
        }
        for (var j = 0; j < tData.sendTrendList.length; j++) {
          var tItem2 = tData.sendTrendList[j];
          leaArr.push(tItem2.passenger)
        }

        trainTrendChart1.setOption({
          legend: {
            data: ['出发列车', '到达列车']
          },
          series: [
            {
              name: '出发列车',
              data: leaArr
            },
            {
              name: '到达列车',
              data: ariArr
            }
          ]
        })
      }

    })
  }

});
