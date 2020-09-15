<template>
	<view>
		<view class="indexTop">
			<view :class="['changeMode','changeModeLeft',radioModes == 1&&onlySubscribe==='1'?'isActive':'']" @click="changeMode(1)">
				<image v-if="radioModes == 1" class="changeTopIcon" src="/static/images/icon/selectZRed.png"></image>
				<image class="changeModeImg" src="/static/images/icon/jiucan.png"></image>
				<span style="margin-left:5px" class="aboutTimeStyle" v-if="onlySubscribe==='1'">立即就餐</span>
				<span style="margin-left:5px" class="aboutTimeStyle" v-else>暂不支持<br>立即就餐</span>
			</view>
			<view :class="['changeMode','changeModeRight',radioModes == 2?'isActive':'']" @click="changeMode(2)">
				<image v-if="radioModes == 2" class="changeTopIcon" src="/static/images/icon/selectZRed.png"></image>
				<image class="changeModeImg" src="/static/images/icon/timeD.png"></image>
				<span style="margin-left:5px" class="aboutTimeStyle">{{aboutTime}}</span>
			</view>
		</view>
		<!-- <uni-popup :show="show" type="bottom" @change="onClose" style="max-height: 30%" class="couponPopup">
		
		</uni-popup> -->
	</view>
</template>

<script>
	import uniPopup from '@/components_uni/uni-popup/uni-popup.vue'
	import APIList from '@/api/http.js';
	let app = getApp()
	export default {
		components: {
			uniPopup
		},
		props: {
			onlySubscribe: [String, Number],
			aboutTime: {
				type: String,
				default: '预约就餐'
			}
		},
		data() {
			return {
				radioModes: this.onlySubscribe !== '1' ? 2 : 1,
				show: false
			}
		},
		methods: {
			changeMode(e) {
				if (this.onlySubscribe !== '1' && e === 1) {
					return
				}
				this.radioModes = e
				// if (e === 2) {
				// 	// this.show = true
				// 	this.$emit('changeMode')
				// }
				this.$emit('changeMode', e)
			}
		}
	}
</script>

<style scoped>
	.indexTop {
		display: flex;
		justify-content: center;
		margin: 10px 0;
		justify-content: space-around;
	}

	.changeMode {
		width: 140px;
		height: 50px;
		display: flex;
		background: #f6f6f6;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		font-size: 14px;
		color: #D82F37;
		position: relative;
		overflow: hidden;
	}

	.changeModeImg {
		width: 25px !important;
		height: 25px !important;
	}

	.changeModeLeft {
		margin-right: 2%;
	}

	.changeModeRight {
		/* margin-left: 10px; */
	}

	.isActive {
		border: 1px solid #D82F37;
	}

	.changeTopIcon {
		right: 0px;
		position: absolute;
		width: 26px;
		height: 26px;
		bottom: 0;
	}

	.aboutTimeStyle {
		font-size: 12px;
		max-width: 82px;
	}
</style>
