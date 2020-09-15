<template>
	<div style="">
		<!-- 客服按钮 -->
		<button v-if="WXSmallProgramKf==='1'&&provider==='weixin'" open-type="contact" @contact="handleContact"
		 :show-message-card="true" send-message-img :send-message-path="messagePath" :send-message-title="messageTitle">
			<span class="icon customer-service-style" :style="{'color': itemColor,
			'border': '1px solid'+ itemColor}">&#xe60a;</span>
		</button>
	</div>
</template>

<script>
	let app = getApp()
	export default {
		props: {
			WXSmallProgramKf: [String],
			provider: [String],
			messageTitle:[String],
			messagePath:[String]
		},
		data() {
			return {
				itemColor: app.globalData.itemColor
			}
		},
		methods: {
			handleContact() {}
		}
	}
</script>

<style>
</style>
