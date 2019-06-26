<template>
    <div class="chart-group">
        <div class="chart-item">
            <div class="title">平均单程通勤距离</div>
            <div ref="chart1" class="chart"></div>
        </div>
        <div class="chart-item">
            <div class="title">平均单程通勤时间</div>
            <div ref="chart2" class="chart"></div>
        </div>
        <div class="chart-item">
            <div class="title">通勤时点分布</div>
            <div ref="chart3" class="chart"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabOne",
        props: ["queryRegionCode", "queryDate"],
        data() {
            return {};
        },
        methods: {},
        watch: {
            queryRegionCode(newValue, oldValue) {
                if (newValue != oldValue) {

                }
            },
            queryDate(newValue, oldValue) {
                if (newValue != oldValue) {

                }
            }
        }
    }
</script>

<style scoped>
    .chart-group {
        width: 100%;
        height: 100%;
    }

    .chart-item {
        height: 33.33%;
        width: 100%;
        pointer-events: visible;
    }
</style>