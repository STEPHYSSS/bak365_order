<template>
	<view class="goodInfo-style">
		<!-- 商品详情 -->
		<bottom-submit v-if="allMoney>0" :allMoney="allMoney" :addNum="addNum" @setCartList="setCartList" :cartLists="cartLists"
		 @clickClear="clickClear" @determine="determine" :isOrder="false"></bottom-submit>

		<!-- class="swiperStyle" -->
		<swiper :indicator-dots="true" indicator-active-color="#ffa006" :autoplay="autoplay" :interval="interval" :duration="duration"
		 :style="{height:windowWidth+'px'}">
			<view v-for="(item,index) in goodInfo.CarouselImgInfo" :key="index">
				<swiper-item :style="{height:windowWidth+'px'}">
					<view class="swiperBox">
						<image :key="keyImage" :src="item.ImgUrl" class="swiperImg" @load="swiperImageLoad($event,index)" />
						<!-- :style="{ width: imageSize[index].width + 'px', height: imageSize[index].height + 'px' }" -->
					</view>
				</swiper-item>
			</view>
		</swiper>

		<view class="goodInfoBottom">
			<view class="goodInfoBottom-name">{{goodInfo.ProdName}}</view>

			<view class="surplus" v-if="goodInfo.StockQty<=20">仅剩{{goodInfo.StockQty}}件</view>
			<view class="goodInfoBottom-money" v-if="goodInfo.SalePrice">
				<text class="sign">￥</text>
				<text class="money">{{setDecimalFun(goodInfo.SalePrice)}}</text>
				<view style="float: right;">
					<stepperCard :itemData="goodInfo" class="stepperStyle-card" @mycurrentPage="mycurrentPage" @setShowStepper="setShowStepper"></stepperCard>
				</view>
			</view>
			<view class="goodInfoNews">
				<view class="goodInfoNewsTitle">
					<text class="title">----商品详情----</text>
				</view>
				<view class="contentStyle">
					<uParse :content="article"/>
					<!-- <u-parse :content="article" @navigate="navigate"></u-parse> -->
					<!-- <uParse :content="article" :imageUrls="imageUrls" noData="内容为空" /> -->
					<!-- @preview="preview" @navigate="navigate" -->
				</view>
			</view>
		</view>

		<btn-service :WXSmallProgramKf="goodInfo.WX_SmallProgramKf" :provider="provider" messageTitle="商品详情" messagePath="/pages/indexCanteen/goodInfo/index"></btn-service>
	</view>
</template>

<script>
	var utils = require('@/utils/utils.js')
	import APIList from '@/api/http.js'
	import stepperCard from '@/components/stepperCard/index.vue'
	import bottomSubmit from '@/components/bottomSubmit/index.vue'
	// import uParse from '@/components_uni/gaoyia-parse/parse.vue'
	import uParse from '@/components/u-parse/u-parse.vue'
	import btnService from '@/components/customerService/index.vue'

	let app = getApp()
	export default {
		components: {
			stepperCard,
			bottomSubmit,
			uParse,
			btnService
		},
		data() {
			return {
				keyImage: 0,
				imgUrls: [
					// 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
					// 'http://img3.imgtn.bdimg.com/it/u=1440276743,1313626642&fm=26&gp=0.jpg',
					// 'http://img0.imgtn.bdimg.com/it/u=1774235839,1911792023&fm=26&gp=0.jpg'
				],
				autoplay: true,
				interval: 3000,
				duration: 800,
				goodInfo: {},
				article: "",
				// 添加的商品列表
				cartLists: [],
				imageSize: [],
				addNum: 0,
				allMoney: 0,
				ProdNo: '',
				windowWidth: 0,
				provider: ''
			}
		},
		onShareAppMessage: function() {
			return {
				title: this.goodInfo.ProdName,
				path: 'pages/indexCanteen/goodInfo/index?ProdNo=' + this.goodInfo.ProdNo
			}
		},
		methods: {
			setDecimalFun(val) {
				return utils.setDecimal(val)
			},
			getInfo() {
				this.provider = app.globalData.provider
				var _this = this
				APIList.api('ProdItem.aspx', {
					ProdNo: _this.ProdNo
				}).then(D => {
					this.goodInfo = D
					this.article = D.FeaturesHtmlInfo
					var arr = this.article.split('<img')
					var data = arr.map(val => val.replace('../', 'https://we.bak365.net/SmallProgramSaleOrder/'));
					var a = data.map(val => {
						if (val.indexOf('src') !== -1) {
							return("<img" + val);
						} else {
							return val;
						}
					})
					this.article = a.join('');
					// console.log(this.article);
					var cartList = uni.getStorageSync('cartList')
					// console.log(cartList, 'cartList')
					var allNum = 0 //总的钱数
					var addNum = 0 //总个数
					if (cartList && cartList.length > 0) {
						// 拷贝，剪切cartList
						var arr = cartList.slice()
						for (var i = 0; i < arr.length; i++) {
							var item = arr[i]
							if (_this.goodInfo.ProdNo === item.ProdNo) {
								_this.goodInfo.num = item.num
								if (item.hasOwnProperty('showStepper')) {
									_this.goodInfo.showStepper = item.showStepper
								}
							}
							allNum += Number(item.num) * Number(item.SalePrice)
							addNum += Number(item.num)

							if (Number(item.num) === 0) {
								cartList.splice(i, 1)
							}
						}
					}
					allNum = parseFloat(allNum.toFixed(2))
					_this.cartLists = cartList
					_this.allMoney = allNum
					_this.addNum = addNum
				}).catch(e => {})
			},
			mycurrentPage(e) {
				var cartListArr = utils.setCard(e)

				this.allMoney = 0
				this.addNum = 0

				for (var i = 0; i < cartListArr.length; i++) {
					var Data = cartListArr[i]
					this.allMoney += Number(Data.num) * Number(Data.SalePrice)
					this.addNum += Number(Data.num)
				}

				// allMoney,addNum
				this.allMoney = parseFloat(this.allMoney.toFixed(2))
				this.cartLists = cartListArr
				this.addNum = cartListArr.length > 0 ? this.addNum : 0
				this.allMoney = cartListArr.length > 0 ? this.allMoney : 0

				if (this.cartLists.length > 0) {
					//当num为0的时候
					this.cartLists.forEach(D => {
						if (D.ProdNo == this.goodInfo.ProdNo && D.num == 0) {
							this.goodInfo.showStepper = false
						}
					})
				}
			},
			setShowStepper(bool) {
				this.goodInfo.showStepper = bool
			},
			setCartList(num, index) {
				this.cartLists[index].num = num
				this.cartLists[index].prodPartsInfo.forEach((D) => {
					D.num = num //更新商品配件的数量
				})

				// utils.controlGoodStock(this, index)
				utils.controlPartsStock(this, index)

				var _this = this
				var list = this.cartLists

				_this.allMoney = 0
				_this.addNum = 0
				for (var i = 0; i < list.length; i++) {
					var Data = list[i]
					if (Number(Data.ProdNo) === Number(_this.goodInfo.ProdNo)) {
						_this.goodInfo.num = Data.num
					}
					_this.allMoney += Number(Data.num) * Number(Data.SalePrice)
					_this.addNum += Number(Data.num)
				}

				for (var i = 0; i < list.length; i++) {
					// 当num为0的时候，剪切掉
					var Ditem = list[i]
					if (Number(Ditem.num === 0)) {
						list.splice(i, 1)
					}
				}
				this.$nextTick(function() {
					_this.allMoney = parseFloat(_this.allMoney.toFixed(2))
					_this.cartLists = list
					_this.addNum = list.length > 0 ? _this.addNum : 0
					_this.allMoney = list.length > 0 ? _this.allMoney : 0
				})
				uni.setStorage({
					key: "cartList",
					data: list
				})
			},
			clickClear() {
				this.goodInfo.num = 0
				this.cartLists = []
				this.addNum = 0
				this.allMoney = 0

				uni.setStorage({
					key: "cartList",
					data: []
				})
			},
			determine() {
				uni.navigateTo({
					url: '../paymentOrder/index'
				})
			},
			//获取轮转图图片高度
			swiperImageLoad: function(e, index) {
				// console.log(e, 'eeee')

				// var $width = e.detail.width //获取图片真实宽度
				// var $height = e.detail.height
				// if ($width >= 300 || $height > 300) {
				// 	return
				// }

				// this.imageSize[index] = {
				// 		width: $width,
				// 		height: $height
				// 	}
				++this.keyImage
			}
		},
		onLoad: function(options) {
			console.log(options,'options')
			this.ProdNo = options.ProdNo
			this.getInfo()
			const {
				windowWidth,
				windowHeight
			} = uni.getSystemInfoSync();
			this.windowWidth = windowWidth

			if (!app.globalData.shopNo || !app.globalData.isPack) {
				// console.log('没有门店');
				//没有门店，跳到门店列表
				uni.reLaunch({
					url: '/pages/indexCanteen/changeStore/index?goodInfo=' + this.ProdNo
				})
			}

			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getInfo()

				})
			} else {
				// console.log('获取数据');
				this.getInfo()
			}
		},
		onShow: function() {
			if (!uni.getStorageSync('cartList') || uni.getStorageSync('cartList').length === 0) {
				this.cartLists = []
				this.allMoney = 0
				this.goodInfo.num = 0
			}

		}
	}
</script>

<style lang="scss"> 
	.goodInfo-style {
		background: #fff;
		padding-bottom: 60px;
		min-height: 100vh;
		box-sizing: border-box;

		.customer-service-style {
			// top: 0;
			// right: 35px;
			// z-index: 5;
		}

		image {
			width: auto;
			height: auto;
		}

		.uni-popup {
			z-index: 10 !important;
		}

		.goodInfoBottom {
			padding: 10px;

			.goodInfoBottom-name {
				font-size: 11pt;
			}
		}

		.feature {
			font-size: 14px;
			color: #707070;
		}

		.number {
			font-size: 12px;
			color: #707070;
			line-height: 20px;
		}

		.surplus {
			font-size: 12px;
			color: #ffa006;
			line-height: 20px;
		}

		.sign {
			font-size: 12px;
			color: #ffa006;
			margin-right: 2px;
		}

		.money {
			color: #ffa006;
			font-size: 18px;
		}

		.originalPrice {
			margin-left: 10px;
			font-size: 12px;
			color: #707070;
			text-decoration: line-through;
		}

		.activityStyle {
			color: #707070;
			display: flex;
			border-top: 1px solid #eee;
			border-bottom: 1px solid #eee;
			margin: 10px -10px;
			padding: 10px;
		}

		.activityLeft {
			width: 40px;
			font-size: 14px;
		}

		.activityRight {
			font-size: 12px;
		}

		.IntegralInfo {
			margin-left: 8px;
		}

		.coupon {
			margin-top: 10px;
			display: block;
		}

		.goodInfoNewsTitle {
			text-align: center;
			margin-top: 20px;
			font-size: 10pt;
		}

		.goodInfoNewsTitle .title {
			color: #707070;
			background: #F5FDEB;
			display: inline-block;
			padding: 5px 18px;
			border-radius: 20px;
		}

		.goodInfoUl {
			display: block;
			margin: 20px 0 40px 0;
			font-size: 14px;
		}

		.goodInfoNewsLi {
			border-bottom: 1px dotted #999;
			color: #999;
			font-size: 14px;
			display: block;
			padding: 8px 0;
		}

		.goodInfoNewsLeft {
			width: 100px;
			display: inline-block;
		}

		.goodInfoBottom-money {
			position: relative;
		}

		.stepperStyle-card {
			position: absolute;
			top: 0;
			right: 0;
		}

		.contentStyle {
			/* text-align: center; */
			font-size: 11pt;
			padding-top: 20px;
		}

		.swiperStyle {
			height: 300px !important;
		}

		.swiperImg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			vertical-align: middle;
		}
	}
</style>
