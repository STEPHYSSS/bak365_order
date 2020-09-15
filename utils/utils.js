const app = getApp()
const formatTime = (date, bool) => {
	// 转换成(n/y/d h:m:s)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	if (bool) {
		return [year, month, day].map(formatNumber).join('-')
	}

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	// 补零
	n = n.toString()
	return n[1] ? n : '0' + n
}

var setStock = function(e) {
	//检查库存
	var goodsList = e.itemData
	var prodParts = goodsList.prodPartsInfo
	var cartListArr = uni.getStorageSync('cartList') || []
	var bool = true

	// 控制配件库存
	if (prodParts.length > 0) {
		// 有配件的时候，查看配件库存
		let boolNew = prodParts.some(newSomeQty)

		function newSomeQty(D) {
			let PartsAllNum = 0
			if (cartListArr.length > 0) {
				cartListArr.forEach((data, index) => {
					if (data.prodPartsInfo.length > 0) {
						data.prodPartsInfo.forEach((prodPartsdata, index) => {
							if (prodPartsdata.ProdNo == D.ProdNo) {
								PartsAllNum += prodPartsdata.num
							}
						})
					}

				})
			}
			if (PartsAllNum >= Number(D.StockQty)) {
				uni.showToast({
					title: "配件：" + D.ProdName + ' 库存不足',
					icon: 'none'
				})
			}
			return PartsAllNum >= Number(D.StockQty)
		}
		if (boolNew) {
			bool = false
		}
	}
	// 控制配件库存end

	if (!bool) {
		return false
	}
	var allNum = 0
	if (cartListArr.length > 0) {
		cartListArr.forEach((data, index) => {
			if (Number(goodsList.num) > 0 && goodsList.ProdNo == data.ProdNo) {
				allNum += data.num
			}
		})

	}
	if (Number(goodsList.StockQty) <= allNum) {
		uni.showToast({
			title: '商品库存不足',
			icon: 'none'
		})
		return false
	}
	if ((goodsList.hasOwnProperty('ActiveID') && goodsList.ActiveID) && Number(goodsList.EveryOneMaxBuyCount) <= allNum) {
		//控制活动限购
		uni.showToast({
			title: '次活动限购' + goodsList.EveryOneMaxBuyCount + '件',
			icon: 'none'
		})
		return false
	}
	return true
}

var setCard = function(e) {
	// 加入购物车 去重和添加

	// 添加的配件
	// var partsList = e.detail.recordParts
	// 添加的商品
	var goodsList = e.itemData

	// 购物车列表
	var cartListArr = uni.getStorageSync('cartList') || []

	if (cartListArr.length === 0) {
		// 如果商品不存在就添加购物车里面
		cartListArr.push(goodsList)
	} else {
		var index = cartListArr.findIndex(item => {
			// 找原本存在的返回true,修改
			// 当添加的商品有口味的时候，已经添加的商品是否有口味
			// 如果有，当id相同，口味相同的，就返回 true 出去 修改相应的id
			var cartFlavorStr = (item.recordFlavor).join(',')
			var goodFlavorStr = (goodsList.recordFlavor).join(',')
			return goodsList.ProdNo === item.ProdNo && cartFlavorStr === goodFlavorStr && goodsList.ProdParts ===
				item.ProdParts && goodsList.CombNo === item.CombNo && (item.hasOwnProperty('ActiveID')?item.ActiveID === goodsList.ActiveID:true)
		})
		if (index > -1) {
			// 存在
			if (goodsList.showStepper) {
				// 没有配件和口味
				cartListArr[index].num = goodsList.num
			} else {
				cartListArr[index].prodPartsInfo.forEach(D => {
					D.num++
				})
				cartListArr[index].num++
			}
		} else {
			cartListArr.push(goodsList)
		}
	}
	let arr = cartListArr.filter(D => D.num > 0 || D.num)  //过滤num等于0的
	uni.setStorageSync('cartList', arr)
	return cartListArr
}

// 控制商品库存不让添加
const controlGoodStock = (_this, index) => {
	let cardNum = 0
	let currentNo = _this.cartLists[index].ProdNo
	_this.cartLists.forEach((D, i) => {
		// 获取当前购物车,该商品的总数量
		if (D.ProdNo === currentNo) {
			cardNum += D.num
		}
	})

	_this.cartLists.forEach((D, i) => {
		if (Number(_this.cartLists[index].StockQty) <= cardNum) {
			_this.cartLists[index].disabledNum = true
			if (D.ProdNo === currentNo) {
				_this.cartLists[index].disabledProStr = _this.cartLists[index].ProdName
				D.disabledNum = true
			}
		} else {

			if (D.ProdNo === currentNo) {
				D.disabledNum = false
			}
			_this.cartLists[index].disabledNum = false
		}
	})
}

// 控制配件库存
const controlPartsStock = (_this, index) => {
	let cardNum = 0 //求购物车所有商品库存
	let currentNo = _this.cartLists[index].ProdNo //添加的当前的商品的id

	// 控制配件库存(于上面代码功能一样)
	let partsQty = {} //求购物车所有配件库存

	_this.cartLists.forEach((D, i) => {
		if (D.ProdNo === currentNo) {
			cardNum += D.num
		}
		D.prodPartsInfo.forEach(data => {
			if (!partsQty[data.ProdNo]) {
				partsQty[data.ProdNo] = 0
			}
			partsQty[data.ProdNo] += Number(data.num)
		})
	})
	let currentNoParts = _this.cartLists[index].prodPartsInfo //添加的当前的商品配件的id
	_this.cartLists.forEach((D, i) => { //比较配件库存


		if (Number(_this.cartLists[index].StockQty) <= cardNum) { //比较商品库存
			_this.cartLists[index].disabledNum = true
			if (D.ProdNo === currentNo) {
				D.disabledProStr = D.ProdName //是哪个商品库存满了，提示用
				D.disabledNum = true
			}
		} else {
			if (D.ProdNo === currentNo) {
				D.disabledNum = false
			}
			_this.cartLists[index].disabledNum = false
		}
		if (Number(_this.cartLists[index].StockQty) <= cardNum) {
			return
		}

		let idNew = null
		let strNew = ''
		D.prodPartsInfo.forEach(data => {
			if (currentNoParts.length === 0) {
				if (Number(data.StockQty) === partsQty[data.ProdNo]) {
					_this.cartLists[index].disabledNum = true
					D.disabledProStr = data.ProdName
					D.disabledNum = true
				}
			}

			let newPartsBool = currentNoParts.some(newSome)

			function newSome(PartsData) {
				idNew = PartsData.ProdNo
				strNew = PartsData.ProdName
				return PartsData.StockQty <= partsQty[PartsData.ProdNo]
			}
			currentNoParts.forEach(newData => {
				if (newPartsBool) {
					_this.cartLists[index].disabledNum = true
					if (idNew === data.ProdNo) {
						D.disabledProStr = strNew //是哪个商品的配件库存满了，提示用
						D.disabledNum = true
					}
				} else {
					_this.cartLists[index].disabledNum = false
					if (newData.ProdNo === data.ProdNo) {
						D.disabledNum = false
					}
				}
			})
		})
	})
}

// js判断早上好, 上午好, 下午好, 傍晚好, 晚上好
const judgeTime = () => {
	var now = new Date(),
		hour = now.getHours()
	if (hour < 5) {
		return "凌晨好"
	} else if (hour < 9) {
		return "早上好"
	} else if (hour < 12) {
		return "上午好"
	} else if (hour < 14) {
		return "中午好"
	} else if (hour < 18) {
		return "下午好"
	} else if (hour < 20) {
		return "傍晚好"
	} else {
		return "晚上好"
	}
}

// 钱加.00 两位小数
const setDecimal = (val) => {
	if (!val) return
	val = val.toString()
	let newArr = val.split('.')
	if (!newArr[1]) {
		return val + '.00'
	} else if (newArr[1].length === 2) {
		return val
	} else {
		return val + '0'
	}
}

// 控制选择就餐方式的那三个按钮的显示
const setModeIf = (a, b, c) => {
	// a = '1'
	// b = 0
	// c = 0
	let arr = [a, b, c]
	let newArr = arr.filter(D => D == '1')
	if (newArr.length === 1) {
		let currentMode = a == '1' ? 3 : b == '1' ? 2 : 1
		return {
			bool: false,
			currentMode: currentMode
		}
	} else {
		return {
			bool: true
		}
	}
}

//吊起微信支付
const weChatPayment = (app, orderId, D, isCardPay,isCollage) => {
	let providerNew = app.globalData.provider
	// console.log(D, 'providerNew')
	if (providerNew) {
		uni.requestPayment({
			provider: providerNew,
			orderInfo: D.hasOwnProperty('Msg') ? D.Msg : '',
			timeStamp: D.hasOwnProperty('DataInfo') ? D.DataInfo.TimeStamp : '',
			nonceStr: D.hasOwnProperty('DataInfo') ? D.DataInfo.NonceStr : '',
			package: D.hasOwnProperty('DataInfo') ? D.DataInfo.Package : '',
			signType: 'MD5',
			paySign: D.hasOwnProperty('DataInfo') ? D.DataInfo.PaySign : '',
			success: function(payResult) {
				// console.log(payResult, 'payResult')
				if (payResult.errMsg == "requestPayment:ok") {
					if (Number(payResult.resultCode) == 6001) {
						// 都是支付宝定义的code
						uni.showToast({
							title: "取消支付",
							icon: 'none'
						})
					}
					if (Number(payResult.resultCode) == 6002) {
						uni.showToast({
							title: "网络连接出错",
							icon: 'none'
						})
					}
					if (Number(payResult.resultCode) == 4000) {
						uni.showToast({
							title: "订单处理失败",
							icon: 'none'
						})
					}
					if (Number(payResult.resultCode) == 8000) {
						uni.showToast({
							title: "正在处理中",
							icon: 'none'
						})
					}
					if (!isCardPay) {
						uni.redirectTo({
							url: '/pages/indexOrder/orderInfo/index?id=' + orderId
						})
					} else {
						// 是会员卡充值
						uni.switchTab({
							url: '/pages/indexVip/index'
						})
					}
					// if(){
						
					// }
					uni.showToast({
						title: "支付成功"
					})
				} else {
					uni.showToast({
						title: "支付失败",
						icon: 'none'
					})
					if (!isCardPay) {
						uni.redirectTo({
							url: '/pages/indexOrder/orderInfo/index?id=' + orderId
						})
					} else {
						// 是会员卡充值
						uni.switchTab({
							url: '/pages/indexVip/index'
						})
					}
					console.log('requestPayment支付失败')
				}
			},
			fail: function(res) {
				let str = ''
				if (res.errMsg && res.errMsg === 'requestPayment:fail cancel') {
					str = "取消支付"
					if (isCardPay) {
						uni.showToast({
							title: str,
							icon: 'none'
						})
						return
					}
				} else {
					str = typeof(res) == 'string' ? res : "支付失败"
				}
				uni.showToast({
					title: str,
					icon: 'none'
				})
				if (!isCardPay) {
					uni.redirectTo({
						url: '/pages/indexOrder/orderInfo/index?id=' + orderId
					})
				} else {
					// 是会员卡充值
					uni.switchTab({
						url: '/pages/indexVip/index'
					})
				}
			}
		})
	}
}


function setTime(arr) {
	arr.forEach(D => {
		let Darr = D.StartDate.split(' ')
		let DarrEnd = D.ValidDate.split(' ')
		let SaleDate = D.SaleDate.split(' ')
		Darr.pop()
		DarrEnd.pop()
		SaleDate.pop()
		D.StartDate = Darr.join('')
		D.ValidDate = DarrEnd.join('')
		D.SaleDate = SaleDate.join('')
	})
}

//获取url的参数对象
const cutUrl = (httpUrl) => {
	var objParam = {}
	var strParam = httpUrl.slice(httpUrl.indexOf("?"))
	strParam = strParam.substr(1)
	var arrParam = strParam.split("&");
	arrParam.forEach(D => {
		var a = D.split("=")[0]
		objParam[a] = D.split("=")[1]
	})

	// console.log(objParam,'objParam')
	return objParam
}

// 手机号码验证
const checkMobile = (s) => {
	var regu = /^1[3456789]\d{9}$/;
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}

module.exports = {
	formatTime: formatTime,
	setCard: setCard,
	judgeTime: judgeTime,
	setStock: setStock,
	setTime: setTime,
	controlGoodStock,
	controlPartsStock,
	weChatPayment,
	cutUrl,
	setDecimal,
	setModeIf,
	checkMobile
}
