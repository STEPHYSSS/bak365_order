//获取应用实例
import Vue from 'vue'

const api = (aspx, data, openID, isPack, methods, AppID) => {
	let app = getApp()
	return new Promise((resolve, reject) => {
		let obj = {
			OpenID: openID ? openID : app.globalData.OpenID,
			AppID: AppID ? AppID : app.globalData.appID,
			ShopNo: data && data.shopNo ? data.shopNo : (app.globalData.shopNo ? app.globalData.shopNo : ''), //7701
			IsEatInOrTakeOut: isPack ? isPack : app.globalData.isPack,
			TableNumber: app.globalData.tableNumber || '',
			OrderSource: app.globalData.provider === 'alipay' ? '2' : '1'
		}
		Object.assign(obj, data)
		uni.request({
			url: app.globalData.requestUrl + aspx,
			data: obj,
			method: methods ? methods : 'GET',
			header: {
				'content-type': methods ? 'application/x-www-form-urlencoded' : 'application/json'
			},
			success: function(result) {
				// console.log(result, 'config')
				if (!result.data) {
					uni.showToast({
						title: "接口请求失败，请重试",
						icon: 'none'
					});
					return
				}
				if (result.data.Code == '1') {
					resolve(result.data)
					return
				}
				if (result.data.Code == '2') {
					uni.showToast({
						title: result.data.Msg,
						icon: 'none'
					});
					reject(result.data.Msg)
				} else {
					let err = result.data.Msg
					uni.showToast({
						title: typeof(err) == 'string' ? err : "请求失败，请重试",
						icon: 'none'
					});
					reject(err)
				}
			},
			fail: function(err) {
				// console.log(err, 'errerr')
				uni.showToast({
					title: typeof(err) == 'string' || err ? err : "请求失败，请重试",
					icon: 'none'
				});
				uni.hideLoading();
				reject(err)
			},
			complete: function() {
				// uni.hideLoading();
				// resolve()
			}
		})
	})
}

module.exports = {
	api: api
}
