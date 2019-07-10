//在这里设置基础地址
window.baseUrl = "/traffic/";
window.adminUrl = "http://serv.gdcmcc.com:23206/traffic/login";
(function () {
//判断是否已经登录
    var theUserSessionObj = getLoginData();
    if (theUserSessionObj == null || theUserSessionObj == "undefined") {
        console.log("用户未登录,请登录!");
        if (location.href.lastIndexOf("login") >= 0) {

        }
        else {
            location.href = "login.html";
        }

    }
    else {
        var theUserObj = theUserSessionObj;
        var theMenuObj = null;
        for (var i = 0; i < theUserObj.children.length; i++) {
            var theChildItem = theUserObj.children[i];
            if (theChildItem.id + "" == "115") {
                theMenuObj = theChildItem.children;
                window.appname = theChildItem.text
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
    modelname = modelname || window.moduleNmae;
    if (window.menuList && window.menuList.length > 0) {
        for (var i = 0; i < menuList.length; i++) {
            var theMenu = menuList[i];
            if (theMenu.text == modelname) {
                var theCitys = theMenu.children;
                for (var j = 0; j < theCitys.length; j++) {
                    var theCity = theCitys[j];
                    theResult.push(theCity.text);
                }
            }
        }
    }
    return theResult;
}

/**
 * 返回默认值
 * @returns {*}
 */
function getDefaultCity() {
    var theCitys = getCitys();
    if (theCitys && theCitys.length > 0) {
        return theCitys[0];
    }
    return "";
}


function getLoginName() {
    return localStorage.userName || "";
}

function setLoginName(userName) {
    localStorage.userName = userName;
}

function setLoginData(data) {
    if (data) {
        localStorage.userData = JSON.stringify(data);
    }
    else {
        localStorage.userData = null;
    }
}

function getLoginData() {
    var theJsonData = localStorage.userData;
    if (theJsonData) {
        return JSON.parse(theJsonData);
    }
    return null;
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
    setLoginName(null);
    setLoginData(null);
}

function GoToPage(pageName, defaultUrl, paramter) {
    let theParamterArray = []
    for (let key in paramter) {
        theParamterArray.push(key + '=' + paramter[key])
    }
    location.href = defaultUrl + '?' + theParamterArray.join('&')
}

function goToPage(pageName, defaultUrl, paramter) {
    let theParamterArray = []
    for (let key in paramter) {
        theParamterArray.push(key + '=' + paramter[key])
    }
    location.href = defaultUrl + '?' + theParamterArray.join('&')
}

function GotoPage(pageName, defaultUrl, paramter) {
    let theParamterArray = []
    for (let key in paramter) {
        theParamterArray.push(key + '=' + paramter[key])
    }
    location.href = defaultUrl + '?' + theParamterArray.join('&')
}

function GotoPage(name) {
    location.href = name;
}