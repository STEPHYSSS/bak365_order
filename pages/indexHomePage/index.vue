<template>
	<div class="homePagesStyle">
		<!-- <collageList></collageList> -->
		<div v-for="(item,key) in dataList" :key="key">
			<RotationChart v-if="item.HtmlType === 'CarouselImg'" :HtmlInfo="item.HtmlInfo"></RotationChart>
			<noticeBar v-if="item.HtmlType === 'Notice'" :propsData="item"></noticeBar>
			<iconBox v-if="item.HtmlType === 'Cube'" :propsData="item"></iconBox>
			<goodsBox v-if="item.HtmlType === 'ProdInfo'" :propsData="item"></goodsBox>
			<activeList v-if="item.HtmlType === 'Active'&&item.HtmlInfo.ActiveType === '2'" :propsData="item"></activeList>
			<collageList v-if="item.HtmlType === 'Active'&&item.HtmlInfo.ActiveType === '3'"  :propsData="item"></collageList>
		</div>
	</div>
</template>

<script>
	import changeStorePack from '@/components/poppupChangeOrder/index.vue'
	const app = getApp()
	import APIList from '@/api/http.js';
	export default {
		components: {
			changeStorePack
		},
		data() {
			return {
				dataList: []
			}
		},
		onLoad() {
			if (!app.globalData.openID) {
				this.$showLoads(0, '') //加载
				this.$store.dispatch('Login').then(D => {
					this.getList()
				})
			} else {
				this.$showLoads(0, '') //加载
				this.getList()
			}//打包是记得开放
		},
		methods: {
			getList() {
				APIList.api('DefinedIndexPage.aspx').then(D => {
					console.log(app.globalData.shopNo,'商户编号')
					this.$showLoads(1, '')
					if (D.PageInfo.length === 0) {
						uni.reLaunch({
							url: '/pages/indexMain/index'
						})
					} else {
						if (!app.globalData.shopNo || !app.globalData.isPack) {
							//没有门店，跳到门店列表
							uni.reLaunch({
								url: '/pages/indexCanteen/changeStore/index?homePage=true'
							})
						}
					}
					this.dataList = D.PageInfo
				}).catch(e => {
					this.$showLoads(1, '')
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.homePagesStyle {
		background-color: #fbfbfb;
	}
</style>
