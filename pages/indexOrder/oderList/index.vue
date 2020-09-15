<template>
	<view class="order-list-style">
		<view :class="['orderStyle','theme'+colorNum]" v-if="dataList.length > 0">
			<view class="orderBox" v-for="(item,index) in dataList" :key="index" @click="clickInfoStore(item)">
				<view class="orderTime">
					<!-- <van-icon name="shop-o" class="orderTimeIcon" />{{item.PreTime}} -->
					<view class="my-tag" style="display: inline-block;">
						<uni-tag type="danger" :inverted="true" :text="item.FinType" size="small"></uni-tag>
					</view>
					<text class="ShopNo-Name">{{item.ShopNo}}</text>
					<view class="statusOrder">{{item.StatusName}}</view>
				</view>
				<view class="orderTitle">
					<!-- <image class="order-img" src="{{item.NameImg?item.NameImg:'../../images/icon/noImg.png'}}" binderror="imgError" data-index="{{index}}"></image> -->
					<text class="orderTitle-info">{{item.NameInfo}}等</text>
					<text v-if="item.ProdCount>0">共 {{item.ProdCount || 0}} 件商品</text>

					<view class="orderNum">
						¥{{item.PayedAmt}}
					</view>
				</view>
				<view class="pre-time">
					{{item.PreTime}}
				</view>
			</view>
		</view>
		<node-data v-if="dataList.length === 0"></node-data>

		<!-- <bottom-nav :current="1"></bottom-nav> -->
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	import uniTag from '@/components_uni/uni-tag/uni-tag.vue'
	import nodeData from '@/components/nodeData/index.vue'
	// import bottomNav from '@/components/bottomNav/index.vue'
	const app = getApp()
	var pageIndex = 1;
	export default {
		components: {
			uniTag,
			nodeData
			// bottomNav
		},
		data() {
			return {
				dataList: [],
				allList: [],
				currentList: [],
				colorNum: app.globalData.colorIndex
			}
		},
		methods: {
			getList() {
				this.$showLoads(0)
				APIList.api('OrderList.aspx', {
					PageIndex: pageIndex
				}).then(D => {
					this.$showLoads(1)

					if (pageIndex > 1) {
						this.dataList = this.dataList.concat(D.OrderList)
					} else {
						this.dataList = D.OrderList
					}
					if (D.OrderList.length > 0) {
						pageIndex++;
					}

					this.dataList = this.dataList
					uni.stopPullDownRefresh() //停止下拉刷新
					uni.hideNavigationBarLoading() //隐藏导航条加载动画  
				}).catch(e => {
					uni.stopPullDownRefresh() //停止下拉刷新
					uni.hideNavigationBarLoading() //隐藏导航条加载动画  
				})
			},
			clickInfoStore(e) {
				// 门店订单详情
				uni.navigateTo({
					url: '../orderInfo/index?id=' + e.OrderID
				})
			},
			// imgError(e) {
			// 图片加载失败
			// var index = e.currentTarget.dataset.index
			// this.data.dataList[index].NameImg = '../../images/icon/noImg.png'
			// this.setData({
			// 	dataList: this.data.dataList
			// })
			// }
		},
		onPullDownRefresh: function() {

			//开启导航条加载动画
			uni.showNavigationBarLoading()
			pageIndex = 1

			this.getList()

		},
		onReachBottom: function() {
			if (this.dataList.length > 0) {
				//获取订单列表
				this.getList()
			}
		},
		onShow: function() {
			this.$showLoads(0)
			pageIndex = 1
			if (!app.globalData.openID) {
				this.$store.dispatch('Login').then(D => {
					this.getList()
				})
			} else {
				this.getList()
			}
		}
	}
</script>

<style scoped>
	.orderStyle {
		padding-bottom: 8px;
		font-size: 9pt;
	}

	.orderBox {
		background: #fff;
		border-top: 4px solid rgb(252, 249, 249);
	}

	.orderTime {
		padding: 10px;
		border-bottom: 1px solid rgb(245, 243, 243);
	}

	.order-img {
		width: 80px;
		height: 80px;
		min-width: 80px;
	}

	.order-img image {
		width: 100%;
		height: 100%;
	}

	.orderTimeIcon {
		vertical-align: middle;
		color: #7d7e80;
		margin-right: 6px;
	}

	.orderTitle {
		padding: 18px 10px;
		/* border-bottom: 1px solid #eee; */
		/* display: flex; */
		/* width:100%; */
	}

	.orderTitle-info {
		/* overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap; */
		/* margin-left: 8px; */
		/* margin-top: 5px; */
		margin-right: 10px;
	}

	.pre-time {
		padding: 0 10px 18px;
		font-size: 8pt;
		color: #777;
	}

	.orderNum {
		float: right;
		font-weight: 700;
	}

	.contact {
		padding: 5px;
		text-align: right;
	}

	.statusOrder {
		float: right;
		color: #777;
	}

	.ShopNo-Name {
		margin-left: 10px;
	}

	.uni-tag {
		color: #d82f37 !important;
	}
</style>
