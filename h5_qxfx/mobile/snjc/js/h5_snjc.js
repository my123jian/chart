$(function () {
  window.mapbase = new MapBase();

  var name = '广州南站';
  var pepNum = 1000;
  var defaultZoom = 18;
  var lnglat = lntlat = new AMap.LngLat(113.269391,22.988766);
  mapbase.drawReli(name, pepNum);
  theMap.setZoomAndCenter(defaultZoom, lnglat)
})