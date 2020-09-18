<template>
	<view class="goodsBoxFa">
		<view class="goodsBox">
			<i v-if="itemData.num>0&&!isOrder" class="isCurrentStyle">
				<image src="/static/images/icon/selectZ.png"></image>
			</i>
			<view class="goodsBoxImg" @click="clickGoodsBox(itemData.ProdNo,itemData.CateNo)">
				<image class="goodsBoxImg-image" :src="itemData.ProdImg?itemData.ProdImg:'/static/images/icon/noImg.png'" @error="imgError"></image>
			</view>
			<view class="goodsBoxRight" @click="clickGoodsBox(itemData.ProdNo,itemData.CateNo)">
				<view class="title">{{itemData.ProdName}}</view>

				<view class="stock" v-if="!isOrder&&itemData.StockQty<=15">{{itemData.StockQty==='0'?'已售罄':'仅剩'+itemData.StockQty+'件'}}</view>
				<view class="discount" v-if="!isOrder">
					<text class="money" style="color:#D82F37">¥{{setDecimalFun(itemData.SalePrice)}}</text>
				</view>
				<view v-if="isOrder" class="buyNum">
					<view class="norms-style" v-if="itemData.PastInfo||itemData.ProdTast">搭配：{{itemData.PastInfo||itemData.ProdTast}}</view>
					<text class="Num">数量：x{{itemData.Qty}}</text>
					<text class="buyMoney">¥{{setDecimalFun(itemData.ProdAmt||itemData.PartAmt)}}</text>
				</view>
			</view>

				 <!-- v-if="!isOrder&&!isSearch" -->
			<view class="stepperStyle" v-if="!isOrder&&!isSearch">
				<stepper-card :itemData="itemData" @mycurrentPage="mycurrentPage" @setShowStepper="setShowStepper"></stepper-card>
			</view>
		</view>
		<view class="goodsBox-parts" v-if="isOrder&&itemData.ProdPartsInfo.length>0">
			<view class="parts-norms-style">配件：</view>
			<view class="parts-norms-info">
				<view class="parts-norms-info-one" v-for="(item,index) in itemData.ProdPartsInfo" :key="index">
					<view class="parts-norms-one-salePrice">
						{{item.ProdName}} x{{item.Qty}}
						<view class="parts-buyMoney">¥{{item.SalePrice}}/份</view>
					</view>
					<view class="parts-norms-one-prodAmt">¥{{item.ProdAmt}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import stepperCard from '@/components/stepperCard/index.vue'
	import {
		setDecimal
	} from '@/utils/utils.js'
	export default {
		components: {
			stepperCard
		},
		props: {
			itemData: {
				type: Object,
				default: {}
			},
			codeItemData: {
				type: Object,
				default: {}
			},
			isOrder: {
				type: Boolean,
				default: false
			},
			isSearch: {
				type: Boolean,
				default: false
			},
			isOrderInfo: {
				type: Boolean,
				default: false
			}
		},
		created() {
			// console.log(this.itemData,'itemData')
		},
		computed: {
			// itemData() {
			// 	return this.itemDatas
			// }
		},
		data() {
			return {
				showPopup: false,
				currentIndex: 0,
				currentIndexParts: null,
				currentIndexFlavor: null,
				errorImg: ''
			}
		},
		methods: {
			setDecimalFun(val) {
				return setDecimal(val)
			},
			mycurrentPage(e) {
				// console.log(e, 'e.detail')
				// this.triggerEvent('mycurrentPage', e.detail)
				this.$emit('mycurrentPage', e)
			},
			setShowStepper(bool) {
				// console.log(bool);
				this.$emit('setShowStepper', bool)
			},
			clickGoodsBox(ProdNo, CateNo) {
				// itemData.ProdNo,itemData.CateNo
				if (CateNo && !this.isOrder) {
					uni.navigateTo({
						url: '/pages/indexCanteen/goodInfo/index?ProdNo=' + ProdNo
					})
				}
			},
			imgError(e) {
				// 图片加载失败
				this.itemData.ProdImg = '/static/images/icon/noImg.png'
			}
		}
	}
</script>

<style scoped>
	.goodsBoxFa {
		border-bottom: 1px solid #eee;
	}

	.goodsBox {
		display: flex;
		padding: 5px;

		overflow: hidden;
		position: relative;
		/* width: 100%; */
	}

	.goodsBox .goodsBoxImg {
		width: 80px;
		height: 80px;
		min-width: 80px;
		margin-right: 10px;
	}

	.goodsBoxImg-image {
		width: 100%;
		height: 100%;
	}

	/* .goodsBox .goodsBoxImg image{
	
	} */
	.goodsBoxRight {
		overflow: hidden;
		flex: 1;
		margin-right: 5px;
	}

	.goodsBox .title {
		word-wrap: break-word;
		font-size: 10pt;
		font-weight: 700;
		/* white-space:nowrap;
	  overflow:hidden; */
	}

	.goodsBox .stock {
		font-size: 9pt;
		color: #fB741D;
		display: inline-block;
		/* margin-left:5px; */
	}

	.goodsBox .norms {
		max-width: 80%;
		white-space: nowrap;
		font-size: 9pt;
		color: #707070;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
	}

	.goodsBox .money {
		position: absolute;
		bottom: 8px;
		font-weight: 700;
	}

	.goodsBox .discount {
		margin-top: 10px;
		font-size: 10pt;
		color: #909090;
	}

	.goodsBox .discount-money {
		margin-left: 5px;
		text-decoration: line-through;
	}

	.norms-style {
		color: #909090;
		font-size: 12px;
		white-space: nowrap;
		flex: 1;
	}

	.buyNum {
		margin-top: 16px;
	}

	.buyNum .Num {
		color: #909090;
		font-size: 12px;
	}

	.buyMoney {
		float: right;
		/* margin-right: 6px; */
		margin-top: 4px;
		font-size: 11pt;
	}

	.isCurrentStyle {
		width: 24px;
		height: 24px;
		position: absolute;
		top: -1px;
		right: 0;
		color: #fff;
	}

	.isCurrentStyle image {
		width: 100%;
		height: 100%;
	}

	.stepperStyle {
		position: absolute;
		right: 10px;
		bottom: 3px;
	}

	.goodsBox-parts {
		display: flex;
		margin-bottom: 6px;
		align-items: center;
	}

	.goodsBox-parts-left {
		font-size: 14px;
		color: #807e7e;
	}

	.parts-norms-style {
		margin-left: 10px;
		color: #807e7e;
		min-width: 50px;
		font-size: 10pt;
	}

	.parts-norms-info {
		color: #7a7878;
		font-size: 12px;
		flex: 1;
		/* margin-right: 30px; */
		/* margin-top: 1px; */
	}

	.parts-buyMoney {
		display: inline-block;
		margin-left: 2px;
		margin-right: 15px;
		color: #7a7878;
		font-size: 12px;
	}

	.parts-norms-info-one {
		display: flex;
		line-height: 18px;
	}

	.parts-norms-one-salePrice {
		flex: 1;
	}

	.parts-norms-one-prodAmt {
		margin-right: 10px;
		min-width: 60px;
		text-align: right;
		color: #3f3f3f;
	}
</style>
