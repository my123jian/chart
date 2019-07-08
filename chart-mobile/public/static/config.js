//在这里设置基础地址
window.baseUrl = "http://localhost:9000";

(function () {
//判断是否已经登录
    var theUserSessionObj = sessionStorage.userData;
    if (theUserSessionObj == null) {
        console.log("用户未登录,请登录!");
        if (location.href.lastIndexOf("login") >= 0) {

        }
        else {
            location.href = "login.html";
        }

    }
    else {
        var theUserObj = JSON.parse(theUserSessionObj);
        var theMenuObj = null;
        for (var i = 0; i < theUserObj.children.length; i++) {
            var theChildItem = theUserObj.children[i];
            if (theChildItem.text == "交通厅菜单") {
                theMenuObj = theChildItem.children;
            }
        }
        window.menuList = theMenuObj;

    }
})();

/**
 * 得到当前模块的城市列表信息
 * @param modelname
 */
function getCitys(modelname) {
    var theResult = [];
    modelname=modelname||window.moduleNmae;
    if (window.menuList && window.menuList.length > 0) {
        for (var i = 0; i < menuList.length; i++) {
            var theMenu = menuList[i];
            if(theMenu.text==modelname){
                var theCitys=theMenu.children;
                for(var j=0;j<theCitys.length;j++){
                    var theCity=theCitys[j];
                    theResult.push(theCity.text);
                }
            }
        }
    }
    return theResult;
}

/**
 * 用户登录
 * @param userName
 * @param userPassword
 */
function doLogin(userName, userPassword) {

}

/***
 * 用户登出
 */
function doLogoff() {

}