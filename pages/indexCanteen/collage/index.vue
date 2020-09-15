<template>
	<view :class="['goodInfo-style',changeStoreShow?'':'padding-goodInfo-style']">
		<!-- 拼团详情页 -->
		<div v-show="!changeStoreShow">
			<div class="submit-bar-btn" v-if="activeInfo.ActiveStatus==='3'&&!loading">
				<button @click="onClickOrder" class="" size="mini" :style="{backgroundColor:'#ff4343',color:'#fff',width:'40%'}">
					去付款
				</button>
			</div>

			<div v-if="!loading">
				<div class="swiper-style">
					<swiper :indicator-dots="false" indicator-active-color="#ffa006" :autoplay="autoplay" :interval="interval"
					 :duration="duration" :style="{height:windowWidth+'px'}">
						<swiper-item :style="{height:windowWidth+'px'}">
							<view class="swiperBox">
								<image :key="keyImage" :src="goodInfo.ProdImg" class="swiperImg" @load="swiperImageLoad($event,index)" />
							</view>
						</swiper-item>
					</swiper>

					<view class="flashSale-head-style">
						<text class="flashSale-head-style_title">拼团</text>
						<view class="flashSale-head-style_content">
							<text style="font-size: 20px;">¥</text><text style="font-size:30px">{{setDecimalFun(goodInfo.ActiveSalePrice)}}</text>
							<text class="flashSale-head-style_price">¥{{setDecimalFun(goodInfo.SalePrice)}}</text>
						</view>
						<view class="flashSale-head-style_time">
							<text class="flashSale-head-style_timeTitle">距{{!stateTime?'开始':'结束'}}还剩</text>
							<uni-countdown color="#ff4343" splitor-color="#FFFFFF" background-color="#FFFFFF" border-color="#ff4343" :day="activeTimeMy.day"
							 :hour="activeTimeMy.hours" :minute="activeTimeMy.minute" :second="activeTimeMy.second" @timeup="timeupFun"></uni-countdown>
						</view>
					</view>
				</div>

				<view class="goodInfoBottom">
					<view class="goodInfoBottom-name">
						<span class="goodInfoBottom-tag">{{activeInfo.OpenGroupBuyMinCount}}人拼团价</span>
						<span style="vertical-align: middle;">{{goodInfo.ProdName}}</span>
					</view>

					<div style="display: flex;margin-top: 12px;">
						<text class="surplus" v-if="activeInfo.ActiveOwnBuyCount>0">每人限制{{activeInfo.EveryOneMaxBuyCount}}件</text>
						<text class="surplus" v-if="activeInfo.ActiveStock">仅剩{{Number(activeInfo.ActiveStock)-Number(activeInfo.ActiveSaleCount)}}件</text>
					</div>
					<view class="tip-seckill-style">
						<view class="tip-seckill-style_left">拼团</view>
						<view class="tip-seckill-style_right">{{setActiveStatus()}}</view>
					</view>

					<div class="group-playing" @click="groupPlaying">
						<div>
							<span class="group-playing__title">[拼团玩法]</span>
							<div class="group-playing__titleRight">
								<span style="vertical-align: middle;">玩法详情</span>
								<uni-icons style="vertical-align: middle;margin-left: 5px;" type="arrowright" size="16"></uni-icons>
							</div>
						</div>
						<span class="group-playing__info">支付开团邀请{{activeInfo.OpenGroupBuyMinCount}}名用户参团，人数不足自动退款</span>
					</div>
					<div class="cellPint" @click="collageList(true)" :style="{'border-bottom':GroupInfo.length>0?'none':'1px solid #eee'}">
						我参与的团列表
						<uni-icons style="float: right;" type="arrowright" size="16"></uni-icons>
					</div>
					<div v-if="GroupInfo.length>0">
						<div class="cellPint" @click="collageList(false)">
							以下小伙伴正在发起拼团、你可以直接参与
							<uni-icons style="float: right;" type="arrowright" size="16"></uni-icons>
						</div>
						<div class="assembled-users" v-for="(item,index) in GroupInfo" :key="index">
							<div class="assembled-users_img">
								<image :src="item.HeardImg" alt="">
							</div>
							<div class="assembled-users_info">
								<div class="assembled-users_infoName"> {{item.NickName}}</div>
								<span class="assembled-users_infoTime">还差
									<i style="color:#e64b2b;display: inline;">{{item.SurplusNum}}</i>人成团
									<div style="display: inline-block;" v-if="item.activeTimeMy">
										,剩余
										<uni-countdown :show-day="item.activeTimeMy.day>0" style="display: inline-block;" :show-colon="false" color="#666"
										 background-color="#fff" border-color="#fff" widthMy="10px" :day="item.activeTimeMy.day" :hour="item.activeTimeMy.hours"
										 :minute="item.activeTimeMy.minute" :second="item.activeTimeMy.second"></uni-countdown>
									</div>
								</span>
							</div>
							<div class="assembled-users_btn">
								<span class="users_btn" @click="getTogether(item.GroupNo)">去凑团</span>
							</div>
						</div>
					</div>
				</view>
				<view class="goodInfoNews">
					<view class="goodInfoNewsTitle">
						<wuc-tab textFlex :tab-list="tabList" :tabCur.sync="TabCur" tab-class="'text-center','text-black','bg-white'"
						 :select-class="'btnMy'+colorIndex"></wuc-tab>
					</view>
					<view class="contentStyle" v-show="TabCur==0">
						<u-parse :content="article"></u-parse>
					</view>
					<view class="tableStyle" v-show="TabCur==1&&activeInfo.SaleInfo.length>0">
						<view class="tableStyle_head tableRow">
							<view class="tableRow_col" style="flex:none;width:45px">买家</view>
							<view class="tableRow_col">成交时间</view>
							<view class="tableRow_col" style="flex:none;width:80px">数量</view>
						</view>
						<view class="tableStyle_body tableRow" v-for="item in activeInfo.SaleInfo" :key="item.Name">
							<view class="tableRow_col" style="flex:none;width:45px">{{setName(item.Name)}}</view>
							<view class="tableRow_col">{{item.PreTime}}</view>
							<view class="tableRow_col" style="flex:none;width:80px">{{item.Qty}}</view>
						</view>
					</view>
				</view>
			</div>
		</div>
		<change-store v-if="changeStoreShow" :isFlashSale="true" @clickStore="clickStore" :ActiveID="ActiveID"></change-store>
		<change-store-pack :currentStore="currentStore" :isActive="true" :clickShow="clickShow" :modeChangeNum="modeChange"
		 @onClose="onClose" @changeMode="changeModeFun"></change-store-pack>

		<div v-if="activeInfo.ActiveStatus!=='3'">
			<stepperCard ref="stepperCard" :itemData="goodInfo" class="stepperStyle-card" @mycurrentPage="mycurrentPage"
			 @setShowStepper="setShowStepper" :isCollage="true" :controlBuy="stateTime&&!activeTimeEnd&&activeInfo.ActiveStatus!=='1'&&activeInfo.ActiveStatus!=='4'">
			</stepperCard>
		</div>
		<!-- 控制按钮的遮罩层，跳到选择门店列表中 -->
		<div @click="clickStorePopup" v-if="!isNewStore||!isPack" class="stepperCardPopup"></div>
	</view>
</template>

<script>
	var utils = require('@/utils/utils.js')
	import APIList from '@/api/http.js'
	import stepperCard from '@/components/stepperCard/index.vue'
	import bottomSubmit from '@/components/bottomSubmit/index.vue'
	import btnService from '@/components/customerService/index.vue'
	import uParse from '@/components_uni/gaoyia-parse/parse.vue'
	import uniCountdown from '@/components_uni/uni-countdown/uni-countdown.vue'
	import WucTab from '@/components_uni/wuc-tab/wuc-tab.vue';
	import changeStore from '@/pages/indexCanteen/changeStore/index';
	import changeStorePack from '@/components/poppupChangeOrder/index.vue'
	import uniIcons from '@/components_uni/uni-icons/uni-icons.vue'
	import uniGoodsNav from '@/components_uni/uni-goods-nav/uni-goods-nav.vue'

	let app = getApp()
	export default {
		components: {
			stepperCard,
			bottomSubmit,
			uParse,
			btnService,
			uniCountdown,
			WucTab,
			changeStore,
			changeStorePack,
			uniIcons,
			uniGoodsNav
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
				// 添加的商品列表 8
				cartLists: [],
				imageSize: [],
				addNum: 0,
				allMoney: 0,
				ActiveID: '',
				windowWidth: 0,
				provider: '',
				activeInfo: {},
				loading: true,
				activeTimeMy: {},
				stateTime: false,
				activeTimeEnd: '',
				itemColor: app.globalData.itemColor,
				colorIndex: app.globalData.colorIndex,
				isPack: app.globalData.isPack,
				TabCur: 0,
				tabList: [{
					name: '商品详情'
				}, {
					name: '最近成交'
				}],
				changeStoreShow: false,
				clickStoreShow: true,
				isNewStore: false,
				currentStore: {},
				modeChange: {},
				clickShow: false,
				// 拼团的人信息
				GroupInfo: [],
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
				]
			}
		},
		created() {},
		methods: {
			setDecimalFun(val) {
				return utils.setDecimal(val)
			},
			setName(val) {
				return String(val).slice(0, 1) + '**'
			},
			getShopInfo() {
				var location = uni.getStorageSync('location')
				this.location = location
				APIList.api('ShopInfo.aspx', {
					SearchVal: '',
					Longitude: location.longitude || '',
					Latitude: location.latitude || '',
					ActiveID: this.ActiveID || ''
				}).then(D => {
					this.dataList = D.ShopInfo
					this.currentStore = this.dataList.filter(item => item.ShopNo == app.globalData.shopNo)

					this.$nextTick(function() {
						this.currentStore = this.currentStore[0]
					})
					this.modeChange = {
						LogisticsDistribution: D.WX_LogisticsDistribution,
						OrderEatInStore: D.WX_OrderEatInStore,
						OrderEatPackAway: D.WX_OrderEatPackAway,
					}
					this.clickShow = true
				}).catch(e => {})
			},
			getInfo() {
				this.loading = true
				this.$showLoads(0, '')
				this.provider = app.globalData.provider
				var _this = this
				APIList.api('Active/GroupBuy/Index.aspx', {
					ActiveID: this.ActiveID || ''
				}).then(D => {
					this.$showLoads(1, '')
					this.goodInfo = D.ProdInfo
					this.activeInfo = D
					// this.activeInfo.ActiveStatus = '1'
					// this.activeInfo.EveryOneMaxBuyCount = '2'

					this.goodInfo.num = 1
					this.goodInfo.ActiveID = this.ActiveID
					this.goodInfo.StockQty = this.activeInfo.ActiveStock //把活动库存改个字段
					this.goodInfo.EveryOneMaxBuyCount = this.activeInfo.EveryOneMaxBuyCount //把活动库存改个字段
					this.goodInfo.ActiveOwnBuyCount = this.activeInfo.ActiveOwnBuyCount

					if (this.activeInfo.GroupInfo.length > 0) {
						this.activeInfo.GroupInfo.forEach(D => {
							if (D.VaildTime) {
								D.activeTimeMy = this.getVaildTime(D.VaildTime)
							}
						})
					}

					if (this.activeInfo.GroupInfo.length > 3) {
						this.GroupInfo = this.activeInfo.GroupInfo.slice(0, 3)
					} else {
						this.GroupInfo = this.activeInfo.GroupInfo
					}

					if (this.activeInfo.hasOwnProperty('ShopInfo')) {
						let arr = this.activeInfo.ShopInfo.split(',')
						this.isNewStore = (arr.filter(item => Number(item) === Number(app.globalData.shopNo)))
							.length > 0
					}

					if (!app.globalData.shopNo || !this.isNewStore || !app.globalData.isPack) {
						uni.setStorageSync('cartList', [])
					}

					this.tabList[1].name = '最近成交' + '(' + this.activeInfo.SaleInfo.length + ')'

					setTimeout(() => {
						this.article = this.activeInfo.ProdInfo.FeaturesHtmlInfo
					}, 300)
					//处理计时器时间
					this.getTimeout()
					var cartList = uni.getStorageSync('cartList')
					// console.log(cartList, 'cartList')
					var allNum = 0 //总的钱数
					var addNum = 0 //总个数
					if (cartList && cartList.length > 0) {
						// 拷贝，剪切cartList
						var arr = cartList.slice()
						for (var i = 0; i < arr.length; i++) {
							var item = arr[i]
							if (_this.ActiveID === item.ActiveID) {
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
					allNum = parseFloat(Math.round(allNum * 100) / 100)
					_this.cartLists = cartList
					_this.allMoney = allNum
					_this.addNum = addNum
					this.loading = false
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()

					//分享
					uni.showShareMenu({
						withShareTicket: true,
						title: this.goodInfo.ProdName,
						path: '/pages/indexCanteen/goodInfo/index?ProdNo=' + this.goodInfo.ProdNo
					})
				}).catch(e => {
					// this.loading = false
					this.$showLoads(1, '')
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
				})
			},
			setActiveStatus(bool) {
				bool = bool ? bool : ''
				if (this.activeTimeEnd) {
					return '拼团已结束'
				}

				switch (this.activeInfo.ActiveStatus) {
					case '0':
						if (this.stateTime) {
							return '预计' + ' ' + this.activeInfo.EndTime + ' ' + '结束'
						}
						return '预计' + ' ' + this.activeInfo.StartTime + ' ' + '开始'
					case '1':
						return '已达到最大购买量'
					case '3':
						return '有代付款订单,请先付款'
					case '2':
						if (!this.stateTime) {
							return '预计' + ' ' + this.activeInfo.StartTime + ' ' + '开始'
						}
						return '预计' + ' ' + this.activeInfo.EndTime + ' ' + '结束'
					case '4':
						return '拼团已结束'
				}
			},
			getTimeout(current) {
				let currentT = new Date().getTime()
				let End = new Date(this.activeInfo.EndTime.replace(/-/g, '/')).getTime()
				let Start = new Date(this.activeInfo.StartTime.replace(/-/g, '/')).getTime()
				// let Start = new Date('2020-05-08 16:47:40').getTime()
				// let End = new Date('2020-05-08 16:55:50').getTime()
				// false 活动未开始 true 活动开始了 end为活动结束
				this.stateTime = Start - currentT >= 0 ? false : true
				let activeTimeMy = this.stateTime ? End - currentT : Start - currentT
				let myTime = activeTimeMy
				this.activeTimeMy = {
					day: parseInt(myTime / (1000 * 60 * 60 * 24)),
					hours: parseInt((myTime % (1000 * 60 * 60 * 24)) / (60 * 60 * 1000)),
					minute: parseInt((myTime % (1000 * 60 * 60)) / (60 * 1000)),
					second: parseInt((myTime % (1000 * 60)) / 1000)
				}
				this.activeTimeEnd = activeTimeMy <= 0 ? true : false
			},
			getVaildTime(VaildTime) {
				// 计算拼团剩余时间
				let currentT = new Date().getTime()
				let End = new Date(VaildTime.replace(/-/g, '/')).getTime()
				// false 拼团结束 否则拼团中
				// let surplus = End - currentT >= 0 ? false : true
				let myTime = End - currentT
				return {
					day: parseInt(myTime / (1000 * 60 * 60 * 24)),
					hours: parseInt((myTime % (1000 * 60 * 60 * 24)) / (60 * 60 * 1000)),
					minute: parseInt((myTime % (1000 * 60 * 60)) / (60 * 1000)),
					second: parseInt((myTime % (1000 * 60)) / 1000)
				}
			},
			timeupFun() {
				setTimeout(() => {
					this.getTimeout()
				}, 1000)
			},
			onClickOrder() {
				uni.navigateTo({
					url: "/pages/indexOrder/orderInfo/index?&id=" + this.activeInfo.ActiveOrderID
				})
			},
			mycurrentPage(arr, bool, userObj) {
				//点击下单
				if (bool) {
					// 单独购买
					if (arr.itemData.hasOwnProperty('ActiveID')) {
						delete arr.itemData.ActiveID
					}
					uni.setStorageSync("listCollage", [arr.itemData])
					uni.navigateTo({
						url: '../paymentOrder/index?isCollage=true'
					})
				} else {
					// 拼团购买
					if (!arr.itemData.hasOwnProperty('ActiveID')) {
						arr.itemData.ActiveID = this.ActiveID
					}
					if (JSON.stringify(userObj) !== '{}') {
						//已经授权用户信息
						uni.showLoading({
							title: ''
						});
						APIList.api('Active/Submit_ajax.aspx', {
							ActiveID: this.ActiveID || '',
							Type: 'AddGroupBuy',
							GroupNo: '',
							HeardImg: userObj.HeardImg, //用户头像
							NickName: userObj.NickName //用户昵称
						}).then(D => {
							uni.hideLoading();
							uni.setStorageSync("listCollage", [arr.itemData])
							uni.navigateTo({
								url: '../paymentOrder/index?isCollage=true'
							})
						}).catch(D => {
							uni.showToast({
								title: D || '参团失败！',
								duration: 2000,
								icon: 'none'
							});
						})
					}
				}
			},
			clickStore() {
				this.isPack = app.globalData.isPack
				this.cartLists = []
				// scrollTo(0, 0)
				this.changeStoreShow = false
				//选择了新门店
				this.isNewStore = true
				this.allMoney = 0

				//加入购物车
				// this.$refs.stepperCard.clickTag()
			},
			clickStorePopup() {
				old: {
					scrollTop: 0
				}
				if (this.isNewStore && !this.isPack) {
					// 选择了门店但有选择打包方式
					this.getShopInfo()
					return
				}
				this.changeStoreShow = true
			},
			setShowStepper(bool) {
				this.goodInfo.showStepper = bool
			},
			changeModeFun(e) {
				this.isPack = e
				this.clickShow = false
			},
			//获取轮转图图片高度
			swiperImageLoad: function(e, index) {
				++this.keyImage
			},
			onClose(e) {
				if (!e) {
					this.clickShow = false
				}
			},
			groupPlaying() {
				uni.navigateTo({
					url: '/pages/indexCanteen/collage/explain'
				})
			},
			getTogether(GroupNo) {
				uni.navigateTo({
					url: '/pages/indexCanteen/collage/info?ActiveID=' + this.ActiveID + '&GroupNo=' + GroupNo
				})
			},
			collageList(bool) {
				let url_ = bool ? '/pages/indexCanteen/collage/collageList?myCollage=true&ActiveID=' + this.ActiveID :
					'/pages/indexCanteen/collage/collageList?ActiveID=' + this.ActiveID

				uni.navigateTo({
					url: url_
				})
			}
		},
		onPullDownRefresh: function() {
			//开启导航条加载动画
			uni.showNavigationBarLoading()
			this.getInfo()
		},
		onLoad: function(options) {
			// SD00007
			this.ActiveID = options.ActiveID || ''
			const {
				windowWidth,
				windowHeight
			} = uni.getSystemInfoSync();
			this.windowWidth = windowWidth
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getInfo()
				})
			} else {
				this.getInfo()
			}
		},
		onShow: function() {
			if (!uni.getStorageSync('cartList') || uni.getStorageSync('cartList').length === 0) {
				this.cartLists = []
				this.allMoney = 0
				this.goodInfo.num = 1
			}
		}
	}
</script>

<style lang="scss">
	@import "/components_uni/gaoyia-parse/parse.css";

	.padding-goodInfo-style {
		padding-bottom: 60px;
	}

	.group-playing {
		padding: 8px;
		background: #Fef5ec;
		margin: 10px 0;
		font-size: 9pt;
		color: #999;

		&__title {
			color: #e64b2b;
		}

		&__titleRight {
			display: inline-block;
			float: right;
		}

		&__info {
			margin-top: 5px;
			display: inline-block;

		}
	}

	.assembled-users {
		display: flex;
		padding: 8px 0;
		border-bottom: 1px solid #eee;
		font-size: 8pt;
		color: #666;
		align-items: center;

		/deep/.uni-countdown__number,
		.uni-countdown__splitor {
			font-size: 8pt !important;
		}

		&_img {
			width: 100rpx;
			height: 100rpx;

			img,
			image {
				width: 100% !important;
				height: 100% !important;
				border-radius: 50%;
			}
		}

		&_info {
			margin-left: 20rpx;
			flex: 1
		}

		&_infoName {
			margin-bottom: 10px;
		}

		&_infoTime {}

		&_btn {
			.users_btn {
				border: 1px solid #eee;
				padding: 10rpx 20rpx;
				border-radius: 16px;

			}
		}
	}

	.goodInfo-style {
		background: #fff;
		min-height: 100vh;
		box-sizing: border-box;

		// .goods-nav-fixed {
		// 	position: fixed;
		// 	right: 0;
		// 	bottom: 0;
		// 	left: 0;
		// 	align-items: center;
		// 	height: 50px;
		// 	background-color: #fff;

		// 	.uni-tab__cart-sub-left {
		// 		padding: 0;
		// 	}

		// 	.uni-tab__right {
		// 		margin: 0;
		// 		border-radius: 0;
		// 	}
		// }

		.cellPint {
			font-size: 9pt;
			border-bottom: 1px solid #eee;
			padding: 10px 0 10px 5px;
			border-top: 1px solid #eee;
			color: #666;
		}

		.submit-bar-btn {
			height: 40px;
			line-height: 40px;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 10;
			width: 100%;
			-webkit-user-select: none;
			user-select: none;
			border-top: 1px solid #e5e5e5;
			display: flex;
			align-items: center;
			background: #fff;
		}

		.swiper-style {
			.flashSale-head-style {
				position: relative;
				background-color: #ff4343;
				color: #fff;
				height: 50px;
				display: flex;


				&_title {
					position: absolute;
					background-color: #ff4343;
					top: -19px;
					left: 0;
					font-size: 12px;
					padding: 4px 8px;
					border-radius: 0 4px 0 0;
					color: #fff;
				}

				&_content {
					padding-left: 8px;
					line-height: 50px;
					color: #fff;
					flex: 1;
				}

				&_price {
					margin-left: 8px;
					font-size: 12px;
					color: #fff;
					opacity: .6;
					line-height: 12px;
					text-decoration: line-through;
				}

				&_time {
					margin-right: 8px;
					font-size: 12px;
				}

				&_timeTitle {
					background-color: inherit;
					display: block;
					padding-top: 2rpx;
					width: auto;
					color: #fff;
				}
			}
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

			.goodInfoBottom-tag {
				color: #e64b2b;
				border: 2rpx solid #e64b2b;
				font-size: 8pt;
				padding: 2px;
				border-radius: 3px;
				margin-right: 8px;
				vertical-align: middle;
			}

			.tip-seckill-style {
				display: flex;
				margin-top: 8px;

				.tip-seckill-style_left {
					background-color: #03b401;
					color: #fff;
					display: inline-block;
					padding: 0 3px;
					vertical-align: top;
					margin-right: 5px;
					border-radius: 2px;
					font-size: 10px;
					line-height: 14px;
				}

				.tip-seckill-style_right {
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					display: inline-block;
					vertical-align: middle;
					color: #666;
					font-size: 12px;
				}

			}

			// .tip-seckill-style_left
			// .tip-seckill-style_right
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
			flex: 1;
			font-size: 12px;
			color: #999;
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
			// margin-top: 20px;
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

		.stepperCardPopup {
			width: 100%;
			height: 50px;
			position: fixed;
			bottom: 0;
		}

		.stepperStyle-card {
			width: 100%;
			height: 50px;
			display: block;

			.sterperCard-style {
				display: block;
			}
		}

		.contentStyle {
			/* text-align: center; */
			font-size: 11pt;
			padding-top: 20px;
		}

		.tableStyle {
			font-size: 12px;
			color: #333;

			.tableStyle_head {
				background: #f2f2f2;
			}

			.tableRow {
				display: flex;
				justify-content: space-around;
				padding: 0 10px;
			}

			.tableRow_col {
				flex: 1;
				line-height: 30px;
				height: 30px;
				text-align: center;
			}
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
