<template>
	<view class="indexTop">
		<view v-if="modeChangeNum.OrderEatInStore>0" :class="['changeMode','',radioModes == 2?'isActive':'']" @click="changeMode(2)">
			<image v-if="radioModes == 2" class="changeTopIcon" src="/static/images/icon/packChange.png"></image>
			<image class="changeModeImg" src="/static/images/icon/Eat.png"></image>
			店内就餐
		</view>
		<view v-if="modeChangeNum.OrderEatPackAway>0" :class="['changeMode','changeModeRight',radioModes == 1?'isActive':'']"
		 @click="changeMode(1)">
			<image v-if="radioModes == 1" class="changeTopIcon" src="/static/images/icon/packchange.png"></image>
			<image class="changeModeImg" src="/static/images/icon/Pack.png"></image>
			打包带走
		</view>
		<view v-if="modeChangeNum.LogisticsDistribution>0" :class="['changeMode','changeModeRight',radioModes == 3?'isActive':'']"
		 @click="changeMode(3)">
			<image v-if="radioModes == 3" class="changeTopIcon" src="/static/images/icon/packchange.png"></image>
			<image class="changeModeImg" style="margin-left:5px" src="/static/images/icon/delivery.png"></image>
			物流配送
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		props: {
			radioMode: {
				type: Number,
				default: 0
			},
			isOrder: {
				type: Boolean,
				default: false
			},
			isActive: {
				type: Boolean,
				default: false
			},
			modeChangeNum: Object
		},
		data() {
			return {
				// this.modeChange = {
				// 	LogisticsDistribution: D.WX_LogisticsDistribution,
				// 	OrderEatInStore: D.WX_OrderEatInStore,
				// 	OrderEatPackAway: D.WX_OrderEatPackAway,
				// }
				radioModes: this.radioMode,
			}
		},
		created() {},
		methods: {
			changeMode(e) {
				this.radioModes = e
				app.globalData.isPack = e

				if (!this.isOrder && !this.isActive) {
					uni.setStorageSync('cartList', [])
				}
				this.$emit('changeMode', e)
			}
		}
	}
</script>

<style scoped>
	.indexTop {
		display: flex;
		justify-content: center;
		margin: 10px 0;
	}

	.changeMode {
		width: 140px;
		height: 50px;
		display: flex;
		background: #F6F6F6;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		font-size: 14px;
		color: #3062a5;
		position: relative;
		overflow: hidden;
	}

	.changeModeImg {
		width: 25px !important;
		height: 25px !important;
	}

	.changeModeLeft {
		margin-right: 15px;
	}

	.changeModeRight {
		margin-left: 5%;
	}

	.isActive {
		border: 1px solid #3062a5;
	}

	.changeTopIcon {
		right: 0px;
		position: absolute;
		width: 26px;
		height: 26px;
		bottom: 0;
	}
</style>
