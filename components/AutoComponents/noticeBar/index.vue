<template>
	<div class="noticeBar-style">
		<uniNoticeBar speed="50" :text="propsData.NoticeContent" scrollable="false" showIcon="true"></uniNoticeBar>
	</div>
</template>

<script>
	import uniNoticeBar from '@/components_uni/uni-notice-bar/uni-notice-bar.vue'
	export default {
		props: {
			propsData: {
				type: Object,
				default () {
					return {
						NoticeContent: '44444444444444444444444444444'
					}
				}
			}
		},
		components: {
			uniNoticeBar
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style>
	.noticeBar-style .uni-noticebar-icon{
		display: flex;
	}
</style>
