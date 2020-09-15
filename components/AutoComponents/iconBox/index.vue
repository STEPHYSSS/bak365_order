<template>
	<div class="iconBox-style">
		<div v-if="propsData.HtmlInfo.length===1">
			<div style="width:100%;height:80px;" @click="clickMyCoupon(propsData.HtmlInfo[0].LinkUrl)">
				<image :src="propsData.HtmlInfo[0].ImgUrl" style="width:100%;height:100%"></image>
			</div>
		</div>
		<view class="box-style-view" v-if="propsData.HtmlInfo.length>1">
			<view class="box-style-view-chil" :style="{width:boxWidth + '%'}" @click="clickMyCoupon(item.LinkUrl)" v-for="(item,index) in propsData.HtmlInfo"
			 :key="index">
				<div>
					<navigator :url="item.LinkUrl" style="display: flex;justify-content:center">
						<image :src="item.ImgUrl" class="vip-card-img" @load="loadImg" :style="{'width': imgWidth+'px','height':imgWidth+'px'}"></image>
						<!-- <view class="vip-card-font"我的优惠券</view> -->
					</navigator>
				</div>
			</view>
		</view>
	</div>
</template>

<script>
	export default {
		props: {
			propsData: {
				type: Object,
				default () {
					return {
						HtmlInfo: [
							// {
							// 	ImgUrl: '../../../static/images/coupon/top.png',
							// 	url: '1111'
							// }
						]
					}
				}
			}
		},
		data() {
			return {
				boxWidth: '',
				imgWidth: ''
			}
		},
		created() {},
		mounted() {
			this.boxWidth = this.propsData.HtmlInfo.length > 4 ? '25' : parseInt(100 / this.propsData.HtmlInfo.length)
		},
		methods: {
			clickMyCoupon(url) {
				if (url === '/pages/indexVip/index' || url === '/pages/indexCanteen/index' || url ===
					'/pages/indexOrder/oderList/index') {
					uni.switchTab({
						url: url
					})
				} else {
					uni.navigateTo({
						url: url
					})
				}
			},
			loadImg(event) {
				let windowWidth = uni.getSystemInfoSync().windowWidth
				let boxWidth = (this.boxWidth / 100) * (windowWidth - 20) - 3

				this.imgWidth = boxWidth
			}
		}
	}
</script>

<style scoped lang="less">
	.iconBox-style {
		.box-style-view {
			padding: 0 10px;
		}

		.box-style-view-chil {
			text-align: center;
			display: inline-block;
			margin-bottom: 1.5px;
		}

		.vip-card-img {
			padding: 0;
			width: 48px;
			height: 48px;
		}

		.vip-card-font {
			margin-top: 5px;
			color: rgb(100, 95, 95);
			font-size: 8pt;
		}
	}
</style>
