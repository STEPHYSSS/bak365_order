<template>
	<!-- <wxs module="dateFr" src="../../../../filter/index.wxs"></wxs> -->
	<view style="padding:0px 10px 10px">
		<radio-group :value="currentCodeNo">
			<view v-if="isOrder" @click="onClickCoupon(0)">
				<radio :value="0" class="custom-class-noradio" :checked="currentCodeNo === 0"></radio>
				<text style="font-size: 10pt;">暂不使用券</text>
			</view>


			<view class="radio-couponFa-style" @click="onClickCoupon(item.CodeNo)" v-for="item in dataList" :key="item.CodeNo">
				<view class="saleDateStyle">
					{{item.SaleDate}}
				</view>
				<view class="radio-coupon-style">
					<view class="radio-img-style" style="background-image:url('https://we.bak365.net/SmallProgramSaleOrder/Mobile/img/couponIcon.png')">
						<view v-if="item.Type==2">
							<text style="font-size:22px;font:weight:700">{{item.Discount/10}}</text>
							<text style="font-size:10px;">折</text>
						</view>
						<view v-if="item.Type==1" style="padding:4px 0 0;margin:0">
							<text style="font-size:10pt;">¥</text>
							<text style="font-size:15pt;font:weight:700">{{item.PreValue}}</text>
						</view>
						<view class="radio-limit-style">{{item.MinUseAmt!='0.00'?'满'+item.MinUseAmt+'元可用':'全场通用'}}</view>
					</view>

					<view class="radio-center-style">
						<view class="radio-title-style">{{item.KindName}}</view>
						<view class="radio-info-style">
							{{setCouponInfo(item.Text)}}
							<view class="arrow-more-style" @click.stop="viewMore(item.Text)">
								>>查看更多
							</view>
						</view>
						<!-- <view v-if="item.SaleDate" class="radio-time-style">
						获取时间 {{item.SaleDate}}
					</view> -->
						<view v-if="activeUser != 1" class="radio-time-style">
							有效期 {{item.StartDate}}至{{item.ValidDate}}
						</view>
						<view v-if="item.BackDate" class="radio-time-style">
							使用时间 {{item.BackDate}}
						</view>
					</view>

					<view v-if="!isOrder" class="my-default-btn user-coupon-style">
						<navigator :url="'/pages/indexVip/couponQRCode/index?item='+ encodeURIComponent(JSON.stringify(item))"
						 hover-class="none">
							<button hover-class="btn-hover" class="user-coupon-btn">立即使用</button>
						</navigator>
					</view>

					<view style="flex:1;text-align: right;" v-if="isOrder">
						<radio :value="item.CodeNo" class="custom-class-radio" :checked="item.CodeNo === currentCodeNo"></radio>
					</view>

					<view class="mask-box-style" v-if="activeUser != 0"></view>
				</view>
			</view>
		</radio-group>
		<no-data v-if="dataList.length===0"></no-data>
		<!-- <view class="listCoupon"> -->
		<!-- <uni-popup :show="showInfo" @change="onCloseInfo" class="showInfo-style">
			<view>
				<view class="show-head-style">详细信息</view>
				<view class="show-center-style">
					<text>{{currentShowStr}}</text>
				</view>
				<view :class="'btnMy'+itemColor">
					<button @click="onCloseInfo({show:false})">
						我知道了
					</button>
				</view>
			</view>
		</uni-popup> -->
		<!-- </view> -->
	</view>
	<!-- </template> -->
</template>

<script>
	import noData from '@/components/nodeData/index.vue';
	export default {
		components: {
			noData
		},
		props: {
			dataList: Array,
			activeUser: [Number, String],
			isOrder: {
				type: Boolean,
				default: false
			},
			currentId: [Number, String] //当前点击的
		},
		data() {
			return {
				// dataList: []
				currentCodeNo: 0,
				colorIndex: getApp().globalData.colorIndex
				// showInfo: false
			}
		},
		created() {
			this.currentCodeNo = this.currentId
		},
		methods: {
			onClickCoupon(e) {
				this.currentCodeNo = e
				this.$emit('onClickCoupon', e)
			},
			setCouponInfo(val) {
				var newStr = val.replace(RegExp('~', 'g'), ';')
				var paramsStr = newStr.slice(0, 30)
				return paramsStr
			},
			// onCloseInfo(bool) {
			// 	if (!bool.show) {
			// 		this.showInfo = false
			// 	}
			// },
			viewMore(val) {
				// 查看更多
				var str = val
				str = str.replace(/~/g, '\n')
				// this.currentShowStr = str
				this.$emit('viewMore', str)
				// this.showInfo = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.radio-couponFa-style {
		background: #fff;
		padding: 10px;
		margin-top: 10px;
		border-radius: 5px;
	}

	.radio-coupon-style {
		display: flex;
		position: relative;
	}

	.saleDateStyle {
		padding-bottom: 6px;
		color: rgb(236, 163, 78);
		font-size: 10pt;
	}

	.radio-img-style {
		min-width: 80px;
		width: 80px;
		height: 86px;
		background-size: 100% 100%;
		background-repeat: none;
		margin-right: 12px;
		color: #fff;
		text-align: center;
		box-sizing: border-box;
		padding-top: 14px;
	}

	.radio-limit-style {
		margin-top: 4px;
		font-size: 7pt;
	}

	.radio-center-style {
		color: rgb(148, 146, 146);
		font-size: 8pt;
		width: 50%;
	}

	.radio-title-style {
		margin-top: 4px;
		font-weight: 700;
		font-size: 11pt;
		color: #000;
	}

	.radio-title-order-style {
		margin-top: 15px;
	}

	.arrow-more-style {
		display: inline-block;
		color: rgb(236, 163, 78);
		font-size: 10px;
		line-height: 20px;
	}

	.user-coupon-style {
		text-align: right;
		flex: 1;
	}

	.radio-info-style {
		min-height: 45px;
	}

	.custom-class-radio {
		margin-top: 30px;
		justify-content: flex-end;
	}

	.custom-class-noradio {
		margin-top: 12px;
		margin-left: 10px;
	}

	.mask-box-style {
		position: absolute;
		background: rgba(250, 250, 250, 0.4);
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}


	.user-coupon-btn {
		background: #fdcc63 !important;
		color: #fff !important;
		border: 1px solid #fdcc63 !important;
		margin-top: 29px;
	}

	@media screen and (max-width: 320px) {
		.radio-info-style {
			font-size: 24rpx;
		}

		.radio-time-style {
			font-size: 24rpx;
		}
	}
</style>
