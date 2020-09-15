<template>
	<view class="orderStoreInfo" v-if="orderInfo.OrderID">
		<view class="orderNum">
			<view style="flex:1;">
				<text class="icon orderNumIcon">&#xe601;</text>
				{{orderInfo.OrderID}}
			</view>

			<view class="my-default-btn copyBtn">
				<button class="" @click="bindCopy">复制</button>
			</view>
		</view>

		<view class="setPackArea" v-if="orderInfo.ConsigneeName">
			<view>
				<view class="setPackAreaLocation">
					<text class="icon" style="margin-right:4px">&#xe64f;</text><text>{{orderInfo.ConsigneeAddress}}</text>
				</view>
				<view>
					<text class="icon" style="margin-right:4px">&#xe633;</text><text>{{orderInfo.ConsigneeMobile}} &nbsp;{{orderInfo.ConsigneeName}}</text>
				</view>
			</view>
		</view>

		<view class="goods-box-style" v-for="(item,index) in orderList" :key="index">
			<goods-box :isOrder="true" :itemData="item"></goods-box>
		</view>
		<view class="goodVal" v-if="orderInfo.MemoStr">
			商品留言: &nbsp;{{orderInfo.MemoStr}}
		</view>

		<view class="priceStyle">
			<view style="padding:5px 0;">
				<cmd-cell-item v-if="orderInfo.Consume>0" :border="false" title="商品总价" :addon="'¥'+orderInfo.Consume" class="custom-class" />

				<cmd-cell-item v-if="orderInfo.PackingFeeAmt>0" :border="false" title="打包费" :addon="'+¥'+orderInfo.PackingFeeAmt" />

				<cmd-cell-item v-if="orderInfo.Freight>0" :border="false" title="配送费" :addon="'+¥'+orderInfo.Freight" />
				<cmd-cell-item v-if="orderInfo.CashFloat>0" :border="false" title="优惠金额" :addon="'-¥'+orderInfo.CashFloat" />

				<cmd-cell-item v-if="orderInfo.CodePayed>0" :border="false" title="券抵扣" :addon="'-¥'+orderInfo.CodePayed" />
			</view>

			<view class="payment">
				<text class="paymentRight">付款金额 &nbsp;¥{{setDecimalFun(orderInfo.PayedAmt)}}</text>
			</view>
			<view class="my-default-btn" v-if="ActiveInfo.GroupNo" style="width: 100%;text-align: right;">
				<button @click="viewCollage" style="color:#D82F37;border-color:#D82F37;margin-right: 10px;">
					查看拼团</button>
			</view>

			<view class="paymentBtn">
				<view class="my-default-btn" v-if="orderInfo.Status === '0'">
					<button @click="bindCallphone(1)" style=" color:#3062A5;border-color:#3062A5">
						支付</button>
				</view>
				<view class="my-default-btn" v-if="orderInfo.Status === '0'||orderInfo.OrderIsRefund==='1'">
					<button style="margin-left: 10px" @click="bindCallphone(2)">
						取消订单</button>
				</view>
				<view class="my-default-btn" v-if="orderInfo.FinTypes==='3'&&orderInfo.Status==='3'">
					<button @click="takeOverFun" style=" color:#D82F37;border-color:#D82F37">
						确定收货</button>
				</view>

				<view class="my-default-btn" v-if="orderInfo.OrderTakeGoodsQrCode==='1'">
					<!-- <button @click="deliveryCode" style=" color:#D82F37;border-color:#D82F37">
						提货码</button>
 -->
					<navigator :url="'/pages/indexVip/couponQRCode/index?orderGood=true&item='+ orderInfo.OrderID" hover-class="none">
						<button @click="deliveryCode" style=" color:#D82F37;border-color:#D82F37">
							提货码</button>
					</navigator>
				</view>
			</view>
		</view>

		<view class="orderData">
			<view class="orderTime" v-if="seatNumber">
				<view class="orderTime_label">座位号：</view>
				<view style="font-weight: 700;display: inline-block;">{{seatNumber}}</view>
			</view>
			<view class="orderTime" v-if="orderInfo.OrderSort">
				<view class="orderTime_label">订单序号：</view>
				<view style="font-weight: 700;display: inline-block;">{{orderInfo.OrderSort}}</view>
			</view>
			<view class="orderTime">
				<view class="orderTime_label">取餐类型：</view>{{orderInfo.AppointMentTypeName}}
			</view>
			<view class="orderTime" v-if="orderInfo.FinTime">
				<view class="orderTime_label">预约取餐时间：</view>{{orderInfo.FinTime}}
			</view>
			<view class="orderTime">
				<view class="orderTime_label">下单时间：</view>{{orderInfo.PreTime}}
			</view>
			<view class="orderTime">
				<view class="orderTime_label">用餐方式：</view>{{orderInfo.FinTypeName}}
			</view>
			<view class="orderTime" v-if="orderInfo.Status !== '0'||orderInfo.Status !== '-1'">
				<view class="orderTime_label">支付方式：</view>{{orderInfo.PayType}}
			</view>
			<view class="orderTime">
				<view class="orderTime_label">订单状态：</view>{{orderInfo.StatusName}}
			</view>
		</view>

		<uni-popup :show="showPayType" @change="onClone">
			<view class="custom-class-popup">
				<view class="change-pay-style">选择支付方式</view>
				<view style="text-align: center;">
					<view style="display: inline-block;margin-right:10px;">
						<uni-tag type="success" v-if="isWeix&&payInfo.WX_WxPay=='1'" text="微信支付" @click="weapPay"></uni-tag>
						<uni-tag type="success" v-if="!isWeix&&payInfo.WX_AlipayPay=='1'" text="支付宝支付" @click="weapPay"></uni-tag>
					</view>
					<uni-tag v-if="payInfo.WX_CardBalance>orderInfo.PayedAmt&&payInfo.WX_CardPay=='1'" text="会员卡支付" @click="cardPay"></uni-tag>
				</view>
			</view>
		</uni-popup>
		<!-- 	<uni-popup :show="showIncome" @change="onCloneIncome">
			<view :class="['income-class-popup','theme'+colorIndex]">
				<view style="margin-bottom:20px">确定收货？</view>
				<button class="cu-btn" @click="showIncome = false">取消</button>
				<button class="cu-btn bg-cu-btn" style="margin-left:10px" @click="IncomeFun">确定</button>
			</view>
		</uni-popup> -->

		<!-- <uni-popup :show="showCode" ref="CodeChangePopup">
			<view>
				
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	import cmdCellItem from '@/components_uni/cmd-cell-item/cmd-cell-item.vue';
	import uniPopup from "@/components_uni/uni-popup/uni-popup.vue"
	import uniTag from "@/components_uni/uni-tag/uni-tag.vue"
	import goodsBox from "@/components/goodsBox/index.vue"
	import {
		weChatPayment,
		setDecimal
	} from '@/utils/utils.js';

	const app = getApp()

	export default {
		components: {
			cmdCellItem,
			uniPopup,
			uniTag,
			goodsBox
		},
		data() {
			return {
				// 订单列表
				orderList: [],
				orderId: '',
				orderInfo: {},
				// 支付详情
				payInfo: {},
				// 座位号
				seatNumber: '',
				showPayType: false,
				showInfo: false,
				// 是否是微信
				isWeix: app.globalData.provider === 'weixin' ? true : false,
				colorIndex: app.globalData.colorIndex,
				// 控制调微信接口
				PayDisabled: false,
				// showIncome: false,
				ActiveInfo: {}
			}
		},
		onLoad: function(options) {
			this.orderId = options.id || ''
			this.seatNumber = app.globalData.tableNumber
		},
		methods: {
			setDecimalFun(val) {
				return setDecimal(val)
			},
			getData() {
				this.$showLoads(0, '')
				APIList.api('OrderDetail.aspx', {
					OrderID: this.orderId
				}).then(D => {
					this.$showLoads(1, '')
					D.PayInfo.WX_CardBalance = Number(D.PayInfo.WX_CardBalance)
					D.OrderInfo.PayedAmt = Number(D.OrderInfo.PayedAmt)
					this.orderInfo = D.OrderInfo
					this.orderList = D.ProdInfo
					this.payInfo = D.PayInfo
					this.ActiveInfo = D.ActiveInfo || {}
				}).catch(e => {})
			},
			bindCopy() {
				// e.currentTarget.dataset.copydata
				// 获取复制的编号 ！！
				// console.log(this.orderInfo.OrderID,'this.orderInfo.OrderID')
				uni.setClipboardData({
					data: this.orderInfo.OrderID,
					success(res) {
						uni.showToast({
							title: "复制成功"
						});
					}
				})
			},
			bindCallphone(e) {
				// console.log(e, 'rerrr')
				let status = e
				let orderid = this.orderInfo.OrderID
				if (status === 1) {
					// 支付
					if (this.payInfo.PrePayType == '2' || this.payInfo.PrePayType == '3') {
						// 微信或支付宝支付
						this.weapPay()
					} else if (this.payInfo.PrePayType === '1') {
						// 卡支付
						this.cardPay()
					} else {
						if (Number(this.payInfo.WX_CardBalance) < Number(this.orderInfo.PayedAmt)) {
							this.weapPay()
						} else {
							// 		// 自己选择支付方式
							this.showPayType = true
						}
						// else if (this.payInfo.WX_WxPay=='1') {
						// 	payInfo.WX_AlipayPay=='1'
						// 	payInfo.WX_CardPay=='1'
						// } 
					}
				} else {
					let _this = this
					uni.showModal({
						title: '提示',
						content: '确定取消订单？',
						success: function(res) {
							if (res.confirm) {
								APIList.api('/Public/Submit_ajax.aspx', {
									Type: 'OrderCancel',
									OrderID: orderid
								}).then(D => {
									uni.showToast({
										title: D.Msg,
										icon: 'none'
									});
									setTimeout(() => {
										_this.getData()
									}, 1000)
								}).catch(e => {})
							} else if (res.cancel) {}
						}
					});
				}
			},
			weapPay() {
				if (this.PayDisabled) {
					return
				}
				this.PayDisabled = true
				let providerNew = app.globalData.provider
				// console.log(providerNew, 'providerNew')
				var _url = providerNew === 'weixin' ? '/Public/WxPay/WxPay.aspx' : '/Public/AliPay/AliPay.aspx'
				APIList.api(_url, {
					OrderID: this.orderInfo.OrderID
				}).then(D => {
					//发起支付请求
					weChatPayment(app, this.orderInfo.OrderID, D)
					this.PayDisabled = false
				}).catch(err => {
					this.PayDisabled = false
					console.log(err, 3333)
				})
				this.showPayType = false
			},
			cardPay() {
				uni.navigateTo({
					url: '../../indexCanteen/cardPayment/index?id=' + this.orderInfo.OrderID + '&isOrder=' + true
				})
				this.showPayType = false
			},
			onClone(e) {
				if (!e.show) {
					this.showPayType = false
				}
			},
			onCloneIncome(e) {
				// if (!e.show) {
				// 	this.showIncome = false
				// }
			},
			IncomeFun() {
				APIList.api('Public/Submit_ajax.aspx?Type=OrderTake', {
					OrderID: this.orderInfo.OrderID
				}).then(D => {
					uni.showToast({
						title: '确定收货成功！',
						icon: 'none'
					});
					// this.showIncome = false
					setTimeout(() => {
						this.getData()
					}, 1000);
				}).catch(err => {
					console.log(err, 3333)
				})
			},
			takeOverFun() {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确定收货？',
					success: function(res) {
						if (res.confirm) {
							_this.IncomeFun()
						} else if (res.cancel) {}
					}
				});
				// this.showIncome = true
			},
			deliveryCode() {},
			viewCollage() {
				let ActiveID = this.ActiveInfo.ActiveID
				let GroupNo = this.ActiveInfo.GroupNo
				uni.navigateTo({
					url: '/pages/indexCanteen/collage/info?ActiveID=' + ActiveID + '&GroupNo=' + GroupNo
				});
			}
		},
		onShow: function() {
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getData()
				})
			} else {
				this.getData()
			}
		}
	}
</script>

<style scoped lang="scss">
	.orderStoreInfo {
		background: #eee;
		min-height: 100vh;
		font-size: 11pt;
	}

	.setPackArea {
		background: #fff;
		padding: 12px 10px;
		border-bottom: 1px dashed #eee;

		.setPackAreaLocation {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.orderNum {
		padding: 5px;
		color: #707070;
		border-top: 8px solid #eee;
		border-bottom: 1px dashed #eee;
		display: flex;
	}

	.goods-box-style,
	.orderNum,
	.priceStyle,
	.orderData {
		background: #fff;
	}

	.orderNumIcon {
		vertical-align: middle;
		font-size: 14pt;
		margin-right: 5px;
	}

	.copyBtn {
		float: right;
	}

	.priceStyle {
		border-top: 8px solid #eee;
	}

	.custom-class {
		color: rgb(71, 70, 70) !important;
	}

	.value-class {
		font-weight: 600;
		color: #000 !important;
	}

	.payment {
		text-align: right;
		padding: 15px 10px;
		/* border-bottom: 8px solid #eee; */
		border-top: 1px solid #eee;
	}

	.paymentLeft {
		margin-right: 10px;
	}

	.paymentRight {
		font-weight: 700;
	}

	.orderData {
		border-top: 8px solid #eee;
		font-size: 13px;
		color: #707070;
		padding: 10px 10px 0 10px;
	}

	.orderTime {
		padding-bottom: 10px;

	}

	.orderTime .orderTime_label {
		width: 92px;
		text-align: right;
		margin-right: 4px;
		display: inline-block;
	}

	.paymentBtn {
		background: #fff;
		text-align: right;
		margin-right: 10px;
		padding-bottom: 15px;
	}

	.custom-class-popup {
		background: #FFFFFF;
		padding: 20px;
		max-width: 310px;
	}

	.change-pay-style {
		text-align: center;
		margin-bottom: 8px;
	}

	.van-cell {
		padding: 5px 15px 0 !important;
	}

	.goodVal {
		background: rgb(255, 255, 255);
		margin-bottom: 10px;
		line-height: 34px;
		padding-left: 5px;
		color: rgb(119, 119, 119);
		font-size: 11pt;
	}

	.income-class-popup {
		background: #fff;
		max-width: 320px;
		text-align: center;
		padding: 18px;
	}
</style>
