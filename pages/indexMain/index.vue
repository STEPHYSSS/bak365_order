<template>
	<div>
		<view class="index-main-style">
			<swiper class="swiperStyle" :indicator-dots="true" indicator-active-color="#ffa006" :autoplay="true" :interval="interval"
			 :circular="true">
				<swiper-item v-for="(item,index) in CarouselImgInfo" :key="index">
					<view class="swiperBox">
						<!-- <image src="" class="swiperImg" @load="swiperImageLoad($event,index)" v-bind:style="{ width: imageSize[index].width, height: imageSize[index].height}" /> -->
						<image :src="item.ImgUrl" class="swiperImg" @load="swiperImageLoad($event,index)" />
					</view>
				</swiper-item>
			</swiper>

			<view class="judge-time-style">{{judgeTimeT}}</view>
			<view v-if="currentStore.ShopName" @click="clickNearbyStore">
				<text class="icon" :style="{color:colorItem}">&#xe64f;</text>
				<text class="location-store">附近门店： {{currentStore.ShopName}} <text v-if="shopStoreSpace">约{{currentStore.shopStoreSpace}}</text>
				</text>
			</view>
			<!-- v-if="loading" 打包的时候记得加入到 :class="'btnMy'+colorIndex" 后面作为条件判断-->
			<view style="padding:10px 10px;margin-top:20px;" :class="'btnMy'+colorIndex">
				<button size="large" @click="startOrder">
					<view class="view-btn-style">
						<image class="btn-style-img" src="../../static/images/icon/yongcan.png"></image>
						<view class="btn-style-font">
							<view class="btn-style-font-c">开始点单</view>
							<view class="btn-style-font-c">Order Now</view>
						</view>
					</view>
				</button>
			</view>
			<!-- v-if="loading" 同上 -->
			<view class="box-style-view" >
				<view v-if="isShowCode==='1'" class="box-style-view-chil" @click="clickMyCode">
					<text class="icon vip-card-style" :style="{color:colorItem}">&#xe62b;</text>
					<view class="vip-card-font">会员码</view>
				</view>
				<view class="box-style-view-chil" @click="clickMyCoupon">
					<text class="icon vip-card-style" :style="{color:colorItem}">&#xe602;</text>
					<view class="vip-card-font">我的优惠券</view>
				</view>
				<view class="box-style-view-chil" @click="clickMyOrder">
					<text class="icon vip-card-style" :style="{color:colorItem}">&#xe601;</text>
					<view class="vip-card-font">我的订单</view>
				</view>
				<view class="box-style-view-chil" @click="clickMyVip">
					<text class="icon vip-card-style" :style="{color:colorItem}">&#xe605;</text>
					<view class="vip-card-font">会员中心</view>
				</view>

				<!-- <view class="box-style-view-chil" @click="clickMyActive">
					<text class="icon vip-card-style" :style="{color:colorItem}">&#xe605;</text>
					<view class="vip-card-font">活动商品</view>
				</view> -->
			</view>


			<change-store :currentStore="currentStore" :clickShow="clickShow" :modeChangeNum="modeChange" @onClose="onClose"
			 @changeMode="changeMode"></change-store>

			<!-- 券 -->
			<uni-popup :show="showDiscount" class="custom-class-discount" :maskClick="false">
				<view class="discount-father-style">
					<view class="discount-hyaline-style"></view>
					<view style="padding-bottom:10px; background: #e61e1e;border-radius: 10px;">

						<view :class="['discount-content-style',couponList.length<3?'discount-content-height-style':'']">
							<view class="discount-box-style" v-for="(item,index) in couponList" :key="index">
								<view class="discount-box-left">
									<view style="color:#e61e1e;" v-if="item.Type==1">¥
										<text style="font-size:20px;">{{item.PreValue}}</text>
									</view>
									<view style="color:#e61e1e;" v-if="item.Type==2">
										<text style="font-size:20px;">{{item.Discount/10}}折</text>
									</view>

									<view class="discount-info">{{item.MinUseAmt>0?'满'+item.MinUseAmt+'元可用':'全场通用'}}</view>
								</view>
								<view class="discount-box-right">
									<view class="discount-box-right-title" style="">{{item.KindName}}</view>
									<view class="discount-box-right-time">{{item.StartDate}}至{{item.ValidDate}}</view>
								</view>
							</view>
						</view>
					</view>
					<image :src="SendProgInfo.TitleImg?SendProgInfo.TitleImg:'/static/images/coupon/top.png'" class="discount-img-style"></image>
				</view>
				<view class="close-style">
					<text @click="closeDiscount">领取</text>
				</view>
			</uni-popup>


			<!-- 	<uni-popup :show="showStoreChange" :maskClick="false" ref="storeChangePopup">
				<div style="text-align: center;" :class="['storeChangeStyle','theme'+colorIndex]">
					<div class="storeChangeStyleC">选择门店：{{currentStore.ShopName}}-{{currentStore.ShopAddress}}</div>
					<button class="cu-btn" @click="centerStoreChange">取消</button>
					<button class="cu-btn bg-cu-btn" style="margin-left:10px" @click="storeChangeFun">确定</button>
				</div>
			</uni-popup> -->
			<button v-if="modeChange.WXSmallProgramKf==='1'&&isweixin&&!clickShow" open-type="contact" @contact="handleContact"
			 :show-message-card="true" send-message-img send-message-path="/pages/indexMain/index" send-message-title="自助点餐">
				<span class="icon customer-service-style" :style="{'color': colorItem,
			'border': '1px solid'+ colorItem}">&#xe60a;</span>
			</button>
		</view>
	</div>
</template>

<script>
	import APIList from '@/api/http.js';
	import uniPopup from "@/components_uni/uni-popup/uni-popup.vue"
	import changeStore from '@/components/poppupChangeOrder/index.vue'
	import {
		judgeTime,
		setTime,
		setModeIf
	} from "@/utils/utils.js"
	const app = getApp()
	export default {
		components: {
			uniPopup,
			changeStore
		},
		data() {
			return {
				CarouselImgInfo: [],
				imageSize: [],
				// 是否是扫码进来的 false =>不是
				isShopNum: '',
				// 当前的门店
				shopNo: '',
				currentStore: {},
				// shopName: '',
				// shopStoreSpace: '',
				interval: 3000,
				circular: true,
				judgeTimeT: judgeTime(),
				isShowCode: false,
				colorIndex: app.globalData.colorIndex,
				colorItem: app.globalData.itemColor,
				provider: app.globalData.provider,
				location: {
					Latitude: 30.49984,
					Longitude: 114.34253
				},
				clickShow: false,
				radio: '1',
				current: 0,
				// 是否显示券弹框
				showDiscount: false,
				couponList: [],
				// 活动图片
				activeImg: '',
				// 券详情
				SendProgInfo: {},
				loading: false,
				//是否选择了推荐门店
				isChangeStore: false,
				modeChange: {},
				isweixin: '',
				ActiveID: ''
			}
		},
		methods: {
			clickText() {
				uni.navigateTo({
					url: "/pages/indexCanteen/goodInfo/index?ProdNo=113340"
				})
			},
			getArea() {
				APIList.api('ShopInfo.aspx', this.location).then(D => {
					this.currentStore = D.ShopInfo[0]
					if (!app.globalData.shopNo && this.location.Latitude) { //授权了定位才能弹框
						// this.$refs.storeChangePopup.open()
						let _this = this
						uni.showModal({
							title: '选择门店',
							content: _this.currentStore.ShopName + (_this.currentStore.ShopAddress ? '-' : '') + _this.currentStore.ShopAddress,
							success: function(res) {
								if (res.confirm) {
									_this.isChangeStore = true
									app.globalData.shopNo = _this.currentStore.ShopNo
								} else if (res.cancel) {}
							}
						});
					}
					this.getObj(D.ShopInfo[0].ShopNo)
				}).catch(e => {})
			},
			getObj(shopNo) {
				this.$showLoads(0)
				let source = this.provider === 'weixin' ? 1 : 2
				APIList.api('NewIndex.aspx', {
					ShopNo: shopNo ? shopNo : this.shopNo,
					Source: source
				}).then(D => {
					setTime(D.SendProgInfo.ProgDetail) //去除时分秒
					// console.log(D,'DDDDD')
					this.ActiveID = D.ActiveID

					this.CarouselImgInfo = D.CarouselImgInfo
					this.isShowCode = D.IsShowCardCode
					this.currentStore = D.ShopInfo
					this.couponList = D.SendProgInfo.ProgDetail || []
					this.SendProgInfo = D.SendProgInfo
					this.modeChange = {
						LogisticsDistribution: D.WX_LogisticsDistribution,
						OrderEatInStore: D.WX_OrderEatInStore,
						OrderEatPackAway: D.WX_OrderEatPackAway,
						WXSmallProgramKf: D.WX_SmallProgramKf
					}


					if (!app.globalData.isDraw && D.SendProgInfo.ProgDetail.length > 0) {
						this.showDiscount = true
					}
					this.$showLoads(1)
					this.loading = true
				}).catch(e => {})
			},
			//获取轮转图图片高度
			swiperImageLoad: function(e, index) {
				var $width = e.detail.width //获取图片真实宽度
				var $height = e.detail.height
			},
			startOrder() {
				let a = this.modeChange.LogisticsDistribution //配送
				// let b = this.modeChange.OrderEatInStore //堂食//打包的时候记得打开
				let c = this.modeChange.OrderEatPackAway //打包

				// let a = '1'
				let b = '1'
				// let c = '1'
				let setModeIfVal = setModeIf(a, b, c) //是否只有一种选择几餐方式  true--不止一种

				if (this.isShopNum || this.isChangeStore) {
					// 扫码进来的，需要选择是否打包  //或者是自己选了门店
					if (setModeIfVal.bool && !app.globalData.isPack) {
						this.clickShow = true
					} else {
						//选择默认的就餐方式
						if (setModeIfVal.currentMode) {
							//只有一种就餐模式情况
							app.globalData.isPack = setModeIfVal.currentMode
						}
						uni.switchTab({
							url: "/pages/indexCanteen/index"
						})
					}
				} else {
					if (app.globalData.shopNo) {
						if (!app.globalData.isPack && setModeIfVal.bool) {
							this.clickShow = true
							return
						}
						uni.switchTab({
							url: "/pages/indexCanteen/index"
						})
					} else {
						// 不是扫码进来的，需要选择门店
						uni.navigateTo({
							url: "../indexCanteen/changeStore/index"
						})
					}
				}
			},
			//弹框
			onClose(e) {
				if (!e) {
					this.clickShow = false
				}
			},
			onChangeStore(evt) {
				// console.log(evt, 'evt')
				for (let i = 0; i < this.items.length; i++) {
					if (1 === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			changeMode(e) {
				this.clickShow = false
				uni.switchTab({
					url: "/pages/indexCanteen/index"
				})
			},
			clickMyCode() {
				uni.navigateTo({
					url: "./vipQRCode/index"
				})
			},
			clickMyOrder() {
				// uni.navigateTo({
				// 	url:"/pages/indexOrder/orderInfo/index?OpenID=208831240036970321&id=WXS-191122-171578664&AppID=2019091067148132"
				// })
				uni.switchTab({
					url: "/pages/indexOrder/oderList/index"
				})
			},
			clickMyVip() {
				uni.switchTab({
					url: "/pages/indexVip/index"
				})
			},
			clickMyCoupon() {
				uni.navigateTo({
					url: "../indexVip/couponList/index"
				})
			},
			clickMyActive() {
				uni.navigateTo({
					url: "/pages/indexCanteen/flashSale/index?ActiveID=" + this.ActiveID
				})
			},
			closeDiscount() {
				this.showDiscount = false
				app.globalData.isDraw = true
			},
			centerStoreChange() {
				// this.$refs.storeChangePopup.close()
			},
			storeChangeFun() {
				// this.isChangeStore = true
				// app.globalData.shopNo = this.currentStore.ShopNo
				// this.$refs.storeChangePopup.close()
			},
			clickNearbyStore() {
				// 附近门店
				uni.navigateTo({
					url: "../indexCanteen/changeStore/index?isNearby=true"
				})
			},
			handleContact() {}
		},
		onShareAppMessage: function() {
			var that = this
			return {
				title: '台位点单',
				path: '/pages/indexCanteen/index'
			}
		},
		onLoad: function(options) {
			this.ActiveID = options.options
			// 只执行一遍
			// console.log(options.q)
			// var httpUrl = options.q ? decodeURIComponent(options.q) : ''
			var httpUrl = 'https://we.bak365.net/SmallProgramSaleOrder/Mobile/SmallProgramIndexLink.aspx?ShopNo=0600&TableNumber=2'
			var objParam = {}
			if (httpUrl) {
				//截取
				var strParam = httpUrl.slice(httpUrl.indexOf("?"))
				strParam = strParam.substr(1)
				var arrParam = strParam.split("&");
				arrParam.forEach(D => {
					var a = D.split("=")[0]
					objParam[a] = D.split("=")[1]
				})
			} else {
				// console.log(app.globalData.isScanEnter,'8888')
				objParam = {}
			}


			var _this = this
			// objParam.ShopNo = '7701'
			if (objParam.ShopNo) {
				this.isShopNum = true
				app.globalData.shopNo = objParam.ShopNo
			}

			this.shopNo = objParam.ShopNo || ""
			if (objParam.TableNumber) {
				app.globalData.tableNumber = objParam.TableNumber || ''
			}
			if (app.globalData.shopNo) {
				this.shopNo = app.globalData.shopNo
			}

			if (options.currentShop) {
				//附近门店返回过来的
				// this.currentStore = JSON.parse(options.currentShop)//暂时注释
				// this.shopNo = this.currentStore.ShopNo //暂时注释
				// uni.setStorageSync('shopLocation', {
				// 	latitude: this.currentStore.Latitude || '',
				// 	longitude: this.currentStore.Longitude || ''
				// })
				// 打包的时候注释掉
				uni.setStorageSync('shopLocation', {
					latitude: this.currentStore.Latitude || '',
					longitude: this.currentStore.Longitude || ''
				})
				// uni.setStorageSync('shopLocationName', this.currentStore.ShopName)
			}
			// uni.removeStorageSync('shopLocation'); //清除之前选中门店信息
			// uni.getLocation({
			// 	type: 'wgs84',
			// 	success(res) {
			// 		const latitude = res.latitude
			// 		const longitude = res.longitude
			// 		uni.setStorageSync('location', {
			// 			latitude: res.latitude,
			// 			longitude: res.longitude
			// 		})
			// 		_this.location = {
			// 			Latitude: res.latitude,
			// 			Longitude: res.longitude
			// 		}

			// 	},
			// 	fail() {
			// 		// app.ShowTip("未授权位")
			// 		// wx.setStorageSync('location', {
			// 		// 	latitude: '',
			// 		// 	longitude: ''
			// 		// })
			// 	},
			// 	complete() {
			// 		if (!app.globalData.openID) {
			// 			_this.$store.dispatch('Login').then(D => {
			// 				getDataOwn(app, _this)

			// 				_this.isweixin = app.globalData.provider === 'weixin' ? true : false
			// 			})
			// 		} else {
			// 			getDataOwn(app, _this)

			// 			_this.isweixin = app.globalData.provider === 'weixin' ? true : false
			// 		}
			// 	}
			// })//打包的时候打开

		},
		onShow() {
			// 再一次点击进来
			if (!app.globalData.isDraw && this.couponList.length > 0) {
				this.showDiscount = true
			}
		},
		watch: {
			'currentStore'(obj) {
				if (obj && JSON.stringify(obj) !== '{}') {
					uni.setStorageSync('shopLocation', {
						latitude: this.currentStore.Latitude || '',
						longitude: this.currentStore.Longitude || ''
					})
					uni.setStorageSync('shopLocationName', this.currentStore.ShopName)
				}
			}
		}
	}

	function getDataOwn(app, _this) {
		if (!_this.shopNo) {
			// 如果没有扫码得到门店，就获取距离 附近的门店 获取门店再获取 数据
			_this.getArea()
			_this.isShopNum = false
		} else {
			_this.isShopNum = true
			// 有门店直接获取 数据
			_this.getObj()
		}
	}
</script>

<style scoped lang="scss">
	.uni-popup__wrapper {
		width: 85% !important;

	}

	image {
		width: auto;
		height: auto;
	}

	.index-main-style {
		padding: 10px;
		font-size: 12px;
		position: relative;

		.uni-popup__wrapper {
			width: 85% !important;

		}
	}

	.swiperStyle {
		height: 200px !important;
		border-radius: 5px;
		overflow: hidden;
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

	.judge-time-style {
		font-size: 16px;
		line-height: 30px;
	}

	.location-icon {
		vertical-align: middle;
	}

	.location-store {
		color: #777;
		font-size: 12px;
		margin-left: 4px;
	}

	.view-btn-style {
		font-weight: 700;
		font-size: 9pt;
	}

	.btn-style-img {
		margin-bottom: 3px;
		margin-right: 5px;
		width: 18px;
		height: 18px;
	}

	.btn-style-font {
		margin-top: 9px;
		display: inline-block;
	}

	.btn-style-font-c {
		margin-top: 0px;
		line-height: 12px;
	}

	.box-style-view {
		display: flex;
		margin-top: 18px;
		padding: 0 10px;
	}

	.box-style-view-chil {
		flex-grow: 1;
		text-align: center;
	}

	.vip-card-style {
		font-size: 25px;
		padding: 0;
	}

	.vip-card-font {
		margin-top: 5px;
		color: rgb(100, 95, 95);
		font-size: 8pt;
	}

	/* sdsdf */


	.btn-main-style {
		text-align: right;
		border-top: 1px solid #eee;
	}

	.custom-class-discount {
		background: transparent !important;
		padding-top: 0;
		/* top: 30% !important; */
	}

	.close-style {
		font-size: 9pt;
		color: #fff;
		text-align: center;
		margin-top: 18px;

		text {
			display: inline-block;
			border: 1px solid #FFFFFF;
			border-radius: 14px;
			width: 60px;
			height: 26px;
			line-height: 24px;
		}
	}

	.discount-hyaline-style {
		/* max-width:300px; */
		height: 60px;
	}

	.discount-content-style {
		height: 65vh;
		max-height: 360px;
		overflow-y: scroll;
		border-radius: 10px;
		padding: 70px 10px 0;
		box-sizing: border-box;
	}

	.discount-content-height-style {
		height: auto;
	}

	.discount-father-style {
		position: relative;
		/* width: 85vw; */
		max-width: 360px;
	}

	.discount-box-style {
		width: 100%;
		height: 29%;
		background: #fff;
		border-radius: 3px;
		margin-top: 12px;
		display: flex;
	}

	.discount-box-left {
		text-align: center;
		flex-grow: 1;
		border-right: 2px dotted rgb(165, 164, 164);
		position: relative;
		padding: 3% 5px 5px;
		min-width: 80px;
		/* max-width: 30%; */
		/* overflow: hidden; */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	.discount-info {
		height: 35px;
		color: #555;
		overflow: hidden;
		margin-top: 6px;
	}

	.discount-box-left::after,
	.discount-box-left::before {
		content: '';
		width: 8px;
		height: 8px;
		background: #e61e1e;
		border-radius: 50%;
		position: absolute;
		right: -5px;
	}

	.discount-box-left::after {
		top: -4px;
	}

	.discount-box-left::before {
		bottom: -4px;
	}

	.discount-box-right {
		flex-grow: 2;
		padding: 3% 14px 5px;
	}

	.discount-img-style {
		position: absolute;
		top: 0;
		width: 100%;
		height: 130px;
		font-size: 16px;
		font-weight: 700;
	}

	.discount-box-right-title {
		max-height: 42px;
		overflow: hidden;
		font-size: 16px;
		font-weight: 700;
	}

	.discount-box-right-time {
		margin-top: 10px;
		color: #555;
	}

	.storeChangeStyle {
		background: #fff;
		padding: 20px
	}

	.storeChangeStyleC {
		line-height: 50px;
		font-size: 14px;
	}

	@media screen and (max-width: 320px) {
		/* 当屏幕小于320px的时候 */

		.discount-hyaline-style {
			height: 50px;
		}

		.discount-img-style {
			height: 120px;
		}

		.discount-info {
			font-size: 20rpx;
			height: 30px;
		}

		.discount-box-right-title {
			max-height: 40px;
			overflow: hidden;
			font-size: 14px;
			font-weight: 700;
		}

		.discount-box-right-time {
			font-size: 20rpx;
		}
	}
</style>
