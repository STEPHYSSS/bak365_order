<template>
	<view>
		<!-- 搜索商品页 -->
		<view>
			<view class="searchPageInput">
				<input class="searchInput" placeholder="搜搜想吃的美食" :value="newValue" @input="bindinput"></input>
				<text class="icon iconSearch">&#xe600;</text>
				<view class="title" @click="clickSearch">搜索</view>
			</view>
			<view v-if="!showGoods">
				<!-- <text class="hotSearch">热门搜索</text>
		    <view class="goodsType" wx:for="{{20}}" wx:key="{{index}}" bindtap="clickGood" data-good="{{item}}">榴莲</view> -->

				<view class="historyStyle" v-if="historyList.length>0">
					<text class="hotSearch">历史搜索</text>
					<view class="popup-topRight" @click="clearList">
						<!-- <van-icon name="delete" style="vertical-align: middle;margin-right:5px" /> -->
						<text class="icon" style="vertical-align: middle;margin-right:5px">&#xe610;</text>
						<text class="clearStyle">清空</text>
					</view>
				</view>

				<view class="goodsType" v-for="(item,index) in historyList" :key="index" @click="clickGood(item)">
					{{item}}
				</view>
			</view>
		</view>

		<view v-if="arrayList.length>0&&showGoods">
			<goods-box v-for="item in arrayList" :itemData="item" :key="index" @mycurrentPage="mycurrentPage" :isSearch="true"></goods-box>
		</view>

		<view v-if="arrayList.length===0&&showGoods" class="emptyStyle">
			<view class="emptyIcon">
				<image src="/static/images/icon/lanzi.png"></image>
			</view>
			<text class="emptyTitle">
				抱歉。没有找到相关商品
				换个关键词吧
			</text>
		</view>
	</view>
</template>

<script>
	import APIList from '@/api/http.js';
	import goodsBox from '@/components/goodsBox/index.vue'
	const app = getApp()
	export default {
		components: {
			goodsBox
		},
		data() {
			return {
				searchValue: '',
				newValue:'',
				historyList: [],
				// 搜索后的商品列表
				arrayList: [],
				// 是否显示商品列表
				showGoods: false
			}
		},
		methods: {
			clickSearch() {
				// 去除空格
				this.searchValue = this.searchValue.replace(/\s*/g, "")

				if (isNull(this.searchValue)) {
					return
				}
				
				this.getList()
				// 点击搜索，获取商品列表

				let arr = []
				arr.push(this.searchValue)
				if(this.historyList&&this.historyList.length>0){
					this.historyList = arr.concat(this.historyList)
				}else{
					this.historyList = arr
				}

				var newHistoryList = unique1(this.historyList)
				uni.setStorage({
					key: "historyList",
					data: newHistoryList
				})
			},
			getList() {
				this.$showLoads(0, '')
				APIList.api('Public/Submit_ajax.aspx', {
					ProdName: this.searchValue,
					Type: 'SearchProd'
				}).then(D => {
					this.arrayList = D.ProdInfo
					this.showGoods = true
					this.$showLoads(1, '')
				}).catch(e => {
				})
			},
			bindinput(val) {
				// console.log(val, 'val')
				this.searchValue = val.detail.value
				if (!val.detail.value) {
					this.arrayList = []
					this.showGoods = false
					this.arrayList = []
				}
				var _this = this
				uni.getStorage({
					key: "historyList",
					success(res) {
						// console.log(res, 'res')
						_this.historyList = res.data
					}
				})
			},
			clickGood(e) {
				// console.log(e, '66666')
				var query = e
				// 点击商品标签，获取商品列表
				this.showGoods = true
				this.searchValue = query
				this.newValue = query

				this.getList()

			},
			clearList() {
				uni.setStorage({
					key: "historyList",
					data: []
				})
				this.historyList = []
			}
		},
		onShow: function() {
			var _this = this
			uni.getStorage({
				key: "historyList",
				success(res) {
					_this.historyList = res.data
				}
			})

			if (!app.globalData.openID) {
				this.$store.dispatch('Login')
			}
		}
	}

	function unique1(arr) {
		var hash = [];
		for (var i = 0; i < arr.length; i++) {
			if (hash.indexOf(arr[i]) == -1) {
				hash.push(arr[i]);
			}
		}
		return hash;
	}

	// 判断是否有空格或者全部未空格
	function isNull(str) {
		if (str == ""||!str) return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	}
</script>

<style scoped>
	.searchPageInput {
		background: #fff;
		padding: 10px 0 10px 10px;
		position: relative;
		display: flex;
		font-size: 10pt;
	}

	.searchInput {
		line-height: 40px;
		height: 40px;
		background: #F2F2F2;
		border-radius: 20px;
		padding-left: 40px;
		padding-right: 20px;
		flex: 1;
	}

	.title {
		width: 60px;
		line-height: 40px;
		text-align: center;
	}

	.iconSearch {
		position: absolute;
		top: 22px;
		left: 22px;
		font-size: 12pt;
	}

	.hotSearch {
		margin: 10px;
		font-size: 14px;
		display: block;
		flex: 1;
	}

	.goodsType {
		display: inline-block;
		font-size: 14px;
		margin: 10px;
		height: 36px;
		padding: 0 10px;
		background: #F2F2F2;
		border-radius: 10px;
		text-align: center;
		line-height: 36px;
	}

	.historyStyle {
		display: flex;
	}

	.popup-topRight {
		color: #707070;
		line-height: 40px;
		margin-right: 15px;
	}

	.clearStyle {
		font-size: 14px;
	}

	.emptyStyle {
		text-align: center;
		margin-top: 50px;
	}

	.emptyIcon {
		background: #F2F2F2;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		text-align: center;
		margin-left: 50%;
		transform: translateX(-80px)
	}

	.emptyIcon image {
		width: 60%;
		height: 60%;
		margin-top: 50%;
		transform: translateY(-48px)
	}

	.emptyTitle {
		color: #707070;
		font-size: 11pt;
		margin-top: 10px;
	}
</style>
