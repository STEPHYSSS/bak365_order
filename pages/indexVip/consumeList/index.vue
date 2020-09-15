<template>
	<view class="consume-style">
		<wuc-tab textFlex :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" tab-class="text-center text-black bg-white"
		 :select-class="'btnMy'+colorIndex"></wuc-tab>
		<view v-for="(tabItem,index) in dataList" :key="tabItem.ExchNo">
			<view class="listTemplate">
				<view class="operation-time">
					操作时间：
					<text class="opera-time-title"> {{tabItem.OptDate}}</text>
				</view>
				<view class="operation-info">
					<view v-if="tabItem.ShowType!=2" class="order-number">
						订单编号：
						<text>{{tabItem.ExchNo}}</text>
					</view>

					<view v-if="tabItem.ShowType==0">
						<view class="h3">
							卡充值额：
							<text>{{tabItem.Income}}</text>
						</view>
						<view class="h3" v-if="tabItem.Donate!=0">
							卡赠送额：
							<text>{{tabItem.Donate}}</text>
						</view>
					</view>

					<view v-if="tabItem.ShowType==1">
						<view class="h3">
							卡支付额：
							<text>{{tabItem.CardPayed}}</text>
						</view>
						<view class="h3">
							订单金额：
							<text>{{tabItem.Consume}}</text>
						</view>
						<view class="right-col shop-consume">
							<view>{{tabItem.TypeName}}</view>
						</view>
					</view>

					<view v-if="tabItem.ShowType==2">
						<view class="h3">
							{{tabItem.ScoreType}}:
							<text>{{tabItem.ScoAmt}}分</text>
						</view>
						<view>
							积分来源：
							<text>{{tabItem.ScoreTypeName}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<no-data v-if="dataList.length===0"></no-data>
	</view>
</template>

<script>
	import WucTab from '@/components_uni/wuc-tab/wuc-tab.vue';
	import noData from '@/components/nodeData/index.vue';
	import APIList from '@/api/http.js';
	const app = getApp()
	export default {
		components: {
			WucTab,
			noData
		},
		data() {
			return {
				//Type=0：消费记录   Type=1：积分记录
				TabCur: 0,
				tabList: [{
					name: '消费记录'
				}, {
					name: '积分记录'
				}],
				colorIndex: getApp().globalData.colorIndex,
				dataList: []
			}
		},
		onLoad: function(options) {
			// console.log(options.type,'options.type')
			this.TabCur = Number(options.type) || 0
		},
		methods: {
			tabChange(index) {
				this.TabCur = index;
				this.getList()
			},
			getList() {
				this.$showLoads(0, '')
				APIList.api('CardConsumeRecord.aspx', {
					Type: this.TabCur
				}).then(D => {
					this.$showLoads(1, '')
					this.dataList = D.ConsumeRecordInfo
				}).catch(e => {
				})
			}
		},
		onShow: function() {
			this.$showLoads(0, '')
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
	.consume-style {
		.text-center {
			text-align: center;
			font-size: 10pt;
		}

		.text-black {
			color: #333333;
		}

		.bg-white {
			background-color: #ffffff;
			border-bottom:1px solid rgb(238, 238, 238) !important;
		}

		.listTemplate {
			border-bottom: 6px solid #eee;
			padding: 8px 15px;
			color: rgb(95, 95, 95);
			font-size: 10pt;
			line-height: 2;
			background: #FFFFFF;
		}

		.operation-time {
			border-bottom: 1px solid #eee;
			padding-bottom: 8px;
		}

		.opera-time-title {
			color: #ee0a24;
		}

		.operation-info {
			position: relative;
			padding: 4px 0 0 10px;
		}

		.h3 {
			line-height: 1.5;
		}

		.shop-consume {
			position: absolute;
			top: 10px;
			right: 10px;
			color: #f08300;

		}

		.order-number {
			color: #f08300;
		}
	}
</style>
