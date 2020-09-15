<template>
	<view class="store-area-style">
		<!-- 选择门店页面 -->
		<view class="searchPageInput">
			<input class="searchInput" placeholder="请输入关键字搜索" :value="searchValue" @input="bindKeyInput" confirm-type="search"></input>
			<text class="icon title" @click="clickSearch">&#xe600;</text>
		</view>
		<view class="store-area-list">
			<text class="store-area-nearby" v-if="location.latitude">附近</text>
			<text class="store-area-nearby" v-else>授权位置，更好的找到当前门店哦</text>
			<view :class="['store-area-info',index!==dataList.length-1?'store-area-border':'']" v-for="(item,index) in dataList"
			 :key="index" @click="clickStore(item)">
				<view class="store-area-space" v-if="location.latitude">{{item.Distance}}</view>
				<view class="store-area-name">{{item.ShopName}}</view>
				<view class="store-area-area">{{item.ShopAddress}}</view>
			</view>

			<node-data v-if="dataList.length===0"></node-data>
		</view>

		<change-store :currentStore="currentItem" :clickShow="clickShow" @onClose="onClose" @changeMode="changeMode"
		 :modeChangeNum="modeChange"></change-store>
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	import nodeData from '@/components/nodeData/index.vue'
	import changeStore from '@/components/poppupChangeOrder/index.vue'
	import {
		setModeIf
	} from "@/utils/utils.js"
	const app = getApp()
	export default {
		props: {
			isFlashSale: [Boolean, String, Number],
			ActiveID: [String, Number]
		},
		components: {
			nodeData,
			changeStore
		},
		data() {
			return {
				searchValue: '',
				location: '',
				dataList: [],
				clickShow: false,
				radio: '1',
				currentItem: {},
				itemColor: app.globalData.itemColor,
				isCardPay: false,
				indexCan: false,
				isNearby: false,
				isHome: false,
				isGoodInfo: false,
				modeChange: {},
				modeChangeNum: {},
			}
		},
		methods: {
			getList() {
				this.$showLoads(0)
				var location = uni.getStorageSync('location')
				this.location = location
				APIList.api('ShopInfo.aspx', {
					SearchVal: this.searchValue,
					Longitude: location.longitude,
					Latitude: location.latitude,
					ActiveID: this.ActiveID || ''
				}).then(D => {
					this.dataList = D.ShopInfo

					this.modeChange = {
						LogisticsDistribution: D.WX_LogisticsDistribution,
						OrderEatInStore: D.WX_OrderEatInStore,
						OrderEatPackAway: D.WX_OrderEatPackAway,
					}

					if (this.isCardPay || this.isFlashSale) {
						setTimeout(() => {
							uni.showToast({
								title: '请选择门店',
								icon: 'none'
							});
						})
					}
					this.$showLoads(1)
				}).catch(e => {})
			},
			clickSearch() {
				if (this.searchValue) {
					this.getList()
				}
			},
			bindKeyInput(e) {
				this.searchValue = e.detail.value
				if (!e.detail.value) {
					this.getList()
				}
			},
			clickStore(e) {
				if (this.indexCan) {
					//从商品列表进来的
					app.globalData.shopNo = e.ShopNo
					uni.setStorageSync('cartList', [])
					uni.switchTab({
						url: "/pages/indexCanteen/index"
					})
				}
				if (this.isCardPay) {
					app.globalData.shopNo = e.ShopNo
					uni.redirectTo({
						url: "/pages/indexVip/cardCharge/index"
					})
					return
				}
				if (this.isNearby) {
					app.globalData.shopNo = e.ShopNo
					let newE = JSON.stringify(e)
					uni.setStorageSync('cartList', [])
					uni.redirectTo({
						url: "/pages/indexMain/index?currentShop=" + JSON.stringify(e)
					})
					return
				}

				if (this.isFlashSale && app.globalData.isPack) {
					//从活动进来的
					app.globalData.shopNo = e.ShopNo
					uni.setStorageSync('cartList', [])
					this.$emit('clickStore');
					return
				}

				let a = this.modeChange.LogisticsDistribution
				let b = this.modeChange.OrderEatInStore
				let c = this.modeChange.OrderEatPackAway
				let setModeIfVal = setModeIf(a, b, c)
				uni.setStorageSync('cartList', [])
				if (setModeIfVal.bool) {
					this.clickShow = true
					this.currentItem = e
				} else {
					//选择默认的就餐方式
					app.globalData.shopNo = e.ShopNo
					app.globalData.isPack = setModeIfVal.currentMode
					if (this.isFlashSale) {
						this.$emit('clickStore');
					} else {
						if (this.isHome) {
							uni.redirectTo({
								url: "/pages/indexHomePage/index"
							})
						} else if (this.isGoodInfo) {
							uni.redirectTo({
								url: "/pages/indexCanteen/goodInfo/index?ProdNo=" + this.isGoodInfo
							})
						} else {
							uni.switchTab({
								url: "/pages/indexCanteen/index"
							})
						}
					}
				}

			},
			//弹框
			onClose(e) {
				if (!e) {
					this.clickShow = false
				}
			},
			changeMode(e) {
				app.globalData.shopNo = this.currentItem.ShopNo
				this.clickShow = false
				if (this.isFlashSale) {
					this.$emit('clickStore');
				} else {
					if (this.isHome) {
						uni.redirectTo({
							url: "/pages/indexHomePage/index"
						})
					} else if (this.isGoodInfo) {
						uni.redirectTo({
							url: "/pages/indexCanteen/goodInfo/index?ProdNo=" + this.isGoodInfo
						})
					} else {
						uni.switchTab({
							url: "/pages/indexCanteen/index"
						})
					}
				}
			}
		},
		onLoad(option) {
			// console.log(option.isNearby)
			this.isNearby = option.isNearby || false
			this.isCardPay = option.isCardPay || false
			this.indexCan = option.indexCan || false
			this.isHome = option.homePage || false
			this.isGoodInfo = option.goodInfo || false
		},
		created() {
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getList()
				})
			} else {
				this.getList()
			}
		},
		onShow: function() {}
	}
</script>

<style scoped>
	.store-area-style {
		background: rgb(245, 245, 245);
		min-height: 100vh;
		padding-bottom: 10px;
		font-size: 10pt;
	}

	.searchPageInput {
		background: #fff;
		padding: 8px 0 8px 8px;
		position: relative;
		display: flex;
	}

	.searchInput {
		height: 38px;
		background: #f2f2f2;
		border-radius: 20px;
		padding: 0 20px;
		flex: 1;
	}

	.title {
		width: 50px;
		line-height: 40px;
		text-align: center;
		font-size: 20px;
	}

	.store-area-list {
		margin: 15px 15px 0;
		background: #fff;
		padding: 15px;
		border-radius: 10px;
		color: rgb(160, 160, 160);
	}

	.store-area-info {
		padding-bottom: 10px;
		padding-top: 10px;
	}

	.store-area-border {
		border-bottom: 1px solid rgb(245, 245, 245);
	}

	.store-area-nearby {
		display: inline-block;
		margin-bottom: 10px;
	}

	.store-area-name {
		color: #000;
		font-size: 14px;
		margin-bottom: 2px;
	}

	.store-area-area {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 12px;
	}

	.store-area-space {
		float: right;
		font-size: 12px;
		/* text-align: right; */
	}
</style>
