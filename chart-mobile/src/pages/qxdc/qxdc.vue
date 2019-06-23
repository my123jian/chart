<template>
    <div id="app">
        <div class="left-part">
            <iframe :src="mapurl" class="mapview" frameborder="0"></iframe>
        </div>
        <div class="right-part">
            <div class="tab-view">
                <div class="tab-title">
                    <div v-on:click="right_tab_index= 1">第一个</div>
                    <div v-on:click="right_tab_index= 2">第二个</div>
                </div>
                <div class="tab-content">
                    <div v-show="right_tab_index==1">
                        第一个标签
                    </div>
                    <div v-show="right_tab_index==2">
                        第二个标签
                        <table-view></table-view>
                    </div>
                </div>

            </div>

        </div>
    </div>

</template>

<script>
    import TableView from "../../components/TableView";

    export default {
        name: 'app',
        components: {
            TableView
        },
        data: function () {
            return {
                right_tab_index: 1,
                mapurl:'http://www.baidu.com',
            };
        }, methods: {
            //切换URL地址
            changePage: function (url) {
                location.href = url;
            }
        }
    }
</script>

<style scoped>

    .mapview{
        width: 100%;
        height: 100%;
    }
    #app {
        width: 100%;
        height: 100%;
    }

    .left-part {
        width: 50%;
        float: left;
    }

    .right-part {
        width: 50%;
        float: left;
    }
</style>