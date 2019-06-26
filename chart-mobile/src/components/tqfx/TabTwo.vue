<template>
    <div>
        <div title="通勤成本排行">
            <div class="title onecloumn">
                通勤成本排行
            </div>
            <div class="content">
                <table>
                    <thead>
                    <tr>
                        <th>
                            排名
                        </th>
                        <th>
                            通勤路线
                        </th>
                        <th>
                            通勤人数
                        </th>
                        <th>
                            单程平均通行时间(min)
                        </th>
                        <th>
                            单程平均通行距离(km)
                        </th>

                    </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div title="平均通勤距离">
            <div class="title onecloumn">
                平均通勤距离
            </div>
            <div class="content chart">

            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "TabTwo",
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
    .onecloumn {
        margin: 0 auto;
        height: 140px;
        writing-mode: vertical-lr; /*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr; /*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
    }
</style>