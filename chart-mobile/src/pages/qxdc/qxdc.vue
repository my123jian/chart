<template>
    <div id="app">
        <div class="left-part">
          kkkkkkk
        </div>
        <div class="right-part">
            <div class="tab-view">
                <div class="tab-title">

                </div>
                <div class="tab-content">
                    <div>
                        第一个标签
                    </div>
                    <div>
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
        }
    }
</script>

<style scoped>

    #app{
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