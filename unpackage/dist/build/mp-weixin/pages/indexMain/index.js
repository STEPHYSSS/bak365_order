(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/indexMain/index"],{"17c8":function(o,e,t){"use strict";var n,i=function(){var o=this,e=o.$createElement;o._self._c},a=[];t.d(e,"b",(function(){return i})),t.d(e,"c",(function(){return a})),t.d(e,"a",(function(){return n}))},"2cc1":function(o,e,t){"use strict";(function(o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a(t("3955")),i=t("bf5e");function a(o){return o&&o.__esModule?o:{default:o}}var r=function(){t.e("components_uni/uni-popup/uni-popup").then(function(){return resolve(t("117d"))}.bind(null,t)).catch(t.oe)},c=function(){t.e("components/poppupChangeOrder/index").then(function(){return resolve(t("cf70"))}.bind(null,t)).catch(t.oe)},s=getApp(),u={components:{uniPopup:r,changeStore:c},data:function(){return{CarouselImgInfo:[],imageSize:[],isShopNum:"",shopNo:"",currentStore:{},interval:3e3,circular:!0,judgeTimeT:(0,i.judgeTime)(),isShowCode:!1,colorIndex:s.globalData.colorIndex,colorItem:s.globalData.itemColor,provider:s.globalData.provider,location:{},clickShow:!1,radio:"1",current:0,showDiscount:!1,couponList:[],activeImg:"",SendProgInfo:{},loading:!1,isChangeStore:!1,modeChange:{},isweixin:"",ActiveID:""}},onLoad:function(e){this.ActiveID=e.options;var t=e.q?decodeURIComponent(e.q):"",n={};if(t){var i=t.slice(t.indexOf("?"));i=i.substr(1);var a=i.split("&");a.forEach((function(o){var e=o.split("=")[0];n[e]=o.split("=")[1]}))}else n={};var r=this;n.ShopNo&&(this.isShopNum=!0,s.globalData.shopNo=n.ShopNo),this.shopNo=n.ShopNo||"",n.TableNumber&&(s.globalData.tableNumber=n.TableNumber||""),s.globalData.shopNo&&(this.shopNo=s.globalData.shopNo),e.currentShop&&(this.currentStore=JSON.parse(e.currentShop),this.shopNo=this.currentStore.ShopNo),o.removeStorageSync("shopLocation"),o.getLocation({type:"wgs84",success:function(e){e.latitude,e.longitude;o.setStorageSync("location",{latitude:e.latitude,longitude:e.longitude}),r.location={Latitude:e.latitude,Longitude:e.longitude}},fail:function(){},complete:function(){s.globalData.openID?(l(s,r),r.isweixin="weixin"===s.globalData.provider):r.$store.dispatch("Login").then((function(o){l(s,r),r.isweixin="weixin"===s.globalData.provider}))}})},onShow:function(){console.log(s.globalData.isDraw,"44444"),s.globalData.isDraw&&this.couponList.length>0&&(this.showDiscount=!0)},methods:{clickText:function(){o.navigateTo({url:"/pages/indexCanteen/goodInfo/index?ProdNo=113340"})},getArea:function(){var e=this;n.default.api("ShopInfo.aspx",this.location).then((function(t){if(e.currentStore=t.ShopInfo[0],!s.globalData.shopNo&&e.location.Latitude){var n=e;o.showModal({title:"选择门店",content:n.currentStore.ShopName+(n.currentStore.ShopAddress?"-":"")+n.currentStore.ShopAddress,success:function(o){o.confirm?(n.isChangeStore=!0,s.globalData.shopNo=n.currentStore.ShopNo):o.cancel}})}e.getObj(t.ShopInfo[0].ShopNo)})).catch((function(o){}))},getObj:function(e){var t=this;this.$showLoads(0);var a="weixin"===this.provider?1:2;n.default.api("NewIndex.aspx",{ShopNo:e||this.shopNo,Source:a}).then((function(o){(0,i.setTime)(o.SendProgInfo.ProgDetail),t.ActiveID=o.ActiveID,t.CarouselImgInfo=o.CarouselImgInfo,t.isShowCode=o.IsShowCardCode,t.currentStore=o.ShopInfo,t.couponList=o.SendProgInfo.ProgDetail||[],t.SendProgInfo=o.SendProgInfo,t.modeChange={LogisticsDistribution:o.WX_LogisticsDistribution,OrderEatInStore:o.WX_OrderEatInStore,OrderEatPackAway:o.WX_OrderEatPackAway,WXSmallProgramKf:o.WX_SmallProgramKf},!s.globalData.isDraw&&o.SendProgInfo.ProgDetail.length>0&&(t.showDiscount=!0),t.$showLoads(1)})).catch((function(e){t.$showLoads(1),o.showToast({title:e,icon:"none"}),console.log(e,"错误提示")}))},swiperImageLoad:function(o,e){o.detail.width,o.detail.height},startOrder:function(){var e=this.modeChange.LogisticsDistribution,t=this.modeChange.OrderEatInStore,n=this.modeChange.OrderEatPackAway,a=(0,i.setModeIf)(e,t,n);if(this.isShopNum||this.isChangeStore)a.bool&&!s.globalData.isPack?this.clickShow=!0:(a.currentMode&&(s.globalData.isPack=a.currentMode),o.switchTab({url:"/pages/indexCanteen/index"}));else if(s.globalData.shopNo){if(!s.globalData.isPack&&a.bool)return void(this.clickShow=!0);o.switchTab({url:"/pages/indexCanteen/index"})}else o.navigateTo({url:"../indexCanteen/changeStore/index"})},onClose:function(o){o||(this.clickShow=!1)},onChangeStore:function(o){for(var e=0;e<this.items.length;e++)if(1===o.target.value){this.current=e;break}},changeMode:function(e){this.clickShow=!1,o.switchTab({url:"/pages/indexCanteen/index"})},clickMyCode:function(){o.navigateTo({url:"./vipQRCode/index"})},clickMyOrder:function(){o.switchTab({url:"/pages/indexOrder/oderList/index"})},clickMyVip:function(){o.switchTab({url:"/pages/indexVip/index"})},clickMyCoupon:function(){o.navigateTo({url:"../indexVip/couponList/index"})},clickMyActive:function(){o.navigateTo({url:"/pages/indexCanteen/flashSale/index?ActiveID="+this.ActiveID})},closeDiscount:function(){this.showDiscount=!1,s.globalData.isDraw=!0},centerStoreChange:function(){},storeChangeFun:function(){},clickNearbyStore:function(){o.navigateTo({url:"../indexCanteen/changeStore/index?isNearby=true"})},handleContact:function(){}},onShareAppMessage:function(){return{title:"台位点单",path:"/pages/indexCanteen/index"}},watch:{currentStore:function(e){e&&"{}"!==JSON.stringify(e)&&(o.setStorageSync("shopLocation",{latitude:this.currentStore.Latitude||"",longitude:this.currentStore.Longitude||""}),o.setStorageSync("shopLocationName",this.currentStore.ShopName),o.setStorageSync("shopNo",this.currentStore.ShopNo))}}};function l(o,e){e.shopNo?(e.isShopNum=!0,e.getObj()):(e.getArea(),e.isShopNum=!1)}e.default=u}).call(this,t("543d")["default"])},4966:function(o,e,t){"use strict";(function(o){t("b895");n(t("66fd"));var e=n(t("ec30"));function n(o){return o&&o.__esModule?o:{default:o}}o(e.default)}).call(this,t("543d")["createPage"])},"6bde":function(o,e,t){},b766:function(o,e,t){"use strict";var n=t("6bde"),i=t.n(n);i.a},c8ab:function(o,e,t){"use strict";t.r(e);var n=t("2cc1"),i=t.n(n);for(var a in n)"default"!==a&&function(o){t.d(e,o,(function(){return n[o]}))}(a);e["default"]=i.a},ec30:function(o,e,t){"use strict";t.r(e);var n=t("17c8"),i=t("c8ab");for(var a in i)"default"!==a&&function(o){t.d(e,o,(function(){return i[o]}))}(a);t("b766");var r,c=t("f0c5"),s=Object(c["a"])(i["default"],n["b"],n["c"],!1,null,"75ab1e7f",null,!1,n["a"],r);e["default"]=s.exports}},[["4966","common/runtime","common/vendor"]]]);