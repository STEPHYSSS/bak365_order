<template>
	<view class="areaListStyle">
		<view class="areaListTop">
			<view class="areaListBox" v-for="(item,index) in areaList" :key="index" @click="clickAreaFun(item)">
				<view style="flex:1">
					<view class="areaListBox_title">{{item.Address}}</view>
					<uni-tag style="margin-right:8px" size="small" text="默认地址" v-if="item.IsDefault === '1'"></uni-tag><text class="areaListBox_phone">{{item.Mobile}}&nbsp;{{item.Name}}</text>
				</view>
				<text class="icon areaListBoxEdit" @click.stop="EditArea(item)">&#xe639;</text>
				<view class="disabledBox" v-if="OptType=='1'&&item.IsAvailable==='0'"></view>
			</view>
		</view>
		<view @click="addArea" class="addStyle" :style="{'color':itemColor}">
			+ 新增地址
		</view>
	</view>  
</template>

<script>
	let app = getApp()
	import APIList from '@/api/http.js';
	import uniTag from '@/components_uni/uni-tag/uni-tag.vue'
	export default {
		components: {
			uniTag
		},
		data() {
			return {
				itemColor: app.globalData.itemColor,
				areaList: [],
				OptType: null,
				// 是否是新增地址进来
				editArea: false
			}
		},
		created() {},
		methods: {
			getList() {
				APIList.api('AddressList.aspx', {
					OptType: this.OptType ? '1' : ''
				}).then(D => {
					this.$showLoads(1, '')
					this.areaList = D.AddressInfo

					if (this.OptType) { //订单页面点击进来的
						let disableArr = this.areaList.filter(D => D.IsAvailable === '0')
						let sureArr = this.areaList.filter(D => D.IsAvailable === '1')

						this.areaList = sureArr.concat(disableArr)

						// console.log(this.areaList, 2222)
					}
				}).catch(e => {
					this.$showLoads(1, '')
				})
			},
			addArea() {
				uni.navigateTo({
					url: '/pages/indexCanteen/areaList/addArea?OptType=' + this.OptType
				})
			},
			EditArea(item) {
				let itemObj = JSON.stringify(item)
				uni.navigateTo({
					url: '/pages/indexCanteen/areaList/addArea?OptType=' + this.OptType + '&item=' + itemObj
				})
			},
			clickAreaFun(item) {
				if (!this.OptType) {
					return
				}
				if (this.OptType && item.IsAvailable === '0') {
					// console.log(item, 888)
					uni.showToast({
						title: "不在配送范围内",
						icon: 'none'
					});
				} else {
					uni.setStorageSync('currentAreaMy', item)
					
					if(this.editArea){
						uni.navigateBack({
							 delta: 2
						});
					}else{
						uni.navigateBack();
					}
				}
			}
		},
		onLoad(options) {
			// console.log(options)
			this.OptType = options.OptType || ''
			this.editArea = options.editArea || false
		},
		onShow() {
			if (!app.globalData.openID) {
				this.$showLoads(0, '') //加载
				this.$store.dispatch('Login').then(D => {
					this.getList()
				})
			} else {
				this.$showLoads(0, '') //加载
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.areaListStyle {
		background: #fff;

		.areaListTop {
			margin-bottom: 40px;
		}

		.areaListBox {
			padding: 5px 12px;
			border-bottom: 1px solid #eee;
			display: flex;
			align-items: center;
			position: relative;

			.disabledBox {
				position: absolute;
				background: rgba($color: #fff, $alpha: 0.5);
				width: 100%;
				height: 100%;
			}

			.areaListBox_title {
				font-weight: 700;
				// line-height: 35px;
				padding:10px 0;
			}

			.areaListBox_phone {
				font-size: 10pt;
			}

			.areaListBoxEdit {
				width: 31px;
				color: #777;
				display: inline-block;
				text-align: center;
				height: 40px;
				line-height: 40px;
			}
		}

		.addStyle {
			height: 40px;
			line-height: 40px;
			position: fixed;
			bottom: 0;
			background: #fff;
			width: 100%;
			text-align: center;
			border-top: 1px solid #f8f8f8;
		}
	}
</style>
