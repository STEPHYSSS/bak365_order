(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/indexOrder/oderList/index"],{"2e8d":function(t,n,e){"use strict";var o=e("67c2"),i=e.n(o);i.a},"67c2":function(t,n,e){},"6d76":function(t,n,e){"use strict";e.r(n);var o=e("bec1"),i=e("cdcb");for(var a in i)"default"!==a&&function(t){e.d(n,t,(function(){return i[t]}))}(a);e("2e8d");var c,r=e("f0c5"),u=Object(r["a"])(i["default"],o["b"],o["c"],!1,null,"98ae7690",null,!1,o["a"],c);n["default"]=u.exports},a8b4:function(t,n,e){"use strict";(function(t){e("b895");o(e("66fd"));var n=o(e("6d76"));function o(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},bec1:function(t,n,e){"use strict";var o,i=function(){var t=this,n=t.$createElement;t._self._c},a=[];e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return a})),e.d(n,"a",(function(){return o}))},c798:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=i(e("3955"));function i(t){return t&&t.__esModule?t:{default:t}}var a=function(){e.e("components_uni/uni-tag/uni-tag").then(function(){return resolve(e("ee31"))}.bind(null,e)).catch(e.oe)},c=function(){e.e("components/nodeData/index").then(function(){return resolve(e("7f34"))}.bind(null,e)).catch(e.oe)},r=getApp(),u=1,s={components:{uniTag:a,nodeData:c},data:function(){return{dataList:[],allList:[],currentList:[],colorNum:r.globalData.colorIndex}},methods:{getList:function(){var n=this;this.$showLoads(0),o.default.api("OrderList.aspx",{PageIndex:u}).then((function(e){n.$showLoads(1),n.dataList=u>1?n.dataList.concat(e.OrderList):e.OrderList,e.OrderList.length>0&&u++,n.dataList=n.dataList,t.stopPullDownRefresh(),t.hideNavigationBarLoading()})).catch((function(n){t.stopPullDownRefresh(),t.hideNavigationBarLoading()}))},clickInfoStore:function(n){t.navigateTo({url:"../orderInfo/index?id="+n.OrderID})}},onPullDownRefresh:function(){t.showNavigationBarLoading(),u=1,this.getList()},onReachBottom:function(){this.dataList.length>0&&this.getList()},onShow:function(){var t=this;this.$showLoads(0),u=1,r.globalData.openID?this.getList():this.$store.dispatch("Login").then((function(n){t.getList()}))}};n.default=s}).call(this,e("543d")["default"])},cdcb:function(t,n,e){"use strict";e.r(n);var o=e("c798"),i=e.n(o);for(var a in o)"default"!==a&&function(t){e.d(n,t,(function(){return o[t]}))}(a);n["default"]=i.a}},[["a8b4","common/runtime","common/vendor"]]]);