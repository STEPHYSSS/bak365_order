(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/indexCanteen/index"],{"09bd":function(t,o,n){"use strict";n.r(o);var a=n("c799"),e=n("1d49");for(var r in e)"default"!==r&&function(t){n.d(o,t,(function(){return e[t]}))}(r);n("bbea");var i,s=n("f0c5"),u=Object(s["a"])(e["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],i);o["default"]=u.exports},"1d49":function(t,o,n){"use strict";n.r(o);var a=n("b4f0"),e=n.n(a);for(var r in a)"default"!==r&&function(t){n.d(o,t,(function(){return a[t]}))}(r);o["default"]=e.a},9873:function(t,o,n){},b4f0:function(t,o,n){"use strict";(function(t){Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var a=e(n("8732"));function e(t){return t&&t.__esModule?t:{default:t}}var r=getApp(),i=function(){n.e("components/bottomSubmit/index").then(function(){return resolve(n("e3af"))}.bind(null,n)).catch(n.oe)},s=function(){n.e("components/nodeData/index").then(function(){return resolve(n("1af4"))}.bind(null,n)).catch(n.oe)},u=function(){Promise.all([n.e("common/vendor"),n.e("components/goodsBox/index")]).then(function(){return resolve(n("c364"))}.bind(null,n)).catch(n.oe)},l=function(){Promise.all([n.e("common/vendor"),n.e("components/stepperCard/index")]).then(function(){return resolve(n("9a1a"))}.bind(null,n)).catch(n.oe)},d=n("a2f1"),c={components:{bottomSubmit:i,noData:s,goodsBox:u,stepperCard:l},data:function(){return{colorNum:r.globalData.colorIndex,itemColor:r.globalData.itemColor,provider:r.globalData.provider,currentIndex:0,currentList:[],arrayList:[],allGoodList:[],allMoney:"",cartLists:[],addNum:0,show:!1,ProdCateInfo:[],showPack:!1,radioMode:"2",loading:!1,shopName:"",partsQty:{},goodCodeData:{},isShowCode:!1,WXSmallProgramKf:""}},onShow:function(){var o=this;if(this.getList(),r.globalData.isPack){if(r.globalData.openID?(this.$showLoads(0,""),this.getList()):(this.$showLoads(0,""),this.$store.dispatch("Login").then((function(t){o.getList(r.globalData.openID)}))),this.provider=r.globalData.provider,this.arrayList.length>0){this.setList();var n=m(this.ProdCateInfo);this.ProdCateInfo=n;var a=t.getStorageSync("cartList");a&&0!==a.length||(this.arrayList.forEach((function(t){t.num=0})),this.ProdCateInfo.forEach((function(t){t.numInfo=0})),this.cartLists=[],this.ProdCateInfo=this.ProdCateInfo,this.addNum=0,this.allMoney=0,this.arrayList=this.arrayList)}}else t.redirectTo({url:"../indexMain/index"})},methods:{handleContact:function(){},itemClick:function(t,o){this.currentIndex=o;var n=f(t,this.allGoodList);this.arrayList=n,this.setList()},mycurrentPage:function(o){var n=d.setCard(o);o.itemData.num>this.addNum&&t.showToast({title:"已加入购物车"}),this.allMoney=0,this.addNum=0,h(this,n);var a=m(this.ProdCateInfo);this.cartLists=n,this.arrayList=this.arrayList,this.ProdCateInfo=a,this.addNum=n.length>0?this.addNum:0,this.allMoney=n.length>0?parseFloat(this.allMoney.toFixed(2)):0},setShowStepper:function(t,o){this.$set(this.arrayList[o],"showStepper",t)},changeMax:function(t){},setCartList:function(o,n){var a=this;this.cartLists[n].num=o,this.cartLists[n].prodPartsInfo.forEach((function(t){t.num=o})),d.controlPartsStock(this,n);this.cartLists;var e=[];e=e.concat(this.cartLists),a.allMoney=0,a.addNum=0,h(this,e);for(var r=0;r<e.length;r++){var i=e[r];0===Number(i.num)&&e.splice(r,1)}if(0===e.length)for(var s=0;s<a.arrayList.length;s++){var u=a.arrayList[s];u.num=0}e=e||[];var l=m(this.ProdCateInfo,e);a.allMoney=parseFloat(a.allMoney.toFixed(2)),this.$nextTick((function(){a.cartLists=e,a.ProdCateInfo=l,a.addNum=e.length>0?a.addNum:0,a.allMoney=e.length>0?a.allMoney:0})),t.setStorage({key:"cartList",data:e})},clickClear:function(){for(var o=0;o<this.arrayList.length;o++){var n=this.arrayList[o];n.num=0,n.showStepper=!1}this.ProdCateInfo.forEach((function(t){t.numInfo=0})),this.arrayList=this.arrayList,this.ProdCateInfo=this.ProdCateInfo,this.cartLists=[],this.addNum=0,this.allMoney=0,t.setStorage({key:"cartList",data:[]})},shopRevertMain:function(){t.redirectTo({url:"../indexMain/index"})},clickInput:function(){t.navigateTo({url:"../selectRegion/index"})},changeMode:function(t){this.loading||(this.radioMode=t.detail,this.getList())},shopClick:function(){t.navigateTo({url:"./changeStore/index?indexCan=true"})},getList:function(t){var o=this;this.radioMode=r.globalData.isPack,this.radioMode=this.radioMode,this.loading=!0,a.default.api("Index.aspx",{},t,this.radioMode).then((function(t){o.$showLoads(1,""),t.ProdInfo.forEach((function(t){t.num=0}));var n=f(t.ProdCateInfo[o.currentIndex].CateNo,t.ProdInfo),a=m(t.ProdCateInfo);o.ProdCateInfo=a,o.allGoodList=t.ProdInfo,o.arrayList=n,o.shopName=t.ShopName,r.globalData.minAmount=t.MinDistributionAmount,o.WXSmallProgramKf=t.WX_SmallProgramKf,o.loading=!1,o.setList()})).catch((function(t){o.loading=!1}))},setList:function(){var o=this;o.addNum=0;var n=t.getStorageSync("cartList");if(this.allMoney=0,n&&n.length>0){for(var a=0;a<o.arrayList.length;a++){var e=o.arrayList[a];e.num=0;for(var r=0;r<n.length;r++){var i=n[r];i.ProdNo!==e.ProdNo||i.ActiveID||(e.num=i.num,i.hasOwnProperty("showStepper")&&(0===i.num?e.showStepper=!1:e.showStepper=i.showStepper))}}for(a=0;a<n.length;a++){i=n[a];o.allMoney+=Number(i.num)*Number(i.SalePrice),o.addNum+=Number(i.num)}}else for(a=0;a<o.arrayList.length;a++){e=o.arrayList[a];e.num=0}o.cartLists=n,o.allMoney=parseFloat(o.allMoney.toFixed(2))},determine:function(){t.navigateTo({url:"./paymentOrder/index"})},searchGoods:function(){t.navigateTo({url:"./searchGood/index"})},goodCodeFun:function(){var o=this;o.isShowCode=!1,t.scanCode({success:function(n){var a=o.allGoodList.filter((function(t){return Number(t.ProdNo)===Number(n.result)}));0===a.length?(t.showToast({title:"未找到该商品",icon:"none"}),o.goodCodeData={}):(o.goodCodeData=a[0],o.isShowCode=!0)},fail:function(o){t.showToast({title:"二维码未识别",icon:"none"})}})}},onLoad:function(){}};function h(t,o){for(var n=0;n<o.length;n++){for(var a=o[n],e=0;e<t.arrayList.length;e++){var r=t.arrayList[e];a.ProdNo==r.ProdNo&&(a.showStepper=r.showStepper,r.num=a.num,0==Number(a.num)&&(r.showStepper=!1))}t.allMoney+=Number(a.num)*Number(a.SalePrice),t.addNum+=Number(a.num)}t.allMoney=parseFloat(t.allMoney.toFixed(2))}function f(t,o){var n=[];return o.forEach((function(o){t==o.CateNo&&n.push(o)})),n}function m(o,n){var a=n||t.getStorageSync("cartList");return o.forEach((function(t){t.numInfo=0,a.length>0&&a.forEach((function(o){t.CateNo===o.CateNo&&(t.numInfo=t.numInfo+o.num)}))})),o}o.default=c}).call(this,n("543d")["default"])},bbea:function(t,o,n){"use strict";var a=n("9873"),e=n.n(a);e.a},c799:function(t,o,n){"use strict";var a,e=function(){var t=this,o=t.$createElement;t._self._c},r=[];n.d(o,"b",(function(){return e})),n.d(o,"c",(function(){return r})),n.d(o,"a",(function(){return a}))},fa56:function(t,o,n){"use strict";(function(t){n("abfe");a(n("66fd"));var o=a(n("09bd"));function a(t){return t&&t.__esModule?t:{default:t}}t(o.default)}).call(this,n("543d")["createPage"])}},[["fa56","common/runtime","common/vendor"]]]);