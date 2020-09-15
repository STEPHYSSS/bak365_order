<template>
	<view class="bottom-submit-style">
		<uni-popup type="bottom" :custom="true" :show="showPopup" @change="changePopup">
			<view class="custom-popup">
				<view class="popup-top">
					<view>
						已选商品
					</view>
					<view class="popup-topRight" @click="clickClear">
						<text class="icon">&#xe610;</text>清空
					</view>
				</view>
				<view :class="['cartListStyle',cartList.length>3?'customH':'']">
					<view v-for="(item,index) in cartList" :key="index" class="custom-class-row">
						<view class="oneColFa">
							<view :class="{'oneCol':true,'partsColH':item.recordFlavor.length>0?true:false}">{{item.ProdName}}</view>
							<view class="partsColview" v-if="item.recordFlavor.length>0">
								<text v-for="(flavorItem,i) in item.recordFlavor" :key="i" style="display:inline-block">
									<text>+</text>{{flavorItem}}
								</text>
							</view>
							<view class="partsColview" v-if="item.prodPartsInfo.length>0">
								<view v-for="(PartsItem,i) in item.prodPartsInfo" :key="i" style="display:inline-block" class="partsCol"><text>+</text>{{PartsItem.ProdName}}
									共¥{{PartsItem.SalePrice}}</view>
							</view>
						</view>
						<view class="twoCol" style="color:#D82F37">¥{{setDecimalFun(item.SalePrice)}}</view>
						<view class="stepperStyle">
							<uni-number-box :value="item.num" @change="stepperChange($event,index)" @changeMax="changeMax(item,index)" :min="0"
							 :max="item.ActiveID?item.num:item.StockQty" :disabledright="item.disabledNum"></uni-number-box>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<submit-bar :addNum="addNum" :allMoney="allMoney" :MinAmountNew="MinAmountNew" @determine="determine" @showCardList="showCardList"
		 :isOrder="isOrder"></submit-bar>
	</view>
</template>

<script>
	import uniPopup from "@/components_uni/uni-popup/uni-popup.vue"
	import submitBar from "@/components/submit-bar/index.vue"
	import stepper from "@/components/stepper-my/index.vue"
	import uniNumberBox from "@/components_uni/uni-number-box/uni-number-box.vue"
	import {
		setDecimal
	} from '@/utils/utils.js'


	export default {
		props: {
			allMoney: [Number, String],
			addNum: [Number, String],
			cartLists: {
				type: Array,
				default: []
			},
			isOrder: {
				type: Boolean,
				default: false
			},
			MinAmountNew: [Number, String]
		},
		components: {
			uniPopup,
			submitBar,
			stepper,
			uniNumberBox
		},
		data() {
			return {
				// addNum:this.addNumProp,
				// allMoney:this.allMoneyProp,
				// cartList:this.cartLists,
				showPopup: false,
				// 当前的购物车里面的总商品数量
				cardNum: 0
			}
		},
		computed: {
			cartList() {
				return this.cartLists
			}
		},
		created() {
			// console.log(this.cartList, 'cartListProp')
		},
		onLoad() {},
		methods: {
			setDecimalFun(val) {
				return setDecimal(val)
			},
			openPopup() {},
			showCardList(e) {
				// this.$refs.popup.close()
				// this.$refs.uniPopup.open()
				this.showPopup = !this.showPopup
			},
			changePopup(e) {
				if (!e.show) {
					this.showPopup = false
				}
			},
			changeMax(item, index) {
				// console.log(item,55555555)
				uni.showToast({
					title: item.disabledProStr + '库存不足',
					icon: 'none'
				});
				// this.$emit('changeMax', index)
			},
			stepperChange(num, index) {
				this.$emit('setCartList', num, index)
			},
			determine() {
				this.$emit('determine')
			},
			clickClear() {
				this.$emit('clickClear')
				this.showPopup = false
			}
		},
		watch: {
			'cartLists.length'(val) {
				if (val === 0) {
					this.showPopup = false
				}
			}
		}
	}
</script>

<style lang="scss">
	/* @import "../../../app.wxss"; */
	.bottom-submit-style {
		button {
			border: none;
		}

		.btn-class {
			height: 41px;
			line-height: 40px;
			font-size: 14px;
		}

		.submit-class {
			border-top: 1px solid #eee;
			height: 40px;
			line-height: 40px;
		}

		.custom-popup {
			margin-bottom: 39px !important;
			background: #FFFFFF;
		}

		.bar-class {
			height: 40px;
		}

		.customH {
			height: 40vh;
			overflow-y: scroll;
		}

		.iconCard {
			position: relative;
			width: 38px;
			height: 38px;
			/* background: #ffa006; */
			border-radius: 50%;
			text-align: center;
			line-height: 43px;
			color: #fff;
			font-size: 24px;
			margin: 0 0 20px 10px;
		}

		.tapCard {
			font-size: 12px;
			color: #707070;
			margin-left: 10px;
		}

		.popup-top {
			font-size: 10pt;
			background: #eee;
			height: 30px;
			line-height: 30px;
			padding: 0 10px;
			color: #0f0f0f;
			display: flex;
			justify-content: space-between;
		}

		.popup-topRight {
			vertical-align: middle;
			color: #707070;
		}

		.cartListStyle {
			max-height: 50vh;
			overflow-y: scroll;
		}

		.custom-class-row {
			font-size: 12pt;
			border-bottom: 1px solid #eee;
			padding: 10px 10px 16px 10px;
			display: flex;

			.oneColFa {
				flex: 1;
			}
		}

		.oneCol {
			font-size: 11pt;
			line-height: 30px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.partsColH {
			line-height: 32px;
		}

		.partsCol {
			display: inline-block;
		}

		.partsColview {
			width: 100%;
			display: inline-block;
			color: #707070;
			font-size: 12px;
			word-break: normal;
			/* overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis; */
		}

		.partsCol {
			display: inline-block;
			color: #707070;
			font-size: 12px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.twoCol {
			text-align: center;
			/* color:#ffa006;  */
			line-height: 44px;
			margin: auto 15px;
		}

		.threeCol {
			margin: 20px 0;
		}

		.stepperStyle {
			display: inline-block;
			margin-left: 5px;
			margin: auto;
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
			-webkit-transform: translateX(50%);
			transform: translateX(50%);
			box-sizing: border-box;
			-webkit-transform-origin: 100%;
			transform-origin: 100%;
		}


	}
</style>
