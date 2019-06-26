<template>
    <div>3333</div>
</template>

<script>
    export default {
        name: "zzfx"
    }
</script>

<style scoped>
    .tab-title {
        background: gray;
    }

    .tab-title div {
        display: inline-block;
        cursor: pointer;
        width: 50%;
        text-align: center;
    }

    .tab-title div.select {
        color: red;
    }

    .tab-content > div {
        height: 100%;
    }

    .left-part {
        height: 100%;
        position: relative;
    }

    .wave-content {
        z-index: 1000;
        position: absolute;
        bottom: 0px;
        /*height: 400px;*/
        left: 0px;
        width: 100%;
    }

    .wave-content > * {
        width: 25%;
        float: left;
    }

    .mapview {
        width: 100%;
        height: 100%;
    }

    #app {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
        overflow-y: hidden;
    }

    .left-part {
        width: 50%;
        float: left;
    }

    .right-part {
        width: 50%;
        float: left;
        height: 100%;
    }

    .tab-view {
        height: 100%;
        position: relative;
    }

    .tab-content {
        position: absolute;
        bottom: 0px;
        width: 100%;
        top: 1.5em;
    }

    .query-bar {
        position: absolute;
        top: 1px;
        left: 5px;
        padding: 5px;
    }

    .query-bar > * {
        display: inline-block;
        height: 100%;
        margin: 2px;
        height: 34px;
    }

    .count-view {
        position: absolute;
        left: 5px;
        top: 100px;
    }

    #app {
        position: relative;
    }

    .nav-bottom-bar {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 2em;
        left: 0px;
        text-align: center;
        z-index: 10000
    }

    .nav-bottom-bar > * {
        display: inline-block;
        cursor: pointer;
        margin: 5px;
    }

    .radio-grp {

    }

    .radio-grp > span {
        cursor: pointer;
    }

    .radio-grp > span.select {
        background: red;
    }
</style>