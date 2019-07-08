import Vue from 'vue'
import App from './zzfx.vue'
import 'lib-flexible/flexible.js'
import '../../styles/base.css'

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
