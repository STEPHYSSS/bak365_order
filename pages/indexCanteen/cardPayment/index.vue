<template>
	<!--pages/orderCardPay/orderCardPay.wxml-->
	<view class='container js-modal-login'>
		<form @submit="OrderCardPay" :report-submit="true">
			<view class='content account-form bind-taobao'>
				<view class='form-title big'>
					微卡支付
				</view>
				<view class='block block-form margin-bottom-normal'>
					<view class='block-item'>
						<view class='label' style="text-indent:10px;"> 微卡余额</view>
						<input type='digit' style="padding-left:10px;" :value='dataInfo.CardBalance' name="balance" disabled="true"></input>
					</view>
					<view class='block-item'>
						<view class='label' style="text-indent:10px;">本次支付</view>
						<input type='digit' style="padding-left:10px;" :value='dataInfo.CardPayedAmt' name="payedAmt" disabled="true"></input>
					</view>
					<view class='block-item' v-if="dataInfo.CardCashFloat&&dataInfo.CardCashFloat>0">
						<view class='label' style="text-indent:10px;">卡优惠</view>
						<input type='digit' style="padding-left:10px;" :value='dataInfo.CardCashFloat' name="payedAmt" disabled="true"></input>
					</view>
					<view class='block-item' v-if="isCardPass">
						<view class='label' style="text-indent:10px;">微卡密码</view>
						<input type='text' password="true" style="padding-left:10px;" placeholder='请输入密码' name="password"></input>
					</view>
				</view>
				<view class='action-container'>
					<button form-type="submit" class='btn-pay btn btn-block btn-large btn-codpay btn-green'>确认支付</button>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	const app = getApp()
	export default {
		data() {
			return {
				orderID: '',
				isCardPass: true,
				dataInfo: {},
				isOrder: false,
				loading: false
			}
		},
		methods: {
			OrderCardPay(e) {
				if (this.loading) {
					return
				}
				var formid = e.detail.formId
				if (!formid) formid = ""
				var password = e.detail.value.password
				if (Number(this.dataInfo.CardBalance) < Number(this.dataInfo.CardPayedAmt)) {
					uni.showToast({
						title: '卡余额不足',
						icon: 'none',
						mask: true,
						duration: 1000
					})
					return
				}
				if (password == "" && this.isCardPass) {
					uni.showToast({
						title: '请填写密码' || '',
						icon: 'none',
						mask: true,
						duration: 1000
					})
					return
				}

				this.loading = true
				this.$showLoads(0, '提交订单中...') //加载
				APIList.api('Public/Submit_ajax.aspx', {
					Type: 'CardPay',
					OrderID: this.orderID,
					PassWord: e.detail.value.password || '',
					FormID: formid
				}).then(D => {
					this.$showLoads(1, '')
					setTimeout(() => {
						if (this.isOrder) {
							uni.navigateBack({
								delta: 1
							})
						} else {
							// orderStoreInfo
							uni.redirectTo({
								url: '../../indexOrder/orderInfo/index?id=' + this.orderID
							})
						}
						uni.showToast({
							title: '支付成功',
							mask: true
						})
					}, 1000)
					this.loading = false
				}).catch(e => {
					setTimeout(() => {
						if (this.isOrder) {
							uni.navigateBack({
								delta: 1
							})
						} else {
							uni.redirectTo({
								url: '../../indexOrder/orderInfo/index?id=' + this.orderID
							})
						}
					}, 1000)
					this.loading = false
				})
			}
		},
		onLoad: function(options) {
			// console.log(options.id)
			this.isOrder = options.isOrder ? options.isOrder : false
			this.orderID = options.id
			this.$showLoads(0, '')
			APIList.api('OrderPay.aspx', {
				OrderID: options.id
			}).then(D => {
				this.isCardPass = D.CardPayNotPass == 1 ? false : true
				this.dataInfo = D
				this.$showLoads(1, '')
			}).catch(e => {})
		}
	}
</script>

<style scoped lang="scss">
	button {
		height: auto;
	}

	.content {
		width: 100%;
		margin: 0 auto;
	}

	.account-form {
		overflow: hidden;
	}

	.container .content {
		zoom: 1;
	}

	.account-form .form-title {
		margin: 25px 0 10px;
		padding: 0 12px;
		line-height: 24px;
		font-size: 14px;
		color: #7c7b83;
		text-transform: uppercase;
		text-shadow: 0 1px rgba(255, 255, 255, 0.2);
	}

	.account-form .big {
		font-size: 20px;
		text-align: center;
		color: #7c7b83;
	}

	.block {
		overflow: hidden;
		-webkit-border-image: url(http://wxd.bak365.net/wxcs/MobileHtml/PrePur5/img/border-line-2.png) 2 stretch;
		-moz-border-image: url(http://wxd.bak365.net/wxcs/MobileHtml/PrePur5/img/border-line-2.png) 2 stretch;
		border-image: url(http://wxd.bak365.net/wxcs/MobileHtml/PrePur5/img/border-line-2.png) 2 stretch;
		border-top: 2px solid #e5e5e5;
		border-bottom: 2px solid #e5e5e5;
		margin: 10px 0;
		background-color: #fff;
		display: block;
		position: relative;
		font-size: 14px;
	}

	.block {
		border-top-width: 1px;
		border-bottom-width: 1px;
	}

	.block.block-form {
		width: 100%;
		margin: 0;
		padding: 0;
		padding-left: 10px;
		padding-right: 10px;
		list-style: none;
		font-size: 14px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}

	.block.block-form.margin-bottom-normal {
		margin-bottom: 20px;
	}

	.block-item {
		position: relative;
		display: block;
		padding: 10px;
		line-height: 22px;
		border: 0px none;
		-webkit-border-image: url(http://wxd.bak365.net/wxcs/MobileHtml/PrePur5/img/border-line.png) 2 stretch;
		-moz-border-image: url(http://wxd.bak365.net/wxcs/MobileHtml/PrePur5/img/border-line.png) 2 stretch;
		border-image: url(http://wxd.bak365.net/wxcs/MobileHtml/PrePur5/img/border-line.png) 2 stretch;
		border-bottom: 2px solid #e5e5e5;
		overflow: hidden;
	}

	.block.block-form .block-item {
		display: table;
		width: 100%;
		padding: 0;
	}

	.block.block-form .block-item:last-child {
		border-bottom: 0px none;
	}

	.block.block-form .block-item .label {
		display: table-cell;
		width: 90px;
		padding: 10px 0;
		vertical-align: middle;
	}

	.block.block-form .block-item textarea,
	.block.block-form .block-item input,
	.block.block-form .block-item select,
	.block.block-form .block-item a,
	.block.block-form .block-item span {
		display: table-cell;
		overflow: hidden;
		padding: 10px 0;
		min-height: 28px;
		line-height: 28px;
		font-size: 14px;
	}

	.block.block-form .block-item textarea,
	.block.block-form .block-item input,
	.block.block-form .block-item select {
		background-color: #fff;
		border: 0px none;
		outline: none;
	}

	.action-container {
		padding: 0 10px;
		text-align: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.account-form button {
		border: 1px solid #e5e5e5;
	}

	.btn.btn-green {
		color: #fff;
		background-color: #06bf04;
		border-color: #03b401;
	}

	.btn.btn-block {
		text-align: center;
		width: 100%;
		padding: 11px 10px;
		font-size: 16px;
		line-height: 16px;
		border-radius: 4px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
</style>
