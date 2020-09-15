<template>
	    <view class="imageZan">
	      <image src="/static/images/icon/noCoupon.png" class="zanwuIcon"></image>
	      {{dataSet}}
	    </view>
</template>

<script>
	export default{
		props:{
			dataSet:{
				type:String,
				default:'暂无数据'
			}
		}
	}
</script>

<style scoped>
	.imageZan{
	  width:150px;
	  height:150px;
	  margin:auto;
	  text-align: center;
	  position:absolute;
	  top:50%;
	  left:50%;
	  transform: translate(-75px,-75px);
	  font-size:11pt;
	}
	.zanwuIcon{
	  height:100%;
	  width:100%;
	  margin-bottom: 10px;
	}
</style>
