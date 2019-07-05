import PointData from 'PointData'

export default {
    value: 0,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    points: [],
    max: 10,
    genPoints() {
        var theBaseUtil = this.value / this.max;
        var theCurrentValue = this.value;
        for (var i = 0; i < max; i++) {
            var theVlaue = Math.RandomRange(theBaseUtil, theCurrentValue);
            var theData = Math.min(theVlaue, theCurrentValue);
            theCurrentValue = theCurrentValue - theData;
            var theNewPoint = new PointData();
            theNewPoint.x1 = this.x1;
            theNewPoint.y1 = this.y1;
            theNewPoint.x2 = this.x2;
            theNewPoint.y2 = this.y2;
            theNewPoint.value = theData;
            this.points.push(theNewPoint);
        }
        if (theCurrentValue > 0) {
            var theNewPoint = new PointData();
            theNewPoint.x1 = this.x1;
            theNewPoint.y1 = this.y1;
            theNewPoint.x2 = this.x2;
            theNewPoint.y2 = this.y2;
            theNewPoint.value = theCurrentValue;
            this.points.push(theNewPoint);
        }
    },
    run() {
        for (var i = 0; i < this.points.length; i++) {
            var thePoint = this.points[i];
            thePoint.run();
        }
    }

}