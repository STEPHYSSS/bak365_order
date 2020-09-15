<template>
	<view>
		<view class="cardUnt">
			<view class="code-input-all-style">
				<label for="" style="vertical-align: middle;">卡密码</label>
				<input class="code-input-style" placeholder="请输入卡密码" @input="onChange" password />
			</view>

			<view style="padding:10px 0;margin-top:25px;" :class="'btnMy'+colorIndex">
				<button @click="cardUnt">确定解绑</button>
			</view>

			<div class="card-un-style">若未设置密码初始密码为123456</div>
		</view>
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	const app = getApp()
	export default {
		data() {
			return {
				valuePassword: '',
				colorIndex: getApp().globalData.colorIndex,
			}
		},
		methods: {
			onChange(e) {
				this.valuePassword = e.detail.value
			},
			cardUnt() {
				var regu = "^[ ]+$"; //是否全是空格
				var re = new RegExp(regu);

				if (!this.valuePassword || re.test(this.valuePassword)) {
					uni.showToast({
						title: '请输入密码!',
						duration: 2000,
						icon: 'none'
					});
					return
				}
				this.$showLoads(0, '')
				APIList.api('Public/Submit_ajax.aspx', {
					PassWord: this.valuePassword,
					Type: "CardBindDel"
				}).then(D => {
					uni.showToast({
						title: D.Msg,
						icon: 'none'
					});
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/indexVip/index'
						})
					}, 1000)
					uni.showToast({
						title: '解绑成功',
						icon: 'none'
					});
				}).catch(e => {})
			}
		},
		onShow: function() {
			if (!app.globalData.openID) {
				this.$store.dispatch('Login')
			}
		}
	}
</script>

<style scoped lang="scss">
	.cardUnt {
		padding: 10px 15px;

		.card-un-style {
			float: right;
			margin-top: 10px;
			font-size: 12px;
			color: #484848;
		}
	}

	.code-input-all-style {
		font-size: 11pt;
	}

	.code-input-style {
		display: inline-block;
		background: transparent;
		vertical-align: middle;
		margin-left: 25px;
	}
</style>
