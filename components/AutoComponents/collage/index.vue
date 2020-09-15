<template>
	<div class="collageList">
		<!-- 拼团列表 -->
		<div class="across-good" @click="clickUrl">
			<div class="across-good__img" :style="{'height':setHeight,'width':setHeight}">
				<image src="https://we.bak365.net/SmallProgramSaleTest/UpFile/001/Img/202006/20200601101240_3309.jpg" style="width:100%;height:100%"></image>

				<view class="flashSale-head-style_time">
					<text class="flashSale-head-style_timeTitle">距{{!stateTime?'开始':'结束'}}</text>
					<uni-countdown color="#fff" splitor-color="#FFFFFF" background-color="transparent" border-color="transparent" :day="activeTimeMy.day"
					 :hour="activeTimeMy.hours" :showDayMy="false" :minute="activeTimeMy.minute" :second="activeTimeMy.second" @timeup="timeupFun"
					 widthMy="18rpx"></uni-countdown>
				</view>
			</div>
			<div class="across-good__content">
				<div class="across-good__title">
					<span class="across-good__titleTag">{{dataInfo.GroupBuyMinCount}}人团</span>
					{{dataInfo.ActiveName}}
				</div>
				<div class="across-good__progress" v-if="dataInfo.ActiveSaleCount>0">
					<span style="padding-top: 10rpx;display: inline-block;">
					{{dataInfo.ActiveSaleCount}}人已拼团
					</span>
				</div>
				<div class="across-good__progress" v-else>
					<span style="padding-top: 10rpx;display: inline-block;">
					共{{dataInfo.ActiveStock}}件
					</span>
				</div>
				<div class="across-good__money">
					<span>¥
					{{dataInfo.ActiveSalePrice}}
					</span>

					<i class="icon stepperStyle fontColor">&#xe616;</i>
					<div style="text-decoration:line-through;color: #aaa;line-height: 10px;">¥
					{{dataInfo.SalePrice}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import uniCountdown from '@/components_uni/uni-countdown/uni-countdown.vue'
	import uniTag from '@/components_uni/uni-tag/uni-tag.vue'
	export default {
		props: {
			propsData: {
				type: Object,
				default () {
					return {
						HtmlInfo: {}
					}
				}
			}
		},
		components: {
			uniCountdown,
			uniTag
		},
		data() {
			return {
				setHeight: '',
				activeTimeMy: {
					day: 1,
					hours: 1,
					minute: 1,
					second: 1
				},
				// true已经开始
				stateTime: '',
				dataInfo: this.propsData.HtmlInfo || {},
				// 活动已结束
				activeTimeEnd:''
			}
		},
		created() {
			this.getTimeout()
			this.setHeight = (uni.getSystemInfoSync().windowWidth - 80) / 2 + "px"
		},
		mounted() {
		},
		methods: {
			clickUrl() {
				uni.navigateTo({
					url: this.dataInfo.LinkUrl
				})
			},
			getTimeout(current) {
				let currentT = new Date().getTime()
				let End = new Date(this.dataInfo.EndTime.replace(/-/g, '/')).getTime()
				let Start = new Date(this.dataInfo.StartTime.replace(/-/g, '/')).getTime()
				// let Start = new Date('2020-06-17 08:48:40').getTime()
				// let End = new Date('2020-06-19 14:48:50').getTime()
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
			timeupFun() {
				setTimeout(() => {
					this.getTimeout()
				}, 1000)
			}
		}
	}
</script>

<style scoped lang="less">
	.collageList {
		padding: 2.5px 10px;
	}

	.across-good {
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.1);

		&__img {
			position: relative;

			.flashSale-head-style_time {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				display: flex;
				justify-content: space-around;
				align-content: center;
				background-image: linear-gradient(to right, #fe605d, #fe4847);
				align-content: center;
				align-items: center;
				font-size: 10pt;
				color: rgba(255, 255, 255, 0.7);
			}

			.flashSale-head-style_timeTitle {}
		}


		&__content {
			margin: 10px;
			flex: 1;
			position: relative;
		}

		&__progress {
			overflow: hidden;
			margin: 10px 0 20px 0;
			color: #888;
			font-size: 9pt;
		}

		&__title {
			line-height: 22px;
			word-wrap: break-word;
			word-break: normal;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			color: #313131;
			font-size: 14px;
			overflow: hidden;
			font-weight: 700;
		}
		&__titleTag{
			color: #e64b2b;
			background: rgba(230,75,42,0.1);
			border-radius: 32px;
			display: inline-block;
			padding: 0 10px;
			font-weight: 30;
			font-size: 9pt;
			margin-right: 5px;
		}

		&__money {
			width: 100%;
			position: absolute;
			bottom: 5rpx;
			padding-bottom: 10px;
			color: #e64b2b;
			padding: 0;
			font-size: 9pt;
			line-height: 25px;

			.stepperStyle {
				display: inline-block;
				float: right;
				font-size: 23px;
			}
		}

	}
</style>
