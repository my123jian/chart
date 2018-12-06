$(function () {
    var theTempalte = "<div class=\"huan-chart-text\">\n" +
        "                                <div id='fieldName' class='field' data-field='name'>铁路</div>\n" +
        "                                <div id='fieldValue' class='field' data-field='value'>80%</div>\n" +
        "                            </div>\n" +
        "                            <svg style=\"z-index: 100;margin-left: 4px;\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" height=\"100\" width=\"100\">\n" +
        "                                <defs>\n" +
        "                                    <!-- arrowhead marker definition -->\n" +
        "                                    <marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"5\" refY=\"5\"\n" +
        "                                            markerWidth=\"6\" markerHeight=\"6\"\n" +
        "                                            orient=\"auto-start-reverse\">\n" +
        "                                        <path d=\"M 0 0 L 10 5 L 0 10 z\" />\n" +
        "                                    </marker>\n" +
        "\n" +
        "                                    <!-- simple dot marker definition -->\n" +
        "                                    <marker  id=\"dot\" viewBox=\"0 0 10 10\" refX=\"5\" refY=\"5\"\n" +
        "                                            markerWidth=\"5\" markerHeight=\"5\">\n" +
        "                                        <circle id='circle' cx=\"5\" cy=\"5\" r=\"1\" fill=\"#faeebe\" />\n" +
        "                                    </marker>\n" +
        "                                </defs>\n" +
        "\n" +
        "                                <path id='base-path' d=\"M 24.5 88.97 A 45 45 1 1 1 74.5 88.97\" stroke=\"#3964a5\"\n" +
        "                                      stroke-linecap=\"round\"\n" +
        "                                      stroke-width=\"10\" fill=\"none\" />\n" +
        "\n" +
        "                                <path id='per-path' d=\"M 24.5 88.97 A 45 45 1 1 1 74.5 88.97\" stroke=\"#faeebe\"\n" +
        "                                      marker-start=\"url(#dot)\"\n" +
        "                                      stroke-width=\"10\" fill=\"none\" />\n" +
        "\n" +
        "                            </svg>";

    function ChartHuan(ele,id) {
        /*var theDotName = "dot";
        var theBasePath = "base-path";
        var thePerPath = "per-path";

        var theWidth = opt.width;
        var theHeight = opt.height;
        var theBgColor = opt.bg;
        var theColor = opt.color;
        */
        var theElement = ele;
        this.id=id;
        var theData = $(ele).data();
       // debugger;
        var theTemplateEle = $(theTempalte);
        $(theTemplateEle).find('#fieldName').text(theData.name);
        $(theTemplateEle).find('#fieldValue').text(theData.value || 0);
        if (theData.bg) {
            $(theTemplateEle).find('#base-path').attr('stroke', theData.bg);
        }
        $(theTemplateEle).find('#dot').attr('id',this.id)
        this.dotId='dot'+theData.color;
        $(theTemplateEle).find('#per-path').attr('stroke', theData.color);
        $(theTemplateEle).find('#circle').attr('fill', theData.color);
        this.element = theElement;
        $(this.element).empty();
        $(this.element).append(theTemplateEle);
        this.refresh('', theData.value);

    }

    /***
     *
     * @param name
     * @param value 为小数百分比
     */
    ChartHuan.prototype.refresh = function (name, value) {
        if (!this.element) {
            console.log("元素未初始化,失败，不刷新数据！");
        }
        value = value | 0;

        var theArcValue = (value/100) * 300;
        var theTextValue = Math.floor(value) + "%";
        $(this.element).find('#fieldValue').text(theTextValue);
        var theElement = $(this.element).find('#per-path');
        var thePath = "M 24.5 88.97 A 45 45 1 1 1 ";//240 -60
        var theSmallPath="M 24.5 88.97 A 45 45 1 0 1 ";
        if(theArcValue<180){
            thePath=theSmallPath;
        }
        var theDisplayArc = 240 - theArcValue;

        var theX = (Math.cos( theDisplayArc*Math.PI/180) * 45).toFixed(2);
        var theY = (Math.sin(theDisplayArc*Math.PI/180) * 45).toFixed(2);
        console.log("theArcValue",theDisplayArc,theX,theY);
        var theX = Math.abs(theX - (-45)) + 5;
        var theY = Math.abs(theY - 45)+5;
        thePath += "" + theX + " " + theY;

        //debugger;
        //debugger;
        if (value <= 0) {
            $(theElement).removeAttr('d');
            $(theElement).removeAttr('marker-start');
        }
        else if (value >= 100) {
            $(theElement).removeAttr('marker-start');
            $(theElement).attr('stroke-linecap', 'round');
            $(theElement).attr('d', thePath);
        }
        else {

            //debugger;
            $(theElement).attr('marker-start', 'url(#'+ this.id+')');
            $(theElement).removeAttr('stroke-linecap');
            $(theElement).attr('d', thePath);
        }

    }
    window.ChartHuan = ChartHuan;
});