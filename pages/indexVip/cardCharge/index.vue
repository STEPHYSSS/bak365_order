<template>
	<view class="card-charge-style">
		<view class="charge-store" v-if="!loading">充值的门店:&nbsp;{{ShopName}}</view>
		<view class="weiFullCenter" v-if="!loading">
			<view v-for="(item,index) in IncomeList" :key="index" class="IncomeList-style">
				<view @click="showPopup(index)" :class="{weiFullBox:true,backColor:index === currentIndex&&show,backBorder:index === currentIndex&&show}">
					<view>
						¥&nbsp;<span class="moneyTop">{{item.IncomeAmt}}</span>
						<view class="moneyBottom">{{item.IncomeName}}</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding:10px 10px;margin-top:25px;" :class="'btnMy'+colorIndex" v-if="!loading&&!show&&IncomeList.length>0">
			<button @click="clickSubmit(false)">立即充值</button>
		</view>

		<uni-popup :show="show" type="bottom" @change="pouponShow" ref="popupRef">
			<span class="titleDialog">充值有礼相送</span>
			<div class="contentDialog">
				<span>充值金额{{IncomeList[currentIndex].IncomeAmt}}元</span>
				<ol>
					<li v-if="IncomeList[currentIndex].SendDonate>0">赠送金额{{IncomeList[currentIndex].SendDonate}}元</li>
					<li v-if="IncomeList[currentIndex].SendScore>0">赠送积分{{IncomeList[currentIndex].SendScore}}</li>
					<li v-if="IncomeList[currentIndex].SendProdContent">赠送商品{{IncomeList[currentIndex].SendProdContent}}</li>
					<li v-if="IncomeList[currentIndex].SendProgContent">赠送券{{IncomeList[currentIndex].SendProgContent}}</li>
				</ol>
			</div>
			<view style="margin-top:25px;" :class="'btnMy'+colorIndex">
				<button @click="clickSubmit(true,IncomeList[currentIndex].IncomeID)" :disabled="disabledBtn">立即充值</button>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	let app = getApp()
	import {
		weChatPayment
	} from '@/utils/utils.js';
	import APIList from '@/api/http.js'
	import uniPopup from '@/components_uni/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				loading: true,
				IncomeList: [],
				show: false,
				currentIndex: null,
				colorIndex: app.globalData.colorIndex,
				provider: app.globalData.provider,
				ShopName: '',
				disabledBtn: false
			}
		},
		onShow() {
			if (!app.globalData.shopNo) {
				// console.log(app.globalData.shopNo, 'app.globalData.shopNo')
				uni.redirectTo({
					url: '/pages/indexCanteen/changeStore/index?isCardPay=' + true
				})
				return
			}

			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(() => {
					this.getList()
				})
			} else {
				this.getList()
			}
		},
		methods: {
			getList() {
				this.$showLoads(0, '')
				this.loading = true
				APIList.api('CardIncomeList.aspx').then(D => {
					this.$showLoads(1, '')
					this.loading = false
					this.IncomeList = D.CardIncomeInfo
					this.ShopName = D.ShopInfo.ShopName
				}).catch(err => {
					this.loading = false
				})
			},
			showPopup(i) {
				this.show = true
				this.currentIndex = i
			},
			clickSubmit(bool, id) {
				if (!bool) {
					uni.showToast({
						title: '请选择充值面额',
						icon: 'none'
					});
				} else {
					
					this.disabledBtn = true
					this.$showLoads(0)
					let orderSource = app.globalData.provider === 'weixin' ? 1 : 2
					let _url = app.globalData.provider === 'weixin' ? 'Public/WxPay/WxPay.aspx' : 'Public/AliPay/AliPay.aspx'
					APIList.api('Public/Submit_ajax.aspx', {
						Type: 'CardIncome',
						OrderSource: orderSource,
						IncomeID: id
					}).then(D => {
						this.$showLoads(1)
						APIList.api(_url, {
							OrderID: D.Msg
						}).then(data => {
							this.show = false
							if (this.provider === 'weixin') {
								this.subscribeMessage(D.Msg, data, D.TempMessageID)
							} else {
								weChatPayment(app, D.Msg, data, true)
							}
							this.disabledBtn = false
						}).catch(e => {
							this.show = false
							this.disabledBtn = false
						})
					}).catch(err => {
						this.disabledBtn = false
						console.log('Submit_ajax.aspx,失败')
					})
				}
			},
			subscribeMessage(Msg, data, TempMessageID) {
				let that = this
				try {
					if (TempMessageID != "") {
						wx.requestSubscribeMessage({
							tmplIds: ['' + TempMessageID + ''],
							success: function(res) {
								weChatPayment(app, Msg, data, true)
							},
							fail: function(res) {
								// uni.showToast({
								// 	title: res.errMsg,
								// 	icon: 'none'
								// });
								setTimeout(function() {
									weChatPayment(app, Msg, data, true)
								}, 1000)
							}
						})
					} else {
						weChatPayment(app, Msg, data, true)
					}
				} catch (e) {
					// uni.showToast({
					// 	title: e.message,
					// 	icon: 'none'
					// });
					setTimeout(function() {
						weChatPayment(app, Msg, data, true)
					}, 1000)
				}
			},
			pouponShow(bool) {
				if (!bool.show) {
					this.show = false
				}
			}
		}
	}
</script>

<style lang="scss">
	.card-charge-style {
		.uni-popup__wrapper {
			background: #fff;
		}

		.charge-store {
			font-size: 10pt;
			color: #777;
			line-height: 25px;
			margin-left: 10px;
			text-align: center;
			margin-top: 10px;
		}

		.titleDialog {
			display: inline-block;
			width: 100%;
			height: 34px;
			line-height: 34px;
			text-align: center;
			font-size: 13pt;
		}

		.contentDialog {
			word-wrap: break-word;
			word-break: normal;
			background: #eeeeee;
			padding: 10px 20px;
			border-radius: 20px;
			font-size: 12pt;

			ol {
				list-style-type: none;
				counter-reset: sectioncounter;

				li:first-child {
					margin-top: 15px;
				}

				li:before {
					content: counter(sectioncounter) "、";
					counter-increment: sectioncounter;
				}
			}

			span:first-child {
				display: inline-block;
				font-weight: bold;
			}
		}

		.weiFullCenter {
			padding: 10px;
			display: flex;
			flex-wrap: wrap;

			.IncomeList-style {
				width: 50%;
			}



			.backColor {
				background: rgba(253, 204, 99, 0.3);
			}

			.backBorder {
				border: 1px solid #fdcc63 !important;
			}

			.weiFullBox {
				border-radius: 10px;
				box-shadow: 1px 1px 3px 3px #e0e0e0;
				border: 1px solid #fff;
				height: 80px;
				margin-bottom: 10px;
				padding: 0 20px;

				.moneyTop {
					display: inline-block;
					font-size: 20px;
					font-weight: bold;
					margin-top: 20px;
					line-height: 18px;
				}

				.moneyBottom {
					display: inline-block;
					margin-top: 4px;
					width: 90%;
					/*加省略号*/
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 14px;
					color: rgb(102, 102, 102);
				}

				.amountBoxImg {
					width: 100%;
					height: 100%;
					border-radius: 10px;
				}
			}

			.IncomeList-style:nth-child(2n) .weiFullBox {
				margin-left: 5px !important;
			}

			.IncomeList-style:nth-child(2n-1) .weiFullBox {
				margin-right: 5px !important;
			}
		}
	}
</style>
