<template>
	<view class="sterperCard-style">
		<!-- v-if="!isCollage&&!isCollageInfo" -->
		<div>
			<text class="icon stepperStyle fontColor" @click="clickTag">&#xe616;</text>
			<!-- 商品数量（StockQty）等于0 的时候代表售罄了 -->
			<text v-if="!newItemData.showStepper&&newItemData.StockQty<=0" class="icon stepperStyle fontColorGray" @click="clickTagEmpty">&#xe616;</text>
			<stepper v-if="newItemData.showStepper" @stepperNum="stepperNumChange" :numData="newItemData.num" :currentDisabled="disabled"
			 :disabledAll="disabledAll" :maxData="surplusStock"></stepper>
		</div>
		<div class="goods-nav-fixed" v-if="isCollage&&!isCollageInfo">
			<uni-goods-nav :fill="true" options="[]" :buttonGroup="buttonGroup" @buttonClick="buttonClick" />
		</div>

		<slot></slot>
		<!-- 商品规格弹窗 -->
		<uni-popup :show="showPopup" @change="onClose" class="customPopup">
			<view class="my-popup-style">
				<view class="popupStyleTitle">{{newItemData.ProdName}}
					<text class="closePopup" @click="onClose">×</text>
				</view>

				<view>
					<view class="popupStyleNoTitle" v-if="listData.specs.normsArr.length>0">
						{{listData.specs.titleNorms}}：
					</view>
					<ul :class="['popupStyleUl','theme'+colorNum]" v-for="(item,index) in listData.specs.normsArr" :key="item.CombNo">
						<li @click="tapCurrentLiSpecs(item.CombNo)" :class="['popupStyleLi',item.CombNo===currentSpecs?'iscurrent':'']">{{item.CombName}}</li>
					</ul>
				</view>
				<view>
					<view class="popupStyleNoTitle" v-if="listData.flavor.normsArr.length>0">
						{{listData.flavor.titleNorms}}：
					</view>
					<ul :class="['popupStyleUl','theme'+colorNum]" v-for="(item,index) in listData.flavor.normsArr" :key="index">
						<li @click="tapCurrentLiFlavor(index)" :class="['popupStyleLi',item.isActive?'iscurrent':'']">{{item.TastName}}</li>
					</ul>
				</view>
				<view>
					<view class="popupStyleNoTitle" v-if="listData.parts.normsArr.length>0">
						{{listData.parts.titleNorms}}：
					</view>
					<ul :class="['popupStyleUl','theme'+colorNum]" v-for="(item,index) in listData.parts.normsArr" :key="item.PartNo">
						<li @click.stop="tapCurrentLi(index)" :class="['popupStyleLi','partsLi',item.isActive?'iscurrent':'']">
							<span class="partsLiMoney">
								<text class="partsLiMoneyIcon">¥</text>{{item.SalePrice}}
							</span>
							<span>{{item.ProdName}}</span>
						</li>
					</ul>
				</view>

				<view style="margin-top:20px">
					<span>商品购买数量</span>
					<div style="display: inline-block;float:right">
						<uni-number-box :value="newItemData.num" :min="1" @change="onChangeNum" :max="newItemData.StockQty"></uni-number-box>
					</div>
				</view>
			</view>
			<view class="moneyBottom">
				<view class="moneyBottomNum fontColor">
					<text class="moneyBottomNumTip">¥</text>
					{{setDecimalFun(SalePrice)}}
					<view class="recordPartsStyle" v-if="newItemData.PackingFee>0">+打包费¥{{newItemData.PackingFee}}</view>
					<view v-for="item in recordParts" :key="item.ProdName" class="recordPartsStyle">
						+{{item.ProdName}}¥{{item.SalePrice}}
					</view>
				</view>
				<view>
					<button v-if="!isCollage&&!isCollageInfo" class="stepperPopup my-background-color" :style="{'background': itemColor}" @click="stepperChange">加入购物车</button>
					<button v-else class="stepperPopup my-background-color" :style="{'background': itemColor}" open-type="getUserInfo"
					 @getuserinfo="bindgetuserinfo">下
						单</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	import uniPopup from "@/components_uni/uni-popup/uni-popup.vue"
	import stepper from "@/components/stepper-my/index.vue"
	var utils = require('@/utils/utils.js')
	const app = getApp()
	import uniGoodsNav from '@/components_uni/uni-goods-nav/uni-goods-nav.vue'
	import uniNumberBox from "@/components_uni/uni-number-box/uni-number-box.vue"

	export default {
		components: {
			uniPopup,
			stepper,
			uniGoodsNav,
			uniNumberBox
		},
		props: {
			// 当前商品信息
			itemData: {
				type: Object,
				value: {}
			},
			isShowCode: {
				type: Boolean,
				value: false
			},
			isCollage: {
				type: Boolean,
				value: false
			},
			// 控制拼团提交，true允许
			controlBuy: {
				type: Boolean,
				value: true
			},
			// 拼团详情进来的
			isCollageInfo: {
				type: Boolean,
				value: false
			},
			// 控制左右都不让点击
			disabledAll: {
				type: Boolean,
				value: false
			},
		},
		data() {
			return {
				colorNum: app.globalData.colorIndex,
				itemColor: app.globalData.itemColor,
				// 总金额
				SalePrice: '',
				showPopup: false,
				// 记录选择的配件
				recordParts: [],
				// 记录选择的口味
				recordFlavor: [],
				listData: {
					// title: '名称标题',
					// price: '50',
					flavor: {
						titleNorms: '口味',
						normsArr: []
					},
					parts: {
						titleNorms: '配件',
						normsArr: []
					},
					specs: {
						titleNorms: '规格',
						normsArr: []
					}
				},
				currentSpecs: 0,
				// 商品规格
				currentSpecsObj: {},
				surplusStock: 0,
				buttonGroup: [{
						text: '单独购买',
						backgroundColor: '#fe8953',
						color: '#fff'
					},
					{
						text: '我要开团',
						backgroundColor: '#ff4343',
						color: '#fff'
					}
				],
				// 原价购买（拼团使用）
				originalPrice: false,
				// newItemData: {},
				userInfo_empower: {},
				disabled:false//
			}
		},
		mounted() {
			let a = Number(this.itemData.EveryOneMaxBuyCount) -
				(this.itemData.hasOwnProperty('ActiveOwnBuyCount') && this.itemData.ActiveOwnBuyCount > 0 ? Number(this.itemData
						.ActiveOwnBuyCount) :
					0)
			this.surplusStock = (this.itemData.hasOwnProperty('EveryOneMaxBuyCount') && this.itemData.EveryOneMaxBuyCount >
					0) ?
				a :
				(this.itemData.hasOwnProperty('ActiveSaleCount') && this.itemData.ActiveSaleCount > 0 ? Number(this.itemData
						.StockQty) -
					Number(this.itemData.ActiveSaleCount) : Number(this.itemData.StockQty))
			this.newItemData.num = 1
		},
		computed: {
			newItemData(){
				console.log(this.itemData,8888889)
				return this.itemData
			}
		},
		methods: {
			setDecimalFun(val) {
				console.log(val,'SalePrice')
				return utils.setDecimal(val)
			},
			stepperChange(stepperParam) {
				// 点击加入购物车应该展示下面的购物车栏
				console.log(stepperParam,'what')
				// console.log(this.recordFlavor, 2222)
				// console.log(this.recordParts, 1111)

				// 获取规格名称数组
				var PartsAllSale = 0
				// 配件的id组合
				var ProdParts = []
				this.recordParts.forEach(D => {
					// 配件的总价格
					PartsAllSale += Number(D.SalePrice)
					ProdParts.push(D.ProdNo)
				})
				ProdParts = ProdParts.join(',')
				var arr = {}
				// 给行数据加 选中的口味(配件加购物车里面)
				var flavorArr = []
				for (var i = 0; i < this.recordFlavor.length; i++) {
					var DItem = this.recordFlavor[i]
					flavorArr.push(DItem.TastName)
				}
				// 口味数组 合并 规格数组
				let newItemData = JSON.parse(JSON.stringify(this.newItemData))

				newItemData.recordFlavor = flavorArr
				// 改变数量
				newItemData.num = stepperParam && !(stepperParam instanceof Object) ? stepperParam : newItemData.num

				arr.itemData = newItemData
				arr.itemData.prodType = 1
				arr.recordParts = this.recordParts
				arr.itemData.prodPartsInfo = this.recordParts
				arr.itemData.ProdParts = ProdParts

				if (arr.itemData.ActiveSalePrice) {
					//活动价格
					arr.itemData.SalePrice = arr.itemData.ActiveSalePrice
				}

				for (var i = 0; i < this.recordParts.length; i++) {
					this.recordParts[i].num = newItemData.num
				}
				if (JSON.stringify(this.currentSpecsObj) != "{}") {
					// 选择了规格
					arr.itemData.ProdName = this.currentSpecsObj.CombName
					arr.itemData.StockQty = this.currentSpecsObj.StockQty
					arr.itemData.CombNo = this.currentSpecsObj.CombNo

					arr.itemData.SalePrice = Number(this.currentSpecsObj.CombPrice) + PartsAllSale
				} else {
					arr.itemData.SalePrice = Number(arr.itemData.SalePrice) + PartsAllSale
				}

				var bool = utils.setStock(arr)
				if (!bool) {
					//设置单商品 库存不足，不让点击
					this.disabled = true
					return
				}
				this.showPopup = false
				this.$emit('mycurrentPage', arr, this.originalPrice, this.userInfo_empower)

				this.currentIndexParts = null
				this.currentIndexFlavor = null
				this.currentSpecs = null
				this.recordFlavor = []
				this.recordParts = []
				this.currentSpecsObj = {}
			},
			// 商品弹出窗中商品购买数量点击事件
			onChangeNum(val) {
				console.log(val,'商品弹出窗中商品购买数量点击事件')
				this.newItemData.num = val
			},
			clickTag() {
				// 点击的购物车按钮  商品分为单规格和多规格
				APIList.api('ProdPartsOrTast.aspx', {
					ProdNo: this.newItemData.ProdNo,
					ActiveID: this.originalPrice ? '' : (this.newItemData.ActiveID || '')
				}).then(D => {
					let Parts = D.ProdPartsInfo
					let Tast = D.ProdTastInfo
					let Specs = D.ProdCombInfo
					this.listData.parts.normsArr = Parts
					this.listData.flavor.normsArr = Tast
					this.listData.specs.normsArr = Specs

					this.listData.specs.normsArr.splice()
					Tast.forEach((D, i) => {
						D.id = i
					})
					Parts.forEach((D, i) => {
						// 配件带 2 ，区分商品
						D.prodType = 2
					})

					if (Parts.length > 0 || Tast.length > 0 || Specs.length > 0) {
						// 判断为是多选
						this.showPopup = true
						for (var i = 0; i < Tast.length; i++) {
							Tast[i].isActive = false
						}
						for (var i = 0; i < Parts.length; i++) {
							Parts[i].isActive = false
							Parts[i].num = 0
						}
						if (Specs.length > 0) {
							this.currentSpecs = Specs[0].CombNo
							this.currentSpecsObj = Specs[0]
							this.SalePrice = Specs[0].CombPrice
						}
						this.listData = this.listData
						// this.data.newItemData.showStepper = false
					} else {
						if (!this.isCollage) {
						
							// 直接加入购物车
							this.$emit('setShowStepper', true)
							this.newItemData.showStepper = true
							// this.data.newItemData.showStepper = true
							this.stepperChange()
						}
					}
				}).catch((e) => {
					console.log(e, 'error')
				})

			},
			onClose(e) {
				if (!e.show) {
					this.showPopup = false
					var _this = this
					setTimeout(function() {
						_this.currentIndexParts = null
						_this.currentIndexFlavor = null
						_this.recordFlavor = []
						_this.recordParts = []
						_this.currentSpecs = null
						_this.currentSpecsObj = {}
						_this.SalePrice = ''
					}, 300)
				}
			},
			tapCurrentLiSpecs(CombNo) {
				console.log(CombNo,'zhe')
				this.currentSpecs = CombNo
				let arr = this.listData.specs.normsArr.filter(D => D.CombNo === CombNo)
				this.currentSpecsObj = arr[0]
				this.SalePrice = this.currentSpecsObj.CombPrice
			},
			tapCurrentLiFlavor(e) {
				// 口味
				getDataArrr(this, 'flavor', 'recordFlavor', e)
			},
			tapCurrentLi(e) {
				// 规格
				getDataArrr(this, 'parts', 'recordParts', e)
			},
			stepperNumChange(e) {
				console.log(e,'从子组件中得到的数据')
				this.stepperChange(e)
			},
			clickTagEmpty() {
				uni.showToast({
					title: '该商品已售罄',
					icon: 'none'
				});
			},
			buttonClick(val) {
				if (val.index === 0) {
					//单独购买
					this.originalPrice = true
					this.clickTag()
				} else {
					// 我要开团
					if(!this.controlBuy){
						uni.showToast({
							title: '无法开团',
							icon: 'none'
						});
						return
					}
					this.originalPrice = false
					this.clickTag()
				}
			},
			bindgetuserinfo(event) {
				if (this.originalPrice) {
					this.stepperChange()
				} else {
					if (event.detail.errMsg === 'getUserInfo:ok') {
						let obj = JSON.parse(event.detail.rawData)
						this.userInfo_empower = {
							NickName: obj.nickName,
							HeardImg: obj.avatarUrl
						}
						this.stepperChange()
					} else {
						uni.showToast({
							title: '未授权无法购买哦！',
							duration: 2000,
							icon: 'none'
						});
					}
				}

			}
		},
		watch: {
			'newItemData.SalePrice'(val) {
				this.SalePrice = this.newItemData.SalePrice
			},
			'isShowCode'(val) {
				if (val) {
					this.clickTag()
				}
			}
		}
	}

	function getDataArrr(_this, type, recordType, e) {
		// 获取当前总数据的 被点击的当前列
		var value = _this.listData[type].normsArr[e]

		// 获取存选中数据的data
		var flavorArr = _this[recordType]

		var _id = ''
		if (type === 'parts') {
			_id = 'ProdNo'
		} else {
			_id = 'id'
		}

		// 改变取反
		value.isActive = !value.isActive
		_this.listData = _this.listData

		if (value.isActive) {
			flavorArr.push(value)
		} else if (flavorArr.length > 0) {
			for (var i = 0; i < flavorArr.length; i++) {
				var d = flavorArr[i]
				if (value[_id] === d[_id]) {
					flavorArr.splice(i, 1)
				}
			}
		}

		function compare(type) {
			let property = null
			if (type === 'parts') {
				property = 'ProdNo'
				return function(a, b) {
					var value1 = a[property];
					var value2 = b[property];
					return value1 - value2;
				}
			} else {
				property = 'TastName'
				return function(a, b) {
					return a[property].localeCompare(b[property], 'zh-CN')
				}
			}
		}
		// 目前是以 id属性排序 ProdNo
		flavorArr = flavorArr.sort(compare(type))

		_this.currentIndexFlavor = e
		_this[recordType] = flavorArr
	}
</script>

<style scoped lang="scss">
	.sterperCard-style {
		display: inline-block;
		position: relative;

		.goods-nav-fixed {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			align-items: center;
			height: 50px;
			background-color: #fff;

			/deep/.uni-tab__cart-sub-left {
				padding: 0;
			}

			/deep/.uni-tab__right {
				margin: 0;
				border-radius: 0;
			}
		}
	}

	.fontColor {
		color: #D82F37;
	}

	.stepperStyle {
		font-size: 20pt;
	}

	.customPopup {
		width: 88%;
		font-size: 12px;
	}

	.my-popup-style {
		padding: 15px;
		background: #fff;
		max-height: 300px;
		overflow: scroll;
	}

	.popupStyleTitle {
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 5px 25px;
		font-weight: 700;
	}

	.closePopup {
		position: absolute;
		top: 15px;
		right: 22px;
		font-size: 22px;
		color: #707070;
	}

	.popupStyleNoTitle {
		margin-top: 10px;
	}

	.popupStyleUl {
		display: inline-block;
		font-size: 14px;
	}

	.popupStyleLi {
		padding: 4px 14px;
		display: inline-block;
		border: 1px solid rgb(221, 219, 219);
		margin: 10px 10px 0 0;
	}

	.popupStyleNoTitle {
		margin-top: 10px;
	}

	.popupStyleUl {
		font-size: 14px;
	}

	.popupStyleLi {
		padding: 4px 14px;
		display: inline-block;
		border: 1px solid rgb(221, 219, 219);
		margin: 10px 10px 0 0;
	}

	.partsLi {
		border-radius: 10px;
	}

	.partsLiMoney {
		margin-right: 5px;
	}

	.partsLiMoneyIcon {
		font-size: 12px;
	}

	.moneyBottom {
		background: #eee;
		padding: 15px;
		position: relative;
	}

	.moneyBottomNum {
		/* color:#f44; */
		font-size: 18px;
		white-space: nowrap;
		overflow: hidden;
		margin-right: 90px;
		text-overflow: ellipsis;
	}

	.moneyBottomNumTip {
		display: inline-block;
		font-size: 12px;
		margin-right: 4px;
	}

	.recordPartsStyle {
		color: #707070;
		display: inline-block;
		font-size: 12px;

	}

	.stepperPopup {
		position: absolute;
		right: 15px;
		top: 12px;
		display: inline-block;
		font-size: 12px;
		border-radius: 15px;
		color: #fff;
		line-height: 30px;
		height: 30px;
		padding: 0px 13px;
	}

	.fontColorGray {
		color: #707070;
	}
</style>
