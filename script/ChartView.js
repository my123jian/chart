/*
*创建一个图表视图
* */
class ChartView extends ChartViewBase {
    constructor(ele) {
        super();
        this.chart = echarts.init(document.getElementById(ele));
    }

    loadData(data) {
        if (this.chart) {

        }
        else {

        }
    }

    show(data) {
        console.log(this);
    }

    refresh(data) {
        this.show(data);
    }
}