(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/indexCanteen/areaList/qqmapSearch"],{"036d":function(t,e,n){},"20e1":function(t,e,n){"use strict";var a,i=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return a}))},"2b72":function(t,e,n){"use strict";n.r(e);var a=n("70a8"),i=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=i.a},"70a8":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("3955"));function i(t){return t&&t.__esModule?t:{default:t}}var o=getApp(),r=n("a0b8"),c={data:function(){return{suggestion:[],backfillVal:"",region:"",timer:null,provider:o.globalData.provider,currentLocation:{},valueInput:""}},methods:{backfill:function(e){for(var n=e,a=0;a<this.suggestion.length;a++)a==n&&(this.backfillVal=this.suggestion[a].title,t.setStorageSync("currentQQMap",this.suggestion[a]),t.navigateBack())},nearby_search:function(e,n){var i=this,o=n?e:e.detail.value;o||(o="武汉");var r=this;try{"weixin"===this.provider?this.qqmapsdk.search({keyword:o,page_size:20,region:r.region,success:function(t){for(var e=[],n=0;n<t.data.length;n++)e.push({title:t.data[n].title,addr:t.data[n].address,latitude:t.data[n].location.lat,longitude:t.data[n].location.lng});r.suggestion=e},fail:function(e){t.showToast({title:e.message+"fail",icon:"none"})},complete:function(t){}}):a.default.api("MapSearch.aspx",{SearchValue:o,Latitude:this.currentLocation?this.currentLocation.latitude:"",Longitude:this.currentLocation?this.currentLocation.longitude:""}).then((function(t){for(var e=[],n=0;n<t.SearchInfo.length;n++)e.push({title:t.SearchInfo[n].Title,addr:t.SearchInfo[n].Address,latitude:t.SearchInfo[n].Lat,longitude:t.SearchInfo[n].Lng});i.suggestion=e})).catch((function(e){console.log(e,"ee"),t.showToast({title:e,icon:"none"})}))}catch(e){t.showToast({title:e+"catch",icon:"none"})}},getsuggest:function(e,n){try{var a=n?e:e.detail.value;a||(a="武汉");var i=this;this.qqmapsdk.getSuggestion({keyword:a,region:i.region,page_size:20,success:function(t){for(var e=[],n=0;n<t.data.length;n++)e.push({title:t.data[n].title,id:t.data[n].id,addr:t.data[n].address,city:t.data[n].city,district:t.data[n].district,latitude:t.data[n].location.lat,longitude:t.data[n].location.lng});i.suggestion=e},fail:function(e){t.showToast({title:e,icon:"none"})},complete:function(t){console.log(t)}})}catch(e){t.showToast({title:e,icon:"none"})}}},onShow:function(){},onLoad:function(e){var n=this,a=t.getStorageSync("location"),i=t.getStorageSync("shopLocation"),c="";if("weixin"===this.provider){this.qqmapsdk=new r({key:"Q6OBZ-JYOED-PDJ4H-HUBOE-VYC3V-6GBLD"}),c=a.latitude?a.latitude+","+a.longitude:i.latitude+","+i.longitude;var s=this;this.qqmapsdk.reverseGeocoder({location:c,success:function(t){s.region=t.result.address_component.city;var e=t.result.address_component.street||t.result.address_component.province;s.nearby_search(e,!0)},fail:function(t){s.nearby_search("",!0)}})}else{a.latitude?this.currentLocation=a:this.currentLocation=i;var u=t.getStorageSync("shopLocationName")||"";o.globalData.openID?this.nearby_search(u,!0):this.$store.dispatch("Login").then((function(t){n.nearby_search(u,!0)}))}}};e.default=c}).call(this,n("543d")["default"])},"877b":function(t,e,n){"use strict";var a=n("036d"),i=n.n(a);i.a},"8ffb":function(t,e,n){"use strict";n.r(e);var a=n("20e1"),i=n("2b72");for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);n("877b");var r,c=n("f0c5"),s=Object(c["a"])(i["default"],a["b"],a["c"],!1,null,"96a35680",null,!1,a["a"],r);e["default"]=s.exports},ed18:function(t,e,n){"use strict";(function(t){n("b895");a(n("66fd"));var e=a(n("8ffb"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])}},[["ed18","common/runtime","common/vendor"]]]);