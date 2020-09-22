<!--**
 * forked from：https://github.com/F-loat/mpvue-wxParse
 *
 * github地址: https://github.com/dcloudio/uParse
 *
 * for: uni-app框架下 富文本解析
 */-->

<template>
	<!--基础元素-->
	<div class="wxParse" :class="className" v-if="!loading">
		<block v-for="(node,index) of nodes" :key="index" style="width: 100%;height: 100%;background-color: #8DC63F;">
			<wxParseTemplate :node="node" />
		</block>
	</div>
</template>

<script>
	import HtmlToJson from './libs/html2json';
	import wxParseTemplate from './components/wxParseTemplate0';

	export default {
		name: 'wxParse',
		props: {
			loading: {
				type: Boolean,
				default: false,
			},
			className: {
				type: String,
				default: '',
			},
			content: {
				type: String,
				default: '',
			},
			noData: {
				type: String,
				default: '',
				// default: '<div style="color: red;">数据不能为空</div>',
			},
			startHandler: {
				type: Function,
				default () {
					return (node) => {
						node.attr.class = null;
						node.attr.style = null;
					};
				},
			},
			endHandler: {
				type: Function,
				default: null,
			},
			charsHandler: {
				type: Function,
				default: null,
			},
			imageProp: {
				type: Object,
				default () {
					return {
						mode: 'aspectFit',
						padding: 0,
						lazyLoad: false,
						domain: '',
					};
				},
			},
		},
		components: {
			wxParseTemplate,
		},
		data() {
			return {
				imageUrls: [],
			};
		},
		computed: {
			nodes() {
				const {
					content,
					noData,
					imageProp,
					startHandler,
					endHandler,
					charsHandler,
				} = this;
				const parseData = content || noData;
				const customHandler = {
					start: startHandler,
					end: endHandler,
					chars: charsHandler,
				};
				const results = HtmlToJson(parseData, customHandler, imageProp, this);
				console.log(results, 11);
				this.imageUrls = results.imageUrls;
				//  let img  = results.imageUrls
				//  let obj2 = {}
				//  img.forEach((item,index) => {
				// 	obj2 = item.replace(/../, "https://we.bak365.net/SmallProgramSaleOrder")
				// 	console.log(obj2);
				// 	// this.imageUrls.push(obj2)
				//  });
				// let nodes = results.nodes;
				// console.log(nodes,'===')
				// nodes.forEach(item => {
				// 	item.nodes.forEach(item2 => {
				// 		if(item2.tag === 'img'){
				// 			let attrSrc = item2.attr.src;
				// 			item2.attr.src = attrSrc.replace(/../, "https://we.bak365.net/SmallProgramSaleOrder")
				// 		}
				// 		if(item2.nodes){
				// 			item2.nodes.forEach(item3 =>{
				// 				if(item3.tag === 'img'){
				// 					let attrSrc2 = item3.attr.src; 
				// 					item3.attr.src = attrSrc2.replace(/../, "https://we.bak365.net/SmallProgramSaleOrder")
				// 				}
				// 			})
				// 		}
				// 	})
				// })
				// console.log(nodes,'nodes-')
				// console.log(results.nodes,'000--')
				// console.log(results.nodes);
				 return results.nodes;
			},
		},
		methods: {
			navigate(href, $event) {
				this.$emit('navigate', href, $event);
			},
			preview(src, $event) {
				if (!this.imageUrls.length) return;
				wx.previewImage({
					current: src,
					urls: this.imageUrls,
				});
				this.$emit('preview', src, $event);
			},
			removeImageUrl(src) {
				const {
					imageUrls
				} = this;
				imageUrls.splice(imageUrls.indexOf(src), 1);
			},
		},
	};
</script>
<style>
@import url("./u-parse.css");
</style>