<template>
	<div class="collageList">
		<div class="assembled-users" v-for="(item,index) in groupList" :key="index">
			<div class="assembled-users_img">
				<image :src="item.HeardImg" alt="">
			</div>
			<div class="assembled-users_info">
				<div class="assembled-users_infoName"> {{item.NickName}}</div>
				<span class="assembled-users_infoTime">还差
					<i style="color:#e64b2b;display: inline;">{{item.SurplusNum}}</i>人成团
					<div style="display: inline-block;" v-if="item.activeTimeMy">
						,剩余
						<uni-countdown :show-day="item.activeTimeMy.day>0" style="display: inline-block;" :show-colon="false" color="#e64b2b"
						 splitorColor="#e64b2b" background-color="#fff" border-color="#fff" widthMy="10px" :day="item.activeTimeMy.day"
						 :hour="item.activeTimeMy.hours" :minute="item.activeTimeMy.minute" :second="item.activeTimeMy.second"></uni-countdown>
					</div>
				</span>
			</div>
			<div class="assembled-users_btn" v-if="!myCollage">
				<span class="users_btn" @click="getTogether(item.GroupNo)">去凑团</span>
			</div>
			<div class="assembled-users_btn" v-else>
				<span class="users_btn" @click="getTogether(item.GroupNo)">{{item.StatusName}}</span>
			</div>
		</div>
		<no-data v-if="groupList.length===0"></no-data>
		
	</div>
</template>

<script>
	import APIList from '@/api/http.js'
	import uniCountdown from '@/components_uni/uni-countdown/uni-countdown.vue'
	import noData from '@/components/nodeData/index.vue'
	const app = getApp()
	export default {
		components: {
			uniCountdown,
			noData
		},
		data() {
			return {
				//true 我的拼团
				myCollage: false,
				groupList: [],
				ActiveID: ''
			}
		},
		onLoad(option) {
			// SD00007
			this.myCollage = option.myCollage || false
			this.ActiveID = option.ActiveID || ''

			if (this.myCollage) {
				uni.setNavigationBarTitle({
					title: '我的拼团'
				});
			}
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getList()

				})
			} else {
				this.getList()
			}
		},
		methods: {
			getList() {
				uni.showLoading({
					title: '加载中',
					icon: 'none'
				});
				let _api = this.myCollage ? 'Active/GroupBuy/OwnGroupList.aspx' : 'Active/GroupBuy/GroupList.aspx'
				APIList.api(_api, {
					ActiveID: this.ActiveID || ''
				}).then(D => {
					uni.hideLoading();
					this.groupList = D.GroupInfo

					if (this.groupList.length > 0) {
						this.groupList.forEach(D => {
							if (D.VaildTime) {
								D.activeTimeMy = this.getVaildTime(D.VaildTime)
							}
						})
					}
				}).catch(D => {})
			},
			getVaildTime(VaildTime) {
				// 计算拼团剩余时间
				let currentT = new Date().getTime()
				let End = new Date(VaildTime.replace(/-/g, '/')).getTime()
				let myTime = End - currentT
				return {
					day: parseInt(myTime / (1000 * 60 * 60 * 24)),
					hours: parseInt((myTime % (1000 * 60 * 60 * 24)) / (60 * 60 * 1000)),
					minute: parseInt((myTime % (1000 * 60 * 60)) / (60 * 1000)),
					second: parseInt((myTime % (1000 * 60)) / 1000)
				}
			},
			getTogether(GroupNo){
				if(!this.myCollage){
					uni.navigateTo({
						url: '/pages/indexCanteen/collage/info?ActiveID='+this.ActiveID+'&GroupNo='+GroupNo
					})
				}else{
					uni.navigateTo({
						url: '/pages/indexCanteen/collage/info?ActiveID='+this.ActiveID+'&GroupNo='+GroupNo+'&myCollage='+this.myCollage
					})
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.collageList {
		background-color: #f7f7f7;
		min-height: 100vh;

		.assembled-users {
			display: flex;
			padding: 26rpx;
			border-bottom: 1px solid #eee;
			font-size: 8pt;
			color: #666;
			align-items: center;
			background-color: #fff;

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
					border: 1px solid #e64b2b;
					padding: 10rpx 20rpx;
					color: #e64b2b;
				}
			}
		}
	}
</style>
