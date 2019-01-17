
$(function () {

  var theChart = null;

  function getEchartsC() {
    // Step:3 conifg ECharts's path, link to echarts.js from current page.
    // Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
    require.config({
      paths: {
        echarts: 'lib'
      }
    });

    // Step:4 require echarts and use it in the callback.
    // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
    require(
      [
        'echarts',
        'echarts/chart/map'
      ],
      function (ec) {
        // --- 地图 ---
        var myChart2 = ec.init(document.getElementById('country'));
        theChart = myChart2;
        if(parent&&parent.PageView&&parent.PageView.currentTable){
          refreshC(parent.PageView.currentTable);
        }
        else{
          refreshC([]);
        }
        // refresh([]);
      });
  }

  /***
   * 刷新展示信息
   * @param data
   */
  function refreshC(data) {
    var theData = [
      /*{name: '上海', value: 95},
      {name: '广州', value: 90},
      {name: '大连', value: 80},
      {name: '南宁', value: 70},
      {name: '南昌', value: 60},
      {name: '拉萨', value: 50},
      {name: '长春', value: 40},
      {name: '包头', value: 30},
      {name: '重庆', value: 20},
      {name: '常州', value: 10}*/
    ];
    var theLineData=[];
    data=data||[];
    //debugger;
    for(var i=0;i<data.length;i++){
      var theItem=data[i];
      theData.push({name: theItem.to, value: theItem.value||0});
      theLineData.push([{name: theItem.from}, {name: theItem.to, value: theItem.value||0}]);
    }
    var theOptions = {
      /*dataRange: {
          min : 0,
          max : 100,
          calculable : true,
          color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
          textStyle:{
              color:'#fff'
          }
      },*/
      series: [
        {
          name: '全国',
          type: 'map',
          roam: false,//不启用缩放
          hoverable: false,//点击不反应
          mapType: 'china',
          mapLocation: {
            x: 31,
            y: 200,
            //width:965
          },
          scaleLimit: {
            min: 1
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                color: 'white',
              }
            }
          },
          itemStyle: {
            normal: {
              //areaColor: '#0040a3',
              //borderColor: '#49ffff'
              borderColor: '#25a8bc',
              borderWidth: 1,
              areaStyle: {
                color: 'rgba(31,70,143,0.8)',//#1f468f'
              },
              label:{
                show:true,
                textStyle:{
                  color:'white'
                },
              },
            }
          },
          data: [],
          markLine: {
            smooth: true,
            symbol:'none',
            effect: {
              show: true,
              scaleSize: 1,
              period: 30,
              color: '#00c7ff',
              shadowBlur: 10
            },
            itemStyle: {
              normal: {
                label: {show: false},
                borderWidth: 2,
                lineStyle: {
                  color: '#00c7ff',
                  type: 'solid',
                  shadowBlur: 10
                }
              }
            },
            data: theLineData
            /*[
            [{name: '上海'}, {name: '北京', value: 95}],
            [{name: '广州'}, {name: '北京', value: 90}],
            [{name: '大连'}, {name: '北京', value: 80}],
            [{name: '南宁'}, {name: '北京', value: 70}],
            [{name: '南昌'}, {name: '北京', value: 60}],
            [{name: '拉萨'}, {name: '北京', value: 50}],
            [{name: '长春'}, {name: '北京', value: 40}],
            [{name: '包头'}, {name: '北京', value: 30}],
            [{name: '重庆'}, {name: '北京', value: 20}],
            [{name: '常州'}, {name: '北京', value: 10}]
        ]*/
          },
          geoCoord: theCitys,
          markPoint: {
            symbol: 'emptyCircle',
            symbolSize: function (v) {
              return 10 + v / 10
            },
            effect: {
              show: true,
              // type: 'bounce',
              shadowBlur: 0
            },
            itemStyle: {
              normal: {
                color:'#1dd9ff',
                label: {show: false}
              },
              emphasis: {
                label: {position: 'top'}
              }
            },
            data: theData
          }

        },

      ]
    };
    theChart.setOption(theOptions);
  }

  var theChartMap = null;
  var theMapId = "province";
  var theAreaNmae = null;
  // var theGdData = GdGeoJson;

  function initChartMap() {
    if (!theChartMap) {
      echarts.registerMap('gd', theGdData);
      theChartMap = echarts.init(document.getElementById(theMapId));
    }
    //debugger;
    if(parent&&parent.PageView&&parent.PageView.currentTable){
      refresh(parent.PageView.currentTable);
    }
    else{
      refresh([]);
    }

  }

  /**
   * 刷新展示数据
   * @param data
   */
  function refresh(data) {
    option = null;
    var geoCoordMap = theCitys;
    var theSourceData=data||[];
    data=[];
    /*data|| [
    [{name: "广州"}, {name: "东莞", value: 95}],
];*/
    for(var i=0;i<theSourceData.length;i++){
      var theItem=theSourceData[i];
      data.push([{name: theItem.from}, {name: theItem.to, value: theItem.value}]);
    }

    var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

    var convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];

        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord],
            //设置线段颜色
            /* lineStyle: {
                 normal: {
                     color: color[i],
                     width: 0,
                     curveness: 0.2
                 }
             }*/
          });
        }
      }
      console.log(res);

      return res;
    };

    //var color = ['#a6c84c', '#ffa022', '#46bee9'];
    var color = ['#49ffff'];//
    var series = [];

    series.push(
      {
        // name: item[0] + ' Top10',
        type: 'lines',  //静态线
        zlevel: 1,
        effect: {
          show: false,
          period: 6,
          trailLength: 0.7,
          color: '#49ffff',//'#fff',
          symbolSize: 3
        },
        lineStyle: {
          normal: {
            color: '#49ffff',//color[i],
            width: 1,
            curveness: 0.2
          }
        },
        data: convertData(data),
      },
      {
        //name: item[0] + ' Top10',
        type: 'lines',  //动态线
        zlevel: 2,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          color: '#fff',
          symbol: 'arrow',
          symbolSize: 5,
          // shadowBlur: 10,
        },
        lineStyle: {
          normal: {
            color: color[0],
            width: 1,
            opacity: 0.5,
            curveness: 0.2,
            type: 'solid',
            // shadowBlur: 5,
            // shadowColor: color[i],
          }
        },
        // emphasis: {
        //   lineStyle: {
        //     color: {
        //       type: 'linear',
        //       x: 0,
        //       y: 0,
        //       x2: 0,
        //       y2: 1,
        //       colorStops: [{
        //           offset: 0, color: 'red' // 0% 处的颜色
        //       }, {
        //           offset: 1, color: 'blue' // 100% 处的颜色
        //       }],
        //       globalCoord: false // 缺省为 false
        //     }
        //   }
        // },
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        data: convertData(data),

      },
      {
        //name: item[0] + ' Top10',
        type: 'effectScatter',
        // symbol:'emptyCircle',
        // markPoint: {
        //   symbol: 'circle',
        //   data: [
        //     {
        //       name: '某个坐标',
        //       coord: [110.365554,21.276724],
        //       value:965,

        //     }
        //   ]
        // },
        //   animationDelayUpdate: function (idx) {
        //     return 1000;
        // },
        effectType: 'ripple',

        hoverAnimation: true,
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: function (val) {
          return val[2] / 8;
        },
        itemStyle: {
          normal: {
            color: color[0],
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: data.map(function (dataItem) {
          //debugger;
          return {
            name: dataItem[1].name,
            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
          };
        }),
      }
    );
    var option = {
      backgroundColor: '',
      title: {
        text: '',
        //subtext: '数据覆盖率',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      /*legend: {
          orient: 'vertical',
          top: 'bottom',
          left: 'right',
          //data:['北京 Top10', '上海 Top10', '广州 Top10'],
          textStyle: {
              color: '#fff'
          },
          selectedMode: 'single'
      },*/
      geo: {
        selectedMode: 'single',
        map: 'gd',
        top: 82,
        scaleLimit: {
          //min: 1,
          max: 6
        },
        /*regions: [{
            name: '广州市',
            itemStyle: {
                areaColor: 'red',
                color: 'red'
            }
        }],*/
        //鼠标移入是否显示省份/城市
        label: {
          show: true,
          color: 'white',
          emphasis: {
            color: 'white',
            show: true
          }
        },
        roam: false,//鼠标不可移动
        itemStyle: {
          normal: {//选取前颜色
            /*areaColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#2b7ecc00' // 0% 处的颜色
                }, {
                    offset: 1, color: '#2b7ecc' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }*/
            borderColor: '#49ffff',
            areaColor: '#0040a3',
            // borderColor: '#49ffff'
          },
          emphasis: {//选取后颜色
            areaColor: '#24b1e5'
          }
        },
        // center: [113.5107, 23.2196],
        zoom: 0.8,


      },
      series: series,

    };

    theChartMap.setOption(option, true);
    theChartMap.on('geoselectchanged', function (params) {
      //debugger;
      if (params.batch.length > 0) {
        var theAreaSelected = params.batch[0];
        var theName = theAreaSelected.name;
        if (theAreaNmae != theName) {
          theAreaNmae = theName;
          console.log('选择区域变化，切换到区域' + theAreaNmae);
          // me.loadData();

        }
      }
      else {
        console.log('选择区域变化，未找到值');
      }
      //console.log("111",params);
    });
    theChartMap.on('mapselectchanged', function (params) {
      var theName = params.name;
      //debugger;
      if (theAreaNmae != theName) {
        theAreaNmae = theName;
        //me.loadData();
      }
      //console.log(params);
    });
    theChartMap.on('click', function (params) {
      // var theName = params.name;
      // console.log(params);
    })
  }

  function tabClick() {
    $('#domestic').on('click',function () {
      $('#inner-page').attr('src','h5_country.html');
      $('.tab-box div').removeClass('active');
      $(this).addClass('active');
    });
    $('#province').on('click',function () {
      $('#inner-page').attr('src','h5_province.html');
        $('.tab-box div').removeClass('active');
        $(this).addClass('active');
    });
    $('.btm-box-header section').click(function () {
        if($(this).hasClass('active')){
          return;
        }
        $('.btm-box-header section').removeClass('active');
        $(this).addClass('active');
    });

  }

  $('#document').ready(function () {
    // getEchartsC();
    // initChartMap();
      laydate.render({
          elem: '#date', //指定元素
          trigger: 'click',
          format: 'yyyy年MM月dd日',
          //value: formateDate1(),
          //max: GetTodayDate().formate(),
          done: function (value, date, endDate) {

              if (theCurrentDate != date) {
                  //theCurrentDate = date;
                  //me.loadPredict();
              }

          }
      });
    tabClick();
  });
})