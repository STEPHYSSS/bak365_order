<template>
	<div>
		<!-- 轮播图 -->
		<swiper class="swiperStyle" :indicator-dots="true" indicator-active-color="#ffa006" :autoplay="true" :interval="5000"
		 :circular="true">
			<swiper-item v-for="(item,index) in HtmlInfo" :key="index">
				<navigator class="swiperBox" :url="item.LinkUrl">
					<image :src="item.ImgUrl" class="swiperImg" @load="swiperImageLoad($event,index)" />
				</navigator>
			</swiper-item>
		</swiper>
	</div>
</template>

<script>
	export default {
		props: {
			HtmlInfo: {
				type: Array,
				default () {
					return [{
							ImgUrl: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4018557288,1217151095&fm=26&gp=0.jpg',
							LinkUrl: ''
						},
						{
							ImgUrl: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3252521864,872614242&fm=26&gp=0.jpg'
						}
					]
				}
			}
		},
		data() {
			return {}
		},
		methods: {
			//获取轮转图图片高度
			swiperImageLoad: function(e, index) {
				var $width = e.detail.width
				var $height = e.detail.height
			},
		}
	}
</script>

<style scoped lang="scss">
	.swiperStyle {
		height: 200px !important;
		overflow: hidden;
	}

	.swiperImg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		vertical-align: middle;
		width: 100%;
		height: 100%;
	}
</style>
