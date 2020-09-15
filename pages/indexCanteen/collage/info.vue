<template>
	<div class="collage-info">
		<div v-if="JSON.stringify(groupInfo)!=='{}'">
			<div class="collage-info_heard">
				<div class="collage-info_back"></div>
				<div class="collage-info_good">
					<div class="collage-info_goodImg">
						<image :src="groupInfo.ProdInfo.ProdImg" mode=""></image>
					</div>
					<div class="collage-info_goodCenter">
						<div class="collage-info_goodTitle">{{groupInfo.ProdInfo.ProdName}}</div>
						<div style="color:#fa3056;font-size: 9pt;position: absolute;bottom: 2px;">
							¥<span style="font-size: 11pt;margin-right:10px">{{groupInfo.ProdInfo.ActiveSalePrice}}</span>
							<span style="text-decoration:line-through;color:#666;">¥{{groupInfo.ProdInfo.SalePrice}}</span>
						</div>
					</div>
				</div>

				<div class="ruleTip" @click="ruleTipRight">
					<span class="ruleTip-right">
						拼团规则：邀请2人参团，人数不足自动退款
					</span>
					<uni-icons type="arrowright" size="18" style="margin-left:10px"></uni-icons>
				</div>
			</div>
			<div class="collage-info_body">
				<div style="display: flex;justify-content: center;align-items: center;padding: 10px;">
					<span class="collage-info_line"></span>
					<i class="collage-info_dot"></i>
					<span>拼团剩余时间</span>
					<i class="collage-info_dot"></i>
					<span class="collage-info_line"></span>
				</div>

				<uni-countdown :show-day="activeTimeMy.day>0" color="#fff" splitor-color="#fa3056" background-color="#fa3056"
				 border-color="#fa3056" :day="activeTimeMy.day" :hour="activeTimeMy.hours" :minute="activeTimeMy.minute" :second="activeTimeMy.second"
				 @timeup="timeupFun"></uni-countdown>

				<div class="collage-info_user">
					<div :class="[index===0?'collage-info_userMain':'collage-info_userOther','userMain']" v-for="(item,index) in groupInfo.GroupInfo"
					 :key="index" :style="{'z-index':groupInfo.GroupInfo.length-index}">
						<image :src="item.HeardImg"></image>
						<i class="groupInfoName" v-if="index===0">团长</i>
					</div>
				</div>
			</div>

			<div v-if="groupInfo.ActiveStatus==='2'" style="text-align: center;">仅剩{{Number(groupInfo.OpenGroupBuyMinCount) - Number(groupInfo.GroupCount)}}人，快来加入我的团吧！</div>

			<div v-if="groupInfo.ActiveStatus!=='2'" style="text-align: center;">{{ActiveStatus(groupInfo.ActiveStatus)}}</div>

			<view style="margin: 30px 20px" v-if="groupInfo.ActiveStatus==='2'">
				<button size="large" :disabled="activeTimeEnd" @click="offHand">立即参团</button>
			</view>

			<stepperCard ref="stepperCard" :itemData="goodInfo" class="stepperStyle-card" @mycurrentPage="mycurrentPage"
			 :isCollageInfo="true">
			</stepperCard>
		</div>
	</div>
</template>

<script>
	import APIList from '@/api/http.js'
	import uniCountdown from '@/components_uni/uni-countdown/uni-countdown.vue'
	import uniIcons from '../../../components_uni/uni-icons/uni-icons.vue'
	import stepperCard from '@/components/stepperCard/index.vue'
	const app = getApp()
	export default {
		components: {
			uniIcons,
			uniCountdown,
			stepperCard
		},
		data() {
			return {
				activeTimeMy: {
					hours: '0',
					minute: '0',
					second: '0',
					day: ''
				},
				ActiveID: '',
				GroupNo: '',
				groupInfo: {},
				activeTimeEnd: false,
				goodInfo: {},
				// 是否是我的团
				myCollage: false
			}
		},
		onLoad(option) {
			// SD00007
			this.ActiveID = option.ActiveID || ''
			this.myCollage = option.myCollage || false
			// 200623101846974
			this.GroupNo = option.GroupNo || ''
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getInfo()
				})
			} else {
				this.getInfo()
			}
		},
		methods: {
			getInfo() {
				this.$showLoads(0, '')
				APIList.api('Active/GroupBuy/GroupDetail.aspx', {
					ActiveID: this.ActiveID,
					GroupNo: this.GroupNo
				}).then(D => {
					this.groupInfo = D

					this.goodInfo = this.groupInfo.ProdInfo

					this.goodInfo.num = 1
					this.goodInfo.ActiveID = this.ActiveID
					this.goodInfo.StockQty = this.goodInfo.ActiveStock //把活动库存改个字段
					this.goodInfo.EveryOneMaxBuyCount = this.groupInfo.EveryOneMaxBuyCount
					this.goodInfo.SalePrice = this.goodInfo.ActiveSalePrice //把活动价格改个字段

					if (this.groupInfo.EndTime) {
						this.getTimeout()
					}
					this.$showLoads(1, '')

					uni.showShareMenu({
						withShareTicket: true,
						title: this.goodInfo.ActiveName,
						path: '/pages/indexCanteen/collage/info?ActiveID=' + this.ActiveID + '&GroupNo=' + this.GroupNo
					})
				}).catch(e => {
					this.$showLoads(1, '')
				})
			},
			ruleTipRight() {
				uni.navigateTo({
					url: '/pages/indexCanteen/collage/explain'
				})
			},
			getTimeout() {
				let currentT = new Date().getTime()
				let End = new Date(this.groupInfo.EndTime.replace(/-/g, '/')).getTime()
				// let Start = new Date('2020-05-08 16:47:40').getTime()
				// let End = new Date('2020-05-08 16:55:50').getTime()
				let myTime = End - currentT
				if (this.groupInfo.ActiveStatus === '6') {
					this.activeTimeMy = {}
					return
				}
				this.activeTimeMy = {
					day: parseInt(myTime / (1000 * 60 * 60 * 24)),
					hours: parseInt((myTime % (1000 * 60 * 60 * 24)) / (60 * 60 * 1000)),
					minute: parseInt((myTime % (1000 * 60 * 60)) / (60 * 1000)),
					second: parseInt((myTime % (1000 * 60)) / 1000)
				}
				this.activeTimeEnd = myTime <= 0 ? true : false
			},
			offHand() {
				this.$refs.stepperCard.clickTag()
			},
			mycurrentPage(arr, bool, userObj) {
				// console.log(arr, bool, userObj, 88888)
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
						GroupNo: this.GroupNo,
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
			},
			ActiveStatus(val) {
				switch (val) {
					case '0':
						return '活动未开始'
					case '1':
						return '购买数量达到上限'
					case '3':
						return '有订单未付款'
					case '4':
						return '活动已结束'
					case '5':
						return '个人拼团有效期已结束'
					case '6':
						return '当前团已成,不能再参与该团'
					case '7':
						return '不能重复参与自己的团'
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.collage-info {
		.ruleTip {
			padding: 10px 0;
			text-align: center;
			color: #9a9a9a;
		}

		/deep/.uni-popup {
			z-index: 9999;
		}

		button {
			background-image: linear-gradient(to right, #ff5643, #fa3056);
			color: #fff;
			border-radius: 26px;
			box-shadow: 0px 2px 4px 2px #eee;
		}

		.ruleTip-right {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 80%;
		}

		&_heard {
			background-color: #fff;
			border-bottom: 10px solid #f9f9f9;
		}

		&_back {
			height: 260rpx;
			background-image: linear-gradient(#ff5643, #fa3056);
			border-radius: 0 0 70px 70px;

		}

		&_good {
			height: 260rpx;
			background-color: #FFFFFF;
			width: 85%;
			border-radius: 10px;
			margin-top: -100px;
			margin-left: 50%;
			transform: translateX(-50%);
			box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
			box-sizing: border-box;
			padding: 20rpx;
			display: flex;
		}

		&_goodImg {
			width: 220rpx;
			height: 220rpx;
			margin-right: 30rpx;
			border: 1rpx solid #eee;

			image {
				width: 100%;
				height: 100%;
			}
		}

		&_goodCenter {
			flex: 1;
			position: relative;
		}

		&_goodTitle {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.collage-info_body {
			text-align: center;
			color: #fa3056;

			/deep/.uni-countdown {
				justify-content: center;
			}

			.collage-info_dot {
				width: 16rpx;
				height: 16rpx;
				border-radius: 50%;
				background-color: #fa3056;
				margin: 0 20rpx;
			}

			.collage-info_line {
				width: 100rpx;
				height: 5rpx;
				background-color: #fa3056;
			}

			.collage-info_user {
				display: flex;
				align-content: center;
				justify-content: center;
				margin: 15px 0;

				.userMain {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					// overflow: hidden;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.collage-info_userMain {
					border: 4rpx solid #fa3056;
					position: relative;

					.groupInfoName {
						position: absolute;
						bottom: -5px;
						color: #fff;
						background-color: #fa3056;
						border-radius: 20px;
						font-size: 8pt;
						// padding: 2px 5px;
						width: 38px;
						left: 50%;
						transform: translateX(-50%);
					}
				}

				.collage-info_userOther {
					// fa3056
					border: 2rpx dashed #fa3056;
					margin-left: -35rpx;
				}
			}

		}
	}
</style>
