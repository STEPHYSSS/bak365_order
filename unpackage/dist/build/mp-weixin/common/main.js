(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["common/main"],{1065:function(e,n,t){},"1a62":function(e,n,t){"use strict";var o=t("1065"),r=t.n(o);r.a},"8c13":function(e,n,t){"use strict";t.r(n);var o=t("fe3a"),r=t.n(o);for(var c in o)"default"!==c&&function(e){t.d(n,e,(function(){return o[e]}))}(c);n["default"]=r.a},9449:function(e,n,t){"use strict";t.r(n);var o=t("8c13");for(var r in o)"default"!==r&&function(e){t.d(n,e,(function(){return o[e]}))}(r);t("1a62");var c,u,a,i,l=t("f0c5"),f=Object(l["a"])(o["default"],c,u,!1,null,null,null,!1,a,i);n["default"]=f.exports},f8de:function(e,n,t){"use strict";(function(e,n){t("b895");var o=u(t("66fd")),r=u(t("9449")),c=u(t("5ea5"));function u(e){return e&&e.__esModule?e:{default:e}}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){l(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}o.default.config.productionTip=!1,o.default.prototype.$store=c.default,r.default.mpType="app";var f=function(){t.e("components/AutoComponents/rotationChart/index").then(function(){return resolve(t("585d"))}.bind(null,t)).catch(t.oe)},s=function(){t.e("components/AutoComponents/noticeBar/index").then(function(){return resolve(t("96fe"))}.bind(null,t)).catch(t.oe)},d=function(){t.e("components/AutoComponents/iconBox/index").then(function(){return resolve(t("c02c"))}.bind(null,t)).catch(t.oe)},p=function(){t.e("components/AutoComponents/goodsBox/index").then(function(){return resolve(t("5625"))}.bind(null,t)).catch(t.oe)},b=function(){t.e("components/AutoComponents/activeList/index").then(function(){return resolve(t("a95c"))}.bind(null,t)).catch(t.oe)},m=function(){t.e("components/AutoComponents/collage/index").then(function(){return resolve(t("f241"))}.bind(null,t)).catch(t.oe)};o.default.component("RotationChart",f),o.default.component("noticeBar",s),o.default.component("iconBox",d),o.default.component("goodsBox",p),o.default.component("activeList",b),o.default.component("collageList",m),o.default.prototype.$showLoads=function(n,t){0==n?e.showLoading({title:t||"加载中"}):e.hideLoading()};var v=new o.default(i({},r.default,{store:c.default}));n(v).$mount()}).call(this,t("543d")["default"],t("543d")["createApp"])},fe3a:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=t("bf5e"),r={onLaunch:function(n){if(n.query&&n.query.qrCode){var t=n.query.qrCode,r=(0,o.cutUrl)(t);this.globalData.isScanEnter=r}var c={},u=this;e.getProvider({service:"oauth",success:function(e){var n=e.provider[0];c="alipay"===n?my.getExtConfigSync():wx.getExtConfigSync(),c&&c.appID&&(u.globalData.appID=c.appID)}})},onShow:function(){},onHide:function(){},globalData:{appID:"",OpenID:"",requestUrl:"https://we.bak365.net/SmallProgramSaleOrder/Mobile/",itemColor:"#D82F37",tableNumber:"",shopNo:"",isPack:"",colorIndex:"1",colorIndexTwo:"2",isDraw:!1,provider:"",isScanEnter:!1}};n.default=r}).call(this,t("543d")["default"])}},[["f8de","common/runtime","common/vendor"]]]);