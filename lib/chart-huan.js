$(function () {
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees + 120) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }

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
        "                                      marker-end=\"url(#dot)\"\n" +
        "                                      stroke-width=\"10\" fill=\"none\" />\n" +
        "\n" +
        "                            </svg>";

    function ChartHuan(ele, id) {
        /*var theDotName = "dot";
        var theBasePath = "base-path";
        var thePerPath = "per-path";

        var theWidth = opt.width;
        var theHeight = opt.height;
        var theBgColor = opt.bg;
        var theColor = opt.color;
        */
        var theElement = ele;
        this.id = 'dot'+id;
        var theData = $(ele).data();
        //$(ele).data('instance',this);
        // debugger;
        var theTemplateEle = $(theTempalte);
        $(theTemplateEle).find('#fieldName').text(theData.name);
        $(theTemplateEle).find('#fieldValue').text(theData.value || 0);
        if (theData.bg) {
            $(theTemplateEle).find('#base-path').attr('stroke', theData.bg);
        }
        $(theTemplateEle).find('#dot').attr('id', this.id)
       // this.dotId = 'dot' + theData.color;
        $(theTemplateEle).find('#per-path').attr('stroke', theData.color);
        $(theTemplateEle).find('#circle').attr('fill', theData.color);
        this.element = theElement;
        $(this.element).empty();
        $(this.element).append(theTemplateEle);
        this.refresh('', theData.value);
        var thePath = describeArc(50, 50, 45, 0, 360 - 60);
        $(theTemplateEle).find('#base-path').attr('d', thePath);

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
        var theTextValue = Math.floor(value) + "%";
        $(this.element).find('#fieldValue').text(theTextValue);
        var thePath = describeArc(50, 50, 45, 0, value * 3);
        var theElement = $(this.element).find('#per-path');
       // $(this.element).find('#base-path').attr('d', thePath);
        if (value <= 0) {
            $(theElement).removeAttr('d');
            $(theElement).removeAttr('marker-end');
        }
        else if (value >= 100) {
            $(theElement).removeAttr('marker-end');
            $(theElement).attr('stroke-linecap', 'round');
            $(theElement).attr('d', thePath);
        }
        else {
            $(theElement).attr('marker-end', 'url(#' + this.id + ')');
            $(theElement).removeAttr('stroke-linecap');
            $(theElement).attr('d', thePath);
        }

    }
    window.ChartHuan = ChartHuan;
});