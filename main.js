import Vue from 'vue'
import App from './App'
import store from './store/store'

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

//引入全局组件
import RotationChart from "@/components/AutoComponents/rotationChart/index.vue"
import noticeBar from "@/components/AutoComponents/noticeBar/index.vue"
import iconBox from "@/components/AutoComponents/iconBox/index.vue"
import goodsBox from "@/components/AutoComponents/goodsBox/index.vue"
import activeList from "@/components/AutoComponents/activeList/index.vue"
import collageList from "@/components/AutoComponents/collage/index.vue"

Vue.component('RotationChart',RotationChart)
Vue.component('noticeBar',noticeBar)
Vue.component('iconBox',iconBox)
Vue.component('goodsBox',goodsBox)
Vue.component('activeList',activeList)
Vue.component('collageList',collageList)
//引入全局组件end

Vue.prototype.$showLoads = function(optType, Tip) {
	if (optType == 0) {
		uni.showLoading({
			title: Tip ? Tip : '加载中'
		});
	} else {
		uni.hideLoading();
	}
};

const app = new Vue({
	...App,
	store
})
app.$mount()
