(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components_uni/uni-goods-nav/uni-goods-nav"],{"15cf":function(n,t,o){"use strict";o.r(t);var e=o("44da"),u=o("f0b4");for(var c in u)"default"!==c&&function(n){o.d(t,n,(function(){return u[n]}))}(c);o("7bbe");var i,r=o("f0c5"),f=Object(r["a"])(u["default"],e["b"],e["c"],!1,null,"45d127be",null,!1,e["a"],i);t["default"]=f.exports},"44da":function(n,t,o){"use strict";var e,u=function(){var n=this,t=n.$createElement;n._self._c},c=[];o.d(t,"b",(function(){return u})),o.d(t,"c",(function(){return c})),o.d(t,"a",(function(){return e}))},7087:function(n,t,o){},"7bbe":function(n,t,o){"use strict";var e=o("7087"),u=o.n(e);u.a},"9d96":function(n,t,o){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e=function(){Promise.all([o.e("common/vendor"),o.e("components_uni/uni-icons/uni-icons")]).then(function(){return resolve(o("a398"))}.bind(null,o)).catch(o.oe)},u={name:"UniGoodsNav",components:{uniIcons:e},props:{options:{type:Array,default:function(){return[{icon:"shop",text:"店铺"},{icon:"cart",text:"购物车"}]}},buttonGroup:{type:Array,default:function(){return[{text:"加入购物车",backgroundColor:"#ffa200",color:"#fff"},{text:"立即购买",backgroundColor:"#ff0000",color:"#fff"}]}},fill:{type:Boolean,default:!1}},methods:{onClick:function(n,t){this.$emit("click",{index:n,content:t})},buttonClick:function(t,o){n.report&&n.report(o.text,o.text),this.$emit("buttonClick",{index:t,content:o})}}};t.default=u}).call(this,o("543d")["default"])},f0b4:function(n,t,o){"use strict";o.r(t);var e=o("9d96"),u=o.n(e);for(var c in e)"default"!==c&&function(n){o.d(t,n,(function(){return e[n]}))}(c);t["default"]=u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components_uni/uni-goods-nav/uni-goods-nav-create-component',
    {
        'components_uni/uni-goods-nav/uni-goods-nav-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("15cf"))
        })
    },
    [['components_uni/uni-goods-nav/uni-goods-nav-create-component']]
]);