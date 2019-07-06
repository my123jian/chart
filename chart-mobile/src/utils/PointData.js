//1:静态点。2：值变化。 3：随机生成 点集合。 4：随机生成位置信息。随机生成范围内点值 然后 再排序
import MethodAttribute from 'MethodAttribute';

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
    minDis = 0;

    constructor() {

    }

    getNextEndPoint() {
        var theNextEndPoint = {x: this.x, y: this.y};
        if (this.x1 > this.x2) {
            theNextEndPoint.x = theNextEndPoint.x + this.xstep;
            if (theNextEndPoint.x > this.x2) {
                theNextEndPoint.x = this.x2;
            }
        }
        if (this.x1 < this.x2) {
            theNextEndPoint.x = theNextEndPoint.x - this.xstep;
            if (theNextEndPoint.x < this.x2) {
                theNextEndPoint.x = this.x2;
            }
        }
        if (this.y1 > this.y2) {
            theNextEndPoint.y = theNextEndPoint.y + this.ystep;
            if (theNextEndPoint.y > this.y2) {
                theNextEndPoint.y = this.y2;
            }
        }
        if (this.y1 < this.y2) {
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
        var theValue = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        return Math.sqrt(theValue);
    }

    @MethodAttribute
    run() {
        var theMinDistince = this.getDistince(this.x, this.y, this.x2, this.y2);
        if (theMinDistince <= this.minDis) {
            return {
                x: this.x2,
                y: this.y2,
            }
        }
        var theNextEndPoint = this.getNextEndPoint();
        var theNextPoint = this.getPointInRang(this.x, this.y, theNextEndPoint.x, theNextEndPoint.y);
        return theNextPoint;

    }
}
