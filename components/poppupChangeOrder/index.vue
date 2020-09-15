<template>
	<uni-popup :show="show" type="bottom" class="store-custom" :custom="true" @change="onClose">
		<view class="popup-view">
			<view style="margin-bottom: 50px;">
				<text class="cross-icon" @click="onClose({show:false})">×</text>
				<view class="store-info-style">
					<text class="icon store-info-name">&#xe65e;</text><text v-if="currentStore.ShopName">{{currentStore.ShopName}}</text>
					<view class="store-info-address">{{currentStore.ShopAddress}}</view>
				</view>
				<radio-group @change="onChangeStore">
					<radio class="radio-label-class" :color="colorItem" :checked="true"></radio>
					<view class="radio-label-tip" :style="{'color':colorItem}">现在点餐 支付成功后取餐</view>
				</radio-group>
			</view>
			<mode-change @changeMode="changeMode" :modeChangeNum="modeChangeNum" :isActive="isActive"></mode-change>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from "@/components_uni/uni-popup/uni-popup.vue"
	import modeChange from "@/components/modeChange/index.vue"
	const app = getApp()
	export default {
		props: {
			shopNo: String,
			clickShow: Boolean,
			isActive: Boolean,
			currentStore: Object,
			modeChangeNum: Object,
			ifChangeMode: {
				type: Boolean,
				default: false
			}
		},
		components: {
			uniPopup,
			modeChange
		},
		onShow() {
		},
		data() {
			return {
				show: false,
				radio: '1',
				colorItem: getApp().globalData.itemColor,
			}
		},
		methods: {
			changeMode(e) {
				app.globalData.isPack = e
				this.$emit('changeMode', e)
			},
			onClose(e) {
				if (!e.show) {
					this.show = false
					this.$emit('onClose', false)
				}
			},
			onChangeStore(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (1 === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
		},
		watch: {
			clickShow(e) {
				// console.log(this.currentStore, 8888)
				this.show = e
			}
		}
	}
</script>

<style>
	.store-custom {
		max-height: 60vh;
		padding-bottom: 15px !important;
	}

	.popup-view {
		padding: 15px;
		background: #fff !important;
	}

	.cross-icon {
		position: absolute;
		right: 10px;
		top: 0;
		font-size: 22px;
		color: rgb(129, 129, 129);
	}

	.store-info-name {
		font-size: 16px;
		vertical-align: middle;
		margin-right: 4px;
	}

	.store-info-style {
		margin-bottom: 8px;
		margin-top: 5px;
		vertical-align: middle;
		font-size: 14px;
	}


	.store-info-address {
		font-size: 12px;
		color: rgb(129, 129, 129);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 4px;
	}

	.radio-label-class {
		vertical-align: middle !important;
	}


	.radio-label-tip {
		display: inline-block;
		margin-left: 5px;
		vertical-align: middle;
	}
</style>
