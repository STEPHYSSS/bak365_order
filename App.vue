<script>
	import {
		cutUrl
	} from '@/utils/utils.js'
	export default {
		onLaunch: function(options) {
			if (options.query && options.query.qrCode) {
				let qrCode = options.query.qrCode;
				let cutUrlStr = cutUrl(qrCode)
				this.globalData.isScanEnter = cutUrlStr
			}
			var extConfig = {}
			let _this = this
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					let providerNew = res.provider[0]
					if (providerNew === 'alipay') {
						extConfig = my.getExtConfigSync();
					} else {
						// extConfig = wx.getExtConfigSync();
						extConfig = {
							appID:"wx5349c5e963833f38"
						}
					}
					if (extConfig) {
						if (extConfig.appID) {
							_this.globalData.appID = extConfig.appID //'2019091067148132' //支付宝//'wx5349c5e963833f38'
							// _this.globalData.appID = '2019091067148132'							
						}
					}
				}
			})
		},
		onShow: function() {},
		onHide: function() {},
		globalData: {
			appID: '',
			OpenID: 'wx57154514',
			// requestUrl: 'https://we.bak365.net/SmallProgramSaleTest/Mobile/',
			requestUrl: 'https://we.bak365.net/SmallProgramSaleOrder/Mobile/',
			itemColor: "#D82F37",
			tableNumber: '',
			shopNo: '7701', //7701 //0803
			isPack: '1',
			// 当前颜色用序号来控制 1 代表什么颜色，2代表什么颜色，以此类推
			colorIndex: '1',
			colorIndexTwo: '2',
			isDraw: false, //是否领取了优惠券,
			provider: '', //是支付宝还是微信,
			isScanEnter: false //是否是扫码进来的
		}
	}
</script>

<style lang="scss">
	@import "/static/css/theme.scss";
	@import "/components_uni/colorui/button.css";
	// @import "/components_uni/colorui/icon.css";
	@import "/components_uni/gaoyia-parse/parse.css";

	@font-face {
		font-family: 'iconfont';
		/* project id 1476548 */
		src: url('https://at.alicdn.com/t/font_1476548_6dzy1ezpkld.eot');
		src: url('https://at.alicdn.com/t/font_1476548_6dzy1ezpkld.eot?#iefix') format('embedded-opentype'),
			url('https://at.alicdn.com/t/font_1476548_6dzy1ezpkld.woff2') format('woff2'),
			url('https://at.alicdn.com/t/font_1476548_6dzy1ezpkld.woff') format('woff'),
			url('https://at.alicdn.com/t/font_1476548_6dzy1ezpkld.ttf') format('truetype'),
			url('https://at.alicdn.com/t/font_1476548_6dzy1ezpkld.svg#iconfont') format('svg');
	}

	radio {
		transform: scale(0.8);
	}

	.fontColor {
		color: #D82F37;
	}

	.my-default-btn {
		display: inline-block;
		position: static;

		button {
			padding: 0px 10px;
			border-radius: 10em;
			display: inline-block;
			border: 1px solid #707070;
			height: 26px;
			line-height: 25px;
			font-size: 9pt;
			background-color: #fff;
			border-color: #707070;
			color: #707070;
			box-sizing: inherit;
		}
	}

	.customer-service-style {
		font-size: 25px;
		border-radius: 50%;
		right: 25px;
		position: fixed;
		bottom: 10%;
		width: 38px;
		height: 38px;
		text-align: center;
		line-height: 38px;
		box-shadow: 0 0 5px;
		background: rgba(255, 255, 255, 0.5);
	}

	button::after {
		border: none;
	}

	.icon {
		font-family: iconfont;
	}

	.theme1 {
		@include wd()
	}

	.theme2 {
		@include wd(#FFEC8B)
	}

	.btnMy1 {
		@include btn()
	}

	.btnMy2 {
		@include btn(#b5c7c8)
	}

	.clearfix {
		zoom: 1;
	}

	.clearfix:after {
		content: "";
		display: table;
		clear: both;
	}
</style>
