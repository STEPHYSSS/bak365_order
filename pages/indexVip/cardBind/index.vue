<template>
	<view style="position: relative;">
		<view style="text-align: center;">
			<image class="imgStyle" src="/static/images/icon/shouq.png"></image>
		</view>
		<view class="btnSubmit">
			<view v-if="isCardType==='2'||objShowBtn.WX_CardBind==='1'" style="padding:10px 10px;margin-top:25px;display: inline-block;width: 50%;"
			 :class="'btnMy'+colorIndex" @click="getPhoneClick('2')">
				<button @click="newPhoneNum('2')" v-if="userPhone">绑定会员卡</button>
				<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)" v-else>绑定会员卡</button>
			</view>

			<view v-if="isCardType==='1'||objShowBtn.WX_CardApply==='1'" style="padding:10px 10px;margin-top:10px;display: inline-block;width: 50%;"
			 :class="'btnMy'+colorIndex" @click="getPhoneClick('1')">
				<button @click="newPhoneNum('1')" v-if="userPhone">申请会员卡</button>
				<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)" v-else>申请会员卡</button>
			</view>
		</view>
		<uni-popup :show="showCard" @change="onClone">
			<view style="background: #FFFFFF;">
				<radio-group @change="onChange" class="radio-group">
					<label v-for="(item,index) in list" :key="index" class="custom-class" :style="{backgroundImage:'url('+require('../../../static/images/icon/backCard.png')+')'}">
						<view style="display: inline-block;">
							<radio style="display: inline-block;" :value="item.CardNo" :checked="item.CardNo==result" class="label-class"
							 color="#8dc73f">
							</radio>
						</view>
						<view class="checkBox">
							<view>卡号: {{item.CardNo}}</view>
							<view>余额: {{item.CardBalance}}</view>
							<view>积分: {{item.CardScore}}</view>
						</view>
					</label>
				</radio-group>
				<radio-group v-if="hasPassword!=='1'">
					<view style="font-size: 11pt;padding: 0 10px 10px 15px;display: flex;">
						<label for="" style="vertical-align: middle;margin-top:4px;min-width: 45px;">卡密码</label>
						<input class="code-input-style" placeholder="请输入卡密码" @input="onChangePass" password />
					</view>
				</radio-group>
				<view class="sureBtn" @click="submitBtn" :style="{'color':colorItem}">
					<text>确定</text>
				</view>
			</view>
		</uni-popup>

		<div v-if="showCardApply" style="background: #FFFFFF;width:100%;height:100%;position: absolute;top:0">
			<!-- <view class="my-cell-item">
				<view :class="{'my-cell-item-label':true}">
					姓名
				</view>
				<view class="my-cell-item-val">
					<input v-model="form.Name" type="text" placeholder="姓名" placeholder-style="color:#C8C8C8">
				</view>
			</view> -->
			<view class="my-cell-item" v-if="hasPassword!=='1'">
				<view :class="{'my-cell-item-label':true}">
					密码
				</view>
				<view class="my-cell-item-val">
					<input v-model="form.Pass" type="text" placeholder="密码" placeholder-style="color:#C8C8C8" password>
				</view>
			</view>
		<!-- 	<view class="my-cell-item">
				<view :class="{'my-cell-item-label':true}">
					生日
				</view>
				<view class="my-cell-item-val">
					<date-picker :defaultValue="currentBirthDay" :endDate="currentBirthDay" @onConfirm="onConfirmDate">
						<input v-model="form.BirthDay" type="text" :disabled="true" placeholder="选择出生日期" placeholder-style="color:#C8C8C8">
					</date-picker>
				</view>
			</view> -->
			<!-- <view class="my-cell-item" @click="clickSex">
				<view :class="{'my-cell-item-label':true}">
					性别
				</view>
				<view class="my-cell-item-val">
					<input v-model="form.SexName" type="text" :disabled="true" placeholder="选择性别" placeholder-style="color:#C8C8C8">
				</view>
			</view> -->
			<view style="margin: 70px 20px" :class="'btnMy'+colorIndex">
				<button size="large" @click="addAreaFun" :disabled="disabledBtn">保存</button>
			</view>
		</div>
	</view>
</template>

<script>
	import APIList from '@/api/http.js'
	import uniPopup from '@/components_uni/uni-popup/uni-popup.vue'
	import datePicker from '@/components_uni/gpp-datePicker/gpp-datePicker.vue'
	var utils = require('@/utils/utils.js')
	let app = getApp()
	export default {
		components: {
			uniPopup,
			datePicker
		},
		data() {
			return {
				userPhone: '',
				showCard: false,
				showCardApply: false,
				result: '',
				list: [],
				// 是否填卡密码
				hasPassword: false,
				// 卡密码
				password: '',
				// 是否是订单页面跳进来的
				isOrder: false,
				colorIndex: getApp().globalData.colorIndex,
				colorItem: getApp().globalData.itemColor,
				// 1,申请卡;2绑定卡
				isCardType: null,
				form: {
					// BirthDay: '',
					// Sex: '1',
					// SexName: '男'
				},
				currentBirthDay: '',
				listSex: [{
						label: '男',
						value: '1'
					},
					{
						label: '女',
						value: '2'
					}
				],
				disabledBtn: false,
				objShowBtn: {
					WX_CardBind: '',
					WX_CardApply: ''
				}
			}
		},
		onLoad: function(option) {
			this.hasPassword = option.isPassword
			this.isOrder = option.order || false
			//2绑定；1申请
			this.isCardType = option.isCardType

			this.currentBirthDay = utils.formatTime(new Date(), true)

			if (this.isOrder) {
				this.getInfo()
			}
		},
		onShow: function() {
			if (!app.globalData.openID) {
				this.$store.dispatch('Login')
			}
			if (app.globalData.provider === 'alipay') { //有手机号默认值
				let extConfig = my.getExtConfigSync();
				if (extConfig && extConfig.mobile) {
					this.userPhone = extConfig.mobile
				}
			}
		},
		methods: {
			getInfo() {
				this.$showLoads(0, '')
				APIList.api('CardBind.aspx').then(D => {
					// console.log(D, 777)
					this.$showLoads(1, '')
					// this.userPhone = D.Mobile
					this.hasPassword = D.WX_CardPayNotPass
					this.objShowBtn = D
				}).catch(e => {})
			},
			getPhoneClick(val){
				if (val) {
					this.isCardType = val
				}
			},
			getPhoneNumber(e, val) {
				var encryptedData = ''
				var iv = ''
				var url = ''
			
				if (app.globalData.provider === 'alipay') {
					url = "Alipay/GetPhoneMobile.aspx"
					my.getPhoneNumber({
						success: (res) => {
							encryptedData = res.response
							this.getEncryptedData(url, '', encryptedData)
						},
						fail: (err) => {
							uni.showToast({
								title: "您已取消授权，无法获取手机号会导致无法使用微卡",
								icon: 'none'
							});
							return
						}
					});
				} else {
					url = 'GetPhoneMobile.aspx'
					iv = e.detail.iv
					encryptedData = e.detail.encryptedData
					if (!iv || !encryptedData) {
						uni.showToast({
							title: "您已取消授权，无法获取手机号会导致无法申请微卡",
							icon: 'none'
						});
						return
					}

					iv = iv.replace(/\+/g, "~");
					encryptedData = encryptedData.replace(/\+/g, "~");
					this.getEncryptedData(url, iv, encryptedData)
				}

			},
			newPhoneNum(val) {
				// 有默认电话
				if (val) {
					this.isCardType = val
				}
				if (this.isCardType === '2') {
					this.getCardList()
				} else {
					this.getApplyCard()
				}
			},
			getEncryptedData(url, iv, encryptedData) {

				this.$showLoads(0, '')
				APIList.api(url, {
					IV: iv || '',
					EncryptedData: encryptedData
				}).then(D => {
					this.userPhone = D.Msg
					this.$showLoads(1, '')
					if (this.isCardType === '2') {
						this.getCardList()
					} else {
						this.getApplyCard()
					}
				}).catch(e => {})
			},
			getApplyCard() {
				// this.$showLoads(0, '')
				// this.userPhone
				// this.showCardApply = true
				if (this.hasPassword === '1') {
					this.addAreaFun()
				} else {
					this.showCardApply = true
				}
			},
			getCardList() {
				// 获取会员卡列表
				APIList.api('Public/Submit_ajax.aspx', {
					Type: 'GetCardList',
					Mobile: this.userPhone
				}).then(D => {
					this.list = D.CardList
					this.result = D.CardList[0].CardNo
					this.showCard = true
					this.$showLoads(1, '')
				}).catch(e => {})
			},
			addAreaFun() {
				// 申请卡提交
				if (this.hasPassword !== '1' && !this.form.Pass) {
					uni.showToast({
						title: "请输入卡密码",
						icon: 'none'
					});
					return
				}
				// if (!this.form.Name) {
				// 	uni.showToast({
				// 		title: "请输入姓名",
				// 		icon: 'none'
				// 	});
				// 	return
				// }
				// if (!this.form.BirthDay) {
				// 	uni.showToast({
				// 		title: "请选择生日",
				// 		icon: 'none'
				// 	});
				// 	return
				// }
				let obj = this.form
				obj.Mobile = this.userPhone
				obj.BindSource = app.globalData.provider === 'alipay' ? '2' : '1'
				Object.assign(obj, {
					Type: 'CardApply'
				})

				this.disabledBtn = true
				APIList.api('Public/Submit_ajax.aspx', obj).then(D => {
					uni.showToast({
						title: D.Msg,
						icon: 'none'
					});
					// this.disabledBtn = false
					setTimeout(() => {
						if (this.isOrder) {
							uni.navigateBack({
								delta: 1
							})
						} else {
							uni.switchTab({
								url: "/pages/indexVip/index"
							})
						}
					}, 1000)
				}).catch(e => {
					this.disabledBtn = false
				})
			},
			submitBtn() {
				if (this.disabledBtn) {
					return
				}
				// 绑定卡提交
				if (this.hasPassword !== '1' && !this.password) {
					uni.showToast({
						title: "请输入卡密码",
						icon: 'none'
					});
					return
				}
				let BindSource = app.globalData.provider === 'alipay' ? '2' : '1'
				this.disabledBtn = true
				APIList.api('Public/Submit_ajax.aspx', {
					Type: 'CardBind',
					Mobile: this.userPhone,
					CardNo: this.result,
					Pass: this.password,
					BindSource: BindSource
				}).then(D => {
					uni.showToast({
						title: D.Msg,
						icon: 'none'
					});
					setTimeout(() => {
						if (this.isOrder) {
							uni.navigateBack({
								delta: 1
							})
						} else {
							uni.switchTab({
								url: "/pages/indexVip/index"
							})
						}
					}, 1000)

				}).catch(e => {
					this.disabledBtn = false
				})
			},
			onChange(e) {
				this.result = e.detail.value

			},
			onChangePass(e) {
				this.password = e.detail.value
			},
			onClone(e) {
				if (!e.show) {
					this.showCard = false
				}
			},
			onConfirmDate(val) {
				this.form.BirthDay = val.dateValue
			},
			clickSex() {
			}
		}
	}
</script>

<style scoped lang="scss">
	input {
		line-height: 1.6rem;
	}

	.btnSubmit {
		text-align: center;
		margin-top: 20px;
	}

	.imgStyle {
		margin-top: 40%;
		width: 200px;
		height: 150px;
	}

	.checkBox {
		display: inline-block;
		margin: 14px 0;
	}

	.btnClass {
		border-radius: 10px;
		margin: 0 30px;
		background: #0AB807;
		color: #fff;
	}

	.van-radio__icon-wrap {
		display: flex;
		align-items: center;
	}

	.custom-class {
		color: #fff;
		display: block;
		/* width:100%; */
		border: 1px solid #eee;
		/* padding: 15px; */
		margin: 10px 15px;
		border-radius: 15px;
		background: rgba(48, 98, 165, 0.7);
		position: relative;
		padding-left: 42px;
		background-size: 100% 100%;
	}

	label {
		line-height: 1.3;
	}

	.label-class {
		/* padding: 15px; */
		color: #fff;
		border: none;
		/* margin-bottom: 16px; */
		position: absolute;
		top: 30px;
		left: 10px;
	}

	.radio-group {
		background: #FFFFFF;
		height: 310px;
		overflow-y: scroll;
		font-size: 12pt;
	}

	.sureBtn {
		font-size: 10pt;
		text-align: center;
		padding: 12px;
		border-top: 1px solid #eee;
	}

	.code-input-style {
		display: inline-block;
		background: transparent;
		vertical-align: middle;
		margin-left: 25px;
	}

	.my-cell-item {
		display: flex;
		padding: 10px;
		font-size: 10pt;
		align-items: center;
		border-bottom: 1px solid #eee;

		.my-cell-item-label {
			width: 60px;
		}

		.my-cell-item-val {
			flex: 1;
		}
	}
</style>
