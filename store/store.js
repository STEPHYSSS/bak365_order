import Vue from 'vue'
import Vuex from 'vuex'

import APIList from "../api/http.js"

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		allMoney: 0,
		addNum: 0
	},
	mutations: {

	},
	actions: {		
		Login() {
			// 登录
			let app = getApp()
			// return new Promise((resolve, reject) => {
			return new Promise((resolve, reject) => {
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						//支付宝返回=》'alipay'
						let providerNew = res.provider[0]
						// console.log(providerNew)
						if (providerNew) {

							app.globalData.provider = providerNew
							if (providerNew === 'alipay') {
								let extConfig = my.getExtConfigSync();
								// console.log(extConfig.openID,'extConfig.openID')
								if (extConfig&&extConfig.hasOwnProperty('openID')&&extConfig.openID) {
									app.globalData.OpenID = extConfig.openID
									resolve(true)
									return
								}
							}
							uni.login({
								provider: providerNew,
								timeout: 5000,
								success: function(loginRes) {
									let codeParam = providerNew === 'alipay' ? 'authCode' : 'code'
									let url = providerNew === 'alipay' ? app.globalData.requestUrl + 'Alipay/' : app.globalData.requestUrl
									// app.globalData.requestUrl = url
									uni.request({
										url: url + 'GetOpenID.aspx',
										data: {
											Code: loginRes[codeParam],
											AppID: app.globalData.appID
										},
										method: 'GET',
										header: {
											'content-type': 'application/json'
										},
										success: function(result) {
											console.log(result)
											if (!result.data) {
												uni.showToast({
													title: "接口请求失败，请重试",
													icon: 'none'
												});
												return
											}
											if (result.data.Code == '1') {
												app.globalData.OpenID = result.data.Msg
												// wx.setStorageSync('OpenID', result.data.Msg)
												resolve(true)
											} else {
												uni.showToast({
													title: result.data.Msg,
													icon: 'none'
												});
												reject(false)
											}
										},
										fail: function(err) {
											uni.showToast({
												title: err ? err : "获取OpenID失败",
												icon: 'none'
											});
											reject(false)
										}
									})
								}
							});
						} else {
							//H5
							// loginHttp(app.globalData.requestUrl, '9bb7e1a2975d4a42a8ddc4e5d922ZD70', app, resolve)
						}
					}
				});
			})
		}
	}
})

function loginHttp(url, code, app, resolve) {
	// loginHttp(app.globalData.requestUrl, loginRes[codeParam], app, resolve)
	uni.request({
		url: url + 'GetOpenID.aspx',
		data: {
			Code: code,
			AppID: app.globalData.appID
		},
		header: {
			'content-type': 'application/json'
		},
		success: function(result) {
			console.log(result)
			if (result.data.Code == "1") {
				app.globalData.openID = result.data.Msg
				// wx.setStorageSync('OpenID', result.data.Msg)
				resolve(true)
			} else {
				uni.showToast({
					title: "网络错误，请重试",
					icon: 'none'
				});
				resolve(false)
			}
		},
		fail: function(err) {
			uni.showToast({
				title: err ? err : "网络错误，请重试",
				icon: 'none'
			});
			resolve(false)
		}
	})
}

export default store
