<template>
	<view>
		<view class="inputAreaTop">
			<input class="inputArea" @confirm="nearby_search" v-model="backfillVal" focus placeholder="请输入地址名称"
			 confirm-type="search"></input>
			<text class="icon inputAreaIcon" @click="nearby_search(backfillVal,true)">&#xe600;</text>
		</view>

		<view class="areaLine" v-for="(item,index) in suggestion" :key="index" @click="backfill(index)">
			<view style="font-size: 11pt;font-weight: 700;">{{item.title}}</view>
			<view style="font-size:9pt;color:#666;margin-top: 2px;">{{item.addr}}</view>
		</view>


		<!-- 	<button @click="nearby_search">搜索周边KFC</button>
		<map id="myMap" :markers="markers" style="width:100%;height:300px;" longitude="114.410642" latitude="30.477044" scale='16'>
		</map> -->
	</view>
</template>

<script>
	const app = getApp()
	var QQMapWX = require('@/utils/qqmap-wx-jssdk.min.js');
	import APIList from '@/api/http.js';
	// var qqmapsdk = new QQMapWX({
	// 	key: 'Q6OBZ-JYOED-PDJ4H-HUBOE-VYC3V-6GBLD'
	// });
	export default {
		data() {
			return {
				suggestion: [],
				backfillVal: '',
				region: '', //省
				timer: null,
				provider: app.globalData.provider,
				currentLocation: {},
				valueInput: ''
				// markers: []
			}
		},
		methods: {
			backfill: function(index) {
				var id = index;
				for (var i = 0; i < this.suggestion.length; i++) {
					if (i == id) {
						this.backfillVal = this.suggestion[i].title
						
						uni.setStorageSync('currentQQMap', this.suggestion[i])
						uni.navigateBack();
					}
				}
			},
			nearby_search: function(e, bool) {
				// clearTimeout(this.timer)
				// this.timer = setTimeout(function() {
				let value = bool ? e : e.detail.value
				if (!value) {
					value = '武汉'
				}
				var _this = this;
				// 调用接口
				try {
					if (this.provider === 'weixin') {
						this.qqmapsdk.search({
							keyword: value, //搜索关键词
							page_size: 20,
							region: _this.region,
							success: function(res) { //搜索成功后的回调
								var mks = []
								for (var i = 0; i < res.data.length; i++) {
									mks.push({ // 获取返回结果，放到mks数组中
										title: res.data[i].title,
										addr: res.data[i].address,
										latitude: res.data[i].location.lat,
										longitude: res.data[i].location.lng
									})
								}
								_this.suggestion = mks
							},
							fail: function(res) {
								// console.log(res.message, 'res')
								uni.showToast({
									title: res.message + 'fail',
									icon: 'none'
								});
							},
							complete: function(res) {
								// uni.showToast({
								// 	title: 'complete',
								// 	icon: 'none'
								// });
							}
						});
					} else {
						// console.log('支付宝')
						// console.log(value, 'value支付宝')
						APIList.api('MapSearch.aspx', {
							SearchValue: value,
							Latitude: this.currentLocation ? this.currentLocation.latitude : '',
							Longitude: this.currentLocation ? this.currentLocation.longitude : ''
						}).then(D => {
							var mks = []
							for (var i = 0; i < D.SearchInfo.length; i++) {
								mks.push({
									title: D.SearchInfo[i].Title,
									addr: D.SearchInfo[i].Address,
									latitude: D.SearchInfo[i].Lat,
									longitude: D.SearchInfo[i].Lng
								})
							}
							this.suggestion = mks
						}).catch(e => {
							console.log(e, 'ee')
							uni.showToast({
								title: e,
								icon: 'none'
							});
						})
					}
				} catch (e) {
					uni.showToast({
						title: e + 'catch',
						icon: 'none'
					});
				}
				// }, 500)
			},
			getsuggest: function(e, bool) {
				try {
					let value = bool ? e : e.detail.value
					if (!value) {
						value = '武汉'
					}
					var _this = this;
					//调用关键词提示接口
					this.qqmapsdk.getSuggestion({
						keyword: value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
						region: _this.region, //设置城市名，限制关键词所示的地域范围，非必填参数
						page_size: 20,
						success: function(res) { //搜索成功后的回调
							var sug = [];
							for (var i = 0; i < res.data.length; i++) {
								sug.push({
									title: res.data[i].title,
									id: res.data[i].id,
									addr: res.data[i].address,
									city: res.data[i].city,
									district: res.data[i].district,
									latitude: res.data[i].location.lat,
									longitude: res.data[i].location.lng
								});
							}
							_this.suggestion = sug //设置suggestion属性，将关键词搜索结果以列表形式展示
						},
						fail: function(error) {
							uni.showToast({
								title: error,
								icon: 'none'
							});
						},
						complete: function(res) {
							console.log(res);
						}
					});

				} catch (e) {
					uni.showToast({
						title: e,
						icon: 'none'
					});
				}
			}
		},
		onShow() {
			// this.markers = [{
			// 	iconPath: "../../../static/images/icon/weixinPay.png",
			// 	latitude: 30.477044,
			// 	longitude: 114.410642,
			// 	width: 32,
			// 	height: 32
			// }];
		},
		onLoad(options) {
			let location = uni.getStorageSync('location')
			let locationShop = uni.getStorageSync('shopLocation')
			let locationVal = ''

			if (this.provider === 'weixin') {
				this.qqmapsdk = new QQMapWX({
					key: 'Q6OBZ-JYOED-PDJ4H-HUBOE-VYC3V-6GBLD'
				});
				if (!location.latitude) {
					locationVal = locationShop.latitude + ',' + locationShop.longitude
				} else {
					locationVal = location.latitude + ',' + location.longitude
				}
				// console.log(locationVal,'locationVal')
				let _this = this
				this.qqmapsdk.reverseGeocoder({
					location: locationVal,
					success: function(res) {
						_this.region = res.result.address_component.city
						let address = res.result.address_component.street || res.result.address_component.province
						_this.nearby_search(address, true)
					},
					fail: function(error) {
						_this.nearby_search('', true)
					}
				})
			} else {

				if (!location.latitude) {
					this.currentLocation = locationShop
				} else {
					this.currentLocation = location
				}
				// console.log(locationVal, 'locationVal')
				let nameValue = uni.getStorageSync('shopLocationName') || ''

				if (!app.globalData.openID) {
					// this.$showLoads(0, '') //加载
					this.$store.dispatch('Login').then(D => {
						this.nearby_search(nameValue, true)
					})
				} else {
					// this.$showLoads(0, '') //加载
					this.nearby_search(nameValue, true)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inputAreaTop {
		overflow: hidden;
		background: #f8f8f8;
		width: 100%;
		font-size: 9pt;
		display: flex;

		.inputAreaIcon {
			font-size: 20px;
			margin: auto;
			text-align: center;
			padding: 10px 12px;
		}
	}

	.inputArea {
		margin: 10px 0 10px 10px;
		width: 100%;
	}

	.areaLine {
		padding: 10px;
		border-bottom: 1px solid #f8f8f8;
	}
</style>
