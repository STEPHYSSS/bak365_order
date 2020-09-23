<template>
	<!-- 确定订单页 -->
	<div>
		<view class="payment-style" v-if="arrayList.length>0">
			<view class="offeredTop" v-if="isCollage">
				<div class="offeredTopDiv">
					<div class="offeredTopImg">
						<image src="/static/images/icon/collage-kaituan.png" mode=""></image>
					</div>
					<span>1.选择商品开团/参团</span>
				</div>
				<uni-icons type="arrowright" size="15" class="offeredTopIcon"></uni-icons>
				<div class="offeredTopDiv">
					<div class="offeredTopImg">
						<image src="/static/images/icon/collage-haoyou.png" mode=""></image>
					</div>
					<span>2.邀请好友参团</span>
				</div>
				<uni-icons type="arrowright" size="15" class="offeredTopIcon"></uni-icons>
				<div class="offeredTopDiv">
					<div class="offeredTopImg">
						<image src="/static/images/icon/collage-chengg.png" mode=""></image>
					</div>
					<span>3.人满成团</span>
				</div>
			</view>
			<view class="orderTable">
				<view class="orderTableShop">
					<text class="icon iconshop" style="margin-right:6px">&#xe682;</text>{{orderObj.ShopInfo.ShopName}}
					<text class="tableNumberStyle" v-if="tableNumber">(座位号:{{tableNumber}})</text>
					<view class="orderTableShopRight" v-if="orderObj.ShopInfo.ShopTel">
						<text class="icon iconShopPhone" @click="ShopPhone">&#xe633;</text>
					</view>
				</view>
			</view>
			<view>
				<view class="setPack my-default-btn">
					<view class="setPackArea" @click="changeArea" v-if="currentIndexMode == 2">
						<view style="margin-bottom:4px;font-weight: 700;">配送信息</view>
						<view v-if="currentArea.AddressNo">
							<view class="setPackAreaLocation">
								<text class="icon" style="margin-right:4px">&#xe64f;</text><text>{{currentArea.Address}}</text>
							</view>
							<view>
								<text class="icon" style="margin-right:4px">&#xe633;</text><text>{{currentArea.Mobile}} &nbsp;{{currentArea.Name}}</text>
							</view>
						</view>
						<view v-else>
							<text>请选择收货地址</text>
							<text class="icon">&#xe670;</text>
						</view>
					</view>
					<view class="setPackButton">
						<button @click="setPackFun" :style="{'color':colorItem,'borderColor':colorItem}">
							{{modeVal}}</button>
					</view>
				</view>
				<goods-box v-for="(item,index) in arrayList" :itemData="item" :key="index" :isOrder="true" @clickGoodsBox="clickGoodsBox"></goods-box>

			</view>

			<view v-if="arrayList.length>0&&isSubscribe==='1'">
				<change-about :onlySubscribe="orderObj.OrderProdType" @changeMode="changeMode" :aboutTime="aboutTime.propsAboutTime"></change-about>
			</view>

			<view class="summary">
				<view>
					<view class="summaryMoney">商品总金额</view>
					<view class="summaryNum">¥{{setDecimalFun(orderObj.OrderProdAmt)}}</view>
				</view>
				<view v-if="orderObj.OrderPackingFeeAmt>0">
					<view class="summaryMoney">打包费</view>
					<view class="summaryNum">+¥{{setDecimalFun(orderObj.OrderPackingFeeAmt)}}</view>
				</view>
				<view v-if="currentArea.Freight>0">
					<view class="summaryMoney">配送费</view>
					<view class="summaryNum">+¥{{setDecimalFun(currentArea.Freight)}}</view>
				</view>
				<view v-if="orderObj.PrefInfo.WxFavorAmt&&orderObj.PrefInfo.WxFavorAmt>0&& radio == 2">
					<!-- 微信支付优惠方案 -->
					<view class="summaryMoney">优惠方案</view>
					<view class="summaryNum">-¥{{orderObj.PrefInfo.WxFavorAmt}}</view>
				</view>
				<view v-if="orderObj.PrefInfo.AlipayFavorAmt&&orderObj.PrefInfo.AlipayFavorAmt>0&& radio == 3">
					<!-- 支付宝支付优惠方案 -->
					<view class="summaryMoney">优惠方案</view>
					<view class="summaryNum">-¥{{orderObj.PrefInfo.AlipayFavorAmt}}</view>
				</view>
				<view v-if="orderObj.PrefInfo.CardFavorAmt > 0 && radio == 1">
					<!-- 卡支付优惠方案 -->
					<view class="summaryMoney">优惠方案</view>
					<view class="summaryNum">-¥{{orderObj.PrefInfo.CardFavorAmt}}</view>
				</view>
				<view @click="changeCoupon" v-if="orderObj.PayInfo.WX_TicketPay>0">
					<view class="summaryMoney">优惠券</view>
					<view class="summaryNumClick">
						<view style="display: inline-block;">
							<text v-if="isChangeCoupon===false&&!isChangeCouponBool">{{dataList.length>0?'暂不使用券':'暂无券使用'}}</text>
							<text style="color:#d82f37" v-else>-¥{{isChangeCoupon===false?0:setDecimalFun(isChangeCoupon)}}</text>
						</view>

						<text style="font-size:15px" class="icon">&#xe670;</text>
					</view>
				</view>

				<view class="RemarksFa">
					<text class="Remarks">备注留言：</text>
					<input placeholder="请注明" class="inputRemarks" @input="bindKeyInput"></input>
				</view>
			</view>
			<view class="orderBottom" v-if="arrayList.length>0">
				<radio-group :value="radio" style="width:100%">
					<view class="value-class" v-if="orderObj.PayInfo.WX_CardPay !== '1'&&orderObj.PayInfo.WX_NotCardPay!=='1'">
						<view class="my-default-btn no-payCard-style">
							<button class="custom-class-button" @click="routerBindCard">添加会员卡</button>
						</view>
						<text style="font-size: 10pt;float: right;color:#777;line-height: 26px;">添加会员卡，可用钱包余额</text>
					</view>

					<view v-if="orderObj.PayInfo.WX_CardPay === '1'&&orderObj.PayInfo.WX_NotCardPay!=='1'" class="value-class" @click="onChange(1)">
						<image class="wechat" src="../../../static/images/icon/moneyPay.png" mode="widthFix"></image>
						<text style="vertical-align: middle;">会员钱包支付（余额:{{orderObj.PayInfo.WX_CardBalance}}）</text>
						<radio class="summaryNum" v-if="orderObj.PayInfo.WX_CardBalance>0&&orderObj.PayInfo.WX_CardBalance>allMoney"
						 :value="1" :checked="radio === 1" />
						<view class="summaryNum" style="color:#777" v-else>余额不足</view>
					</view>
					<view v-if="orderObj.PayInfo.WX_WxPay === '1'" class="value-class" @click="onChange(2)">
						<image class="wechat" src="../../../static/images/icon/weixinPay.png" mode="widthFix"></image>
						<text style="vertical-align: middle;">微信支付</text>
						<radio name="2" class="summaryNum" :value="2" :checked="radio === 2" />
					</view>
					<view v-if="orderObj.PayInfo.WX_AlipayPay === '1'" class="value-class" @click="onChange(3)">
						<image class="wechat" src="../../../static/images/icon/zfbPay.png" mode="widthFix"></image>
						<text style="vertical-align: middle;">支付宝支付</text>
						<radio :value="3" class="summaryNum" :checked="radio === 3" />
					</view>
				</radio-group>

				<bottom-submit v-if="!showCalendar" :allMoney="setAllMoney(allMoney)" :addNum="addNum" :cartLists="arrayList"
				 @clickClear="clickClear" :isOrder="true" @determine="determine" :MinAmountNew="currentIndexMode"></bottom-submit>
			</view>

			<view class="popupFa">
				<uni-popup :show="showCoupon" type="bottom" @change="onCloseCoupon" style="max-height: 90%" class="couponPopup">
					<coupon-box v-if="dataList.length>0" :dataList="dataList" :isOrder="true" :activeUser="0" @onClickCoupon="onClickCoupon"
					 @viewMore="viewMore" :currentId="currentId"></coupon-box>
					<no-data v-if="dataList.length===0"></no-data>

					<view class="takeout-page" v-if="dataList.length>0">
						<view class="takeout-page-left">
							<button @click="clickPage(1)" class="custom-class-left" :disabled="disabledBtn">
								<text class="icon" style="vertical-align:middle;">&#xe61b;</text>上一页
							</button>
						</view>
						<view class="page-number">
							{{pageIndex}}
						</view>
						<view class="takeout-page-right">
							<button class="custom-class-right" @click="clickPage(2)" :disabled="disabledBtn">
								下一页
								<text class="icon" style="margin-left:2px">&#xe670;</text>
							</button>
						</view>
					</view>
				</uni-popup>
			</view>

			<view class="popupChil">
				<uni-popup :show="showInfo" @change="onCloseInfo">
					<view class="showInfo-style">
						<view class="show-head-style">详细信息</view>
						<view class="show-center-style">
							<text>{{currentShowStr}}</text>
						</view>
						<view :class="'btnMy'+colorIndex">
							<button @click="onCloseInfo({show:false})">
								我知道了
							</button>
						</view>
					</view>
				</uni-popup>
			</view>

			<uni-popup :show="showMode" type="bottom" @change="onCloseMode" class="couponPopup">
				<view class="modeShowStyle">
					<view v-for="(item,index) in FinTimeInfoTwo" :key="index" class="modeShowBox" @click="clickMode(index)">
						<view :style="{color:currentIndexMode === index?colorItem:''}">{{item.label}}</view>
					</view>
				</view>
			</uni-popup>
			<div class="calendar-style" v-if="showCalendar">
				<un-calendar :start-date="currentDate" :date="calendarDate" @change="confirmDate"></un-calendar>
				<div class="calendar-revert-style" @click="calendarRevert">返回</div>
				<mpvue-picker :themeColor="colorItem" ref="mpvuePicker" mode="selector" @onConfirm="onConfirmTime"
				 :pickerValueArray="pickerValueArray"></mpvue-picker>
			</div>
			<btn-service v-if="!showCalendar" :WXSmallProgramKf="orderObj.WX_SmallProgramKf" :provider="provider" messageTitle="确认订单"
			 messagePath="''"></btn-service>
		</view>
	</div>
</template>

<script>
	import APIList from '@/api/http.js';
	import goodsBox from '@/components/goodsBox/index.vue'
	import modeChange from '@/components/modeChange/index.vue'
	import bottomSubmit from '@/components/bottomSubmit/index.vue'
	import uniPopup from '@/components_uni/uni-popup/uni-popup.vue'
	import noData from '@/components/nodeData/index.vue'
	import couponBox from '@/components/couponBox/index.vue'
	import changeAbout from '@/components/modeChange/appointment.vue'
	import mpvuePicker from '@/components_uni/mpvue-picker/mpvuePicker.vue'
	import unCalendar from '@/components_uni/uni-calendar/uni-calendar.vue'
	import btnService from '@/components/customerService/index.vue'
	import uniIcons from '@/components_uni/uni-icons/uni-icons.vue'


	import {
		weChatPayment,
		setTime,
		setDecimal,
		setModeIf,
		formatTime
	} from '@/utils/utils.js';
	const app = getApp()
	export default {
		components: {
			goodsBox,
			modeChange,
			bottomSubmit,
			uniPopup,
			noData,
			couponBox,
			changeAbout,
			mpvuePicker,
			unCalendar,
			btnService,
			uniIcons
		},
		data() {
			return {
				// 选择充值方式
				radio: app.globalData.provider === 'weixin' ? 2 : 3,
				// 总金额
				allMoney: 0,
				addNum: 0,
				// 订单数据
				orderObj: {},
				arrayList: [],
				colorItem: app.globalData.itemColor,
				cartList: [],
				// 座位号
				tableNumber: '',
				showCoupon: false,
				dataList: [],
				isOrder: true,
				showInfo: false,
				radioCoupon: '0',
				currentShowStr: '',
				// 是否选择了优惠券(钱数)
				isChangeCoupon: false,
				isChangeCouponBool: null,
				// 是否是最后一页
				currentPageLast: false,
				pageIndex: 1,
				disabledBtn: false,
				//是支付宝还是微信
				provider: app.globalData.provider,
				colorIndex: app.globalData.colorIndex,
				createOrderId: null,
				appointMentType: '',
				showTime: false,
				FinTimeInfo: [],
				pickerValueDefault: [],
				aboutTime: {
					propsAboutTime: '预约取餐',
					paramsAboutTime: ''
				},
				currentId: '', //当前选中的优惠券id
				// 是否有预约取餐
				isSubscribe: '',
				FinTimeInfoTwo: [],
				modeVal: '',
				MinAmountNew: null,
				showArea: app.globalData.isPack,
				currentArea: {},
				OrderProdAmt: 0,
				freight: '',
				showMode: false,
				currentIndexMode: null,
				// 不让重复提交点击
				determineDisabled: false,
				// 不让优惠券重复点击
				couponDisabled: false,
				showCalendar: false,
				//当前日期
				currentDate: '',
				calendarDate: '',
				// 选中的日期
				pickerDate: '',
				pickerValueArray: [],
				// 是否是拼团的进来的
				isCollage: false
			}
		},
		created() {
			this.FinTimeInfo = []
			this.currentDate = formatTime(new Date(), true)
		},
		methods: {
			setDecimalFun(val) {
				return setDecimal(val)
			},
			setAllMoney(val) {
				if (val == 0) {
					return 0.01
				} else {
					return val
				}
			},
			getObj(isOne) {
				// 只有第一次加载的时候，才加载优惠券列表
				this.$showLoads(0, '')
				var arr = setProd(this)
				var obj = {
					data: arr
				}
				obj = JSON.stringify(obj)

				let OrderSource = this.provider === 'weixin' ? 1 : 2

				let currentAreaMy = uni.getStorageSync('currentAreaMy') || {}
				Promise.all([
					APIList.api('OrderFill.aspx', {
						ProdStr: obj,
						OrderSource: OrderSource,
						AddressNo: currentAreaMy.AddressNo || ''
					}, null, null, 'POST'),
					isOne ? APIList.api('Public/Submit_ajax.aspx', {
						Type: 'GetCouponInfo',
						PageIndex: 1
					}) : '',
					isOne ? APIList.api('OrderFinTime.aspx', {
						ProdStr: obj,
					}, null, null, 'POST') : ''
				]).then(res => {
					// 优惠券
					let couponList = res[1].CouponList || []
					if (this.dataList.length === 0) {
						setTime(couponList)
						this.dataList = couponList || []
						this.currentPageLast = res[1].IsNextPage
					}
					// console.log(couponList, 'couponList')

					//商品详情
					let D = res[0] || []
					this.arrayList = D.ProdInfo
					this.arrayList.forEach(data => {
						data.num = data.Qty
						this.addNum += Number(data.Qty)
					})
					var WxFavorAmt = 0
					if (this.radio === 2) {
						if (D.PrefInfo.WxFavorAmt) {
							WxFavorAmt = Number(D.PrefInfo.WxFavorAmt)
						}
					} else if (this.radio === 3) {
						if (D.PrefInfo.AlipayFavorAmt) {
							WxFavorAmt = Number(D.PrefInfo.AlipayFavorAmt)
						}
					} else {
						if (D.PrefInfo.CardFavorAmt) {
							WxFavorAmt = Number(D.PrefInfo.CardFavorAmt)
						}
					}
					var allMoney = Number(D.OrderPayedAmt) - WxFavorAmt - this.isChangeCoupon

					this.currentArea = D.AddressInfo
					if (this.currentArea.Freight) {
						allMoney = Number(allMoney) + Number(this.currentArea.Freight)
					}
					allMoney = parseFloat(allMoney.toFixed(2))
					this.allMoney = allMoney
					this.orderObj = D
					app.globalData.minAmount = D.MinDistributionAmount || ''
					this.currentIndexMode = app.globalData.isPack - 1
					if (isOne) {
						//默认地址
						//商品总价格，用来比较起送费
						this.OrderProdAmt = D.OrderProdAmt
						//保存选中的门店的信息
						let shopLocation = {
							latitude: D.ShopInfo.Latitude || '',
							longitude: D.ShopInfo.Longitude || ''
						}
						uni.setStorageSync('shopLocation', shopLocation)
					}

					//预约时间段
					this.FinTimeInfo = res[2].FinTimeInfo || []
					if (isOne) {
						this.appointMentType = this.orderObj.WX_OrderAppointMent !== '1' ? '1' :
							this.appointMentType ? this.appointMentType : this.orderObj.OrderProdType
						this.isSubscribe = this.orderObj.WX_OrderAppointMent
					}

					this.$showLoads(1, '')
				}).catch(e => {
					console.log(e, 9999)
				})
			},
			setPackFun() {
				let a = this.orderObj.WX_LogisticsDistribution
				let b = this.orderObj.WX_OrderEatInStore
				let c = this.orderObj.WX_OrderEatPackAway

				// let a = '1'
				// let b = '1'
				// let c = '1'
				let setModeIfVal = setModeIf(a, b, c)

				if (setModeIfVal.bool) {
					if (c == '1' && this.FinTimeInfoTwo.filter(item => item['value'] === '1').length === 0) {
						this.FinTimeInfoTwo.push({
							value: '1',
							label: '打包'
						})
					}
					if (b == '1' && this.FinTimeInfoTwo.filter(item => item['value'] === '2').length === 0) {
						this.FinTimeInfoTwo.push({
							value: '2',
							label: '堂食'
						})
					}
					if (a == '1' && this.FinTimeInfoTwo.filter(item => item['value'] === '3').length === 0) {
						this.FinTimeInfoTwo.push({
							value: '3',
							label: '外卖'
						})
					}
					this.showMode = true
				}
			},
			getCouponList() {
				this.disabledBtn = true
				APIList.api('Public/Submit_ajax.aspx', {
					Type: 'GetCouponInfo',
					PageIndex: this.pageIndex
				}).then(D => {
					let couponList = D.CouponList
					this.disabledBtn = false
					this.currentPageLast = D.IsNextPage

					if (couponList.length > 0) {
						setTime(couponList)
						this.dataList = couponList || []
					} else {
						this.pageIndex = this.pageIndex - 1
					}
				}).catch(e => {
					this.disabledBtn = false
				})
			},
			clickGoodsBox(val) {
				// 点击商品详情页
				// uni.navigateTo({
				// 	url: '../goodsInfo/index?id=1'
				// })
			},
			onChange(type) {
				// 选择卡支付还是 微信支付  type === 2微信支付，type === 3支付宝支付
				if (JSON.stringify(this.orderObj.PrefInfo) !== '{}') {

					var amt = type === 2 ? this.orderObj.PrefInfo.WxFavorAmt : type === 3 ? this.orderObj.PrefInfo.AlipayFavorAmt :
						this.orderObj.PrefInfo.CardFavorAmt
					var allMoney = Number(this.orderObj.OrderPayedAmt) - Number(amt) - this.isChangeCoupon + Number(this.currentArea.Freight)
					allMoney = parseFloat(allMoney.toFixed(2))

					if (type === 1 && Number(this.orderObj.PayInfo.WX_CardBalance) < allMoney) {
						return
					}
					this.allMoney = allMoney
				}

				this.radio = type

			},
			determine() {
				if (Number(app.globalData.minAmount) > Number(this.OrderProdAmt) && app.globalData.isPack == '3') {
					uni.showToast({
						title: '未到达起送费哦,不含配送费',
						icon: 'none'
					});
					return
				}
				// 判断是否在配送范围内
				if(this.currentArea.ErrorInfo){
					uni.showToast({
						title: this.currentArea.ErrorInfo,
						icon: 'none'
					});
					return
				}
				// 结账
				if (this.provider === 'weixin' && this.orderObj.PayInfo.WX_WxPay !== '1' && this.radio == 2) {
					// 微信，不支持微信支付
					uni.showToast({
						title: '请选择付款方式',
						icon: 'none'
					});
					return
				}
				if (this.provider === 'alipay' && this.orderObj.PayInfo.WX_AlipayPay !== '1' && this.radio == 3) {
					// 支付宝，不支持支付宝支付
					uni.showToast({
						title: '请选择付款方式',
						icon: 'none'
					});
					return
				}
				if (this.orderObj.PayInfo.WX_CardBalance < this.allMoney && this.radio === 1) {
					uni.showToast({
						title: '请选择付款方式',
						icon: 'none'
					});
					return
				}
				if (this.determineDisabled) {
					return
				}
				this.determineDisabled = true
				if (!this.createOrderId) {
					this.createOrderFun().then(data => {
						if (this.provider === 'weixin') {
							this.subscribeMessage()
						} else {
							this.createPayment()
						}
					})
				} else {
					// 已经生成订单
					if (this.provider === 'weixin') {
						this.subscribeMessage()
					} else {
						this.createPayment()
					}
				}
			},
			subscribeMessage() {
				let that = this
				try {
					if (that.tempMessageID != "") {
						let tempMessageID = that.tempMessageID.split(',')

						// console.log(tempMessageID,'tempMessageID')
						wx.requestSubscribeMessage({
							tmplIds: tempMessageID,
							success: function(res) {
								that.createPayment()
							},
							fail: function(res) {
								setTimeout(function() {
									that.createPayment()
								}, 1000)
							}
						})
					} else {
						that.createPayment()
					}
				} catch (e) {
					setTimeout(function() {
						that.createPayment()
					}, 1000)
				}
			},
			createPayment() {
				// 清空购物车，已经生成订单就得清空购物车
				uni.setStorageSync('cartList', [])
				if (this.radio == 1) {
					//跳到卡支付页面
					this.determineDisabled = false
					uni.redirectTo({
						url: '../cardPayment/index?id=' + this.createOrderId
					})
				} else {
					var _url = this.provider === 'weixin' ? '/Public/WxPay/WxPay.aspx' : '/Public/AliPay/AliPay.aspx'
					APIList.api(_url, {
						OrderID: this.createOrderId
					}).then(data => {
						//发起微信支付请求
						weChatPayment(app, this.createOrderId, data)
						this.determineDisabled = false
					}).catch(e => {
						// console.log(e,'2333ee')
						this.determineDisabled = false
					})
				}
			},
			createOrderFun() {
				return new Promise((resolve, reject) => {
					if (Number(this.appointMentType) === 2 && !this.aboutTime.paramsAboutTime) { //预约取餐
						uni.showToast({
							title: '请选择预约时间',
							icon: 'none'
						});
						this.determineDisabled = false
						return
					}
					var arr = setProd(this)
					var objProd = {
						data: arr
					}
					objProd = JSON.stringify(objProd)
					let OrderSource = this.provider === 'weixin' ? 1 : 2
					var obj = {
						ProdStr: objProd,
						OrderSource: OrderSource,
						MemoStr: this.inputValue || '',
						PrefNo: (this.radio == 1 ? this.orderObj.PrefInfo.CardPrefNo : this.provider === 'weixin' ? this.orderObj.PrefInfo
							.WxPrefNo : this.orderObj.PrefInfo.AlipayPrefNo) || '',
						PayType: this.radio == 1 ? 1 : 2,
						CodeNo: this.radioCoupon || '',
						CodePayed: this.isChangeCoupon || 0,
						AppointMentType: this.appointMentType,
						FinTime: Number(this.appointMentType) === 1 ? '' : this.aboutTime.paramsAboutTime,
						AddressNo: app.globalData.isPack == 3 ? this.currentArea.AddressNo : ''
					}
					if (!this.radioCoupon || this.radioCoupon == 0) {
						// 没有选择优惠券
						delete obj.CodeNo
						delete obj.CodePayed
					}
					// console.log(JSON.stringify(obj), 'obj333')
					// return
					this.$showLoads(0, '') //加载
					APIList.api('OrderSubmit.aspx', obj, null, null, 'POST').then(D => {
						this.$showLoads(1, '')
						this.createOrderId = D.OrderID
						this.tempMessageID = D.TempMessageID || ''
						this.determineDisabled = false
						resolve()
					}).catch(e => {
						uni.showToast({
							title: e,
							icon: 'none'
						});
						this.determineDisabled = false
						reject()
					})
				})
			},
			routerBindCard() {
				uni.navigateTo({
					url: '../../indexVip/cardBind/index?order=' + true
				})
			},
			changeMode(e) {
				// 点击预约取餐
				if (e === 2) {
					this.showCalendar = true
					this.calendarDate = this.aboutTime.pickerDate
				}
				this.appointMentType = e
			},
			getTimeList(val) {
				this.$showLoads(0, '')
				var arr = setProd(this)
				var obj = {
					data: arr
				}
				obj = JSON.stringify(obj)
				APIList.api('OrderFinTime.aspx', {
					ProdStr: obj,
					FinDate: val
				}, null, null, 'POST').then(D => {
					let timeArr = D.FinTimeInfo[0].Time
					timeArr.forEach((D, index) => {
						timeArr[index] = {
							label: D,
							value: D
						}
					})
					this.FinTimeInfo.push(D.FinTimeInfo[0])
					this.pickerValueArray = timeArr
					this.$showLoads(1, '')
				}).catch(e => {})
			},
			bindKeyInput(e) {
				this.inputValue = e.detail.value
			},
			changeCoupon() {
				// 选择优惠券
				if (this.dataList.length > 0) {
					this.showCoupon = true
				}
			},
			onCloseCoupon(bool) {
				if (!bool.show) {
					this.showCoupon = false
				}
			},
			onCloseMode(bool) {
				if (!bool.show) {
					this.showMode = false
				}
			},
			clickMode(index) {
				this.showMode = false
				// 2就餐 ；1打包
				let val = Number(index) + 1
				if (val) {
					app.globalData.isPack = val
					this.modeVal = val == '1' ? '打包' : val == '2' ? '堂食' : '外卖'
				}
				this.getObj()
			},
			onClickCoupon(e) {
				// 选择优惠券
				if (!e) {
					this.showCoupon = false
					this.allMoney = this.allMoney + this.isChangeCoupon //还原钱数
					this.allMoney = parseFloat(this.allMoney.toFixed(2))
					this.radioCoupon = 0
					this.isChangeCoupon = 0
					return
				}
				if (this.couponDisabled) {
					return
				}
				this.couponDisabled = true
				this.radioCoupon = e
				this.judgeCanUser(e)
			},
			onClicknoCoupon() {},
			judgeCanUser(radioId) {
				var orderObj = this.orderObj
				var arr = setProd(this)
				var objProd = {
					data: arr
				}
				objProd = JSON.stringify(objProd)
				var obj = {
					ProdStr: objProd,
					CodeNo: radioId
				}

				APIList.api('CouponUseChk.aspx', obj, null, null, 'POST').then(D => {
					this.allMoney = this.allMoney + this.isChangeCoupon
					var allMoney = 0

					allMoney = this.allMoney - Number(D.CodePayed)

					allMoney = parseFloat(allMoney.toFixed(2))
					this.showCoupon = false

					this.isChangeCoupon = Number(D.CodePayed)
					this.isChangeCouponBool = D.CodePayed
					if (Number(allMoney) <= 0) {
						allMoney = 0.01
					}
					this.allMoney = allMoney
					this.currentId = D.CodeNo
					this.couponDisabled = false
					// 说明此券可以使用
				}).catch(e => {
					this.couponDisabled = false
				})
			},
			onCloseInfo(bool) {
				if (!bool.show) {
					this.showInfo = false
				}
			},
			viewMore(str) {
				this.showInfo = true
				// str = str.replace(/~/g, '\n')
				this.currentShowStr = str
			},
			clickPage(e) {
				if (this.disabledBtn) {
					return
				}
				// console.log(e, 'e')
				if (e == 1) {
					if (this.pageIndex > 1) {
						this.pageIndex--
						this.getCouponList()

					} else {
						uni.showToast({
							title: "这是第一页",
							icon: 'none'
						});
					}

				} else {
					if (Number(this.currentPageLast) === 0) {
						uni.showToast({
							title: "这是最后一页",
							icon: 'none'
						});
					} else {
						this.pageIndex++
						this.getCouponList()
					}
				}
			},
			onConfirmTime(val) {
				this.showCalendar = false
				let labelArr = val.label.split('-')
				this.aboutTime = {
					propsAboutTime: this.pickerDate + ' ' + val.label,
					paramsAboutTime: this.pickerDate + ' ' + labelArr[0] + ':00',
					pickerDate: this.pickerDate
				}
				this.calendarDate = this.pickerDate
			},
			onConfirmTimeTwo() {

			},
			ShopPhone() {
				uni.makePhoneCall({
					phoneNumber: this.orderObj.ShopInfo.ShopTel
				});
			},
			changeArea() {
				uni.navigateTo({
					url: '/pages/indexCanteen/areaList/areaList?OptType=1'
				})
			},
			confirmDate(val) {
				this.pickerDate = val.fulldate
				let arr = this.FinTimeInfo.filter(D => {
					return D.Date === val.fulldate
				})
				if (arr.length > 0) {
					this.pickerValueArray = arr[0].Time
					this.pickerValueArray.forEach((D, index) => {
						if (this.pickerValueArray[index].hasOwnProperty('label')) {
							return
						}
						this.pickerValueArray[index] = {
							label: D,
							value: D
						}
					})
				} else {
					this.pickerValueArray = []
					this.getTimeList(val.fulldate)
				}
				this.$refs.mpvuePicker.show()
			},
			calendarRevert() {
				this.showCalendar = false
			}
		},
		onLoad(option) {
			// 拼团
			this.isCollage = option.isCollage || false
			uni.removeStorageSync('currentAreaMy')
		},
		onShow: function() {
			if (!app.globalData.isPack) {
				console.log('订单消失')
				uni.redirectTo({
					url: '/pages/indexCanteen/index'
				})
			}

			if (this.createOrderId) {
				//是否生成了订单(是微信的时候，如果生成了订单，跳到详情页面)
				return
			}

			let isPack = app.globalData.isPack
			this.modeVal = isPack == '1' ? '打包' : isPack == '2' ? '堂食' : '外卖'

			if (this.isCollage) {
				this.cartList = uni.getStorageSync("listCollage")
				setTimeout(() => {
					uni.removeStorageSync('listCollage');
				}, 300)
			} else {
				this.cartList = uni.getStorageSync("cartList")
			}
			if (this.cartList.length > 0) {
				//去除num为0的，不可以提交到订单页面
				this.cartList.forEach((D, index) => {
					if (D.num === 0) {
						this.cartList.splice(index, 1)
					}
				})
			}
			this.tableNumber = app.globalData.tableNumber
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getObj(true)
					this.provider = app.globalData.provider
				})
			} else {
				this.getObj(true)
				this.provider = app.globalData.provider
			}
		},
		watch: {}
	}

	function setProd(_this) {
		var arr = _this.cartList.slice()
		_this.addNum = 0
		for (var i = 0; i < arr.length; i++) {
			var Data = arr[i]
			Data.prodQty = Data.num
			Data.prodTast = Data.recordFlavor ? (Data.recordFlavor).join(',') : ''
			var strParts = []
			delete Data.ProdImg
			delete Data.FeaturesHtmlInfo
			delete Data.CarouselImgInfo
		}

		return arr
	}

	// 跳转到商品详情页
	// function jumpFun(Mag, time = 2000) {
	// 	setTimeout(() => {
	// 		uni.redirectTo({
	// 			url: '../../indexOrder/orderInfo/index?id=' + Mag
	// 		})
	// 	}, time)
	// }
</script>

<style lang="scss">
	@import '../../../components/couponBox/couponInfo.css';

	.offeredTop {
		display: flex;
		height: 80px;
		align-items: center;
		justify-content: center;
		font-size: 7pt;

		.offeredTopDiv {
			display: inline-block;
			flex: 1;
			text-align: center;
		}

		.offeredTopImg {
			width: 26px;
			height: 26px;
			margin-left: 50%;
			transform: translateX(-50%);

			image {
				width: 100%;
				height: 100%;
			}
		}

		.offeredTopIcon {
			width: 50rpx;
		}
	}

	.payment-style {
		background: #FFFFFF;
		min-height: 100vh;
		position: relative;

		.customer-service-style {
			// top: 0;
			right: 50px;
			// z-index: 5;
		}

		.calendar-style {
			position: absolute;
			top: 0;
			width: 100%;
			min-height: 100vh;
			z-index: 3;
			background: #fff;
			padding-bottom: 41px;

			.calendar-revert-style {
				position: absolute;
				z-index: 4;
				top: 14px;
				left: 14px;
				font-size: 14px;
			}
		}

		.setPack {
			padding: 10px 10px;
			border-bottom: 1px solid #eee;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-size: 9pt;
			line-height: 17px;

			.setPackArea {
				flex: 1;

			}

			.setPackAreaLocation {
				font-size: 10pt;
				margin-right: 8px;
			}

			.setPackButton {}
		}

		.pack-is-style {
			padding: 6px 6px 6px 0;
			border: 1px solid #D82F37;
			width: 115px;
			height: 16px;
			display: flex;
			background: #f6f6f6;
			align-items: center;
			justify-content: center;
			border-radius: 10px;
			font-size: 14px;
			color: #D82F37;
			position: relative;
			overflow: hidden;
			float: right;

			image {
				width: 25px !important;
				height: 25px !important;
			}

			.changeTopIcon {
				right: 0px;
				position: absolute;
				width: 26px;
				height: 26px;
				bottom: 0;
			}
		}

		.orderTable {
			padding: 5px;
			color: #707070;
			border-top: 4px solid #eee;
			border-bottom: 1px dashed #eee;
			font-size: 13pt;
		}

		.orderTableShop {

			// margin-top: 7px;
			.tableNumberStyle {}

			.iconshop {
				text-align: right;
				margin-right: 6px;
				width: 22px;
				display: inline-block;
			}

			.orderTableShopRight {
				float: right;
			}

			.iconShopPhone {
				font-size: 21px;
				margin-right: 5px;
				color: #D82F37;
			}
		}

		.popupFa {
			.uni-popup__wrapper-box {
				background: #fff;
			}
		}

		.uni-popup {
			z-index: 20;
		}

		.uni-popup__wrapper-box {
			padding: 0 !important;
		}

		.conponStyle {
			display: inline-block;
			padding: 10px 10px;
			border-top: 8px solid #f5f5f5;
			border-bottom: 8px solid #f5f5f5;
			width: 100%;
		}

		.iconMy {
			display: inline-block;
			vertical-align: middle;
			color: rgb(211, 207, 207);
			font-size: 20px;
		}

		.noCoupon {
			margin-left: 10px;
			display: inline-block;
			line-height: 0;
			font-size: 14px;
		}

		.RemarksFa {
			display: flex;
			margin: 10px 0 0;
		}

		.Remarks {
			display: inline-block;
			vertical-align: middle;
			font-size: 14px;
			margin: auto;
			// line-height: 25px;
		}

		input {
			padding: 0;
		}

		.inputRemarks {
			display: inline-block;
			vertical-align: middle;
			font-size: 14px;
			flex: 1;
			margin: 0 10px;
		}

		.summary {
			font-size: 14px;
			padding: 10px;
			border-top: 8px solid #f5f5f5;
			border-bottom: 8px solid #f5f5f5;
		}

		.summaryMoney {
			display: inline-block;
			line-height: 26px;
		}

		.summaryNum {
			float: right;
		}

		.summaryNumClick {
			float: right;
			color: #777;
			vertical-align: middle;
			font-size: 12px;
			line-height: 26px;
		}

		.value-class {
			padding: 8px;
			font-size: 10pt;


		}

		/* 	.title-class {
		padding: 8px
	*/
		.wechat {
			width: 18px;
			height: 18px;
			margin-right: 8px;
			display: inline-block;
			font-size: 18px;
			vertical-align: middle;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.gold-coin {
			color: #fdcc63;
			vertical-align: middle;
			margin-right: 8px;
			display: inline-block;
			font-size: 20px;
		}

		.orderBottom {
			padding-bottom: 60px;
		}

		.button-class {
			background: #ffa006;
		}

		.custom-popup {
			margin-left: -1px;
		}



		.no-payCard-style {
			vertical-align: top;
			margin-right: 10px;
		}

		.custom-class-button {
			min-width: 80px !important;
			background: #fdcc63 !important;
			color: #fff !important;
			border: 1px solid #fdcc63 !important;
		}

		.takeout-page {
			color: #ffa006;
			vertical-align: middle;
			margin: 0px 0 5px;
			display: flex;
			justify-content: flex-end;
		}

		.takeout-page-left,
		.takeout-page-right {
			display: inline-block;
		}

		.page-number {
			margin: 0 8px;
			font-size: 10pt;
			line-height: 26px;
		}

		.custom-class-left,
		.custom-class-right {
			font-size: 12px;
			padding-left: 7px;
			padding-right: 11px;
			line-height: 26px;
			height: 26px;
			background: #ffa006;
			color: #fff;

		}

		.custom-class-right {
			padding-left: 11px;
			padding-right: 7px;
			margin-right: 10px;
		}

		.modeShowStyle {
			background: #fff;
			padding: 10px;
			text-align: center;

			.modeShowBox {
				margin: 16px;
			}
		}
	}
</style>
