(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/AutoComponents/iconBox/index"],{"2c2c":function(t,n,e){"use strict";e.r(n);var i=e("a700"),o=e.n(i);for(var a in i)"default"!==a&&function(t){e.d(n,t,(function(){return i[t]}))}(a);n["default"]=o.a},"3fa0":function(t,n,e){"use strict";var i,o=function(){var t=this,n=t.$createElement;t._self._c},a=[];e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return a})),e.d(n,"a",(function(){return i}))},"551e":function(t,n,e){"use strict";var i=e("6ae9"),o=e.n(i);o.a},"6ae9":function(t,n,e){},a700:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={props:{propsData:{type:Object,default:function(){return{HtmlInfo:[]}}}},data:function(){return{boxWidth:"",imgWidth:""}},created:function(){},mounted:function(){this.boxWidth=this.propsData.HtmlInfo.length>4?"25":parseInt(100/this.propsData.HtmlInfo.length)},methods:{clickMyCoupon:function(n){"/pages/indexVip/index"===n||"/pages/indexCanteen/index"===n||"/pages/indexOrder/oderList/index"===n?t.switchTab({url:n}):t.navigateTo({url:n})},loadImg:function(n){var e=t.getSystemInfoSync().windowWidth,i=this.boxWidth/100*(e-20)-3;this.imgWidth=i}}};n.default=e}).call(this,e("543d")["default"])},c02c:function(t,n,e){"use strict";e.r(n);var i=e("3fa0"),o=e("2c2c");for(var a in o)"default"!==a&&function(t){e.d(n,t,(function(){return o[t]}))}(a);e("551e");var u,c=e("f0c5"),r=Object(c["a"])(o["default"],i["b"],i["c"],!1,null,"2889a7f5",null,!1,i["a"],u);n["default"]=r.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/AutoComponents/iconBox/index-create-component',
    {
        'components/AutoComponents/iconBox/index-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("c02c"))
        })
    },
    [['components/AutoComponents/iconBox/index-create-component']]
]);
