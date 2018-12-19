
var pointControl
$(function () {
  var hourArr = ['0-1', '1-2','2-3', '3-4', '4-5', '5-6', '6-7', '7-8','8-24'];
  var tabArr = ['客运站,铁路,机场,港口','服务区','收费站','高速','高速路网'];
  var tabDomNameArr = ['#tab2','#tab3','#tab4','#tab5','#tab6'];
  var newTabArr = tabArr.map(function (item,index) {
    return {
      name: item,
      class: tabDomNameArr[index]
    }
  });
  var nowTab = tabArr[0];
  //postionType-位置类别：1场站，2服务区，3收费站
  var positionType = 1;
  var curPosition;  // 目前位置 点击marker 预警 变化

  // console.log(newTabArr)
  var tabBoxes = $('.tab-box');
  var tabBoxes2 = $('.tab-box2 .tab-box2-li');
  var tabBoxes3 = $('.tab-box3 .tab-box2-li');
  var tabBoxes4 = $('.tab-box4 .tab-box2-li');
  var tabBoxes5 = $('.tab-box5 .tab-box2-li');
  window.mapbase = new MapBase();
  var title = $('.title');
  pointControl = new PlacePointView(theMap);
  init();
  // console.log(pointControl.PlacePoints)

  /**
   * 初始化应用
   */
  function init() {
    console.log('切换到:',nowTab);
    // initCalendar();

    // 点击标题
    title.on('click',function () {
      pointControl.ReturnDefualt();  // 默认视角
      pointControl.showMarkers();  // 显示点标记
      showTabs();
      hideCurLocaction();
      hideTab2();
      $('#floor').addClass('dn');
    });

    // 点击搜索按钮
    $('#search-btn').on('click',function () {
      var v = $('#search').val();
      console.log('v:',v);
    });

    // 搜索框oninput事件
    // $('#search')[0].oninput = function () {
    //   console.log(this.value);
    //
    // }
    $('#search').on('input',function () {
      // console.log($(this).val());
      var resultList = $('#result-list');
      resultList.empty();
      var v = $(this).val().trim();
      console.log(v);

      if(!v) {
        console.log('搜索值不能为空');
        resultList.hide();
        return
      }
      var markerArr = pointControl.markes;
      var resultArr = [];
      for (var i = 0; i < markerArr.length; i++) {
        var m = markerArr[i];
        if(v===m.C.extData['枢纽名称'].substr(0,v.length)) {
          console.log(m.C.extData['枢纽名称']);
          resultArr.push(m.C.extData['枢纽名称'])
          // debugger
        }
      }
      // console.log(resultArr);
      
      // debugger
      if(!resultArr) {
        console.log('没符合条件的值');
        resultList.hide();
        return
      }
      for (var j = 0; j < resultArr.length; j++) {
        // console.log(j);

        var r = resultArr[j];
        var theLi = $('<li>'+ r +'</li>');
        var that = this;
        theLi.on('click',function () {
          $(that).val('');
          resultList.empty();
          resultList.hide();
          var name = $(this).text();
          var curPosDataBox = $('#cur-pos-data-box');
          var tabBoxCur = $('#tab-box-cur');
          var arrows = tabBoxCur.find('.arrow');
          tabBoxCur.find('.up').addClass('dn');
          tabBoxCur.find('.down').removeClass('dn');

          curPosDataBox.hide(300);
          isHideStation = true;
          goToPointByName(name);
          // console.log('m',m.C.extData['枢纽名称']);
          changePosText(name);
          // $('#tab-name').text($(this).text());
        });
        // debugger
        // console.log(resultList);

        resultList.append(theLi)
        resultList.show()
      }
    });

    // 左右屏切换
    $('#switch-btn').on('click',function (e) {
      e.stopPropagation();
      window.location.href = 'left.html';
    });

    for (var i = 0; i < tabBoxes.length; i++) {
      var box = tabBoxes[i];
      $(box).on('click',clickTab)
    }
    for (var j = 0; j < tabBoxes2.length; j++) {
      var box2 = tabBoxes2[j];
      var box3 = tabBoxes3[j];
      var box4 = tabBoxes4[j];
      var box5 = tabBoxes5[j];
      // 交通枢纽绑定
      $(box2).on('click',function () {
        clickTab2(tabBoxes2,this)
      })
      // 服务区绑定
      $(box3).on('click',function () {
        clickTab2(tabBoxes3,this)
      })
      // 收费站
      $(box4).on('click',function () {
        clickTab2(tabBoxes4,this)
      })
      $(box5).on('click',function () {
        clickTab2(tabBoxes5,this)
      })
    }
    arrowBindClick();
    dongchaTabBindClick();
    addStation();
    getYJData();

    // 先显示枢纽点
    pointControl.showPoints('客运站,铁路,机场,港口');
    // console.log('theDataObject:',pointControl.markes)
    markerBindClick();

  }
  var isHideStation = true;
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
      '清远汽车客运站|\n'

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
      '珠海站|'

    var shuiluminhang = '湛江徐闻海安港|\n' +
      '深圳宝安国际机场|\n' +
      '白云国际机场二号航站楼|\n' +
      '广州白云国际机场|\n' +
      '湛江机场|\n' +
      '揭阳机场|'

    var tieluArr = tielu.trim().split('|');
    var gongluArr = gonglu.trim().split('|');
    var shuiluminhangArr = shuiluminhang.trim().split('|');

    // console.log(tieluArr)
    for (var i = 0; i < tieluArr.length; i++) {
      var t = tieluArr[i].replace(/[\r\n]/g,"");
      if(!t) {
        console.log(t);
        continue
      }
      var stationDom = $('<li>'+ t +'</li>');
      stationDom.on('click',function () {
        var name = $(this).text();
        var curPosDataBox = $('#cur-pos-data-box');
        var tabBoxCur = $('#tab-box-cur');
        var arrows = tabBoxCur.find('.arrow');
        tabBoxCur.find('.up').addClass('dn');
        tabBoxCur.find('.down').removeClass('dn');

        curPosDataBox.hide(300);
        isHideStation = true;

        goToPointByName(name);
        // $('#tab-name').text($(this).text());
        changePosText(name);
      })
      $('#station-box-1').find('ul').append(stationDom);
      // $('#station-box-1').find('ul').append($('<li>'+ t +'</li>'));
    }
    for (var j = 0; j < gongluArr.length; j++) {
      // console.log(1111)
      var g = gongluArr[j].replace(/[\r\n]/g,"");
      // debugger
      if(!g) {
        // console.log(t);
        continue
      }
      var stationDom2 = $('<li>'+ g +'</li>');
      stationDom2.on('click',function () {
        isHideStation = true;
        var name = $(this).text();
        var curPosDataBox = $('#cur-pos-data-box');

        var tabBoxCur = $('#tab-box-cur');
        var arrows = tabBoxCur.find('.arrow');
        tabBoxCur.find('.up').addClass('dn');
        tabBoxCur.find('.down').removeClass('dn');

        curPosDataBox.hide(300)
        goToPointByName(name)
        // $('#tab-name').text($(this).text());
        changePosText(name);
      })
      $('#station-box-2').find('ul').append(stationDom2);
    }
    for (var k = 0; k < shuiluminhangArr.length; k++) {
      var s = shuiluminhangArr[k].replace(/[\r\n]/g,"");
      if(!s) {
        // console.log(t);
        continue
      }
      var stationDom3 = $('<li>'+ s +'</li>');
      stationDom3.on('click',function () {
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
        changePosText(name);
      })
      $('#station-box-3').find('ul').append(stationDom3);
    }
  }

  /**
   * 根据名字移动到地点
   * @param name
   */
  function goToPointByName(name) {

    var clickTarget = pointControl.findPointByName(name);
    if(clickTarget) {
      var lng = clickTarget['地址'][0].lnglat.split(',')[0];
      var lat = clickTarget['地址'][0].lnglat.split(',')[1];
      var arg = {
        P:lat,
        R:lng,
        lat: lat,
        lng: lng
      };
      // console.log(clickTarget['地址'][0].lnglat)
      pointControl.MoveToPoint(arg,18)
    }
  }

  /**
   * 日历初始化
   */
  function initCalendar() {
    if(nowTab===tabArr[0]) {
      // 交通枢纽 实时客流
      laydate.render({
        elem:'#tab2-li2-cld'
        ,value: returnDate()
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,done: function(value, date, endDate){
          // console.log(value); //得到日期生成的值，如：2017-08-18
          // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
          // console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
          tab2Li2Echart1reqData(value);
        }
      });
      // 交通枢纽 旅客洞察
      laydate.render({
        elem:'#tab2-li4-cld'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,value: returnDate(1)
        ,done: function(value, date, endDate){
          // console.log(value); //得到日期生成的值，如：2017-08-18
          // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
          // console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
          tab2Li3Echart1reqData(value);
          tab2Li3Echart2ReqData(value);
          tab2Li3Echart3ReqData(value);
          tab2Li3Echart4ReqData(value);
          getAreaData($('#tab2'),'省外',value)
        }
      })
      // 交通枢纽 旅客趋势
      laydate.render({
        elem:'#tab2-li3-cld'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,range: true
        ,value: returnDate(7) + ' - ' + returnDate(1)
        // ,min: -8 //7天前
        // ,max: 0 //7天后
        ,done: function(value, date, endDate){
          if(date) {
            var dateObj = {
              start: date.year+'-'+date.month+'-'+date.date,
              end: endDate.year+'-'+endDate.month+'-'+endDate.date,
            };
            // console.log(dateObj)
            tab2Li4EchartReqData(dateObj);
            tab2Li4Echart2ReqData(dateObj)
          } else {
            console.log('date不能为空');
          }
        }
      });
    }
    if(nowTab===tabArr[1]) {
      // 服务区
      laydate.render({
        elem:'#tab3-li3-cld2'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,range: true
        ,value: returnDate(7) + ' - ' + returnDate(1)
        ,done: function(value, date, endDate){
          if(date) {
            var dateObj = {
              start: date.year+'-'+date.month+'-'+date.date,
              end: endDate.year+'-'+endDate.month+'-'+endDate.date
            };
            // console.log(dateObj)
            tab3Li4EchartReqData(dateObj);
          } else {
            console.log('date不能为空');
          }
        }
      });
      laydate.render({
        elem:'#tab-li4-cld2'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,value: returnDate(1)
        ,done: function(value, date, endDate){
          tab3Li3Echart1reqData(value);
          tab3Li3Echart2ReqData(value);
          guishufenxiReqData(value);
          getAreaData2($('#tab3'),'省外',value)
        }
      })
      laydate.render({
        elem:'#sskl-cld2'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,value: returnDate()
        ,done: function(value, date, endDate){
          tab3Li2Echart1reqData(value);
        }
      })
    }
    if(nowTab===tabArr[2]) {
      // 收费站
      laydate.render({
        elem:'#tab4-klqs-cld2'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,value: returnDate()
        ,done: function(value, date, endDate){
          tab4Li2Echart2reqData(value);
        }
      })
      laydate.render({
        elem:'#tab4-m-cld'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,value: returnDate(1)
        ,done: function(value, date, endDate){
          tab4Li3Echart1reqData(value);
          tab4Li3Echart2reqData(value);
        }
      })
      laydate.render({
        elem:'#tab4-big-cld'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,range: true
        ,value: returnDate(7) + ' - ' + returnDate(1)
        ,done: function(value, date, endDate){
          if(date) {
            var dateObj = {
              start: date.year+'-'+date.month+'-'+date.date,
              end: endDate.year+'-'+endDate.month+'-'+endDate.date,
            };
            // console.log(dateObj)
            tab4Li4EchartReqData(dateObj);
            tab4Li4Echart2ReqData(dateObj);
          } else {
            console.log('date不能为空');
          }
        }
      })
    }
    if(nowTab===tabArr[3]) {
      // 高速路段
      laydate.render({
        elem:'#tab5-klqs-cld'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,value: returnDate()
        ,done: function(value, date, endDate){
          tab5Li2Echart1reqData(value);
        }
      })
      laydate.render({
        elem:'#tab5-klqs-cld2'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,value: returnDate()
        ,done: function(value, date, endDate){
          tab5Li2Echart2reqData(value);
        }
      })
      laydate.render({
        elem:'#tab5-big-cld'
        ,type:'date'//默认为date
        ,trigger:'click'//默认为click，即点击后出现日历框
        ,range: true
        // ,value: '2018-12-01 - 2018-12-07'
        ,value: returnDate(7) + ' - ' + returnDate(1)
        ,done: function(value, date, endDate){
          if(date) {
            var dateObj = {
              start: date.year+'-'+date.month+'-'+date.date,
              end: endDate.year+'-'+endDate.month+'-'+endDate.date,
            };
            // console.log(dateObj)
            tab5Li3Echart1ReqData(dateObj);
            tab5Li3Echart2ReqData(dateObj);
            tab5Li3Echart3reqData(dateObj);
          } else {
            console.log('date不能为空');
          }
        }
      })
    }
  }

  // 隐藏tab2
  function hideTab2() {
    var temp;
    if(nowTab==='客运站,铁路,机场,港口') {
      temp = $('#tab2');
    }
    if(nowTab==='服务区') {
      temp = $('#tab3');
    }
    if(nowTab==='收费站') {
      temp = $('#tab4');
    }
    if(nowTab==='高速') {
      temp = $('#tab5');
    }
    if(nowTab==='高速路网') {
      // temp = $('#tab3');
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
      $(obj1).css('visibility','hidden');
    }
  }

  /**
   * 主tab点击事件
   */
  function clickTab() {
    for (var j = 0; j < tabBoxes.length; j++) {
      var obj = tabBoxes[j];
      $(obj).removeClass('tab-box-active');
    }
    $(this).addClass('tab-box-active');

    var t = $(this).data('name');
    nowTab = t;
    console.log('切换到:', t);

    pointControl.ReturnDefualt();
    pointControl.showPoints(t);  // 放大点
    markerBindClick();

    if (nowTab === tabArr[0]) {
      addStation();
      positionType = 1;  // 场站type
      $('#top3').show();
      $('#road-net-tips').hide();
      $('#road-net').hide();
    }
    else {
      addStation2();
    }
    if (nowTab === tabArr[1]) {
      positionType = 2;  // 服务区type
      $('#top3').show();
      $('#road-net-tips').hide();
      $('#road-net').hide();
    }
    if (nowTab === tabArr[2]) {

      positionType = 3;  // 收费站type
      $('#top3').show();
      $('#road-net-tips').hide();
      $('#road-net').hide();
    }
    if (nowTab === '高速') {
      positionType = 4;  // 高速路段type

      $('#top3').show();
      $('#road-net-tips').hide();
      $('#road-net').hide();
    }
    if (nowTab === '高速路网') {
      $('#top3').hide();
      $('#road-net-tips').show();
      $('#road-net').show();
      mapbase.setTrafficStyle();
    }
    else {
      mapbase.restoreDefaultStyle();
    }

    // console.log('theDataObject:', pointControl.markes)
    // addStation2()
  }

  function clearStation() {
    var sb3 = $('#station-box-3');
    var sb2 = $('#station-box-2');
    var sb1 = $('#station-box-1');
    var theArr = [sb1,sb2,sb3];
    for (var i = 0; i < theArr.length; i++) {
      var sb = theArr[i];
      // sb.find('header').empty();
      sb.find('ul').empty();
    }
  }

  function showStation() {
    var sb3 = $('#station-box-3');
    var sb2 = $('#station-box-2');
    var sb1 = $('#station-box-1');
    var theArr = [sb1,sb2,sb3];
    for (var i = 0; i < theArr.length; i++) {
      var sb = theArr[i];
      // sb.find('header').empty();
      sb.show()
    }
  }

  /**
   * 显示不同tab的筛选地点
   */
  function addStation2() {

    clearStation();
    showStation();
    var tgt;
    var sb1 = $('#station-box-1');
    var sb2 = $('#station-box-2');
    var sb3 = $('#station-box-3');

    if(nowTab===tabArr[1]) {
      sb1.hide();
      sb3.hide();
      tgt = sb2;
    } else {
      sb1.hide();
      sb2.hide();
      tgt = sb3;
    }

    var markerArr = pointControl.markes;
    for (var i = 0; i < markerArr.length; i++) {
      var m = markerArr[i];

      var stationDom = $('<li>'+ m.C.extData['枢纽名称'] +'</li>');
      stationDom.on('click',function () {
        var name = $(this).text();
        var curPosDataBox = $('#cur-pos-data-box');
        var tabBoxCur = $('#tab-box-cur');
        var arrows = tabBoxCur.find('.arrow');
        tabBoxCur.find('.up').addClass('dn');
        tabBoxCur.find('.down').removeClass('dn');

        curPosDataBox.hide(300);
        isHideStation = true;
        goToPointByName(name);
        // console.log('m',m.C.extData['枢纽名称']);
        changePosText(name);
        // $('#tab-name').text($(this).text());
      });
      tgt.find('header').text(m.C.extData['枢纽类别']);
      tgt.find('ul').append(stationDom);
    }


  }

  /**
   * 点击小的tab2
   * @param target  目标
   * @param me  this
   */
  function clickTab2(target,me) {
    // console.log(target,me);

    // 隐藏
    $('.arrow.up').addClass('dn');
    $('.arrow.down').removeClass('dn');
    isHideStation = true;
    // 组织冒泡
    $(me).find('.li-tab-box').on('click',function (e) {
      e.stopPropagation()
    });
    if(me.dataset.name==='实时监控') {
      jiankongEvent(me)
    }

    if($(me).hasClass('active')) {  // 如果点击的是已经active的tab
      $(me).removeClass('active');
      $(me).find('.li-tab-box').css('visibility','hidden')
      return
    }
    for (var j = 0; j < target.length; j++) {
      var obj = target[j];
      $(obj).removeClass('active');
      $(obj).find('.li-tab-box').css('visibility','hidden')
    }
    $(me).addClass('active');
    $(me).find('.li-tab-box').css('visibility','visible')
    // myChart.resize();


    initTab2(me.dataset.name);
  }

  function initTab2(tab2Name) {
    initCalendar();
    if(nowTab===tabArr[0]&&tab2Name==='实时客流') {  // 交通枢纽
      // 请求客流量数据
      getRealTimeFlowDataT1();

      tab2Li2InitEchart();
      tab2Li2InitEchart2();
      // initCalendar();
    }
    if(nowTab===tabArr[0]&&tab2Name==='旅客洞察') {
      getPassengerData();
      getAreaData($(tabDomNameArr[0]),'省外',returnDate(1))  // 默认省外

      tab2Li3InitEchart1();
      tab2Li3InitEchart2();
      tab2Li3InitEchart3();
      tab2Li3InitEchart4();
    }
    if(nowTab===tabArr[0]&&tab2Name==='旅客趋势') {

      tab2Li4InitEchart();
      tab2Li4InitEchart2();
    }

    if(nowTab===tabArr[1]&&tab2Name==='实时客流') {  // 服务区
      getRealTimeFlowDataT2();
      tab3Li2InitEchart1();
      tab3Li2InitEchart2();
    }
    if(nowTab===tabArr[1]&&tab2Name==='旅客洞察') {
      getAreaData2($(tabDomNameArr[1]),'境外',returnDate())  // 默认省外
      tab3Li3InitEchart();
      tab3Li3InitKLHX2();
      guishufenxiChart();
    }
    if(nowTab===tabArr[1]&&tab2Name==='旅客趋势') {
      tab3Li4InitEchart()
    }

    if(nowTab===tabArr[2]&&tab2Name==='实时客流') {  // 收费站
      getRealTimeFlowDataT3();
      tab4Li2initEchart();
      tab4Li2initEchart2();
      tab4Li2InitEchart3();
    }
    if(nowTab===tabArr[2]&&tab2Name==='旅客洞察') {
      getDayCarFlowT3(returnDate());
      tab4Li3InitEchart1();
      tab4Li3InitEchart2();
    }
    if(nowTab===tabArr[2]&&tab2Name==='旅客趋势') {
      tab4Li4InitEchart1();
      tab4Li4InitEchart2();
    }

    if(nowTab===tabArr[3]&&tab2Name==='实时客流') {  // 高速路段
      getRealTimeFlowDataT4();
      tab5Li2initEchart1();
      tab5Li2initEchart2();
    }
    if(nowTab===tabArr[3]&&tab2Name==='旅客趋势') {
      tab5Li3InitEchart1();
      tab5Li3InitEchart2();
      tab5Li3initEchart3();
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

    console.log('maxLen:',maxLen);
    return maxLen
  }

  var ageObj = {
    0: '6-11岁',
    1: '12-15岁',
    2: '16-18岁',
    3: '19-22岁',
    4: '23-25岁',
    5: '26-35岁',
    6: '36-45岁',
    7: '46-55岁',
    8: '56-65岁',
    9: '66岁以上'
  };


  function jiankongEvent(whichLi) {
    var tgt = $(whichLi);
    // var addBox = $('.add-box');
    // var videoPlayBox2 = $('.video-play-box2');
    // var closeIcon = $('.close-icon');
    console.log(tgt)
    var addBox = tgt.find('.add-box');
    var videoPlayBox2 = tgt.find('.video-play-box2');
    var closeIcon = tgt.find('.close-icon');

    addBox.on('click',function () {
      videoPlayBox2.addClass('db');

    });
    closeIcon.on('click',function () {
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
            f.ondrag((to / max), to,tgt);
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
        ul.css('left',(-1*percent*maxLen)+'px')
      }
    };

    new theScale('tuodong', 'line');
    new theScale('tuodong2', 'line2');
    new theScale('tuodong3', 'line3');
    // console.log('dis:',tuodong.dis)


  }


  /**
   * 获取3级预警数据
   */
  function getYJData() {
    var url = 'terminal/getTerminalWarningList.do';
    var data = {

    };
    $.axpost(url,data,function (data) {
      // console.log(data);

      if(data && data.isSuccess) {
        var yongji = $('#yongji');
        var shizhong = $('#shizhong');
        var shushi = $('#shushi');
        var ss = {
          name: '舒适',
          dom: shushi,
          icon: 'top3-icon3',
          data: data.data.listTerminal_ss
        };
        var sz = {
          name: '适中',
          dom: shizhong,
          icon: 'top3-icon2',
          data: data.data.listTerminal_sz
        };
        var yj = {
          name: '拥挤',
          dom: yongji,
          icon: 'top3-icon1',
          data: data.data.listTerminal_yj
        };

        var dataArr = [ss,sz,yj];
        for (var i = 0; i < dataArr.length; i++) {
          var item = dataArr[i];
          // debugger
          for (var j = 0; j < item.data.length; j++) {
            var temp = item.data[j];
            var num;
            if(temp.userCnt>=10000) {
              num = temp.userCnt.toString();
              num = num.slice(0, num.length - 4);
              temp.userCnt = parseInt(num);
            }
          }

          addYjLi(item)
        }

      }
    });

    function addYjLi(item) {
      var index = 0;
      for (var i = 0; i < item.data.length; i++) {
        var liData = item.data[i];
        index++;
        var liDom = '<li class="top3-li" title="'+ liData.postionName +'">\n' +
          '<i class="'+ item.icon +'">'+ index +'</i>\n' +
          '<p><label class="p-name ellipsis">' + liData.postionName + '</label> <span>当前客流 <i class="num">'+liData.userCnt +'</i>万人</span></p>\n' +
          '</li>';
        var temp = $(liDom);

        temp.on('click',function () {
          // debugger
          var name = $(this).find('.p-name').text();
          goToPointByName(name);
          changePosText(name);
          hideTabs(name);
          pointControl.hideMarkers();
        });
        item.dom.append(temp)
      }

      item.dom.parent().find('.yj-num').text(item.data.length+'处');
    }
  }

  // 清空位置图片
  function initCenterBG() {
    var imgBox = $('#center-img');
    imgBox.empty();
    for (var i = 0; i < 2; i++) {
      var newImage = new Image();
      newImage.src = 'yjzx/img/menu/icon_lower_center.png';
      imgBox.append(newImage)

    }
  }

  /**
   * 改变当前位置文字
   * @param posName 地名 String
   */
  function changePosText(posName) {
    console.log(posName);
    
    initCenterBG();
    if(posName.length>4) {
      var imgBox = $('#center-img');
      var temp = posName.length - 4;
      var img = imgBox.find('img')[0];
      for (var j = 0; j < temp; j++) {
        var newImage = new Image();
        newImage.src = img.src;
        // console.log('temp:',temp)
        imgBox.append(newImage)
      }
    }
    // debugger
    $('#tab-name').text(posName);
  }

  // 隐藏tab,显示tab2
  function hideTabs(name) {
    var tab = $('#tab');
    var tabBox = tab.find('.tab-box');
    var noActive;
    // console.log(tab)
    pointControl.hideMarkers();
    curPosition = name;
    // console.log(curPosition);
    
    changePosText(curPosition);

    // tab移动
    for (var i = 0; i < tabBox.length; i++) {
      var tabLi = $(tabBox[i]);
      tabLi.css('top','-102px');
      noActive = tabLi.attr('class').indexOf('tab-box-active') == '-1';

      if(noActive) {
        tabLi.css('z-index','-1')
        tabLi.addClass('vh')
      } else {
        tabLi.css('z-index','10')
      }
    }
    showCurLocaction();

    var tabBoxCur = $('#tab-box-cur');
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
    var url = 'terminal/selectTerminalFlowRealtime.do?'+'postionType='+positionType+'&postionName='+curPosition;
    var url2 = 'terminal/selectTerminalIn.do?'+'postionType='+positionType+'&postionName='+curPosition;
    var url3 = 'terminal/selectTerminalOut.do?'+'postionType='+positionType+'&postionName='+curPosition;
    var url4 = 'terminal/selectTerminalHourAdd.do?'+'postionType='+positionType+'&postionName='+curPosition;

    var data = {

    };
    $.axpost(url,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab2 .sskl-num').html(toMoney(data.data.userCnt))
      }
    });
    $.axpost(url2,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab2 .sskl-in').html(toWan(data.data.userIn))
      }
    });
    $.axpost(url3,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab2 .sskl-out').html(toWan(data.data.userOut));
      }
    });
    $.axpost(url4,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab2 .sskl-hour-add').html(toWan(data.data.userPerhourAdd));
      }
    });

  }

  /**
   * 交通枢纽-旅客洞察 获取当天旅客量
   */
  function getPassengerData(date) {
    var d;
    d = date?date:'';
    var url = 'terminal/selectTerminalPassenger.do?'+'postionType='+positionType+'&postionName='+curPosition+'&countDate='+d;

    $.axpost(url,{},function (data) {

      if(data.data&&data.isSuccess) {
        // console.log('getPassengerData:',data);

        $('#tab2 .scroll-box .total-psg').text(data.data[0].travelers);
        $('#tab2 .scroll-box .arrival-psg').text(data.data[0].arrivalValue);
        $('#tab2 .scroll-box .leave-psg').text(data.data[0].leaveValue);
      }
    });
  }

  /**
   * 服务区-实时客流 获取实时客流量
   */
  function getRealTimeFlowDataT2() {
    var url = 'serviceArea/selectServiceFlowRealtime.do?'+'postionType='+positionType+'&postionName='+curPosition.split('-')[0];
    var url2 = 'serviceArea/selectServiceIn.do?'+'postionType='+positionType+'&postionName='+curPosition.split('-')[0];
    var url3 = 'serviceArea/selectServiceOut.do?'+'postionType='+positionType+'&postionName='+curPosition.split('-')[0];
    var url4 = 'serviceArea/selectServiceHourAdd.do?'+'postionType='+positionType+'&postionName='+curPosition.split('-')[0];

    var data = {

    };
    $.axpost(url,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab3 .sskl-num').text(toMoney(data.data.userCnt))
      }
    });
    $.axpost(url2,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab3 .sskl-in').html(toWan(data.data.userIn))
      }
    });
    $.axpost(url3,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab3 .sskl-out').html(toWan(data.data.userOut))
      }
    });
    $.axpost(url4,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab3 .sskl-hour-add').html(toWan(data.data.userPerhourAdd))
      }
    });

  }

  /**
   * 收费站-实时客流
   */
  function getRealTimeFlowDataT3() {
    var url = 'toll/selectTollFlowRealtime.do?'+'postionType='+positionType+'&postionName='+curPosition;
    var url2 = 'toll/selectTollIn.do?'+'postionType='+positionType+'&postionName='+curPosition;
    var url3 = 'toll/selectTollOut.do?'+'postionType='+positionType+'&postionName='+curPosition;

    var data = {

    };
    $.axpost(url,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab4 .sskl-num').html(toWan(data.data.pepValue))
      }
    });
    $.axpost(url2,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab4 .sskl-in').html(toWan(data.data.carIn))
      }
    });
    $.axpost(url3,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab4 .sskl-out').html(toWan(data.data.carOut))
      }
    });

  }

  /**
   * 收费站-旅客洞察
   */
  function getDayCarFlowT3(date) {
    var url = 'toll/selectTollDayFlow.do?'+'postionType='+positionType+'&postionName='+curPosition + '&countDate=' + date;
    var data = {

    };
    $.axpost(url,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab4 .qtkl-num').html(toWan(data.data[0].allPeople));
        $('#tab4 .qtcl-in').html(toWan(data.data[0].inValue));
        $('#tab4 .qtcl-out').html(toWan(data.data[0].outValue))
      }
    });

  }

  /**
   * 高速路段-查询高速路段实时客流量
   */
  function getRealTimeFlowDataT4() {
    // var str = '虎门大桥';
    var url = 'highSpeed/selectGsFlowRealtime.do?'+'postionType='+positionType+'&postionName='+curPosition;
    var url2 = 'highSpeed/selectGsIn.do?'+'postionType='+positionType+'&postionName='+curPosition;
    var url3 = 'highSpeed/selectGsOut.do?'+'postionType='+positionType+'&postionName='+curPosition;

    var data = {

    };
    $.axpost(url,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab5 .sskl-num').html(toWan(data.data.peopleNum))
      }
    });
    $.axpost(url2,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab5 .sskl-in').html(toWan(data.data.carNum))
      }
    });
    $.axpost(url3,data,function (data) {
      if(data.data&&data.isSuccess) {
        // console.log(data);
        $('#tab5 .sskl-out').html(toWan(data.data.carNum))
      }
    });

  }

  /**
   * 显示小的tab
   */
  function showWhichTab() {
    // 交通枢纽
    if(nowTab===tabArr[0]) {
      $('#tab2').removeClass('vh');
    }
    // 服务区
    if(nowTab===tabArr[1]) {
      $('#tab3').removeClass('vh');

    }
    // 收费站
    if(nowTab===tabArr[2]) {
      $('#tab4').removeClass('vh');

    }
    // 高速路网
    if(nowTab===tabArr[3]) {
      $('#tab5').removeClass('vh');

    }
    if(nowTab===tabArr[4]) {
      // $('#tab2').removeClass('vh');
    }

  }

  // 显示tab
  function showTabs() {
    var dis = 102;
    var tab = $('#tab');
    var tabBox = tab.find('.tab-box');
    for (var i = 0; i < tabBox.length; i++) {
      var tabLi = $(tabBox[i]);
      tabLi.css('z-index','1')
      tabLi.removeClass('vh')
      tabLi.css('top',(dis*i)+'px')
    }
  }

  /**
   * 点击箭头
   * @param tabName 当前大tab
   * @param arrows  箭头数组
   */
  function clickArrow(tabName,arrows) {
    if(isHideStation) {
      isHideStation = false;
      // debugger
      $('#cur-pos-data-box').show(300)
    } else {
      $('#cur-pos-data-box').hide(300)
      isHideStation = true;

    }
    for (var j = 0; j < arrows.length; j++) {
      var a2 = arrows[j];
      $(a2).toggleClass('dn')
    }
    var n = newTabArr[tabName];

    var tabBox2LiArr = $(n).find('.tab-box2-li');
    // var tabBox2LiArr = $('.tab-box2 .tab-box2-li');

    // 左边tab去除active
    for (var i = 0; i < tabBox2LiArr.length; i++) {
      var t = tabBox2LiArr[i];
      $(t).removeClass('active');
      $(t).find('.li-tab-box').css('visibility','hidden')
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
    curPosDataBox.on('click',function (e) {
      // console.log('e',e);
      e.stopPropagation()
    });

    tabBoxCur.on('click',function () {
      clickArrow(nowTab,arrows)

    })
  }

  function search() {

  }

  function handleChange(v) {
    console.log('onchang:',v);

  }

  /**
   * 请求省内省外境外来源去向洞察数据
   * @param dom   当前所在主tab
   * @param area  区域:省内 省外 境外
   * @param date  日期:yyyy-mm-dd
   */
  function getAreaData(dom,area,date) {

    var d = date?date:returnDate(1);
    var url = 'terminal/selectTerminalOriginAndLeaveTop.do?postionType='+positionType+'&postionName='+curPosition+'&area='+area+'&countDate='+d;
    $.axpost(url,{},function (data) {
      dom.find('.from-chart ul.body').empty();
      dom.find('.to-chart ul.body').empty();
      var oriArr,toArr;
      if(area==='省外') {
        oriArr = _.sortBy(data.data.listOutProvinceOrigin, function(item) {
          return -item.travelerValue;
        });
        toArr = _.sortBy(data.data.listOutProvinceLeave, function(item) {
          return -item.travelerValue;
        });
      }
      if(area==='省内') {
        oriArr = _.sortBy(data.data.listInProvinceOrigin, function(item) {
          return -item.travelerValue;
        });
        toArr = _.sortBy(data.data.listInProvinceLeave, function(item) {
          return -item.travelerValue;
        });
      }
      if(area==='境外') {
        oriArr = _.sortBy(data.data.listForgeinOrigin, function(item) {
          return -item.travelerValue;
        });
        toArr = _.sortBy(data.data.listForgeinLeave, function(item) {
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
          '<i class="index">'+ num +'</i>\n' +
          '<label>'+ obj.originAreaName +'</label>\n' +
          '<i class="line"></i>\n' +
          '<span class="num">' + val +'人</span>\n' +
          '</li>';
        var li = $(str);
        dom.find('.from-chart ul.body').append(li)
      }

      var num2 = 0;
      for (var j = 0; j < toArr.length; j++) {
        var obj2 = toArr[j];
        num2++;
        var str2 = '<li>\n' +
          '<i class="index">'+ num2 +'</i>\n' +
          '<label>'+ obj2.toAreaName +'</label>\n' +
          '<i class="line"></i>\n' +
          '<span class="num">' + obj2.travelerValue +'人</span>\n' +
          '</li>';
        var li2 = $(str2);
        dom.find('.to-chart ul.body').append(li2)
      }
    })
  }

  function getAreaData2(dom, area, date) {
    var d = date?date:returnDate();  // todo 默认昨天
    var url = 'serviceArea/selectServiceAscriptionTop.do?postionType='+positionType+'&postionName='+curPosition.split('-')[0]+'&area='+area+'&countDate='+d;
    $.axpost(url,{},function (data) {
      dom.find('.from-chart ul.body').empty();
      var theName,theKey,theDom,theArr,num=0;
      if(area==='省外') {
        theKey = 'listServiceProvince';
        theName = 'provinceName'
      }
      if(area==='省内') {
        theKey = 'listServiceInProvince';
        theName = 'cityName';
      }
      if(area==='境外') {
        theKey = 'listServiceForgein';
        theName = 'foreignName';
      }
      // console.log('theKey:',theKey);
      for (var j = 0; j < data.data[theKey].length; j++) {
        var obj1 = data.data[theKey][j];
        theArr = _.sortBy(data.data[theKey], function(item) {
          return -item.travelerValue;
        });
      }

      for (var i = 0; i < theArr.length; i++) {
        num++;
        var obj = theArr[i];
        var liStr = '<li>\n' +
          '<i class="index">'+num+'</i>\n' +
          '<label title="'+obj[theName]+'">'+obj[theName]+'</label>\n' +
          '<i class="line2"></i>\n' +
          '<span class="num" title="'+obj.travelerValue+'">'+obj.travelerValue+'人</span>\n' +
          '</li>';
        theDom = $(liStr);
        dom.find('.from-chart ul.body').append(theDom)

      }
    })
  }

  /**
   * 旅客洞察点击
   */
  function dongchaTabBindClick() {
    // 枢纽 洞察点击i
    var dongchaTabs = $('#tab2 .dongcha-tab');
    var area;
    var dom;
    for (var i = 0; i < dongchaTabs.length; i++) {
      var t = dongchaTabs[i];
      $(t).on('click',function () {
        for (var j = 0; j < dongchaTabs.length; j++) {
          var t = dongchaTabs[j];
          $(t).removeClass('active')
        }
        $(this).addClass('active');
        area = $(this).text().trim();
        dom = $('#tab2');
        // console.log('area:',area);
        getAreaData(dom,area)

      })
    }

    // 服务区 洞察点击i
    var dongchaTabs2 = $('#tab3 .dongcha-tab');
    for (var k = 0; k < dongchaTabs2.length; k++) {
      var t2 = dongchaTabs2[k];
      $(t2).on('click',function () {
        for (var j = 0; j < dongchaTabs2.length; j++) {
          var t2 = dongchaTabs2[j];
          $(t2).removeClass('active')
        }
        $(this).addClass('active');
        area = this.dataset.name;
        dom = $('#tab3');
        // debugger
        getAreaData2(dom,area)
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
    tabBoxCur.addClass('moveAndShow');
    tabBoxCur.removeClass('moveAndHide')
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
    tabBoxCur.removeClass('moveAndShow');
    tabBoxCur.addClass('moveAndHide');
    // tabBoxCur.addClass('dn');
    // tabBoxCur.find('.arrow.up').removeClass('dn');
    // tabBoxCur.find('.arrow.down').addClass('dn');
    curPosDataBox.hide(300);
    isHideStation = true;
  }

  // 地图点绑定点击事件
  function markerBindClick() {
    for (var k = 0; k < pointControl.markes.length; k++) {
      var m = pointControl.markes[k];
      // console.log(m.C.position) 点的经纬度
      // console.log(m.C.extData['枢纽名称'])
      // debugger
      m.on('click',function () {
        // console.log(this.C.extData['枢纽名称']);

        hideTabs(this.C.extData['枢纽名称'])
      })
    }
  }

  // 交通枢纽图表
  // 枢纽 实时客流
  var tab2Li2Echart1;
  function tab2Li2InitEchart() {
    var SSKL = $('#SSKL');
    if(!tab2Li2Echart1) {
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
      tooltip: {
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
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
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数/万',
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
              show: true
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
                  offset: 0, color: '#183d74' // 0% 处的颜色
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
        },
        // {
        //   name: '预测',
        //   type: 'line',
        //   smooth: true,
        //   symbol: 'none',
        //   stack: 'a',
        //   // areaStyle: {
        //   //   normal: {
        //   //   }
        //   // },
        //   lineStyle: {
        //     type: 'dotted'
        //   },
        //   data: data2
        // }
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
    var url = 'terminal/selectTerminalFlowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+date;
    $.axpost(url,{},function (data) {
      console.log('tab2Li2InitEchart',data);
      var d = [];
      // d = data.data;
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];

        d.push(obj.userCnt);
      }
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
    })
  }

  var tab2Li2Echart2;
  function tab2Li2InitEchart2() {
    var dom = $('#ZLSC1');
    if(!tab2Li2Echart2) {
      tab2Li2Echart2 = echarts.init(dom[0]);
    }
    option = null;
    var date = ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-24'];

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
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
      yAxis:  {
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
            color: 'rgb(133,168,184)'
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
            color: 'rgb(133,168,184)'
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
            color: 'rgb(70,158,228)'
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

    tab2Li2Echart2reqData(returnDate());

    if (option && typeof option === "object") {
      tab2Li2Echart2.setOption(option, true);
    }
  }

  function tab2Li2Echart2reqData(date) {
    tab2Li2Echart2.showLoading();    //加载动画
    var url = 'terminal/selectTerminalFlowLinger.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+date;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li2Echart2',data);
      var d = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        // d.push(obj.timeZb);
        d[parseInt(obj.timeGroup)] = obj.timeZb;
      }
      // debugger

      tab2Li2Echart2.hideLoading();    //隐藏加载动画

      tab2Li2Echart2.setOption({
        series: [
          {
            name: '占比',
            data: d
          }
        ]
      })
    })

  }

  // 枢纽 旅客趋势
  var tab2Li4Echart;
  function tab2Li4InitEchart() {
    var dom = $('#KLQS');
    if(!tab2Li4Echart) {
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
            color: 'rgb(133,168,184)'
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
        name: '人数/万',
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
              show: true
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
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);

    }
    tab2Li4Echart.showLoading();    //加载动画
    var url = 'terminal/selectTerminalPassengerTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li4Echart',data);
      var dayArr = [];
      var dataArr = [];
      for (var i = 0; i < data.data.listTerminalPassengerTrend.length; i++) {
        var obj = data.data.listTerminalPassengerTrend[i];
        dayArr.push(obj.statDate);
        dataArr.push(obj.travelers);
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
    })
  }

  var tab2Li4Echart2;
  function tab2Li4InitEchart2() {
    var dom = $('#LKQS');
    if(!tab2Li4Echart2) {
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
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
      yAxis:  {
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
            color: 'rgb(133,168,184)'
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
            color: 'rgb(133,168,184)'
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
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab2Li4Echart2.showLoading();    //加载动画
    var url = 'terminal/selectTerminalPassengerTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
    $.axpost(url,{},function (data) {
      console.log('tab2Li4Echart2',data);
      var dayArr = [];
      var ariArr = [];
      var leaArr = [];
      for (var i = 0; i < data.data.listTerminalPassengerTrend.length; i++) {
        var obj = data.data.listTerminalPassengerTrend[i];
        dayArr.push(obj.statDate);
        ariArr.push(obj.arrivalValue);
        leaArr.push(obj.leaveValue);
      }
      // debugger

      tab2Li4Echart2.hideLoading();    //隐藏加载动画

      tab2Li4Echart2.setOption({
        legend: {
          data: ['出发旅客量','到达旅客量']
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
    })
  }

  // 枢纽 旅客洞察
  var tab2Li3Echart1;
  function tab2Li3InitEchart1() {
    var dom = $('#ZLSC');
    if(!tab2Li3Echart1) {
      tab2Li3Echart1 = echarts.init(dom[0]);
    }
    option = null;
    var date = ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-24'];

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
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
      yAxis:  {
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
            color: 'rgb(133,168,184)'
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
            color: 'rgb(133,168,184)'
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
            color: 'rgb(70,158,228)'
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

    tab2Li3Echart1reqData();

    if (option && typeof option === "object") {
      tab2Li3Echart1.setOption(option, true);
    }
  }

  function tab2Li3Echart1reqData(date) {
    tab2Li3Echart1.showLoading();    //加载动画
    var d;
    d = date?date:returnDate(1);
    var url = 'terminal/selectTerminalLinger.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li3Echart1',data);
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        // debugger
        dataArr[parseInt(obj.timeGroup)] = obj.timeValue;
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
    })
  }

  var tab2Li3Echart2;
  function tab2Li3InitEchart2() {
    var dom = document.getElementById("KLHX");
    if(!tab2Li3Echart2) {
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
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          animation: false,
          itemStyle: {
            color:'rgb(104,228,255)',
            borderColor:'#0a214b',
            borderWidth:15
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
              fontSize:  20,

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

    tab2Li3Echart2ReqData();

    if (option && typeof option === "object") {
      tab2Li3Echart2.setOption(option, true);
    }
  }

  function tab2Li3Echart2ReqData(date) {
    tab2Li3Echart2.showLoading();    //加载动画
    var d;
    d = date?date:returnDate(1);
    var url = 'terminal/selectTerminalSexAge.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li3Echart2',data);
      var dataArr = [];
      for (var i = 0; i < data.data.terminalAgeList.length; i++) {
        var obj = data.data.terminalAgeList[i];
        // debugger
        dataArr.push({
          name: ageObj[obj.ageGroup],
          value: obj.ageZb
        })
      }
      // console.log('dataArr:',dataArr);

      tab2Li3Echart2.hideLoading();    //隐藏加载动画
      tab2Li3Echart2.setOption({
        series: [
          {
            name: '人数',
            data: dataArr
          }
        ]
      })


      var dom = $("#KLHX").parent();
      for (var j = 0; j < data.data.terminalSexList.length; j++) {
        var obj1 = data.data.terminalSexList[j];
        if(obj1.sex===1) {
          dom.find('.hm.man span').text(obj1.manZb+'%')
        } else {
          dom.find('.hm.woman span').text(obj1.manZb+'%')
        }
      }

    })
  }

  var tab2Li3Echart3;
  function tab2Li3InitEchart3() {
    var dom = document.getElementById("laiyuan");
    if(!tab2Li3Echart3) {
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
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
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
            // {value: 335, name: '境外',itemStyle: {color:colors[0]}},
            // {value: 310, name: '省内',itemStyle: {color:colors[1]}},
            // {value: 234, name: '省外',itemStyle: {color:colors[2]}}
          ]
        }
      ]
    };

    tab2Li3Echart3ReqData();

    if (option && typeof option === "object") {
      tab2Li3Echart3.setOption(option, true);
    }

  }

  function tab2Li3Echart3ReqData(date) {
    var colors = ['rgb(252,162,34)','rgb(152,113,253)','rgb(38,229,225)'];
    tab2Li3Echart3.showLoading();    //加载动画
    var d;
    d = date?date:returnDate(1);
    var url = 'terminal/selectTerminalOriginAndLeave.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li3Echart3', data);
      var tempArr = [];
      var dataArr = [];
      var name;
      for(var key in data.data.originMap) {
        tempArr.push({
          type: key,
          value: data.data.originMap[key]
        })
      }
      for (var i = 0; i < tempArr.length; i++) {
        var obj = tempArr[i];
        if(obj.type==='inProvinceOrigin') {
          name = '省内'
        }
        if(obj.type==='outProvinceOrigin') {
          name = '省外'
        }
        if(obj.type==='forgeinOrigin') {
          name = '境外'
        }
        dataArr.push({
          name: name,
          value: obj.value.travelerZb,
          itemStyle: {
            color: colors[i]
          }
        })
      }
      // console.log('tempArr:', dataArr,tempArr);

      tab2Li3Echart3.hideLoading();    //隐藏加载动画
      tab2Li3Echart3.setOption({
        series: [
          {
            name: '来源洞察',
            data: dataArr
          }
        ],
        legend: {
          data: ['境外', '省内', '省外']
        }
      })
    })
  }

  var tab2Li3Echart4;
  function tab2Li3InitEchart4() {
    var dom = document.getElementById("quxiang");
    if(!tab2Li3Echart4) {
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
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
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
            // {value: 335, name: '境外',itemStyle: {color:colors[0]}},
            // {value: 310, name: '省内',itemStyle: {color:colors[1]}},
            // {value: 234, name: '省外',itemStyle: {color:colors[2]}}

          ]
        }
      ]
    };

    tab2Li3Echart4ReqData();

    if (option && typeof option === "object") {
      tab2Li3Echart4.setOption(option, true);
    }

  }

  function tab2Li3Echart4ReqData(date) {
    var colors = ['rgb(252,162,34)','rgb(152,113,253)','rgb(38,229,225)'];
    tab2Li3Echart4.showLoading();    //加载动画
    var d;
    d = date?date:returnDate(1);
    var url = 'terminal/selectTerminalOriginAndLeave.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li3Echart4', data);
      var tempArr = [];
      var dataArr = [];
      var name;
      for(var key in data.data.leaveMap) {
        tempArr.push({
          type: key,
          value: data.data.leaveMap[key]
        })
      }
      for (var i = 0; i < tempArr.length; i++) {
        var obj = tempArr[i];
        if(obj.type==='inProvinceLeave') {
          name = '省内'
        }
        if(obj.type==='outProvinceLeave') {
          name = '省外'
        }
        if(obj.type==='forgeinLeave') {
          name = '境外'
        }
        dataArr.push({
          name: name,
          value: obj.value.travelerZb,
          itemStyle: {
            color: colors[i]
          }
        })
      }
      // console.log('tempArr:', dataArr,tempArr);

      tab2Li3Echart4.hideLoading();    //隐藏加载动画
      tab2Li3Echart4.setOption({
        legend: {
          data: ['境外', '省内', '省外']
        },
        series: [
          {
            name: '去向洞察',
            data: dataArr
          }
        ]
      })
    })
  }

  // 服务区图表
  var tab3Li2Echart2;
  function tab3Li2InitEchart2() {
    var dom = document.getElementById("tab3li2-chart1");
    if(!tab3Li2Echart2) {
      tab3Li2Echart2 = echarts.init(dom);
    }
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
      xAxis: {
        type: 'category',
        data: hourArr,
        name: '小时',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '占比',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
        // 分割线
        splitLine: {
          show: false
        }
      },
      series: [
        {name: '占比',
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
          color: 'rgb(70,158,228)'
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
    var d = date?date:returnDate();
    tab3Li2Echart2.showLoading();    //加载动画
    var url = 'serviceArea/selectServiceLingerRealtime.do?postionType='+ positionType +'&postionName='+ curPosition.split('-')[0] +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab3Li2Echart2',data);
      var d = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        // d.push(obj.timeZb);
        d[parseInt(obj.timeGroup)] = obj.timeZb;
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
    })

  }

  var tab3Li2Echart1;
  function tab3Li2InitEchart1() {
    if(!tab3Li2Echart1) {
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
      tooltip: {
        trigger: 'axis',
        //show:true,
        axisPointer: {
          type: 'line',
          show: true,
          label: {
            show: true
          }
        },
        backgroundColor: 'transparent',
        formatter: function (params) {
          return params[params.length - 1].data;
        }
      },

      legend: {
        show:false,
        textStyle: {
          color: '#557398',
        },
        data: []
      },
      /* visualMap:{
           show:false,
           seriesIndex:1,
       },*/
      /*legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },*/
      /* grid: {
           left: '3%',
           right: '4%',
           bottom: '3%',
           containLabel: true
       },*/
      grid: {
        left: '5%',
        right: '10%',
        top: '15%',
        bottom: '5%',
        // width: 1194,
        // height: 236,
        containLabel: true
      },
      /*toolbox: {
          feature: {
              saveAsImage: {}
          }
      },*/
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '(时点)',
        axisLine: {
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
        data: date
      },
      yAxis: {
        type: 'value',
        name: '(人数/万)',
        splitLine: {show: false},
        axisLine: {
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },

      },
      series: [

        {
          name: '实时客流量',
          type: 'line',
          z: 2,
          //stack: '总量',
          smooth: true,
          data: [],
          lineStyle: {
            normal: {
              color: 'rgb(70,158,228)'//rgba(55,255,75
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
        // {
        //   name: '预测客流量',
        //   symbol: 'none',
        //   z: 3,
        //   type: 'line',
        //   itemStyle: {
        //     normal: {
        //       lineStyle: {
        //         width: 2,
        //         color: 'rgb(70,158,228)',
        //         type: 'dotted'  //'dotted'虚线 'solid'实线
        //       }
        //     }
        //   },
        //   smooth: true,
        //   //stack: '总量',
        //   data: [820, 932, 901, 934, 1290, 1330, 1320]
        // },


      ]
    };
    tab3Li2Echart1reqData();

    tab3Li2Echart1.setOption(option);
  }

  function tab3Li2Echart1reqData(date) {
    var d = date?date:returnDate();
    $('#tab3-cld1-box').hide();
    tab3Li2Echart1.showLoading();    //加载动画
    var url = 'serviceArea/selectServiceFlowTrend.do?postionType='+ positionType +'&postionName='+ curPosition.split('-')[0] +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li2InitEchart',data);
      var dataArr = [];
      // d = data.data;
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        dataArr.push(obj.userCnt);
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
    })
  }

  var tab3Li3Echart2;
  function tab3Li3InitKLHX2() {
    var dom = document.getElementById("KLHX2");
    if(!tab3Li3Echart2) {
      tab3Li3Echart2 = echarts.init(dom);
    }
    // console.log(echarts.version)
    var app = {};
    option = null;
    app.title = '环形图';

    // option = {
    //   title: {
    //     text: '客流画像',
    //     textStyle: {
    //       color: 'rgb(221,243,255)',
    //       fontSize: 18,
    //       fontFamily: 'Microsoft YaHei',
    //       // fontWeight:400
    //     }
    //   },
    //   // tooltip: {
    //   //   trigger: 'item',
    //   //   formatter: "{a} <br/>{b}: {c} ({d}%)"
    //   // },
    //   // legend: {
    //   //   orient: 'vertical',
    //   //   x: 'left',
    //   //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    //   // },
    //   series: [
    //     {
    //       name: '客流画像',
    //       type: 'pie',
    //       radius: ['50%', '70%'],
    //       avoidLabelOverlap: false,
    //       animation: false,
    //       itemStyle: {
    //         color:'rgb(104,228,255)',
    //         borderColor:'#0a214b',
    //         borderWidth:10
    //       },
    //       label: {
    //         // normal: {
    //         //   show: true,
    //         //   position: 'center'
    //         // },
    //         silent: true,
    //         normal: {
    //           // \n\n可让文字居于牵引线上方，很关键
    //           //  {b}  代表显示的内容标题
    //           // {c}代表数据
    //           formatter: '{b}\n{c}%',
    //           fontSize:  20,
    //
    //           // textAlign: 'left',//'left'、 'center'、 'right'，
    //           // textVerticalAlign: 'bottom',//文字垂直对齐方式，可取值：'top'、 'middle'、 'bottom'，默认根据 textPosition 计算。
    //           //rich: {
    //           //    b: {
    //           //        font: '16px Microsoft YaHei',
    //           //        textFill: 'rgb(104,228,225)'
    //           //    },
    //           //    c: {
    //           //        font: '24px Microsoft YaHei',
    //           //        textFill: 'white'
    //           //    }
    //           //},
    //           borderWidth: 20,
    //           borderRadius: 4,
    //           padding: [0, -10],
    //           rich: {
    //             // b: {
    //             //   color: 'green',
    //             //   fontSize: 12,
    //             //   lineHeight: 20
    //             // },
    //             c: {
    //               fontSize: 26,
    //               lineHeight: 20,
    //               color: 'white'
    //             }
    //           }
    //         },
    //
    //         emphasis: {
    //           show: false,
    //           textStyle: {
    //             fontSize: '30',
    //             fontWeight: 'bold'
    //           }
    //         }
    //       },
    //       labelLine: {
    //         normal: {
    //           show: false
    //         }
    //       },
    //       data: []
    //     }
    //   ]
    // };
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
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          animation: false,
          itemStyle: {
            color:'rgb(104,228,255)',
            borderColor:'#0a214b',
            borderWidth:15
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
              fontSize:  20,

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

    tab3Li3Echart2ReqData();
    if (option && typeof option === "object") {
      tab3Li3Echart2.setOption(option, true);
    }
  }

  function tab3Li3Echart2ReqData(date) {
    tab3Li3Echart2.showLoading();    //加载动画
    var d;
    d = date?date:returnDate();
    var url = 'serviceArea/selectServiceSexAge.do?postionType='+ positionType +'&postionName='+ curPosition.split('-')[0] +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab3Li3Echart2',data);
      var dataArr = [];
      for (var i = 0; i < data.data.serviceAgeList.length; i++) {
        var obj = data.data.serviceAgeList[i];
        // debugger
        dataArr.push({
          name: ageObj[obj.ageGroup],
          value: obj.ageZb
        })
      }
      // console.log('dataArr:',dataArr);

      tab3Li3Echart2.hideLoading();    //隐藏加载动画
      tab3Li3Echart2.setOption({
        series: [
          {
            name: '客流画像',
            data: dataArr
          }
        ]
      })
      var dom = $("#KLHX2").parent();
      for (var j = 0; j < data.data.serviceSexList.length; j++) {
        var obj1 = data.data.serviceSexList[j];
        if(obj1.sex===1) {
          dom.find('.hm.man span').text(obj1.manZb+'%')
        } else {
          dom.find('.hm.woman span').text(obj1.manZb+'%')
        }
      }

    })
  }

  var tab3Li3Echart1;
  function tab3Li3InitEchart() {
    var dom = document.getElementById("tab3li3-chart1");
    if(!tab3Li3Echart1) {
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
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: hourArr,
        name: '小时',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '人数/万',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
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
          color: 'rgb(70,158,228)'
        },
        barWidth: '50%',
      }]
    };
    tab3Li3Echart1reqData();
    if (option && typeof option === "object") {
      tab3Li3Echart1.setOption(option, true);
    }
  }

  function tab3Li3Echart1reqData(date) {
    tab3Li3Echart1.showLoading();    //加载动画
    var d;
    d = date?date:returnDate();
    var url = 'serviceArea/selectServiceLinger.do?postionType='+ positionType +'&postionName='+ curPosition.split('-')[0] +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab3Li3Echart1',data);
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        // debugger
        dataArr[parseInt(obj.timeGroup)] = obj.timeValue;
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
    })
  }

  var tab3Li4Echart1;
  function tab3Li4InitEchart() {
    var dom = $('#tab3li4-chart1');
    if(!tab3Li4Echart1) {
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
            color: 'rgb(133,168,184)'
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
        name: '人数/万',
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
              show: true
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
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab3Li4Echart1.showLoading();    //加载动画
    var url = 'serviceArea/selectServicePassengerTrend.do?postionType='+ positionType +'&postionName='+ curPosition.split('-')[0] +'&startDate='+d.start + '&endDate='+d.end;
    $.axpost(url,{},function (data) {
      // console.log('tab3Li4Echart1',data);
      var dayArr = [];
      var dataArr = [];
      for (var i = 0; i < data.data.listServiceFlowTrend.length; i++) {
        var obj = data.data.listServiceFlowTrend[i];
        dayArr.push(obj.statDate);
        dataArr.push(obj.userCnt);
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
    })
  }

  var guishufenxi;
  function guishufenxiChart() {
    var dom = document.getElementById("guishufenxi");
    if(!guishufenxi) {
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
          name: '归属分析',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
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
            // {value: 335, name: '境外',itemStyle: {color:colors[0]}},
            // {value: 310, name: '省内',itemStyle: {color:colors[1]}},
            // {value: 234, name: '省外',itemStyle: {color:colors[2]}}
          ]
        }
      ]
    };
    guishufenxiReqData();
    if (option && typeof option === "object") {
      guishufenxi.setOption(option, true);
    }
  }

  function guishufenxiReqData(date) {
    var colors = ['rgb(252,162,34)','rgb(152,113,253)','rgb(38,229,225)'];
    guishufenxi.showLoading();    //加载动画
    var d;
    d = date?date:returnDate();  // todo 默认访问昨天
    var url = 'serviceArea/selectServiceAscription.do?postionType='+ positionType +'&postionName='+ curPosition.split('-')[0] +'&countDate='+d;
    $.axpost(url,{},function (data) {
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        dataArr.push({
          name: obj.categoryName,
          value: obj.travelerValue,
          itemStyle: {
            color: colors[i]
          }
        })
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
    })
  }

  // 收费站图表
  var tab4Li2Echart1;
  function tab4Li2initEchart() {
    var dom = $('#tab4-zlsc');
    if(!tab4Li2Echart1) {
      tab4Li2Echart1 = echarts.init(dom[0]);
    }

    var option = {
      title: {
        text: '实时驻留时长分析',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei'
        }
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
      yAxis:  {
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
            color: 'rgb(133,168,184)'
          }
        },
      },
      xAxis: {
        type: 'category',
        data: hourArr,
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
            color: 'rgb(133,168,184)'
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
            color: 'rgb(70,158,228)'
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

    tab4Li2Echart1reqData();

    if (option && typeof option === "object") {
      tab4Li2Echart1.setOption(option, true);
    }
  }

  function tab4Li2Echart1reqData(date) {
    var d = date?date:returnDate();
    tab4Li2Echart1.showLoading();    //加载动画
    var url = 'toll/selectTollLingerRealtime.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab4Li2Echart1',data);
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        // d.push(obj.timeZb);
        dataArr[parseInt(obj.timeGroup)] = obj.timeZb;
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
    })
  }

  var tab4Li2Echart2;
  function tab4Li2initEchart2() {
    var dom = $('#tab4-klqs');
    if(!tab4Li2Echart2) {
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
      tooltip: {
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
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
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数/万',
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
              // color: 'rgb(62,139,230)',
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
            color: 'rgb(62,139,230)',
          },
          data: [],

        },
        // {
        //   name: '预测',
        //   type: 'line',
        //   smooth: true,
        //   symbol: 'none',
        //   stack: 'a',
        //   // areaStyle: {
        //   //   normal: {
        //   //   }
        //   // },
        //   lineStyle: {
        //     type: 'dotted'
        //   },
        //   data: data2
        // }
      ]
    };

    tab4Li2Echart2reqData()
    if (option && typeof option === "object") {
      tab4Li2Echart2.setOption(option, true);
    }

  }

  function tab4Li2Echart2reqData(date) {
    var d = date?date:returnDate();
    $('#tab4-klqs-cld2-box').hide();
    tab4Li2Echart2.showLoading();    //加载动画
    var url = 'toll/selectTollFlowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li2InitEchart',data);
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        dataArr.push(obj.pepValue);
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
    })
  }

  var tab4Li2Echart3;
  function tab4Li2InitEchart3() {
    var dom = document.getElementById("tab4-klhx");
    if(!tab4Li2Echart3) {
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
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          animation: false,
          itemStyle: {
            color:'rgb(104,228,255)',
            borderColor:'#0a214b',
            borderWidth:10
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
              formatter: '{b}\n{c} ',
              fontSize:  20,

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
    tab4Li2Echart3ReqData();

    if (option && typeof option === "object") {
      tab4Li2Echart3.setOption(option, true);
    }


  }

  function tab4Li2Echart3ReqData(date) {
    tab4Li2Echart3.showLoading();    //加载动画
    var d;
    d = date?date:returnDate();
    var url = 'toll/selectTollSexAge.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab4Li2Echart3',data);
      var dataArr = [];
      for (var i = 0; i < data.data.tollAgeList.length; i++) {
        var obj = data.data.tollAgeList[i];
        // debugger
        dataArr.push({
          name: ageObj[obj.ageGroup],
          value: obj.ageZb
        })
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
      var dom = $("#tab4-klhx").parent();
      for (var j = 0; j < data.data.tollSexList.length; j++) {
        var obj1 = data.data.tollSexList[j];
        if(obj1.sex===1) {
          dom.find('.hm.man span').text(obj1.manZb+'%')
        } else {
          dom.find('.hm.woman span').text(obj1.manZb+'%')
        }
      }
    })
  }

  var tab4Li3Echart1;
  function tab4Li3InitEchart1() {
    var dom = document.getElementById("tab4-zlsc-day");
    if(!tab4Li3Echart1) {
      tab4Li3Echart1 = echarts.init(dom);
    }
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
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: hourArr,
        name: '小时',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '人数/万',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
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
          color: 'rgb(70,158,228)'
        },
        barWidth: '50%',
      }]
    };
    tab4Li3Echart1reqData();

    if (option && typeof option === "object") {
      tab4Li3Echart1.setOption(option, true);
    }
  }

  function tab4Li3Echart1reqData(date) {
    var d = date?date:returnDate();
    tab4Li3Echart1.showLoading();    //加载动画
    var url = 'toll/selectTollLinger.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab4Li3Echart1',data);
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        // d.push(obj.timeZb);
        dataArr[parseInt(obj.timeGroup)] = obj.timeValue;
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
    })
  }


  var tab4Li3Echart2;
  function tab4Li3InitEchart2() {
    if(!tab4Li3Echart2) {
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

      legend: {
        show:true,
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
            color: 'rgb(133,168,184)'
          }
        },
        data: date
      },
      yAxis: {
        type: 'value',
        name: '(人数)',
        splitLine: {show: false},
        axisLine: {
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },

      },
      // series: handleOption()
      series: []
      // series: [
        // {
        //   name: '搜索引擎',
        //   type: 'line',
        //   z: 2,
        //   //stack: '总量',
        //   smooth: true,
        //   data: [],
        //   lineStyle: {
        //     normal: {
        //       color: 'rgb(70,158,228)'//rgba(55,255,75
        //     }
        //   },
        //   areaStyle: {
        //     normal: {
        //       color: {
        //         type: 'linear',
        //         x: 0,
        //         y: 0,
        //         x2: 0,
        //         y2: 1,
        //         colorStops: [{
        //           offset: 0, color: 'rgba(70,158,228,0.3)'
        //         }, {
        //           offset: 0.5, color: 'rgba(70,158,228,0.15)'
        //         }, {
        //           offset: 1, color: 'rgba(70,158,228,0)'
        //         }]
        //       }
        //     }
        //   },
        // },
        // {
        //   name: '搜索引擎',
        //   symbol: 'none',
        //   z: 3,
        //   type: 'line',
        //   itemStyle: {
        //     normal: {
        //       lineStyle: {
        //         width: 2,
        //         color: 'rgb(70,158,228)',
        //         type: 'dotted'  //'dotted'虚线 'solid'实线
        //       }
        //     }
        //   },
        //   smooth: true,
        //   //stack: '总量',
        //   data: [820, 932, 901, 934, 1290, 1330, 1320]
        // },
      // ]
    };
    tab4Li3Echart2reqData();
    tab4Li3Echart2.setOption(option);
  }

  function tab4Li3Echart2reqData(date) {
    var d = date?date:returnDate(1);
    tab4Li3Echart2.showLoading();    //加载动画
    var url = 'toll/selectTollLingerDay.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    $.axpost(url,{},function (data) {

      var dataArr = [];
      var index = 0;
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
          stack: 'a',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            normal: {
              color: 'rgb(70,158,228)'//rgba(55,255,75
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
      console.log('dataArr',dataArr);

      // var result = [];
      // for (var j = 0; j < dataArr.length; j++) {
      //   var item = dataArr[j];
      //   result.push({
      //     name: item[0],
      //     data: item[1]
      //   })
      // }
      // console.log('result',result);

      // debugger
      tab4Li3Echart2.hideLoading();    //隐藏加载动画
      tab4Li3Echart2.setOption({
        series: dataArr,
        legend: {
          data: hourArr
        }


      })
    })
  }

  var tab4Li4Echart1;
  function tab4Li4InitEchart1() {
    var dom = $('#tab4-zklqs');
    if(!tab4Li4Echart1) {
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
            color: 'rgb(133,168,184)'
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
        name: '人数/万',
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
              show: true
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
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab4Li4Echart1.showLoading();    //加载动画
    var url = 'toll/selectTollDayflowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
    $.axpost(url,{},function (data) {
      // console.log('tab4Li4Echart1',data);
      var dayArr = [];
      var dataArr = [];
      for (var i = 0; i < data.data.listTollDayFlow.length; i++) {
        var obj = data.data.listTollDayFlow[i];
        dayArr.push(obj.statDate);
        dataArr.push(obj.allPeople);
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
    })
  }

  var tab4Li4Echart2;
  function tab4Li4InitEchart2() {
    var dom = document.getElementById("tab4-clqs");
    if(!tab4Li4Echart2) {
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
            color: 'rgb(133,168,184)'
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
            color: 'rgb(133,168,184)'
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
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab4Li4Echart2.showLoading();    //加载动画
    var url = 'toll/selectTollDayflowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
    $.axpost(url,{},function (data) {
      console.log('tab4Li4Echart2',data);
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
  var tab5Li2Echart1;
  function tab5Li2initEchart1() {
    var dom = $('#tab5-klqs');
    if(!tab5Li2Echart1) {
      tab5Li2Echart1 = echarts.init(dom[0]);
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
      tooltip: {
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
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
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数/万',
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
              // color: 'rgb(62,139,230)',
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
            color: 'rgb(62,139,230)',
          },
          data: [],

        },
        // {
        //   name: '预测',
        //   type: 'line',
        //   smooth: true,
        //   symbol: 'none',
        //   stack: 'a',
        //   // areaStyle: {
        //   //   normal: {
        //   //   }
        //   // },
        //   lineStyle: {
        //     type: 'dotted'
        //   },
        //   data: data2
        // }
      ]
    };
    tab5Li2Echart1reqData();
    if (option && typeof option === "object") {
      tab5Li2Echart1.setOption(option, true);
    }

  }

  function tab5Li2Echart1reqData(date) {
    var d = date?date:returnDate();
    // var str = '虎门大桥';
    $('#tab5-cld1').hide();
    tab5Li2Echart1.showLoading();    //加载动画
    var url = 'highSpeed/selectGsFlowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    // var url = 'highSpeed/selectGsFlowTrend.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li2InitEchart',data);
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        dataArr.push(obj.peopleNum);
      }
      // debugger
      $('#tab5-cld1').show();
      tab5Li2Echart1.hideLoading();    //隐藏加载动画
      tab5Li2Echart1.setOption({
        series: [
          {
            name: '实时客流趋势',
            data: dataArr
          }
        ]
      })
    })
  }

  var tab5Li2Echart2;
  function tab5Li2initEchart2() {
    var dom = $('#tab5-yxsd');
    if(!tab5Li2Echart2) {
      tab5Li2Echart2 = echarts.init(dom[0]);
    }

    option = null;
    var date = [];

    for (var i = 0; i < 25; i++) {  // 时间(小时)
      date.push(i);
    }

    option = {
      title: {
        text: '实时平均通行速度',
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
        name: '时点',
        data: date,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
          }
        },
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '(km/h)',
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
        }
      },
      series: [
        {
          name: '实时平均通行速度',
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
              // color: 'rgb(62,139,230)',
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#15ad64' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: '#15ad64'
          },
          data: [],

        },
        // {
        //   name: '预测',
        //   type: 'line',
        //   smooth: true,
        //   symbol: 'none',
        //   stack: 'a',
        //   // areaStyle: {
        //   //   normal: {
        //   //   }
        //   // },
        //   lineStyle: {
        //     type: 'dotted'
        //   },
        //   data: data2
        // }
      ]
    };
    tab5Li2Echart2reqData();
    if (option && typeof option === "object") {
      tab5Li2Echart2.setOption(option, true);
    }

  }

  function tab5Li2Echart2reqData(date) {
    var d = date?date:returnDate();
    var str = '虎门大桥';
    $('#tab5-cld2').hide();
    tab5Li2Echart2.showLoading();    //加载动画
    // var url = 'highSpeed/selectGsAveSpeed.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+d;
    var url = 'highSpeed/selectGsAveSpeed.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+d;
    $.axpost(url,{},function (data) {
      // console.log('tab2Li2InitEchart',data);
      var dataArr = [];
      for (var i = 0; i < data.data.length; i++) {
        var obj = data.data[i];
        dataArr.push(obj.avgSpeed);
      }
      // debugger
      $('#tab5-cld2').show();
      tab5Li2Echart2.hideLoading();    //隐藏加载动画
      tab5Li2Echart2.setOption({
        series: [
          {
            name: '实时客流趋势',
            data: dataArr
          }
        ]
      })
    })
  }

  var tab5Li3Echart1;
  function tab5Li3InitEchart1() {
    var dom = $('#tab5-klqs-week');
    if(!tab5Li3Echart1) {
      tab5Li3Echart1 = echarts.init(dom[0]);
    }
    option = null;

    option = {
      title: {
        text: '每周总客流趋势',
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
            color: 'rgb(133,168,184)'
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
        name: '人数/万',
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
        }
      },
      series: [
        {
          name: '每周总客流趋势',
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
              // color: 'rgb(62,139,230)',
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
    tab5Li3Echart1ReqData();
    if (option && typeof option === "object") {
      tab5Li3Echart1.setOption(option, true);
    }
  }

  function tab5Li3Echart1ReqData(date) {
    var str = '虎门大桥'
    var d;
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab5Li3Echart1.showLoading();    //加载动画
    // var url = 'highSpeed/selectGsPeopleAndCarTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
    var url = 'highSpeed/selectGsPeopleAndCarTrend.do?postionType='+ positionType +'&postionName='+ str +'&startDate='+d.start + '&endDate='+d.end;
    $.axpost(url,{},function (data) {
      // console.log('tab5Li3Echart1',data);
      var dayArr = [];
      var dataArr = [];
      for (var i = 0; i < data.data.listGsTrendDayFlowDAO.length; i++) {
        var obj = data.data.listGsTrendDayFlowDAO[i];
        dayArr.push(obj.statDate);
        dataArr.push(obj.peopleNum);
      }
      // debugger

      tab5Li3Echart1.hideLoading();    //隐藏加载动画
      tab5Li3Echart1.setOption({
        xAxis: {
          data: dayArr
        },
        series: [
          {
            name: '每周总客流趋势',
            data: dataArr
          }
        ]
      })
    })
  }

  var tab5Li3Echart2;
  function tab5Li3InitEchart2() {
    var dom = $('#tab5-clqs-week');
    if(!tab5Li3Echart2) {
      tab5Li3Echart2 = echarts.init(dom[0]);
    }
    option = null;

    option = {
      title: {
        text: '每周总车流量趋势',
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
            color: 'rgb(133,168,184)'
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
        name: '辆',
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
        }
      },
      series: [
        {
          name: '每周总车流量趋势',
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
              // color: 'rgb(62,139,230)',
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#15e1d8' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          lineStyle: {
            color: '#15e1d8'
          },
          data: []
        }
      ]
    };
    tab5Li3Echart2ReqData();
    if (option && typeof option === "object") {
      tab5Li3Echart2.setOption(option, true);
    }
  }

  function tab5Li3Echart2ReqData(date) {
    var str = '虎门大桥'
    var d;
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab5Li3Echart2.showLoading();    //加载动画
    // var url = 'toll/selectTollDayflowTrend.do?postionType='+ positionType +'&postionName='+ curPosition +'&startDate='+d.start + '&endDate='+d.end;
    var url = 'highSpeed/selectGsPeopleAndCarTrend.do?postionType='+ positionType +'&postionName='+ str +'&startDate='+d.start + '&endDate='+d.end;
    $.axpost(url,{},function (data) {
      // console.log('tab5Li3Echart2',data);
      var dayArr = [];
      var dataArr = [];
      for (var i = 0; i < data.data.listGsTrendDayFlowDAO.length; i++) {
        var obj = data.data.listGsTrendDayFlowDAO[i];
        dayArr.push(obj.statDate);
        dataArr.push(obj.carNum);
      }
      // debugger

      tab5Li3Echart2.hideLoading();    //隐藏加载动画
      tab5Li3Echart2.setOption({
        xAxis: {
          data: dayArr
        },
        series: [
          {
            name: '每周总车流量趋势',
            data: dataArr
          }
        ]
      })
    })
  }

  var tab5Li3Echart3;
  function tab5Li3initEchart3() {
    var carArr = [''];
    var dom = $('#tab5-clfb-week');
    if(!tab5Li3Echart3) {
      tab5Li3Echart3 = echarts.init(dom[0]);
    }

    function handleOption() {
      var result = [];
      // for (var key in dataObj) {
      //   result.push({
      //     name: key,
      //     data: dataObj[key]
      //   })
      // }
      for (var i = 0; i < hourArr.length; i++) {
        var d = hourArr[i];
        result.push(
          {
            name: '实时',
            type: 'line',
            smooth: true,
            symbol: 'none',
            stack: 'a',
            label: {
              normal: {
                show: true
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
                    offset: 0, color: '#183d74' // 0% 处的颜色
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
            data: data,

          }
          // {
          //   name: '预测',
          //   type: 'line',
          //   smooth: true,
          //   symbol: 'none',
          //   stack: 'a',
          //   // areaStyle: {
          //   //   normal: {
          //   //   }
          //   // },
          //   lineStyle: {
          //     type: 'dotted'
          //   },
          //   data: data2
          // }

      )
      }
      return result
    }

    option = null;

    option = {
      title: {
        text: '每周车辆类型分布',
        textStyle: {
          color: 'rgb(221,243,255)',
          fontSize: 18,
          fontFamily: 'Microsoft YaHei',
          // fontWeight:400
        }
      },

      legend: {
        show:true,
        textStyle: {
          color: '#557398'
        },
        data: [],
        width: 300,
        height: 50,
        right: 10,
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时点',
        data: [],
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'rgb(133,168,184)'
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
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        name: '人数/万',
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
        }
      },
      series: [
        // {
        //   name: '实时',
        //   type: 'line',
        //   smooth: true,
        //   symbol: 'none',
        //   stack: 'a',
        //   label: {
        //     normal: {
        //       show: true
        //     }
        //   },
        //   // 填充区域样式
        //   areaStyle: {
        //     normal: {
        //       // color: 'rgb(62,139,230)',
        //       // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
        //       color: {
        //         type: 'linear',
        //         x: 0,
        //         y: 0,
        //         x2: 0,
        //         y2: 1,
        //         colorStops: [{
        //           offset: 0, color: '#183d74' // 0% 处的颜色
        //         }, {
        //           offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
        //         }],
        //         globalCoord: false // 缺省为 false
        //       }
        //     }
        //   },
        //   lineStyle: {
        //     color: 'rgb(62,139,230)',
        //   },
        //   data: [],
        //
        // },
        // {
        //   name: '预测',
        //   type: 'line',
        //   smooth: true,
        //   symbol: 'none',
        //   stack: 'a',
        //   // areaStyle: {
        //   //   normal: {
        //   //   }
        //   // },
        //   lineStyle: {
        //     type: 'dotted'
        //   },
        //   data: data2
        // }
      ]
    };
    tab5Li3Echart3reqData();
    if (option && typeof option === "object") {
      tab5Li3Echart3.setOption(option, true);
    }

  }

  function tab5Li3Echart3reqData(date) {
    var str = '虎门大桥'
    var d;
    if(date) {
      d = date;
    } else {
      d = {
        start: returnDate(7),
        end: returnDate(1)
      };
      // console.log('d',d);
    }
    tab5Li3Echart3.showLoading();    //加载动画
    // var url = 'highSpeed/selectGsCarType.do?postionType='+ positionType +'&postionName='+ curPosition +'&countDate='+date;
    // var url = 'highSpeed/selectGsCarType.do?postionType='+ positionType +'&postionName='+ str +'&countDate='+date;
    var url = 'highSpeed/selectGsCarType.do?postionType='+ positionType +'&postionName='+ str +'&startDate='+d.start + '&endDate='+d.end;

    $.axpost(url,{},function (data) {

      var dataArr = [];
      var lgdArr = [];
      var xArr = [];

      var index = 0;
      for (var key in data.data) {
        lgdArr.push(key);
        var newArr = [];
        for (var i = 0; i < data.data[key].length; i++) {
          var obj = data.data[key][i];
          newArr.push(obj.peopleNum);
          if(xArr.length<7) {
            xArr.push(obj.statDate)
          }
        }
        dataArr.push(
          {
            name: lgdArr[index],
            data: newArr,
            type: 'line',
            smooth: true,
            symbol: 'none',
            stack: 'a',
            label: {
              // normal: {
              //   show: true
              // }
              show: false
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
                    offset: 0, color: '#183d74' // 0% 处的颜色
                  }, {
                    offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            lineStyle: {
              color: 'rgb(62,139,230)'
            }
          }
        );
        index++;
      }
      console.log('dataArr',dataArr,xArr);


      // debugger
      tab5Li3Echart3.hideLoading();    //隐藏加载动画
      tab5Li3Echart3.setOption({
        series: dataArr,
        legend: {
          data: lgdArr
        },
        xAxis: {
          data: xArr
        }
      })
    })

  }

});
