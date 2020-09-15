<template>
	<!-- <import src="list/list.wxml" /> -->
	<view class="coupon-list-style">
		<view>
			<wuc-tab textFlex :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" tab-class="'text-center','text-black','bg-white'"
			 :select-class="'btnMy'+colorIndex"></wuc-tab>

			<view>
				<coupon-box v-if="dataList.length>0" :dataList="dataList" :activeUser="TabCur" @viewMore="viewMore"></coupon-box>
				<no-data v-if="dataList.length===0"></no-data>
			</view>
		</view>

		<uni-popup :show="showInfo" @change="onCloseInfo">
			<view class="showInfo-style">
				<view class="show-head-style">详细信息</view>
				<view class="show-center-style">
					<text>{{currentShowStr}}</text>
				</view>
				<view :class="'btnMy'+colorIndex">
					<button @click="onCloseInfo({show:false})">
						我知道了
					</button>
				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script>
	const app = getApp()
	import APIList from '@/api/http.js';
	import WucTab from '@/components_uni/wuc-tab/wuc-tab.vue';
	import couponBox from '@/components/couponBox/index.vue'
	import uniPopup from '@/components_uni/uni-popup/uni-popup.vue'
	import noData from '@/components/nodeData/index.vue';
	import {
		setTime
	} from '@/utils/utils.js'
	var pageIndex = 1;
	export default {
		components: {
			WucTab,
			couponBox,
			uniPopup,
			noData
		},
		data() {
			return {
				TabCur: 0,
				tabList: [{
					name: '未使用'
				}, {
					name: '已使用'
				}, {
					name: '已过期'
				}],
				radioCoupon: "1",
				// 查看详情
				showInfo: false,
				activeUser: 0,
				dataList: [],
				isOrder: false,
				// 当前显示的详情弹框内容
				currentShowStr: '',
				disabledBtn: false,
				colorIndex: getApp().globalData.colorIndex
			}
		},
		methods: {
			getList() {
				// this.dataList = []
				this.$showLoads(0, '')
				APIList.api('CouponList.aspx', {
					Type: Number(this.TabCur) + 1,
					PageIndex: pageIndex
				}).then(D => {
					// console.log(D, 77777)
					setTime(D.CouponList)
					
					if (pageIndex > 1) {
						this.dataList = this.dataList.concat(D.CouponList)
					} else {
						this.dataList = D.CouponList
					}
					if (D.CouponList.length > 0) {
						// this.dataList.length > 0 && 
						pageIndex++;
					}
					// console.log(this.dataList,'this.dataList')
					this.$showLoads(1, '')
				}).catch(e => {})
			},
			tabChange(index) {
				pageIndex = 1
				// console.log(index, 'index')
				this.TabCur = index
				this.getList()
			},
			onCloseInfo(e) {
				if (!e.show) {
					this.showInfo = false
				}
			},
			viewMore(val) {
				// console.log(val)
				this.showInfo = true
				this.currentShowStr = val
			},
			// clickCode(e) {
			// 	// 立即使用  (传的参数过去)
			// 	this.disabledBtn = true
			// 	var _this = this
			// 	wx.navigateTo({
			// 		url: '../couponQRCode/index',
			// 		success: function(res) {
			// 			// 通过eventChannel向被打开页面传送数据
			// 			res.eventChannel.emit('acceptDataFromOpenerPage', {
			// 				data: e.currentTarget.dataset.item
			// 			})
			// 			_this.disabledBtn = false
			// 		}
			// 	})
			// },
			changeCouponActive(e) {
				pageIndex = 1
				this.dataList = []
				this.activeUser = e.detail.index
				this.getList()
			}
		},
		onReachBottom: function() {
			if (this.dataList.length > 0) {
				//获取订单列表
				this.getList()
			}
		},
		onShow: function() {
			pageIndex = 1
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getList()
				})
			} else {
				this.getList()
			}
		}
	}
</script>

<style lang="scss">
	.coupon-list-style {
		min-height: 100vh;
		background: rgb(244, 244, 244);
		/* padding: 10px; */
		box-sizing: border-box;

		.show-head-style {
			text-align: center;
			line-height: 25px;
			border-bottom: 1px solid rgb(177, 176, 176);
			padding-bottom: 10px;
		}

		.text-center {
			text-align: center;
			font-size: 10pt;
		}

		.text-black {
			color: #333333;
		}

		.bg-white {
			background-color: #ffffff;
		}

		.showInfo-style {
			font-size: 11pt;
		}

		.show-head-style {
			text-align: center;
			line-height: 25px;
			border-bottom: 1px solid rgb(177, 176, 176);
			padding-bottom: 10px;
		}

		.show-center-style {
			padding: 15px 0;
			margin-bottom: 5px;
			height: 180px;
			overflow-y: scroll;
		}

		.uni-popup__wrapper-box {
			background: #fff;
		}

	}
</style>
