<template>
	<view class="coupon-QR-style">
		<view class="coupon-QRcode-style">
			<view :class="[orderGood?'coupon-barcode-orderGood':'coupon-barcode-style']" style="text-align: center;">
				<view>
					<!-- <canvas style="width:{{windowWidth}}px;max-width:350px;height:80px;margin:0 auto" canvas-id="barcode" /> -->
					<canvas id="barcode" canvas-id="barcode" :style="{width:windowWidth,height:'75px'}"></canvas>
				</view>
				<view class="barcode-str">{{codeStr}}</view>
				<view class="qrcode-style-father">
					<!-- <canvas style="width:{{windowWidth}}px;height:230px;" class="qrcode-style" canvas-id="qrcode" /> -->
					<canvas class="qrcode-style" id="qrcode" canvas-id="qrcode" :style="{width:windowWidth,height:'240px'}"></canvas>

					<view>{{codeStr}}</view>
					<view class="qrcode-style-tip">请向收银员出示</view>
					<!-- <view style="color: rgb(236, 163, 78);" bindtap="clickUserInfo">使用说明</view> -->
				</view>
			</view>
			<view style="padding:5px 10px 10px;" v-if="!orderGood">
				<view class="coupon-info-style">
					<text>名称</text>
					<text style="float:right">{{couponInfo.KindName}}</text>
				</view>
				<view class="coupon-info-style" v-if="couponInfo.PreValue>0">
					<text>面值</text>
					<text style="float:right">¥{{couponInfo.PreValue}}</text>
				</view>
				<view class="coupon-info-style">
					<text>金额限制</text>
					<text style="float:right">订单满{{couponInfo.MinUseAmt}}元可用</text>
				</view>
				<view class="coupon-info-style">
					<text>使用时间</text>
					<text style="float:right">{{couponInfo.StartDate}}至{{couponInfo.ValidDate}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	const app = getApp()
	const {
		barcode,
		qrcode
	} = require('@/utils/codeChange/index.js')
	export default {
		data() {
			return {
				codeStr: '',
				windowWidth: 0,
				couponInfo: {},
				// 是否是商品提货码
				orderGood: false
			}
		},
		onLoad: function(option) {
			// console.log(option, 'option')

			uni.setNavigationBarTitle({
				title: option.orderGood ? '提货码' : '使用优惠券'
			});
			let item
			if (option.orderGood) {
				this.orderGood = option.orderGood
				item = option.item
			} else {
				item = JSON.parse(decodeURIComponent(option.item));
				// console.log(item, ';item')
				this.couponInfo = item
			}
			var codeId = this.orderGood ? item : item.CodeNo
			let wWidth = uni.getSystemInfoSync().windowWidth - 40 - 30
			this.windowWidth = (wWidth > 350 ? 350 : wWidth) + 'px'
			this.codeStr = codeId
			setTimeout(() => {
				barcode('barcode', codeId, this.windowWidth, 70);
				qrcode('qrcode', codeId, 250, 250);
			}, 100)
		}
	}
</script>

<style scoped>
	.coupon-QR-style {
		background: #242424;
		min-height: 100vh;
		/* height:100%; */
		padding: 15px;
		box-sizing: border-box;
		/* min-height:100%; */
		font-size: 12pt;
	}

	.coupon-QRcode-style {
		background: #fff;
		height: 100%;
		border-radius: 5px;
		padding: 8% 0 5px;
	}

	.barcode-str {
		text-align: center;
	}

	.qrcode-style {
		margin-left: 50%;
		transform: translateX(-125px);
	}

	.qrcode-style-father {
		color: #777;
	}

	.qrcode-style-tip {
		margin-top: 8px;
	}

	.coupon-barcode-orderGood {
		padding-bottom: 10px;
		padding: 0 20px 15px;
	}

	.coupon-barcode-style {
		padding-bottom: 10px;
		padding: 0 20px 15px;
		border-bottom: 1px dashed #838181;
		position: relative;
	}

	.coupon-barcode-style::after,
	.coupon-barcode-style::before {
		content: '';
		width: 10px;
		height: 10px;
		background: #242424;
		border-radius: 50%;
		position: absolute;
		bottom: -5px;
	}

	.coupon-barcode-style::after {
		left: -5px;
	}

	.coupon-barcode-style::before {
		right: -5px;
	}

	.coupon-info-style {
		color: #777;
		margin-top: 10px;
		font-size: 10pt;
	}

	.showInfo-style {
		width: 90%;
		padding: 10px;
		border-radius: 5px;
	}
</style>
