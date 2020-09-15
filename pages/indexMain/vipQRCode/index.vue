<template>
	<view>
		<view v-if="isShowPassword" class="card">
			<view class="code-input-all-style">
				<label for="" style="vertical-align: middle;">卡密码</label>
				<input class="code-input-style" placeholder="请输入卡密码" @input="onChange" password />
			</view>

			<view style="padding:10px 0;margin-top:25px;" :class="'btnMy'+colorIndex">
				<button @click="cardUnt">确定</button>
			</view>
		</view>

		<view class="vipQR-code-page" v-if="!isShowPassword&&loadding">
			<view class="vipQR-code">
				<view class="vipQR-backg">
					<view class="topRound">
						<image src="../../../static/images/icon/vipIcon.png"></image>
					</view>
					<view class="vip-strip-line">
						<view class="vip-title">请向收银员出示二维码完成支付</view>

						<view class="barcode-style">
							<canvas id="barcode" canvas-id="barcode" :style="{width:windowWidth,height:'70px'}"></canvas>
						</view>
						<view class="code-str">{{codeStr}}</view>
						<view>
							<canvas class="qrcode-style" id="qrcode" canvas-id="qrcode" :style="{width:windowWidth,height:'240px'}"></canvas>
						</view>

						<view style="margin-top: 4%;">
							<text style="color:#777">卡余额：</text>
							<text style="color:rgb(0,100,0)">{{cardBalance}}</text>
						</view>
						<view class="vip-code-tap">
							请在十分钟内扫码完成支付
							<view class="vip-code-refresh" @click="refreshClick" v-if="codeStr">
								<text class="icon">&#xe603;</text>刷新
								 <!-- style="vertical-align: middle;" -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	let app = getApp()
	const {
		barcode,
		qrcode
	} = require('../../../utils/codeChange/index.js')
	export default {
		data() {
			return {
				isShowPassword: false,
				colorIndex: getApp().globalData.colorIndex,
				valuePassword: '',
				windowWidth: '',
				codeStr: '',
				cardBalance: 0,
				loadding: false
			}
		},
		onLoad: function(options) {
			this.windowWidth = (uni.getSystemInfoSync().windowWidth - 40 - 10 - 30) + 'px'

			// let code='19281234123412341'
			// setTimeout(() => {
			// barcode('barcode', code, this.windowWidth, 60);
			// qrcode('qrcode', code, 250, 250);
			// }, 100)
		},
		methods: {
			isPasswordGet() {
				this.$showLoads(0)
				this.loadding = false
				APIList.api('CardCode.aspx').then(D => {
					var NotPass = D.WX_CardPayNotPass
					this.cardBalance = D.WX_CardBalance
					if (NotPass === '1') {
						// 不输入密码
						this.getCode()
					} else {
						this.isShowPassword = true
						this.loadding = true
					}
					this.$showLoads(1)
				}).catch(e => {
					// setTimeout(() => {
					// 	uni.redirectTo({
					// 		url: "../index"
					// 	})
					// }, 2000)
				})
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
				this.getCode()
			},
			getCode() {
				var obj = {
					Type: 'CardCode',
					PassWord: this.valuePassword
				}
				this.$showLoads(0)
				APIList.api('Public/Submit_ajax.aspx', obj).then(D => {
					this.isShowPassword = false

					var code = D.Msg
					this.codeStr = D.Msg

					setTimeout(() => {
						barcode('barcode', code, this.windowWidth, 60);
						qrcode('qrcode', code, 250, 250);
					}, 100)
					this.loadding = true
					this.$showLoads(1)
				}).catch(e => {
				})
			},
			onChange(e) {
				this.valuePassword = e.detail.value
			},
			refreshClick() {
				// 重新获取
				this.getCode()
			},
			onShow: function() {
				if (!app.globalData.openID) {
					this.$store.dispatch('Login').then(D => {
						this.isPasswordGet()
					})
				} else {
					this.isPasswordGet()
				}
			}
		}
	}
</script>

<style scoped>
	/* 	page {
		width: 100%;
		height: 100%;
	} */
	.card {
		padding: 10px 15px;
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

	.vipQR-code-page {
		width: 100%;
		min-height: 100vh;
		background: #242424;
		padding: 50px 20px 20px;
		box-sizing: border-box;
	}

	.vipQR-code {
		width: 100%;
		min-height: 100%;
		padding: 10px;
		background: #dad3d0;
		box-sizing: border-box;
		position: relative;
	}

	.vipQR-backg {
		width: 100%;
		min-height: 100%;
		border: 1px solid #bdb5a5;
		text-align: center;
	}

	.topRound {
		width: 60px;
		height: 60px;
		border: 1px solid #df9e13;
		background: #efefe7;
		border-radius: 50%;
		position: absolute;
		top: -35px;
		margin-left: 50%;
		left: -30px;
		text-align: center;
	}

	.topRound image {
		width: 60%;
		height: 60%;
		line-height: 60px;
		margin-top: 10px;
	}

	.vip-title {
		color: #df9e13;
		font-size: 16px;
	}

	.vip-strip-line {
		font-size: 11pt;
		margin-top: 10%;
		margin-bottom: 10%;
		padding: 10px;
	}

	.barcode-style {
		margin-top: 15px;
	}

	.code-str {
		color: #df9e13;
		font-size: 10pt;
	}

	.qrcode-style {
		margin-left: 50%;
		transform: translateX(-125px);
	}

	.vip-code-tap {
		color: rgb(163, 162, 157);
		margin-top: 5px;
	}

	.vip-code-refresh {
		display: inline-block;
		/* vertical-align: middle; */
		color: #df9e13;
		margin-left: 5px;
	}
</style>
