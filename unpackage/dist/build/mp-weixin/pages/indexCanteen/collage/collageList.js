(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/indexCanteen/collage/collageList"],{"160e":function(e,t,n){"use strict";var i=n("33d5"),o=n.n(i);o.a},1971:function(e,t,n){"use strict";var i,o=function(){var e=this,t=e.$createElement;e._self._c},a=[];n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){return i}))},"1dee":function(e,t,n){"use strict";(function(e){n("b895");i(n("66fd"));var t=i(n("e5f8"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},"33d5":function(e,t,n){},a6b0:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=o(n("3955"));function o(e){return e&&e.__esModule?e:{default:e}}var a=function(){n.e("components_uni/uni-countdown/uni-countdown").then(function(){return resolve(n("84ca"))}.bind(null,n)).catch(n.oe)},u=function(){n.e("components/nodeData/index").then(function(){return resolve(n("7f34"))}.bind(null,n)).catch(n.oe)},c=getApp(),r={components:{uniCountdown:a,noData:u},data:function(){return{myCollage:!1,groupList:[],ActiveID:""}},onLoad:function(t){var n=this;this.myCollage=t.myCollage||!1,this.ActiveID=t.ActiveID||"",this.myCollage&&e.setNavigationBarTitle({title:"我的拼团"}),c.globalData.openID?this.getList():this.$store.dispatch("Login").then((function(e){n.getList()}))},methods:{getList:function(){var t=this;e.showLoading({title:"加载中",icon:"none"});var n=this.myCollage?"Active/GroupBuy/OwnGroupList.aspx":"Active/GroupBuy/GroupList.aspx";i.default.api(n,{ActiveID:this.ActiveID||""}).then((function(n){e.hideLoading(),t.groupList=n.GroupInfo,t.groupList.length>0&&t.groupList.forEach((function(e){e.VaildTime&&(e.activeTimeMy=t.getVaildTime(e.VaildTime))}))})).catch((function(e){}))},getVaildTime:function(e){var t=(new Date).getTime(),n=new Date(e.replace(/-/g,"/")).getTime(),i=n-t;return{day:parseInt(i/864e5),hours:parseInt(i%864e5/36e5),minute:parseInt(i%36e5/6e4),second:parseInt(i%6e4/1e3)}},getTogether:function(t){this.myCollage?e.navigateTo({url:"/pages/indexCanteen/collage/info?ActiveID="+this.ActiveID+"&GroupNo="+t+"&myCollage="+this.myCollage}):e.navigateTo({url:"/pages/indexCanteen/collage/info?ActiveID="+this.ActiveID+"&GroupNo="+t})}}};t.default=r}).call(this,n("543d")["default"])},b87b:function(e,t,n){"use strict";n.r(t);var i=n("a6b0"),o=n.n(i);for(var a in i)"default"!==a&&function(e){n.d(t,e,(function(){return i[e]}))}(a);t["default"]=o.a},e5f8:function(e,t,n){"use strict";n.r(t);var i=n("1971"),o=n("b87b");for(var a in o)"default"!==a&&function(e){n.d(t,e,(function(){return o[e]}))}(a);n("160e");var u,c=n("f0c5"),r=Object(c["a"])(o["default"],i["b"],i["c"],!1,null,"e0481c90",null,!1,i["a"],u);t["default"]=r.exports}},[["1dee","common/runtime","common/vendor"]]]);