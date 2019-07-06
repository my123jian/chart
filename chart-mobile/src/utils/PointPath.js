function MethodAttribute() {
    console.log("目标方法调用了!");
}

class PointData {
    value = 0;
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    x = 0;
    y = 0;
    xstep = 0;
    ystep = 0;
    minDis = 10;
    mark=null;

     getRad(d){
        return d*Math.PI/180.0;
    }

    /**
     * caculate the great circle distance
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */
    getGreatCircleDistance(lat1,lng1,lat2,lng2){
        const EARTH_RADIUS = 6378137.0;    //单位M
        var radLat1 = this.getRad(lat1);
        var radLat2 = this.getRad(lat2);

        var a = radLat1 - radLat2;
        var b = this.getRad(lng1) - this.getRad(lng2);

        var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s*EARTH_RADIUS;
        s = Math.round(s*10000)/10000.0;

        return s;
    }
    constructor() {

    }

    isOver() {
        return this.x == this.x2 && this.y == this.y2;
    }

    reset() {
        this.x = this.x1;
        this.y = this.y1;
    }

    getNextEndPoint() {
        var theNextEndPoint = {x: this.x, y: this.y};
        if (this.x1 < this.x2) {
            theNextEndPoint.x = theNextEndPoint.x + this.xstep;
            if (theNextEndPoint.x > this.x2) {
                theNextEndPoint.x = this.x2;
            }
        }
        if (this.x1 > this.x2) {
            theNextEndPoint.x = theNextEndPoint.x - this.xstep;
            if (theNextEndPoint.x < this.x2) {
                theNextEndPoint.x = this.x2;
            }
        }
        if (this.y1 < this.y2) {
            theNextEndPoint.y = theNextEndPoint.y + this.ystep;
            if (theNextEndPoint.y > this.y2) {
                theNextEndPoint.y = this.y2;
            }
        }
        if (this.y1 > this.y2) {
            theNextEndPoint.y = theNextEndPoint.y - this.ystep;
            if (theNextEndPoint.y < this.y2) {
                theNextEndPoint.y = this.y2;
            }
        }
        return theNextEndPoint;
    }

    getPointInRang(x1, y1, x2, y2) {
        var theNextEndPoint = {x: x2, y: y2};
        theNextEndPoint.x = Math.RandomRange(Math.min(x1, x2), Math.max(x1, x2));
        theNextEndPoint.y = Math.RandomRange(Math.min(y1, y2), Math.max(y1, y2));
        return theNextEndPoint;
    }

    getDistince(x1, y1, x2, y2) {
        // var theValue = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        // return Math.sqrt(theValue);
        var theValue=this.getGreatCircleDistance(y1,x1,y2,x2);
        return theValue;
    }

    @MethodAttribute
    run() {
        var theMinDistince = this.getDistince(this.x, this.y, this.x2, this.y2);
        //debugger;
        if (theMinDistince <= this.minDis) {
            this.x = this.x2;
            this.y = this.y2;
            return;
        }
        var theNextEndPoint = this.getNextEndPoint();
        var theNextPoint = this.getPointInRang(this.x, this.y, theNextEndPoint.x, theNextEndPoint.y);
        this.x = theNextPoint.x;
        this.y = theNextPoint.y;
        console.log("节点信息:", this.x, this.y);

    }
}

export class PointPath {
    value = 0;
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    points = [];
    max = 30;
    isRunning = false;
    drawHandler = null;
    endMark=null;
    startMark=null;

    constructor(x1, y1, x2, y2, value, drawHandler) {
        this.x1 = parseFloat(x1);
        this.y1 = parseFloat(y1);
        this.x2 = parseFloat(x2);
        this.y2 = parseFloat(y2);
        this.value = value;
        this.drawHandler = drawHandler;
    }

    genPoints() {
        var theBaseUtil = this.value / this.max;
        var theCurrentValue = this.value;
        var theXStep = Math.abs(this.x1 - this.x2) / this.max;
        var theYStep = Math.abs(this.y1 - this.y2) / this.max;
        for (var i = 0; i < this.max; i++) {
            var theVlaue = Math.RandomRange(theBaseUtil,Math.min(theCurrentValue,theBaseUtil*4));
            var theData = Math.min(theVlaue, theCurrentValue);
            theCurrentValue = theCurrentValue - theData;
            let theNewPoint = new PointData();
            theNewPoint.x1 = this.x1;
            theNewPoint.y1 = this.y1;
            theNewPoint.x = this.x1;
            theNewPoint.y = this.y1;
            theNewPoint.x2 = this.x2;
            theNewPoint.y2 = this.y2;
            theNewPoint.xstep = theXStep;
            theNewPoint.ystep = theYStep;
            theNewPoint.value = theData;
            this.points.push(theNewPoint);
        }
        if (theCurrentValue > 0) {
            let theNewPoint = new PointData();
            theNewPoint.x1 = this.x1;
            theNewPoint.y1 = this.y1;
            theNewPoint.x = this.x1;
            theNewPoint.y = this.y1;
            theNewPoint.x2 = this.x2;
            theNewPoint.y2 = this.y2;
            theNewPoint.value = theCurrentValue;
            theNewPoint.xstep = theXStep;
            theNewPoint.ystep = theYStep;
            this.points.push(theNewPoint);
        }
        // debugger;
    }

    @MethodAttribute
    run() {
        var isAllOver=true;
        for (var i = 0; i < this.points.length; i++) {
            var thePoint = this.points[i];
            if(!thePoint.isOver()){
                thePoint.run();
                isAllOver=false;
            }

        }
        if(isAllOver){
            for (var i = 0; i < this.points.length; i++) {
                var thePoint = this.points[i];
                thePoint.reset();

            }
        }
        if (this.drawHandler) {
            this.drawHandler(this,this.points);
        }
    }

    @MethodAttribute
    init() {
        this.points = [];
        this.genPoints();
    }

    @MethodAttribute
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.init();
            var me = this;
        }

    }

    @MethodAttribute
    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.timer) {
                window.clearInterval(this.timer);
                this.timer = null;
            }
        }
    }

}