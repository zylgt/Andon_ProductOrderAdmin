(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-0c97"],{"1iHB":function(t,e,r){"use strict";var n=r("sy2F");r.n(n).a},"2nGb":function(t,e,r){"use strict";r.d(e,"b",function(){return a}),r.d(e,"f",function(){return o}),r.d(e,"a",function(){return i}),r.d(e,"e",function(){return l}),r.d(e,"c",function(){return u}),r.d(e,"g",function(){return c}),r.d(e,"d",function(){return d}),r.d(e,"h",function(){return s});var n=r("t3Un");function a(){return Object(n.a)({url:"/config/mall",method:"get"})}function o(t){return Object(n.a)({url:"/config/mall",method:"post",data:t})}function i(){return Object(n.a)({url:"/config/express",method:"get"})}function l(t){return Object(n.a)({url:"/config/express",method:"post",data:t})}function u(){return Object(n.a)({url:"/config/order",method:"get"})}function c(t){return Object(n.a)({url:"/config/order",method:"post",data:t})}function d(){return Object(n.a)({url:"/config/wx",method:"get"})}function s(t){return Object(n.a)({url:"/config/wx",method:"post",data:t})}},RpVo:function(t,e,r){"use strict";r.r(e);var n=r("2nGb"),a={name:"ConfigOrder",data:function(){return{dataForm:{litemall_order_unpaid:0,litemall_order_unconfirm:0,litemall_order_comment:0},rules:{litemall_order_unpaid:[{required:!0,message:"不能为空",trigger:"blur"}],litemall_order_unconfirm:[{required:!0,message:"不能为空",trigger:"blur"}],litemall_order_comment:[{required:!0,message:"不能为空",trigger:"blur"}]}}},created:function(){this.init()},methods:{init:function(){var t=this;Object(n.c)().then(function(e){t.dataForm=e.data.data})},cancel:function(){this.init()},update:function(){var t=this;this.$refs.dataForm.validate(function(e){if(!e)return!1;t.doUpdate()})},doUpdate:function(){var t=this;Object(n.g)(this.dataForm).then(function(e){t.$notify.success({title:"成功",message:"订单参数配置成功"})}).catch(function(e){t.$notify.error({title:"失败",message:e.data.errmsg})})}}},o=(r("1iHB"),r("KHd+")),i=Object(o.a)(a,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"app-container"},[r("el-form",{ref:"dataForm",attrs:{rules:t.rules,model:t.dataForm,"status-icon":"","label-width":"300px"}},[r("el-form-item",{attrs:{label:"用户下单后超时",prop:"litemall_order_unpaid"}},[r("el-input",{staticClass:"input-width",model:{value:t.dataForm.litemall_order_unpaid,callback:function(e){t.$set(t.dataForm,"litemall_order_unpaid",e)},expression:"dataForm.litemall_order_unpaid"}},[r("template",{slot:"append"},[t._v("分钟")])],2),t._v(" "),r("span",{staticClass:"info"},[t._v("用户未付款，则订单自动取消")])],1),t._v(" "),r("el-form-item",{attrs:{label:"订单发货后超期",prop:"litemall_order_unconfirm"}},[r("el-input",{staticClass:"input-width",model:{value:t.dataForm.litemall_order_unconfirm,callback:function(e){t.$set(t.dataForm,"litemall_order_unconfirm",e)},expression:"dataForm.litemall_order_unconfirm"}},[r("template",{slot:"append"},[t._v(" 天")])],2),t._v(" "),r("span",{staticClass:"info"},[t._v("未确认收货，则订单自动确认收货")])],1),t._v(" "),r("el-form-item",{attrs:{label:"确认收货后超期",prop:"litemall_order_comment"}},[r("el-input",{staticClass:"input-width",model:{value:t.dataForm.litemall_order_comment,callback:function(e){t.$set(t.dataForm,"litemall_order_comment",e)},expression:"dataForm.litemall_order_comment"}},[r("template",{slot:"append"},[t._v("天")])],2),t._v(" "),r("span",{staticClass:"info"},[t._v("未评价商品，则取消评价资格")])],1),t._v(" "),r("el-form-item",[r("el-button",{on:{click:t.cancel}},[t._v("取消")]),t._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:t.update}},[t._v("确定")])],1)],1)],1)},[],!1,null,"40c4517e",null);i.options.__file="order.vue";e.default=i.exports},sy2F:function(t,e,r){}}]);