<template>
	<div class="line-goods-style">
		<div class="line-goods__box">
			<div class="goodBoxInfo" v-for="(item,index) in propsData.HtmlInfo" :key="index" @click="lineGoodsfun(item.LinkUrl)">
				<div>
					<image :src="item.ProdImg" mode="" :style="{'height':setHeight,'width':setHeight}"></image>
				</div>
				<div class="oneBoxTitle">{{item.ProdName}}</div>
				<div class="oneBoxMoney">
					¥{{item.SalePrice}}
					<i class="icon stepperStyle fontColor">&#xe616;</i>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import uniIcons from "@/components_uni/uni-icons/uni-icons.vue"
	const app = getApp()
	export default {
		props: {
			propsData: {
				type: Object,
				default () {
					return {
						HtmlInfo: []
					}
				}
			}
		},
		components: {
			uniIcons
		},
		data() {
			return {
				setHeight: ''
			}
		},
		created() {
			this.setHeight = (uni.getSystemInfoSync().windowWidth - 30) / 2 + "px"
		},
		methods: {
			lineGoodsfun(LinkUrl) {
				uni.navigateTo({
					url: LinkUrl
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.line-goods-style {
		padding:5px 10px;
		padding-bottom: 0px;

		.stepperStyle {
			display: inline-block;
			float: right;
			font-size: 23px;

		}

		.line-goods__box {
			display: flex;
			flex-wrap: wrap;

			.goodBoxInfo:nth-of-type(2n) {
				margin-left: 10px;
			}

			.goodBoxInfo {
				border-radius: 8px;
				overflow: hidden;
				margin-bottom: 5px;
				background: #ffffff;
				box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.1);
			}

			.oneBoxTitle {
				color: #313131;
				font-size: 14px;
				height: 19px;
				overflow: hidden;
				margin: 8px;
			}

			.oneBoxMoney {
				margin: 8px;
				padding-bottom: 10px;
				color: #e64b2b;
				padding: 0;
				font-size: 9pt;
				line-height: 25px;
			}
		}
	}
</style>
