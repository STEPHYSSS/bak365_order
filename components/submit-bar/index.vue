<template>
	<view>
		<view class="submit-bar">
			<view class="submit-bar__bar">
				<view @click="showCardList" class="iconCardBottom" :style="{backgroundColor:itemColor}">
					<text class="icon">&#xe604;</text>
					<text class="iconCardRight" v-if="!isOrder">{{addNum}}</text>
				</view>
				<text class="tapCard" v-if="MinAmount&&isPack=='3'">{{MinAmount}}元起送</text>
				<view v-else>
					<text v-if="!isOrder" class="tapCard">不含运费</text>
					<text v-else class="tapCard">总金额</text>
				</view>
				<view class="submit-bar__text">
					<text style="font-size: 11pt;">¥</text>
					<text>{{setDecimalFun(allMoney)}}</text>
				</view>
				<view class="">
					<button @click="onSubmit" class="submit-bar__button" :style="{backgroundColor:itemColor}">
						{{textVal}}
					</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		setDecimal
	} from '@/utils/utils.js'
	let app = getApp()
	export default {
		props: {
			addNum: [Number, String],
			textVal: {
				type: String,
				default: "去结账"
			},
			isOrder: {
				type: Boolean,
				default: false
			},
			allMoney: [Number, String],
			MinAmountNew: [Number, String]
		},
		data() {
			return {
				itemColor: app.globalData.itemColor,
				MinAmount: app.globalData.minAmount,
				isPack: app.globalData.isPack,
				disabledBtn:false
			}
		},
		created() {
			if(Number(this.allMoney)<Number(app.globalData.minAmount)){
				this.disabledBtn = true
			}
		},
		methods: {
			setDecimalFun(val) {
				return setDecimal(val)
			},
			showCardList() {
				if (this.isOrder) {
					return
				}
				this.$emit('showCardList')
			},
			onSubmit() {
				this.$emit('determine')
			}
		},
		watch: {
			'MinAmountNew'(val) {
				if (val == '0' || val == '1') {
					this.MinAmount = ''
					this.disabledBtn = false
				} else {
					
					this.isPack = app.globalData.isPack
					this.MinAmount = app.globalData.minAmount
					if(Number(this.allMoney)<Number(app.globalData.minAmount)){
						this.disabledBtn = true
					}
				}
			},
			allMoney(val){
				if(Number(val)<Number(app.globalData.minAmount)){
					this.disabledBtn = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$btn-height: 40px;


	.submit-bar {
		height: $btn-height;
		line-height: $btn-height;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		user-select: none;
	}

	.submit-bar__bar {
		border-top: 1px solid #eee;
		display: flex;
		font-size: 14px;
		background-color: #fff;
		align-items: center;
		justify-content: flex-end;
	}

	.tapCard {
		font-size: 12px;
		color: #707070;
		margin-left: 10px;
	}

	.submit-bar__text {
		color: #D82F37;
		font-size: 14pt;
		padding-right: 12px;
		font-weight: 500;
		color: #333;
		flex: 1;
		text-align: right;
		color: #D82F37;
	}

	.submit-bar__button {
		width: 110px;
		height: $btn-height+1;
		line-height: $btn-height;
		border-radius: 0;
		color: #fff;
		font-size: 12pt;
	}

	button::after {
		border: none;
	}

	.iconCardBottom {
		position: relative;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		text-align: center;
		line-height: 38px;
		color: #fff;
		font-size: 20px;
		margin: -18px 0 0 15px;
		vertical-align: middle;
	}

	.iconCardRight {
		position: absolute;
		top: 0;
		right: 5px;
		min-width: 16px;
		padding: 0 3px;
		font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
		font-size: 12px;
		font-weight: 500;
		line-height: 14px;
		color: #fff;
		text-align: center;
		white-space: nowrap;
		border: 1px solid #fff;
		border-radius: 16px;
		transform: translateX(50%);
		box-sizing: border-box;
		transform-origin: 100%;
		background-color: #ffa006;
	}
</style>
