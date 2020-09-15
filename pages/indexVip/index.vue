<template>
	<view class="indexVip" v-if="dataList.Code">
		<view class="vipTop" :style="{'background': `url(${dataList.CardImg})`,'backgroundSize':'cover'}">

			<view class="idStyle" v-if="dataList.CardNo">ID: {{dataList.CardNo}}</view>
			<view class="idStyle" v-if="!dataList.CardNo">未绑定实体卡</view>
			<view class="vanRow">
				<view class="vanCol" @click="consumeClick(0)">
					<view v-if="dataList.WX_CardBind === '1'&&dataList.WX_CardApply==='1'">***</view>
					<view v-else>{{dataList.CardBalance|| 0}}</view>
					<view>余额</view>
				</view>
				<view class="vanCol" @click="consumeClick(1)">
					<view v-if="dataList.WX_CardBind === '1'&&dataList.WX_CardApply==='1'">***</view>
					<view v-else>{{dataList.CardScore|| 0}}</view>
					<view>积分</view>
				</view>
				<view class="vanCol" @click="clickCoupon">
					<view>{{dataList.CouponCount|| 0}}</view>
					<view>优惠券</view>
				</view>
			</view>
		</view>

		<view>
			<view class="vipBottom">
				<cmd-cell-item title="申请会员卡" slot-left @click="clickBind(1)" :border="false" v-if="dataList.WX_CardApply === '1'">
					<text class="icon vip-bottom-icon">&#xe6c9;</text>
				</cmd-cell-item>
				<cmd-cell-item title="绑定会员卡" slot-left @click="clickBind(2)" :border="false" v-if="dataList.WX_CardBind === '1'">
					<text class="icon vip-bottom-icon">&#xe62b;</text>
				</cmd-cell-item>
				<cmd-cell-item title="解绑会员卡" slot-left @click="clickUntbind" v-if="dataList.WX_CardBindDel=='1'" :border="false">
					<text class="icon vip-bottom-icon">&#xe6c9;</text>
				</cmd-cell-item>
				<cmd-cell-item title="卡支付码" slot-left @click="clickVipPay" v-if="dataList.CardNo" :border="false">
					<text class="icon vip-bottom-icon">&#xe62c;</text>
				</cmd-cell-item>
				<cmd-cell-item title="卡充值" slot-left @click="clickVipCharge" v-if="dataList.WX_CardIncome=='1'" :border="false">
					<text class="icon vip-bottom-icon">&#xe60e;</text>
				</cmd-cell-item>
				<cmd-cell-item title="地址管理" slot-left @click="clickVipArea" :border="false">
					<text class="icon vip-bottom-icon">&#xe64f;</text>
				</cmd-cell-item>
				<!-- v-if="dataList.WX_SmallProgramKf==='1'&&provider==='weixin'" -->
				<!-- 	<cmd-cell-item title="我们客服" slot-left :border="false">
					<text class="icon vip-bottom-icon">&#xe60a;</text>
				</cmd-cell-item> -->

				<btn-service :WXSmallProgramKf="dataList.WX_SmallProgramKf" :provider="provider" messageTitle="会员中心" messagePath="/pages/indexVip/index"></btn-service>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import APIList from '@/api/http.js'
	import cmdCellItem from '@/components_uni/cmd-cell-item/cmd-cell-item.vue'
	import btnService from '@/components/customerService/index.vue'
	// import bottomNav from '@/components/bottomNav/index.vue'
	export default {
		components: {
			cmdCellItem,
			btnService
		},
		data() {
			return {
				hasUserInfo: false,
				bindCard: false,
				infoData: {
					phone: ''
				},
				dataList: {},
				provider: ''
			}
		},
		methods: {
			handleContact() {},
			getInfo() {
				this.provider = app.globalData.provider
				this.$showLoads(0, '')
				APIList.api('Bonuse.aspx').then(D => {
					this.$showLoads(1, '')
					this.dataList = D
				}).catch(e => {
					this.$showLoads(1, '')
				})

				if (app.globalData.userPhone) {
					this.bindCard = true
				} else {
					this.bindCard = false
				}
			},
			clickBind(val) {
				// 1,申请卡;2绑定卡
				APIList.api('CardBind.aspx').then(D => {
					if (D.Code == 2) {
						// 已经绑定实体卡
						uni.showToast({
							title: '已绑定实体卡',
							icon: 'none'
						});
						// uni.setStorageSync('userPhone', D.Mobile)
					} else {
						var item = ''
						if (D.hasOwnProperty('WX_CardPayNotPass')) {
							item = D.WX_CardPayNotPass
						}
						uni.navigateTo({
							//1是不要密码
							url: '/pages/indexVip/cardBind/index?isPassword=' + item + '&isCardType=' + val
						})
					}
				}).catch(e => {})
			},
			clickUntbind() {
				uni.navigateTo({
					url: '../indexVip/cardUnt/index'
				})
			},
			clickSet() {
				uni.navigateTo({
					url: '../indexVip/setting/index'
				})
			},
			clickArea() {
				uni.navigateTo({
					url: '../couponList/index?radio=false'
				})
			},
			consumeClick(e) {
				if (this.dataList.WX_CardBind !== '1') {
					uni.navigateTo({
						url: 'consumeList/index?type=' + e
					})
				}

			},
			clickVipPay() {
				uni.navigateTo({
					url: '../indexMain/vipQRCode/index'
				})
			},
			clickVipCharge() {
				uni.navigateTo({
					url: './cardCharge/index'
				})
			},
			clickCoupon() {
				uni.navigateTo({
					url: './couponList/index'
				})
			},
			clickVipArea() {
				uni.navigateTo({
					url: '../indexCanteen/areaList/areaList'
				})
			}
		},
		onShow: function() {
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getInfo()
				})
			} else {
				this.getInfo()
			}
		}
	}

	function setPhone(val) {
		if (val) {
			return String(val).slice(0, 3) + '****' + String(val).slice(-4)
		} else {
			return ''
		}
	}
</script>

<style lang="scss">
	.indexVip {
		background: #eee;
		min-height: 100vh;
		font-size: 12px;
		// padding-bottom: 50px;

		.vipTop {
			background: #3062A5;
			height: 150px;
			width: 100%;
		}

		.vipInfoTop {
			display: flex;
			padding: 20px;
		}

		.vipInfoTopImg {
			width: 60px;
			height: 60px;
			border-radius: 50%;
		}

		.vipInfoTopImg image {
			width: 100%;
			height: 100%;
		}

		.vipInfoTopLeft {
			margin-left: 10px;
			color: #fff;
		}

		.vipInfoTopRight {
			line-height: 30px;
		}

		.arrowIcon {
			vertical-align: middle;
		}

		.vipInfoTopRT {
			font-size: 14px;
			color: #f0eeee;
		}

		.vanCol {
			color: #fff;
			text-align: center;
			font-size: 14px;
			flex: 1;
		}

		.idStyle {
			color: #fff;
			padding: 15px;
		}

		.vanRow {
			padding-bottom: 16px;
			transform: translateY(55px);
			display: flex;
		}

		.vipBottom {
			background: #fff;
			margin: 16px;
			border-radius: 10px;
			padding: 5px;

			.cmd-cell-item-left {
				margin: 0 10px;
				font-size: 13pt;
			}
		}

		.vipBottom .cmd-cell-item-body {
			margin: 5px 0 !important;
		}

		.bindCard {
			text-align: center;
		}

		.bindIcon {
			font-size: 20px;
		}

		.bindTitle {
			font-size: 14px;
		}

		.setBtn {
			width: 100px;
		}
	}
</style>
