(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/indexMain/index"],{1169:function(e,t,o){"use strict";var n,i=function(){var e=this,t=e.$createElement;e._self._c},a=[];o.d(t,"b",(function(){return i})),o.d(t,"c",(function(){return a})),o.d(t,"a",(function(){return n}))},"2cc1":function(e,t,o){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(o("3955")),i=o("bf5e");function a(e){return e&&e.__esModule?e:{default:e}}var r=function(){o.e("components_uni/uni-popup/uni-popup").then(function(){return resolve(o("117d"))}.bind(null,o)).catch(o.oe)},c=function(){o.e("components/poppupChangeOrder/index").then(function(){return resolve(o("cf70"))}.bind(null,o)).catch(o.oe)},u=getApp(),s={components:{uniPopup:r,changeStore:c},data:function(){return{CarouselImgInfo:[],imageSize:[],isShopNum:"",shopNo:"",currentStore:{},interval:3e3,circular:!0,judgeTimeT:(0,i.judgeTime)(),isShowCode:!1,colorIndex:u.globalData.colorIndex,colorItem:u.globalData.itemColor,provider:u.globalData.provider,location:{},clickShow:!1,radio:"1",current:0,showDiscount:!1,couponList:[],activeImg:"",SendProgInfo:{},loading:!1,isChangeStore:!1,modeChange:{},isweixin:"",ActiveID:""}},methods:{clickText:function(){e.navigateTo({url:"/pages/indexCanteen/goodInfo/index?ProdNo=113340"})},getArea:function(){var t=this;n.default.api("ShopInfo.aspx",this.location).then((function(o){if(t.currentStore=o.ShopInfo[0],!u.globalData.shopNo&&t.location.Latitude){var n=t;e.showModal({title:"选择门店",content:n.currentStore.ShopName+(n.currentStore.ShopAddress?"-":"")+n.currentStore.ShopAddress,success:function(e){e.confirm?(n.isChangeStore=!0,u.globalData.shopNo=n.currentStore.ShopNo):e.cancel}})}t.getObj(o.ShopInfo[0].ShopNo)})).catch((function(e){}))},getObj:function(e){var t=this;this.$showLoads(0);var o="weixin"===this.provider?1:2;n.default.api("NewIndex.aspx",{ShopNo:e||this.shopNo,Source:o}).then((function(e){(0,i.setTime)(e.SendProgInfo.ProgDetail),t.ActiveID=e.ActiveID,t.CarouselImgInfo=e.CarouselImgInfo,t.isShowCode=e.IsShowCardCode,t.currentStore=e.ShopInfo,t.couponList=e.SendProgInfo.ProgDetail||[],t.SendProgInfo=e.SendProgInfo,t.modeChange={LogisticsDistribution:e.WX_LogisticsDistribution,OrderEatInStore:e.WX_OrderEatInStore,OrderEatPackAway:e.WX_OrderEatPackAway,WXSmallProgramKf:e.WX_SmallProgramKf},!u.globalData.isDraw&&e.SendProgInfo.ProgDetail.length>0&&(t.showDiscount=!0),t.$showLoads(1),t.loading=!0})).catch((function(e){}))},swiperImageLoad:function(e,t){e.detail.width,e.detail.height},startOrder:function(){var t=this.modeChange.LogisticsDistribution,o=this.modeChange.OrderEatInStore,n=this.modeChange.OrderEatPackAway,a=(0,i.setModeIf)(t,o,n);if(this.isShopNum||this.isChangeStore)a.bool&&!u.globalData.isPack?this.clickShow=!0:(a.currentMode&&(u.globalData.isPack=a.currentMode),e.switchTab({url:"/pages/indexCanteen/index"}));else if(u.globalData.shopNo){if(!u.globalData.isPack&&a.bool)return void(this.clickShow=!0);e.switchTab({url:"/pages/indexCanteen/index"})}else e.navigateTo({url:"../indexCanteen/changeStore/index"})},onClose:function(e){e||(this.clickShow=!1)},onChangeStore:function(e){for(var t=0;t<this.items.length;t++)if(1===e.target.value){this.current=t;break}},changeMode:function(t){this.clickShow=!1,e.switchTab({url:"/pages/indexCanteen/index"})},clickMyCode:function(){e.navigateTo({url:"./vipQRCode/index"})},clickMyOrder:function(){e.switchTab({url:"/pages/indexOrder/oderList/index"})},clickMyVip:function(){e.switchTab({url:"/pages/indexVip/index"})},clickMyCoupon:function(){e.navigateTo({url:"../indexVip/couponList/index"})},clickMyActive:function(){e.navigateTo({url:"/pages/indexCanteen/flashSale/index?ActiveID="+this.ActiveID})},closeDiscount:function(){this.showDiscount=!1,u.globalData.isDraw=!0},centerStoreChange:function(){},storeChangeFun:function(){},clickNearbyStore:function(){e.navigateTo({url:"../indexCanteen/changeStore/index?isNearby=true"})},handleContact:function(){}},onShareAppMessage:function(){return{title:"台位点单",path:"/pages/indexCanteen/index"}},onLoad:function(t){this.ActiveID=t.options;var o=t.q?decodeURIComponent(t.q):"",n={};if(o){var i=o.slice(o.indexOf("?"));i=i.substr(1);var a=i.split("&");a.forEach((function(e){var t=e.split("=")[0];n[t]=e.split("=")[1]}))}else n={};var r=this;n.ShopNo&&(this.isShopNum=!0,u.globalData.shopNo=n.ShopNo),this.shopNo=n.ShopNo||"",n.TableNumber&&(u.globalData.tableNumber=n.TableNumber||""),u.globalData.shopNo&&(this.shopNo=u.globalData.shopNo),t.currentShop&&(this.currentStore=JSON.parse(t.currentShop),this.shopNo=this.currentStore.ShopNo),e.getLocation({type:"wgs84",success:function(t){t.latitude,t.longitude;e.setStorageSync("location",{latitude:t.latitude,longitude:t.longitude}),r.location={Latitude:t.latitude,Longitude:t.longitude}},fail:function(){},complete:function(){u.globalData.openID?(l(u,r),r.isweixin="weixin"===u.globalData.provider):r.$store.dispatch("Login").then((function(e){l(u,r),r.isweixin="weixin"===u.globalData.provider}))}})},onShow:function(){!u.globalData.isDraw&&this.couponList.length>0&&(this.showDiscount=!0)},watch:{currentStore:function(t){t&&"{}"!==JSON.stringify(t)&&(e.setStorageSync("shopLocation",{latitude:this.currentStore.Latitude||"",longitude:this.currentStore.Longitude||""}),e.setStorageSync("shopLocationName",this.currentStore.ShopName))}}};function l(e,t){t.shopNo?(t.isShopNum=!0,t.getObj()):(t.getArea(),t.isShopNum=!1)}t.default=s}).call(this,o("543d")["default"])},4966:function(e,t,o){"use strict";(function(e){o("b895");n(o("66fd"));var t=n(o("ec30"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,o("543d")["createPage"])},"8c94":function(e,t,o){"use strict";var n=o("be81"),i=o.n(n);i.a},be81:function(e,t,o){},c8ab:function(e,t,o){"use strict";o.r(t);var n=o("2cc1"),i=o.n(n);for(var a in n)"default"!==a&&function(e){o.d(t,e,(function(){return n[e]}))}(a);t["default"]=i.a},ec30:function(e,t,o){"use strict";o.r(t);var n=o("1169"),i=o("c8ab");for(var a in i)"default"!==a&&function(e){o.d(t,e,(function(){return i[e]}))}(a);o("8c94");var r,c=o("f0c5"),u=Object(c["a"])(i["default"],n["b"],n["c"],!1,null,"737b2533",null,!1,n["a"],r);t["default"]=u.exports}},[["4966","common/runtime","common/vendor"]]]);