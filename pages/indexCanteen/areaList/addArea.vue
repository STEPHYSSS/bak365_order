<template>
	<view class="addArea-style">
		<view class="my-cell-item">
			<view :class="{'my-cell-item-label':true}">
				联系人
			</view>
			<view class="my-cell-item-val">
				<input v-model="form.Name" type="text" placeholder="用于取餐时对你的称呼" placeholder-style="color:	#C8C8C8">
			</view>
		</view>
		<view class="my-cell-item">
			<view class="my-cell-item-label">
				手机号
			</view>
			<view class="my-cell-item-val">
				<input v-model="form.Mobile" type="number" placeholder="请输入手机号" placeholder-style="color:	#C8C8C8">
			</view>
		</view>
		<view class="my-cell-item areaInput" @click="clickSearchArea">
			<view class="my-cell-item-label">
				地址
			</view>
			<view style="display: flex;width:100%">
				<view class="my-cell-item-val addressInput">
					<input v-model="form.Address" type="text" placeholder="选择收货地址" placeholder-style="color:	#C8C8C8">
					<view class="AddressModel"></view>
				</view>
				<text class="icon iconRight">&#xe670;</text>
			</view>
		</view>
		<view class="my-cell-item">
			<view class="my-cell-item-label">
				门牌号
			</view>
			<view class="my-cell-item-val">
				<input v-model="form.HouseNumber" type="text" placeholder="如:10号楼210室" placeholder-style="color:	#C8C8C8">
			</view>
		</view>
		<view class="radioStyle">
			<view style="flex:1">
				<checkbox-group @change="checkboxChange">
					<checkbox :value="1" :checked="form.IsDefault==1" />设置默认地址
				</checkbox-group>
			</view>
			<view v-if="!OptType&&form.Name" @click="delFun"><text class="icon">&#xe610;</text>删除</view>
		</view>

		<view style="margin: 70px 20px" :class="'btnMy'+colorIndex">
			<button size="large" @click="addAreaFun" :disabled="disabledBtn">保存</button>
		</view>

		<uni-popup :show="showDel">
			<view :class="['showInfo-style','theme'+colorIndex]">
				<view>地址删除后无法恢复</view>
				<view style="margin-bottom:20px">是否删除地址？</view>
				<button class="cu-btn" @click="showDel = false">取消</button>
				<button class="cu-btn bg-cu-btn" style="margin-left:10px" @click="delAreaFun">删除</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const app = getApp()
	import APIList from '@/api/http.js';
	import cmdCellItem from '@/components_uni/cmd-cell-item/cmd-cell-item.vue'
	import uniPopup from "@/components_uni/uni-popup/uni-popup.vue"
	import {
		checkMobile
	} from "@/utils/utils.js";
	export default {
		components: {
			cmdCellItem,
			uniPopup
		},
		data() {
			return {
				form: {},
				colorIndex: app.globalData.colorIndex,
				disabledBtn: false,
				currentQQMap: {},
				showDel: false,
				OptType: null,
				// 是新增地址
				isEdit: false
			}
		},
		methods: {
			addAreaFun() {
				Object.assign(this.form, {
					Type: 'SetAddressInfo',
					OptType: this.OptType
				})
				if (!this.form.Address) {
					uni.showToast({
						title: "选择地址",
						icon: 'none'
					});
					return;
				}
				if (!this.form.HouseNumber) {
					uni.showToast({
						title: "填写门牌号",
						icon: 'none'
					});
					return;
				}
				if (!this.form.Name) {
					uni.showToast({
						title: "填写联系人",
						icon: 'none'
					});
					return;
				}
				if (!this.form.Mobile) {
					uni.showToast({
						title: "填写手机号",
						icon: 'none'
					});
					return;
				} else {
					if (!checkMobile(this.form.Mobile)) {
						uni.showToast({
							title: "手机号格式错误",
							icon: 'none'
						});
						return;
					}
				}
				this.disabledBtn = true
				// console.log(this.form, 'this.form')
				APIList.api('Public/Submit_ajax.aspx', this.form).then(D => {
					this.disabledBtn = false
					uni.showToast({
						title: this.isEdit ? '地址修改成功' : "地址添加成功",
						icon: 'none'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/indexCanteen/areaList/areaList?editArea=true&OptType=' + this.OptType
						})
					}, 1000)
					uni.removeStorageSync('currentQQMap')
				}).catch(e => {
					this.disabledBtn = false
				})
			},
			checkboxChange(val) {
				this.form.IsDefault = val.detail.value[0] || ''
			},
			clickSearchArea() {
				uni.navigateTo({
					url: '/pages/indexCanteen/areaList/qqmapSearch?OptType=' + this.OptType
				})
			},
			delFun() {
				this.showDel = true
			},
			delAreaFun() {
				APIList.api('Public/Submit_ajax.aspx?Type=DelAddressInfo', {
					AddressNo: this.form.AddressNo
				}).then(D => {
					this.disabledBtn = false
					uni.showToast({
						title: "删除成功",
						icon: 'none'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/indexCanteen/areaList/areaList'
						})
					}, 1000)
				}).catch(e => {
					this.disabledBtn = false
				})
			}
		},
		onLoad(options) {
			if (options.item) {
				this.form = options.item ? JSON.parse(options.item) : {}
				this.isEdit = true
			} else {
				this.isEdit = false
			}
			this.OptType = options.OptType || ''

			uni.removeStorageSync('currentQQMap')
			if (!app.globalData.openID) {
				this.$showLoads(0, '') //加载
				this.$store.dispatch('Login')
				this.$showLoads(1, '')
			}
		},
		onShow() {
			if (uni.getStorageSync('currentQQMap')) {
				this.currentQQMap = uni.getStorageSync('currentQQMap')
				this.form.Latitude = this.currentQQMap.latitude
				this.form.Longitude = this.currentQQMap.longitude
				if(this.currentQQMap.addr === undefined){
					uni.showToast({
						title: '请选择具体地址',
						icon:'none',
					});
				}else{
					this.form.Address = this.currentQQMap.addr + '(' + this.currentQQMap.title + ')'
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addArea-style {
		background: #fff;
		min-height: 100vh;
	}

	.areaInput {
		position: relative;
	}
	.my-cell-item-val{
		width:100%;
	}
	.my-cell-item {
		display: flex;
		padding: 10px;
		font-size: 10pt;
		align-items: center;
		border-bottom: 1px solid #eee;

		.my-cell-item-label {
			width: 60px;
		}

		.topBorder {
			border-bottom: 1px solid #eee;
		}

		.iconRight {
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
		}

		.addressInput {
			position: relative;
			margin-right:25px;
			width: 100%;
			input{
				width: 100%;
			}
		}

		.AddressModel {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 5;
		}
	}

	.showInfo-style {
		background: #fff;
		text-align: center;
		padding: 20px;
	}

	.radioStyle {
		display: flex;
		align-items: center;
		margin: 8px;
		font-size: 10pt;
	}
</style>
