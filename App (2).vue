<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
    page {
    	display: flex;
    	flex-direction: column;
    	box-sizing: border-box;
    	background-color: #FFFFFF;
    }
    .example{
        padding: 0 30upx 30upx;
    }
    .example-title {
    	font-size: 32upx;
        line-height: 32upx;
    	color: #666;
    	margin: 40upx 25upx;
    	padding-left: 25upx;
        position: relative;
    }
    .example .example-title{
        margin: 40upx 0;
    }
    .example-title:before {
    	content: "";
    	display: inline-block;
    	position: absolute;
    	left: 0upx;
        top: 0upx;
    	width: 2px;
    	height: 34upx;
    	background-color: #007aff;
    	border-radius: 2px;
    }
    .example-body{
        padding: 0 40upx;
    }
</style>
