<template>

	<!-- <van-stepper value="{{ numData }}" catchtap="catchtap"  catch:change="onChange" plus-class="plus-stepper" minus-class="plus-stepper" input-class="{{numData!==0?'plus-input':'plus-inputNode'}}" min="0"
	   disable-input show-minus="{{numData!==0}}" disabled="{{disabled}}" custom-class="custom-class"/> -->
	<view>
		<uni-number-box :value="numData" @change="onChange" :min="0" :max="maxData" :key="indexKey" :disabledright="currentDisabled"
		 :disabledAll="disabledAll"></uni-number-box>
	</view>
</template>

<script>
	import uniNumberBox from "@/components_uni/uni-number-box/uni-number-box.vue"

	export default {
		props: {
			numData: {
				type: Number,
				value: 1
			},
			maxData: {
				type: Number,
				value: 99
			},
			// 控制都不让点击
			currentDisabled: {
				type: Boolean,
				value: false
			},
			// 控制左右都不让点击
			disabledAll: {
				type: Boolean,
				value: false
			},
			indexKey: Number
		},
		components: {
			uniNumberBox
		},

		data() {
			return {};
		},
		computed: {},
		methods: {
			onChange(goodsNum) {
				// if (e == this.numData) {
				// 	// 默认值的时候不可以执行
				// 	return	
				// }
				// console.log('加减执行', goodsNum);
				this.$emit('stepperNum', goodsNum)
			}
		}
	}
</script>

<style scoped>
</style>
