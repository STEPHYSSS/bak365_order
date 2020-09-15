<template>
	<view class="index-canteen-style">
		<view class="shop-name">
			<view class="shop-revert" @click="shopRevertMain">
				<text class="icon shop-revert-icon">&#xe61b;</text>首页
			</view>
			<view style="display: inline-block;" @click="shopClick">
				<text class="icon shop-name-icon" :style="{'color':itemColor}">&#xe640;</text>
				<text :style="{color:itemColor,'verticalAlign': 'middle'}">{{shopName}}</text>
			</view>

			<view class="ReachTime">
				<view @click="searchGoods" class="ReachTimeInput">
					<input disabled class="weui-input" placeholder="搜索" />
				</view>
				<view @click="goodCodeFun" class="icon goodCodeStyle">&#xe62c;</view>
			</view>
		</view>

		<view class="homepage">
			<view class="homepageLeftFa">
				<view :class="['homepageLeftFixed','theme'+colorNum]">
					<view v-for="(item,index) in ProdCateInfo" :key="index" :class="['homepageLeft',index===currentIndex?'activeCanteen':'']"
					 @click="itemClick(item.CateNo,index)">
						{{item.CateName}}
						<view class="homepageLeft-info" style="background: #ffa006;" v-if="item.numInfo>0"></view>
					</view>
				</view>
			</view>
			<bottom-submit v-if="allMoney>0" :allMoney="allMoney" :addNum="addNum" :cartLists="cartLists" @clickClear="clickClear"
			 @setCartList="setCartList" @changeMax="changeMax" @determine="determine"></bottom-submit>

			<!--旧 <bottom-box :allMoney="allMoney" :addNum="addNum" @setCartList="setCartList" :cartList="cartLists" @clickClear="clickClear"
			 @determine="determine" popupShow="popupShow"></bottom-box> -->

			<view class="homepageRight">
				<goods-box v-if="arrayList.length>0" v-for="(item,index) in arrayList" :itemData="item" :key="index" @mycurrentPage="mycurrentPage"
				 :codeItemData="goodCodeData" @setShowStepper="setShowStepper($event,index)">
				</goods-box>

				<no-data v-if="arrayList.length===0"></no-data>
			</view>

			<view class="stepperStyle">
				<stepper-card :itemData="goodCodeData" @mycurrentPage="mycurrentPage" :isShowCode="isShowCode"></stepper-card>
			</view>
		</view>
		<button v-if="WXSmallProgramKf==='1'&&provider==='weixin'" open-type="contact" @contact="handleContact"
		 :show-message-card="true" send-message-img send-message-path="/pages/indexCanteen/index" send-message-title="商品列表">
			<span class="icon customer-service-style" :style="{'color': itemColor,
			'border': '1px solid'+ itemColor}">&#xe60a;</span>
		</button>
	</view>
</template>

<script>
	let app = getApp()
	import APIList from '@/api/http.js';

	import bottomSubmit from '@/components/bottomSubmit/index.vue'
	import noData from '@/components/nodeData/index.vue'
	import goodsBox from '@/components/goodsBox/index.vue'
	import stepperCard from '@/components/stepperCard/index.vue'

	var utils = require('@/utils/utils.js')
	export default {
		components: {
			bottomSubmit,
			noData,
			goodsBox,
			stepperCard
		},
		data() {
			return {
				// 动态设置主题色
				colorNum: app.globalData.colorIndex,
				itemColor: app.globalData.itemColor,
				provider: app.globalData.provider,
				// 当前点击的索引
				currentIndex: 0,
				currentList: [],
				// 当前的商品列表
				arrayList: [],
				// 总商品列表
				allGoodList: [],
				// 总余额
				allMoney: '',
				// 购物车列表
				cartLists: [],
				// 加入购物车的数量
				addNum: 0,
				show: false,
				// 左侧导航
				ProdCateInfo: [],
				// 打开模式选择
				showPack: false,
				radioMode: "2",
				loading: false,
				// 商店名称
				shopName: '',
				// 配件库存
				partsQty: {},
				// 扫码获取的商品
				goodCodeData: {},
				isShowCode: false,
				WXSmallProgramKf: ''
			}
		},
		methods: {
			handleContact() {},
			itemClick(cateno, num) {
				// 点击当前的左边导航
				this.currentIndex = num

				let arr = filterList(cateno, this.allGoodList)
				
				this.arrayList = arr
				this.setList()
			},
			mycurrentPage(e) {
				var cartListArr = utils.setCard(e)

				if (e.itemData.num > this.addNum) {
					uni.showToast({
						title: '已加入购物车'
					});
				}

				this.allMoney = 0
				this.addNum = 0

				setListNum(this, cartListArr)

				var prodCateInfo = setLeftNum(this.ProdCateInfo)

				// allMoney,addNum
				this.cartLists = cartListArr
				this.arrayList = this.arrayList
				this.ProdCateInfo = prodCateInfo
				this.addNum = cartListArr.length > 0 ? this.addNum : 0;
				this.allMoney = cartListArr.length > 0 ? parseFloat(this.allMoney.toFixed(2)) : 0
			},
			setShowStepper(bool, index) {
				this.$set(this.arrayList[index], 'showStepper', bool)
			},
			changeMax(index) {
			},
			setCartList(num, index) {
				var _this = this
				this.cartLists[index].num = num //更新商品的数量
				this.cartLists[index].prodPartsInfo.forEach((D) => {
					D.num = num //更新商品配件的数量
				})

				//库存
				utils.controlPartsStock(this, index)
				//库存end

				let lists = this.cartLists
				let list = []
				list = list.concat(this.cartLists)

				_this.allMoney = 0
				_this.addNum = 0
				setListNum(this, list)

				for (var i = 0; i < list.length; i++) {
					// 当num为0的时候，剪切掉
					var Ditem = list[i]
					if (Number(Ditem.num) === 0) {
						list.splice(i, 1)
					}
				}
				if (list.length === 0) {
					for (var k = 0; k < _this.arrayList.length; k++) {
						var Data = _this.arrayList[k]
						Data.num = 0
					}
				}

				list = list ? list : []
				var prodCateInfo = setLeftNum(this.ProdCateInfo, list)

				_this.allMoney = parseFloat(_this.allMoney.toFixed(2))
				this.$nextTick(function() {
					_this.cartLists = list
					_this.ProdCateInfo = prodCateInfo
					_this.addNum = list.length > 0 ? _this.addNum : 0
					_this.allMoney = list.length > 0 ? _this.allMoney : 0
				})


				uni.setStorage({
					key: "cartList",
					data: list
				})
			},
			clickClear() {
				for (var k = 0; k < this.arrayList.length; k++) {
					var Data = this.arrayList[k]
					Data.num = 0
					Data.showStepper = false
				}
				this.ProdCateInfo.forEach(data => {
					data.numInfo = 0
				})
				this.arrayList = this.arrayList
				this.ProdCateInfo = this.ProdCateInfo
				this.cartLists = []
				this.addNum = 0
				this.allMoney = 0

				uni.setStorage({
					key: "cartList",
					data: []
				})
			},
			shopRevertMain() {
				uni.redirectTo({
					url: "../indexMain/index"
				})
			},
			clickInput() {
				// 点击输入框   选择地址
				uni.navigateTo({
					url: "../selectRegion/index"
				})
			},
			changeMode(e) {
				if (this.loading) {
					return
				}
				this.radioMode = e.detail
				this.getList()
			},
			shopClick() {
				uni.navigateTo({
					url: './changeStore/index?indexCan=true'
				})
			},
			getList(openID) {
				this.radioMode = app.globalData.isPack
				this.radioMode = this.radioMode
				this.loading = true
				APIList.api('Index.aspx', {}, openID, this.radioMode).then(D => {
					this.$showLoads(1, '')
					D.ProdInfo.forEach(data => {
						data.num = 0
					})
					let list = filterList(D.ProdCateInfo[this.currentIndex].CateNo, D.ProdInfo)

					// 设置左边导航右上角图标
					var prodCateInfo = setLeftNum(D.ProdCateInfo)

					this.ProdCateInfo = prodCateInfo
					this.allGoodList = D.ProdInfo
					this.arrayList = list
					this.shopName = D.ShopName
					app.globalData.minAmount = D.MinDistributionAmount
					this.WXSmallProgramKf = D.WX_SmallProgramKf
					this.loading = false
					this.setList()
					// wx.hideNavigationBarLoading()
					// wx.stopPullDownRefresh()
				}).catch(e => {
					this.loading = false

					// wx.hideNavigationBarLoading()
					// wx.stopPullDownRefresh()
				})
			},
			setList() {
				var _this = this
				_this.addNum = 0
				let cartList = uni.getStorageSync('cartList')

				this.allMoney = 0
				if (cartList && cartList.length > 0) {
					for (var j = 0; j < _this.arrayList.length; j++) {
						var D = _this.arrayList[j]
						D.num = 0 // D.num = 0  //清除所有num

						for (var i = 0; i < cartList.length; i++) {
							var Data = cartList[i]

							if (Data.ProdNo === D.ProdNo&& !Data.ActiveID) {
								// 只有ProdNo相同的，改变其num
								D.num = Data.num
								if (Data.hasOwnProperty('showStepper')) {
									if (Data.num === 0) {
										D.showStepper = false
									} else {
										D.showStepper = Data.showStepper
									}
								}
							}

						}
					}

					for (var j = 0; j < cartList.length; j++) {
						var Data = cartList[j]

						_this.allMoney += Number(Data.num) * Number(Data.SalePrice)
						_this.addNum += Number(Data.num)
					}

				} else {
					// 清空数据
					for (var j = 0; j < _this.arrayList.length; j++) {
						var D = _this.arrayList[j]
						D.num = 0
					}
				}
				_this.cartLists = cartList
				_this.allMoney = parseFloat(_this.allMoney.toFixed(2))
			},
			determine() {
				uni.navigateTo({
					url: './paymentOrder/index'
				})
			},
			searchGoods() {
				uni.navigateTo({
					url: "./searchGood/index"
				})
			},
			goodCodeFun() {
				// 二维码 识别商品
				let _this = this
				_this.isShowCode = false
				uni.scanCode({
					success: function(res) {
						let arr = _this.allGoodList.filter(D => Number(D.ProdNo) === Number(res.result))
						if (arr.length === 0) {
							//未找到该商品
							uni.showToast({
								title: "未找到该商品",
								icon: 'none'
							});
							_this.goodCodeData = {}
						} else {
							_this.goodCodeData = arr[0]
							_this.isShowCode = true
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "二维码未识别",
							icon: 'none'
						});
					}
				});
			}
		},
		onLoad: function() {
		},
		onShow: function() {
			// app.globalData.isPack = 2
			if (!app.globalData.isPack) {
				uni.redirectTo({
					url: "../indexMain/index"
				})
				return
			}
			if (!app.globalData.openID) {
				this.$showLoads(0, '') //加载
				this.$store.dispatch('Login').then(D => {
					this.getList(app.globalData.openID)
				})
			} else {
				this.$showLoads(0, '') //加载
				this.getList()
			}
			this.provider = app.globalData.provider
			
			if (this.arrayList.length > 0) {
				this.setList()
				var prodCateInfo = setLeftNum(this.ProdCateInfo)
				this.ProdCateInfo = prodCateInfo
				// 清除购物车
				var cartList = uni.getStorageSync('cartList')
				if (!cartList || cartList.length === 0) {
					this.arrayList.forEach(D => {
						D.num = 0 //清除所有num
					})
					this.ProdCateInfo.forEach(data => {
						data.numInfo = 0
					})
					this.cartLists = []
					this.ProdCateInfo = this.ProdCateInfo
					this.addNum = 0
					this.allMoney = 0
					this.arrayList = this.arrayList
				}
			}
		}
	}

	function setListNum(_this, list) { //list 购物车列表,修改购物车列表对应的 num

		for (var i = 0; i < list.length; i++) {
			var Data = list[i]

			for (var j = 0; j < _this.arrayList.length; j++) {
				var D = _this.arrayList[j]

				// Number(Data.num) > 0 && 
				if (Data.ProdNo == D.ProdNo) {
					Data.showStepper = D.showStepper

					// 控制右角沟
					D.num = Data.num
					if (Number(Data.num) == 0) {
						D.showStepper = false
					}
				}
			}
			_this.allMoney += Number(Data.num) * Number(Data.SalePrice)
			_this.addNum += Number(Data.num)
		}
		_this.allMoney = parseFloat(_this.allMoney.toFixed(2))
	}

	// 当前左边栏的id, 总的右边数据
	function filterList(currentCate, valueData) {
		let arr = []
		valueData.forEach(data => {
			if (currentCate == data.CateNo) {
				arr.push(data)
			}
		})
		return arr
	}

	function setLeftNum(prodCateInfo, cartList) {
		// 设置左边的点
		var cartListNew = cartList ? cartList : uni.getStorageSync('cartList')

		prodCateInfo.forEach(D => {
			D.numInfo = 0
			if (cartListNew.length > 0) {
				cartListNew.forEach(item => {
					if (D.CateNo === item.CateNo) {
						D.numInfo = D.numInfo + item.num
					}
				})
			}
		})
		return prodCateInfo
	}
</script>

<style lang="scss">
	.index-canteen-style {
		background: #FFFFFF;
		min-height: 100vh;

		.customer-service-style {
			right: 35px;
			z-index: 5;
		}

		.uni-popup {
			z-index: 10;
		}

		.homepage {
			padding-top: 79px;
			background: #FFFFFF;
		}

		.shop-name {
			text-align: center;
			font-size: 14px;
			padding-top: 5px;
			line-height: 25px;
			position: fixed;
			width: 100%;
			z-index: 1;
			background: #fff;
		}

		.shop-name-icon {
			display: inline-block;
			vertical-align: middle;
			margin-right: 4px;
		}

		.homepage .homePageTop {
			/* position:fixed;  */
			/* top:0; */
			width: 100%;
			z-index: 3;
		}

		.homepageLeftFa {
			height: 100vh;
			position: fixed;
			left: 0;
			min-width: 74px;
			max-width: 74px;
			overflow-y: scroll;
			background: #f9f9f9;
		}

		.homepageLeftFixed {
			font-size: 11pt;
			margin-bottom: 96px;
			color: #707070;
			font-weight: 500;
			background: #f9f9f9;
			padding-bottom: 15px;
		}

		.homepageLeft {
			background: #f7f6f6;
			text-align: center;
			padding: 12px 8px;
			line-height: 1.4;
			position: relative;
		}

		.homepageLeft-info {
			position: absolute;
			top: 5px;
			right: 10px;
			width: 10px;
			height: 10px;
			/* padding: 0 3px; */
			/* font-family: PingFang SC, Helvetica Neue, Arial, sans-serif; */
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

		.homepageRight {
			margin-left: 74px;
		}

		.homepage .iconCard {
			width: 44px;
			height: 44px;
			background: #ffa006;
			border-radius: 50%;
			text-align: center;
			line-height: 50px;
			color: #fff;
			font-size: 25px;
			margin: 0 0 20px 20px;
		}

		.homepage .tapCard {
			font-size: 12px;
			color: #707070;
			margin-left: 10px;
		}

		.custom-popup {
			margin-bottom: 50px;
		}

		.MockRadio {
			padding: 10px;
			display: block;
		}

		.MockLabel {
			display: block;
			width: 100%;
			line-height: 20px;
		}

		.indexTop {
			display: flex;
			justify-content: center;
			margin: 10px 0;
		}

		.changeMode {
			width: 130px;
			height: 60px;
			display: flex;
			background: #eee;
			align-items: center;
			justify-content: center;
			border-radius: 10px;
			font-size: 14px;
			color: #3062a5;
		}

		.changeModeImg {
			width: 35px !important;
			height: 35px;
		}

		.changeModeLeft {
			margin-right: 20px;
		}

		.changeModeRight {
			margin-left: 10px;
		}

		.isActive {
			border: 1px solid #3062a5;
		}

		.shop-revert {
			float: left;
			position: absolute;
			left: 5px;
			color: #777;
		}

		.shop-revert-icon {
			vertical-align: middle;
		}

		//输入框
		.ReachTime {
			padding: 5px;
			border-bottom: 1px solid #eee;
			border-top: 1px solid #eee;
			background: #fff;
			position: relative;
			height: 35px;

			.ReachTimeInput {
				display: flex;
			}
		}

		.ReachTime .weui-input {
			width: 100%;
			background: rgb(238, 238, 238);
			border-radius: 15px;
			text-align: left;
			font-size: 11pt;
			height: 30px;
			padding: 2px 12px;
		}

		.goodCodeStyle {
			position: absolute;
			right: 8px;
			top: 4px;
			font-size: 22px;
			width: 39px;
			height: 33px;
			line-height: 33px;
			z-index: 5;
		}

		//输入框end

	}
</style>
