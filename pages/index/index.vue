<template>
	<view class="content" style="background: url('https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2616736980,3933048081&fm=26&gp=0.jpg');">
		<!-- <image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view> -->
	</view>
</template>

<script>
	import APIList from "@/api/http.js"
	let app = getApp()
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// console.log( getApp().globalData, 'openID')

			// APIList.api('GetOpenID.aspx', {
			// 	Code: 55555
			// }).then(D => {
			// 	console.log(5454)
			// })
		},
		onShow() {
			// console.log(app.globalData, 'openID')
			// APIList.api('GetOpenID.aspx', {
			// 	Code: 55555
			// }).then(D => {
			// 	console.log(5454)
			// })
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
